import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Logo } from "@/components/logo";
import { colors, fonts, shadow } from "@/constants/theme";

// Shared frame for the login and sign-up screens: brand header + white form card.
export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.decorTop} />
          <View style={styles.decorSide} />

          <View style={styles.brand}>
            <Logo size={80} style={styles.logo} />
            <Text style={styles.tagline}>Furniture & Home Décor</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <View style={styles.form}>{children}</View>
          </View>

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center",
  },
  decorTop: {
    position: "absolute",
    top: -120,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.primary,
    opacity: 0.12,
  },
  decorSide: {
    position: "absolute",
    top: 140,
    left: -90,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.dealsTitle,
    opacity: 0.08,
  },
  brand: {
    alignItems: "center",
    marginBottom: 14,
  },
  logo: {
    ...shadow.card,
  },
  tagline: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 18,
    ...shadow.card,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 21,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
  },
  form: {
    gap: 10,
    marginTop: 14,
  },
  footer: {
    alignItems: "center",
    marginTop: 14,
  },
});
