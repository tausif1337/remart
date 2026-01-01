import "../global.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";

export default function LandingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center p-6 gap-8">
          
          {/* Hero Card Section */}
          <View className="w-full h-80 bg-indigo-600 rounded-[32px] items-center justify-center relative overflow-hidden shadow-2xl shadow-indigo-500/30">
             {/* Decorative Background Elements */}
             <View className="absolute top-[-20%] left-[-20%] w-60 h-60 bg-white/10 rounded-full blur-3xl" />
             <View className="absolute bottom-[-10%] right-[-10%] w-60 h-60 bg-purple-500/30 rounded-full blur-3xl" />
             
             {/* Logo/Brand */}
             <View className="items-center z-10">
               <View className="bg-white/10 p-4 rounded-3xl backdrop-blur-md mb-4 border border-white/20 shadow-inner">
                  <Text className="text-4xl">🛍️</Text>
               </View>
               <Text className="text-5xl font-black text-white tracking-tighter">
                 Re<Text className="text-indigo-200">Mart</Text>
               </Text>
               <Text className="text-indigo-100 text-sm mt-2 font-medium tracking-[0.2em] uppercase">
                 Future of Shopping
               </Text>
             </View>
          </View>

          {/* Text Content */}
          <View className="gap-3 px-2">
            <Text className="text-3xl font-bold text-slate-900 dark:text-white text-center">
              Discover & Shop
            </Text>
            <Text className="text-base text-slate-500 dark:text-slate-400 text-center leading-relaxed px-4">
               Explore the best products from around the world at unbeatable prices. Fast shipping, secure payment.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-4 pt-6 w-full max-w-sm mx-auto">
            <TouchableOpacity className="w-full bg-indigo-600 py-4.5 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none active:bg-indigo-700">
              <Text className="text-white text-center font-bold text-lg tracking-wide">
                Get Started
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="w-full bg-white dark:bg-slate-800 py-4.5 rounded-2xl border border-slate-200 dark:border-slate-700 active:bg-slate-50 dark:active:bg-slate-700">
              <Text className="text-slate-700 dark:text-slate-200 text-center font-bold text-lg tracking-wide">
                I have an account
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
