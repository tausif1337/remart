import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <View className="mb-8">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
      >
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              key={index}
              onPress={() => onSelectCategory(category)}
              className={`px-6 py-3 rounded-full border ${
                isSelected 
                  ? 'bg-slate-900 border-slate-900 dark:bg-white dark:border-white' 
                  : 'bg-transparent border-slate-200 dark:border-slate-700'
              }`}
            >
              <Text 
                className={`font-bold text-sm capitalize ${
                  isSelected 
                    ? 'text-white dark:text-slate-900' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
