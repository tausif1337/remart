import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { removeFromCart, updateCartQuantity } from "../store/cartSlice";
import { CartItem } from "../store/types";

const CartScreen: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cart = useSelector((state: any) => state.cart.cart);

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
    Toast.show({
      type: "success",
      text1: "Item Removed",
      text2: "Item has been removed from your cart",
      visibilityTime: 2000,
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      dispatch(removeFromCart(productId));
      Toast.show({
        type: "success",
        text1: "Item Removed",
        text2: "Item has been removed from your cart",
        visibilityTime: 2000,
      });
    } else {
      dispatch(updateCartQuantity({ productId, quantity }));
      Toast.show({
        type: "success",
        text1: "Quantity Updated",
        text2: "Cart item quantity has been updated",
        visibilityTime: 2000,
      });
    }
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total: number, item: CartItem) => total + item.price * item.quantity,
      0
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View className="flex-row items-center p-4 mb-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
      <Image
        source={{ uri: item.image }}
        className="w-16 h-16 rounded-lg mr-4"
      />
      <View className="flex-1">
        <Text className="text-base font-outfit-bold text-slate-900 dark:text-white">
          {item.name}
        </Text>
        <Text className="text-indigo-600 dark:text-indigo-400 font-outfit-bold">
          ${item.price.toFixed(2)}
        </Text>
        <View className="flex-row items-center mt-2">
          <TouchableOpacity
            onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full items-center justify-center"
          >
            <Feather name="minus" size={14} color="#1E293B" />
          </TouchableOpacity>
          <Text className="mx-3 text-lg font-outfit-bold text-slate-900 dark:text-white">
            {item.quantity}
          </Text>
          <TouchableOpacity
            onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full items-center justify-center"
          >
            <Feather name="plus" size={14} color="#1E293B" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveItem(item.id)}
        className="ml-4 p-2"
      >
        <Feather name="trash-2" size={20} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900 p-4">
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full items-center justify-center mr-4"
          >
            <Feather name="chevron-left" size={24} color="#1E293B" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-outfit-black text-slate-900 dark:text-white">
              Your Cart
            </Text>
            <Text className="text-lg font-outfit-bold text-slate-500">
              {cart.length} {cart.length === 1 ? "item" : "items"}
            </Text>
          </View>
        </View>

        {cart.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <View className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center mb-4">
              <Feather name="shopping-cart" size={40} color="#94A3B8" />
            </View>
            <Text className="text-xl font-outfit-bold text-slate-900 dark:text-white mb-2">
              Your cart is empty
            </Text>
            <Text className="text-slate-500 text-center">
              Add some items to get started
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={cart}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />

            <View className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 mt-auto">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white">
                  Total:
                </Text>
                <Text className="text-xl font-outfit-black text-indigo-600 dark:text-indigo-400">
                  ${calculateTotal().toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                className="bg-indigo-600 h-14 rounded-xl items-center justify-center mt-4"
                onPress={() => {
                  Toast.show({
                    type: "success",
                    text1: "Checkout Successful",
                    text2: "Your order has been placed successfully!",
                    visibilityTime: 3000,
                  });
                }}
              >
                <Text className="text-white font-outfit-bold text-lg">
                  Checkout
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;
