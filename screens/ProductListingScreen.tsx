import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';

// Mock Data
const PRODUCTS = [
  {
    id: '1',
    name: 'Modern Headphones',
    price: 199.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Ergonomic Chair',
    price: 349.00,
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop',
    rating: 4.5,
  },
  {
    id: '3',
    name: 'Smart Watch',
    price: 299.50,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
  },
  {
    id: '4',
    name: 'Minimal Lamp',
    price: 89.99,
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1507473888900-52e1ad14db3d?q=80&w=1000&auto=format&fit=crop',
    rating: 4.2,
  },
  {
    id: '5',
    name: 'Running Shoes',
    price: 129.99,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
    rating: 4.7,
  },
  {
    id: '6',
    name: 'Leather Backpack',
    price: 159.00,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
    rating: 4.6,
  },
  {
    id: '7',
    name: 'Digital Camera',
    price: 899.00,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
  },
  {
    id: '8',
    name: 'Ceramic Vase',
    price: 45.00,
    category: 'decoration',
    image: 'https://images.unsplash.com/photo-1581783342308-f792ca11df53?q=80&w=1000&auto=format&fit=crop',
    rating: 4.3,
  },
];

const CATEGORIES = ['All', 'electronics', 'furniture', 'fashion', 'decoration'];

export default function ProductListingScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
      <View className="flex-1 px-5 pt-2">
        {/* Header Section */}
        <View className="flex-row justify-between items-start mb-6 mt-2">
          <View>
            <Text className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Discover
            </Text>
            <Text className="text-base text-slate-500 dark:text-slate-400 font-medium mt-1">
              Find your perfect items
            </Text>
          </View>
          
          <TouchableOpacity className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm relative active:scale-95 transition-transform">
            <Ionicons name="bag-outline" size={24} className="text-slate-900 dark:text-white" />
            <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-800" />
          </TouchableOpacity>
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
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={(product) => console.log('Product pressed:', product.name)}
            />
          )}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 100 }}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Ionicons name="search-outline" size={64} color="#CBD5E1" />
              <Text className="text-slate-400 text-lg font-medium mt-4">No products found</Text>
            </View>
          }
        />
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
