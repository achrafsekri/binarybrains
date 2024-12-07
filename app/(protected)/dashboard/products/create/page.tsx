import { getCurrentUser } from "@/lib/session";

import NewPosForm from "./NewPosForm";

export default async function Page() {
  const user = await getCurrentUser();

  return (
    <>
      <NewPosForm />
    </>
  );
}
