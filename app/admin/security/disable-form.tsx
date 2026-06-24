"use client";

import { useFormState, useFormStatus } from "react-dom";
import { disableTotp, type DisableState } from "./actions";

const initialState: DisableState = {};

// Disable form: confirms the current password before clearing the stored secret.
// Password (not a TOTP code) so a lost-device user can still turn 2FA off here.

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl border border-ajou-yellow/40 bg-ajou-yellow/10 px-4 py-3 text-base font-semibold text-ajou-yellow transition hover:bg-ajou-yellow/20 disabled:opacity-60"
    >
      {pending ? "끄는 중…" : "2단계 인증 끄기"}
    </button>
  );
}

export default function DisableTotpForm() {
  const [state, formAction] = useFormState(disableTotp, initialState);

  return (
    <form action={formAction} className="mt-5 flex flex-col gap-4 border-t border-line pt-5">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink-2">
          끄려면 현재 비밀번호 확인
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-2xl border border-line bg-surface px-4 py-3 text-base text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {state.error && (
        <p className="rounded-2xl bg-ajou-yellow/10 px-4 py-2.5 text-sm text-ajou-yellow">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
