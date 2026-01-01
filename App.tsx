import "./global.css";
import React from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { 
  useFonts, 
  Outfit_400Regular, 
  Outfit_500Medium, 
  Outfit_700Bold, 
  Outfit_900Black 
} from "@expo-google-fonts/outfit";
import ProductListingScreen from "./screens/ProductListingScreen";

export default function App() {
  const [fontsLoaded] = useFonts({
    "Outfit-Regular": Outfit_400Regular,
    "Outfit-Medium": Outfit_500Medium,
    "Outfit-Bold": Outfit_700Bold,
    "Outfit-Black": Outfit_900Black,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 dark:bg-slate-950">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ProductListingScreen />
    </SafeAreaProvider>
  );
}
