import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/forms/user-auth-form";
import Logo from "@/components/layout/logo";
import { Icons } from "@/components/shared/icons";

export const metadata: Metadata = {
  title: "Connexion | Sotacib",
  description: "Connectez-vous à votre compte",
};

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Logo />
          <h1 className="text-2xl font-semibold tracking-tight">
            Bienvenue sur Sotacib
          </h1>
          <p className="text-sm text-muted-foreground">
            Saisissez votre adresse E-mail et mot de passe pour vous connecter à
            votre compte
          </p>
        </div>
        <Suspense>
          <UserAuthForm />
        </Suspense>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/mot-de-passe-oublie"
            className="hover:text-brand underline underline-offset-4"
          >
            Mot de passe oublié ?
          </Link>
        </p>
      </div>
    </div>
  );
}
