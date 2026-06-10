// Bootstraps the first admin account — the student deploying the site. One-time
// bootstrap that breaks the chicken-and-egg (no public signup): it writes the
// first User row directly so there's an account to log in with. Richer user
// management via the admin UI lands in Phase 7. Reads credentials from the
// environment so no password is committed; reuses the same hashing + strength
// policy as the admin UI.
//
// Run with:  SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... npm run db:seed-admin
// (or put SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD in .env.local — the npm script
//  loads it via --env-file). By default this REFUSES to touch an existing account
//  so a stray re-run can't silently reset a live admin's password; set
//  SEED_ADMIN_FORCE=1 to overwrite it (recovery only). 2FA is left off here; the
//  account turns it on itself at /admin/security after first login.

import { prisma } from "../lib/db";
import { hashPassword, validatePasswordStrength } from "../lib/auth/password";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.trim();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error(
      "✗ SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set (env or .env.local).",
    );
    process.exit(1);
  }

  const strength = validatePasswordStrength(password);
  if (!strength.ok) {
    console.error("✗ Password does not meet the policy:");
    for (const err of strength.errors) console.error(`  - ${err}`);
    process.exit(1);
  }

  // Overwrite guard: a re-run must not silently reset a live admin's password.
  // Refuse by default when the account exists; require an explicit force flag.
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing && process.env.SEED_ADMIN_FORCE !== "1") {
    console.error(
      `✗ An account for '${email}' already exists. ` +
        "Re-run with SEED_ADMIN_FORCE=1 to overwrite its password.",
    );
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);
  const user = existing
    ? await prisma.user.update({
        where: { email },
        data: { passwordHash, role: "ADMIN" },
      })
    : await prisma.user.create({
        data: { email, passwordHash, role: "ADMIN" },
      });

  console.log(
    `✓ Admin account ${existing ? "password updated" : "created"}: ${user.email} (role ${user.role})`,
  );
  console.log("  Log in at /login, then enable 2FA at /admin/security.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
