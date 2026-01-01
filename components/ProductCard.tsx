import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

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
    <TouchableOpacity
      onPress={() => onPress(product)}
      className="flex-1 m-2 bg-white dark:bg-slate-800 rounded-3xl p-3 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700"
    >
      {/* Image Container */}
      <View className="w-full h-40 bg-slate-100 dark:bg-slate-700 rounded-2xl mb-3 overflow-hidden relative">
        <Image
          source={{ uri: product.image }}
          className="w-full h-full object-cover"
          resizeMode="cover"
        />
        <View className="absolute top-2 right-2 bg-white/80 dark:bg-black/50 backdrop-blur-md px-2 py-1 rounded-full flex-row items-center gap-1">
          <MaterialIcons name="star" size={12} color="#F59E0B" />
          <Text className="text-xs font-bold text-slate-900 dark:text-white">
            {product.rating}
          </Text>
        </View>
      </View>

      {/* Product Info */}
      <View className="space-y-1">
        <Text
          numberOfLines={1}
          className="text-lg font-bold text-slate-800 dark:text-slate-100"
        >
          {product.name}
        </Text>
        <Text className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">
          {product.category}
        </Text>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-indigo-600 dark:text-indigo-400 font-black text-lg">
            ${product.price}
          </Text>
          <TouchableOpacity className="bg-indigo-600 p-2 rounded-full active:bg-indigo-700">
            <MaterialIcons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
