import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Product, Review, CartItem } from "./types";

interface CartState {
  products: Product[];
  reviews: Review[];
  cart: CartItem[];
  isHydrated: boolean;
}

const initialState: CartState = {
  products: [],
  reviews: [],
  cart: [],
  isHydrated: false,
};

// AsyncStorage keys
const CART_STORAGE_KEY = "@remart_cart";

// Save cart to AsyncStorage
export const saveCartToStorage = async (cart: CartItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    console.log("[DEBUG] Cart saved to storage:", cart.length, "items");
  } catch (error) {
    console.error("[ERROR] Failed to save cart to storage:", error);
  }
};

// Load cart from AsyncStorage
export const loadCartFromStorage = async (): Promise<CartItem[]> => {
  try {
    const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
    if (cartData) {
      const parsedCart = JSON.parse(cartData);
      console.log("[DEBUG] Cart loaded from storage:", parsedCart.length, "items");
      return parsedCart;
    }
  } catch (error) {
    console.error("[ERROR] Failed to load cart from storage:", error);
  }
  return [];
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.cart = action.payload;
      state.isHydrated = true;
      console.log("[DEBUG] Cart hydrated with", action.payload.length, "items");
    },
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>
    ) => {
      const { product, quantity } = action.payload;
      const existingItem = state.cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({ ...product, quantity });
      }
      // Save to storage after state update
      saveCartToStorage(state.cart);
      console.log("[DEBUG] Item added to cart, total items:", state.cart.length);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;

      // Defensive: validate productId and ensure it's a proper string
      if (!productId || typeof productId !== "string") {
        console.warn(
          "Invalid productId provided to removeFromCart:",
          productId
        );
        return;
      }

      // Filter out only the item with the matching ID
      state.cart = state.cart.filter((item) => item.id !== productId);
      // Save to storage after state update
      saveCartToStorage(state.cart);
      console.log("[DEBUG] Item removed from cart, remaining items:", state.cart.length);
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find((item) => item.id === productId);

      if (item) {
        item.quantity = quantity;
        // Save to storage after state update
        saveCartToStorage(state.cart);
        console.log("[DEBUG] Cart quantity updated for item:", productId);
      }
    },
    clearCart: (state) => {
      state.cart = [];
      // Save to storage after state update
      saveCartToStorage(state.cart);
      console.log("[DEBUG] Cart cleared");
    },
  },
});

export const { hydrateCart, addToCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;