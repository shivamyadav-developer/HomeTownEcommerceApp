import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, fonts } from "@/constants/theme";

export function EmptyState({ icon, title, message, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={56} color={colors.sectionTitle} />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel ? (
        <Pressable style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 10,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    color: colors.text,
    textAlign: "center",
  },
  message: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
  },
  button: {
    marginTop: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: radius.md,
  },
  buttonText: {
    fontFamily: fonts.semibold,
    color: "#fff",
    fontSize: 15,
  },
});
