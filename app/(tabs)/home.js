import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ProductCard from "../../components/ProductCard";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

export default function HomeScreen() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      // 🔴 FIX: limit=0 set kiya hai, isse DummyJSON apne saare products return karega
      const res = await fetch("https://dummyjson.com/products?limit=0");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, []);

  const handleAddToCart = (item) => {
    if (addToCart) {
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.thumbnail,
      });
      Alert.alert("Success 🎉", `${item.title} has been added to your cart!`);
    }
  };

  const filtered = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const firstName = userProfile?.fullName?.split(" ")[0] || "there";

  return (
    // 🟢 SafeArea edges fixed for notch screens
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {firstName} 👋</Text>
          <Text style={styles.subGreeting}>Find what you need today</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn} onPress={() => {}}>
          <Ionicons name="notifications-outline" size={22} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* SEARCH BAR */}
      <View style={styles.searchWrap}>
        <Ionicons
          name="search-outline"
          size={18}
          color="#9ca3af"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color="#9ca3af" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#22c55e"
          />
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTag}>🔥 Hot Deal</Text>
            <Text style={styles.bannerTitle}>
              Up to 40% Off{"\n"}New Arrivals
            </Text>
            <TouchableOpacity
              style={styles.bannerBtn}
              onPress={() => router.push("/(tabs)/categories")}
            >
              <Text style={styles.bannerBtnText}>Shop Now</Text>
              <Ionicons name="arrow-forward" size={14} color="#22c55e" />
            </TouchableOpacity>
          </View>
          <View style={styles.bannerDecor}>
            <Ionicons
              name="shirt-outline"
              size={60}
              color="rgba(255,255,255,0.3)"
            />
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Trending Products ({filtered.length})
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/categories")}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#22c55e" />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.loadingWrap}>
            <Text style={{ color: "#9ca3af" }}>
              No products matched your search.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {filtered.map((item) => (
              <ProductCard
                key={item.id}
                product={{ ...item, image: item.thumbnail }}
                onPress={() =>
                  router.push({
                    pathname: "/product-detail",
                    params: { id: String(item.id) },
                  })
                }
                onAddToCart={() => handleAddToCart(item)}
              />
            ))}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    backgroundColor: "#fff",
  },
  greeting: { fontSize: 22, fontWeight: "800", color: "#111" },
  subGreeting: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 18,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#111" },
  banner: {
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#22c55e",
    padding: 22,
    marginBottom: 24,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  bannerContent: { flex: 1 },
  bannerTag: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
    marginBottom: 6,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 26,
    marginBottom: 16,
  },
  bannerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: "flex-start",
    gap: 6,
  },
  bannerBtnText: { color: "#22c55e", fontWeight: "700", fontSize: 13 },
  bannerDecor: { alignItems: "center", justifyContent: "center", opacity: 0.5 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#111" },
  seeAll: { fontSize: 13, color: "#22c55e", fontWeight: "600" },
  loadingWrap: { paddingVertical: 40, alignItems: "center" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 12,
  },
});
