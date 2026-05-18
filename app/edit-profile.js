import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

// InputField Component
const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  errorKey,
  errors,
}) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View
      style={[styles.inputWrap, errors?.[errorKey] ? styles.inputError : null]}
    >
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        keyboardType={keyboardType || "default"}
      />
    </View>
    {errors?.[errorKey] ? (
      <Text style={styles.errMsg}>{errors[errorKey]}</Text>
    ) : null}
  </View>
);

export default function EditProfileScreen() {
  const router = useRouter();
  const { userProfile, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(userProfile?.fullName || "");
  const [phone, setPhone] = useState(userProfile?.phone || "");
  const [streetAddress, setStreetAddress] = useState(
    userProfile?.streetAddress || "",
  );
  const [city, setCity] = useState(userProfile?.city || "");
  const [postalCode, setPostalCode] = useState(userProfile?.postalCode || "");
  const [country, setCountry] = useState(userProfile?.country || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (updateProfile) {
        await updateProfile({
          fullName: fullName.trim(),
          phone,
          streetAddress,
          city,
          postalCode,
          country,
        });
      }
      // 🟢 FIXED: Alert message yahan se remove kar diya gaya hai
      router.back();
    } catch (err) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <Text style={styles.avatarHint}>{userProfile?.email || ""}</Text>
          </View>

          {/* Personal Info */}
          <Text style={styles.sectionLabel}>Personal Info</Text>
          <View style={styles.card}>
            <InputField
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
              errorKey="fullName"
              errors={errors}
            />
            <InputField
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 234 567 8900"
              keyboardType="phone-pad"
              errors={errors}
            />
          </View>

          {/* Delivery Address */}
          <Text style={styles.sectionLabel}>Delivery Address</Text>
          <View style={styles.card}>
            <InputField
              label="Street Address"
              value={streetAddress}
              onChangeText={setStreetAddress}
              placeholder="123 Main Street"
              errors={errors}
            />

            <View style={styles.rowFields}>
              <View style={styles.flexField}>
                <InputField
                  label="City"
                  value={city}
                  onChangeText={setCity}
                  placeholder="New York"
                  errors={errors}
                />
              </View>
              <View style={styles.flexField}>
                <InputField
                  label="Postal Code"
                  value={postalCode}
                  onChangeText={setPostalCode}
                  placeholder="10001"
                  keyboardType="numeric"
                  errors={errors}
                />
              </View>
            </View>

            <InputField
              label="Country"
              value={country}
              onChangeText={setCountry}
              placeholder="United States"
              errors={errors}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
          >
            <View style={styles.btnContent}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </>
              )}
            </View>
          </TouchableOpacity>
          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "#111" },
  content: { padding: 20 },
  avatarSection: { alignItems: "center", marginBottom: 24 },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: { fontSize: 28, fontWeight: "800", color: "#fff" },
  avatarHint: { fontSize: 13, color: "#9ca3af" },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#9ca3af",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 6,
  },
  inputWrap: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    paddingHorizontal: 14,
    height: 48,
  },
  inputError: { borderColor: "#ef4444" },
  input: { flex: 1, fontSize: 14, color: "#111", height: "100%" },
  errMsg: { color: "#ef4444", fontSize: 11, marginTop: 4 },
  rowFields: { flexDirection: "row", gap: 12 },
  flexField: { flex: 1 },
  saveBtn: {
    backgroundColor: "#22c55e",
    borderRadius: 14,
    height: 54,
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 4,
  },
  btnContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
