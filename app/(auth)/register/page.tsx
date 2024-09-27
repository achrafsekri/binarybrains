import { Suspense } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/forms/user-auth-form";
import { Icons } from "@/components/shared/icons";

export const metadata = {
  title: "Creez un compte | alloFacture",
  description: "Creez un compte pour acceder a alloFacture",
};

export default function RegisterPage() {
  return (
    <div className="container grid h-screen w-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/login"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 top-4 md:right-8 md:top-8",
        )}
      >
        Se connecter
      </Link>
      <div className="hidden h-full p-16 bg-muted lg:block">
        <img
          src="/SignUpIllustration.svg"
          alt="Register illustration"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto size-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Bienvenue sur alloFacture
            </h1>
            <p className="text-sm text-muted-foreground">
              Saisissez votre adresse E-mail pour créer un compte
            </p>
          </div>
          <Suspense>
            <UserAuthForm type="register" />
          </Suspense>
          <p className="px-8 text-center text-sm text-muted-foreground">
            En cliquant sur continuer, vous acceptez nos{" "}
            <Link
              href="/terms"
              className="hover:text-brand underline underline-offset-4"
            >
              Conditions d'utilisation
            </Link>{" "}
            et{" "}
            <Link
              href="/privacy"
              className="hover:text-brand underline underline-offset-4"
            >
              Politique de confidentialité
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function Illustration() {
  return (
    <div className="h-full bg-muted lg:block">
      <div className="flex h-full items-center justify-center">
        <img
          src="/assets/illustrations/register.svg"
          alt="Register illustration"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
