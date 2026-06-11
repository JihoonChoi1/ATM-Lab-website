import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { auth } from "@/auth";

// Phase 7-1: one-line page guard for admin routes. Each admin page calls auth()
// anyway to load its data, so guarding here is free and always runs — unlike a
// layout-only guard, which Next skips on client-side navigations between admin
// pages. Login-only: no role gate (single admin account; roles are optional 7-10).
export async function requireAdmin(callbackUrl: string): Promise<Session> {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  return session;
}
