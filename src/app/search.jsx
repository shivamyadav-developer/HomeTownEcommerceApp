import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { ProductCard } from "@/components/product-card";
import { colors, radius, fonts } from "@/constants/theme";
import { searchProducts } from "@/data/products";

const POPULAR = ["Sofa", "Bed", "Mattress", "Dining", "Chair", "Kitchen", "Lamp", "Desk"];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => searchProducts(query), [query]);

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Ionicons name="search" size={20} color={colors.text} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search sofas, beds, mattresses..."
          placeholderTextColor={colors.muted}
          style={styles.input}
          autoFocus
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {query ? (
          <Pressable onPress={() => setQuery("")} hitSlop={8} accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={20} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>

      {!query.trim() ? (
        <View style={styles.popular}>
          <Text style={styles.popularTitle}>Popular searches</Text>
          <View style={styles.tags}>
            {POPULAR.map((term) => (
              <Pressable key={term} style={styles.tag} onPress={() => setQuery(term)}>
                <Ionicons name="trending-up" size={14} color={colors.primary} />
                <Text style={styles.tagText}>{term}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={styles.browse} onPress={() => router.push("/categories")}>
            <Text style={styles.browseText}>Browse all categories</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            results.length ? (
              <Text style={styles.count}>
                {results.length} results for “{query.trim()}”
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title={`No results for “${query.trim()}”`}
              message="Check the spelling or try a different word."
            />
          }
          renderItem={({ item }) => <ProductCard product={item} style={styles.card} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 12,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  input: {
    fontFamily: fonts.regular,
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  popular: {
    paddingHorizontal: 16,
    gap: 12,
  },
  popularTitle: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.text,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  tagText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.text,
  },
  browse: {
    marginTop: 8,
  },
  browseText: {
    color: colors.accent,
    fontFamily: fonts.semibold,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 32,
    flexGrow: 1,
  },
  column: {
    gap: 10,
    marginBottom: 10,
  },
  card: {
    flex: 1,
    maxWidth: "50%",
  },
  count: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    marginBottom: 10,
  },
});
