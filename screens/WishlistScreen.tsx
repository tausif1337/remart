import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { removeFromWishlist, toggleWishlist } from "../store/wishlistSlice";
import { Product } from "../store/types";
import { RootStackParamList } from "../navigation/types";

const WishlistScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const wishlist = useSelector((state: any) => state.wishlist.items);

  const handleRemoveFromWishlist = (product: Product) => {
    dispatch(removeFromWishlist(product.id));
    Toast.show({
      type: "success",
      text1: "Removed from Wishlist",
      text2: `${product.name} was removed from your wishlist`,
      visibilityTime: 2000,
    });
  };

  const handleToggleWishlist = (product: Product) => {
    dispatch(toggleWishlist(product));
    const isWishlisted = wishlist.some(
      (item: Product) => item.id === product.id
    );
    Toast.show({
      type: "success",
      text1: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      text2: isWishlisted
        ? `${product.name} was removed from your wishlist`
        : `${product.name} was added to your wishlist`,
      visibilityTime: 2000,
    });
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate("ProductDetail", { productId: product.id });
  };

  const renderWishlistItem = ({ item }: { item: Product }) => (
    <View className="flex-row items-center p-4 mb-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
      <TouchableOpacity
        onPress={() => handleProductPress(item)}
        className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-lg mr-4 overflow-hidden"
      >
        <Image
          source={{ uri: item.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View className="flex-1">
        <TouchableOpacity onPress={() => handleProductPress(item)}>
          <Text className="text-base font-outfit-bold text-slate-900 dark:text-white">
            {item.name}
          </Text>
          <Text className="text-indigo-600 dark:text-indigo-400 font-outfit-bold">
            ৳{item.price.toFixed(2)}
          </Text>
          <Text className="text-xs text-slate-500 mt-1">{item.category}</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={() => handleToggleWishlist(item)}
          className="p-2 mr-2"
        >
          <Feather name="heart" size={24} color="#EF4444" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRemoveFromWishlist(item)}
          className="p-2"
        >
          <Feather name="trash-2" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
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
              Your Wishlist
            </Text>
            <Text className="text-lg font-outfit-bold text-slate-500">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
            </Text>
          </View>
        </View>

        {wishlist.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <View className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full items-center justify-center mb-4">
              <Feather name="heart" size={40} color="#94A3B8" />
            </View>
            <Text className="text-xl font-outfit-bold text-slate-900 dark:text-white mb-2">
              Your wishlist is empty
            </Text>
            <Text className="text-slate-500 text-center">
              Add some favorite items to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={wishlist}
            renderItem={renderWishlistItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default WishlistScreen;
