import React from "react";
import { Invoice } from "@prisma/client";
import {
  Document,
  Image,
  Line,
  Page,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";

import { InvoiceWithRelations } from "@/types/invoice-with-relations";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  logo: {
    width: 40,
    position: "absolute",
    top: 45,
    right: 60,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
    fontWeight: "bold",
  },
  invoiceInfo: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
    gap: 15,
  },
  infoItem: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderStyle: "dashed",
    fontWeight: "medium",
    borderColor: "#000000",
    borderRadius: 9999,
    fontSize: 10,
  },
  companySection: {
    color: "rgb(55 65 81)",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    marginTop: 10,
  },
  companyInfo: {
    flex: 1,
    fontSize: 12,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  customerInfo: {
    minWidth: 200,
    alignItems: "flex-start",
    fontSize: 12,
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  highlight: {
    fontWeight: 700,
    color: "rgb(17 24 39)",
  },
  normal: {
    fontWeight: 400,
    fontSize: 12,
    color: "rgb(55 65 81)",
  },
  table: {
    flexDirection: "column",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1C2833",
    color: "#FFFFFF",
    padding: 10,
    fontSize: 14,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    padding: 10,
    fontSize: 14,
  },
  description: {
    flex: 2,
  },
  quantity: {
    flex: 1,
    textAlign: "center",
  },
  price: {
    flex: 1,
    textAlign: "center",
  },
  total: {
    flex: 1,
    textAlign: "center",
  },
  subtotalSection: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginTop: 20,
  },
  subtotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 5,
    marginTop: 5,
  },
  subtotalLabel: {
    width: 100,
    textAlign: "left",
    fontSize: 14,
  },
  subtotalValue: {
    width: 80,
    textAlign: "right",
    fontSize: 14,
    fontWeight: 700,
  },
  paymentSection: {
    marginTop: 40,
    fontSize: 14,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

type InvoiceTemplateAProps = {
  invoice: InvoiceWithRelations;
};

// Create Document Component
const InvoiceTemplateA = ({ invoice }: InvoiceTemplateAProps) => {
  if (!invoice) return null;
  const { seller, customer, items, total, vatAmount, subtotal } = invoice;
  // french date format october 19, 2021
  const invoiceDate = format(new Date(invoice.createdAt), "MMMM dd, yyyy");
  const dueDate = format(new Date(invoice.dueDate ?? ""), "MMMM dd, yyyy");
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image
          src="https://react-pdf.org/images/logo.png"
          style={styles.logo}
        />
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Facture</Text>
          <View style={styles.invoiceInfo}>
            <Text style={styles.infoItem}>Facture* {invoice?.number}</Text>
            <Text style={styles.infoItem}>{invoiceDate}</Text>
            <Text style={styles.infoItem}>Échéance {dueDate}</Text>
          </View>
          <Svg height="6" width="900px">
            <Line
              x1="0"
              y1="5"
              x2="530"
              y2="5"
              strokeWidth={1}
              stroke="rgb(229 231 235)"
            />
          </Svg>
        </View>

        {/* Company and Customer Info */}
        <View style={styles.companySection}>
          <View style={styles.companyInfo}>
            <Text style={styles.highlight}>{seller.name}</Text>
            <Text style={styles.normal}>SIRET: {seller?.siret}</Text>
            <Text style={styles.normal}>{seller?.address}</Text>
            <Text style={styles.normal}>{seller?.phone}</Text>
            <Text style={styles.normal}>{seller?.email}</Text>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.highlight}>À l'attention de:</Text>
            <Text style={styles.normal}>{customer?.name}</Text>
            <Text style={styles.normal}>SIRET: {customer?.siret}</Text>
            <Text style={styles.normal}>{customer?.address}</Text>
            <Text style={styles.normal}>{customer?.phone}</Text>
            <Text style={styles.normal}>{customer?.email}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.description}>Description</Text>
            <Text style={styles.quantity}>Quantité</Text>
            {invoice.vatPerItem && <Text style={styles.price}>TVA</Text>}
            <Text style={styles.price}>Prix</Text>
            <Text style={styles.total}>Total</Text>
          </View>

          {items.map((item) => (
            <View style={styles.tableRow}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.quantity}>{item.quantity}</Text>
              {item.vatRate && <Text style={styles.price}>{item.vatRate}</Text>}
              <Text style={styles.price}>{item.unitPrice}</Text>
              <Text style={styles.total}>{item.totalPrice}</Text>
            </View>
          ))}
        </View>

        {/* Subtotal Section */}
        <View style={styles.subtotalSection}>
          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>
            <Text style={styles.subtotalValue}>
              {subtotal} {invoice.devise ? invoice.devise : ""}
            </Text>
          </View>
          <Svg height="6" width="180px">
            <Line
              x1="0"
              y1="5"
              x2="180"
              y2="5"
              strokeWidth={1}
              stroke="rgb(229 231 235)"
            />
          </Svg>
          <View style={styles.subtotalRow}>
            {invoice.vatActivated && (
              <Text style={styles.subtotalLabel}>VAT ({invoice.vatRate}%)</Text>
            )}
            <Text style={styles.subtotalValue}>
              {vatAmount} {invoice.devise ? invoice.devise : ""}
            </Text>
          </View>
          <Svg height="6" width="180px">
            <Line
              x1="0"
              y1="5"
              x2="180"
              y2="5"
              strokeWidth={1}
              stroke="rgb(229 231 235)"
            />
          </Svg>
          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>Total</Text>
            <Text style={styles.subtotalValue}>
              {total} {invoice.devise ? invoice.devise : ""}
            </Text>
          </View>
        </View>

        {/* Payment Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Règlement</Text>
          <Text style={styles.normal}>
            {invoice.paymentTerms ? invoice.paymentTerms : ""}
          </Text>
          <Text style={styles.normal}>
            {invoice.paymentDetails ? invoice.paymentDetails : ""}
          </Text>
          <Text style={{ fontSize: 10 }}>
            {invoice.legalMentions ? invoice.legalMentions : ""}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceTemplateA;
