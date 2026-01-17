import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { getUserOrders } from "../utils/firebaseServices";
import { RootStackParamList } from "../navigation/types";

const OrderHistoryScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const user = useSelector((state: any) => state.auth.user);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    const userOrders = await getUserOrders(user.id);
    setOrders(userOrders);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (user) {
      const userOrders = await getUserOrders(user.id);
      setOrders(userOrders);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("OrderDetail", { order: item })}
      className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-4 border border-slate-100 dark:border-slate-700 shadow-sm"
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-outfit-bold text-slate-500 dark:text-slate-400">
          Order #{item.orderId || item.id.slice(0, 8).toUpperCase()}
        </Text>
        <View
          className={`px-2 py-1 rounded-full ${
            item.status === "Delivered"
              ? "bg-green-100 dark:bg-green-900/30"
              : item.status === "Cancelled"
              ? "bg-red-100 dark:bg-red-900/30"
              : "bg-blue-100 dark:bg-blue-900/30"
          }`}
        >
          <Text
            className={`text-xs font-outfit-bold ${
              item.status === "Delivered"
                ? "text-green-700 dark:text-green-300"
                : item.status === "Cancelled"
                ? "text-red-700 dark:text-red-300"
                : "text-blue-700 dark:text-blue-300"
            }`}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <Text className="text-lg font-outfit-black text-slate-900 dark:text-white mb-1">
        ৳{item.amount.toFixed(2)}
      </Text>

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Feather name="calendar" size={14} color="#64748B" />
          <Text className="text-xs text-slate-500 dark:text-slate-400 ml-1">
            {formatDate(item.orderDate || item.createdAt)}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-xs text-indigo-600 dark:text-indigo-400 font-outfit-medium mr-1">
            {item.items.length} {item.items.length === 1 ? "item" : "items"}
          </Text>
          <Feather name="chevron-right" size={16} color="#4F46E5" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <View className="flex-row items-center px-4 py-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full items-center justify-center mr-3"
        >
          <Feather name="chevron-left" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text className="text-xl font-outfit-black text-slate-900 dark:text-white">
          Order History
        </Text>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4F46E5"]}
            />
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <View className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center mb-4">
                <Feather name="shopping-bag" size={40} color="#94A3B8" />
              </View>
              <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white mb-2">
                No orders yet
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-center px-10">
                You haven't placed any orders yet. Start shopping to see your
                history here!
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;
