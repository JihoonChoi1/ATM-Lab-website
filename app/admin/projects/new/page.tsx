import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guard";
import ProjectForm from "../_components/ProjectForm";

export const metadata: Metadata = { title: "New project · ATM Lab" };

// Reads the session cookie → never cache.
export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  await requireAdmin("/admin/projects/new");

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">New project</h1>
        <p className="mt-1 text-sm text-ink-3">
          Changes appear on the public /projects page immediately after saving.
        </p>
      </div>
      <ProjectForm />
    </div>
  );
}
