import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/empty-state";
import { PriceSummary } from "@/components/price-summary";
import { QtyStepper } from "@/components/qty-stepper";
import { RemoteImage } from "@/components/remote-image";
import { colors, radius, fonts } from "@/constants/theme";
import { AVAILABLE_COUPONS, useStore } from "@/context/store";
import { formatPrice } from "@/data/products";

export default function CartScreen() {
  const store = useStore();
  const { totals } = store;
  const [code, setCode] = useState("");
  const [couponError, setCouponError] = useState("");

  if (!totals.lines.length) {
    return (
      <EmptyState
        icon="cart-outline"
        title="Your cart is empty"
        message="Looks like you haven't added anything yet."
        actionLabel="Start Shopping"
        onAction={() => router.dismissTo("/")}
      />
    );
  }

  function apply(value) {
    if (store.applyCoupon(value)) {
      setCode("");
      setCouponError("");
    } else {
      setCouponError("This coupon is not valid");
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        {totals.lines.map(({ id, qty, product }) => (
          <View key={id} style={styles.item}>
            <Pressable
              onPress={() => !product.giftCard && router.push(`/product/${id}`)}
              style={styles.itemRow}
            >
              <RemoteImage
                source={product.image}
                label={product.giftCard ? "Gift Card" : product.name}
                icon={product.giftCard ? "gift" : undefined}
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {product.name}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>{formatPrice(product.price * qty)}</Text>
                  {product.discount ? (
                    <>
                      <Text style={styles.mrp}>{formatPrice(product.mrp * qty)}</Text>
                      <Text style={styles.off}>{product.discount}% off</Text>
                    </>
                  ) : null}
                </View>
                <QtyStepper value={qty} min={0} onChange={(value) => store.setQty(id, value)} />
              </View>
            </Pressable>
            <View style={styles.itemActions}>
              <Pressable style={styles.action} onPress={() => store.removeFromCart(id)}>
                <Text style={styles.actionText}>Remove</Text>
              </Pressable>
              {!product.giftCard ? (
                <Pressable style={styles.action} onPress={() => store.moveToWishlist(id)}>
                  <Text style={styles.actionText}>Move to Wishlist</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        ))}

        <View style={styles.coupon}>
          <Text style={styles.couponTitle}>Apply Coupon</Text>
          {store.coupon ? (
            <View style={styles.appliedRow}>
              <View>
                <Text style={styles.appliedCode}>{store.coupon} applied</Text>
                <Text style={styles.couponHint}>{store.couponLabel}</Text>
              </View>
              <Pressable onPress={store.removeCoupon} hitSlop={8}>
                <Text style={styles.removeCoupon}>REMOVE</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View style={styles.couponRow}>
                <TextInput
                  value={code}
                  onChangeText={(text) => {
                    setCode(text);
                    setCouponError("");
                  }}
                  placeholder="Enter coupon code"
                  autoCapitalize="characters"
                  style={styles.couponInput}
                  onSubmitEditing={() => apply(code)}
                />
                <Pressable onPress={() => apply(code)} hitSlop={8}>
                  <Text style={styles.applyText}>APPLY</Text>
                </Pressable>
              </View>
              {couponError ? <Text style={styles.error}>{couponError}</Text> : null}
              {AVAILABLE_COUPONS.map((c) => (
                <Pressable key={c.code} style={styles.offer} onPress={() => apply(c.code)}>
                  <Text style={styles.offerCode}>{c.code}</Text>
                  <Text style={styles.couponHint}>{c.label} · Tap to apply</Text>
                </Pressable>
              ))}
            </>
          )}
        </View>

        <PriceSummary totals={totals} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.total}>{formatPrice(totals.total)}</Text>
          <Text style={styles.totalHint}>Total payable</Text>
        </View>
        <Pressable style={styles.checkout} onPress={() => router.push("/checkout")}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 12,
    gap: 10,
  },
  item: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  itemRow: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: radius.sm,
  },
  itemInfo: {
    flex: 1,
    gap: 6,
  },
  itemName: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
    flexWrap: "wrap",
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.text,
  },
  mrp: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    textDecorationLine: "line-through",
  },
  off: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.sale,
  },
  itemActions: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  action: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  actionText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.muted,
  },
  coupon: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    gap: 8,
  },
  couponTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
  },
  couponRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
  },
  couponInput: {
    fontFamily: fonts.regular,
    flex: 1,
    height: 44,
    fontSize: 15,
  },
  applyText: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  error: {
    fontFamily: fonts.regular,
    color: colors.sale,
    fontSize: 12,
  },
  offer: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    borderRadius: radius.sm,
    padding: 10,
  },
  offerCode: {
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  couponHint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  appliedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appliedCode: {
    fontFamily: fonts.bold,
    color: colors.success,
  },
  removeCoupon: {
    color: colors.sale,
    fontFamily: fonts.bold,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  total: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
  },
  totalHint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  checkout: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: 32,
    height: 48,
    justifyContent: "center",
  },
  checkoutText: {
    fontFamily: fonts.bold,
    color: "#fff",
    fontSize: 16,
  },
});
