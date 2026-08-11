"use client";

import { useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "./actions";

type DemoCredentials = { email: string; password: string };

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
      {pending ? "Signing in…" : step === "totp" ? "Verify & sign in" : "Sign in"}
    </button>
  );
}

export default function LoginForm({
  callbackUrl,
  demo,
}: {
  callbackUrl: string;
  demo: DemoCredentials | null;
}) {
  const [state, formAction] = useFormState(loginAction, initialState);
  const showCode = state.step === "totp";

  // Demo autofill writes straight to the uncontrolled inputs via refs.
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const fillDemo = () => {
    if (!demo) return;
    if (emailRef.current) emailRef.current.value = demo.email;
    if (passwordRef.current) passwordRef.current.value = demo.password;
    passwordRef.current?.focus();
  };

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {demo && (
        <div className="rounded-2xl border border-accent/25 bg-accent-soft px-4 py-3.5">
          <p className="text-sm font-semibold text-accent-dark">Demo account</p>
          <p className="mt-0.5 text-[13px] text-ink-2">
            Explore the admin CMS with this shared demo login.
          </p>
          <dl className="mt-2.5 grid grid-cols-[76px_1fr] gap-y-1 text-[13px]">
            <dt className="text-ink-3">Email</dt>
            <dd className="break-all font-mono text-ink">{demo.email}</dd>
            <dt className="text-ink-3">Password</dt>
            <dd className="break-all font-mono text-ink">{demo.password}</dd>
          </dl>
          <button
            type="button"
            onClick={fillDemo}
            className="mt-3 rounded-xl bg-accent px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-accent-dark"
          >
            Fill demo credentials
          </button>
        </div>
      )}

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          ref={emailRef}
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
          Password
        </label>
        <input
          ref={passwordRef}
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
            6-digit authenticator code
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
