"use server";

import { prisma } from "@/lib/db";

export const getProductDisponibilityByPos = async (
  posId: string,
  startDate: Date,
  endDate: Date,
) => {
  const disponibilities = await prisma.disponibility.groupBy({
    by: ["productId"],
    where: {
      visit: { posId, createdAt: { gte: startDate, lte: endDate } },
    },
  });
};
