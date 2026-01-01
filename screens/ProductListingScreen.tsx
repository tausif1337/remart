import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
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
  {
    id: '9',
    name: 'Wireless Earbuds',
    price: 159.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop',
    rating: 4.7,
  },
  {
    id: '10',
    name: 'Wooden Table',
    price: 199.50,
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=1000&auto=format&fit=crop',
    rating: 4.4,
  },
  {
    id: '11',
    name: 'Mechanical Keyboard',
    price: 129.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b91a05c?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
  },
  {
    id: '12',
    name: 'Denim Jacket',
    price: 79.99,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=1000&auto=format&fit=crop',
    rating: 4.3,
  },
  {
    id: '13',
    name: 'Wall Art',
    price: 120.00,
    category: 'decoration',
    image: 'https://images.unsplash.com/photo-1582037928769-181f2644ec27?q=80&w=1000&auto=format&fit=crop',
    rating: 4.5,
  },
  {
    id: '14',
    name: 'Comfy Sweater',
    price: 59.99,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
    rating: 4.6,
  },
  {
    id: '15',
    name: 'Modern Sofa',
    price: 799.00,
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop',
    rating: 4.7,
  },
  {
    id: '16',
    name: 'Bluetooth Speaker',
    price: 89.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop',
    rating: 4.4,
  },
  {
    id: '17',
    name: 'Classic Sunglasses',
    price: 149.50,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
  },
  {
    id: '18',
    name: 'Potted Plant',
    price: 34.99,
    category: 'decoration',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1000&auto=format&fit=crop',
    rating: 4.2,
  },
  {
    id: '19',
    name: 'Coffee Table',
    price: 149.00,
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=1000&auto=format&fit=crop',
    rating: 4.5,
  },
  {
    id: '20',
    name: 'Designer Watch',
    price: 399.99,
    category: 'fashion',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
  },
];

const CATEGORIES = ['All', 'electronics', 'furniture', 'fashion', 'decoration'];

export default function ProductListingScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { width } = useWindowDimensions();

  // Responsive column calculation
  const numColumns = width > 1024 ? 4 : width > 768 ? 3 : 2;
  const contentPadding = width > 768 ? 32 : 24;

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
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <View className="flex-1 w-full max-w-7xl self-center" style={{ paddingHorizontal: contentPadding }}>
        {/* Header Section */}
        <View className="flex-row justify-between items-center mb-8 mt-4">
          <View>
            <Text className="text-sm font-outfit-bold text-indigo-500 uppercase tracking-wider mb-1">
              New Collection
            </Text>
            <Text className="text-3xl font-outfit-black text-slate-900 dark:text-white tracking-tight">
              Best Sellers
            </Text>
          </View>
          
          <TouchableOpacity className="w-12 h-12 bg-white dark:bg-slate-900 rounded-full items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm relative active:scale-95 transition-transform">
            <Feather name="shopping-bag" size={20} className="text-slate-900 dark:text-white" />
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
          key={numColumns} // Force re-render when columns change
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={(product) => console.log('Product pressed:', product.name)}
            />
          )}
          numColumns={numColumns}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
          columnWrapperStyle={{ gap: 16 }}
          showsVerticalScrollIndicator={false}
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
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
