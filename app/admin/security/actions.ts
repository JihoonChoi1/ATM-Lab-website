"use server";

import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { verifyTotp } from "@/lib/auth/totp";
import { getClientIp } from "@/lib/auth/rate-limit";
import { logAudit } from "@/lib/audit";

// Phase 6-3: self-service 2FA enrollment. The pending secret rides in the form
// (it's the same value the QR already exposes), so we don't persist it until the
// user proves they scanned it by entering a current code.

export type EnableState = { error?: string };

export async function enableTotp(
  _prev: EnableState,
  formData: FormData,
): Promise<EnableState> {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin/security");

  const secret = String(formData.get("secret") ?? "");
  const code = String(formData.get("code") ?? "").trim();

  if (!secret) return { error: "보안 설정을 다시 불러와 주세요." };
  if (!verifyTotp(code, secret))
    return { error: "코드가 올바르지 않습니다. 인증 앱의 현재 코드를 입력하세요." };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { totpSecret: secret },
  });

  // Phase 6-8: audit the enrolment. Never log the secret — { ip } only.
  await logAudit({
    userId: session.user.id,
    action: "ENABLE_2FA",
    entity: "User",
    entityId: session.user.id,
    data: { ip: getClientIp() },
  });

  redirect("/admin/security?enabled=1");
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}
