import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guard";
import { uploadsEnabled } from "@/lib/uploads";
import NewsForm from "../_components/NewsForm";

export const metadata: Metadata = { title: "New news post · ATM Lab" };

// Reads the session cookie → never cache.
export const dynamic = "force-dynamic";

export default async function NewNewsPage() {
  await requireAdmin("/admin/news/new");

  return (
    <div className="mx-auto w-full max-w-[920px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">New news post</h1>
        <p className="mt-1 text-sm text-ink-3">
          Changes appear on the public /board page immediately after saving.
        </p>
      </div>
      <NewsForm uploadsEnabled={uploadsEnabled()} />
    </div>
  );
}
