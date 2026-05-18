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

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/(tabs)/home");
    } catch (err) {
      let msg = "Login failed. Please try again.";
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        msg = "Invalid email or password.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many attempts. Please try again later.";
      }
      Alert.alert("Login Failed", msg);
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
        <View style={styles.headerDecor}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
        </View>

        <View style={styles.content}>
          <View style={styles.logoRow}>
            <View style={styles.iconBg}>
              <Ionicons name="bag-handle" size={28} color="#22c55e" />
            </View>
            <Text style={styles.brand}>E-Store</Text>
          </View>

          <Text style={styles.title}>Welcome Back 👋</Text>
          <Text style={styles.subtitle}>Log in with your email</Text>

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

            <View
              style={[styles.inputWrap, errors.password && styles.inputError]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPass(!showPass)}
                style={styles.eyeBtn}
              >
                <Text style={styles.eyeEmoji}>{showPass ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={styles.errMsg}>{errors.password}</Text>
            ) : null}

            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
              style={styles.forgotWrap}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btn}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Log In</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomTxt}>New here? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text style={styles.linkTxt}>Sign Up</Text>
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
  logoRow: { flexDirection: "row", alignItems: "center", marginBottom: 36 },
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
  title: { fontSize: 28, fontWeight: "800", color: "#111", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 32 },
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
  eyeBtn: { padding: 4 },
  eyeEmoji: { fontSize: 18 },
  forgotWrap: { alignSelf: "flex-end", marginTop: -4 },
  forgotText: { color: "#22c55e", fontSize: 13, fontWeight: "600" },
  btn: {
    backgroundColor: "#22c55e",
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
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
