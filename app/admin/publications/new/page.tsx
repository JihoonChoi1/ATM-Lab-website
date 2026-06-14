import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guard";
import { uploadsEnabled } from "@/lib/uploads";
import PublicationForm from "../_components/PublicationForm";

export const metadata: Metadata = { title: "새 게재물 · ATM Lab" };

// Reads the session cookie → never cache.
export const dynamic = "force-dynamic";

export default async function NewPublicationPage() {
  await requireAdmin("/admin/publications/new");

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">새 게재물</h1>
        <p className="mt-1 text-sm text-ink-3">
          저장하면 공개 /publications 페이지에 바로 반영됩니다.
        </p>
      </div>
      <PublicationForm uploadsEnabled={uploadsEnabled()} />
    </div>
  );
}
