"use server";

import { Customer, User } from "@prisma/client";

import { prisma } from "@/lib/db";

export const createCustomer = async (customer: Partial<Customer>, hasAcces: boolean , user:User) => {
  try {
    if (!hasAcces) throw new Error("Unauthorized");
    const { id } = await prisma.customer.create({ data: customer as Customer });
    return id;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
