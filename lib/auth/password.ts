import bcrypt from "bcryptjs";

// bcrypt cost factor. 12 balances brute-force resistance against login latency
// on 2025-era hardware. bcryptjs (pure JS) avoids native-build issues across the
// dual deployment (Vercel + 학교 Ubuntu 서버).
const COST_FACTOR = 12;

/** Hash a plaintext password with bcrypt (cost 12). */
export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, COST_FACTOR);
}

/** Compare a plaintext password against a stored bcrypt hash. */
export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export type PasswordStrength = { ok: boolean; errors: string[] };

/**
 * Enforce the password policy: at least 12 characters plus character-class
 * complexity (lowercase, uppercase, digit, symbol).
 *
 * Applied only when a password is *set* — the admin seed (6-9) and any future
 * change-password flow — never at login. login authorize() just compares hashes.
 */
export function validatePasswordStrength(plain: string): PasswordStrength {
  const errors: string[] = [];
  if (plain.length < 12) errors.push("비밀번호는 최소 12자 이상이어야 합니다.");
  if (!/[a-z]/.test(plain)) errors.push("소문자를 최소 1자 포함해야 합니다.");
  if (!/[A-Z]/.test(plain)) errors.push("대문자를 최소 1자 포함해야 합니다.");
  if (!/[0-9]/.test(plain)) errors.push("숫자를 최소 1자 포함해야 합니다.");
  if (!/[^A-Za-z0-9]/.test(plain)) errors.push("특수문자를 최소 1자 포함해야 합니다.");
  return { ok: errors.length === 0, errors };
}
