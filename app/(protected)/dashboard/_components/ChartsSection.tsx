import { User } from "@prisma/client";
import  DocsChart  from "./DocsChart";
import { prisma } from "@/lib/db";
import DocsPerClient from "./DocsPerClient";


const PerClientCalculator= (documents:Record<string,any>[]) => {
   return documents.reduce((acc:Record<string, { name: string; value: number; }> , facture) => {
        const customerId = facture.customerId; // Use the field that identifies the client
        const clientName = facture.customer ? facture.customer.name : 'Unknown'; // Adjust as needed
    
        if (!acc[customerId]) {
            acc[customerId] = {
                name: clientName,
                value: 0,
            };
        }
        acc[customerId].value += 1; // Increment the count for the client
    
        return acc;
    }, {});
    
}
export default async function ChartsSection({user}: {user: User}) {
    const moisEnFrancais = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
      ];
    const Factures = await prisma.invoice.findMany({where:{userId: user.id}, include: { customer: true }});
    const Devis = await prisma.quote.findMany({where:{userId: user.id}, include: { customer: true }});
    const DocsChartData= moisEnFrancais.map((mois, index) => {
        return {
          month: mois,
          Factures: Factures.filter((facture) => facture.createdAt.getMonth() === index && facture.createdAt.getFullYear() === new Date().getFullYear()).length,
          Devis: Devis.filter((devis) => devis.createdAt.getMonth() === index && devis.createdAt.getFullYear() === new Date().getFullYear()).length
        };
    })
    const facturePerClient =PerClientCalculator(Factures)
    const devisPerClient =PerClientCalculator(Devis)

    const PieChartData = {
        Factures:Object.keys(facturePerClient).map((key) => {
            return {
                name: facturePerClient[key].name,
                value: facturePerClient[key].value
            }
        }),
        Devis: Object.keys(devisPerClient).map((key) => {
            return {
                name: devisPerClient[key].name,
                value: devisPerClient[key].value
            }
        })
    }

  return (
    <section className="grid gap-8 md:grid-cols-2 ">
        <DocsChart data={DocsChartData} />
        <DocsPerClient data={PieChartData} total={{Factures:Factures.length,Devis:Devis.length}}/>
    </section>
  );
}