import { type Customer } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

const createCustomer = async (ClientDetails: Partial<Customer>) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not found");
  }
  return await prisma.customer.create({
    data: {
      name: ClientDetails.name ?? "",
      email: ClientDetails.email ?? "",
      siret: ClientDetails.siret ?? "",
      address: ClientDetails.address ?? "",
      phone: ClientDetails.phone ?? "",
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });
};

export default createCustomer;
