import { Seller } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

import { CreateInvoiceForm } from "./CreateInvoiceForm";

export default async function Page() {
  const user = await getCurrentUser();
  const clients = await prisma.customer.findMany({
    where: { userId: user?.id },
  });
  const invoiceNumber = await prisma.invoice.count({
    where: { userId: user?.id },
  });
  const seller = await prisma.seller.findFirst({
    where: { userId: user?.id },
  });
  //should be a string with 4 digits
  const formattedInvoiceNumber = invoiceNumber.toString().padStart(4, "0");
  return (
    <>
      <CreateInvoiceForm
        clients={clients}
        currentInvoiceNumber={formattedInvoiceNumber}
        seller={seller as Seller}
      />
    </>
  );
}
