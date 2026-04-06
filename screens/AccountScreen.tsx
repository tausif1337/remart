import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import ProfileScreen from "./ProfileScreen";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

/**
 * AccountScreen acts as a gatekeeper.
 * If the user is logged in, it displays their Profile.
 * If not, it shows a prompt to Login or Register.
 */
const AccountScreen = () => {
  // Accessing the authentication state from Redux store
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const navigation = useNavigation<any>();

  // If user is already logged in, show the ProfileScreen component instead
  if (isAuthenticated) {
    return <ProfileScreen />;
  }

  // If not authenticated, show the guest/login screen
  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-1 items-center justify-center px-8">
        {/* Placeholder Icon */}
        <View className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full items-center justify-center mb-8">
          <Feather name="user" size={48} color="#4F46E5" />
        </View>

        <Text className="text-3xl font-outfit-black text-slate-900 dark:text-white text-center mb-4">
          Account
        </Text>

        <Text className="text-lg font-outfit-regular text-slate-500 dark:text-slate-400 text-center mb-12">
          Sign in to track orders, manage your profile and more.
        </Text>

        {/* Navigation to Login Screen */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="bg-indigo-600 w-full h-16 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-indigo-200"
        >
          <Text className="text-white font-outfit-bold text-lg">Login</Text>
        </TouchableOpacity>

        {/* Navigation to Register Screen */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full h-16 rounded-2xl items-center justify-center"
        >
          <Text className="text-slate-900 dark:text-white font-outfit-bold text-lg">
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AccountScreen;
