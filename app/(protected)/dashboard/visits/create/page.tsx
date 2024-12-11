import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

import NewVisitForm from "./NewVistForm";

export default async function Page({
  searchParams,
}: {
  searchParams: { pos: string };
}) {
  const user = await getCurrentUser();
  const userStates = user?.states;
  const filterByStates = { state: { in: userStates || [] } };
  const poss = await prisma.pos.findMany({
    where: filterByStates,
  });
  const products = await prisma.product.findMany({
    include: {
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <>
      <NewVisitForm
        pos={poss}
        products={products}
        posId={searchParams.pos}
      />
    </>
  );
}
