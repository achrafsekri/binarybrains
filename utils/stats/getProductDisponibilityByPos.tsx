"use server";

import { prisma } from "@/lib/db";

export const getProductDisponibilityByPos = async (
  posId: string,
  startDate: Date,
  endDate: Date,
) => {
  // First, get the list of products for company SK
  const skProducts = await prisma.product.findMany({
    where: {
      company: {
        code: "SK",
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  // Then, get the disponibility for these products
  const disponibilities = await Promise.all(
    skProducts.map(async (product) => {
      const disponibility = await prisma.disponibility.count({
        where: {
          productId: product.id,
          disponibility: true,
          visit: {
            posId,
            createdAt: { gte: startDate, lte: endDate },
          },
        },
      });

      return {
        productId: product.id,
        productName: product.name,
        disponibility,
        available: disponibility === 0 ? false : true,
      };
    }),
  );

  return {
    score: `${disponibilities.filter((d) => d.disponibility).length}/${
      skProducts.length
    }`,
    disponibilities,
  };
};
