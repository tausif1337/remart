import { View, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
}

export default function SearchBar({ value, onChangeText, onFilterPress }: SearchBarProps) {
  return (
    <View className="flex-row items-center gap-3 mb-4">
      <View className="flex-1 flex-row items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl h-14 px-4 shadow-sm">
        <MaterialIcons name="search" size={24} color="#94A3B8" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search products..."
          placeholderTextColor="#94A3B8"
          className="flex-1 ml-3 text-base text-slate-800 dark:text-white font-medium h-full"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
             <MaterialIcons name="close" size={20} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity 
        onPress={onFilterPress}
        className="w-14 h-14 bg-indigo-600 rounded-2xl items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none active:bg-indigo-700"
      >
        <MaterialIcons name="tune" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
