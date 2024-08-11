"use client";

import React from "react";
import { createProject } from "@/actions/create-project.server";
import { zodResolver } from "@hookform/resolvers/zod";
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

import { Spinner } from "../ui/spinner";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string(),
  color: z.string(),
  criteriaForSuccess: z.string(),
  deadline: z.date().nullable(),
  passCode: z.string().min(2, {
    message: "Passcode must be at least 2 characters.",
  }),
});

const CreateProject = ({
  setOpenPopover,
}: {
  setOpenPopover: (value: boolean) => void;
}) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "",
      criteriaForSuccess: "",
      deadline: null,
      passCode: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      await createProject(data);
      toast({
        title: "You submitted the following values:",
        description: "hellooo",
      });
      setOpenDialog(false);
      setOpenPopover(false);
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
          variant="outline"
          className="relative flex h-9 items-center justify-center gap-2 p-2"
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          <Plus size={18} className="absolute left-2.5 top-2" />
          <span className="flex-1 truncate text-center">New Project</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80%] overflow-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Create a new project</DialogTitle>
              <DialogDescription>
                Create a new project and explore a new way of managing your
                client projects.
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="A very big project hopefully 🤩"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The name of the project that will be displayed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Color</FormLabel>
                  <FormControl>
                    <Input type="color" placeholder="#ff0000" {...field} />
                  </FormControl>
                  <FormDescription>
                    The color that will represent the project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Passcode</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    The passcode that clients will use to access the project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Project Description
                    <span className="ml-1 text-sm text-gray-500 dark:text-gray-300">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A very big project hopefully 🤩"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    A brief description of the project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="criteriaForSuccess"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Criteria for Success
                    <span className="ml-1 text-sm text-gray-500 dark:text-gray-300">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="The project will be successful if..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The criteria that will define the success of the project.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
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
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription>
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

export default CreateProject;
