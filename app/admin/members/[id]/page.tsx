import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import MemberForm from "../_components/MemberForm";

export const metadata: Metadata = { title: "멤버 수정 · ATM Lab" };

// Reads the session cookie + a live row → never cache.
export const dynamic = "force-dynamic";

export default async function EditMemberPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin(`/admin/members/${params.id}`);

  const member = await prisma.member.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      role: true,
      position: true,
      email: true,
      year: true,
      degree: true,
      currentPosition: true,
      interests: true,
      imgPath: true,
      published: true,
    },
  });
  // Stale link (row already deleted) → back to the list, not a global 404.
  if (!member) redirect("/admin/members");

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">멤버 수정</h1>
        <p className="mt-1 text-sm text-ink-3">{member.name}</p>
      </div>
      <MemberForm member={member} />
    </div>
  );
}
