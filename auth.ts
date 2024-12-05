import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { State, UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

import { prisma } from "@/lib/db";
import { getUserById } from "@/lib/user";

// More info: https://authjs.dev/getting-started/typescript#module-augmentation
declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      stripeSubscriptionId: string | unknown;
      states: State[];
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
    // error: "/auth/error",
  },
  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }
        if (token.email) {
          session.user.email = token.email;
        }
        if (token.role) {
          session.user.role = token.role;
        }
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.stripeSubscriptionId = token.stripeSubscriptionId;
        session.user.states = token.states as State[];
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const dbUser = await getUserById(token.sub);

      if (!dbUser) return token;

      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.role = dbUser.role;
      token.stripeSubscriptionId = dbUser.stripeSubscriptionId;
      token.states = dbUser.states;
      return token;
    },
  },
  ...authConfig,
  // debug: process.env.NODE_ENV !== "production"
});
