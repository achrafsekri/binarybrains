"use client";

import { json } from "stream/consumers";
import React from "react";
import { UpdateDeliverable } from "@/actions/update-deliverable.server";
import { zodResolver } from "@hookform/resolvers/zod";
import { Task, TaskStatus, Visibility } from "@prisma/client";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GhostInput } from "@/components/ui/ghost-input";
import {
  GhostSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/ghost-select";
import { toast } from "@/components/ui/use-toast";
import AutoSave from "@/components/forms/auto-save";
import { MinimalTiptapEditor } from "@/components/shared/minimal-tiptap";

export const deliverableSchema = z.object({
  timeToDeliver: z.number(),
  status: z.nativeEnum(TaskStatus),
  visibility: z.nativeEnum(Visibility),
  content: z.any(),
});

const deliverableStatus = [
  { label: "Open", value: TaskStatus.OPEN },
  { label: "In Progress", value: TaskStatus.IN_PROGRESS },
  { label: "Finished", value: TaskStatus.FINISHED },
  { label: "Pending Review", value: TaskStatus.PENDING_REVIEW },
  { label: "Changes Requested", value: TaskStatus.CHANGES_REQUESTED },
  { label: "Closed", value: TaskStatus.CLOSED },
];

const deliverableVisibility = [
  { label: "Public", value: Visibility.PUBLIC },
  { label: "Private", value: Visibility.PRIVATE },
];

const DeliverableContent = ({ deliverable }: { deliverable: Task }) => {
  const defaultValues = {
    timeToDeliver: 10,
    status: deliverable.status,
    visibility: deliverable.visibility,
    content: deliverable.content,
  };
  const form = useForm<z.infer<typeof deliverableSchema>>({
    resolver: zodResolver(deliverableSchema),
    defaultValues: defaultValues,
  });

  async function onSubmit(data: z.infer<typeof deliverableSchema>) {
    const dataToSend = {
      ...data,
      //  if type of content is string, then parse it to JSON
      content:
        typeof data.content === "string"
          ? JSON.parse(data.content)
          : data.content,
    };
    try {
      await UpdateDeliverable(deliverable.id, dataToSend);
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: error.message,
      });
    }
  }
  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AutoSave defaultValues={defaultValues} onSubmit={onSubmit} />
          <div className="">
            <div className="grid grid-cols-1">
              <FormField
                control={form.control}
                name="timeToDeliver"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-6 items-center gap-4">
                        <h3 className="col-span-1" key={deliverable.id}>
                          Time to deliver
                        </h3>
                        <GhostInput
                          type="number"
                          className="col-span-5"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-6 items-center gap-4">
                        <h3 className="col-span-1" key={deliverable.id}>
                          Deliverable Visibility
                        </h3>
                        <GhostSelect
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="col-span-5">
                            <SelectValue placeholder="Select a visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Deliverable Visibility</SelectLabel>
                              {deliverableVisibility.map((visibility) => (
                                <SelectItem
                                  key={visibility.value}
                                  value={visibility.value}
                                >
                                  {visibility.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </GhostSelect>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid w-full grid-cols-6 items-center gap-4">
                        <h3 className="col-span-1" key={deliverable.id}>
                          Deliverable Status
                        </h3>
                        {/* <GhostSelect
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="col-span-5">
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Deliverable Status</SelectLabel>
                            {deliverableStatus.map((status) => (
                              <SelectItem
                                key={status.value}
                                value={status.value}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </GhostSelect> */}
                        <div className="col-span-5 rounded-lg px-3 py-3 text-sm dark:hover:bg-zinc-900 hover:bg-gray-50">
                          {deliverable.status === TaskStatus.OPEN && (
                            <Badge
                              className="border-gray-200 bg-gray-100 text-gray-800"
                              variant="outline"
                            >
                              Open
                            </Badge>
                          )}
                          {deliverable.status === TaskStatus.IN_PROGRESS && (
                            <Badge
                              className="border-blue-200 bg-blue-100 text-blue-800"
                              variant="outline"
                            >
                              In Progress
                            </Badge>
                          )}
                          {deliverable.status === TaskStatus.FINISHED && (
                            <Badge
                              className="border-purple-200 bg-purple-100 text-purple-800"
                              variant="outline"
                            >
                              Finished
                            </Badge>
                          )}
                          {deliverable.status === TaskStatus.PENDING_REVIEW && (
                            <Badge
                              className="border-yellow-200 bg-yellow-100 text-yellow-800"
                              variant="outline"
                            >
                              Pending Review
                            </Badge>
                          )}
                          {deliverable.status ===
                            TaskStatus.CHANGES_REQUESTED && (
                            <Badge
                              className="border-red-200 bg-red-100 text-red-800"
                              variant="outline"
                            >
                              Changes Requested
                            </Badge>
                          )}
                          {deliverable.status === TaskStatus.CLOSED && (
                            <Badge
                              className="border-green-200 bg-green-100 text-green-800"
                              variant="outline"
                            >
                              Closed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-6 items-center gap-4">
                <h3 className="col-span-1" key={deliverable.id}>
                  Start Date
                </h3>
                <div className="col-span-5 rounded-lg px-3 py-3 text-sm dark:hover:bg-zinc-900 hover:bg-gray-50">
                  {new Date(deliverable.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-6 items-center gap-4">
                <h3 className="col-span-1" key={deliverable.id}>
                  Completed At
                </h3>
                <div className="col-span-5 rounded-lg px-3 py-3 text-sm dark:hover:bg-zinc-900 hover:bg-gray-50">
                  {deliverable.completedAt ? (
                    <div className="">
                      {new Date(deliverable.completedAt).toLocaleDateString()}
                    </div>
                  ) : (
                    <div className="">Not completed yet</div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-8">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <MinimalTiptapEditor
                        value={field.value}
                        onChange={field.onChange}
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
            </div>
          </div>
        </form>
      </Form>
    </FormProvider>
  );
};

export default DeliverableContent;
