import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";

// Phase 6-2: Credentials provider (email + password) on top of the 6-1 wiring.
// JWT sessions (no DB adapter — User/Account/Session tables aren't used by Auth.js).
// AUTH_SECRET is read from the environment automatically.

// Pre-computed bcrypt hash (cost 12) of a throwaway string. When the email isn't
// found we still run one bcrypt.compare against this, so response time doesn't
// reveal whether the account exists (user-enumeration / timing defense).
const DUMMY_PASSWORD_HASH =
  "$2b$12$r/sdSXCkMZB0BkwiHvvGleMdhqRmlYVU3Deoy4jaC6MjpXx7cxHsC";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });

        // Always run a compare (real hash, or the dummy) to equalize timing.
        const valid = await verifyPassword(
          password,
          user?.passwordHash ?? DUMMY_PASSWORD_HASH,
        );

        // Generic failure — never reveal which of email/password was wrong.
        if (!user || !valid) return null;

        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      // `user` is only present on initial sign-in; persist id + role into the JWT.
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      // Surface id + role on the session for downstream authorization checks.
      if (token.id) session.user.id = token.id;
      if (token.role) session.user.role = token.role;
      return session;
    },
  },
});
