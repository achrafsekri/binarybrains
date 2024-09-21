import React from "react";
import { markAsComplete } from "@/actions/mark-as-complete.server";
import { Asset, Milestone, Note, Task } from "@prisma/client";
import { EyeClosedIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { EyeIcon, File } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import AssetsPicker from "@/components/dashboard/AssetsPicker";
import Notes from "@/components/dashboard/notes";
import CreateMilestone from "@/components/forms/create-milestone";
import CreateTask from "@/components/forms/create-task";
import AssetPreview from "@/components/shared/asset-preview";

import MarkAsCompleteCheckbox from "./MarkAsCompleteCheckbox";
import MilestoneContent from "./milestone-content";
import TaskContent from "./task-content";

export type MileStone = Milestone & {
  Assets: Asset[];
  Tasks: Task[];
  notes: Note[];
};

const DeliverablesList = ({ milestones }: { milestones: MileStone[] }) => {
  return (
    <div>
      <div className="mb-4 flex items-center justify-end gap-4">
        <CreateTask type="TOP" milestones={milestones} />
        <CreateMilestone />
      </div>
      <div className="grid grid-cols-1 gap-8">
        {milestones.map((milestone) => (
          <div className="relative grid grid-cols-1 gap-4">
            <MarkAsCompleteCheckbox
              disabled={
                milestone.status === "FINISHED" || milestone.status === "CLOSED"
              }
              type="MILESTONE"
              id={milestone.id}
            />
            <Dialog>
              <DialogTrigger asChild>
                <div
                  key={milestone.id}
                  className={clsx(
                    "flex cursor-pointer items-center gap-4 rounded-lg border border-dashed p-4 pl-12 shadow-sm animate-in fade-in-50 hover:bg-gray-50 dark:hover:bg-zinc-900",
                    // milestone.type !== "MILESTONE" && "ml-8",
                  )}
                >
                  <div className="grid w-full grid-cols-4 items-center justify-between">
                    <div className="col-span-3 flex items-center gap-2">
                      <h3
                        className={clsx(
                          "text-lg font-semibold capitalize",
                          (milestone.status === "FINISHED" ||
                            milestone.status === "CLOSED") &&
                            "line-through",
                        )}
                      >
                        {milestone.name}
                      </h3>

                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800"
                      >
                        Milestone
                      </Badge>

                      {milestone.status === "CLOSED" && (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800"
                        >
                          Completed
                        </Badge>
                      )}
                      {milestone.status === "FINISHED" && (
                        <p className="text-sm text-gray-500">
                          You can now request a revision
                        </p>
                      )}
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                      {milestone.visibility === "PUBLIC" ? (
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
              <DialogContent className="max-h-[90vh] overflow-auto md:max-h-[80vh] md:max-w-[70vw]">
                <DialogDescription className="sr-only">
                  {milestone.name}
                </DialogDescription>
                <DialogHeader className="relative">
                  <DialogTitle className="mt-8 flex items-center gap-4 text-3xl font-semibold">
                    {milestone.name}{" "}
                    {milestone.visibility === "PRIVATE" && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <EyeClosedIcon className="size-5 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Hidden from the client</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </DialogTitle>
                  <span className="absolute left-0 top-0 text-sm text-gray-500">
                    Milestone
                  </span>

                  <Button
                    variant="link"
                    size="sm"
                    className="absolute right-0 top-0 text-sm"
                  >
                    Request revision
                  </Button>
                </DialogHeader>
                <MilestoneContent deliverable={milestone} />
                <div className="mt-8">
                  <h2 className="mb-4 text-xl font-semibold">Assets</h2>
                  {milestone.Assets.length == 0 && (
                    <AssetsPicker type="EMPTY" taskId={milestone.id} />
                  )}
                  {milestone.Assets.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <AssetsPicker type="NOT_EMPTY" taskId={milestone.id} />
                      {milestone.Assets.map((asset) =>
                        asset.type == "DOCUMENT" ? (
                          <a
                            href={asset.url}
                            target="_blank"
                            className="flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-zinc-900"
                          >
                            <File className="h-12 w-12 text-gray-500 dark:text-gray-300" />
                          </a>
                        ) : (
                          <AssetPreview
                            asset={asset}
                            key={asset.id}
                            watermark={milestone.addWatermark}
                          />
                        ),
                      )}
                    </div>
                  )}
                </div>
                <Notes notes={milestone.notes} />
                <DialogFooter>
                  <Button type="button">Mark as completed</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {milestone.Tasks?.length > 0 &&
              milestone.Tasks?.map((task: Task) => (
                <div className="relative">
                  <MarkAsCompleteCheckbox
                    disabled={
                      task.status === "FINISHED" || task.status === "CLOSED"
                    }
                    type="TASK"
                    id={task.id}
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <div
                        key={task.id}
                        className={clsx(
                          "ml-8 flex cursor-pointer items-center gap-4 rounded-lg border border-dashed p-4 pl-12 shadow-sm animate-in fade-in-50 hover:bg-gray-50 dark:hover:bg-zinc-900",
                          // task.type !== "MILESTONE" && "ml-8",
                        )}
                      >
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

                            <Badge
                              variant="outline"
                              className="bg-pink-100 text-pink-800"
                            >
                              Task
                            </Badge>
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
                    <DialogContent className="max-h-[90vh] overflow-auto md:max-h-[80vh] md:max-w-[70vw]">
                      <DialogDescription className="sr-only">
                        {task.name}
                      </DialogDescription>
                      <DialogHeader className="relative">
                        <DialogTitle className="mt-8 flex items-center gap-4 text-3xl font-semibold">
                          {task.name}{" "}
                          {task.visibility === "PRIVATE" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <EyeClosedIcon className="size-5 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Hidden from the client</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </DialogTitle>
                        <span className="absolute left-0 top-0 text-sm text-gray-500">
                          Task
                        </span>

                        <Button
                          variant="link"
                          size="sm"
                          className="absolute right-0 top-0 text-sm"
                        >
                          Request revision
                        </Button>
                      </DialogHeader>
                      <TaskContent deliverable={task} />

                      {/* <Notes /> */}
                      <DialogFooter>
                        <Button type="button">Mark as completed</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            <CreateTask
              type="BUTTOM"
              milestones={milestones}
              milestoneId={milestone.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliverablesList;
