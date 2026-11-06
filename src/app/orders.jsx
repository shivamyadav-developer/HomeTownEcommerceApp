import { router } from "expo-router";
import { FlatList, StyleSheet } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { OrderSummary } from "@/components/order-summary";
import { useStore } from "@/context/store";

export default function OrdersScreen() {
  const { orders } = useStore();

  return (
    <FlatList
      data={orders}
      keyExtractor={(order) => order.id}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        <EmptyState
          icon="receipt-outline"
          title="No orders yet"
          message="Your placed orders will show up here."
          actionLabel="Start Shopping"
          onAction={() => router.dismissTo("/")}
        />
      }
      renderItem={({ item }) => (
        <OrderSummary order={item} onPress={() => router.push(`/order/${item.id}`)} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 12,
    gap: 12,
    flexGrow: 1,
  },
});
