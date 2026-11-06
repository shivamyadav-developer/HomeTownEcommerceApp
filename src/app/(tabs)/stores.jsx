import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  FlatList,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, fonts, radius, shadow } from "@/constants/theme";
import { STORES } from "@/data/stores";

const CITIES = ["All", ...new Set(STORES.map((s) => s.city))];

export default function StoresScreen() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All");
  const q = query.trim().toLowerCase();
  const stores = STORES.filter(
    (s) =>
      (city === "All" || s.city === city) &&
      (!q || `${s.city} ${s.state} ${s.name} ${s.address} ${s.pincode}`.toLowerCase().includes(q)),
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <Text style={styles.title}>Find a Store</Text>
      <Text style={styles.subtitle}>{STORES.length} HomeTown stores across India</Text>
      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by city, state or pincode"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
        {query ? (
          <Pressable onPress={() => setQuery("")} hitSlop={8} accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={18} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {CITIES.map((c) => {
            const active = c === city;
            return (
              <Pressable
                key={c}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setCity(c)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <FlatList
        data={stores}
        keyExtractor={(s) => s.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<Text style={styles.empty}>No stores found. Try another city.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="storefront-outline" size={22} color={colors.sectionTitle} />
              <View style={styles.flex}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.city}>
                  {item.city}, {item.state}
                </Text>
              </View>
            </View>
            <Text style={styles.address}>{item.address}</Text>
            <Text style={styles.hours}>{item.phone}</Text>
            <View style={styles.actions}>
              <Pressable
                style={styles.action}
                onPress={() => Linking.openURL(`tel:${item.phone.replace(/[^\d+]/g, "")}`)}
              >
                <Ionicons name="call-outline" size={16} color={colors.primary} />
                <Text style={styles.actionText}>Call</Text>
              </Pressable>
              <Pressable
                style={styles.action}
                onPress={() =>
                  Linking.openURL(
                    item.latitude
                      ? `https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`
                      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.address)}`,
                  )
                }
              >
                <Ionicons name="navigate-outline" size={16} color={colors.primary} />
                <Text style={styles.actionText}>Directions</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
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
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.text,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    paddingHorizontal: 16,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 16,
    marginBottom: 4,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 46,
    ...shadow.soft,
  },
  chips: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipText: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: colors.text,
  },
  chipTextActive: {
    color: "#fff",
  },
  input: {
    fontFamily: fonts.regular,
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 24,
    gap: 12,
  },
  empty: {
    fontFamily: fonts.regular,
    textAlign: "center",
    color: colors.muted,
    marginTop: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 14,
    gap: 6,
    ...shadow.soft,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  name: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.text,
  },
  city: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.muted,
  },
  address: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
  },
  hours: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.success,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  actionText: {
    fontFamily: fonts.semibold,
    color: colors.primary,
    fontSize: 13,
  },
});
