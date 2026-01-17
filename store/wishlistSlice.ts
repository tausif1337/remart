import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Product } from "./types.ts";

interface WishlistState {
  items: Product[];
  isHydrated: boolean;
}

const initialState: WishlistState = {
  items: [],
  isHydrated: false,
};

// AsyncStorage key
const WISHLIST_STORAGE_KEY = "@remart_wishlist";

// Save wishlist to AsyncStorage
export const saveWishlistToStorage = async (wishlist: Product[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    console.log("[DEBUG] Wishlist saved to storage:", wishlist.length, "items");
  } catch (error) {
    console.error("[ERROR] Failed to save wishlist to storage:", error);
  }
};

// Load wishlist from AsyncStorage
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
    hydrateWishlist: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload;
      state.isHydrated = true;
      console.log("[DEBUG] Wishlist hydrated with", action.payload.length, "items");
    },
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find((item: Product) => item.id === product.id);

      if (!existingItem) {
        state.items.push(product);
        saveWishlistToStorage(state.items);
        console.log("[DEBUG] Item added to wishlist, total items:", state.items.length);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      const productId = action.payload;

      // Defensive: validate productId and ensure it's a proper string
      if (!productId || typeof productId !== "string") {
        console.warn(
          "Invalid productId provided to removeFromWishlist:",
          productId
        );
        return;
      }

      // Filter out only the item with the matching ID
      state.items = state.items.filter((item: Product) => item.id !== productId);
      saveWishlistToStorage(state.items);
      console.log("[DEBUG] Item removed from wishlist, remaining items:", state.items.length);
    },
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
      saveWishlistToStorage(state.items);
      console.log("[DEBUG] Wishlist toggled, total items:", state.items.length);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
      console.log("[DEBUG] Wishlist cleared");
    },
  },
});

export const {
  hydrateWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;