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
  dueDate: string;
  amount: string;
};

export const ReminderEmail = ({
  senderName = "",
  documentLink,
  receiverName,
  type,
  dueDate,
  amount,
}: EmailProps) => {
  const isInvoice = type === "FACTURE";
  const documentType = isInvoice ? "facture" : "devis";
  const action = "examiner";

  return (
    <Html>
      <Head />
      <Preview>
        Rappel : {isInvoice ? "Paiement de facture" : "Devis en attente"} de{" "}
        {senderName}
      </Preview>
      <Body className="bg-white font-sans text-gray-800">
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
            Ceci est un rappel concernant{" "}
            {isInvoice ? "la facture" : "le devis"} de <b>{senderName}</b>.
          </Text>
          <Text className="text-base">
            {isInvoice
              ? `Le paiement de la facture d'un montant de ${amount}€ est dû le ${dueDate}.`
              : `Le devis d'un montant de ${amount}€ est en attente de votre examen. Il expire le ${dueDate}.`}
          </Text>
          <Text className="text-base">
            Veuillez cliquer sur le lien ci-dessous pour {action}{" "}
            {isInvoice ? "la facture" : "le devis"} :
          </Text>
          <Section className="my-5 text-center">
            <Button
              className="inline-block rounded-md bg-[#7f5af0] px-4 py-2 text-base text-white no-underline"
              href={documentLink}
            >
              {isInvoice ? "Examiner la facture" : "Examiner le devis"}
            </Button>
          </Section>
          <Text className="text-base">
            Si vous avez des questions, n'hésitez pas à contacter {senderName}.
          </Text>
          <Hr className="my-4 border-t-2 border-gray-300" />
          <Text className="text-sm text-gray-600">
            Email envoyé par{" "}
            <a href="https://www.allofacture.com">alloFacture</a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
