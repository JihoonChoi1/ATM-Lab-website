import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guard";
import { uploadsEnabled } from "@/lib/uploads";
import MemberForm from "../_components/MemberForm";

export const metadata: Metadata = { title: "New member · ATM Lab" };

// Reads the session cookie → never cache.
export const dynamic = "force-dynamic";

export default async function NewMemberPage() {
  await requireAdmin("/admin/members/new");

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">New member</h1>
        <p className="mt-1 text-sm text-ink-3">
          Changes appear on the public /members page immediately after saving.
        </p>
      </div>
      <MemberForm uploadsEnabled={uploadsEnabled()} />
    </div>
  );
}
