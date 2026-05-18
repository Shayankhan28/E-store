import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  // 🟢 Profile screen pe order show karne ke liye permanent state
  const [ordersCount, setOrdersCount] = useState(0);

  // Cart mein item add karne ka function
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item,
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Cart se item remove karne ka function
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId),
    );
  };

  // Item ki quantity control karne ka function
  const updateQuantity = (productId, action) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          const currentQty = item.quantity || 1;
          // 🟢 FIXED: Yahan "increase" ki jagah "increment" kar diya aapke code ke mutabiq!
          const newQty =
            action === "increment" ? currentQty + 1 : currentQty - 1;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      }),
    );
  };

  // Cart ko clear karna aur orders count ko barhana jab order confirm ho
  const placeOrder = async () => {
    try {
      // 🟢 Jaise hi order place hoga, order count +1 ho jayega
      setOrdersCount((prevCount) => prevCount + 1);

      // Order hone ke baad cart khali kar dete hain
      setCartItems([]);
    } catch (error) {
      console.error("Error placing order in context:", error);
      throw error;
    }
  };

  // Cart items ka total count nikalne ke liye calculation
  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0,
  );

  // Cart ka subtotal price nikalne ke liye calculation
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        ordersCount, // Profile Screen ke liye export kiya
        setOrdersCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
