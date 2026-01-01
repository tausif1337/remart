import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

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
      activeOpacity={0.9}
      onPress={() => onPress(product)}
      className="flex-1 m-2 mb-4 bg-white dark:bg-slate-800 rounded-[24px] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800"
    >
      {/* Image Container */}
      <View className="w-full h-48 bg-slate-100 dark:bg-slate-700 relative">
        <Image
          source={{ uri: product.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        {/* Rating Badge */}
        <View className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/70 px-2 py-1 rounded-full flex-row items-center gap-1 shadow-sm backdrop-blur-sm">
          <MaterialIcons name="star" size={14} color="#F59E0B" />
          <Text className="text-xs font-bold text-slate-900 dark:text-white">
            {product.rating}
          </Text>
        </View>
        {/* Favorite Button */}
        <TouchableOpacity className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 p-2 rounded-full shadow-sm backdrop-blur-sm">
          <Ionicons name="heart-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Product Info */}
      <View className="p-4 space-y-2">
        <Text className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
          {product.category}
        </Text>
        
        <Text
          numberOfLines={1}
          className="text-lg font-bold text-slate-900 dark:text-white leading-tight"
        >
          {product.name}
        </Text>

        <View className="flex-row items-center justify-between pt-2">
          <Text className="text-xl font-black text-slate-900 dark:text-white">
            ${product.price}
          </Text>
          <TouchableOpacity className="bg-slate-900 dark:bg-white h-10 w-10 items-center justify-center rounded-full active:scale-95 transition-transform">
            <MaterialIcons name="add" size={24} className="text-white dark:text-slate-900" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
