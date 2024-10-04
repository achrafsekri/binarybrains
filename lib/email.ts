import { MagicLinkEmail } from "@/emails/magic-link-email";
import { EmailConfig } from "next-auth/providers/email";
import { Resend } from "resend";

import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";

import { logger } from "./logger";
import { getUserByEmail } from "./user";

export const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationRequest: EmailConfig["sendVerificationRequest"] =
  async ({ identifier, url, provider }) => {
    const user = await getUserByEmail(identifier);

    const userVerified = user?.emailVerified ? true : false;
    const authSubject = userVerified
      ? `Se connecter à AlloFacture`
      : `Créer un compte AlloFacture`;

    try {
      const { data, error } = await resend.emails.send({
        from: provider.from,
        to: identifier,
        subject: authSubject,
        react: MagicLinkEmail({
          firstName: user?.name as string,
          actionUrl: url,
          mailType: userVerified ? "login" : "register",
          siteName: siteConfig.name,
        }),
        // Set this to prevent Gmail from threading emails.
        // More info: https://resend.com/changelog/custom-email-headers
        headers: {
          "X-Entity-Ref-ID": new Date().getTime() + "",
        },
      });

      if (error || !data) {
        logger.error("Failed to send verification email", error);
        throw new Error(error?.message);
      }
    } catch (error) {
      logger.error("Failed to send verification email", error);
      throw new Error("Failed to send verification email.");
    }
  };
