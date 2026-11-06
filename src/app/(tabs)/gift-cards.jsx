import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { QtyStepper } from "@/components/qty-stepper";
import { colors, fonts, radius, shadow } from "@/constants/theme";
import { useStore } from "@/context/store";
import { formatPrice, GIFT_CARD_AMOUNTS } from "@/data/products";

const THEMES = [
  { key: "classic", label: "Classic", color: "#B24A4A", accent: "#E8A0A0", icon: "sparkles", message: "A little something for your home" },
  { key: "festive", label: "Festive", color: "#D9531E", accent: "#FFC48A", icon: "flame", message: "Celebrate with something special" },
  { key: "home", label: "New Home", color: "#2E4A75", accent: "#9DB8E8", icon: "home", message: "Congratulations on your new home" },
  { key: "love", label: "With Love", color: "#6E1D44", accent: "#F0A6C8", icon: "heart", message: "Made with love, just for you" },
];

const POPULAR_AMOUNT = 2500;

const STEPS = [
  { icon: "color-palette-outline", title: "Pick a design", text: "Choose a style and amount" },
  { icon: "mail-outline", title: "Add a note", text: "Personalise your message" },
  { icon: "bag-check-outline", title: "They shop", text: "Redeem on any product" },
];

function GiftCardPreview({ theme, amount, to, note }) {
  return (
    <View style={[styles.giftCard, { backgroundColor: theme.color }]}>
      <View style={[styles.bubble, styles.bubbleLarge, { backgroundColor: theme.accent }]} />
      <View style={[styles.bubble, styles.bubbleSmall, { backgroundColor: theme.accent }]} />

      <View style={styles.giftTop}>
        <View>
          <Text style={styles.giftBrand}>HOMETOWN</Text>
          <Text style={styles.giftKind}>E-GIFT CARD</Text>
        </View>
        <View style={styles.giftIcon}>
          <Ionicons name={theme.icon} size={20} color={theme.color} />
        </View>
      </View>

      <View style={styles.chip} />

      <View>
        <Text style={styles.giftTo} numberOfLines={1}>
          {to.trim() ? `For ${to.trim()}` : theme.label}
        </Text>
        <Text style={styles.giftNote} numberOfLines={1}>
          {note.trim() || theme.message}
        </Text>
      </View>

      <View style={styles.giftBottom}>
        <Text style={styles.giftAmount}>{formatPrice(amount)}</Text>
        <Text style={styles.giftValidity}>Valid 12 months</Text>
      </View>
    </View>
  );
}

export default function GiftCardsScreen() {
  const { addToCart } = useStore();
  const [amount, setAmount] = useState(POPULAR_AMOUNT);
  const [theme, setTheme] = useState(THEMES[0]);
  const [qty, setQty] = useState(1);
  const [to, setTo] = useState("");
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);
  function handleAdd() {
    if (added) {
      router.push("/cart");
      return;
    }
    addToCart(`gift-${amount}`, qty);
    setAdded(true);
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Gift Cards</Text>
            <Text style={styles.subtitle}>The perfect gift for every home</Text>
          </View>
          <View style={styles.headerBadge}>
            <Ionicons name="gift" size={22} color={colors.primary} />
          </View>
        </View>

        <GiftCardPreview theme={theme} amount={amount} to={to} note={note} />

        <View style={styles.section}>
          <Text style={styles.label}>Choose a design</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.themes}>
            {THEMES.map((t) => {
              const active = t.key === theme.key;
              return (
                <Pressable
                  key={t.key}
                  onPress={() => setTheme(t)}
                  style={[styles.themeTile, active && { borderColor: t.color }]}
                  accessibilityLabel={t.label}
                >
                  <View style={[styles.themeSwatch, { backgroundColor: t.color }]}>
                    <View style={[styles.themeDot, { backgroundColor: t.accent }]} />
                    <Ionicons name={t.icon} size={18} color="#fff" />
                  </View>
                  <Text style={[styles.themeLabel, active && { color: t.color }]}>{t.label}</Text>
                  {active ? (
                    <View style={[styles.themeCheck, { backgroundColor: t.color }]}>
                      <Ionicons name="checkmark" size={12} color="#fff" />
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Choose an amount</Text>
          <View style={styles.amounts}>
            {GIFT_CARD_AMOUNTS.map((value) => {
              const active = value === amount;
              return (
                <Pressable
                  key={value}
                  style={[styles.amount, active && styles.amountActive]}
                  onPress={() => {
                    setAmount(value);
                    setAdded(false);
                  }}
                >
                  {value === POPULAR_AMOUNT ? (
                    <View style={styles.popular}>
                      <Text style={styles.popularText}>POPULAR</Text>
                    </View>
                  ) : null}
                  <Text style={[styles.amountText, active && styles.amountTextActive]}>
                    {formatPrice(value)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={[styles.section, styles.panel]}>
          <Text style={styles.label}>Add a personal touch</Text>
          <View style={styles.inputRow}>
            <Ionicons name="person-outline" size={18} color={colors.muted} />
            <TextInput
              value={to}
              onChangeText={setTo}
              placeholder="Recipient's name"
              placeholderTextColor={colors.muted}
              maxLength={24}
              style={styles.input}
            />
          </View>
          <View style={styles.inputRow}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.muted} />
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Write a short message"
              placeholderTextColor={colors.muted}
              maxLength={40}
              style={styles.input}
            />
          </View>
          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Number of cards</Text>
            <QtyStepper
              value={qty}
              onChange={(value) => {
                setQty(value);
                setAdded(false);
              }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>How it works</Text>
          <View style={styles.steps}>
            {STEPS.map((step, index) => (
              <View key={step.title} style={styles.step}>
                <View style={styles.stepIcon}>
                  <Ionicons name={step.icon} size={20} color={colors.primary} />
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.total}>{formatPrice(amount * qty)}</Text>
          <Text style={styles.totalHint}>
            {qty} card{qty > 1 ? "s" : ""} · {theme.label}
          </Text>
        </View>
        <Pressable
          style={[styles.button, added && styles.buttonDone]}
          onPress={handleAdd}
        >
          <Ionicons name={added ? "cart" : "add-circle-outline"} size={18} color="#fff" />
          <Text style={styles.buttonText}>{added ? "View Cart" : "Add to Cart"}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
    gap: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.text,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  headerBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  giftCard: {
    borderRadius: 22,
    padding: 20,
    aspectRatio: 1.6,
    justifyContent: "space-between",
    overflow: "hidden",
    ...shadow.card,
  },
  bubble: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.25,
  },
  bubbleLarge: {
    width: 220,
    height: 220,
    right: -70,
    top: -90,
  },
  bubbleSmall: {
    width: 120,
    height: 120,
    right: 40,
    bottom: -60,
  },
  giftTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  giftBrand: {
    fontFamily: fonts.bold,
    color: "#fff",
    fontSize: 22,
    letterSpacing: 3,
  },
  giftKind: {
    fontFamily: fonts.medium,
    color: "rgba(255,255,255,0.75)",
    fontSize: 10,
    letterSpacing: 2,
  },
  giftIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    width: 40,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(255,215,140,0.85)",
  },
  giftTo: {
    fontFamily: fonts.semibold,
    color: "#fff",
    fontSize: 16,
  },
  giftNote: {
    fontFamily: fonts.regular,
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
  },
  giftBottom: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  giftAmount: {
    fontFamily: fonts.bold,
    color: "#fff",
    fontSize: 30,
  },
  giftValidity: {
    fontFamily: fonts.medium,
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    marginBottom: 6,
  },
  section: {
    gap: 10,
  },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.text,
  },
  themes: {
    gap: 10,
    paddingVertical: 2,
  },
  themeTile: {
    width: 92,
    alignItems: "center",
    padding: 8,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: "transparent",
    ...shadow.soft,
  },
  themeSwatch: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  themeDot: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    right: -14,
    top: -14,
    opacity: 0.4,
  },
  themeLabel: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.text,
    marginTop: 6,
  },
  themeCheck: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  amounts: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  amount: {
    width: "48%",
    paddingVertical: 18,
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: "transparent",
    ...shadow.soft,
  },
  amountActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  amountText: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    color: colors.text,
  },
  amountTextActive: {
    color: colors.primary,
  },
  popular: {
    position: "absolute",
    top: -9,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
  popularText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: "#fff",
    letterSpacing: 1,
  },
  panel: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: 16,
    ...shadow.soft,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
  },
  input: {
    fontFamily: fonts.regular,
    flex: 1,
    height: 46,
    fontSize: 14,
    color: colors.text,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  qtyLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: colors.text,
  },
  steps: {
    flexDirection: "row",
    gap: 10,
  },
  step: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 6,
    ...shadow.soft,
  },
  stepIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: "#fff",
  },
  stepTitle: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.text,
    marginTop: 8,
    textAlign: "center",
  },
  stepText: {
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.muted,
    textAlign: "center",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    ...shadow.raised,
  },
  total: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: colors.text,
  },
  totalHint: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingHorizontal: 24,
    height: 48,
  },
  buttonDone: {
    backgroundColor: colors.success,
  },
  buttonText: {
    fontFamily: fonts.semibold,
    color: "#fff",
    fontSize: 15,
  },
});
