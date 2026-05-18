import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PasswordSuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <View style={styles.iconBg}>
          <Ionicons name="bag-handle" size={28} color="#22c55e" />
        </View>
        <Text style={styles.brand}>E-Store</Text>
      </View>
      <View style={styles.center}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark-circle" size={64} color="#22c55e" />
        </View>
        <Text style={styles.title}>Password Updated!</Text>
        <Text style={styles.subtitle}>
          Your password has been changed successfully. Please log in again.
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.btnText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 28,
    paddingTop: 60,
  },
  logoRow: { flexDirection: "row", alignItems: "center", marginBottom: 60 },
  iconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  brand: { fontSize: 20, fontWeight: "800", color: "#22c55e" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 60,
  },
  successCircle: { marginBottom: 24 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
  btn: {
    backgroundColor: "#166534",
    borderRadius: 14,
    height: 54,
    paddingHorizontal: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#166534",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
