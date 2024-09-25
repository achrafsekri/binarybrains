import { type Customer, type Seller, type QuoteItem } from "@prisma/client";

export type QuoteForm = {
  SellerDetails: Partial<Seller>;
  ClientDetails: Partial<Customer>;
  ProductsList: Partial<QuoteItem>[];
  InvoiceDetails: {
    id: string;
    startingDate: Date | null;
    deliveryDate: Date | null;
    dueDate: Date | null;
    subtotal: number;
    vatRate: number | null;
    vatAmount: number | null;
    total: number | null;
    paymentTerms: string | null;
    paymentDetails: string | null;
    legalMentions: string | null;
    paymentDate: string | null;
  };
  Settings: {
    vatActivated: boolean;
    vatPerItem: boolean;
    vatRate: number;
    devise: string;
    color: string;
    showQuantity: boolean;
    showUnit: boolean;
  };
};
