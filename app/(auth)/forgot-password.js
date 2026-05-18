import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      Alert.alert(
        "Email Sent ✉️",
        "A password reset link has been sent to your email. Please check your inbox.",
        [{ text: "OK", onPress: () => router.push("/(auth)/login") }],
      );
    } catch (err) {
      Alert.alert(
        "Error",
        err.message || "Failed to send reset email. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Background Decor Circles */}
        <View style={styles.headerDecor}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
        </View>

        <View style={styles.content}>
          {/* 🟢 FIXED: Logo aur Text ab left side par align hain (just like login screen) */}
          <View style={styles.logoRow}>
            <View style={styles.iconBg}>
              <Ionicons name="bag-handle" size={28} color="#22c55e" />
            </View>
            <Text style={styles.brand}>E-Store</Text>
          </View>

          <View style={styles.illustrationWrap}>
            <View style={styles.illustrationBg}>
              <Ionicons name="lock-closed" size={40} color="#22c55e" />
            </View>
          </View>

          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email. We will send a password reset link.
          </Text>

          <View style={styles.form}>
            <View style={[styles.inputWrap, errors.email && styles.inputError]}>
              <Ionicons
                name="mail-outline"
                size={18}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            {errors.email ? (
              <Text style={styles.errMsg}>{errors.email}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.btn}
              onPress={handleSend}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomTxt}>Remember password? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.linkTxt}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fff" },
  headerDecor: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    overflow: "hidden",
  },
  circle1: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#dcfce7",
  },
  circle2: {
    position: "absolute",
    top: -40,
    right: 60,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#f0fdf4",
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 90,
    paddingBottom: 40,
  },
  // 🟢 FIXED: Removed justifyContent center to align left side
  logoRow: { flexDirection: "row", alignItems: "center", marginBottom: 40 },
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
  illustrationWrap: { alignItems: "center", marginBottom: 28 },
  illustrationBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 22,
  },
  form: { gap: 14 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputError: { borderColor: "#ef4444" },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#111" },
  btn: {
    backgroundColor: "#22c55e",
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  errMsg: { color: "#ef4444", fontSize: 12, marginTop: -8, marginLeft: 4 },
  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 32 },
  bottomTxt: { color: "#6b7280", fontSize: 14 },
  linkTxt: { color: "#22c55e", fontSize: 14, fontWeight: "700" },
});
