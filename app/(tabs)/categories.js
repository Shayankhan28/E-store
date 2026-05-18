import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductCard from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";

const CATEGORY_ICONS = {
  beauty: "sparkles-outline",
  fragrances: "color-wand-outline",
  furniture: "bed-outline",
  groceries: "cart-outline",
  "home-decoration": "home-outline",
  laptops: "laptop-outline",
  smartphones: "phone-portrait-outline",
  skincare: "water-outline",
};

export default function CategoriesScreen() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🟢 App open hote hi bina kisi rukawat ke dono parallel fetch chalenge
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchCategories(), fetchProducts("all")]);
      } catch (err) {
        console.log("Initialization error:", err);
      } finally {
        setLoading(false); // 🔴 Kisi bhi haal me loading false hogi taaki screen stuck na ho
      }
    };
    loadData();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://dummyjson.com/products/categories");
      const data = await res.json();

      if (Array.isArray(data)) {
        const formatted = data
          .map((item) => {
            if (!item) return "";
            if (typeof item === "object") return item.slug || item.name || "";
            return typeof item === "string" ? item : "";
          })
          .filter(Boolean);

        setCategories(formatted);
      } else {
        // Fallback agar direct array na mile (DummyJSON changes fallback)
        setCategories([
          "beauty",
          "fragrances",
          "furniture",
          "groceries",
          "laptops",
          "smartphones",
        ]);
      }
    } catch (e) {
      console.error("Categories Fetch Error:", e);
      // API down hone par fallback chips taaki UI khali na dikhe
      setCategories([
        "beauty",
        "fragrances",
        "furniture",
        "groceries",
        "laptops",
        "smartphones",
      ]);
    }
  };

  const fetchProducts = async (cat) => {
    try {
      let url = "https://dummyjson.com/products?limit=30";
      if (cat && cat !== "all") {
        url = `https://dummyjson.com/products/category/${cat}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (e) {
      console.error("Products Fetch Error:", e);
      setProducts([]);
      Alert.alert(
        "Network Error",
        "Failed to load products. Please check your internet connection.",
      );
    }
  };

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

  const handleCategoryPress = async (cat) => {
    setSelectedCat(cat);
    setLoading(true);
    await fetchProducts(cat);
    setLoading(false);
  };

  const displayTitle =
    selectedCat === "all"
      ? "All Products"
      : String(selectedCat)
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 🟢 FIXED: Aapka puraana header design, sirf text se pehle logo row add ki hai */}
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.iconBg}>
            <Ionicons name="bag-handle" size={20} color="#22c55e" />
          </View>
          <Text style={styles.headerTitle}>E-Store</Text>
        </View>
      </View>

      {/* Horizontal Category Chips */}
      <View style={styles.chipWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipContainer}
        >
          <TouchableOpacity
            style={[styles.chip, selectedCat === "all" && styles.chipActive]}
            onPress={() => handleCategoryPress("all")}
          >
            <Text
              style={[
                styles.chipText,
                selectedCat === "all" && styles.chipTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const isSelected = selectedCat === cat;
            const readableName =
              String(cat).charAt(0).toUpperCase() +
              String(cat).slice(1).replace("-", " ");

            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => handleCategoryPress(cat)}
              >
                <Ionicons
                  name={CATEGORY_ICONS[cat] || "apps-outline"}
                  size={14}
                  color={isSelected ? "#fff" : "#6b7280"}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[styles.chipText, isSelected && styles.chipTextActive]}
                >
                  {readableName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <Text style={styles.sectionTitle}>{displayTitle}</Text>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      ) : products.length === 0 ? (
        <View style={styles.loadingWrap}>
          <Text style={styles.emptyText}>
            No products found in this category
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
        >
          <View style={styles.grid}>
            {products.map((item) => (
              <ProductCard
                key={item.id}
                product={{
                  ...item,
                  image: item.thumbnail || "https://via.placeholder.com/150",
                }}
                onPress={() =>
                  // 🔴 Expo-router safe detail navigation link
                  router.push({
                    pathname: "/product-detail",
                    params: { id: String(item.id) },
                  })
                }
                onAddToCart={() => handleAddToCart(item)}
              />
            ))}
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9fafb" },
  // 🟢 Aapki original styles ko wapas as-it-is kar diya hai
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  // 🟢 Sirf logo icon ki design add ki hai bina alignment chede
  iconBg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#22c55e" },
  chipWrapper: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  chipContainer: {
    paddingHorizontal: 16,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chipActive: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
    elevation: 3,
  },
  chipText: { fontSize: 14, fontWeight: "600", color: "#6b7280" },
  chipTextActive: { color: "#fff" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  emptyText: { color: "#9ca3af", fontSize: 14, fontWeight: "500" },
  gridContainer: { paddingHorizontal: 12 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
});
