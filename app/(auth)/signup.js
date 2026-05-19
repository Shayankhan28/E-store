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

export default function SignupScreen() {
  const router = useRouter();
  const { register } = useAuth(); // AuthContext se 'register' function nikala jo user ka data database (Firebase wagera) mein save karega

  // States jo input text ko sath-sath store/update karti hain:
  const [fullName, setFullName] = useState(""); // User ka poora naam store karne ke liye
  const [email, setEmail] = useState(""); // User ka email
  const [password, setPassword] = useState(""); // Pehla password input
  const [confirmPassword, setConfirmPassword] = useState(""); // Dobara confirmation ke liye password input

  // Form status ki states:
  const [showPass, setShowPass] = useState(false); // Pehle password ki eye toggle (hide/show)
  const [showConfirm, setShowConfirm] = useState(false); // Confirm password ki eye toggle (hide/show)
  const [loading, setLoading] = useState(false); // Sign up submit hone par loader dikhane ke liye
  const [errors, setErrors] = useState({}); // Inputs ke errors manage karne ke liye object

  //deke monga toll validation formaete add kre ch awb
  const validate = () => {
    const e = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (!confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
    //ka error na e nu byea ba da object khali return sh
  };

  const handleSignup = async () => {
    if (!validate()) return; //k validation fail  sh nu byea makhke process stop sh
    setLoading(true);
    try {
      await register(fullName.trim(), email.trim(), password);
      router.replace("/(tabs)/home");
    } catch (err) {
      //error ba dalta k show sh k sa masla v registration k
      Alert.alert(
        "Sign Up Failed",
        err.message || "Could not create account. Try again.",
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

          <Text style={styles.title}>Create Account ✨</Text>
          <Text style={styles.subtitle}>Join E-Store with your email</Text>

          <View style={styles.form}>
            <View
              style={[styles.inputWrap, errors.fullName && styles.inputError]}
            >
              <Ionicons
                name="person-outline"
                size={18}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#9ca3af"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
            {errors.fullName ? (
              <Text style={styles.errMsg}>{errors.fullName}</Text>
            ) : null}

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

            <View
              style={[
                styles.inputWrap,
                errors.confirmPassword && styles.inputError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#9ca3af"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirm(!showConfirm)}
                style={styles.eyeBtn}
              >
                <Text style={styles.eyeEmoji}>{showConfirm ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
            {errors.confirmPassword ? (
              <Text style={styles.errMsg}>{errors.confirmPassword}</Text>
            ) : null}

            <TouchableOpacity
              style={styles.btn}
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomTxt}>Already have an account? </Text>
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
    height: 200,
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
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoRow: { flexDirection: "row", alignItems: "center", marginBottom: 28 },
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
  title: { fontSize: 26, fontWeight: "800", color: "#111", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 28 },
  form: { gap: 12 },
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
  errMsg: { color: "#ef4444", fontSize: 12, marginTop: -6, marginLeft: 4 },
  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 28 },
  bottomTxt: { color: "#6b7280", fontSize: 14 },
  linkTxt: { color: "#22c55e", fontSize: 14, fontWeight: "700" },
});
