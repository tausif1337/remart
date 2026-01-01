import "./global.css";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ProductListingScreen from "./screens/ProductListingScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <ProductListingScreen />
    </SafeAreaProvider>
  );
}
