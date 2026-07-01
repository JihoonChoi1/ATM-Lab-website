import { createHash } from "crypto";

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
