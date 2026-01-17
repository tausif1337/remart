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
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../utils/firebaseServices";
import Toast from "react-native-toast-message";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Toast.show({
        type: "error",
        text1: "Required Fields",
        text2: "Please fill in all fields",
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: fullName,
      });

      dispatch(
        setUser({
          id: user.uid,
          email: user.email || "",
          displayName: fullName,
        })
      );

      Toast.show({
        type: "success",
        text1: "Registration Successful",
        text2: `Welcome to Remart, ${fullName}!`,
      });

      navigation.goBack();
    } catch (error: any) {
      console.error("Registration error:", error);
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: error.message || "An unexpected error occurred",
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

        <Text className="text-4xl font-outfit-black text-slate-900 dark:text-white mb-2">
          Create Account
        </Text>
        <Text className="text-lg font-outfit-regular text-slate-500 dark:text-slate-400 mb-12">
          Join our e-commerce community
        </Text>

        <View className="space-y-4">
          <View className="mb-4">
            <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-2">
              Full Name
            </Text>
            <View className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex-row items-center">
              <Feather name="user" size={20} color="#94A3B8" />
              <TextInput
                className="flex-1 ml-3 text-slate-900 dark:text-white font-outfit-regular"
                placeholder="John Doe"
                placeholderTextColor="#94A3B8"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          <View className="mb-4">
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
              />
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-2">
              Password
            </Text>
            <View className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex-row items-center">
              <Feather name="lock" size={20} color="#94A3B8" />
              <TextInput
                className="flex-1 ml-3 text-slate-900 dark:text-white font-outfit-regular"
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className={`h-16 rounded-2xl items-center justify-center shadow-lg ${
            loading ? "bg-indigo-400" : "bg-indigo-600 shadow-indigo-200"
          }`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-outfit-bold text-lg">Sign Up</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center mt-8">
          <Text className="text-slate-500 font-outfit-regular">
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text className="text-indigo-600 font-outfit-bold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
