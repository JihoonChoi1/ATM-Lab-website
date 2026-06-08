// Restrict post-login redirects to same-origin relative paths so a crafted
// ?callbackUrl=https://evil.example can't turn the login form into an open redirect.
export function safeCallbackUrl(raw: unknown, fallback: string): string {
  const value = typeof raw === "string" ? raw : "";
  return value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}
