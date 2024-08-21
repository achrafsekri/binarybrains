"use client";

import React from "react";
import { createMilestone } from "@/actions/create-milestone.server";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

import { MinimalTiptapEditor } from "../shared/minimal-tiptap";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";

export const CreateMilestoneFormSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  dueDate: z.date().nullable(),
  addWatermark: z.boolean().default(false),
  visibility: z.boolean().default(false),
  content: z.any(),
});

const CreateMilestone = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const form = useForm<z.infer<typeof CreateMilestoneFormSchema>>({
    resolver: zodResolver(CreateMilestoneFormSchema),
    defaultValues: {
      title: "",
      dueDate: null,
      addWatermark: false,
      visibility: false,
      content: {},
    },
  });

  async function onSubmit(data: z.infer<typeof CreateMilestoneFormSchema>) {
    try {
      const dataToSend = {
        ...data,
        content: JSON.parse(data.content),
      };
      setLoading(true);
      await createMilestone(dataToSend);
      toast.success("Task created successfully");
      setOpenDialog(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("failed to create milestone");
      setLoading(false);
    }
  }
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button
          className="relative flex h-9 items-center justify-center gap-2 p-2"
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          <Plus size={18} className="" />
          <span className="flex-1 truncate text-center">New Milestone</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80%] max-w-[60%] overflow-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create a new Milestone</DialogTitle>
              <DialogDescription>
                You can think of a milestone as a task or a milestone.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="An awesome milestone :)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>
                    DeadLine{" "}
                    <span className="ml-1 text-sm text-gray-500 dark:text-gray-300">
                      (optional)
                    </span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        //@ts-expect-error
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Setting a due date helps you stay on track
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addWatermark"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Would you like to add a watermark?
                    </FormLabel>
                    <FormDescription>
                      Adding a watermark to your deliverables help keep your
                      work protected
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
              name="visibility"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Is this a public milestone?
                    </FormLabel>
                    <FormDescription>
                      Public milestones can be viewed by clients.
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
                {loading ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMilestone;
