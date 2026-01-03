import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <View className="mb-6">
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 4 }}
      >
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category;
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={index}
              onPress={() => onSelectCategory(category)}
              className={`px-5 py-2.5 rounded-full border shadow-sm ${
                isSelected
                  ? "bg-indigo-600 border-indigo-600"
                  : "bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-700"
              }`}
            >
              <Text
                className={`font-outfit-medium text-sm capitalize ${
                  isSelected
                    ? "text-white"
                    : "text-slate-600 dark:text-slate-300"
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
