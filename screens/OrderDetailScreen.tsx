import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  useNavigation,
  useRoute,
  RouteProp,
  NavigationProp,
} from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { RootStackParamList } from "../navigation/types";
import Toast from "react-native-toast-message";
import { cancelOrder } from "../utils/firebaseServices";

type OrderDetailRouteProp = RouteProp<RootStackParamList, "OrderDetail">;

const OrderDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<OrderDetailRouteProp>();
  const dispatch = useDispatch();
  const { order } = route.params;
  
  const [isCancelling, setIsCancelling] = useState(false);
  const [orderStatus, setOrderStatus] = useState(order.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReorder = () => {
    console.log("[DEBUG] Reordering items from order:", order.orderId || order.id);
    order.items.forEach((item: any) => {
      // Re-constructing the product object as needed by addToCart
      const product = {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category || "general",
      };
      dispatch(addToCart({ product: product as any, quantity: item.quantity }));
    });

    Toast.show({
      type: "success",
      text1: "Items added to cart",
      text2: "Redirecting to cart...",
      visibilityTime: 2000,
    });

    setTimeout(() => {
      navigation.navigate("MainTab", { screen: "Cart" });
    }, 1500);
  };

  const handleCancelOrder = () => {
    console.log("[DEBUG] Cancel order requested:", order.orderId || order.id);
    
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order? This action cannot be undone.",
      [
        {
          text: "No, Keep Order",
          style: "cancel",
        },
        {
          text: "Yes, Cancel Order",
          style: "destructive",
          onPress: async () => {
            setIsCancelling(true);
            console.log("[DEBUG] Proceeding with order cancellation...");
            
            try {
              const result = await cancelOrder(order.id);
              
              if (result.success) {
                setOrderStatus("Cancelled");
                Toast.show({
                  type: "success",
                  text1: "Order Cancelled",
                  text2: "Your order has been cancelled successfully",
                  visibilityTime: 3000,
                });
                console.log("[DEBUG] Order cancelled successfully");
              } else {
                Toast.show({
                  type: "error",
                  text1: "Cancellation Failed",
                  text2: result.error || "Could not cancel order. Please try again.",
                  visibilityTime: 3000,
                });
                console.error("[ERROR] Order cancellation failed:", result.error);
              }
            } catch (error) {
              console.error("[ERROR] Unexpected error during cancellation:", error);
              Toast.show({
                type: "error",
                text1: "Error",
                text2: "An unexpected error occurred. Please try again.",
                visibilityTime: 3000,
              });
            } finally {
              setIsCancelling(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-800">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full items-center justify-center"
        >
          <Feather name="chevron-left" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text className="text-xl font-outfit-black text-slate-900 dark:text-white">
          Order Summary
        </Text>
        <TouchableOpacity
          onPress={() => {
            /* Possible Share or Download function */
          }}
          className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full items-center justify-center"
        >
          <Feather name="share-2" size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-4 py-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Invoice Header */}
        <View className="mb-8 bg-indigo-600 rounded-2xl p-6 shadow-lg">
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-indigo-100 text-xs font-outfit-bold mb-1">
                ORDER ID
              </Text>
              <Text className="text-white text-lg font-outfit-black">
                #{order.orderId || order.id.slice(0, 8).toUpperCase()}
              </Text>
            </View>
            <View className="bg-white/20 px-3 py-1 rounded-full">
              <Text className="text-white text-xs font-outfit-bold">
                {orderStatus}
              </Text>
            </View>
          </View>
          <View className="flex-row justify-between items-end">
            <View>
              <Text className="text-indigo-100 text-xs font-outfit-bold mb-1">
                DATE
              </Text>
              <Text className="text-white font-outfit-medium">
                {formatDate(order.orderDate || order.createdAt)}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-indigo-100 text-xs font-outfit-bold mb-1">
                TOTAL AMOUNT
              </Text>
              <Text className="text-white text-2xl font-outfit-black">
                ৳{order.amount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Items List */}
        <View className="mb-8">
          <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white mb-4">
            Items Purchased
          </Text>
          {order.items.map((item: any, index: number) => (
            <View
              key={index}
              className="flex-row items-center mb-4 pb-4 border-b border-slate-50 dark:border-slate-800"
            >
              <Image
                source={{
                  uri: item.image || "https://via.placeholder.com/150",
                }}
                className="w-16 h-16 rounded-lg bg-slate-100"
              />
              <View className="flex-1 ml-4">
                <Text
                  className="text-base font-outfit-bold text-slate-900 dark:text-white"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text className="text-sm text-slate-500 dark:text-slate-400">
                  {item.quantity} x ৳{item.price.toFixed(2)}
                </Text>
              </View>
              <Text className="text-base font-outfit-black text-slate-900 dark:text-white">
                ৳{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Pricing Breakdown */}
        <View className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-8">
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-600 dark:text-slate-400 font-outfit-medium">
              Subtotal
            </Text>
            <Text className="text-slate-900 dark:text-white font-outfit-bold">
              ৳{order.amount.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-600 dark:text-slate-400 font-outfit-medium">
              Shipping
            </Text>
            <Text className="text-green-600 font-outfit-bold">FREE</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-600 dark:text-slate-400 font-outfit-medium">
              Tax
            </Text>
            <Text className="text-slate-900 dark:text-white font-outfit-bold">
              ৳0.00
            </Text>
          </View>
          <View className="h-px bg-slate-200 dark:bg-slate-700 my-2" />
          <View className="flex-row justify-between items-center mt-1">
            <Text className="text-lg font-outfit-black text-slate-900 dark:text-white">
              Total
            </Text>
            <Text className="text-2xl font-outfit-black text-indigo-600 dark:text-indigo-400">
              ৳{order.amount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Shipping Info */}
        <View className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 mb-8">
          <View className="flex-row items-center mb-3">
            <Feather name="map-pin" size={18} color="#4F46E5" />
            <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white ml-2">
              Shipping Address
            </Text>
          </View>
          <Text className="text-slate-700 dark:text-slate-300 font-outfit-medium mb-1">
            {order.customerName}
          </Text>
          <Text className="text-slate-600 dark:text-slate-400 leading-5">
            {order.shippingAddress.address},{"\n"}
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.zipCode},{"\n"}
            {order.shippingAddress.country}
          </Text>
        </View>

        {/* Reorder Button */}
        <TouchableOpacity
          onPress={handleReorder}
          disabled={isCancelling}
          className="bg-indigo-600 h-14 rounded-2xl flex-row items-center justify-center mb-4 shadow-lg shadow-indigo-200"
        >
          <Feather name="refresh-cw" size={20} color="white" />
          <Text className="text-white text-lg font-outfit-bold ml-2">
            Reorder Items
          </Text>
        </TouchableOpacity>

        {/* Cancel Order Button - Only show if order is not already cancelled or delivered */}
        {orderStatus !== "Cancelled" && orderStatus !== "Delivered" && (
          <TouchableOpacity
            onPress={handleCancelOrder}
            disabled={isCancelling}
            className={`h-14 rounded-2xl flex-row items-center justify-center shadow-lg ${
              isCancelling ? "bg-slate-400" : "bg-red-500 shadow-red-200"
            }`}
          >
            {isCancelling ? (
              <>
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white text-lg font-outfit-bold ml-2">
                  Cancelling...
                </Text>
              </>
            ) : (
              <>
                <Feather name="x-circle" size={20} color="white" />
                <Text className="text-white text-lg font-outfit-bold ml-2">
                  Cancel Order
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Cancelled Badge */}
        {orderStatus === "Cancelled" && (
          <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
            <View className="flex-row items-center">
              <Feather name="x-circle" size={20} color="#EF4444" />
              <Text className="flex-1 text-red-700 dark:text-red-300 text-sm font-outfit-bold ml-3">
                This order has been cancelled
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailScreen;
