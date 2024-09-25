import { prisma } from "@/lib/db";
import { type Seller } from "@prisma/client";

const createSeller = async ({
  SellerDetails,
  userId,
}: {
  SellerDetails: Partial<Seller>;
  userId: string;
}) => {
  return await prisma.seller.create({
    data: {
      name: SellerDetails.name ?? "",
      address: SellerDetails.address ?? "",
      phone: SellerDetails.phone ?? "",
      siret: SellerDetails.siret ?? "",
      email: SellerDetails.email ?? "",
      vatNumber: SellerDetails.vatNumber ?? "",
      userId: userId as string,
    },
  });
};

export default createSeller;