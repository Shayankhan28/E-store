import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);

      const res = await fetch(`https://dummyjson.com/products/${id}`);
      const data = await res.json();

      if (data && data.id) {
        setProduct(data);
      } else {
        setProduct(null);
      }
    } catch (e) {
      console.error("Error fetching product details:", e);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  // Safe category formatting
  const displayCategory = product?.category
    ? String(product.category).toUpperCase().replace(/-/g, " ")
    : "GENERAL";

  // Loading Screen
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingWrap} edges={["top", "left", "right"]}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <ActivityIndicator size="large" color="#22c55e" />
      </SafeAreaView>
    );
  }

  // Error Screen
  if (!product) {
    return (
      <SafeAreaView style={styles.errorWrap} edges={["top", "left", "right"]}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <Ionicons name="alert-circle-outline" size={70} color="#ef4444" />

        <Text style={styles.errorText}>Product not found!</Text>

        <TouchableOpacity
          style={styles.goBackBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          Product Details
        </Text>

        <View style={{ width: 40 }} />
      </View>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* PRODUCT IMAGE */}
        <View style={styles.imgContainer}>
          <Image
            source={{
              uri: product?.thumbnail || "https://via.placeholder.com/300",
            }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* DETAILS */}
        <View style={styles.detailsContainer}>
          {/* CATEGORY + STOCK */}
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{displayCategory}</Text>
            </View>

            <View
              style={[
                styles.stockBadge,
                Number(product?.stock) > 0 ? styles.inStock : styles.outOfStock,
              ]}
            >
              <Text
                style={[
                  styles.stockText,
                  {
                    color: Number(product?.stock) > 0 ? "#15803d" : "#dc2626",
                  },
                ]}
              >
                {Number(product?.stock) > 0
                  ? `In Stock (${product.stock})`
                  : "Out of Stock"}
              </Text>
            </View>
          </View>

          {/* TITLE */}
          <Text style={styles.title}>
            {product?.title || "Untitled Product"}
          </Text>

          {/* PRICE + RATING */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>${product?.price || 0}</Text>

            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color="#f59e0b" />

              <Text style={styles.ratingNumber}>{product?.rating || 0}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* DESCRIPTION */}
          <Text style={styles.descTitle}>Description</Text>

          <Text style={styles.description}>
            {product?.description ||
              "No description available for this product."}
          </Text>
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cartBtn}
          activeOpacity={0.9}
          onPress={() => {
            addToCart({
              id: product.id,
              title: product.title,
              price: product.price,
              image: product.thumbnail,
            });

            Alert.alert("Success 🎉", `${product.title} added to your cart!`);
          }}
        >
          <Ionicons
            name="cart-outline"
            size={22}
            color="#fff"
            style={{ marginRight: 8 }}
          />

          <Text style={styles.cartBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  errorWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },

  errorText: {
    fontSize: 20,
    color: "#111",
    fontWeight: "800",
    marginTop: 16,
    marginBottom: 24,
  },

  goBackBtn: {
    backgroundColor: "#22c55e",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },

  goBackText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#f9fafb",
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },

  imgContainer: {
    width: "100%",
    height: 340,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },

  image: {
    width: "82%",
    height: "82%",
  },

  detailsContainer: {
    padding: 24,
  },

  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  categoryBadge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 30,
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6b7280",
    letterSpacing: 0.6,
  },

  stockBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 30,
  },

  inStock: {
    backgroundColor: "#dcfce7",
  },

  outOfStock: {
    backgroundColor: "#fee2e2",
  },

  stockText: {
    fontSize: 12,
    fontWeight: "800",
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111",
    lineHeight: 36,
    marginBottom: 16,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  price: {
    fontSize: 30,
    fontWeight: "900",
    color: "#22c55e",
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fffbeb",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },

  ratingNumber: {
    fontSize: 15,
    fontWeight: "800",
    color: "#d97706",
    marginLeft: 5,
  },

  divider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginBottom: 24,
  },

  descTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: 14,
  },

  description: {
    fontSize: 15,
    lineHeight: 28,
    color: "#4b5563",
  },

  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    backgroundColor: "#fff",
  },

  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#22c55e",

    paddingVertical: 18,
    borderRadius: 18,

    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },

  cartBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
