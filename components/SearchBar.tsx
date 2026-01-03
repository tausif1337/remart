import { View, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
}

export default function SearchBar({
  value,
  onChangeText,
  onFilterPress,
}: SearchBarProps) {
  return (
    <View className="flex-row items-center mb-8">
      <View className="flex-1 flex-row items-center bg-white dark:bg-slate-800 rounded-2xl h-14 px-4 border border-slate-100 dark:border-slate-700">
        <Feather name="search" size={20} color="#94A3B8" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search products..."
          placeholderTextColor="#94A3B8"
          className="flex-1 ml-3 text-base text-slate-900 dark:text-white font-outfit-medium h-full"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText("")}>
            <Feather name="x-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        onPress={onFilterPress}
        className="w-14 h-14 bg-indigo-600 rounded-2xl items-center justify-center shadow-md"
      >
        <Feather name="sliders" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
