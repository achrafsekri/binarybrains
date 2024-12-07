import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

import NewPosForm from "./NewPosForm";

export default async function Page() {
  const user = await getCurrentUser();
  const products = await prisma.product.findMany({
    include: {
      company: true,
    },
  });

  return (
    <>
      <NewPosForm products={products} />
    </>
  );
}
