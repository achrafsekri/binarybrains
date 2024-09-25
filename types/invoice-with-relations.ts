import { type Customer, type Invoice, type Seller } from "@prisma/client";

export type InvoiceWithRelations = Invoice & {
  seller: Seller;
  customer: Customer;
};
