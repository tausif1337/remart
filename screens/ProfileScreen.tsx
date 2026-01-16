import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { logout as logoutAction } from '../store/authSlice';
import { RootState } from '../store';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebaseServices';
import Toast from 'react-native-toast-message';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              dispatch(logoutAction());
              Toast.show({
                type: 'info',
                text1: 'Signed Out',
                text2: 'You have been successfully signed out',
              });
            } catch (error) {
              console.error('Sign out error:', error);
            }
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-950">
      <ScrollView className="flex-1 px-6">
        <View className="items-center mt-12 mb-8">
          <View className="w-32 h-32 bg-indigo-100 dark:bg-indigo-900/30 rounded-full items-center justify-center mb-4 border-4 border-white dark:border-slate-800">
            <Feather name="user" size={64} color="#4F46E5" />
          </View>
          <Text className="text-2xl font-outfit-bold text-slate-900 dark:text-white">
            {user?.displayName || 'User'}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 font-outfit-regular">
            {user?.email || 'user@example.com'}
          </Text>
        </View>

        <View className="bg-white dark:bg-slate-900 rounded-3xl p-2 mb-8 shadow-sm">
          <ProfileMenuItem 
            icon="shopping-bag" 
            title="My Orders" 
            onPress={() => navigation.navigate('OrderHistory')}
          />
          <ProfileMenuItem 
            icon="heart" 
            title="Wishlist" 
            onPress={() => navigation.navigate('Wishlist')}
          />
          <ProfileMenuItem icon="map-pin" title="Shipping Address" />
          <ProfileMenuItem icon="credit-card" title="Payment Methods" />
          <ProfileMenuItem icon="settings" title="Settings" />
        </View>

        <TouchableOpacity 
          onPress={handleLogout}
          className="flex-row items-center justify-center p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl mb-12"
        >
          <Feather name="log-out" size={20} color="#EF4444" />
          <Text className="text-red-500 font-outfit-bold ml-2">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const ProfileMenuItem = ({ icon, title, onPress }: { icon: any, title: string, onPress?: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    className="flex-row items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-0"
  >
    <View className="flex-row items-center">
      <View className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl items-center justify-center mr-4">
        <Feather name={icon} size={20} color="#64748B" />
      </View>
      <Text className="text-slate-700 dark:text-slate-200 font-outfit-medium text-base">{title}</Text>
    </View>
    <Feather name="chevron-right" size={20} color="#CBD5E1" />
  </TouchableOpacity>
);

export default ProfileScreen;
