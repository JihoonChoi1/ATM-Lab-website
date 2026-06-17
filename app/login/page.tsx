import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Section from "@/components/ui/Section";
import LoginForm from "./login-form";
import { safeCallbackUrl } from "./callback-url";

export const metadata: Metadata = { title: "로그인 · ATM Lab" };

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
    <Section className="flex min-h-[70vh] items-center">
      <div className="mx-auto w-full max-w-[420px]">
        <h1 className="mb-2 text-3xl font-bold tracking-[-0.02em]">관리자 로그인</h1>
        <p className="mb-8 text-base text-ink-3">
          ATM Lab 콘텐츠 관리 계정으로 로그인하세요.
        </p>
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </Section>
  );
}
