"use server";

import { revalidatePath } from "next/cache";
import { createNotification } from "@/actions/create-notifiction.server";
import { NotificationType, State } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

import { PosFormValues } from "./NewPosForm";

export const createPos = async (values: PosFormValues) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");
    const createdPos = await prisma.pos.create({
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
    await createNotification(
      "Nouveau point de vente",
      `Un nouveau point de vente a été ajouté`,
      NotificationType.ADDED_POS,
      `/dashboard/points-de-vente/${createdPos.id}`,
    );
    revalidatePath("/dashboard/points-de-vente");
    return { ok: true };
  } catch (error) {
    throw error;
  }
};
