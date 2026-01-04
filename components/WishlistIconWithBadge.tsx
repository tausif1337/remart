import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { Product } from "../store/types";

interface WishlistIconWithBadgeProps {
  onPress: () => void;
}

const WishlistIconWithBadge: React.FC<WishlistIconWithBadgeProps> = ({
  onPress,
}) => {
  const wishlist = useSelector((state: any) => state.wishlist.items);

  const wishlistCount = wishlist.length;

  return (
    <TouchableOpacity
      className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full items-center justify-center border border-slate-100 dark:border-slate-800 relative"
      onPress={onPress}
    >
      <Feather name="heart" size={20} color="#1E293B" />
      {wishlistCount > 0 && (
        <View className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-red-500 rounded-full border-2 border-white dark:border-slate-800 items-center justify-center">
          <Text className="text-[10px] text-white font-outfit-bold">
            {wishlistCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default WishlistIconWithBadge;
