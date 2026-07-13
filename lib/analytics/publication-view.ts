import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { getClientIp } from "@/lib/auth/rate-limit";
import type { PublicationType } from "@/app/generated/prisma/client";
import { BOT_UA, visitorIdFor } from "@/lib/analytics/visitor";

// record one publication-detail view, called from the (already force-dynamic)
// /publications/[id] server render. Root loading.tsx is what keeps this
// honest: Next's Link prefetch for dynamic routes stops at the first loading
// boundary, so a prefetch never executes the page component — only a real
// navigation does (verified against a production build: prefetch requests
// insert 0 rows; the title seen in the prefetch payload comes from
// generateMetadata, not the page).
export async function recordPublicationView(
  publicationId: string,
  type: PublicationType,
): Promise<void> {
  const ua = headers().get("user-agent") ?? "";

  // No UA at all, or an obvious bot → skip. Real browsers always send a UA.
  if (!ua || BOT_UA.test(ua)) return;

  const visitorId = visitorIdFor(getClientIp(), ua);

  try {
    // DB now() + ON CONFLICT DO NOTHING, for the same reasons as /api/track:
    // a Date param would be tz-shifted by the PrismaPg adapter on non-UTC
    // sessions, and the conflict clause makes "one row per visitor per
    // publication per day" atomic under concurrent loads.
    await prisma.$executeRaw`
      INSERT INTO "PublicationView" ("id", "publicationId", "type", "visitorId", "createdAt")
      VALUES (${randomUUID()}, ${publicationId}, ${type}::"PublicationType", ${visitorId}, now())
      ON CONFLICT ("visitorId", "publicationId") DO NOTHING
    `;
  } catch {
    // Best-effort analytics — a write failure must never break the page.
  }
}
