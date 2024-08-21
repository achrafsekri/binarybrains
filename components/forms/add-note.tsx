"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";
import { SendIcon } from "lucide-react";

const FormSchema = z.object({
  note: z.string().min(2, {
    message: "Note must be at least 2 characters.",
  }),
});

const AddNote = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      note: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      //   await createProject(data);
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full items-center justify-start gap-3"
      >
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="grid w-full grid-cols-7 gap-2">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-full"
                      placeholder="A very big project hopefully 🤩"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="col-span-1">
           <SendIcon size={24} />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddNote;
