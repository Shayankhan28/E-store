import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export default function ProductCard({ product, onPress, onAddToCart }) {
  const { title, price, image, rating } = product;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.wishBtn} onPress={() => {}}>
          <Ionicons name="heart-outline" size={18} color="#9ca3af" />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {rating && (
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={11} color="#f59e0b" />
            <Text style={styles.ratingText}>
              {rating.rate} ({rating.count})
            </Text>
          </View>
        )}
        <View style={styles.priceRow}>
          <Text style={styles.price}>${price.toFixed(2)}</Text>
          <TouchableOpacity style={styles.addBtn} onPress={onAddToCart}>
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  imageWrap: {
    backgroundColor: "#f9fafb",
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  image: { width: "80%", height: "80%" },
  wishBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  info: { padding: 12 },
  title: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
    lineHeight: 17,
    marginBottom: 6,
    minHeight: 34,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 8,
  },
  ratingText: { fontSize: 11, color: "#9ca3af" },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: { fontSize: 15, fontWeight: "800", color: "#22c55e" },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
  },
});
