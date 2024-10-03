import { Body } from "@react-email/body";
import { Button } from "@react-email/button";
import { Container } from "@react-email/container";
import { Head } from "@react-email/head";
import { Hr } from "@react-email/hr";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import { Preview } from "@react-email/preview";
import { Section } from "@react-email/section";
import { Text } from "@react-email/text";

type EmailProps = {
  senderName: string;
  documentLink: string;
  receiverName: string;
  type: "FACTURE" | "DEVIS";
};

export const InvoiceEmail = ({
  senderName = "",
  documentLink,
  receiverName,
  type,
}: EmailProps) => (
  <Html>
    <Head />
    <Preview>{senderName} Vous a envoyé une facture.</Preview>
    <Body className="bg-white font-sans">
      <Container className="mx-auto py-5 pb-12">
        <Img
          src="https://allofacture.s3.amazonaws.com/Group+1.png"
          alt="allofacture-logo"
          className="mx-auto w-28"
        />
        <Text className="text-base">
          Bonjour <b>{receiverName}</b>,
        </Text>
        <Text className="text-base">
          <b>{senderName}</b> vous a envoyé une{" "}
          {type == "FACTURE" ? "facture" : "devi"}. Cliquez sur le lien
          ci-dessous pour la consulter et la télécharger :
        </Text>
        <Section className="my-5 text-center">
          <Button
            className="inline-block rounded-md bg-[#7f5af0] px-4 py-2 text-base text-white no-underline"
            href={documentLink}
          >
            Consulter {type == "FACTURE" ? "la facture" : "le devis"}
          </Button>
        </Section>

        <Hr className="my-4 border-t-2 border-gray-300" />
        <Text className="text-sm text-gray-600">
          Email envoyé par <a href="https://www.allofacture.com">alloFacture</a>
        </Text>
      </Container>
    </Body>
  </Html>
);
