"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { authenticate } from "@/lib/auth/authenticate";
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

  const result = await authenticate(email, password, code || undefined);

  if (!result.ok) {
    if (result.reason === "totp_required") return { step: "totp", email };
    if (result.reason === "totp_invalid")
      return { step: "totp", email, error: "코드가 올바르지 않습니다. 다시 시도하세요." };
    return {
      step: "password",
      email,
      error: "이메일 또는 비밀번호가 올바르지 않습니다.",
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
        error: "코드가 만료되었습니다. 새 코드로 다시 시도하세요.",
      };
    }
    throw err;
  }

  redirect(callbackUrl);
}
