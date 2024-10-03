import { Html } from "@react-email/html";
import { Head } from "@react-email/head";
import { Preview } from "@react-email/preview";
import { Body } from "@react-email/body";
import { Container } from "@react-email/container";
import { Img } from "@react-email/img";
import { Text } from "@react-email/text";
import { Section } from "@react-email/section";
import { Button } from "@react-email/button";
import { Hr } from "@react-email/hr";


type MagicLinkEmailProps = {
  actionUrl: string;
  firstName: string;
  mailType: "login" | "register";
  siteName: string;
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
    width: "112px",
    margin: "0 auto",
  },
  text: {
    fontSize: "16px",
    marginTop: "16px",
  },
  buttonSection: {
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
};

export const MagicLinkEmail = ({
  firstName = "",
  actionUrl,
  mailType,
}: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>Votre lien de connexion pour AlloFacture</Preview>
    <Body style={styles.body}>
      <Container style={styles.container}>
        <Img
          src="https://allofacture.s3.amazonaws.com/Group+1.png"
          alt="allofacture-logo"
          style={styles.logo}
        />
        <Text style={styles.text}>Bonjour {firstName},</Text>
        <Text style={styles.text}>
          Bienvenue sur AlloFacture! Vous avez reçu ce courriel pour vous
          connecter à votre compte.
        </Text>
        <Section style={styles.buttonSection}>
          <Button style={styles.button} href={actionUrl}>
            Se connecter
          </Button>
        </Section>
        <Text style={styles.text}>
          Cette connexion est valable pour une seule utilisation et expirera à
          24 heures.
        </Text>
        {mailType === "login" ? (
          <Text style={styles.text}>
            Si vous n'avez pas demandé de lien de connexion, vous pouvez ignorer
            ce courriel en toute sécurité.
          </Text>
        ) : null}
        <Hr style={styles.divider} />
        <Text style={styles.footer}>
          Si vous avez des questions, veuillez répondre à ce courriel pour
          obtenir de l'aide.
        </Text>
      </Container>
    </Body>
  </Html>
);
