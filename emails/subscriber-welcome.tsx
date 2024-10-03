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

type NewsletterWelcomeProps = {
  unsubscribeUrl: string;
};

export const NewsletterWelcome = ({
  unsubscribeUrl,
}: NewsletterWelcomeProps) => (
  <Html>
    <Head />
    <Preview>Bienvenue à la newsletter d'AlloFacture!</Preview>

    <Body className="bg-white font-sans">
      <Container className="mx-auto py-5 pb-12">
        <Img
          src="https://allofacture.s3.amazonaws.com/Group+1.png"
          alt="allofacture-logo"
          className="mx-auto w-28"
        />
        <Text className="mt-4 text-base">Bonjour!</Text>
        <Text className="text-base">
          Bienvenue à la newsletter d'AlloFacture! Nous sommes ravis de vous
          compter parmi nos abonnés.
        </Text>

        <Text className="text-base">
          Voici ce que vous pouvez attendre de notre newsletter:
        </Text>

        <ul className="list-disc pl-5">
          <li>Des conseils pratiques pour la gestion de votre facturation</li>
          <li>Les dernières mises à jour et fonctionnalités d'AlloFacture</li>
          <li>Des astuces pour optimiser votre flux de trésorerie</li>
          <li>
            Des informations sur les tendances du marché et la réglementation
          </li>
        </ul>

        <Text className="mt-4 text-base">
          Nous vous enverrons notre newsletter une fois par mois, directement
          dans votre boîte de réception.
        </Text>

        <Section className="mt-8 text-center">
          <Button
            className="inline-block rounded-md bg-[#7f5af0] px-4 py-2 text-base text-white no-underline"
            href="https://www.allofacture.com/ressources"
          >
            Découvrez nos ressources
          </Button>
        </Section>

        <Hr className="my-8 border-t-2 border-gray-300" />

        <Text className="text-sm text-gray-600">
          Si vous avez des questions ou des suggestions, n'hésitez pas à nous
          contacter en répondant à cet email.
        </Text>

        <Text className="mt-4 text-xs text-gray-500">
          Si vous souhaitez vous désabonner,{" "}
          <a href={unsubscribeUrl}>cliquez ici</a>.
        </Text>
      </Container>
    </Body>
  </Html>
);
