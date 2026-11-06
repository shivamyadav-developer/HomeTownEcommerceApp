import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "@/constants/theme";
import { useStore } from "@/context/store";

function Badge({ count }) {
  if (!count) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 9 ? "9+" : count}</Text>
    </View>
  );
}

export function WishlistIcon() {
  const { wishlist } = useStore();
  return (
    <Pressable onPress={() => router.push("/wishlist")} hitSlop={8} accessibilityLabel="Wishlist">
      <Ionicons name="heart-outline" size={25} color={colors.text} />
      <Badge count={wishlist.length} />
    </Pressable>
  );
}

export function CartIcon() {
  const { totals } = useStore();
  return (
    <Pressable onPress={() => router.push("/cart")} hitSlop={8} accessibilityLabel="Cart">
      <Ionicons name="cart-outline" size={26} color={colors.text} />
      <Badge count={totals.count} />
    </Pressable>
  );
}

export function HeaderActions() {
  return (
    <View style={styles.actions}>
      <WishlistIcon />
      <CartIcon />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    paddingHorizontal: 3,
    backgroundColor: colors.sale,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontFamily: fonts.bold,
    color: "#fff",
    fontSize: 10,
  },
});
