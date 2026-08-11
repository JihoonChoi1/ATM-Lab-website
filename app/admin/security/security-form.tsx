"use client";

import { useFormState, useFormStatus } from "react-dom";
import { enableTotp, type EnableState } from "./actions";

const initialState: EnableState = {};

// Enrollment form: shows the QR + manual secret, then verifies a code before the
// server persists the secret. Secret rides in a hidden field (already in the QR).

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-2xl bg-accent px-4 py-3 text-base font-semibold text-white transition hover:bg-accent-dark disabled:opacity-60"
    >
      {pending ? "Checking…" : "Verify code & enable 2FA"}
    </button>
  );
}

export default function EnableTotpForm({
  secret,
  qrDataUrl,
}: {
  secret: string;
  qrDataUrl: string;
}) {
  // Success redirects back to /admin/security (same route), so this form can
  // stay mounted while useFormState briefly yields an undefined state during the
  // navigation — default it back so `state.error` can't be read off undefined.
  const [state = initialState, formAction] = useFormState(enableTotp, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="secret" value={secret} />

      <div className="flex flex-col items-center gap-3 rounded-3xl border border-line bg-surface p-6">
        {/* eslint-disable-next-line @next/next/no-img-element -- data: URL, no optimization needed */}
        <img
          src={qrDataUrl}
          alt="QR code for 2FA enrollment"
          width={200}
          height={200}
          className="rounded-2xl"
        />
        <p className="text-center text-sm text-ink-3">
          Scan with an authenticator app such as Google Authenticator.
          <br />
          Manual entry key:
        </p>
        <code className="select-all break-all rounded-xl bg-bg px-3 py-1.5 font-mono text-sm text-ink-2">
          {secret}
        </code>
      </div>

      <div>
        <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-ink-2">
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
          className="w-full rounded-2xl border border-line bg-surface px-4 py-3 text-base tracking-[0.4em] text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
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
