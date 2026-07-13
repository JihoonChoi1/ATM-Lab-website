import { createHash } from "crypto";

// Obvious automated clients. We only have the UA to go on (no IP allowlists), so
// match the common crawler/bot tokens and drop those hits. Shared by every
// analytics write path (/api/track, publication views).
export const BOT_UA = /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora|pinterest|vkshare|w3c_validator|headless|lighthouse|monitor|preview|fetch|curl|wget|python-requests|axios|node-fetch/i;

// derive the daily visitor hash. The raw IP/UA never leave this
// function — only the digest is stored (privacy minimization). Mixing the KST
// date means the same person gets a fresh hash each day, so a row per visitor
// per day = that day's unique visitor.

// YYYYMMDD in Asia/Seoul, independent of the server's own timezone (Vercel=UTC,
// school server=KST). Shift the epoch by +9h, then read the UTC date parts of
// the shifted instant — that is the Seoul calendar date.
function seoulDateStamp(at: Date): string {
  const kst = new Date(at.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10).replace(/-/g, "");
}

export function visitorIdFor(ip: string, ua: string, at: Date = new Date()): string {
  const salt = process.env.VISITOR_SALT ?? "";
  const stamp = seoulDateStamp(at);
  return createHash("sha256")
    .update(`${ip}|${ua}|${stamp}|${salt}`)
    .digest("hex");
}
