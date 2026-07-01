import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getClientIp } from "@/lib/auth/rate-limit";
import { visitorIdFor } from "@/lib/analytics/visitor";

// Phase 12-A: fire-and-forget unique-visitor recorder. Node runtime (not Edge) —
// the middleware matcher already skips /api, so no CSP/nonce and a real Postgres
// connection are both fine here. The client (VisitorTracker) ignores the
// response, so we always answer 204 fast and never surface DB errors to visitors.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Obvious automated clients. We only have the UA to go on (no IP allowlists), so
// match the common crawler/bot tokens and drop those hits.
const BOT_UA = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkshare|w3c_validator|headless|lighthouse|monitor|preview|fetch|curl|wget|python-requests|axios|node-fetch/i;

export async function POST() {
  const h = headers();
  const ua = h.get("user-agent") ?? "";

  // No UA at all, or an obvious bot → skip. Real browsers always send a UA.
  if (!ua || BOT_UA.test(ua)) {
    return new NextResponse(null, { status: 204 });
  }

  const ip = getClientIp();
  const visitorId = visitorIdFor(ip, ua);

  try {
    // Insert with the DB's own now() — NOT Prisma's @default(now()), which the
    // client engine resolves to a JS Date; the PrismaPg adapter sends it without a
    // tz, so Postgres reinterprets it in the session timezone and shifts the stored
    // instant whenever the session isn't UTC (e.g. −9h on an Asia/Seoul session).
    // ON CONFLICT mirrors skipDuplicates against the unique visitorId → one atomic
    // row per visitor per day, no read-then-write race under concurrent loads.
    await prisma.$executeRaw`
      INSERT INTO "PageView" ("id", "visitorId", "createdAt")
      VALUES (${randomUUID()}, ${visitorId}, now())
      ON CONFLICT ("visitorId") DO NOTHING
    `;
  } catch {
    // Best-effort analytics — a write failure must never break page loads.
  }

  return new NextResponse(null, { status: 204 });
}
