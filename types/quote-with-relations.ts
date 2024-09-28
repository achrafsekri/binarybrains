import { Quote, Seller, Customer } from "@prisma/client";

export type QuoteWithRelations = Quote & {
  seller: Seller;
  customer: Customer;
};