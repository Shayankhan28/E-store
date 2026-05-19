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

// Har category name ke mutabiq uske sath perfect matching icon set karne ke liye object map banaya
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
  const { addToCart } = useCart(); // Cart mein product add karne ke liye context hook

  // States Matrix:
  const [categories, setCategories] = useState([]); // API se aane wali categories ki list
  const [selectedCat, setSelectedCat] = useState("all"); // Is waqt kaunsi category select hai (Default: "all")
  const [products, setProducts] = useState([]); // Selected category ke items store karne ke liye
  const [loading, setLoading] = useState(true); // Internet fetch ke dauran loader ghumane ke liye
  //  App open hote hi bina kisi rukawat ke dono parallel fetch chalenge

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Promise.all use karne se fetchCategories aur fetchProducts parallel (ek hi waqt) chalte hain, jis se time bachaata hai
        await Promise.all([fetchCategories(), fetchProducts("all")]);
      } catch (err) {
        console.log("Initialization error:", err);
      } finally {
        setLoading(false); // Agar koi error bhi aaye, toh loader off ho jaye taake screen stuck na ho
      }
    };
    loadData();
  }, []);

  const fetchCategories = async () => {
    try {
      // Internet (API) se product categories ka raw data mangwaya
      const res = await fetch("https://dummyjson.com/products/categories");

      // Us raw data ko readable JSON format (JavaScript object/array) mein convert kiya
      const data = await res.json();

      //  Check kiya ke API se aane wala data ek proper List (Array) hai ya nahi
      if (Array.isArray(data)) {
        // `.map` loop chalaya taake data agar kisi alag format mein ho, toh usse saaf kiya ja sake
        const formatted = data
          .map((item) => {
            if (!item) return ""; // Agar item khali ya null hai, toh khali string return karo

            // Agar item ek Object hai (e.g. {slug: "beauty", name: "Beauty"}), toh pehle slug uthao, nahi toh name
            if (typeof item === "object") return item.slug || item.name || "";

            // Agar item pehle se hi ek saada text (string) hai, toh usse as-it-is return kar do
            return typeof item === "string" ? item : ""; //beya ternary operator
          })
          // `.filter(Boolean)` ka kaam hai array se tamam khali strings ("") ya null values ko delete karna
          .filter(Boolean);

        // Saaf-suthra data categories ki state mein save kar diya taake screen par dikhe
        setCategories(formatted);
      } else {
        // fallback Agar API se direct array nahi mila (API ka structure change ho gaya),
        // toh yeh default categories khud se set kar dega taake app crash na ho
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
      // ERROR HANDLING: Agar internet band ho ya API down ho, toh error terminal mein print hoga
      console.error("Categories Fetch Error:", e);

      // Aur user ko khali screen na dikhe, isliye offline/default data screen par set kar diya
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
      // Agar 'all' ke ilawa koi specific category select hai, toh dynamic URL banao:
      if (cat && cat !== "all") {
        url = `https://dummyjson.com/products/category/${cat}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setProducts(data.products || []); // Products state update
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
    setSelectedCat(cat); // Active selected state update hui (chip color change karne ke liye)
    setLoading(true); // Products list area mein loader on
    await fetchProducts(cat); // Naye products fetch kiye
    setLoading(false); // Loader off
  };

  // Agar 'all' select hai toh "All Products" heading banegi, warna slug text (jaise home-decoration)
  //  ko formal Capitalized words ("Home Decoration") mein convert karega:
  const displayTitle =
    selectedCat === "all"
      ? "All Products"
      : String(selectedCat)
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

  return (
    // 1. SAFE AREA WRAPPER: Yeh poori screen ka main container hai.
    // edges={["top", "left", "right"]} ka matlab hai ke content mobile ke top notch,
    // left aur right sides se safe rahega (unke andar nahi ghusega), lekin bottom edge par rules nahi lagaye.
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      {/* STATUS BAR: Mobile screen ke sabsay upar jahan Battery, Network aur Time aata hai, 
          uska background color White (#fff) kiya aur icons ko dark (blackish) rakha */}
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* 2. MAIN HEADER BLOCK: Yeh aapki screen ka main top layout / header box hai */}
      <View style={styles.header}>
        {/* flexDirection: "row" dene se iske andar ke items (Icon aur Text) left-to-right ek hi line mein aate hain.
            alignItems: "center" dono ko vertical height ke hisab se ek bilkul seedh (alignment) mein rakhta hai */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* LOGO ICON BACKGROUND: Icon ke peeche ek chota sa light-green gola banane ke liye View */}
          <View style={styles.iconBg}>
            {/* Shopping bag ka icon jiska color solid green (#22c55e) aur size 20 rakha hai */}
            <Ionicons name="bag-handle" size={20} color="#22c55e" />
          </View>

          {/* APP NAME TEXT: Logo icon ke bilkul sath 'E-Store' brand name print hoga */}
          <Text style={styles.headerTitle}>E-Store</Text>
        </View>
      </View>

      {/* HORIZONTAL CATEGORY CHIPS CONTAINER: Yeh poore sliding area ka main wrapper box hai */}
      <View style={styles.chipWrapper}>
        {/* SCROLLVIEW: Iske zariye user chips ko left aur right swipe (scroll) kar sakta hai */}
        <ScrollView
          horizontal={true} // 🟢 Is property se list vertical ke bajaye horizontal (bhi leti hui) chalti hai
          showsHorizontalScrollIndicator={false} // 🟢 Scroll karte waqt jo niche patli line (scrollbar) aati hai, usko hide kiya taaki design clean lage
          contentContainerStyle={styles.chipContainer} // Inner items ki spacing aur alignment set karne ke liye styles
        >
          {/* 'ALL' CATEGORY BUTTON: Yeh pehla static button hai jo sabhi products dikhane ke liye hai */}
          <TouchableOpacity
            // array style use ki hai: default style 'styles.chip' toh lagegi hi,
            // lekin AGAR selectedCat === "all" sach hai (user ne ispar click kiya hua hai), toh active green style bhee attach ho jayegi
            style={[styles.chip, selectedCat === "all" && styles.chipActive]}
            onPress={() => handleCategoryPress("all")} // Click karne par "all" products load karne ka function chalega
          >
            {/* BUTTON TEXT: 'All' ka lafzi text */}
            <Text
              style={[
                styles.chipText,
                selectedCat === "all" && styles.chipTextActive, // Agar active hai toh text ka rang white ho jayega
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {/* 1. DYNAMIC CATEGORIES LOOP: API se aayi hui categories ki list par map chalaya */}
          {categories.map((cat) => {
            // Check kiya ke loop chalte waqt kya yeh wahi category hai jo user ne select ki hai?
            const isSelected = selectedCat === cat;

            // STRING FORMATTING: Pehla letter Capital kiya aur dash (-) ko space se replace kiya (e.g. "smartphones" -> "Smartphones")
            const readableName =
              String(cat).charAt(0).toUpperCase() +
              String(cat).slice(1).replace("-", " ");

            return (
              <TouchableOpacity
                key={cat} // React ko har item ki unique identity batane ke liye key di
                // Agar user ne is chip ko select kiya hai, toh sath mein styles.chipActive (green bg) bhi apply ho jaye
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => handleCategoryPress(cat)} // Click karne par us category ka data load karne ka function
              >
                {/* ICON DYNAMICS: Agar CATEGORY_ICONS object mein icon match ho toh wo dikhao, nahi toh default 'apps-outline' icon */}
                <Ionicons
                  name={CATEGORY_ICONS[cat] || "apps-outline"}
                  size={14}
                  color={isSelected ? "#fff" : "#6b7280"} // Selected par white icon, warna grey color
                  style={{ marginRight: 6 }}
                />
                {/* CATEGORY TEXT: Formatting kiya hua saaf naam button ke andar print kiya */}
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

      {/* 2. DYNAMIC HEADING: Jo category selected hai (e.g. "Laptops"), uski heading yahan show hogi */}
      <Text style={styles.sectionTitle}>{displayTitle}</Text>

      {/* 3. CONDITIONAL RENDERING: Loading, Empty State, aur Grid Data ko handle karne ka ternary logic */}
      {loading ? (
        // CONDITION A: Agar products abhi internet se load ho rahe hain, toh loading spinner ghumao
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      ) : products.length === 0 ? (
        // CONDITION B: Agar loading khatam ho gayi lekin us category mein koi product nahi mila (Empty List)
        <View style={styles.loadingWrap}>
          <Text style={styles.emptyText}>
            No products found in this category
          </Text>
        </View>
      ) : (
        // CONDITION C: Agar products ka data kamyabi se mil gaya, toh unhe niche vertical scroll list mein dikhao
        <ScrollView
          showsVerticalScrollIndicator={false} // Side par aane wali vertical scroll line ko hide kiya
          contentContainerStyle={styles.gridContainer}
        >
          {/* PRODUCT GRID: Items ko grid (boxes matrix) layout mein wrap karne ke liye main View */}
          <View style={styles.grid}>
            {/* Products array par loop chalaya aur ek-ek karke cards banaye */}
            {products.map((item) => (
              <ProductCard
                key={item.id} // Har card ko unique id di
                // Product ka poora data bheja aur safety ke liye thumbnail na hone par placeholder image set ki
                product={{
                  ...item,
                  image: item.thumbnail || "https://via.placeholder.com/150",
                }}
                onPress={() =>
                  // Product Card par click karne se user Detail Screen par navigate ho jayega aur sath mein id pass hogi
                  router.push({
                    pathname: "/product-detail",
                    params: { id: String(item.id) },
                  })
                }
                onAddToCart={() => handleAddToCart(item)} // Cart mein item add karne ka context function trigger kiya
              />
            ))}
          </View>
          {/* BOTTOM SPACER: Ek khali space block taake aakhri card bottom tab navigation bar ke peeche na chupe */}
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
