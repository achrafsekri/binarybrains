"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { switchProject } from "@/actions/switch-projects.server";
import { type Project } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useSession } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import CreateProject from "../forms/create-project";

export default function ProjectSwitcher({
  large = false,
  projects,
  currentProject,
}: {
  large?: boolean;
  projects: Project[];
  currentProject: Project | null;
}) {
  const { data: session, status } = useSession();
  const [openPopover, setOpenPopover] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!projects || status === "loading" || loading) {
    return <ProjectSwitcherPlaceholder />;
  }

  return (
    <div>
      <Popover open={openPopover} onOpenChange={setOpenPopover}>
        <PopoverTrigger>
          <Button
            className="h-8 px-2"
            variant={openPopover ? "secondary" : "ghost"}
            onClick={() => setOpenPopover(!openPopover)}
          >
            {currentProject && (
              <div className="flex items-center space-x-3 pr-2">
                <div
                  className={cn("size-3 shrink-0 rounded-full")}
                  style={{
                    backgroundColor: currentProject.color ?? "rgb(203 213 225)",
                  }}
                />
                <div className="flex items-center space-x-3">
                  <span
                    className={cn(
                      "inline-block truncate text-sm font-medium xl:max-w-[120px]",
                      large ? "w-full" : "max-w-[80px]",
                    )}
                  >
                    {currentProject.name}
                  </span>
                </div>
              </div>
            )}
            {!currentProject && (
              <div className="flex items-center space-x-3 pr-2">
                <div
                  className={cn("size-3 shrink-0 rounded-full", "bg-gray-300")}
                />
                <div className="flex items-center space-x-3">
                  <span
                    className={cn(
                      "inline-block truncate text-sm font-medium xl:max-w-[120px]",
                      large ? "w-full" : "max-w-[80px]",
                    )}
                  >
                    No projects yet
                  </span>
                </div>
              </div>
            )}
            <ChevronsUpDown
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="max-w-60 p-2">
          <ProjectList
            selected={currentProject}
            projects={projects}
            setOpenPopover={setOpenPopover}
            setLoading={setLoading}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function ProjectList({
  selected,
  projects,
  setOpenPopover,
  setLoading,
}: {
  selected: Project | null;
  projects: Project[];
  setOpenPopover: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
}) {
  const router = useRouter();
  const handleSwitchProject = async (id: string) => {
    setLoading(true);
    try {
      await switchProject(id);
      setOpenPopover(false);
      setLoading(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-1">
      {projects.map(({ slug, name, id, color }) => (
        <div
          key={slug}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "relative flex h-9 cursor-pointer items-center gap-3 p-3 text-muted-foreground hover:text-foreground",
          )}
          onClick={() => handleSwitchProject(id)}
        >
          <div
            className={cn("size-3 shrink-0 rounded-full")}
            style={{ backgroundColor: color ?? "#00000" }}
          />
          <span
            className={`flex-1 truncate text-sm ${
              selected?.slug === slug
                ? "font-medium text-foreground"
                : "font-normal"
            }`}
          >
            {name}
          </span>
          {selected?.slug === slug && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-foreground">
              <Check size={18} aria-hidden="true" />
            </span>
          )}
        </div>
      ))}
      <CreateProject setOpenPopover={setOpenPopover} />
    </div>
  );
}

function ProjectSwitcherPlaceholder() {
  return (
    <div className="flex animate-pulse items-center space-x-1.5 rounded-lg px-1.5 py-2 sm:w-60">
      <div className="h-8 w-36 animate-pulse rounded-md bg-muted xl:w-[180px]" />
    </div>
  );
}
