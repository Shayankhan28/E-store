import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />

          {/* Changed from ProductDetailScreen to product-detail */}
          <Stack.Screen
            name="product-detail"
            options={{ presentation: "card" }}
          />

          {/* Changed from EditProfileScreen to edit-profile */}
          <Stack.Screen
            name="edit-profile"
            options={{ presentation: "card" }}
          />

          {/* This one was actually correct if your file is named OrderSuccessScreen.js */}
          <Stack.Screen
            name="OrderSuccessScreen"
            options={{ presentation: "card" }}
          />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}
