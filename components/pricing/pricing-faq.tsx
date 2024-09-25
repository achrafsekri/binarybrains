import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { HeaderSection } from "../shared/header-section";

const pricingFaqData = [
  {
    id: "item-1",
    question: "Est-ce que le plan gratuit est vraiment gratuit ?",
    answer:
      "Oui, notre plan gratuit est 100% gratuit. Il offre un accès limité à certaines fonctionnalités, mais vous pouvez l'utiliser aussi longtemps que vous le souhaitez.",
  },
  {
    id: "item-2",
    question: "Quel est le prix du plan mensuel de base ?",
    answer:
      "Le plan mensuel de base est disponible pour 15 $ par mois. Il offre des fonctionnalités de base pour les petites entreprises et les travailleurs indépendants.",
  },
  {
    id: "item-3",
    question: "Est-ce que vous proposez un plan mensuel Pro ?",
    answer:
      "Oui, nous proposons un plan mensuel Pro pour 12€ par mois. Il offre des fonctionnalités avancées pour les professionnels et les petites entreprises.",
  },
  {
    id: "item-4",
    question: "Proposez-vous des plans d'abonnement annuels ?",
    answer:
      "Oui, nous proposons des plans d'abonnement annuels pour les plans Pro et Business. Vous pouvez économiser jusqu'à 20% en optant pour un abonnement annuel.",
  },
  {
    id: "item-5",
    question: "Puis-je annuler mon abonnement à tout moment ?",
    answer:
      "Oui, vous pouvez annuler votre abonnement à tout moment. Votre abonnement restera actif jusqu'à la fin de la période de facturation en cours.",
  },
];

export function PricingFaq() {
  return (
    <section className="container max-w-4xl py-2">
      <HeaderSection
        label="FAQ"
        title="Les questions fréquemment posées"
        subtitle="Trouvez des réponses aux questions les plus courantes sur nos plans et tarifs."
      />

      <Accordion type="single" collapsible className="my-12 w-full">
        {pricingFaqData.map((faqItem) => (
          <AccordionItem key={faqItem.id} value={faqItem.id}>
            <AccordionTrigger>{faqItem.question}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground sm:text-[15px]">
              {faqItem.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
