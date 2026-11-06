import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors, fonts, radius } from "@/constants/theme";

export function AuthField({ icon, label, error, secure, ...inputProps }) {
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, focused && styles.focused, error && styles.errorBorder]}>
        <Ionicons name={icon} size={19} color={focused ? colors.primary : colors.muted} />
        <TextInput
          {...inputProps}
          secureTextEntry={secure && hidden}
          placeholderTextColor={colors.placeholderText}
          style={styles.input}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secure ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={8}
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
          >
            <Ionicons name={hidden ? "eye-off-outline" : "eye-outline"} size={19} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 4,
  },
  label: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.text,
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: "#FAFAFA",
  },
  focused: {
    borderColor: colors.primary,
    backgroundColor: "#fff",
  },
  errorBorder: {
    borderColor: colors.sale,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
    height: "100%",
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.sale,
  },
});
