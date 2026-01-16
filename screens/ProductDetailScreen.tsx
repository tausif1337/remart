import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { addToCart } from "../store/cartSlice";
import { Product, Review } from "../store/types";
import CartIconWithBadge from "../components/CartIconWithBadge";
import ReviewSection from "../components/ReviewSection";
import { getProductById, getReviewsByProductId } from "../utils/firebaseServices";

type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">;
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductDetail"
>;

export default function ProductDetailScreen() {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { productId } = route.params;
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();

  // Get reviews from the Redux store
  const reviews = useSelector((state: any) => state.cart.reviews);

  const [product, setProduct] = useState<Product | null>(null);
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"Description" | "Specs">(
    "Description"
  );
  
  // Fetch product details and reviews from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedProduct, fetchedReviews] = await Promise.all([
          getProductById(productId),
          getReviewsByProductId(productId)
        ]);
        setProduct(fetchedProduct as Product);
        setProductReviews(fetchedReviews as Review[]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [productId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-slate-950">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="text-slate-500 dark:text-slate-400 text-sm font-outfit-medium mt-4">
          Loading product details...
        </Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white dark:bg-slate-950">
        <Text className="text-slate-900 dark:text-white font-outfit-bold text-lg">
          Product not found
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4 px-6 py-2 bg-indigo-600 rounded-full"
        >
          <Text className="text-white font-outfit-bold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    Toast.show({
      type: "success",
      text1: "Added to Cart",
      text2: `${product.name} was added to your cart!`,
      visibilityTime: 2000,
    });
  };

  const navigateToCart = () => {
    navigation.navigate("MainTab", { screen: "Cart" });
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-950">
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Product Image Header */}
        <View className="relative">
          <Image
            source={{ uri: product.image }}
            className="w-full h-[450px]"
            style={{ width }}
            resizeMode="cover"
          />
          <View className="absolute top-12 left-6 right-6 flex-row justify-between">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 bg-white/90 dark:bg-slate-900/90 rounded-full items-center justify-center"
            >
              <Feather name="chevron-left" size={24} color="#1E293B" />
            </TouchableOpacity>
            <CartIconWithBadge onPress={navigateToCart} />
          </View>

          <View className="absolute bottom-0 left-0 right-0 h-12 bg-white dark:bg-slate-950 rounded-t-[40px]" />
        </View>

        {/* Product Title & Price */}
        <View className="px-6 -mt-4">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-4">
              <Text className="text-sm font-outfit-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1">
                {product.category}
              </Text>
              <Text className="text-3xl font-outfit-black text-slate-900 dark:text-white leading-tight">
                {product.name}
              </Text>
            </View>
            <View className="bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-2xl">
              <Text className="text-2xl font-outfit-black text-indigo-600 dark:text-indigo-400">
                ৳{product.price}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mt-4">
            <View className="flex-row items-center bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg mr-4">
              <Feather name="star" size={14} color="#F59E0B" />
              <Text className="text-amber-700 dark:text-amber-500 font-outfit-bold ml-1 text-xs">
                {product.rating}
              </Text>
            </View>
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-outfit-medium">
              {productReviews.length} Customer Reviews
            </Text>
          </View>

          {/* Quantity Selector */}
          <View className="mt-8">
            <Text className="text-sm font-outfit-bold text-slate-900 dark:text-white mb-3">
              Quantity
            </Text>
            <View className="flex-row items-center bg-slate-100 dark:bg-slate-900 w-32 justify-between p-1 rounded-xl">
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg items-center justify-center"
              >
                <Feather name="minus" size={18} color="#1E293B" />
              </TouchableOpacity>
              <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white">
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg items-center justify-center"
              >
                <Feather name="plus" size={18} color="#1E293B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs */}
          <View className="mt-8 border-b border-slate-100 dark:border-slate-800 flex-row">
            {["Description", "Specs"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab as "Description" | "Specs")}
                className={`mr-8 pb-4 ${
                  activeTab === tab ? "border-b-2 border-indigo-600" : ""
                }`}
              >
                <Text
                  className={`font-outfit-bold ${
                    activeTab === tab ? "text-indigo-600" : "text-slate-400"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-6">
            {activeTab === "Description" ? (
              <Text className="text-slate-600 dark:text-slate-400 leading-6 font-outfit-regular">
                {product.description}
              </Text>
            ) : (
              <View>
                {product.specifications.map(
                  (spec: { label: string; value: string }, index: number) => (
                    <View
                      key={index}
                      className="flex-row justify-between py-3 border-b border-slate-50 dark:border-slate-800"
                    >
                      <Text className="text-slate-500 font-outfit-medium">
                        {spec.label}
                      </Text>
                      <Text className="text-slate-900 dark:text-white font-outfit-bold">
                        {spec.value}
                      </Text>
                    </View>
                  )
                )}
              </View>
            )}
          </View>
        </View>

        {/* Reviews Section */}
        <ReviewSection reviews={productReviews} />
      </ScrollView>

      {/* Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 px-6 py-8 border-t border-slate-100 dark:border-slate-800">
        <View className="flex-row items-center">
          <View className="flex-1">
            <Text className="text-slate-400 text-xs font-outfit-bold uppercase mb-1">
              Total Price
            </Text>
            <Text className="text-2xl font-outfit-black text-slate-900 dark:text-white">
              ৳{(product.price * quantity).toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleAddToCart}
            className="bg-indigo-600 h-14 flex-1 rounded-2xl flex-row items-center justify-center"
          >
            <Feather name="shopping-cart" size={20} color="#FFFFFF" />
            <Text className="text-white font-outfit-bold ml-2 text-lg">
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
