import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import MembersTable from "./_components/MembersTable";

export const metadata: Metadata = { title: "Members 관리 · ATM Lab" };

// Reads the session cookie + live rows → never cache.
export const dynamic = "force-dynamic";

export default async function AdminMembersPage() {
  await requireAdmin("/admin/members");

  const members = await prisma.member.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      role: true,
      position: true,
      email: true,
      year: true,
      published: true,
    },
  });

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.02em]">Members</h1>
          <p className="mt-1 text-sm text-ink-3">
            멤버 {members.length}명 — 공개 /members 페이지와 같은 순서입니다.
          </p>
        </div>
        <Link
          href="/admin/members/new"
          className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
        >
          새 멤버 추가
        </Link>
      </div>
      <MembersTable members={members} />
    </div>
  );
}
