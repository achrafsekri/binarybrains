import { constructMetadata } from "@/lib/utils";
import Contact from "./_components/Contact";


export const metadata = constructMetadata({
  title: "Contact – AlloFacture",
  description: "Contactez-nous pour toute question ou suggestion.",
});

export default async function PricingPage() {
  return (
    <div className="flex w-full flex-col gap-16 py-8 md:py-8">
      <Contact />
    </div>
  );
}
