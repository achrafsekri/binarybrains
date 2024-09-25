"use server";

import { prisma } from "@/lib/db";

export const createInvoice = async (data) => {
  try {
    const res = await prisma.invoice.create({
      data,
    });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const createSeller = async (data) => {
  try {
    const res = await prisma.seller.create({ data });

    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createCustomer = async (data) => {
  try {
    const res = await prisma.customer.create({ data });
    return res;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createItems = async (data) => {
  try {
    const res = await prisma.item.createManyAndReturn({ data });
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
};
