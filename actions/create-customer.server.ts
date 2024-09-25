import { type Customer } from "@prisma/client";

import { prisma } from "@/lib/db";

const createCustomer = async (ClientDetails: Partial<Customer>) => {
  return await prisma.customer.create({
    data: {
      name: ClientDetails.name ?? "",
      email: ClientDetails.email ?? "",
      siret: ClientDetails.siret ?? "",
      address: ClientDetails.address ?? "",
      phone: ClientDetails.phone ?? "",
    },
  });
};

export default createCustomer;
