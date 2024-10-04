import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  invoiceInfo: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 10,
    gap: 20,
  },
  infoItem: {
    padding: 5,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#000000",
    borderRadius: 3,
  },
  companySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  companyInfo: {
    flex: 1,
  },
  customerInfo: {
    flex: 1,
    alignItems: "flex-end",
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
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    padding: 10,
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
    textAlign: "right",
  },
  total: {
    flex: 1,
    textAlign: "right",
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
  },
  subtotalLabel: {
    width: 100,
  },
  subtotalValue: {
    width: 80,
    textAlign: "right",
  },
  paymentSection: {
    marginTop: 40,
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

// Create Document Component
const InvoicePDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Facture</Text>
        <View style={styles.invoiceInfo}>
          <Text style={styles.infoItem}>Facture* 0002</Text>
          <Text style={styles.infoItem}>May 1st, 2023</Text>
          <Text style={styles.infoItem}>Échéance May 15th, 2023</Text>
        </View>
      </View>

      {/* Company and Customer Info */}
      <View style={styles.companySection}>
        <View style={styles.companyInfo}>
          <Text>Company X</Text>
          <Text>SIRET: 123 456 789 00000</Text>
          <Text>123 Company Street, City, Country</Text>
          <Text>+46 234 567 890</Text>
          <Text>exemple@exemple.com</Text>
        </View>
        <View style={styles.customerInfo}>
          <Text>À l'attention de:</Text>
          <Text>Achraf Sekrilli</Text>
          <Text>SIRET: Test</Text>
          <Text>52432100</Text>
          <Text>achrafsekri2021@gmail.com</Text>
          <Text>Hay 10 skaness 01/05/2023</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.description}>Description</Text>
          <Text style={styles.quantity}>Quantité</Text>
          <Text style={styles.price}>Prix</Text>
          <Text style={styles.total}>Total</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.description}>test</Text>
          <Text style={styles.quantity}>1</Text>
          <Text style={styles.price}>10</Text>
          <Text style={styles.total}>10</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.description}>10</Text>
          <Text style={styles.quantity}>10</Text>
          <Text style={styles.price}>20</Text>
          <Text style={styles.total}>200</Text>
        </View>
      </View>

      {/* Subtotal Section */}
      <View style={styles.subtotalSection}>
        <View style={styles.subtotalRow}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.subtotalValue}>210</Text>
        </View>
        <View style={styles.subtotalRow}>
          <Text style={styles.subtotalLabel}>VAT (20.00%)</Text>
          <Text style={styles.subtotalValue}>42</Text>
        </View>
        <View style={styles.subtotalRow}>
          <Text style={styles.subtotalLabel}>Total</Text>
          <Text style={styles.subtotalValue}>252</Text>
        </View>
      </View>

      {/* Payment Section */}
      <View style={styles.paymentSection}>
        <Text style={styles.paymentTitle}>Règlement</Text>
        <Text>Par virement bancaire</Text>
        <Text>Veuillez effectuer le virement sur le compte suivant :</Text>
        <Text>IBAN : Votre IBAN</Text>
        <Text style={{ fontSize: 10, marginTop: 10 }}>
          En cas de retard de paiement, et conformément au code du commerce, une
          indemnité calculée sur la base de trois fois le taux d'intérêt légal
          ainsi que des frais de recouvrement de 40 euros sont dus.
        </Text>
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
