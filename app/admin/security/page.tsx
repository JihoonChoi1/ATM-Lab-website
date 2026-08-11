import type { Metadata } from "next";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { generateTotpSecret, buildTotpUri } from "@/lib/auth/totp";
import EnableTotpForm from "./security-form";
import DisableTotpForm from "./disable-form";

export const metadata: Metadata = { title: "Security · ATM Lab" };

// Reads the session cookie + mints a fresh secret each visit → never cache.
export const dynamic = "force-dynamic";

export default async function SecurityPage({
  searchParams,
}: {
  searchParams: { enabled?: string; disabled?: string };
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
        <h1 className="text-3xl font-bold tracking-[-0.02em]">Security</h1>
        <p className="mt-1 text-sm text-ink-3">{user.email}</p>
      </div>

      {searchParams.enabled && (
        <p className="mb-6 rounded-2xl bg-success-soft px-4 py-2.5 text-sm text-success">
          Two-factor authentication is on. A code is required from your next sign-in.
        </p>
      )}

      {searchParams.disabled && (
        <p className="mb-6 rounded-2xl bg-success-soft px-4 py-2.5 text-sm text-success">
          Two-factor authentication is off. You now sign in with just a password.
        </p>
      )}

      {twoFactorOn ? (
        <div className="rounded-3xl border border-line bg-surface p-6">
          <h2 className="text-lg font-semibold text-ink">Two-factor authentication (2FA)</h2>
          <p className="mt-2 text-sm text-ink-2">
            <span className="font-medium text-success">Enabled.</span> A 6-digit
            code from your authenticator app is required at sign-in.
          </p>
          <DisableTotpForm />
        </div>
      ) : (
        <div className="rounded-3xl border border-line bg-surface p-6">
          <h2 className="mb-1 text-lg font-semibold text-ink">Enable two-factor authentication (2FA)</h2>
          <p className="mb-5 text-sm text-ink-2">
            Scan the QR with an authenticator app, then enter the 6-digit code it
            shows to verify yourself and turn on 2FA.
          </p>
          <EnableTotpForm secret={secret} qrDataUrl={qrDataUrl} />
        </div>
      )}
    </div>
  );
}
