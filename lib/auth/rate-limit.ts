import { headers } from "next/headers";
import { prisma } from "@/lib/db";

// Phase 6-4: login rate limiting. Trailing-window count over the LoginAttempt
// table — both the form gateway (loginAction) and the token-minting boundary
// (authorize) share these helpers so neither path can be bypassed. No in-memory
// state: the same build runs on Vercel (serverless, no shared memory) and the
// school server, so the DB is the only consistent store.

const WINDOW_MS = 15 * 60 * 1000; // 15 min
const MAX_FAILURES = 5; // failures within the window before the IP is blocked

/**
 * Best-effort client IP behind a proxy. Reads the true inbound request headers
 * via next/headers (works in both Server Actions and route handlers).
 *
 * Prefer x-real-ip: both Vercel and our Nginx set it to the TCP peer (the real
 * client), so it can't be spoofed. x-forwarded-for[0] is a fallback for envs
 * that only set XFF. NOTE: school-server correctness depends on the Nginx site
 * config setting `proxy_set_header X-Real-IP $remote_addr;` (Phase 10).
 */
export function getClientIp(): string {
  try {
    const h = headers();
    const realIp = h.get("x-real-ip");
    if (realIp) return realIp.trim();
    const xff = h.get("x-forwarded-for");
    if (xff) return xff.split(",")[0]!.trim();
  } catch {
    // headers() unavailable (outside request scope) — fall through.
  }
  return "unknown"; // local dev (no proxy) / missing headers
}

/** True if this IP has hit the failure ceiling within the trailing window. */
export async function isRateLimited(ip: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);
  const failures = await prisma.loginAttempt.count({
    where: { ip, success: false, createdAt: { gte: since } },
  });
  return failures >= MAX_FAILURES;
}

/**
 * Record a failure (only call after the rate-limit check passes — blocked
 * attempts must NOT be recorded, so the fixed window can't be extended).
 * Opportunistically sweeps rows older than the window so the table stays small
 * without a cron — the same build needs zero setup on both deployments.
 */
export async function recordFailedAttempt(ip: string): Promise<void> {
  await prisma.loginAttempt.deleteMany({
    where: { createdAt: { lt: new Date(Date.now() - WINDOW_MS) } },
  });
  await prisma.loginAttempt.create({ data: { ip, success: false } });
}

/** Clear an IP's failures after a successful login (legit-user UX). */
export async function clearFailedAttempts(ip: string): Promise<void> {
  await prisma.loginAttempt.deleteMany({ where: { ip } });
}
