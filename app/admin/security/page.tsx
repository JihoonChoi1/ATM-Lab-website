import type { Metadata } from "next";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { generateTotpSecret, buildTotpUri } from "@/lib/auth/totp";
import EnableTotpForm from "./security-form";

export const metadata: Metadata = { title: "보안 설정 · ATM Lab" };

// Reads the session cookie + mints a fresh secret each visit → never cache.
export const dynamic = "force-dynamic";

export default async function SecurityPage({
  searchParams,
}: {
  searchParams: { enabled?: string };
}) {
  const session = await requireAdmin("/admin/security");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, totpSecret: true },
  });
  if (!user) redirect("/login?callbackUrl=/admin/security");

  const twoFactorOn = Boolean(user.totpSecret);

  // Only generate enrollment material when 2FA is off — never re-expose a secret.
  let secret = "";
  let qrDataUrl = "";
  if (!twoFactorOn) {
    secret = generateTotpSecret();
    qrDataUrl = await QRCode.toDataURL(buildTotpUri(user.email, secret), {
      margin: 1,
      width: 200,
    });
  }

  return (
    <div className="mx-auto w-full max-w-[480px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em]">보안 설정</h1>
        <p className="mt-1 text-sm text-ink-3">{user.email}</p>
      </div>

      {searchParams.enabled && (
        <p className="mb-6 rounded-2xl bg-success-soft px-4 py-2.5 text-sm text-success">
          2단계 인증이 켜졌습니다. 다음 로그인부터 코드가 필요합니다.
        </p>
      )}

      {twoFactorOn ? (
        <div className="rounded-3xl border border-line bg-surface p-6">
          <h2 className="text-lg font-semibold text-ink">2단계 인증 (2FA)</h2>
          <p className="mt-2 text-sm text-ink-2">
            <span className="font-medium text-success">활성화됨.</span> 로그인 시
            인증 앱의 6자리 코드가 필요합니다.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-line bg-surface p-6">
          <h2 className="mb-1 text-lg font-semibold text-ink">2단계 인증 (2FA) 켜기</h2>
          <p className="mb-5 text-sm text-ink-2">
            인증 앱으로 QR을 스캔한 뒤 표시되는 6자리 코드를 입력해 본인 인증을
            완료하면 2FA가 켜집니다.
          </p>
          <EnableTotpForm secret={secret} qrDataUrl={qrDataUrl} />
        </div>
      )}
    </div>
  );
}
