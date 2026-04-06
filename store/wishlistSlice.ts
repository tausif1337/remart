import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Product } from "./types.ts";

/**
 * store/wishlistSlice.ts — Wishlist State Management
 *
 * This slice manages the user's saved/favorited products.
 * It follows the same persistence pattern as cartSlice —
 * changes are saved to AsyncStorage automatically via middleware.
 *
 * Key features:
 * - toggle: Add if not in list, remove if already there
 * - Persistent across app restarts via AsyncStorage
 */

/** Shape of the wishlist state in Redux */
interface WishlistState {
  items: Product[];   // All wishlisted products
  isHydrated: boolean; // true once loaded from AsyncStorage on startup
}

const initialState: WishlistState = {
  items: [],
  isHydrated: false,
};

// The AsyncStorage key used to read/write wishlist data on the device
const WISHLIST_STORAGE_KEY = "@remart_wishlist";

/**
 * Saves the wishlist to device storage.
 * Serializes the data to avoid Redux Proxy issues.
 */
export const saveWishlistToStorage = async (wishlist: Product[]): Promise<void> => {
  try {
    // Serialize wishlist items to plain objects to avoid Proxy issues
    const serializedWishlist = JSON.parse(JSON.stringify(wishlist));
    await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(serializedWishlist));
    console.log("[DEBUG] Wishlist saved to storage:", serializedWishlist.length, "items");
  } catch (error) {
    console.error("[ERROR] Failed to save wishlist to storage:", error);
  }
};

/**
 * Loads the saved wishlist from device storage on app startup.
 * Returns an empty array if no data is found.
 */
export const loadWishlistFromStorage = async (): Promise<Product[]> => {
  try {
    const wishlistData = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
    if (wishlistData) {
      const parsedWishlist = JSON.parse(wishlistData);
      console.log("[DEBUG] Wishlist loaded from storage:", parsedWishlist.length, "items");
      return parsedWishlist;
    }
  } catch (error) {
    console.error("[ERROR] Failed to load wishlist from storage:", error);
  }
  return [];
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    /**
     * hydrateWishlist: Restores wishlist from AsyncStorage on app startup.
     */
    hydrateWishlist: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.isHydrated = true;
      console.log("[DEBUG] Wishlist hydrated with", action.payload.length, "items");
    },

    /**
     * addToWishlist: Adds a product if it's NOT already in the wishlist.
     * Prevents duplicate entries.
     */
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find((item: Product) => item.id === product.id);

      if (!existingItem) {
        state.items.push(product);
        console.log("[DEBUG] Item added to wishlist, total items:", state.items.length);
      }
      // If it already exists, do nothing (no duplicates!)
    },

    /** removeFromWishlist: Removes a product from the wishlist by its ID */
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload;

      // Safety check before filtering
      if (!productId || typeof productId !== "string") {
        console.warn(
          "Invalid productId provided to removeFromWishlist:",
          productId
        );
        return;
      }

      // Filter out only the item with the matching ID
      state.items = state.items.filter((item: Product) => item.id !== productId);
      console.log("[DEBUG] Item removed from wishlist, remaining items:", state.items.length);
    },

    /**
     * toggleWishlist: The main heart-icon action.
     * If the product IS in the wishlist → remove it.
     * If it's NOT → add it.
     */
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find((item: Product) => item.id === product.id);

      if (existingItem) {
        // Remove from wishlist
        state.items = state.items.filter((item: Product) => item.id !== product.id);
      } else {
        // Add to wishlist
        state.items.push(product);
      }
      console.log("[DEBUG] Wishlist toggled, total items:", state.items.length);
    },

    /** clearWishlist: Empties the entire wishlist */
    clearWishlist: (state) => {
      state.items = [];
      console.log("[DEBUG] Wishlist cleared");
    },
  },
});

// Export all actions for use with dispatch() in screens and components
export const {
  hydrateWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;