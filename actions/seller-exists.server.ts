import { prisma } from "@/lib/db";
import { type Seller } from "@prisma/client";

const sellerExists = async (SellerDetails: Partial<Seller>) => {
  return await prisma.seller.findFirst({
    where: {
      name: SellerDetails.name,
      address: SellerDetails.address,
      phone: SellerDetails.phone,
      siret: SellerDetails.siret,
    },
  });
};

export default sellerExists;