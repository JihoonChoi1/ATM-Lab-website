import * as OTPAuth from "otpauth";

// Phase 6-3: TOTP (RFC 6238) helpers for 2FA. otpauth is zero-dependency and
// TS-native, which keeps the dual deployment (Vercel + 학교 Ubuntu) simple.
//
// Parameters match what authenticator apps (Google Authenticator, etc.) expect
// by default: SHA1, 6 digits, 30s period. Don't change these without re-enrolling
// every account — the secret + these params together define the code stream.

const ISSUER = "ATM Lab";
const ALGORITHM = "SHA1";
const DIGITS = 6;
const PERIOD = 30;

// Verification window: accept the current step ±1 (≈ ±30s) to tolerate clock
// skew between the server and the user's phone. Standard, low-risk.
const VERIFY_WINDOW = 1;

function buildTotp(email: string, secret: string): OTPAuth.TOTP {
  return new OTPAuth.TOTP({
    issuer: ISSUER,
    label: email,
    algorithm: ALGORITHM,
    digits: DIGITS,
    period: PERIOD,
    secret: OTPAuth.Secret.fromBase32(secret),
  });
}

/** Generate a fresh base32 TOTP secret (160-bit) to store on the User row. */
export function generateTotpSecret(): string {
  return new OTPAuth.Secret({ size: 20 }).base32;
}

/**
 * Build the `otpauth://` URI that an authenticator app scans to enroll.
 * Render it as a QR code where the secret is shown to the user (the enrollment
 * page) — never expose this for an already-enrolled account.
 */
export function buildTotpUri(email: string, secret: string): string {
  return buildTotp(email, secret).toString();
}

/** Verify a 6-digit code against a stored secret (±1 step for clock skew). */
export function verifyTotp(token: string, secret: string): boolean {
  const code = token.replace(/\s/g, "");
  if (!/^\d{6}$/.test(code)) return false;
  return buildTotp("", secret).validate({ token: code, window: VERIFY_WINDOW }) !== null;
}
