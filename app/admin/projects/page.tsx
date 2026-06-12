import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import ProjectsTable from "./_components/ProjectsTable";

export const metadata: Metadata = { title: "Projects 관리 · ATM Lab" };

// Reads the session cookie + live rows → never cache.
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  await requireAdmin("/admin/projects");

  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      institution: true,
      period: true,
      status: true,
      published: true,
    },
  });

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.02em]">Projects</h1>
          <p className="mt-1 text-sm text-ink-3">
            프로젝트 {projects.length}건 — 공개 /projects 페이지와 같은 순서입니다.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-2xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
        >
          새 프로젝트 추가
        </Link>
      </div>
      <ProjectsTable projects={projects} />
    </div>
  );
}
