import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Section from "@/components/ui/Section";
import { uploadsEnabled } from "@/lib/uploads";
import LoginForm from "./login-form";
import { safeCallbackUrl } from "./callback-url";

// The public demo (Vercel, uploads disabled) shows its throwaway credentials on
// the login screen so recruiters can sign straight in; the school server (uploads
// enabled) never renders them. This account is demo-only and isolated from
// production — see the README's "Live demo" section.
const DEMO_CREDENTIALS = { email: "visitor@atmlab.dev", password: "R3Y_z5A1qVE.rFcilj" };

export const metadata: Metadata = { title: "Sign in · ATM Lab" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  const callbackUrl = safeCallbackUrl(searchParams.callbackUrl, "/admin");

  // Already signed in → skip the form.
  const session = await auth();
  if (session) redirect(callbackUrl);

  return (
    // <main> landmark so the form lands inside a region (other public pages wrap
    // their content in <main>; login used a bare <section>, tripping axe
    // landmark-one-main + region).
    <main>
      <Section className="flex min-h-[70vh] items-center">
        <div className="mx-auto w-full max-w-[420px]">
          <h1 className="mb-2 text-3xl font-bold tracking-[-0.02em]">Admin sign in</h1>
          <p className="mb-8 text-base text-ink-3">
            Sign in with your ATM Lab content-management account.
          </p>
          <LoginForm
            callbackUrl={callbackUrl}
            demo={uploadsEnabled() ? null : DEMO_CREDENTIALS}
          />
        </div>
      </Section>
    </main>
  );
}
