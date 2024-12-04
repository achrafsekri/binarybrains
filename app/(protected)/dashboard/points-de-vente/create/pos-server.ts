"use server";
import { State } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

import { PosFormValues } from "./NewPosForm";

export const createPos = async (values: PosFormValues) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");
    await prisma.pos.create({
      data: {
        nom: values.name,
        description: values.description,
        state: values.state as State,
        city: values.city,
        zip: values.zip,
        lat: values.lat ?? "",
        lng: values.lng ?? "",
      },
    });
    return { ok: true };
  } catch (error) {
    throw error;
  }
};
