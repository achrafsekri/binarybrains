import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

import NewVisitForm from "./NewVistForm";

export default async function Page() {
  const user = await getCurrentUser();
  const userStates = user?.states;
  const filterByStates = { state: { in: userStates || [] } };
  const pos = await prisma.pos.findMany({
    where: filterByStates,
  });
  const products = await prisma.product.findMany({
    include: {
      company: true,
    },
  });
  return (
    <>
      <NewVisitForm pos={pos} products={products} />
    </>
  );
}
