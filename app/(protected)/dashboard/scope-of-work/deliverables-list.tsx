import React from "react";
import { Task } from "@prisma/client";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { EyeIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CreateDeliverable from "@/components/forms/create-deliverable";

import DeliverableContent from "./deliverable-content";

const DeliverablesList = ({ delivarables }: { delivarables: Task[] }) => {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <CreateDeliverable />
      </div>
      <div className="grid grid-cols-1 gap-4">
        {delivarables.map((task) => (
          <Dialog>
            <DialogTrigger asChild>
              <div
                key={task.id}
                className={clsx(
                  "flex cursor-pointer items-center gap-4 rounded-lg border border-dashed p-4 shadow-sm animate-in fade-in-50 hover:bg-gray-50",
                  // task.type !== "MILESTONE" && "ml-8",
                )}
              >
                <Checkbox />
                <div className="grid w-full grid-cols-4 items-center justify-between">
                  <div className="col-span-3 flex items-center gap-2">
                    <h3
                      className={clsx(
                        "text-lg font-semibold capitalize",
                        (task.status === "FINISHED" ||
                          task.status === "CLOSED") &&
                          "line-through",
                      )}
                    >
                      {task.name}
                    </h3>
                    {task.type === "MILESTONE" && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">Milestone</Badge>
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
            </DialogTrigger>
            <DialogContent className="md:max-h-[80vh] md:max-w-[70vw]">
              <DialogHeader className="relative">
                <DialogTitle className="mt-8 text-3xl font-semibold">
                  {task.name}
                </DialogTitle>
                <span className="absolute left-0 top-0 text-sm text-gray-500">
                  {task.type === "MILESTONE" ? "Milestone" : "Deliverable"}
                </span>

                <Button
                  variant="link"
                  size="sm"
                  className="absolute right-0 top-0 text-sm"
                >
                  Request revision
                </Button>
              </DialogHeader>
              <DeliverableContent deliverable={task} />
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default DeliverablesList;
