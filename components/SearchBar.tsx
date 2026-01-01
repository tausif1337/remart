import { View, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
}

export default function SearchBar({ value, onChangeText, onFilterPress }: SearchBarProps) {
  return (
    <View className="flex-row items-center gap-3 mb-6">
      <View className="flex-1 flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-full h-12 px-4 shadow-sm">
        <Ionicons name="search-outline" size={20} color="#64748B" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search for anything..."
          placeholderTextColor="#94A3B8"
          className="flex-1 ml-2 text-base text-slate-900 dark:text-white font-medium h-full"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
             <Ionicons name="close-circle" size={20} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity 
        onPress={onFilterPress}
        className="w-12 h-12 bg-slate-900 dark:bg-white rounded-full items-center justify-center shadow-lg shadow-slate-200 dark:shadow-none active:scale-95 transition-transform"
      >
        <Ionicons name="options-outline" size={20} className="text-white dark:text-slate-900" />
      </TouchableOpacity>
    </View>
  );
}
