import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';

const CATEGORIES = ['All', 'electronics', 'furniture', 'fashion', 'decoration'];

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProductListing'>;

export default function ProductListingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const products = useStore((state) => state.products);
  const cart = useStore((state) => state.cart);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { width } = useWindowDimensions();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Responsive column calculation
  const numColumns = width > 1024 ? 4 : width > 768 ? 3 : 2;
  const contentPadding = width > 768 ? 32 : 24;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-1 w-full self-center" style={{ paddingHorizontal: contentPadding }}>
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

          <TouchableOpacity className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full items-center justify-center border border-slate-100 dark:border-slate-800 relative">
            <Feather name="shopping-bag" size={20} color="#1E293B" />
            {cartCount > 0 && (
              <View className="absolute -top-1 -right-1 min-w-[20px] h-[20px] bg-red-500 rounded-full border-2 border-white dark:border-slate-800 items-center justify-center">
                <Text className="text-[10px] text-white font-outfit-bold">{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search & Filter */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFilterPress={() => { }}
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
              onPress={(product) => navigation.navigate('ProductDetail', { productId: product.id })}
            />
          )}
          numColumns={numColumns}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
          columnWrapperStyle={{ gap: 16 }}

          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-24">
              <View className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full items-center justify-center mb-4">
                <Feather name="search" size={40} color="#94A3B8" />
              </View>
              <Text className="text-slate-900 dark:text-white text-lg font-outfit-bold">No products found</Text>
              <Text className="text-slate-500 text-sm font-outfit-medium mt-1">Try adjusting your search or filters</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
