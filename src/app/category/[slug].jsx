import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { ProductCard } from "@/components/product-card";
import { colors, fonts } from "@/constants/theme";
import { getCollection } from "@/data/products";

const SORTS = [
  { key: "popular", label: "Popular", compare: (a, b) => b.reviews - a.reviews },
  { key: "low", label: "Price: Low to High", compare: (a, b) => a.price - b.price },
  { key: "high", label: "Price: High to Low", compare: (a, b) => b.price - a.price },
  { key: "discount", label: "Discount", compare: (a, b) => b.discount - a.discount },
  { key: "rating", label: "Rating", compare: (a, b) => b.rating - a.rating },
];

const PRICE_RANGES = [
  { key: "any", label: "Any Price", min: 0, max: Infinity },
  { key: "u5", label: "Under ₹5,000", min: 0, max: 5000 },
  { key: "5-25", label: "₹5,000 - ₹25,000", min: 5000, max: 25000 },
  { key: "25-75", label: "₹25,000 - ₹75,000", min: 25000, max: 75000 },
  { key: "75+", label: "Above ₹75,000", min: 75000, max: Infinity },
];

function Chip({ label, active, onPress }) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams();
  const collection = getCollection(slug);
  const [sortKey, setSortKey] = useState("popular");
  const [rangeKey, setRangeKey] = useState("any");

  const items = useMemo(() => {
    const sort = SORTS.find((s) => s.key === sortKey);
    const range = PRICE_RANGES.find((r) => r.key === rangeKey);
    return collection.products
      .filter((p) => p.price >= range.min && p.price < range.max)
      .sort(sort.compare);
  }, [collection.products, sortKey, rangeKey]);

  return (
    <>
      <Stack.Screen options={{ title: collection.title }} />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.count}>{items.length} products</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {SORTS.map((s) => (
                <Chip key={s.key} label={s.label} active={s.key === sortKey} onPress={() => setSortKey(s.key)} />
              ))}
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {PRICE_RANGES.map((r) => (
                <Chip key={r.key} label={r.label} active={r.key === rangeKey} onPress={() => setRangeKey(r.key)} />
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No products in this range"
            message="Try another price filter."
            actionLabel="Clear Filters"
            onAction={() => setRangeKey("any")}
          />
        }
        renderItem={({ item }) => <ProductCard product={item} style={styles.card} />}
        ListFooterComponent={
          <Pressable style={styles.footer} onPress={() => router.push("/categories")}>
            <Text style={styles.footerText}>Browse all categories</Text>
          </Pressable>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 12,
    paddingBottom: 32,
  },
  column: {
    gap: 10,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    maxWidth: "50%",
  },
  header: {
    gap: 8,
    marginBottom: 12,
  },
  count: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  chips: {
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  chipText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.text,
  },
  chipTextActive: {
    color: "#fff",
  },
  footer: {
    alignItems: "center",
    padding: 16,
  },
  footerText: {
    color: colors.accent,
    fontFamily: fonts.semibold,
  },
});
