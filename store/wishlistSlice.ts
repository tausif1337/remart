import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Product } from "./types.ts";

interface WishlistState {
  items: Product[];
}

const initialState: WishlistState = {
  items: [],
};

// Load wishlist from AsyncStorage if available
const loadWishlist = (): Product[] => {
  try {
    // For now, we'll initialize with empty array, but in a real app we'd load from AsyncStorage
    // This is a limitation of Redux Toolkit - initial state must be synchronous
    return [];
  } catch (e) {
    console.warn("Failed to load wishlist from storage", e);
    return [];
  }
};

// Save wishlist to AsyncStorage
const saveWishlist = async (wishlist: Product[]): Promise<void> => {
  try {
    await AsyncStorage.setItem("wishlist", JSON.stringify(wishlist));
  } catch (e) {
    console.warn("Failed to save wishlist to storage", e);
  }
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: loadWishlist(),
  },
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (!existingItem) {
        state.items.push(product);
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
      state.items = state.items.filter((item) => item.id !== productId);
    },
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        // Remove from wishlist
        state.items = state.items.filter((item) => item.id !== product.id);
      } else {
        // Add to wishlist
        state.items.push(product);
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

// Export action creators with async storage saving
export const addToWishlistAsync = (product: Product) => {
  return async (dispatch: any) => {
    dispatch(addToWishlist(product));
    const wishlist = await loadWishlist();
    const updatedWishlist = [...wishlist, product];
    await saveWishlist(updatedWishlist);
  };
};

export const removeFromWishlistAsync = (productId: string) => {
  return async (dispatch: any) => {
    dispatch(removeFromWishlist(productId));
    const wishlist = await loadWishlist();
    const updatedWishlist = wishlist.filter(
      (item: Product) => item.id !== productId
    );
    await saveWishlist(updatedWishlist);
  };
};

export const toggleWishlistAsync = (product: Product) => {
  return async (dispatch: any) => {
    dispatch(toggleWishlist(product));
    const wishlist = await loadWishlist();
    const existingItem = wishlist.find(
      (item: Product) => item.id === product.id
    );
    let updatedWishlist;
    if (existingItem) {
      // Remove from wishlist
      updatedWishlist = wishlist.filter(
        (item: Product) => item.id !== product.id
      );
    } else {
      // Add to wishlist
      updatedWishlist = [...wishlist, product];
    }
    await saveWishlist(updatedWishlist);
  };
};

export const clearWishlistAsync = () => {
  return async (dispatch: any) => {
    dispatch(clearWishlist());
    await saveWishlist([]);
  };
};

export default wishlistSlice.reducer;