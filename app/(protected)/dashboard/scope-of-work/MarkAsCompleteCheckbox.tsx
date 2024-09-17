"use client";

import React from "react";
import { markAsComplete } from "@/actions/mark-as-complete.server";
import clsx from "clsx";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";

const MarkAsCompleteCheckbox = ({
  type,
  disabled,
  id,
}: {
  type: "MILESTONE" | "TASK";
  disabled: boolean;
  id: string;
}) => {
  const markAdCompleted = async () => {
    try {
      await markAsComplete(type, id);
      toast.success(
        type === "MILESTONE"
          ? "Milestone marked as completed"
          : "Task marked as completed",
      );
    } catch (error) {
      toast.error("Failed to mark as completed");
    }
  };
  return (
    <Checkbox
      className={clsx(
        "absolute ",
        type === "MILESTONE" ? "left-5" : "left-12",
disabled ? "top-5" : "top-5",
      )}
      disabled={disabled}
      defaultChecked={disabled}
      onClick={markAdCompleted}
    />
  );
};

export default MarkAsCompleteCheckbox;
