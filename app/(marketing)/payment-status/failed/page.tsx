import React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";

export const metadata = {
  title: "Paiement échoué | alloFacture",
  description: "Votre payement a été échoué.",
};

const page = () => {
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
        <h1 className="text-balance font-urban text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          Votre payement a été
          <span className="mx-2 font-extrabold text-red-500 underline">
            echoué
          </span>{" "}
        </h1>

        <p
          className="max-w-2xl text-balance leading-normal text-muted-foreground sm:text-lg sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Votre paiement a échoué. Veuillez réessayer. Si le problème persiste,
          veuillez contacter le <a className="underline" href="mailto:support@allofacture.com">support</a>.
        </p>

        <div
          className="flex justify-center space-x-2 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/pricing"
            prefetch={true}
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "gap-2",
            )}
          >
            <span>Réessayer</span>
            <Icons.arrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default page;
