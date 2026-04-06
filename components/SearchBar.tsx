import { View, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

/**
 * SearchBar — Controlled Text Input with Clear and Filter Buttons
 *
 * This is a "controlled" component — its state lives in the parent.
 * The parent passes `value` and `onChangeText` (like a form field).
 * When the user types, the parent's state is updated in real time.
 *
 * Props:
 * - value: The current search text from the parent
 * - onChangeText: Function to update the parent's search state
 * - onFilterPress: Optional callback for the filter icon button
 */
interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void; // Optional: not all usages need a filter action
}

export default function SearchBar({
  value,
  onChangeText,
  onFilterPress,
}: SearchBarProps) {
  return (
    <View className="flex-row items-center mb-8">
      {/* Text Input Row */}
      <View className="flex-1 flex-row items-center bg-white dark:bg-slate-800 rounded-2xl h-14 px-4 border border-slate-100 dark:border-slate-700">
        <Feather name="search" size={20} color="#94A3B8" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search products..."
          placeholderTextColor="#94A3B8"
          className="flex-1 ml-3 text-base text-slate-900 dark:text-white font-outfit-medium h-full"
        />
        {/* Clear button — only visible when there's text to clear */}
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText("")}>
            <Feather name="x-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Button — calls onFilterPress when tapped */}
      <TouchableOpacity
        onPress={onFilterPress}
        className="w-14 h-14 bg-indigo-600 rounded-2xl items-center justify-center shadow-md"
      >
        <Feather name="sliders" size={22} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

