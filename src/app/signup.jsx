import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { AuthField } from "@/components/auth-field";
import { AuthLayout } from "@/components/auth-layout";
import { colors, fonts } from "@/constants/theme";
import { useAuth } from "@/context/auth";

const EMPTY = { fullName: "", email: "", mobile: "", password: "" };

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSignUp() {
    setBusy(true);
    const result = await signUp(form);
    setBusy(false);
    if (result.errors) setErrors(result.errors);
    // On success the user is logged in and the root layout opens the app.
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join HomeTown to shop, save and track orders"
      footer={
        <View style={styles.row}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Link href="/login" replace asChild>
            <Pressable hitSlop={8}>
              <Text style={styles.footerLink}>Log In</Text>
            </Pressable>
          </Link>
        </View>
      }
    >
      <AuthField
        icon="person-outline"
        label="Full Name"
        placeholder="Enter your full name"
        value={form.fullName}
        onChangeText={(text) => update("fullName", text)}
        error={errors.fullName}
        autoCapitalize="words"
        autoComplete="name"
      />
      <AuthField
        icon="mail-outline"
        label="Email"
        placeholder="you@example.com"
        value={form.email}
        onChangeText={(text) => update("email", text)}
        error={errors.email}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
      />
      <AuthField
        icon="call-outline"
        label="Mobile Number"
        placeholder="10-digit mobile number"
        value={form.mobile}
        onChangeText={(text) => update("mobile", text.replace(/\D/g, "").slice(0, 10))}
        error={errors.mobile}
        autoComplete="tel"
        keyboardType="phone-pad"
        maxLength={10}
      />
      <AuthField
        icon="lock-closed-outline"
        label="Password"
        placeholder="At least 6 characters"
        value={form.password}
        onChangeText={(text) => update("password", text)}
        error={errors.password}
        secure
        autoComplete="new-password"
        returnKeyType="go"
        onSubmitEditing={handleSignUp}
      />

      <Pressable style={[styles.button, busy && styles.buttonBusy]} onPress={handleSignUp} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </Pressable>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
  },
  footerLink: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.primary,
  },
  button: {
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonBusy: {
    opacity: 0.8,
  },
  buttonText: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: "#fff",
  },
});
