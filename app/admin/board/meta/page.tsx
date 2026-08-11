import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import HeroMetaForm from "@/app/admin/_components/HeroMetaForm";
import ScrollTopOnMount from "@/app/admin/_components/ScrollTopOnMount";
import { PAGE_HERO_DEFAULTS } from "@/lib/page-hero-defaults";
import { updatePageMeta } from "../actions";

export const metadata: Metadata = { title: "Board page meta · ATM Lab" };

// Reads the session cookie + the singleton row → never cache.
export const dynamic = "force-dynamic";

export default async function BoardMetaPage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  await requireAdmin("/admin/board/meta");

  const meta = await prisma.boardPageMeta.findFirst();
  const defaults = PAGE_HERO_DEFAULTS.board;

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">Board page meta</h1>
        <p className="mt-1 text-sm text-ink-3">
          The hero heading and intro paragraph at the top of the public /board page.
        </p>
      </div>

      {searchParams.saved && (
        <>
          <ScrollTopOnMount />
          <p className="mb-6 rounded-2xl bg-success-soft px-4 py-2.5 text-sm text-success">
            Your changes have been saved.
          </p>
        </>
      )}

      <HeroMetaForm
        action={updatePageMeta}
        defaults={{
          heroHeadline: meta?.heroHeadline ?? defaults.heroHeadline,
          heroParagraph: meta?.heroParagraph ?? defaults.heroParagraph,
        }}
        cancelHref="/admin/news"
      />
    </div>
  );
}
