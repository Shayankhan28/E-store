import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCart } from "../context/CartContext";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <View style={styles.card}>
      {/* IMAGE */}
      <Image
        source={{
          uri: item?.image || "https://via.placeholder.com/100",
        }}
        style={styles.image}
      />

      {/* DETAILS */}
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>
          {item.title}
        </Text>

        <Text style={styles.price}>${item.price}</Text>

        {/* QUANTITY WORKING */}
        <View style={styles.bottomRow}>
          <View style={styles.qtyWrap}>
            <TouchableOpacity
              style={styles.qtyBtn}
              // 🟢 FIXED: "decrease" ko badal kar "decrement" kiya
              onPress={() => updateQuantity(item.id, "decrement")}
            >
              <Ionicons name="remove" size={18} color="#111" />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              // 🟢 FIXED: "increase" ko badal kar "increment" kiya
              onPress={() => updateQuantity(item.id, "increment")}
            >
              <Ionicons name="add" size={18} color="#111" />
            </TouchableOpacity>
          </View>

          {/* DELETE */}
          <TouchableOpacity onPress={() => removeFromCart(item.id)}>
            <Ionicons name="trash-outline" size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 14,
    backgroundColor: "#f3f4f6",
  },
  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },
  price: {
    fontSize: 18,
    fontWeight: "800",
    color: "#22c55e",
    marginTop: 6,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  qtyWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  qtyBtn: {
    padding: 4,
  },
  qtyText: {
    fontSize: 15,
    fontWeight: "800",
    marginHorizontal: 12,
    color: "#111",
  },
});
