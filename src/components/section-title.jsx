import { StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "@/constants/theme";

export function SectionTitle({ children, color = colors.sectionTitle }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color }]}>{children}</Text>
      <View style={[styles.accent, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 19,
    textAlign: "center",
  },
  accent: {
    width: 36,
    height: 3,
    borderRadius: 2,
    marginTop: 4,
    opacity: 0.6,
  },
});
