import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { signIn } from "next-auth/react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Icons } from "@/components/shared/icons";

import { UserAuthForm } from "../forms/user-auth-form";
import Logo from "../layout/logo";

function SignInModal({
  showSignInModal,
  setShowSignInModal,
}: {
  showSignInModal: boolean;
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [signInClicked, setSignInClicked] = useState(false);

  return (
    <Modal showModal={showSignInModal} setShowModal={setShowSignInModal}>
      <div className="w-full">
        <div className="flex flex-col items-center justify-center space-y-3 border-b bg-background px-4 py-6 pt-8 text-center md:px-16">
          <a href={siteConfig.url}>
            <Logo />
          </a>
          <h3 className="font-urban text-2xl font-bold">
            S&apos;identifier pour continuer
          </h3>
          <p className="text-sm text-gray-500">
            Connectez-vous à votre compte pour accéder à toutes les
            fonctionnalités de alloFacture
          </p>
        </div>

        <div className="flex flex-col space-y-4 bg-secondary/50 px-4 py-8 md:px-16">
          <UserAuthForm type="login" />
        </div>
      </div>
    </Modal>
  );
}

export function useSignInModal() {
  const [showSignInModal, setShowSignInModal] = useState(false);

  const SignInModalCallback = useCallback(() => {
    return (
      <SignInModal
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    );
  }, [showSignInModal, setShowSignInModal]);

  return useMemo(
    () => ({
      setShowSignInModal,
      SignInModal: SignInModalCallback,
    }),
    [setShowSignInModal, SignInModalCallback],
  );
}
