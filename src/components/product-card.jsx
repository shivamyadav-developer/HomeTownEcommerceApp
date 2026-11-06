import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { RemoteImage } from "@/components/remote-image";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { useStore } from "@/context/store";
import { formatPrice } from "@/data/products";

export function ProductCard({ product, style }) {
  const { addToCart, isInCart, toggleWishlist, isWishlisted } = useStore();
  const inCart = isInCart(product.id);
  const wished = isWishlisted(product.id);

  return (
    <Pressable
      style={[styles.card, style]}
      onPress={() => router.push(`/product/${product.id}`)}
    >
      <View>
        <RemoteImage source={product.image} label={product.name} style={styles.image} />
        <Pressable
          style={styles.heart}
          onPress={() => toggleWishlist(product.id)}
          hitSlop={8}
          accessibilityLabel={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Ionicons
            name={wished ? "heart" : "heart-outline"}
            size={18}
            color={wished ? colors.sale : colors.text}
          />
        </Pressable>
        {product.discount >= 40 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{product.discount}% OFF</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        {product.rating ? (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={11} color={colors.star} />
            <Text style={styles.rating}>
              {product.rating} ({product.reviews})
            </Text>
          </View>
        ) : (
          <Text style={styles.rating} numberOfLines={1}>
            by {product.brand}
          </Text>
        )}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          {product.discount > 0 ? (
            <Text style={styles.mrp}>{formatPrice(product.mrp)}</Text>
          ) : null}
        </View>
        <Text style={styles.off}>
          {product.discount > 0 ? `${product.discount}% off` : "Best price"}
        </Text>

        <Pressable
          style={[styles.button, inCart && styles.buttonInCart]}
          onPress={() => (inCart ? router.push("/cart") : addToCart(product.id))}
        >
          <Text style={[styles.buttonText, inCart && styles.buttonTextInCart]}>
            {inCart ? "Go to Cart" : "Add to Cart"}
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    ...shadow.soft,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
  },
  heart: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    left: 8,
    top: 8,
    backgroundColor: colors.sale,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: fonts.bold,
    color: "#fff",
    fontSize: 10,
  },
  body: {
    padding: 10,
    gap: 3,
  },
  name: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
    minHeight: 34,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  rating: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.text,
  },
  mrp: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    textDecorationLine: "line-through",
  },
  off: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: colors.sale,
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: "center",
  },
  buttonInCart: {
    backgroundColor: colors.primarySoft,
  },
  buttonText: {
    fontFamily: fonts.semibold,
    color: "#fff",
    fontSize: 13,
  },
  buttonTextInCart: {
    color: colors.primary,
  },
});
