import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { CartItem } from "../store/types";

/**
 * CartIconWithBadge — Reusable Shopping Bag Icon with Live Item Count
 *
 * Reads from Redux to get the current cart and shows a red badge
 * with the TOTAL QUANTITY (not unique items) when there are items.
 * Used in the header of ProductDetail, ProductListing, etc.
 *
 * Props:
 * - onPress: Function to call when the icon is tapped (usually navigate to Cart)
 */
interface CartIconWithBadgeProps {
  onPress: () => void;
}

const CartIconWithBadge: React.FC<CartIconWithBadgeProps> = ({ onPress }) => {
  // Read cart items from the Redux store
  const cart = useSelector((state: any) => state.cart.cart);

  // Sum up all the quantities (e.g. 2x Shoes + 3x Chair = badge shows 5)
  const cartCount = cart.reduce(
    (acc: number, item: CartItem) => acc + item.quantity,
    0
  );

  return (
    <TouchableOpacity
      className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full items-center justify-center border border-slate-100 dark:border-slate-800 relative"
      onPress={onPress}
    >
      <Feather name="shopping-bag" size={20} color="#1E293B" />

      {/* Only show the badge when there are items in cart */}
      {cartCount > 0 && (
        <View className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-red-500 rounded-full border-2 border-white dark:border-slate-800 items-center justify-center">
          <Text className="text-[10px] text-white font-outfit-bold">
            {cartCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CartIconWithBadge;

