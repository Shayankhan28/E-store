import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert, // Device alerts dikhane ke liye module
  Modal, // Screen ke upar pop-up window show karne ke liye component
  ScrollView, // Content scroll karne ke liye wrapper
  StatusBar, // Device ke top indicator bar ko stylize karne ke liye
  StyleSheet, // Styling rules set karne ke liye
  Text, // Text components render karne ke liye
  TouchableOpacity, // Clickable items par touch feedback dene ke liye
  View, // Layout division container blocks
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Notch aur bottom system bars se layout safe rakhne ke liye
import { useAuth } from "../../context/AuthContext"; // User profile aur logout function fetch karne ke liye context
import { useCart } from "../../context/CartContext"; // Cart analytics aur counters access karne ke liye context

// CUSTOM REUSABLE COMPONENT: Profile menu list ki ek single line/row design karne ke liye
const MenuItem = ({
  icon, // Icon ka naam (string)
  label, // Main menu name
  subtitle, // Menu ki choti detail context text
  color = "#374151", // Default icon color
  onPress, // Click action handler function
  danger, // Log Out jise dangerous action items ke liye red flag
}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7} // Click karne par halka sa fade animation
  >
    {/* Icon background box design (danger hone par soft red, warna soft green) */}
    <View
      style={[
        styles.menuIconWrap,
        { backgroundColor: danger ? "#fef2f2" : "#f0fdf4" },
      ]}
    >
      <Ionicons name={icon} size={20} color={danger ? "#ef4444" : color} />
    </View>
    {/* Text area layout */}
    <View style={{ flex: 1 }}>
      <Text style={[styles.menuLabel, danger && { color: "#ef4444" }]}>
        {label}
      </Text>
      {/* Agar subtitle background se pass kiya gaya hai toh render kare, warna ignore kare */}
      {subtitle ? <Text style={styles.menuSub}>{subtitle}</Text> : null}
    </View>
    {/* Right side arrow pointer sign */}
    <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter(); // Router handler instance
  const { userProfile, logout } = useAuth(); // Global Auth state se profile details aur log-out functionality nikal li

  // 🔴 UseCart context se metrics safely destructure kiye taaki application crash na kare agar values empty hon
  const { cartCount = 0, cartTotal = 0, ordersCount = 0 } = useCart() || {};
  const [logoutModal, setLogoutModal] = useState(false); // Modal control overlay state toggler

  // LOG OUT LOGIC FUNCTION
  const handleLogout = async () => {
    setLogoutModal(false); // Pop-up confirmation dialog box off kiya
    await logout(); // Context logic se device session aur authentication tokens flush kiye
    router.replace("/(auth)/login"); // User ko securely login route par throw kar diya (Back-button restriction ke sath)
  };

  const initials = userProfile?.fullName
    ? userProfile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  const DELIVERY_CHARGES = cartCount > 0 ? 15 : 0;
  const totalCartValueWithDelivery = cartTotal + DELIVERY_CHARGES;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      // 🟢 FIXED: Header text ke sath matching logo dynamically add kar diya
      bina alignment chhede */
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.iconBg}>
            <Ionicons name="bag-handle" size={20} color="#22c55e" />
          </View>
          <Text style={styles.headerTitle}>E-Store</Text>
        </View>
      </View>
      {/* SCROLLABLE VIEW: Is container ke andar user list profile explore kar sakta hai */}
      <ScrollView
        showsVerticalScrollIndicator={false} // Side par aane wali vertical scrollbar line ko chupaya hai
        contentContainerStyle={{ paddingBottom: 40 }} // Bottom par extra space di hai taake tabs ke peeche content na dhabe
      >
        {/* ====================  PROFILE DISPLAY SECTION ==================== */}
        <View style={styles.avatarSection}>
          {/* Circular Box: Isme user ke naam ke initials (e.g., 'AZ') show honge */}
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          {/* User Name: Agar profile load nahi hui toh fallback text "User" dikhega */}
          <Text style={styles.userName}>{userProfile?.fullName || "User"}</Text>
          {/* User Email: Dynamic email load, blank string agar data na ho */}
          <Text style={styles.userEmail}>{userProfile?.email || ""}</Text>

          {/* CONDITIONAL RENDER: Agar data payload mein 'city' majood hai, sirf tabhi location row screen par dikhegi */}
          {userProfile?.city && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color="#9ca3af" />
              <Text style={styles.locationText}>
                {userProfile.city}, {userProfile.country || ""}
              </Text>
            </View>
          )}
        </View>

        {/* ==================== METRICS STATS DASHBOARD BAR ==================== */}
        <View style={styles.statsRow}>
          {/* Stat Block 1: Cart mein kitne items hain uska total counter */}
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{cartCount}</Text>
            <Text style={styles.statLabel}>In Cart</Text>
          </View>
          <View style={styles.statDivider} />{" "}
          {/* Beech ki vertical partition line */}
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>
              ${totalCartValueWithDelivery.toFixed(0)}
            </Text>
            <Text style={styles.statLabel}>Cart Value</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            {/* 🔴 FIXED: Ab yahan user ke total orders permanently increment ho kar dikhenge */}
            <Text style={styles.statNumber}>{ordersCount}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>

        {/* Account section */}
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon="person-outline"
            label="Edit Profile"
            subtitle="Update name, email & address"
            onPress={() => router.push("/edit-profile")}
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="lock-closed-outline"
            label="Change Password"
            subtitle="Update your password"
            onPress={() => router.push("/(auth)/forgot-password")}
          />
        </View>

        {/* Shopping section */}
        <Text style={styles.sectionLabel}>Shopping</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon="cart-outline"
            label="My Cart"
            subtitle={`${cartCount} items · $${totalCartValueWithDelivery.toFixed(2)}`}
            onPress={() => router.push("/(tabs)/cart")}
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="heart-outline"
            label="Wishlist"
            subtitle="Items you love"
            onPress={() => Alert.alert("Wishlist", "Coming soon!")}
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="receipt-outline"
            label="Order History"
            subtitle="View past orders"
            onPress={() => Alert.alert("Orders", "Coming soon!")}
          />
        </View>

        {/* Support section */}
        <Text style={styles.sectionLabel}>Support</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon="help-circle-outline"
            label="Help Center"
            subtitle="FAQs & support"
            onPress={() => Alert.alert("Help", "Coming soon!")}
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="star-outline"
            label="Rate the App"
            subtitle="Tell us what you think"
            onPress={() => Alert.alert("Rate", "Thanks for your support!")}
          />
        </View>

        {/* Logout */}
        <View style={[styles.menuCard, { marginTop: 4 }]}>
          <MenuItem
            icon="log-out-outline"
            label="Log Out"
            danger
            onPress={() => setLogoutModal(true)}
          />
        </View>
      </ScrollView>
      {/* Logout Modal */}
      <Modal visible={logoutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="warning" size={32} color="#f59e0b" />
            </View>
            <Text style={styles.modalTitle}>Log Out?</Text>
            <Text style={styles.modalSub}>
              Are you sure you want to log out of your account?
            </Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setLogoutModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.logoutBtnText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  // 🟢 ADDED: Logo background icon styling bina alignment kharab kiye
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
  avatarSection: {
    alignItems: "center",
    paddingVertical: 28,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: { fontSize: 28, fontWeight: "800", color: "#fff" },
  userName: { fontSize: 20, fontWeight: "800", color: "#111", marginBottom: 4 },
  userEmail: { fontSize: 13, color: "#6b7280" },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  locationText: { fontSize: 12, color: "#9ca3af" },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statBox: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 20, fontWeight: "800", color: "#22c55e" },
  statLabel: { fontSize: 12, color: "#9ca3af", marginTop: 3 },
  statDivider: { width: 1, backgroundColor: "#f3f4f6" },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9ca3af",
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 8,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  menuCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  menuIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: { fontSize: 14, fontWeight: "600", color: "#374151" },
  menuSub: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  menuDivider: { height: 1, backgroundColor: "#f9fafb", marginLeft: 66 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    marginHorizontal: 32,
    alignItems: "center",
    width: "80%",
  },
  modalIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fffbeb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  modalBtns: { flexDirection: "row", gap: 12, width: "100%" },
  cancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: { fontWeight: "600", color: "#374151", fontSize: 14 },
  logoutBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutBtnText: { fontWeight: "700", color: "#fff", fontSize: 14 },
});
