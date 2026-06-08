import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { verifyTotp } from "@/lib/auth/totp";
import type { UserRole } from "@/app/generated/prisma/client";

// Phase 6-3: the single authoritative credential validator. Both auth.ts's
// `authorize()` (the token-minting security boundary) and the login Server Action
// (which drives the two-step UX) call this — one place defines what "valid" means.

// Pre-computed bcrypt hash (cost 12) of a throwaway string. When the email isn't
// found we still run one bcrypt.compare against this, so response time doesn't
// reveal whether the account exists (user-enumeration / timing defense).
const DUMMY_PASSWORD_HASH =
  "$2b$12$r/sdSXCkMZB0BkwiHvvGleMdhqRmlYVU3Deoy4jaC6MjpXx7cxHsC";

export type AuthedUser = { id: string; email: string; role: UserRole };

export type AuthResult =
  | { ok: true; user: AuthedUser }
  | { ok: false; reason: "credentials" } // bad email/password — stay generic
  | { ok: false; reason: "totp_required" } // password ok, account has 2FA, no code yet
  | { ok: false; reason: "totp_invalid" }; // password ok, code wrong/expired

/**
 * Verify email + password, then (only if the account enrolled 2FA) the TOTP code.
 * `code` is optional: omit it for the first step of the two-step login so a 2FA
 * account returns `totp_required` instead of failing.
 */
export async function authenticate(
  email: string,
  password: string,
  code?: string,
): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always run a compare (real hash, or the dummy) to equalize timing.
  const validPassword = await verifyPassword(
    password,
    user?.passwordHash ?? DUMMY_PASSWORD_HASH,
  );

  // Generic failure — never reveal which of email/password was wrong.
  if (!user || !validPassword) return { ok: false, reason: "credentials" };

  // No 2FA enrolled → password alone is sufficient.
  if (!user.totpSecret) {
    return { ok: true, user: { id: user.id, email: user.email, role: user.role } };
  }

  // 2FA enrolled: require a valid code.
  if (!code) return { ok: false, reason: "totp_required" };
  if (!verifyTotp(code, user.totpSecret)) return { ok: false, reason: "totp_invalid" };

  return { ok: true, user: { id: user.id, email: user.email, role: user.role } };
}
