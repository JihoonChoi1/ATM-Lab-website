import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { uploadsEnabled } from "@/lib/uploads";
import NewsForm from "../_components/NewsForm";

export const metadata: Metadata = { title: "소식 수정 · ATM Lab" };

// Reads the session cookie + a live row → never cache.
export const dynamic = "force-dynamic";

export default async function EditNewsPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin(`/admin/news/${params.id}`);

  const news = await prisma.news.findUnique({
    where: { id: params.id },
    select: { id: true, date: true, title: true, content: true, published: true },
  });
  // Stale link (row already deleted) → back to the list, not a global 404.
  if (!news) redirect("/admin/news");

  return (
    <div className="mx-auto w-full max-w-[920px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">소식 수정</h1>
        <p className="mt-1 text-sm text-ink-3">{news.title}</p>
      </div>
      <NewsForm
        news={{ ...news, date: news.date.toISOString().slice(0, 10) }}
        uploadsEnabled={uploadsEnabled()}
      />
    </div>
  );
}
