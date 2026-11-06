import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { CartIcon } from "@/components/header-icons";
import { colors, fonts } from "@/constants/theme";
import { AuthProvider, useAuth } from "@/context/auth";
import { StoreProvider } from "@/context/store";

SplashScreen.preventAutoHideAsync();

function RootStack() {
  const { loaded, user } = useAuth();

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: fonts.semibold, fontSize: 17 },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: "minimal",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="category/[slug]"
          options={{ title: "", headerRight: () => <CartIcon /> }}
        />
        <Stack.Screen
          name="product/[id]"
          options={{ title: "", headerRight: () => <CartIcon /> }}
        />
        <Stack.Screen name="search" options={{ title: "Search" }} />
        <Stack.Screen name="cart" options={{ title: "My Cart" }} />
        <Stack.Screen name="wishlist" options={{ title: "My Wishlist" }} />
        <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
        <Stack.Screen name="orders" options={{ title: "My Orders" }} />
        <Stack.Screen name="order/[id]" options={{ title: "Order Details" }} />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthProvider>
        <StoreProvider>
          <StatusBar style="dark" />
          <RootStack />
        </StoreProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
