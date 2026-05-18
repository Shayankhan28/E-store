import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function SplashIndex() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const dotOpacity1 = useRef(new Animated.Value(0.3)).current;
  const dotOpacity2 = useRef(new Animated.Value(0.3)).current;
  const dotOpacity3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Dot animation loop
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dotOpacity1, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity2, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(dotOpacity3, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(200),
        Animated.parallel([
          Animated.timing(dotOpacity1, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity2, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity3, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => animateDots());
    };
    animateDots();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (user) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/(auth)/login");
        }
      }, 2200);
      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        ]}
      >
        <View style={styles.iconBg}>
          <Ionicons name="bag-handle" size={42} color="#22c55e" />
        </View>
        <Text style={styles.appName}>E-Store</Text>
        <Text style={styles.tagline}>Your everyday store</Text>
      </Animated.View>

      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, { opacity: dotOpacity1 }]} />
        <Animated.View style={[styles.dot, { opacity: dotOpacity2 }]} />
        <Animated.View style={[styles.dot, { opacity: dotOpacity3 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  iconBg: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111",
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 6,
    letterSpacing: 0.3,
  },
  dotsRow: {
    flexDirection: "row",
    position: "absolute",
    bottom: 80,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#22c55e",
  },
});
