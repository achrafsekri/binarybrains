import { Seller } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

import { CreateDevisForm } from "./CreateDevisForm";

export default async function Page() {
  const user = await getCurrentUser();
  const clients = await prisma.customer.findMany({
    where: { userId: user?.id },
  });
  const devisNumber = await prisma.quote.count({
    where: { userId: user?.id },
  });
  const seller = await prisma.seller.findFirst({
    where: { userId: user?.id },
  });
  //should be a string with 4 digits
  const formattedDevisNumber = devisNumber.toString().padStart(4, "0");
  return (
    <>
      <CreateDevisForm
        clients={clients}
        currentDevisNumber={formattedDevisNumber}
        seller={seller as Seller}
      />
    </>
  );
}
