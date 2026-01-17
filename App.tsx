import "./global.css";
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_700Bold,
  Outfit_900Black,
} from "@expo-google-fonts/outfit";
import Toast from "react-native-toast-message";
import AppNavigator from "./navigation/AppNavigator";
import AppWrapper from "./AppWrapper";
import SplashScreenComponent from "./components/SplashScreenComponent";

const toastConfig = {
  success: ({ text1, text2, ...rest }: any) => (
    <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-lg w-11/12 max-w-sm mx-auto">
      <View className="flex-row items-center">
        <View className="w-3 h-3 bg-indigo-600 rounded-full mr-3" />
        <View className="flex-1">
          <Text className="text-base font-outfit-bold text-slate-900 dark:text-white">
            {text1 || "Success"}
          </Text>
          <Text className="text-sm font-outfit-regular text-slate-600 dark:text-slate-300 mt-1">
            {text2}
          </Text>
        </View>
      </View>
    </View>
  ),
  error: ({ text1, text2, ...rest }: any) => (
    <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-lg w-11/12 max-w-sm mx-auto">
      <View className="flex-row items-center">
        <View className="w-3 h-3 bg-red-500 rounded-full mr-3" />
        <View className="flex-1">
          <Text className="text-base font-outfit-bold text-slate-900 dark:text-white">
            {text1 || "Error"}
          </Text>
          <Text className="text-sm font-outfit-regular text-slate-600 dark:text-slate-300 mt-1">
            {text2}
          </Text>
        </View>
      </View>
    </View>
  ),
  info: ({ text1, text2, ...rest }: any) => (
    <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-lg w-11/12 max-w-sm mx-auto">
      <View className="flex-row items-center">
        <View className="w-3 h-3 bg-blue-500 rounded-full mr-3" />
        <View className="flex-1">
          <Text className="text-base font-outfit-bold text-slate-900 dark:text-white">
            {text1 || "Info"}
          </Text>
          <Text className="text-sm font-outfit-regular text-slate-600 dark:text-slate-300 mt-1">
            {text2}
          </Text>
        </View>
      </View>
    </View>
  ),
};

export default function App() {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [fontsLoaded] = useFonts({
    "Outfit-Regular": Outfit_400Regular,
    "Outfit-Medium": Outfit_500Medium,
    "Outfit-Bold": Outfit_700Bold,
    "Outfit-Black": Outfit_900Black,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2000); // 2 seconds minimum
    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded || !minTimeElapsed) {
    return <SplashScreenComponent />;
  }

  return (
    <AppWrapper>
      <SafeAreaProvider>
        <AppNavigator />
        <Toast
          config={toastConfig}
          position="top"
          topOffset={200}
          visibilityTime={3000}
        />
      </SafeAreaProvider>
    </AppWrapper>
  );
}
