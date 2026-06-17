"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { getClientIp } from "@/lib/auth/rate-limit";
import { diffChanges, logAudit } from "@/lib/audit";
import { sanitizeRichText } from "@/lib/sanitize-rich-text";
import { newsSchema } from "./schema";

// Phase 7-6: News CRUD — the 7-4 pattern without move: the public order is
// computed (date desc) and the display number is positional (pad2 on the
// board), so there is nothing to curate and nothing to renumber. `order` is
// never written (new rows take the Prisma default 0 — News pages ignore it).
// Every action re-guards with requireAdmin (Server Actions are their own
// entry points) and audits on success with label = title. CSRF is covered by
// Next's Server Action origin check (verified in 6-6); no revalidatePath —
// every page is force-dynamic.

export type NewsFormState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

function parseForm(formData: FormData) {
  return newsSchema.safeParse({
    date: String(formData.get("date") ?? ""),
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    published: formData.get("published") === "on",
  });
}

export async function createNews(
  _prev: NewsFormState,
  formData: FormData,
): Promise<NewsFormState> {
  const session = await requireAdmin("/admin/news/new");

  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  // Force the body to the closed allowlist before it reaches the DB (the editor
  // limit is client-side only). Empty/tag-only HTML collapses back to null.
  const data = { ...parsed.data, content: sanitizeRichText(parsed.data.content) };
  const news = await prisma.news.create({ data });

  await logAudit({
    userId: session.user.id,
    action: "CREATE",
    entity: "News",
    entityId: news.id,
    data: { ip: getClientIp(), label: news.title },
  });

  redirect("/admin/news");
}

export async function updateNews(
  id: string,
  _prev: NewsFormState,
  formData: FormData,
): Promise<NewsFormState> {
  const session = await requireAdmin(`/admin/news/${id}`);

  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) return { message: "소식을 찾을 수 없습니다. 목록에서 다시 시도하세요." };

  const parsed = parseForm(formData);
  if (!parsed.success) return { errors: z.flattenError(parsed.error).fieldErrors };

  // Writes only the form-managed columns — the diff below records changed
  // fields only, so the ~6KB content blob is stored just when it changes.
  // Sanitize to the closed allowlist first (also lazy-normalizes a legacy body
  // re-saved through the editor — recorded as a content diff, as intended).
  const data = { ...parsed.data, content: sanitizeRichText(parsed.data.content) };
  await prisma.news.update({ where: { id }, data });

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "News",
    entityId: id,
    data: { ip: getClientIp(), label: data.title, ...diffChanges(existing, data) },
  });

  redirect("/admin/news");
}

export async function deleteNews(id: string): Promise<void> {
  const session = await requireAdmin("/admin/news");

  const news = await prisma.news.findUnique({ where: { id } });
  if (!news) return;

  await prisma.news.delete({ where: { id } });

  // Full-row snapshot: a hard delete has no other way back (90-day retention).
  // JSON round-trip turns Dates into ISO strings for the Json column.
  await logAudit({
    userId: session.user.id,
    action: "DELETE",
    entity: "News",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: news.title,
      snapshot: JSON.parse(JSON.stringify(news)),
    },
  });
}

export async function toggleNewsPublished(id: string): Promise<void> {
  const session = await requireAdmin("/admin/news");

  const news = await prisma.news.findUnique({
    where: { id },
    select: { title: true, published: true },
  });
  if (!news) return;

  await prisma.news.update({
    where: { id },
    data: { published: !news.published },
  });

  await logAudit({
    userId: session.user.id,
    action: "UPDATE",
    entity: "News",
    entityId: id,
    data: {
      ip: getClientIp(),
      label: news.title,
      before: { published: news.published },
      after: { published: !news.published },
    },
  });
}
