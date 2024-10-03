import type { NextAuthConfig } from "next-auth";
import Resend from "next-auth/providers/resend";

import { env } from "@/env.mjs";

import { sendVerificationRequest } from "./lib/email";

export default {
  providers: [
    Resend({
      apiKey: env.RESEND_API_KEY,
      from: "noreply@allofacture.com",
      sendVerificationRequest,
    }),
  ],
} satisfies NextAuthConfig;
