import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, MainTabParamList } from "../navigation/types";
import { useSelector } from "react-redux";
import { Product, CartItem } from "../store/types";
import CartIconWithBadge from "../components/CartIconWithBadge";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import { getProducts, seedDatabase } from "../utils/firebaseServices";
import { CompositeNavigationProp } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

const CATEGORIES = ["All", "electronics", "furniture", "fashion", "decoration"];

type NavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, "Home">,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function ProductListingScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Get cart from Redux store
  const cart = useSelector((state: any) => state.cart.cart);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { width } = useWindowDimensions();
  
  // Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        
        // If no products found, offer to seed or auto-seed
        if (fetchedProducts.length === 0) {
          console.log("No products found in Firestore. Seeding database...");
          const seedResult = await seedDatabase();
          if (seedResult.success) {
            console.log("Database seeded successfully. Re-fetching products...");
            const reFetchedProducts = await getProducts();
            setProducts(reFetchedProducts as Product[]);
          } else {
            console.error("Failed to seed database:", seedResult.error);
          }
        } else {
          setProducts(fetchedProducts as Product[]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const cartCount = cart.reduce(
    (acc: number, item: CartItem) => acc + item.quantity,
    0
  );

  // Responsive column calculation
  const numColumns = width > 1024 ? 4 : width > 768 ? 3 : 2;
  const contentPadding = width > 768 ? 32 : 24;

  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const navigateToCart = () => {
    navigation.navigate("Cart");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View
        className="flex-1 w-full self-center"
        style={{ paddingHorizontal: contentPadding }}
      >
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-8 mt-4">
          <View>
            <Text className="text-sm font-outfit-bold text-slate-500 dark:text-slate-400 uppercase mb-1">
              Welcome to
            </Text>
            <Text className="text-4xl font-outfit-black text-indigo-600 dark:text-indigo-400">
              Remart
            </Text>
          </View>

          <CartIconWithBadge onPress={navigateToCart} />
        </View>

        {/* Search & Filter */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => {}}
        />
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Product Grid */}
        <FlatList
          key={numColumns.toString()} // Force re-render when columns change
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={(product) =>
                navigation.navigate("ProductDetail", { productId: product.id })
              }
            />
          )}
          numColumns={numColumns}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
          columnWrapperStyle={{ gap: 16 }}
          ListEmptyComponent={
            loading ? (
              <View className="flex-1 items-center justify-center py-24">
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text className="text-slate-500 dark:text-slate-400 text-sm font-outfit-medium mt-4">
                  Loading products...
                </Text>
              </View>
            ) : (
              <View className="flex-1 items-center justify-center py-24">
                <View className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full items-center justify-center mb-4">
                  <Feather name="search" size={40} color="#94A3B8" />
                </View>
                <Text className="text-slate-900 dark:text-white text-lg font-outfit-bold">
                  No products found
                </Text>
                <Text className="text-slate-500 text-sm font-outfit-medium mt-1">
                  Try adjusting your search or filters
                </Text>
              </View>
            )
          }
          refreshing={loading}
          onRefresh={() => {
            const fetchProducts = async () => {
              setLoading(true);
              try {
                const fetchedProducts = await getProducts();
                setProducts(fetchedProducts as Product[]);
              } catch (error) {
                console.error('Error fetching products:', error);
              } finally {
                setLoading(false);
              }
            };
            
            fetchProducts();
          }}
        />
      </View>
    </SafeAreaView>
  );
}
