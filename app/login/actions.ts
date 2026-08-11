"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { authenticate } from "@/lib/auth/authenticate";
import { getClientIp, isRateLimited, recordFailedAttempt } from "@/lib/auth/rate-limit";
import { safeCallbackUrl } from "./callback-url";

// Phase 6-3: two-step login. authenticate() decides the step/error for the UI;
// once everything checks out we mint the session through Auth.js signIn (which
// re-validates in authorize — the action's pre-check is for UX, not trust).

export type LoginState = {
  step: "password" | "totp";
  email: string;
  error?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const code = String(formData.get("code") ?? "").trim();
  const callbackUrl = safeCallbackUrl(formData.get("callbackUrl"), "/admin/security");

  // Phase 6-4: block before bcrypt so the form surfaces a "try later" message.
  // The same check runs in authorize() to cover the raw-endpoint path.
  const ip = getClientIp();
  if (await isRateLimited(ip)) {
    return {
      step: "password",
      email,
      error: "Too many login attempts. Please try again in 15 minutes.",
    };
  }

  const result = await authenticate(email, password, code || undefined);

  if (!result.ok) {
    // Record real failures (success-clear is handled in authorize on the happy path).
    if (result.reason === "credentials" || result.reason === "totp_invalid") {
      await recordFailedAttempt(ip);
    }
    if (result.reason === "totp_required") return { step: "totp", email };
    if (result.reason === "totp_invalid")
      return { step: "totp", email, error: "That code isn't correct. Please try again." };
    return {
      step: "password",
      email,
      error: "Incorrect email or password.",
    };
  }

  // Fully validated → mint the session. authorize() re-runs the same check.
  try {
    await signIn("credentials", { email, password, code, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) {
      // Rare race: the TOTP step rolled over between pre-check and mint.
      return {
        step: "totp",
        email,
        error: "That code has expired. Please try again with a new one.",
      };
    }
    throw err;
  }

  redirect(callbackUrl);
}
