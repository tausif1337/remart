import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  return (
    <Pressable
      onPress={() => onPress(product)}
      className="flex-1 m-2 mb-6 bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800"
    >
      {/* Image Container */}
      <View className="w-full h-44 bg-slate-50 dark:bg-slate-800 relative justify-center items-center">
        <Image
          source={{ uri: product.image }}
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Rating Badge - Floating effect */}
        <View className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 px-2.5 py-1.5 rounded-2xl flex-row items-center gap-1 shadow-sm">
          <Feather name="star" size={12} color="#F59E0B" />
          <Text className="text-xs font-outfit-bold text-slate-800 dark:text-white">
            {product.rating}
          </Text>
        </View>

        {/* Favorite Button - Glassmorphism */}
        <TouchableOpacity
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-black/60 rounded-full items-center justify-center"
        >
          <Feather name="heart" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Product Info */}
      <View className="p-4 pt-3">
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-2">
            <Text className="text-[10px] font-outfit-bold text-indigo-500 uppercase mb-1">
              {product.category}
            </Text>
            <Text
              numberOfLines={1}
              className="text-base font-outfit-bold text-slate-900 dark:text-white leading-tight"
            >
              {product.name}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-3">
          <Text className="text-lg font-outfit-black text-slate-900 dark:text-white">
            ${product.price}
          </Text>

          <TouchableOpacity
            className="bg-slate-900 dark:bg-white w-8 h-8 items-center justify-center rounded-full"
          >
            <Feather name="plus" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}
