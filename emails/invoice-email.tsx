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

const styles = {
  body: {
    backgroundColor: "white",
    fontFamily: "sans-serif",
  },
  container: {
    margin: "0 auto",
    padding: "20px 0 48px 0",
  },
  logo: {
    margin: "0 auto",
    width: "112px",
  },
  text: {
    fontSize: "16px",
  },
  buttonSection: {
    margin: "20px 0",
    textAlign: "center" as const,
  },
  button: {
    display: "inline-block",
    backgroundColor: "#7f5af0",
    color: "white",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "16px",
    textDecoration: "none",
  },
  divider: {
    margin: "16px 0",
    borderTop: "2px solid #d1d5db",
  },
  footer: {
    fontSize: "14px",
    color: "#4b5563",
  },
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
          <b>{senderName}</b> vous a envoyé une{" "}
          {type == "FACTURE" ? "facture" : "devi"}. Cliquez sur le lien
          ci-dessous pour la consulter et la télécharger :
        </Text>
        <Section style={styles.buttonSection}>
          <Button style={styles.button} href={documentLink}>
            Consulter {type == "FACTURE" ? "la facture" : "le devis"}
          </Button>
        </Section>

        <Hr style={styles.divider} />
        <Text style={styles.footer}>
          Email envoyé par <a href="https://www.allofacture.com">alloFacture</a>
        </Text>
      </Container>
    </Body>
  </Html>
);
