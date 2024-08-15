"use client";

import React from "react";
import { createProject } from "@/actions/create-project.server";
import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility } from "@prisma/client";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

import { MinimalTiptapEditor } from "../shared/minimal-tiptap";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";

const FormSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  description: z.string().optional(),
  milestone: z.boolean().default(false),
  visibility: z.boolean().default(false),
  content: z.string().optional(),
});

const CreateTask = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      milestone: false,
      visibility: false,
      content: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      console.log(data);
      toast({
        title: "You submitted the following values:",
        description: "hellooo",
      });
      setOpenDialog(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred",
        description: error.message,
      });
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
          <span className="flex-1 truncate text-center">New Deliverable</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80%] max-w-[60%] overflow-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create a new Deliverable</DialogTitle>
              <DialogDescription>
                You can think of a deliverable as a task or a milestone.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="An awesome deliverable :)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="milestone"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Is this a milestone?
                    </FormLabel>
                    <FormDescription>
                      Milestones are significant points in a project.
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
                      Is this a public deliverable?
                    </FormLabel>
                    <FormDescription>
                      Public deliverables can be viewed by clients.
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
                      placeholder="Describe the deliverable"
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
                  <FormLabel className="sr-only">Description</FormLabel>
                  <FormControl>
                    <MinimalTiptapEditor
                      {...field}
                      throttleDelay={2000}
                      className={cn("w-full", {
                        "border-destructive focus-within:border-destructive":
                          form.formState.errors.description,
                      })}
                      editorContentClassName="p-5"
                      output="html"
                      placeholder="Type your description here..."
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

export default CreateTask;
