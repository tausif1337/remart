import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from './store';
import app from './utils/firebaseConfig';
import { auth } from './utils/firebaseServices';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser, setLoading } from './store/authSlice';
import { hydrateCart, loadCartFromStorage } from './store/cartSlice';
import { hydrateWishlist, loadWishlistFromStorage } from './store/wishlistSlice';
import { View, ActivityIndicator } from 'react-native';
import SplashScreenComponent from './components/SplashScreenComponent';

const AuthObserver: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);
  const isCartHydrated = useSelector((state: RootState) => state.cart.isHydrated);
  const isWishlistHydrated = useSelector((state: RootState) => state.wishlist.isHydrated);

  // Hydrate cart and wishlist from AsyncStorage on app start
  useEffect(() => {
    const hydrateStoreData = async () => {
      console.log('[DEBUG] Starting store hydration...');
      try {
        const [cartData, wishlistData] = await Promise.all([
          loadCartFromStorage(),
          loadWishlistFromStorage(),
        ]);
        
        dispatch(hydrateCart(cartData));
        dispatch(hydrateWishlist(wishlistData));
        console.log('[DEBUG] Store hydration complete');
      } catch (error) {
        console.error('[ERROR] Failed to hydrate store:', error);
      }
    };

    hydrateStoreData();
  }, [dispatch]);

  // Listen to Firebase auth state changes
  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser({
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
        }));
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (isLoading || !isCartHydrated || !isWishlistHydrated) {
    return <SplashScreenComponent />;
  }

  return <>{children}</>;
};

const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthObserver>{children}</AuthObserver>
    </Provider>
  );
};

export default AppWrapper;