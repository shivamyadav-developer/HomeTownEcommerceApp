import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts, radius, shadow } from "@/constants/theme";
import { formatPrice } from "@/data/products";

export function formatOrderDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Simulated delivery progress: each step completes a set number of days after the order date.
const STEPS = [
  { label: "Ordered", days: 0 },
  { label: "Packed", days: 1 },
  { label: "Shipped", days: 2 },
  { label: "Delivered", days: 5 },
];

const STATUS_STYLE = {
  Ordered: { color: colors.accent, tint: colors.accentSoft },
  Packed: { color: colors.accent, tint: colors.accentSoft },
  Shipped: { color: colors.primary, tint: colors.primarySoft },
  Delivered: { color: colors.success, tint: colors.successSoft },
  Cancelled: { color: colors.sale, tint: colors.saleSoft },
};

export function getOrderStatus(order) {
  const placed = new Date(order.date);
  const now = Date.now();
  const steps = STEPS.map((step) => {
    const date = new Date(placed);
    date.setDate(date.getDate() + step.days);
    return { label: step.label, date: date.toISOString(), done: date.getTime() <= now };
  });
  const label = order.cancelled ? "Cancelled" : steps.filter((s) => s.done).at(-1).label;
  return {
    label,
    steps,
    cancellable: !order.cancelled && !steps[2].done,
    ...STATUS_STYLE[label],
  };
}

export function OrderSummary({ order, onPress }) {
  const status = getOrderStatus(order);
  return (
    <Pressable style={styles.card} onPress={onPress} disabled={!onPress}>
      <View style={styles.header}>
        <View>
          <Text style={styles.orderId}>Order #{order.id}</Text>
          <Text style={styles.date}>{formatOrderDate(order.date)}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[styles.status, { backgroundColor: status.tint }]}>
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
          {onPress ? <Ionicons name="chevron-forward" size={18} color={colors.muted} /> : null}
        </View>
      </View>
      {order.items.map((item) => (
        <View key={item.id} style={styles.item}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.qty} × {item.name}
          </Text>
          <Text style={styles.itemPrice}>{formatPrice(item.price * item.qty)}</Text>
        </View>
      ))}
      <View style={styles.footer}>
        <Text style={styles.payment}>Paid via {order.payment}</Text>
        <Text style={styles.total}>{formatPrice(order.total)}</Text>
      </View>
      {onPress ? <Text style={styles.viewDetails}>View order details</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 14,
    gap: 6,
    ...shadow.soft,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  status: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  statusText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
  },
  viewDetails: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.primary,
    marginTop: 2,
  },
  orderId: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.text,
  },
  date: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  itemName: {
    fontFamily: fonts.regular,
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  itemPrice: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingTop: 8,
    marginTop: 4,
  },
  payment: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  total: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.text,
  },
});
