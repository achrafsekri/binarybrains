import { compare } from "bcrypt";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";

import { env } from "@/env.mjs";

import { prisma } from "./lib/db";
import { sendVerificationRequest } from "./lib/email";

export default {
  providers: [
    Resend({
      apiKey: env.RESEND_API_KEY,
      from: "noreply@allofacture.com",
      sendVerificationRequest,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        if (credentials.email) {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });
          if (!user) return null;
          // const passwordCorrect = await compare(
          //   credentials?.password || "",
          //   user.password,
          // );
          // if (!passwordCorrect) return null;
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
