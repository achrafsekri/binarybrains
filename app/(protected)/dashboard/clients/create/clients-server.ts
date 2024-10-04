"use server";

import { Customer, User } from "@prisma/client";

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export const createCustomer = async (customer: Partial<Customer>, hasAcces: boolean , user:User) => {
  try {
    if (!hasAcces) throw new Error("Unauthorized");
    const { id } = await prisma.customer.create({ data: customer as Customer });
    return id;
  } catch (error) {
    logger.error("Error creating customer", error);
    throw error;
  }
};
