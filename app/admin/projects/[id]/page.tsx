import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import ProjectForm from "../_components/ProjectForm";

export const metadata: Metadata = { title: "프로젝트 수정 · ATM Lab" };

// Reads the session cookie + a live row → never cache.
export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin(`/admin/projects/${params.id}`);

  const project = await prisma.project.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      institution: true,
      period: true,
      scale: true,
      status: true,
      published: true,
    },
  });
  // Stale link (row already deleted) → back to the list, not a global 404.
  if (!project) redirect("/admin/projects");

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">프로젝트 수정</h1>
        <p className="mt-1 text-sm text-ink-3">{project.title}</p>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}
