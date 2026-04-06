import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Product, Review, CartItem } from "./types";

/**
 * store/cartSlice.ts — Shopping Cart State Management
 *
 * This slice manages what products the user has added to their cart.
 * Unlike a simple useState, Redux allows any screen to read/update cart data.
 *
 * Key features:
 * - Persistent cart via AsyncStorage (survives app restarts)
 * - Quantity merging (adding same product increases qty instead of duplicating)
 * - Safe removal with type validation
 */

/** Shape of the cart state stored in Redux */
interface CartState {
  products: Product[];  // All products (not directly used, kept for potential future use)
  reviews: Review[];    // Product reviews (stored here for caching)
  cart: CartItem[];     // The user's actual cart items
  isHydrated: boolean;  // true once cart is loaded from AsyncStorage on startup
}

const initialState: CartState = {
  products: [],
  reviews: [],
  cart: [],
  isHydrated: false,
};

// AsyncStorage key — the string key used to save/load cart data on the device
const CART_STORAGE_KEY = "@remart_cart";

/**
 * Saves the current cart to the device's local storage.
 * JSON.parse(JSON.stringify(...)) is used to strip Redux Proxy wrappers
 * before serialization (avoids unexpected errors).
 */
export const saveCartToStorage = async (cart: CartItem[]): Promise<void> => {
  try {
    // Serialize cart items to plain objects to avoid Proxy issues
    const serializedCart = JSON.parse(JSON.stringify(cart));
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serializedCart));
    console.log("[DEBUG] Cart saved to storage:", serializedCart.length, "items");
  } catch (error) {
    console.error("[ERROR] Failed to save cart to storage:", error);
  }
};

/**
 * Loads the saved cart from device storage on app startup.
 * Returns an empty array if no data is found.
 */
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
  return []; // Return an empty cart if there's no saved data
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * hydrateCart: Restores cart from AsyncStorage on app startup.
     * Called once in App.tsx after loading from storage.
     */
    hydrateCart: (state, action: PayloadAction<CartItem[]>) => {
      state.cart = action.payload;
      state.isHydrated = true;
      console.log("[DEBUG] Cart hydrated with", action.payload.length, "items");
    },

    /**
     * addToCart: Adds a product with a given quantity.
     * If the same product already exists, its quantity is increased instead
     * of adding a duplicate entry.
     */
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>
    ) => {
      const { product, quantity } = action.payload;
      const existingItem = state.cart.find((item) => item.id === product.id);

      if (existingItem) {
        // Product already in cart — just increase quantity
        existingItem.quantity += quantity;
      } else {
        // New product — add it to the cart array
        state.cart.push({ ...product, quantity });
      }
      console.log("[DEBUG] Item added to cart, total items:", state.cart.length);
    },

    /** removeFromCart: Removes a specific product entirely from the cart by its ID */
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;

      // Safety check: ensure we have a valid string ID before filtering
      if (!productId || typeof productId !== "string") {
        console.warn(
          "Invalid productId provided to removeFromCart:",
          productId
        );
        return;
      }

      // Filter out only the item with the matching ID
      state.cart = state.cart.filter((item) => item.id !== productId);
      console.log("[DEBUG] Item removed from cart, remaining items:", state.cart.length);
    },

    /** updateCartQuantity: Changes the quantity of a specific cart item */
    updateCartQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find((item) => item.id === productId);

      if (item) {
        item.quantity = quantity;
        console.log("[DEBUG] Cart quantity updated for item:", productId);
      }
    },

    /** clearCart: Wipes the entire cart — called after an order is successfully placed */
    clearCart: (state) => {
      state.cart = [];
      console.log("[DEBUG] Cart cleared");
    },
  },
});

// Export all actions for use with dispatch() in screens and components
export const { hydrateCart, addToCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;