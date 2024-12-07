import React from "react";
import {
  Document,
  Image,
  Line,
  Link,
  Page,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { QuoteWithRelations } from "@/types/quote-with-relations";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  logo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  logoContainer: {
    position: "absolute",
    width: 45,
    height: 45,
    backgroundColor: "#222222",
    top: 30,
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
    //remove link underline
    textDecoration: "none",
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
    padding: 5,
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

type QuoteTemplateAProps = {
  quote: QuoteWithRelations;
};

// Create Document Component
const QuoteTemplateA = ({ quote }: QuoteTemplateAProps) => {
  if (!quote) return null;
  const { seller, customer, items, total, vatAmount, subtotal } = quote;
  // french date format october 19, 2021
  const quoteDate = format(new Date(quote.createdAt), "MMMM dd, yyyy");
  const dueDate = format(new Date(quote.validUntil ?? ""), "MMMM dd, yyyy");

  // Convert logo to PNG format
  const logoUrl = seller.logo ? seller.logo.replace(/\.[^/.]+$/, ".png") : null;
  const showQuantity = quote?.showQuantity;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {logoUrl && (
          <View style={styles.logoContainer}>
            <Image style={styles.logo} source={logoUrl} />
          </View>
        )}
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Devis</Text>
          <View style={styles.invoiceInfo}>
            <Text style={styles.infoItem}>Devis° {quote?.number}</Text>
            <Text style={styles.infoItem}>{quoteDate}</Text>
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
            <Link style={styles.normal} src={`tel:${seller?.phone}`}>
              {seller?.phone}
            </Link>
            <Link style={styles.normal} src={`mailto:${seller?.email}`}>
              {seller?.email}
            </Link>
          </View>
          <View style={styles.customerInfo}>
            <Text style={styles.highlight}>À l&apos;attention de:</Text>
            <Text style={styles.normal}>{customer?.name}</Text>
            <Text style={styles.normal}>SIRET: {customer?.siret}</Text>
            <Text style={styles.normal}>{customer?.address}</Text>
            <Link style={styles.normal} src={`tel:${customer?.phone}`}>
              {customer?.phone}
            </Link>
            <Link style={styles.normal} src={`mailto:${customer?.email}`}>
              {customer?.email}
            </Link>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.description}>Description</Text>
            {showQuantity && <Text style={styles.quantity}>Quantité</Text>}
            {quote.vatPerItem && <Text style={styles.price}>TVA</Text>}
            <Text style={styles.price}>Prix</Text>
            <Text style={styles.total}>Total</Text>
          </View>

          {items.map((item) => (
            <View style={styles.tableRow}>
              <Text style={styles.description}>{item.description}</Text>
              {showQuantity && (
                <Text style={styles.quantity}>{item.quantity}</Text>
              )}
              {item.vatRate && <Text style={styles.price}>{item.vatRate}</Text>}
              <Text style={styles.price}>{item.unitPrice}</Text>
              <Text style={styles.price}>{item.totalPrice}</Text>
            </View>
          ))}
        </View>

        {/* Subtotal Section */}
        <View style={styles.subtotalSection}>
          <View style={styles.subtotalRow}>
            <Text style={styles.subtotalLabel}>Total HT</Text>
            <Text style={styles.subtotalValue}>
              {subtotal} {quote.devise ? quote.devise : ""}
            </Text>
          </View>
          {quote.vatActivated && (
            <>
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
                <Text style={styles.subtotalLabel}>TVA ({quote.vatRate}%)</Text>
                <Text style={styles.subtotalValue}>
                  {vatAmount} {quote.devise ? quote.devise : ""}
                </Text>
              </View>
            </>
          )}
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
            <Text style={styles.subtotalLabel}>Total TTC</Text>
            <Text style={styles.subtotalValue}>
              {total} {quote.devise ? quote.devise : ""}
            </Text>
          </View>
        </View>

        {/* Payment Section */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Règlement</Text>
          <Text style={{ fontSize: 10 }}>
            {quote.comment ? quote.comment : ""}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default QuoteTemplateA;