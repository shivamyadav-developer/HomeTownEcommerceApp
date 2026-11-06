import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/empty-state";
import { ProductCard } from "@/components/product-card";
import { QtyStepper } from "@/components/qty-stepper";
import { RemoteImage } from "@/components/remote-image";
import { colors, radius, fonts } from "@/constants/theme";
import { useStore } from "@/context/store";
import { formatPrice, getProduct, products } from "@/data/products";

function deliveryDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export default function ProductScreen() {
  const { id } = useLocalSearchParams();
  const product = getProduct(id);
  const { addToCart, isInCart, toggleWishlist, isWishlisted } = useStore();
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState(null);

  if (!product || product.giftCard) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Product not found"
        actionLabel="Go Home"
        onAction={() => router.replace("/")}
      />
    );
  }

  const wished = isWishlisted(product.id);
  const inCart = isInCart(product.id);
  const similar = products
    .filter(
      (p) =>
        p.id !== product.id &&
        (product.brandSlug
          ? p.brandSlug === product.brandSlug
          : p.categories.some((c) => product.categories.includes(c))),
    )
    .slice(0, 8);
  const emi = Math.ceil(product.price / 12);

  function checkPincode() {
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeResult({ ok: false, text: "Enter a valid 6-digit pincode" });
      return;
    }
    const days = 3 + (Number(pincode[5]) % 5);
    setPincodeResult({ ok: true, text: `Delivery by ${deliveryDate(days)} · Free installation` });
  }

  function handleAdd() {
    if (inCart) {
      router.push("/cart");
      return;
    }
    addToCart(product.id, qty);
  }

  function handleBuyNow() {
    if (!inCart) addToCart(product.id, qty);
    router.push("/cart");
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen options={{ title: product.categories[0].replace("-", " ").toUpperCase() }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <RemoteImage source={product.image} label={product.name} style={styles.image} />
          <View style={styles.imageActions}>
            <Pressable
              style={styles.roundButton}
              onPress={() => toggleWishlist(product.id)}
              accessibilityLabel="Toggle wishlist"
            >
              <Ionicons
                name={wished ? "heart" : "heart-outline"}
                size={22}
                color={wished ? colors.sale : colors.text}
              />
            </Pressable>
            <Pressable
              style={styles.roundButton}
              onPress={() =>
                Share.share({ message: `Check out ${product.name} for ${formatPrice(product.price)} on HomeTown!` })
              }
              accessibilityLabel="Share"
            >
              <Ionicons name="share-social-outline" size={21} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <View style={styles.info}>
          <Pressable
            disabled={!product.brandSlug}
            onPress={() => router.push(`/category/brand-${product.brandSlug}`)}
          >
            <Text style={styles.brand}>
              {product.brand}
              {product.brandSlug ? "  ›  View all" : ""}
            </Text>
          </Pressable>
          <Text style={styles.name}>{product.name}</Text>
          {product.rating ? (
            <View style={styles.ratingRow}>
              <View style={styles.ratingPill}>
                <Text style={styles.ratingPillText}>{product.rating}</Text>
                <Ionicons name="star" size={11} color="#fff" />
              </View>
              <Text style={styles.reviews}>{product.reviews} ratings</Text>
            </View>
          ) : null}

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {product.discount > 0 ? (
              <>
                <Text style={styles.mrp}>{formatPrice(product.mrp)}</Text>
                <Text style={styles.off}>{product.discount}% off</Text>
              </>
            ) : null}
          </View>
          <Text style={styles.tax}>Inclusive of all taxes · EMI from {formatPrice(emi)}/month</Text>

          <View style={styles.qtyRow}>
            <Text style={styles.label}>Quantity</Text>
            <QtyStepper value={qty} onChange={setQty} />
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Check Delivery</Text>
          <View style={styles.pincodeRow}>
            <TextInput
              value={pincode}
              onChangeText={(text) => {
                setPincode(text.replace(/\D/g, "").slice(0, 6));
                setPincodeResult(null);
              }}
              placeholder="Enter pincode"
              keyboardType="number-pad"
              style={styles.pincodeInput}
              onSubmitEditing={checkPincode}
            />
            <Pressable onPress={checkPincode} hitSlop={8}>
              <Text style={styles.check}>CHECK</Text>
            </Pressable>
          </View>
          {pincodeResult ? (
            <Text style={{ color: pincodeResult.ok ? colors.success : colors.sale, fontSize: 13 }}>
              {pincodeResult.text}
            </Text>
          ) : null}
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Specifications</Text>
          {[
            ["Material", product.material],
            ["Dimensions", product.dimensions],
            ["Type", product.productType],
            ["Warranty", product.warranty],
            ["Brand", product.brand],
          ]
            .filter(([, value]) => value)
            .map(([key, value]) => (
            <View key={key} style={styles.specRow}>
              <Text style={styles.specKey}>{key}</Text>
              <Text style={styles.specValue}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.perks}>
            {[
              ["car-outline", "Free Delivery"],
              ["construct-outline", "Free Installation"],
              ["refresh-outline", "7 Day Returns"],
            ].map(([icon, text]) => (
              <View key={text} style={styles.perk}>
                <Ionicons name={icon} size={22} color={colors.primary} />
                <Text style={styles.perkText}>{text}</Text>
              </View>
            ))}
          </View>
        </View>

        {similar.length ? (
          <View style={styles.similar}>
            <Text style={[styles.blockTitle, styles.similarTitle]}>Similar Products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarRow}>
              {similar.map((p) => (
                <ProductCard key={p.id} product={p} style={styles.similarCard} />
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={[styles.cta, styles.ctaOutline]} onPress={handleAdd}>
          <Text style={[styles.ctaText, styles.ctaOutlineText]}>
            {inCart ? "Go to Cart" : "Add to Cart"}
          </Text>
        </Pressable>
        <Pressable style={styles.cta} onPress={handleBuyNow}>
          <Text style={styles.ctaText}>Buy Now</Text>
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
    paddingBottom: 24,
  },
  image: {
    width: "100%",
    aspectRatio: 1.1,
  },
  imageActions: {
    position: "absolute",
    top: 12,
    right: 12,
    gap: 10,
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    backgroundColor: colors.card,
    padding: 16,
    gap: 6,
  },
  brand: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
    textTransform: "uppercase",
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 19,
    color: colors.text,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.success,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingPillText: {
    fontFamily: fonts.bold,
    color: "#fff",
    fontSize: 12,
  },
  reviews: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginTop: 4,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.text,
  },
  mrp: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    textDecorationLine: "line-through",
  },
  off: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.sale,
  },
  tax: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  block: {
    backgroundColor: colors.card,
    padding: 16,
    marginTop: 10,
    gap: 8,
  },
  blockTitle: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
  },
  pincodeRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
  },
  pincodeInput: {
    fontFamily: fonts.regular,
    flex: 1,
    height: 44,
    fontSize: 15,
  },
  check: {
    color: colors.primary,
    fontFamily: fonts.bold,
  },
  specRow: {
    flexDirection: "row",
    paddingVertical: 4,
  },
  specKey: {
    fontFamily: fonts.regular,
    width: 110,
    fontSize: 13,
    color: colors.muted,
  },
  specValue: {
    fontFamily: fonts.regular,
    flex: 1,
    fontSize: 13,
    color: colors.text,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
  perks: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  perk: {
    alignItems: "center",
    gap: 4,
  },
  perkText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
  similar: {
    marginTop: 16,
  },
  similarTitle: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  similarRow: {
    paddingHorizontal: 16,
    gap: 10,
  },
  similarCard: {
    width: 160,
  },
  bottomBar: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  cta: {
    flex: 1,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ctaText: {
    fontFamily: fonts.bold,
    color: "#fff",
    fontSize: 16,
  },
  ctaOutlineText: {
    color: colors.primary,
  },
});
