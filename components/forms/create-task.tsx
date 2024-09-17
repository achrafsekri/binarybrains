"use client";

import React from "react";
import { createTask } from "@/actions/create-task.server";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MileStone } from "@/app/(protected)/dashboard/scope-of-work/milestones-list";

import { MinimalTiptapEditor } from "../shared/minimal-tiptap";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

export const CreateTaskFormSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  description: z.string().optional(),
  milestone: z.string().min(1, "Milestone is required"),
  visibility: z.boolean().default(false),
  content: z.any(),
});

const CreateTask = ({
  type = "BUTTOM",
  milestoneId,
  milestones,
}: {
  type: "BUTTOM" | "TOP";
  milestoneId?: string;
  milestones: MileStone[];
}) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const defaultValues = {
    title: "",
    description: "",
    milestone: milestoneId ? milestoneId : "",
    visibility: false,
    content: {},
  };
  const form = useForm<z.infer<typeof CreateTaskFormSchema>>({
    resolver: zodResolver(CreateTaskFormSchema),
    defaultValues: defaultValues,
  });

  async function onSubmit(data: z.infer<typeof CreateTaskFormSchema>) {
    try {
      const dataToSend = {
        ...data,
        content: JSON.parse(data.content),
      };
      setLoading(true);
      await createTask(dataToSend);
      toast.success("Task created successfully");
      form.reset();
      setOpenDialog(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create Task");
      setLoading(false);
    }
  }
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <>
          {type === "TOP" && (
            <Button
              className="relative flex h-9 items-center justify-center gap-2 p-2"
              variant="outline"
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              <Plus size={18} className="" />
              <span className="flex-1 truncate text-center">New Task</span>
            </Button>
          )}
          {type === "BUTTOM" && (
            <div
              className="ml-8 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 p-2 hover:bg-gray-50"
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Plus size={18} className="" />
                <span className="flex-1 truncate text-center">
                  Add a task to this milestone
                </span>
              </div>
            </div>
          )}
        </>
      </DialogTrigger>
      <DialogContent className="max-h-[80%] max-w-[60%] overflow-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create a new Task</DialogTitle>
              <DialogDescription>
                Fill in the form below to create a new task
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="An awesome task :)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="milestone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a milestone</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          disabled={milestones.length === 0 || !!milestoneId}
                          aria-expanded={open}
                          className="w-full justify-between"
                        >
                          {field.value
                            ? milestones.find(
                                (milestone) => milestone.id === field.value,
                              )?.name
                            : "Select milestone..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search milestone..." />
                          <CommandList>
                            <CommandEmpty>No milestone found.</CommandEmpty>
                            <CommandGroup>
                              {milestones &&
                                milestones?.map((milestone) => (
                                  <CommandItem
                                    key={milestone.id}
                                    value={milestone.id}
                                    onSelect={(currentValue) => {
                                      field.onChange(
                                        currentValue === field.value
                                          ? ""
                                          : currentValue,
                                      );
                                      setOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === milestone.id
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {milestone.name}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Is this a public task?
                    </FormLabel>
                    <FormDescription>
                      Public tasks can be viewed by clients.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description
                    <span className="ml-1 text-gray-500">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the task"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="">Content</FormLabel>
                  <FormControl>
                    <MinimalTiptapEditor
                      {...field}
                      throttleDelay={2000}
                      className={cn("w-full", {
                        "border-destructive focus-within:border-destructive":
                          form.formState.errors.content,
                      })}
                      editorContentClassName="p-5"
                      output="json"
                      placeholder="Type your content here..."
                      autofocus={true}
                      immediatelyRender={true}
                      editable={true}
                      injectCSS={true}
                      shouldRerenderOnTransaction={false}
                      editorClassName="focus:outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {loading && <Spinner className="mr-2" size="small" />}
                {loading ? "Creating..." : "Create Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTask;
