"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/db";

import { VisitFormValues } from "./NewVistForm";

export const createVisit = async (visit: VisitFormValues) => {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const addedDisponibilities = visit.disponibilities.map((disponibility) => ({
    ...disponibility,
    disponibility: true,
  }));
  const productsIds = addedDisponibilities.map((d) => d.productId);
  console.log("productsIds", productsIds);
  const dbProducts = await prisma.product.findMany();
  const notFoundProducts = dbProducts
    .filter((dbProduct) => !productsIds.includes(dbProduct.id))
    .map((p) => {
      return {
        productId: p.id,
        disponibility: false,
        price: 0,
      };
    });
  console.log("notFoundProducts", notFoundProducts);
  const mergedDisponibilities = [...addedDisponibilities, ...notFoundProducts];
  console.log("mergedDisponibilities", mergedDisponibilities);
  try {
    await prisma.visit.create({
      data: {
        lat: visit.lat,
        lng: visit.lng,
        posId: visit.posId,
        validated: visit.validated,
        note: visit.note,
        file: visit.file,
        userId: session.user.id as string,
        disponibilities: {
          create: mergedDisponibilities,
        },
      },
    });
  } catch (error) {
    throw error;
  }
};
