import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * store/authSlice.ts — Authentication State Management
 *
 * This Redux slice manages the logged-in user's state globally.
 * Any component can read from this slice using useSelector()
 * and update it via dispatch(setUser(...)) or dispatch(logout()).
 *
 * Beginner tip: A "slice" in Redux Toolkit is a mini-store for a specific
 * feature. It combines the state shape, initial values, and reducer functions
 * all in one place.
 */

/** Shape of a user object stored in the auth state */
interface User {
  id: string;           // Firebase UID (unique for every user)
  email: string;
  displayName?: string; // Optional: the user's display name
}

/** Overall shape of the auth portion of the Redux store */
interface AuthState {
  user: User | null;    // null = not logged in
  isAuthenticated: boolean;
  isLoading: boolean;   // true while the app checks if the user is still logged in on startup
}

// Default state when the app first launches
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start as 'loading' so we can check AsyncStorage/Firebase before showing UI
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * setUser: Called after a successful login or registration.
     * !! (double exclamation) converts the user object to a boolean for isAuthenticated.
     */
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },

    /** setLoading: Used during Firebase's auth state check on app startup */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /** logout: Clears the user and marks as unauthenticated */
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Export actions for use in components via dispatch()
export const { setUser, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;

