import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import WishlistScreen from "../screens/WishlistScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrderConfirmationScreen from "../screens/OrderConfirmationScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import OrderDetailScreen from "../screens/OrderDetailScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import MainTabNavigator from "./MainTabNavigator";
import { RootStackParamList } from "./types";

/**
 * AppNavigator.tsx — The Root-Level Navigator
 *
 * This is the TOP of the navigation tree. It wraps everything in
 * a <NavigationContainer> (required by React Navigation) and sets up
 * a Stack Navigator for all full-screen routes.
 *
 * Architecture Overview:
 * NavigationContainer
 *   └── Stack.Navigator (AppNavigator)
 *         ├── MainTab (contains the bottom tabs)
 *         ├── ProductDetail
 *         ├── Checkout
 *         ├── Login / Register / ForgotPassword
 *         └── OrderHistory / OrderDetail / OrderConfirmation
 *
 * Beginner tip: headerShown: false means we use our own custom headers
 * in each screen instead of the default navigation bar.
 */

// Create a typed stack navigator using our RootStackParamList
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    // NavigationContainer must wrap all navigation — it manages the navigation state
    <NavigationContainer>
      {/* initialRouteName tells the app which screen to open first */}
      <Stack.Navigator initialRouteName="MainTab" screenOptions={{}}>

        {/* The bottom tab bar (Home, Cart, Account) */}
        <Stack.Screen
          name="MainTab"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />

        {/* Full product detail page */}
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ headerShown: false }}
        />

        {/* Wishlist page */}
        <Stack.Screen
          name="Wishlist"
          component={WishlistScreen}
          options={{ headerShown: false }}
        />

        {/* Checkout flow */}
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ headerShown: false }}
        />

        {/* Post-payment success screen */}
        <Stack.Screen
          name="OrderConfirmation"
          component={OrderConfirmationScreen}
          options={{ headerShown: false }}
        />

        {/* Order history list */}
        <Stack.Screen
          name="OrderHistory"
          component={OrderHistoryScreen}
          options={{ headerShown: false }}
        />

        {/* Single order detail + cancel */}
        <Stack.Screen
          name="OrderDetail"
          component={OrderDetailScreen}
          options={{ headerShown: false }}
        />

        {/* Authentication screens */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

