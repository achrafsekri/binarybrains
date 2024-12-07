"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function Error() {
  const router = useRouter();
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Button onClick={() => router.back()}>
        Retourner à la page précédente
      </Button>
    </div>
  );
}
