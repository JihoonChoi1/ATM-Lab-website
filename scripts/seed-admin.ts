// Bootstraps the first admin account — the student deploying the site. This is
// the minimal test/bootstrap version; the full seed + user management lands in
// Phase 6-9 / Phase 7. Reads credentials from the environment so no password is
// committed; reuses the same hashing + strength policy as the (future) admin UI.
//
// Run with:  SEED_ADMIN_EMAIL=... SEED_ADMIN_PASSWORD=... npm run db:seed-admin
// (or put SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD in .env.local — the npm script
//  loads it via --env-file). 2FA is left off here; the account turns it on itself
// at /admin/security after first login.

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

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN" },
    create: { email, passwordHash, role: "ADMIN" },
  });

  console.log(`✓ Admin account ready: ${user.email} (role ${user.role})`);
  console.log("  Log in at /login, then enable 2FA at /admin/security.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
