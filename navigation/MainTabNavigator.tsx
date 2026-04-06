import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import ProductListingScreen from "../screens/ProductListingScreen";
import CartScreen from "../screens/CartScreen";
import AccountScreen from "../screens/AccountScreen";
import { MainTabParamList } from "./types";
import { Platform } from "react-native";

/**
 * MainTabNavigator.tsx — Bottom Tab Bar Navigator
 *
 * This navigator controls the 3 persistent tabs visible at the bottom:
 *   Home → ProductListingScreen (browse products)
 *   Cart → CartScreen (view/manage cart)
 *   Account → AccountScreen (auth gatekeeper → ProfileScreen or Login prompt)
 *
 * The tab icons are from the Feather icon set and change color
 * depending on whether the tab is active.
 */

// Create a typed bottom tab navigator using our MainTabParamList
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      // screenOptions is a function that receives { route } so we can
      // customize each tab's icon dynamically
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName: any;

          // Map each tab name to its corresponding Feather icon
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Cart") {
            iconName = "shopping-cart";
          } else if (route.name === "Account") {
            iconName = "user";
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#4F46E5",    // Indigo for selected tab
        tabBarInactiveTintColor: "#94A3B8",  // Gray for unselected tabs
        headerShown: false,                  // We use custom headers in each screen
        tabBarStyle: {
          // Platform.OS lets us check if we're on iOS or Android and apply different values
          paddingBottom: Platform.OS === "ios" ? 25 : 10, // Extra padding on iOS for home indicator
          paddingTop: 10,
          height: Platform.OS === "ios" ? 90 : 70,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F1F5F9",
          elevation: 0,       // Remove Android shadow
          shadowOpacity: 0,   // Remove iOS shadow
        },
        tabBarLabelStyle: {
          fontFamily: "Outfit-Medium",
          fontSize: 12,
        },
      })}
    >
      {/* Home Tab */}
      <Tab.Screen
        name="Home"
        component={ProductListingScreen}
        options={{ title: "Home" }}
      />

      {/* Cart Tab */}
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: "Cart" }}
      />

      {/* Account Tab */}
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{ title: "Account" }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;

