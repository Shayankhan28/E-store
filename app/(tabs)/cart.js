import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CartItem from "../../components/CartItem";
import { useCart } from "../../context/CartContext";

export default function CartScreen() {
  const router = useRouter();

  // 🟢 FIXED: Yahan updateQuantity aur removeFromCart ko extract kiya taaki + / - kaam kare
  const {
    cartItems = [],
    cartTotal = 0,
    cartCount = 0,
    placeOrder,
    updateQuantity,
    removeFromCart,
  } = useCart() || {};

  const DELIVERY = cartItems.length > 0 ? 15 : 0;
  const finalTotal = cartTotal + DELIVERY;

  const handleOrder = () => {
    Alert.alert(
      "Confirm Order",
      `Total: $${finalTotal.toFixed(2)}\nProceed to place order?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Place Order",
          onPress: async () => {
            if (placeOrder) {
              await placeOrder();
            }
            router.push("/OrderSuccessScreen");
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.iconBg}>
            <Ionicons name="bag-handle" size={20} color="#22c55e" />
          </View>
          <Text style={styles.headerTitle}>E-Store</Text>
        </View>
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="cart-outline" size={80} color="#d1fae5" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add items to start shopping</Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => router.push("/")}
          >
            <Text style={styles.shopBtnText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.cartHeaderRow}>
            <Text style={styles.myCartTitle}>My Cart</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{cartCount} items</Text>
            </View>
          </View>

          <FlatList
            data={cartItems}
            keyExtractor={(item, index) => String(item?.id || index)}
            // 🟢 FIXED: Yahan CartItem ko + aur - (increase/decrease) ki power de di hai
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onIncrease={() =>
                  updateQuantity && updateQuantity(item.id, "increase")
                }
                onDecrease={() =>
                  updateQuantity && updateQuantity(item.id, "decrease")
                }
                onRemove={() => removeFromCart && removeFromCart(item.id)}
              />
            )}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${cartTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={styles.summaryValue}>${DELIVERY.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.orderBtn} onPress={handleOrder}>
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.orderBtnText}>Confirm Order</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
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
  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
    marginTop: 16,
  },
  emptySub: { fontSize: 14, color: "#9ca3af", marginTop: 6, marginBottom: 28 },
  shopBtn: {
    backgroundColor: "#22c55e",
    borderRadius: 14,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  shopBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  cartHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  myCartTitle: { fontSize: 20, fontWeight: "800", color: "#111" },
  countBadge: {
    backgroundColor: "#dcfce7",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: { color: "#16a34a", fontWeight: "700", fontSize: 12 },
  summaryCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: { color: "#6b7280", fontSize: 14 },
  summaryValue: { color: "#374151", fontSize: 14, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#f3f4f6", marginVertical: 10 },
  totalLabel: { fontSize: 16, fontWeight: "800", color: "#111" },
  totalValue: { fontSize: 20, fontWeight: "800", color: "#111" },
  orderBtn: {
    backgroundColor: "#22c55e",
    borderRadius: 14,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  orderBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
