import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import authReducer from "./authSlice";
import { saveCartToStorage } from "./cartSlice";
import { saveWishlistToStorage } from "./wishlistSlice";

// Middleware to persist cart and wishlist to AsyncStorage
const persistenceMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  // Save cart to storage after cart actions
  if (
    action.type?.startsWith('cart/') && 
    action.type !== 'cart/hydrateCart'
  ) {
    const state = store.getState();
    saveCartToStorage(state.cart.cart);
  }
  
  // Save wishlist to storage after wishlist actions
  if (
    action.type?.startsWith('wishlist/') && 
    action.type !== 'wishlist/hydrateWishlist'
  ) {
    const state = store.getState();
    saveWishlistToStorage(state.wishlist.items);
  }
  
  return result;
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(persistenceMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;