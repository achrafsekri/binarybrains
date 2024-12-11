"use server";

import { State } from "@prisma/client";
import { DateRange } from "react-day-picker";

import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

export const getPos = async (
  state: State,
  productId: string,
  dateRange: DateRange | undefined,
) => {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";
  const userStates = user?.states;
  const allStates = Object.values(State);
  const filterByStates = state
    ? { state }
    : isAdmin
      ? {}
      : { state: { in: userStates || [] } };
  const startDate = dateRange?.from;
  const endDate = dateRange?.to;
  const pos = await prisma.pos.findMany({
    where: {
      ...filterByStates,
      ...(productId && {
        visits: {
          some: {
            disponibilities: {
              some: {
                productId,
                createdAt: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            },
          },
        },
      }),
    },
    include: {
      visits: {
        include: {
          disponibilities: true,
        },
      },
    },
  });
  return pos;
};
