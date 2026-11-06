import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { HeaderActions } from "@/components/header-icons";
import { colors, fonts, shadow } from "@/constants/theme";

const FILTERS = [
  { label: "All", slug: "all" },
  { label: "Furniture", slug: "furniture" },
  { label: "Mattresses", slug: "mattresses" },
  { label: "Living Room", slug: "living-room" },
  { label: "Bed Room", slug: "bed-room" },
  { label: "Decor", slug: "decor" },
  { label: "Kitchen", slug: "kitchen" },
  { label: "Dining", slug: "dining" },
  { label: "Study", slug: "study" },
];

export function HomeHeader() {
  return (
    <View>
      <View style={styles.topBar}>
        <Pressable
          style={styles.brand}
          onPress={() => router.push("/categories")}
          accessibilityLabel="Open categories"
        >
          <Ionicons name="menu" size={26} color={colors.text} />
          <Text style={styles.brandText}>
            Home<Text style={styles.brandAccent}>Town</Text>
          </Text>
        </Pressable>
        <HeaderActions />
      </View>

      <Pressable style={styles.search} onPress={() => router.push("/search")}>
        <Ionicons name="search" size={20} color={colors.text} />
        <Text style={styles.searchText}>Search</Text>
        <Ionicons name="mic-outline" size={20} color={colors.muted} />
      </Pressable>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {FILTERS.map((filter, index) => (
          <Pressable
            key={filter.slug}
            onPress={() => router.push(`/category/${filter.slug}`)}
            hitSlop={6}
            style={[styles.filterChip, index === 0 && styles.filterChipActive]}
          >
            <Text style={[styles.filter, index === 0 && styles.filterActive]}>
              {filter.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandText: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.brandBrown,
    letterSpacing: -0.3,
  },
  brandAccent: {
    color: colors.brandOrange,
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 16,
    marginTop: 6,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.card,
    ...shadow.soft,
  },
  searchText: {
    fontFamily: fonts.regular,
    flex: 1,
    fontSize: 16,
    color: colors.muted,
  },
  filters: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterChipActive: {
    backgroundColor: colors.accentSoft,
  },
  filter: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text,
  },
  filterActive: {
    fontFamily: fonts.semibold,
    color: colors.accent,
  },
});
