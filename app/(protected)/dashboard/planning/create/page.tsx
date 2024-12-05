import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

import NewPlaningForm from "./NewPlaningForm";

export default async function Page() {
  const user = await getCurrentUser();
  const pos = await prisma.pos.findMany({
    where: {
      state: { in: user?.states || [] },
    },
  });
  return (
    <>
      <NewPlaningForm pos={pos} />
    </>
  );
}
