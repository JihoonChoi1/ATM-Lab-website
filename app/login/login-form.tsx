"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = { step: "password", email: "" };

// React 18 + Next 14: form state via react-dom's useFormState (not React 19's
// useActionState). Email/password are uncontrolled — React preserves their typed
// values across the action re-render, so the second (code) submit keeps the creds.

const inputClass =
  "w-full rounded-2xl border border-line bg-surface px-4 py-3 text-base text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:bg-bg disabled:text-ink-3";
const labelClass = "mb-1.5 block text-sm font-medium text-ink-2";

function SubmitButton({ step }: { step: LoginState["step"] }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-2xl bg-accent px-4 py-3 text-base font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
    >
      {pending ? "확인 중…" : step === "totp" ? "코드 확인 후 로그인" : "로그인"}
    </button>
  );
}

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction] = useFormState(loginAction, initialState);
  const showCode = state.step === "totp";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div>
        <label htmlFor="email" className={labelClass}>
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          defaultValue={state.email}
          readOnly={showCode}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          readOnly={showCode}
          className={inputClass}
        />
      </div>

      {showCode && (
        <div>
          <label htmlFor="code" className={labelClass}>
            인증 앱 6자리 코드
          </label>
          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{6}"
            maxLength={6}
            required
            autoFocus
            className={`${inputClass} tracking-[0.4em]`}
          />
        </div>
      )}

      {state.error && (
        <p className="rounded-2xl bg-ajou-yellow/10 px-4 py-2.5 text-sm text-ajou-yellow">
          {state.error}
        </p>
      )}

      <SubmitButton step={state.step} />
    </form>
  );
}
