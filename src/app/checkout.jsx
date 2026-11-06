import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EmptyState } from "@/components/empty-state";
import { PriceSummary } from "@/components/price-summary";
import { colors, radius, fonts } from "@/constants/theme";
import { useStore } from "@/context/store";
import { formatPrice } from "@/data/products";

const PAYMENTS = [
  { key: "upi", label: "UPI", hint: "Google Pay, PhonePe, Paytm", icon: "phone-portrait-outline" },
  { key: "card", label: "Credit / Debit Card", hint: "Visa, Mastercard, RuPay", icon: "card-outline" },
  { key: "netbanking", label: "Net Banking", hint: "All major banks", icon: "business-outline" },
  { key: "cod", label: "Cash on Delivery", hint: "Pay when it arrives", icon: "cash-outline" },
];

const FIELDS = [
  { key: "name", label: "Full Name", autoComplete: "name" },
  { key: "phone", label: "Mobile Number", keyboardType: "phone-pad", maxLength: 10 },
  { key: "pincode", label: "Pincode", keyboardType: "number-pad", maxLength: 6 },
  { key: "address", label: "House No, Building, Street", multiline: true },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
];

function validate(address) {
  const errors = {};
  if (!address.name?.trim()) errors.name = "Enter your name";
  if (!/^[6-9]\d{9}$/.test(address.phone ?? "")) errors.phone = "Enter a valid 10-digit mobile number";
  if (!/^\d{6}$/.test(address.pincode ?? "")) errors.pincode = "Enter a valid 6-digit pincode";
  if (!address.address?.trim()) errors.address = "Enter your address";
  if (!address.city?.trim()) errors.city = "Enter your city";
  if (!address.state?.trim()) errors.state = "Enter your state";
  return errors;
}

export default function CheckoutScreen() {
  const store = useStore();
  const { totals } = store;
  const [address, setAddress] = useState(store.address ?? {});
  const [errors, setErrors] = useState({});
  const [payment, setPayment] = useState("upi");
  const [placing, setPlacing] = useState(false);

  if (!totals.lines.length && !placing) {
    return (
      <EmptyState
        icon="cart-outline"
        title="Nothing to checkout"
        actionLabel="Continue Shopping"
        onAction={() => router.dismissTo("/")}
      />
    );
  }

  function placeOrder() {
    const nextErrors = validate(address);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setPlacing(true);
    store.saveAddress(address);
    // Simulated payment gateway round trip.
    setTimeout(() => {
      const orderId = store.placeOrder(PAYMENTS.find((p) => p.key === payment).label);
      router.replace(`/order/${orderId}?placed=1`);
    }, 1200);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text style={styles.title}>Delivery Address</Text>
            {FIELDS.map((field) => (
              <View key={field.key}>
                <TextInput
                  value={address[field.key] ?? ""}
                  onChangeText={(text) => {
                    setAddress((prev) => ({ ...prev, [field.key]: text }));
                    setErrors((prev) => ({ ...prev, [field.key]: undefined }));
                  }}
                  placeholder={field.label}
                  placeholderTextColor={colors.muted}
                  keyboardType={field.keyboardType}
                  maxLength={field.maxLength}
                  multiline={field.multiline}
                  autoComplete={field.autoComplete}
                  style={[
                    styles.input,
                    field.multiline && styles.multiline,
                    errors[field.key] && styles.inputError,
                  ]}
                />
                {errors[field.key] ? <Text style={styles.error}>{errors[field.key]}</Text> : null}
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Payment Method</Text>
            {PAYMENTS.map((option) => {
              const selected = option.key === payment;
              return (
                <Pressable
                  key={option.key}
                  style={[styles.payment, selected && styles.paymentSelected]}
                  onPress={() => setPayment(option.key)}
                >
                  <Ionicons name={option.icon} size={22} color={colors.text} />
                  <View style={styles.flex}>
                    <Text style={styles.paymentLabel}>{option.label}</Text>
                    <Text style={styles.paymentHint}>{option.hint}</Text>
                  </View>
                  <Ionicons
                    name={selected ? "radio-button-on" : "radio-button-off"}
                    size={22}
                    color={selected ? colors.primary : colors.muted}
                  />
                </Pressable>
              );
            })}
          </View>

          <PriceSummary totals={totals} />
        </ScrollView>

        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.total}>{formatPrice(totals.total)}</Text>
            <Text style={styles.totalHint}>Total payable</Text>
          </View>
          <Pressable style={styles.placeButton} onPress={placeOrder} disabled={placing}>
            {placing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.placeText}>Place Order</Text>
            )}
          </Pressable>
        </View>
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
    padding: 12,
    gap: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 16,
    gap: 10,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
  },
  input: {
    fontFamily: fonts.regular,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    height: 46,
    fontSize: 15,
    color: colors.text,
  },
  multiline: {
    height: 72,
    paddingTop: 10,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: colors.sale,
  },
  error: {
    fontFamily: fonts.regular,
    color: colors.sale,
    fontSize: 12,
    marginTop: 3,
  },
  payment: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 12,
  },
  paymentSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  paymentLabel: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.text,
  },
  paymentHint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  total: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.text,
  },
  totalHint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  placeButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    minWidth: 150,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  placeText: {
    fontFamily: fonts.bold,
    color: "#fff",
    fontSize: 16,
  },
});
