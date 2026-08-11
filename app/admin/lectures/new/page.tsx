import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guard";
import LectureForm from "../_components/LectureForm";

export const metadata: Metadata = { title: "New lecture · ATM Lab" };

// Reads the session cookie → never cache.
export const dynamic = "force-dynamic";

export default async function NewLecturePage() {
  await requireAdmin("/admin/lectures/new");

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">New lecture</h1>
        <p className="mt-1 text-sm text-ink-3">
          Changes appear on the public /lectures page immediately after saving.
        </p>
      </div>
      <LectureForm />
    </div>
  );
}
