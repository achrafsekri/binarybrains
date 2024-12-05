import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

import NewUserForm from "./NewUserForm";

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
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <>
      <NewUserForm />
    </>
  );
}
