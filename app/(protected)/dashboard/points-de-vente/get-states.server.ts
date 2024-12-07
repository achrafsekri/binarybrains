"use server";

import { State } from "@prisma/client";

import { getCurrentUser } from "@/lib/session";

export const getStates = async () => {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";
  const userStates = user?.states;
  return isAdmin ? Object.values(State) : userStates || [];
};
