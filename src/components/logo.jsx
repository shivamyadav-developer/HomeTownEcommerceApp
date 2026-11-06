import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/theme";

const LOGO = require("@/assets/images/logo.jpg");

// The app logo (assets/images/logo.jpg).
// "badge" shows the full square logo; "wide" crops the white margin for headers.
export function Logo({ variant = "badge", size = 96, style }) {
  if (variant === "wide") {
    return (
      <View style={[styles.wide, { height: size, width: size * 2 }, style]}>
        <Image source={LOGO} style={styles.fill} contentFit="cover" />
      </View>
    );
  }

  return (
    <View style={[styles.badge, { width: size, height: size, borderRadius: size * 0.24 }, style]}>
      <Image source={LOGO} style={styles.fill} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#fff",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  wide: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  fill: {
    width: "100%",
    height: "100%",
  },
});
