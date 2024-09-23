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

type EmailProps = {
  senderName: string;
  invoiceLink: string;
  receiverName: string;
};

export const InvoiceEmail = ({
  senderName = "",
  invoiceLink,
  receiverName,
}: EmailProps) => (
  <Html>
    <Head />
    <Preview>{senderName} Vous a envoyé une facture.</Preview>
    <Tailwind>
      <Body className="bg-white font-sans">
        <Container className="mx-auto py-5 pb-12">
          <Icons.logo className="m-auto block size-10" />
          <Text className="text-base">Bonjour {receiverName},</Text>
          <Text className="text-base">
            {senderName} vous a envoyé une facture. Cliquez sur le lien
            ci-dessous pour la consulter et la télécharger :
          </Text>
          <Section className="my-5 text-center">
            <Button
              className="inline-block rounded-md bg-zinc-900 px-4 py-2 text-base text-white no-underline"
              href={invoiceLink}
            >
              Consulter la facture
            </Button>
          </Section>

          <Hr className="my-4 border-t-2 border-gray-300" />
          <Text className="text-sm text-gray-600">
            Email envoyé par{" "}
            <a href="https://www.allofacture.com">alloFacture</a>
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
