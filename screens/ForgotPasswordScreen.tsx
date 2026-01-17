import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../utils/firebaseServices";
import Toast from "react-native-toast-message";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    console.log("[DEBUG] Forgot password initiated for email:", email);

    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Email Required",
        text2: "Please enter your email address",
      });
      return;
    }

    if (!validateEmail(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address",
      });
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      console.log("[DEBUG] Password reset email sent successfully to:", email);
      
      setEmailSent(true);
      Toast.show({
        type: "success",
        text1: "Email Sent!",
        text2: "Check your inbox for password reset instructions",
      });
    } catch (error: any) {
      console.error("[ERROR] Password reset failed:", error);
      
      let errorMessage = "An unexpected error occurred";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later";
      }

      Toast.show({
        type: "error",
        text1: "Password Reset Failed",
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full items-center justify-center mb-8 shadow-sm"
        >
          <Feather name="chevron-left" size={24} color="#4F46E5" />
        </TouchableOpacity>

        {!emailSent ? (
          <>
            <View className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full items-center justify-center mb-6 self-start">
              <Feather name="lock" size={40} color="#4F46E5" />
            </View>

            <Text className="text-4xl font-outfit-black text-slate-900 dark:text-white mb-2">
              Forgot Password?
            </Text>
            <Text className="text-lg font-outfit-regular text-slate-500 dark:text-slate-400 mb-12">
              Don't worry! Enter your email address and we'll send you instructions to reset your password.
            </Text>

            <View className="mb-8">
              <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </Text>
              <View className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex-row items-center">
                <Feather name="mail" size={20} color="#94A3B8" />
                <TextInput
                  className="flex-1 ml-3 text-slate-900 dark:text-white font-outfit-regular"
                  placeholder="email@example.com"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!loading}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleResetPassword}
              disabled={loading}
              className={`h-16 rounded-2xl items-center justify-center shadow-lg ${
                loading ? "bg-indigo-400" : "bg-indigo-600 shadow-indigo-200"
              }`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-outfit-bold text-lg">
                  Send Reset Link
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-8">
              <Text className="text-slate-500 font-outfit-regular">
                Remember your password?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-indigo-600 font-outfit-bold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center mb-6 self-center">
              <Feather name="check" size={40} color="#10B981" />
            </View>

            <Text className="text-4xl font-outfit-black text-slate-900 dark:text-white mb-2 text-center">
              Check Your Email
            </Text>
            <Text className="text-lg font-outfit-regular text-slate-500 dark:text-slate-400 mb-12 text-center">
              We've sent password reset instructions to{"\n"}
              <Text className="text-indigo-600 dark:text-indigo-400 font-outfit-bold">
                {email}
              </Text>
            </Text>

            <View className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-8">
              <View className="flex-row items-start">
                <Feather name="info" size={20} color="#3B82F6" className="mt-0.5" />
                <Text className="flex-1 text-blue-700 dark:text-blue-300 text-sm font-outfit-regular ml-3">
                  Didn't receive the email? Check your spam folder or try resending after a few minutes.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              className="h-16 bg-indigo-600 rounded-2xl items-center justify-center mb-4 shadow-lg shadow-indigo-200"
            >
              <Text className="text-white font-outfit-bold text-lg">
                Back to Login
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setEmailSent(false);
                setEmail("");
              }}
              className="h-16 border-2 border-slate-200 dark:border-slate-800 rounded-2xl items-center justify-center"
            >
              <Text className="text-slate-900 dark:text-white font-outfit-bold text-lg">
                Try Different Email
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
