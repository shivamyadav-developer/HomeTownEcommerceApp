import { router } from "expo-router";
import { FlatList, StyleSheet } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { ProductCard } from "@/components/product-card";
import { useStore } from "@/context/store";
import { getProduct } from "@/data/products";

export default function WishlistScreen() {
  const { wishlist } = useStore();
  const items = wishlist.map(getProduct).filter(Boolean);

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.column}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <EmptyState
          icon="heart-outline"
          title="Your wishlist is empty"
          message="Tap the heart on any product to save it here."
          actionLabel="Explore Products"
          onAction={() => router.push("/category/all")}
        />
      }
      renderItem={({ item }) => <ProductCard product={item} style={styles.card} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 12,
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
});
