import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authenticate } from "@/lib/auth/authenticate";
import {
  getClientIp,
  isRateLimited,
  recordFailedAttempt,
  clearFailedAttempts,
} from "@/lib/auth/rate-limit";

// Phase 6-2: Credentials provider (email + password) on top of the 6-1 wiring.
// Phase 6-3: optional `code` field carries the TOTP second factor. The actual
// validation lives in authenticate() — the single source of truth shared with
// the login Server Action. authorize() is the token-minting security boundary:
// it re-validates everything and trusts nothing from the client.
// JWT sessions (no DB adapter — User/Account/Session tables aren't used by Auth.js).
// AUTH_SECRET is read from the environment automatically.

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Session hardening. Cookie flags are Auth.js defaults (verified):
  // the session-token cookie is always HttpOnly + SameSite=Lax, and Secure is
  // applied conditionally when the resolved request URL is https — so dev over
  // http://localhost still works. Never hardcode `secure`. On the school server
  // (TLS terminated at Nginx, app reached over http) set AUTH_URL=https://<host>
  // so Auth.js treats requests as https → Secure + `__Secure-` prefix; AUTH_URL
  // also auto-enables trustHost behind the proxy.
  session: {
    strategy: "jwt",
    // Sessions expire 24h after issue (jwt.maxAge follows session.maxAge).
    maxAge: 60 * 60 * 24,
  },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        code: { label: "2FA Code", type: "text" },
      },
      authorize: async (credentials) => {
        const email =
          typeof credentials?.email === "string" ? credentials.email : "";
        const password =
          typeof credentials?.password === "string" ? credentials.password : "";
        const code =
          typeof credentials?.code === "string" ? credentials.code : undefined;
        if (!email || !password) return null;

        // Phase 6-4: enforce here too — this is the boundary that direct POSTs
        // to /api/auth/callback/credentials hit, bypassing the form action.
        const ip = getClientIp();
        if (await isRateLimited(ip)) return null; // blocked before bcrypt; not recorded

        const result = await authenticate(email, password, code);
        if (result.ok) {
          await clearFailedAttempts(ip);
          return result.user;
        }
        // Count password failures and post-password TOTP failures (protects the
        // second factor from brute force); a pending TOTP step is not a failure.
        if (result.reason === "credentials" || result.reason === "totp_invalid") {
          await recordFailedAttempt(ip);
        }
        return null;
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
