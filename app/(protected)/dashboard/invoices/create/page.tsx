import { prisma } from "@/lib/db";
import {CreateInvoiceForm} from "./CreateInvoiceForm";
import { getCurrentUser } from "@/lib/session";

export default async function Page() {
  const user = await getCurrentUser()
  const clients = await prisma.customer.findMany({where:{userId: user?.id}});
  return (
    <>
    <CreateInvoiceForm clients={clients} />
    </>
  );
}