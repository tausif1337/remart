import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";
import authReducer from "./authSlice";
import { saveCartToStorage } from "./cartSlice";
import { saveWishlistToStorage } from "./wishlistSlice";

/**
 * store/index.ts — The Global Redux Store
 *
 * This is where the Redux store is created and configured.
 * It brings together all the slices (auth, cart, wishlist) and adds
 * a custom middleware for persisting data to device storage.
 *
 * Beginner tip:
 * - The 'store' is a single JS object that holds ALL of the app's state.
 * - 'reducer' is a map of slice names → their reducer functions.
 * - 'middleware' is a function that runs between actions and reducers.
 */

/**
 * Custom Persistence Middleware
 *
 * This runs AFTER every Redux action is dispatched. If a cart or wishlist
 * action occurs, it saves the new state to device storage (AsyncStorage),
 * so data survives app restarts.
 *
 * It skips the 'hydrate' actions to avoid an infinite loop
 * (hydrating = loading FROM storage, we don't want to write back on that).
 */
const persistenceMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action); // Let the action pass through to the reducer first

  // Save cart to storage after any cart mutation (except loading/hydration)
  if (
    action.type?.startsWith('cart/') &&
    action.type !== 'cart/hydrateCart'
  ) {
    const state = store.getState();
    saveCartToStorage(state.cart.cart);
  }

  // Save wishlist to storage after any wishlist mutation (except loading/hydration)
  if (
    action.type?.startsWith('wishlist/') &&
    action.type !== 'wishlist/hydrateWishlist'
  ) {
    const state = store.getState();
    saveWishlistToStorage(state.wishlist.items);
  }

  return result;
};

// Configure and export the app-level Redux store
export const store = configureStore({
  reducer: {
    cart: cartReducer,         // handles cart items
    wishlist: wishlistReducer, // handles wishlist items
    auth: authReducer,         // handles auth/user session
  },
  middleware: (getDefaultMiddleware) =>
    // Append our custom middleware AFTER Redux's built-in middleware
    getDefaultMiddleware().concat(persistenceMiddleware),
});

// TypeScript helpers — used to type useSelector and useDispatch throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;