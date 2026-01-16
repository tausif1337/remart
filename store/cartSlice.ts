import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product, Review, CartItem } from "./types";

interface CartState {
  products: Product[];
  reviews: Review[];
  cart: CartItem[];
}

const initialState: CartState = {
  products: [],
  reviews: [],
  cart: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
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
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find((item) => item.id === productId);

      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
