import { View, Text, Image, TouchableOpacity, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { toggleWishlist } from "../store/wishlistSlice";
import { Product } from "../store/types";

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: any) => state.wishlist.items);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    setIsWishlisted(wishlist.some((item: Product) => item.id === product.id));
  }, [wishlist, product]);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: 1 }));
    Toast.show({
      type: "success",
      text1: "Added to Cart",
      text2: `${product.name} was added to your cart!`,
      visibilityTime: 2000,
    });
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product));
    Toast.show({
      type: "success",
      text1: !isWishlisted ? "Added to Wishlist" : "Removed from Wishlist",
      text2: !isWishlisted
        ? `${product.name} was added to your wishlist!`
        : `${product.name} was removed from your wishlist`,
      visibilityTime: 2000,
    });
  };

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
          onPress={handleToggleWishlist}
        >
          <Feather
            name="heart"
            size={16}
            color={isWishlisted ? "#EF4444" : "#94A3B8"}
            fill={isWishlisted ? "#EF4444" : "none"}
          />
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
            onPress={handleAddToCart}
          >
            <Feather name="plus" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}
