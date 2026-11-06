import { Link } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { AuthField } from "@/components/auth-field";
import { AuthLayout } from "@/components/auth-layout";
import { colors, fonts } from "@/constants/theme";
import { useAuth } from "@/context/auth";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    setBusy(true);
    const result = await signIn(identifier, password);
    setBusy(false);
    if (result.error) setError(result.error);
    // On success the root layout switches to the app automatically.
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in with your email or mobile number"
      footer={
        <View style={styles.row}>
          <Text style={styles.footerText}>New to HomeTown? </Text>
          <Link href="/signup" replace asChild>
            <Pressable hitSlop={8}>
              <Text style={styles.footerLink}>Create an account</Text>
            </Pressable>
          </Link>
        </View>
      }
    >
      <AuthField
        icon="person-outline"
        label="Email or Mobile Number"
        placeholder="you@example.com or 98XXXXXXXX"
        value={identifier}
        onChangeText={(text) => {
          setIdentifier(text);
          setError("");
        }}
        autoCapitalize="none"
        autoComplete="username"
        keyboardType="email-address"
        returnKeyType="next"
      />
      <AuthField
        icon="lock-closed-outline"
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError("");
        }}
        secure
        autoComplete="password"
        returnKeyType="go"
        onSubmitEditing={handleLogin}
      />

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Pressable style={[styles.button, busy && styles.buttonBusy]} onPress={handleLogin} disabled={busy}>
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
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
  errorBox: {
    backgroundColor: colors.saleSoft,
    borderRadius: 10,
    padding: 10,
  },
  errorText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.sale,
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
