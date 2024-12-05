"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { markAsDone } from "../mark-as-done.server";

const MarkAsDoneButton = ({ planId }: { planId: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = async () => {
    setIsLoading(true);
    try {
      await markAsDone(planId);
      toast.success("Plan effectué");
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      size="icon"
      variant="outline"
      onClick={handleClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        <Check size={16} />
      )}
    </Button>
  );
};

export default MarkAsDoneButton;
