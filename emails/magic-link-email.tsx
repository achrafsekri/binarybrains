import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { Icons } from "../components/shared/icons";

type MagicLinkEmailProps = {
  actionUrl: string;
  firstName: string;
  mailType: "login" | "register";
  siteName: string;
};

export const MagicLinkEmail = ({
  firstName = "",
  actionUrl,
  mailType,
  siteName,
}: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>Votre lien de connexion pour AlloFacture</Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto py-5 pb-12">
          <Icons.logo className="m-auto block size-10" />
          <Text className="text-base">Bonjour {firstName},</Text>
          <Text className="text-base">
            Bienvenue sur AlloFacture! Vous avez reçu ce courriel pour vous
            connecter à votre compte.
          </Text>
          <Section className="my-5 text-center">
            <Button
              className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-base text-white no-underline"
              href={actionUrl}
            >
              Se connecter
            </Button>
          </Section>
          <Text className="text-base">
            Cette connexion est valable pour une seule utilisation et expirera à
            24 heures.
          </Text>
          {mailType === "login" ? (
            <Text className="text-base">
              Si vous n'avez pas demandé de lien de connexion, vous pouvez
              ignorer ce courriel en toute sécurité.
            </Text>
          ) : null}
          <Hr className="my-4 border-t-2 border-gray-300" />
          <Text className="text-sm text-gray-600">
            Si vous avez des questions, veuillez répondre à ce courriel pour
            obtenir de l'aide.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
