import React from "react";
import { Task } from "@prisma/client";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { EyeIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateDeliverable from "@/components/forms/create-deliverable";

const DeliverablesList = ({ delivarables }: { delivarables: Task[] }) => {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <CreateDeliverable />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {delivarables.map((task) => (
          <div
            key={task.id}
            className={clsx(
              "flex cursor-pointer items-center gap-4 rounded-lg border border-dashed p-4 shadow-sm animate-in fade-in-50 hover:bg-gray-50",
              task.type !== "MILESTONE" && "ml-8",
            )}
          >
            <Checkbox />
            <div className="grid w-full grid-cols-4 items-center justify-between">
              <div className="col-span-3 flex items-center gap-2">
                <h3
                  className={clsx(
                    "text-lg font-semibold capitalize",
                    (task.status === "FINISHED" || task.status === "CLOSED") &&
                      "line-through",
                  )}
                >
                  {task.name}
                </h3>
                {task.type === "MILESTONE" && (
                  <Badge variant="outline">Milestone</Badge>
                )}
                {task.status === "FINISHED" && (
                  <Button variant="link" size="sm">
                    Request revision
                  </Button>
                )}
              </div>
              <div className="col-span-1 flex items-center justify-end">
                {task.visibility === "PUBLIC" ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <EyeIcon className="size-5 text-green-600" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Visible to the client</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <EyeClosedIcon className="size-5 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Hidden from the client</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliverablesList;
