import NextAuth from "next-auth";

// Phase 6-1: Auth.js (NextAuth v5) wiring only.
// JWT sessions (no DB adapter — User/Account/Session tables aren't used by Auth.js).
// Providers are intentionally empty here; the Credentials provider (email + password
// + bcrypt) lands in Phase 6-2. AUTH_SECRET is read from the environment automatically.
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [],
});
