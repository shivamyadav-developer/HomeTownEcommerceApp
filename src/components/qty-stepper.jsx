import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fonts } from "@/constants/theme";

export function QtyStepper({ value, onChange, min = 1, max = 10 }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => onChange(value - 1)}
        disabled={value <= min}
        hitSlop={6}
        accessibilityLabel="Decrease quantity"
      >
        <Ionicons
          name={value <= 1 && min === 0 ? "trash-outline" : "remove"}
          size={16}
          color={value <= min ? colors.tabInactive : colors.text}
        />
      </Pressable>
      <Text style={styles.value}>{value}</Text>
      <Pressable
        style={styles.button}
        onPress={() => onChange(value + 1)}
        disabled={value >= max}
        hitSlop={6}
        accessibilityLabel="Increase quantity"
      >
        <Ionicons name="add" size={16} color={value >= max ? colors.tabInactive : colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  button: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontFamily: fonts.semibold,
    minWidth: 24,
    textAlign: "center",
    fontSize: 14,
    color: colors.text,
  },
});
