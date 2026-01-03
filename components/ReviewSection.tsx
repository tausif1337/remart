import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Review } from '../store/useStore';

interface ReviewSectionProps {
  reviews: Review[];
}

export default function ReviewSection({ reviews }: ReviewSectionProps) {
  const [filter, setFilter] = useState<'All' | 'Highest' | 'Lowest'>('All');

  const sortedReviews = [...reviews].sort((a, b) => {
    if (filter === 'Highest') return b.rating - a.rating;
    if (filter === 'Lowest') return a.rating - b.rating;
    return 0;
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const renderStars = (rating: number) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((s) => (
          <Feather
            key={s}
            name="star"
            size={14}
            color={s <= rating ? '#F59E0B' : '#E2E8F0'}
          />
        ))}
      </View>
    );
  };

  return (
    <View className="mt-8 px-6">
      <View className="flex-row justify-between items-end mb-6">
        <View>
          <Text className="text-2xl font-outfit-bold text-slate-900 dark:text-white mb-1">Reviews</Text>
          <View className="flex-row items-center">
            <Text className="text-3xl font-outfit-black text-slate-900 dark:text-white mr-2">{averageRating}</Text>
            <View>
              {renderStars(Math.round(Number(averageRating)))}
              <Text className="text-xs font-outfit-medium text-slate-500 mt-1">{reviews.length} reviews</Text>
            </View>
          </View>
        </View>

        <View className="flex-row bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {['All', 'Highest', 'Lowest'].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f as any)}
              className={`px-3 py-1.5 rounded-md ${filter === f ? 'bg-white dark:bg-slate-700' : ''}`}
            >
              <Text className={`text-xs font-outfit-bold ${filter === f ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {sortedReviews.length > 0 ? (
        sortedReviews.map((review) => (
          <View key={review.id} className="mb-6 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-row items-center">
                <Image source={{ uri: review.userImage }} className="w-10 h-10 rounded-full mr-3" />
                <View>
                  <Text className="text-sm font-outfit-bold text-slate-900 dark:text-white">{review.userName}</Text>
                  <Text className="text-[10px] font-outfit-medium text-slate-400 uppercase">{review.date}</Text>
                </View>
              </View>
              {renderStars(review.rating)}
            </View>
            <Text className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-outfit-regular">
              {review.comment}
            </Text>

            <View className="flex-row mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 items-center">
              <TouchableOpacity className="flex-row items-center mr-4">
                <Feather name="thumbs-up" size={12} color="#64748B" />
                <Text className="text-[10px] font-outfit-bold text-slate-500 ml-1">Helpful (12)</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center">
                <Feather name="message-circle" size={12} color="#64748B" />
                <Text className="text-[10px] font-outfit-bold text-slate-500 ml-1">Reply</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <View className="py-12 items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <Feather name="message-square" size={32} color="#94A3B8" />
          <Text className="text-slate-500 font-outfit-medium mt-2">No reviews yet for this product</Text>
        </View>
      )}
    </View>
  );
}
