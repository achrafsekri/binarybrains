"use server";

import { prisma } from "@/lib/db";

export const ContactUs = async (formData: FormData) => {
  const firstName = formData.get("first-name");
  const lastName = formData.get("last-name");
  const email = formData.get("email");
  const entreprise = formData.get("company");
  const message = formData.get("message");

  try {
    const contact = await prisma.contact.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: email as string,
        entreprise: entreprise as string,
        message: message as string,
      },
    });
    return contact;
  } catch (error) {
    console.log(error);
    throw new Error("Une erreur est survenue");
  }
};
