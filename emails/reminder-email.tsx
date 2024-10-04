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

const styles = {
  body: {
    backgroundColor: "white",
    fontFamily: "sans-serif",
    color: "#1f2937",
  },
  container: {
    margin: "0 auto",
    padding: "20px 0 48px 0",
  },
  logo: {
    width: "112px",
    margin: "0 auto",
  },
  text: {
    fontSize: "16px",
    lineHeight: "1.5",
    margin: "16px 0",
  },
  buttonContainer: {
    margin: "20px 0",
    textAlign: "center" as const,
  },
  button: {
    display: "inline-block",
    borderRadius: "6px",
    backgroundColor: "#7f5af0",
    padding: "8px 16px",
    fontSize: "16px",
    color: "white",
    textDecoration: "none",
  },
  divider: {
    margin: "16px 0",
    borderTop: "2px solid #e5e7eb",
  },
  footer: {
    fontSize: "14px",
    color: "#4b5563",
  },
  link: {
    color: "#7f5af0",
    textDecoration: "none",
  },
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
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Img
            src="https://allofacture.s3.amazonaws.com/Group+1.png"
            alt="allofacture-logo"
            style={styles.logo}
          />
          <Text style={styles.text}>
            Bonjour <b>{receiverName}</b>,
          </Text>
          <Text style={styles.text}>
            Ceci est un rappel concernant{" "}
            {isInvoice ? "la facture" : "le devis"} de <b>{senderName}</b>.
          </Text>
          <Text style={styles.text}>
            {isInvoice
              ? `Le paiement de la facture d'un montant de ${amount} est dû le ${dueDate}.`
              : `Le devis d'un montant de ${amount}€ est en attente de votre examen. Il expire le ${dueDate}.`}
          </Text>
          <Text style={styles.text}>
            Veuillez cliquer sur le lien ci-dessous pour {action}{" "}
            {isInvoice ? "la facture" : "le devis"} :
          </Text>
          <Section style={styles.buttonContainer}>
            <Button style={styles.button} href={documentLink}>
              {isInvoice ? "Examiner la facture" : "Examiner le devis"}
            </Button>
          </Section>
          <Text style={styles.text}>
            Si vous avez des questions, n'hésitez pas à contacter {senderName}.
          </Text>
          <Hr style={styles.divider} />
          <Text style={styles.footer}>
            Email envoyé par{" "}
            <a href="https://www.allofacture.com" style={styles.link}>
              alloFacture
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};
