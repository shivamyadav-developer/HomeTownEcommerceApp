import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { formatOrderDate, getOrderStatus } from "@/components/order-summary";
import { RemoteImage } from "@/components/remote-image";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { useStore } from "@/context/store";
import { formatPrice, getProduct } from "@/data/products";

function Row({ label, value, highlight, bold }) {
  return (
    <View style={styles.priceRow}>
      <Text style={[styles.priceLabel, bold && styles.priceBold]}>{label}</Text>
      <Text style={[styles.priceValue, highlight && styles.priceHighlight, bold && styles.priceBold]}>
        {value}
      </Text>
    </View>
  );
}

function confirm(message, onConfirm) {
  if (Platform.OS === "web") {
    if (window.confirm(message)) onConfirm();
    return;
  }
  Alert.alert("Cancel order?", message, [
    { text: "Keep Order", style: "cancel" },
    { text: "Cancel Order", style: "destructive", onPress: onConfirm },
  ]);
}

export default function OrderScreen() {
  const { id, placed } = useLocalSearchParams();
  const { orders, cancelOrder, addToCart } = useStore();
  const order = orders.find((o) => o.id === id);
  const justPlaced = placed === "1";

  if (!order) {
    return (
      <EmptyState
        icon="receipt-outline"
        title="Order not found"
        actionLabel="Go Home"
        onAction={() => router.dismissTo("/")}
      />
    );
  }

  const { address } = order;
  const status = getOrderStatus(order);
  const itemCount = order.items.reduce((sum, item) => sum + item.qty, 0);
  const itemsTotal = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);

  function buyAgain() {
    order.items.forEach((item) => {
      if (getProduct(item.id)) addToCart(item.id, item.qty);
    });
    router.push("/cart");
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: justPlaced ? "Order Confirmed" : "Order Details",
          headerBackVisible: !justPlaced,
          gestureEnabled: !justPlaced,
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {justPlaced ? (
          <View style={styles.success}>
            <Ionicons name="checkmark-circle" size={68} color={colors.success} />
            <Text style={styles.successTitle}>Order Placed Successfully!</Text>
            <Text style={styles.successText}>
              Thank you for shopping with HomeTown. We will send updates to {address?.phone}.
            </Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.orderId}>Order #{order.id}</Text>
              <Text style={styles.muted}>
                Placed on {formatOrderDate(order.date)} · {itemCount} item{itemCount > 1 ? "s" : ""}
              </Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: status.tint }]}>
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
          </View>

          {order.cancelled ? (
            <View style={styles.cancelled}>
              <Ionicons name="close-circle" size={20} color={colors.sale} />
              <Text style={styles.cancelledText}>
                Cancelled on {formatOrderDate(order.cancelledAt)}. Any payment will be refunded in 5-7
                working days.
              </Text>
            </View>
          ) : (
            <View style={styles.timeline}>
              {status.steps.map((step, index) => {
                const last = index === status.steps.length - 1;
                return (
                  <View key={step.label} style={styles.step}>
                    <View style={styles.stepRail}>
                      <View style={[styles.dot, step.done && styles.dotDone]}>
                        {step.done ? <Ionicons name="checkmark" size={12} color="#fff" /> : null}
                      </View>
                      {!last ? (
                        <View style={[styles.line, status.steps[index + 1].done && styles.lineDone]} />
                      ) : null}
                    </View>
                    <View style={styles.stepBody}>
                      <Text style={[styles.stepLabel, !step.done && styles.stepPending]}>
                        {step.label}
                      </Text>
                      <Text style={styles.muted}>
                        {step.done ? formatOrderDate(step.date) : `Expected by ${formatOrderDate(step.date)}`}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items in this order</Text>
          {order.items.map((item) => {
            const product = getProduct(item.id);
            return (
              <Pressable
                key={item.id}
                style={styles.item}
                disabled={!product || product.giftCard}
                onPress={() => router.push(`/product/${item.id}`)}
              >
                <RemoteImage
                  source={product?.image}
                  label={product?.giftCard ? "Gift Card" : undefined}
                  icon={product?.giftCard ? "gift" : undefined}
                  style={styles.itemImage}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.muted}>Qty {item.qty}</Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.price * item.qty)}</Text>
                </View>
                {product && !product.giftCard ? (
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                ) : null}
              </Pressable>
            );
          })}
        </View>

        {address ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Delivery Address</Text>
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={20} color={colors.primary} />
              <View style={styles.flex}>
                <Text style={styles.addressName}>{address.name}</Text>
                <Text style={styles.text}>{address.address}</Text>
                <Text style={styles.text}>
                  {address.city}, {address.state} - {address.pincode}
                </Text>
                <Text style={styles.muted}>Phone: {address.phone}</Text>
              </View>
            </View>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Summary</Text>
          {order.mrp ? <Row label="Total MRP" value={formatPrice(order.mrp)} /> : null}
          {order.productDiscount ? (
            <Row label="Discount on MRP" value={`- ${formatPrice(order.productDiscount)}`} highlight />
          ) : null}
          {!order.mrp ? <Row label="Items total" value={formatPrice(itemsTotal)} /> : null}
          {order.couponDiscount ? (
            <Row
              label={`Coupon${order.coupon ? ` (${order.coupon})` : ""}`}
              value={`- ${formatPrice(order.couponDiscount)}`}
              highlight
            />
          ) : null}
          {order.delivery !== undefined ? (
            <Row
              label="Delivery & Installation"
              value={order.delivery ? formatPrice(order.delivery) : "FREE"}
              highlight={!order.delivery}
            />
          ) : null}
          <View style={styles.divider} />
          <Row label="Order Total" value={formatPrice(order.total)} bold />
          <View style={styles.paymentRow}>
            <Ionicons name="card-outline" size={16} color={colors.muted} />
            <Text style={styles.muted}>Paid via {order.payment}</Text>
          </View>
        </View>

        {justPlaced ? (
          <>
            <Pressable style={styles.primary} onPress={() => router.dismissTo("/")}>
              <Text style={styles.primaryText}>Continue Shopping</Text>
            </Pressable>
            <Pressable style={styles.secondary} onPress={() => router.replace("/orders")}>
              <Text style={styles.secondaryText}>View All Orders</Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.actions}>
            {status.cancellable ? (
              <Pressable
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() =>
                  confirm(`Are you sure you want to cancel order #${order.id}?`, () =>
                    cancelOrder(order.id),
                  )
                }
              >
                <Text style={[styles.actionText, styles.cancelText]}>Cancel Order</Text>
              </Pressable>
            ) : null}
            <Pressable style={[styles.actionButton, styles.buyAgain]} onPress={buyAgain}>
              <Ionicons name="refresh" size={16} color="#fff" />
              <Text style={[styles.actionText, styles.buyAgainText]}>Buy Again</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  success: {
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
  },
  successTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.text,
  },
  successText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    gap: 10,
    ...shadow.soft,
  },
  cardTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  orderId: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.text,
  },
  muted: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
  },
  statusPill: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  cancelled: {
    flexDirection: "row",
    gap: 8,
    backgroundColor: colors.saleSoft,
    borderRadius: radius.sm,
    padding: 10,
  },
  cancelledText: {
    fontFamily: fonts.regular,
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  timeline: {
    marginTop: 4,
  },
  step: {
    flexDirection: "row",
    gap: 12,
  },
  stepRail: {
    alignItems: "center",
    width: 22,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  dotDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 22,
    backgroundColor: colors.border,
  },
  lineDone: {
    backgroundColor: colors.success,
  },
  stepBody: {
    paddingBottom: 14,
  },
  stepLabel: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
  },
  stepPending: {
    color: colors.muted,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
  },
  itemPrice: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
  },
  addressRow: {
    flexDirection: "row",
    gap: 10,
  },
  addressName: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
  },
  priceValue: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  priceHighlight: {
    color: colors.success,
  },
  priceBold: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.text,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  primary: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryText: {
    fontFamily: fonts.bold,
    color: "#fff",
    fontSize: 16,
  },
  secondary: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    fontFamily: fonts.semibold,
    color: colors.primary,
    fontSize: 15,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    gap: 6,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontFamily: fonts.semibold,
    fontSize: 15,
  },
  cancelButton: {
    borderWidth: 1.5,
    borderColor: colors.sale,
  },
  cancelText: {
    color: colors.sale,
  },
  buyAgain: {
    backgroundColor: colors.primary,
  },
  buyAgainText: {
    color: "#fff",
  },
});
