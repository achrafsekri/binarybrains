"use server";

import { auth } from "@/auth";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/db";

import { UserFormValues } from "./NewUserForm";

export const createUser = async (user: UserFormValues) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
