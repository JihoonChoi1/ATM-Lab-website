import type { UserRole } from "@/app/generated/prisma/client";
import type { DefaultSession } from "next-auth";

// Phase 6-2: carry the User id + role through the JWT and onto the session so
// downstream authorization checks can read session.user.role.

declare module "next-auth" {
  interface User {
    role: UserRole;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

// The jwt/session callbacks type `token` as @auth/core/jwt's JWT directly;
// next-auth/jwt only re-exports it, so the augmentation must target the source.
declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}
