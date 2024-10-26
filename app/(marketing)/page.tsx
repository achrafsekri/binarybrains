import { infos } from "@/config/landing";
import BentoGrid from "@/components/sections/bentogrid";
import Features from "@/components/sections/features";
import HeroLanding from "@/components/sections/hero-landing";
import InfoLanding from "@/components/sections/info-landing";
import Powered from "@/components/sections/powered";
import PreviewLanding from "@/components/sections/preview-landing";
import Testimonials from "@/components/sections/testimonials";

export const metadata = {
  title:
    "AlloFacture | la manière la plus simple pour créer des factures et des devis",
  description:
    "AlloFacture est une application en ligne qui permet de créer des factures et des devis de manière simple et efficace. Créez des factures et des devis en quelques clics et envoyez-les directement par email.",
};

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <PreviewLanding />
      {/* <Powered /> */}
      <BentoGrid />
      <InfoLanding data={infos[0]} reverse={true} />
      {/* <InfoLanding data={infos[1]} /> */}
      <Features />
      <Testimonials />
    </>
  );
}
