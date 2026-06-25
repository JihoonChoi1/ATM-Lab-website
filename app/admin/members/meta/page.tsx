import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import HeroMetaForm from "@/app/admin/_components/HeroMetaForm";
import ScrollTopOnMount from "@/app/admin/_components/ScrollTopOnMount";
import { PAGE_HERO_DEFAULTS } from "@/lib/page-hero-defaults";
import { updatePageMeta } from "../actions";

export const metadata: Metadata = { title: "Members 페이지 메타 · ATM Lab" };

// Reads the session cookie + the singleton row → never cache.
export const dynamic = "force-dynamic";

export default async function MembersMetaPage({
  searchParams,
}: {
  searchParams: { saved?: string };
}) {
  await requireAdmin("/admin/members/meta");

  const meta = await prisma.membersPageMeta.findFirst();
  const defaults = PAGE_HERO_DEFAULTS.members;

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">Members 페이지 메타</h1>
        <p className="mt-1 text-sm text-ink-3">
          공개 /members 상단의 Hero 제목과 소개 문단입니다.
        </p>
      </div>

      {searchParams.saved && (
        <>
          <ScrollTopOnMount />
          <p className="mb-6 rounded-2xl bg-success-soft px-4 py-2.5 text-sm text-success">
            변경 사항이 저장되었습니다.
          </p>
        </>
      )}

      <HeroMetaForm
        action={updatePageMeta}
        defaults={{
          heroHeadline: meta?.heroHeadline ?? defaults.heroHeadline,
          heroParagraph: meta?.heroParagraph ?? defaults.heroParagraph,
        }}
        cancelHref="/admin/members"
      />
    </div>
  );
}
