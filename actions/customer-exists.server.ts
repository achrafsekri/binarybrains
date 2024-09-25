import { type Customer } from "@prisma/client";
import { prisma } from "@/lib/db";

const customerExists = async (ClientDetails: Partial<Customer>) => {
  return await prisma.customer.findFirst({
    where: {
      name: ClientDetails.name,
      email: ClientDetails.email,
      siret: ClientDetails.siret,
    },
  });
};

export default customerExists;
