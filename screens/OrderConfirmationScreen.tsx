import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";

type OrderConfirmationRouteProp = RouteProp<RootStackParamList, "OrderConfirmation">;
type NavigationType = NavigationProp<RootStackParamList>;

interface OrderDetails {
  orderId: string;
  transactionId: string;
  amount: number;
  customerName: string;
  email: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderDate: string;
}

const OrderConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationType>();
  const route = useRoute<OrderConfirmationRouteProp>();
  const { orderDetails } = route.params as { orderDetails: OrderDetails };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <ScrollView 
        className="flex-1 px-4 py-6"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="mb-8 items-center">
          <View className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center mb-4">
            <Feather name="check" size={40} color="#10B981" />
          </View>
          <Text className="text-2xl font-outfit-black text-slate-900 dark:text-white mb-2 text-center">
            Order Confirmed!
          </Text>
          <Text className="text-base font-outfit-regular text-slate-600 dark:text-slate-400 text-center">
            Thank you for your purchase. Your order has been successfully processed.
          </Text>
        </View>

        {/* Order Summary Card */}
        <View className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 mb-6">
          <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white mb-4">
            Order Details
          </Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-slate-600 dark:text-slate-300 font-outfit-medium">
                Order ID:
              </Text>
              <Text className="text-slate-900 dark:text-white font-outfit-regular">
                #{orderDetails.orderId}
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-slate-600 dark:text-slate-300 font-outfit-medium">
                Transaction ID:
              </Text>
              <Text className="text-slate-900 dark:text-white font-outfit-regular">
                {orderDetails.transactionId}
              </Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-slate-600 dark:text-slate-300 font-outfit-medium">
                Order Date:
              </Text>
              <Text className="text-slate-900 dark:text-white font-outfit-regular">
                {formatDate(orderDetails.orderDate)}
              </Text>
            </View>
            
            <View className="flex-row justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
              <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white">
                Total Amount:
              </Text>
              <Text className="text-xl font-outfit-black text-indigo-600 dark:text-indigo-400">
                ৳{orderDetails.amount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Items Summary */}
        <View className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 mb-6">
          <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white mb-4">
            Order Items
          </Text>
          
          {orderDetails.items.map((item, index) => (
            <View 
              key={index} 
              className="flex-row justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-b-0"
            >
              <View className="flex-1">
                <Text className="text-slate-600 dark:text-slate-300 font-outfit-medium">
                  {item.name}
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 text-xs">
                  Qty: {item.quantity} × ৳{item.price.toFixed(2)}
                </Text>
              </View>
              <Text className="text-slate-900 dark:text-white font-outfit-bold">
                ৳{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Customer Info */}
        <View className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 mb-6">
          <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white mb-4">
            Customer Information
          </Text>
          
          <View className="space-y-2">
            <View className="flex-row">
              <Text className="text-slate-600 dark:text-slate-300 font-outfit-medium w-24">
                Name:
              </Text>
              <Text className="text-slate-900 dark:text-white font-outfit-regular flex-1">
                {orderDetails.customerName}
              </Text>
            </View>
            
            <View className="flex-row">
              <Text className="text-slate-600 dark:text-slate-300 font-outfit-medium w-24">
                Email:
              </Text>
              <Text className="text-slate-900 dark:text-white font-outfit-regular flex-1">
                {orderDetails.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Shipping Address */}
        <View className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 mb-8">
          <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white mb-4">
            Shipping Address
          </Text>
          
          <View className="space-y-1">
            <Text className="text-slate-900 dark:text-white font-outfit-regular">
              {orderDetails.shippingAddress.address}
            </Text>
            <Text className="text-slate-900 dark:text-white font-outfit-regular">
              {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zipCode}
            </Text>
            <Text className="text-slate-900 dark:text-white font-outfit-regular">
              {orderDetails.shippingAddress.country}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-4">
          <TouchableOpacity
            className="h-14 bg-indigo-600 rounded-xl items-center justify-center"
            onPress={() => navigation.navigate("ProductListing")}
          >
            <Text className="text-white font-outfit-bold text-lg">
              Continue Shopping
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="h-14 border-2 border-indigo-600 rounded-xl items-center justify-center"
            onPress={() => navigation.navigate("Cart")}
          >
            <Text className="text-indigo-600 dark:text-indigo-400 font-outfit-bold text-lg">
              View Cart
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <View className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <View className="flex-row items-start">
            <Feather name="info" size={16} color="#3B82F6" className="mt-0.5" />
            <Text className="text-blue-700 dark:text-blue-300 text-sm font-outfit-regular ml-2">
              You will receive an email confirmation with your order details shortly. 
              Our team will process your order and send shipping updates.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderConfirmationScreen;