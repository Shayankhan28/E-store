import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "estore_cart";

export const saveCart = async (cartItems) => {
  try {
    await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error saving cart:", error);
  }
};

export const loadCart = async () => {
  try {
    const data = await AsyncStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error loading cart:", error);
    return [];
  }
};

export const clearCart = async () => {
  try {
    await AsyncStorage.removeItem(CART_KEY);
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};
