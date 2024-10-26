import { Quote, Seller, Customer, QuoteItem } from "@prisma/client";

export type QuoteWithRelations = Quote & {
  seller: Seller;
  customer: Customer;
  items: QuoteItem[];
};