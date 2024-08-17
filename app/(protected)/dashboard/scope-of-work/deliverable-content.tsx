"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Task, TaskStatus, Visibility } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { toast } from "@/components/ui/use-toast";

const deliverableSchema = z.object({
  timeToDeliver: z.number(),
  startDate: z.date(),
  completedAt: z.date().nullable(),
  status: z.nativeEnum(TaskStatus),
  visibility: z.nativeEnum(Visibility),
});

const DeliverableContent = ({ deliverable }: { deliverable: Task }) => {
  const defaultValues = {
    timeToDeliver: 10,
    startDate: deliverable.createdAt,
    completedAt: deliverable.completedAt || null,
    status: deliverable.status,
    visibility: deliverable.visibility,
  };
  const form = useForm<z.infer<typeof deliverableSchema>>({
    resolver: zodResolver(deliverableSchema),
    defaultValues: defaultValues,
  });

  async function onSubmit(data: z.infer<typeof deliverableSchema>) {
    try {
        console.log(data);
      toast({
        title: "You submitted the following values:",
        description: "hellooo",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred",
        description: error.message,
      });
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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
                      <GhostInput type="number" className="col-span-5" {...field} />
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
                    <div className="grid grid-cols-6 items-center gap-4">
                      <h3 className="col-span-1" key={deliverable.id}>
                        Deliverable Status
                      </h3>
                      <GhostInput type="select" className="col-span-5" {...field} />
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
                      <GhostInput type="select" className="col-span-5" {...field} />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid grid-cols-6 items-center gap-4">
                      <h3 className="col-span-1" key={deliverable.id}>
                        Start Date
                      </h3>
                      <GhostInput type="date" className="col-span-5" {...field} />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="completedAt"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid grid-cols-6 items-center gap-4">
                      <h3 className="col-span-1" key={deliverable.id}>
                        Completed At
                      </h3>
                      <GhostInput type="date" className="col-span-5" {...field} />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default DeliverableContent;
