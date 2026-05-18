import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// 🟢 FIXED: Safe Area Context ka wrap add kiya
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const orderId = "#ORD-" + Math.floor(1000 + Math.random() * 9000);

  return (
    // 🟢 Puri screen ko wrap kar diya safe edges ke sath
    <SafeAreaView
      style={styles.safe}
      edges={["top", "bottom", "left", "right"]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>E-Store</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.successIconWrap}>
          <Ionicons name="checkmark-circle" size={80} color="#22c55e" />
        </View>
        <Text style={styles.title}>Order Placed! 🎉</Text>
        <Text style={styles.subtitle}>
          Your order has been placed successfully.
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order ID:</Text>
            <Text style={styles.infoValue}>{orderId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment:</Text>
            <Text style={styles.infoValue}>Cash on Delivery</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <View style={styles.confirmedBadge}>
              <Text style={styles.confirmedText}>Confirmed</Text>
            </View>
          </View>
        </View>

        {userProfile?.streetAddress ? (
          <View style={styles.deliveryCard}>
            <Ionicons
              name="bus-outline"
              size={20}
              color="#22c55e"
              style={{ marginRight: 12 }}
            />
            <View>
              <Text style={styles.deliveryLabel}>DELIVERING TO</Text>
              <Text style={styles.deliveryName}>{userProfile.fullName}</Text>
              <Text style={styles.deliveryAddress}>
                {userProfile.streetAddress}
              </Text>
              <Text style={styles.deliveryAddress}>
                {userProfile.city}, {userProfile.postalCode}
              </Text>
            </View>
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace("/(tabs)/home")}
        >
          <Text style={styles.btnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" }, // Perfect background handling
  header: {
    paddingHorizontal: 40,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#22c55e" },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: "center",
  },
  successIconWrap: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: "800", color: "#111", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 28 },
  infoCard: {
    width: "100%",
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  infoLabel: { fontSize: 13, color: "#6b7280" },
  infoValue: { fontSize: 13, fontWeight: "700", color: "#111" },
  confirmedBadge: {
    backgroundColor: "#dcfce7",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  confirmedText: { color: "#16a34a", fontSize: 12, fontWeight: "700" },
  deliveryCard: {
    width: "100%",
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 32,
  },
  deliveryLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#16a34a",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  deliveryName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    marginBottom: 2,
  },
  deliveryAddress: { fontSize: 13, color: "#6b7280" },
  btn: {
    backgroundColor: "#22c55e",
    borderRadius: 14,
    height: 54,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    width: "100%",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
