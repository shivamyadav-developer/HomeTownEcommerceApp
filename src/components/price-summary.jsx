import { StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "@/constants/theme";
import { formatPrice } from "@/data/products";

function Row({ label, value, highlight, bold }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, bold && styles.bold]}>{label}</Text>
      <Text style={[styles.value, highlight && styles.highlight, bold && styles.bold]}>{value}</Text>
    </View>
  );
}

export function PriceSummary({ totals }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Price Details ({totals.count} items)</Text>
      <Row label="Total MRP" value={formatPrice(totals.mrp)} />
      {totals.productDiscount ? (
        <Row label="Discount on MRP" value={`- ${formatPrice(totals.productDiscount)}`} highlight />
      ) : null}
      {totals.couponDiscount ? (
        <Row label="Coupon Discount" value={`- ${formatPrice(totals.couponDiscount)}`} highlight />
      ) : null}
      <Row
        label="Delivery & Installation"
        value={totals.delivery ? formatPrice(totals.delivery) : "FREE"}
        highlight={!totals.delivery}
      />
      <View style={styles.divider} />
      <Row label="Total Amount" value={formatPrice(totals.total)} bold />
      {totals.mrp - totals.total > 0 ? (
        <Text style={styles.savings}>
          You save {formatPrice(totals.mrp - totals.total)} on this order
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    padding: 16,
    gap: 8,
    borderRadius: 10,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
  },
  value: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  highlight: {
    color: colors.success,
  },
  bold: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.text,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  savings: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.success,
  },
});
