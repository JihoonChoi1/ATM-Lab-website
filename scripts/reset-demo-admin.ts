// One-off: replace the demo (Vercel/Neon) admin account with a fresh one.
//
// DESTRUCTIVE — deletes every User row (and every AuditLog, which FK-references
// User) on whatever DATABASE_URL points at. Point it at the Neon demo DB ONLY.
// Guard: you must also set CONFIRM_HOST to the connection host; the script aborts
// unless it matches DATABASE_URL's host, so a forgotten override (which would
// fall back to the local .env.local DB) or a wrong URL can't wipe the wrong DB.
//
// Run (a shell env var overrides the npm script's --env-file=.env.local, so this
// targets Neon, not the local DB):
//   DATABASE_URL='postgresql://…neon…/neondb?sslmode=require' \
//   CONFIRM_HOST='ep-xxxx.neon.tech' \
//   SEED_ADMIN_EMAIL='visitor@atmlab.dev' \
//   SEED_ADMIN_PASSWORD='<new public demo password>' \
//   npm run db:reset-demo-admin

import { prisma } from "../lib/db";
import { hashPassword, validatePasswordStrength } from "../lib/auth/password";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const confirmHost = process.env.CONFIRM_HOST?.trim();
  const dbUrl = process.env.DATABASE_URL;

  if (!email || !password) {
    console.error("✗ SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set.");
    process.exit(1);
  }
  if (!dbUrl) {
    console.error("✗ DATABASE_URL must be set (point it at the Neon demo DB).");
    process.exit(1);
  }

  const host = new URL(dbUrl).host;
  if (!confirmHost || !host.includes(confirmHost)) {
    console.error(
      `✗ Safety guard: set CONFIRM_HOST to the target DB host to proceed.\n` +
      `  DATABASE_URL host is: ${host}`,
    );
    process.exit(1);
  }

  const strength = validatePasswordStrength(password);
  if (!strength.ok) {
    console.error("✗ Password does not meet the policy:");
    for (const err of strength.errors) console.error(`  - ${err}`);
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  const existing = await prisma.user.findMany({ select: { email: true } });
  console.log(`Target DB host: ${host}`);
  console.log(
    existing.length
      ? `Removing ${existing.length} existing admin(s): ${existing.map((u) => u.email).join(", ")}`
      : "No existing admin rows found.",
  );

  await prisma.$transaction([
    // AuditLog FK-references User with no onDelete cascade, so clear it first.
    prisma.auditLog.deleteMany({}),
    prisma.user.deleteMany({}),
    prisma.user.create({ data: { email, passwordHash, role: "ADMIN" } }),
  ]);

  console.log(`✓ Created new admin: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
