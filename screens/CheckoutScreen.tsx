import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { CartItem } from "../store/types";
import { RootStackParamList } from "../navigation/types";
import { WebView, WebViewNavigation } from 'react-native-webview';
import { initiateSSLCommerzPayment } from "../utils/sslCommerzHelper";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
}

const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const cart = useSelector((state: any) => state.cart.cart);
  
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentWebView, setShowPaymentWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  // Calculate total amount
  const calculateTotal = () => {
    return cart.reduce(
      (total: number, item: CartItem) => total + item.price * item.quantity, 0
    );
  };

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateCardNumber = (cardNumber: string) => {
    const cardRegex = /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/;
    return cardRegex.test(cardNumber.replace(/\s/g, ""));
  };

  const validateExpiryDate = (expiryDate: string) => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!expiryRegex.test(expiryDate)) return false;

    const [month, year] = expiryDate.split(/\/|\s+/);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    const expYear = parseInt(year, 10);
    const expMonth = parseInt(month, 10);

    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;

    return true;
  };

  const validateCVV = (cvv: string) => {
    const cvvRegex = /^\d{3,4}$/;
    return cvvRegex.test(cvv);
  };

  const validateZipCode = (zipCode: string) => {
    const zipRegex = /^[A-Za-z0-9\s\-]{3,10}$/;
    return zipRegex.test(zipCode);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate personal information
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // Validate address information
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (!validateZipCode(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    // Validate payment information
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required";
    } else if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = "Please enter a valid card number (16 digits)";
    }

    if (!formData.cardHolderName.trim()) {
      newErrors.cardHolderName = "Card holder name is required";
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!validateExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (!validateCVV(formData.cvv)) {
      newErrors.cvv = "Please enter a valid CVV (3-4 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    // Format card number as user types
    if (field === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
      setFormData({ ...formData, [field]: formattedValue });
      
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    } 
    // Format expiry date as user types
    else if (field === "expiryDate") {
      let formattedValue = value.replace(/\D/g, ""); // Remove non-digit characters
      
      if (formattedValue.length > 2) {
        formattedValue = formattedValue.substring(0, 2) + "/" + formattedValue.substring(2, 4);
      }
      
      setFormData({ ...formData, [field]: formattedValue });
      
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    }
    // Format CVV as user types
    else if (field === "cvv") {
      const numericValue = value.replace(/\D/g, "").substring(0, 4);
      setFormData({ ...formData, [field]: numericValue });
      
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    }
    // Format ZIP code as user types
    else if (field === "zipCode") {
      const alphanumericValue = value.replace(/[^A-Za-z0-9\s\-]/g, "");
      setFormData({ ...formData, [field]: alphanumericValue });
      
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    }
    // For other fields
    else {
      setFormData({ ...formData, [field]: value });
      
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors({ ...errors, [field]: undefined });
      }
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fix all errors before proceeding",
        visibilityTime: 3000,
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Initiate SSLCommerz payment
      const result = await initiateSSLCommerzPayment({
        totalAmount: calculateTotal(),
        cartItems: cart,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        }
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Payment initiation failed');
      }

      // Set the payment URL and show the webview
      setPaymentUrl(result.paymentUrl || '');
      setShowPaymentWebView(true);
    } catch (error: any) {
      console.error('SSLCommerz payment error:', error);
      Toast.show({
        type: "error",
        text1: "Payment Failed",
        text2: error.message || "An error occurred during payment processing",
        visibilityTime: 3000,
      });
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    Toast.show({
      type: "success",
      text1: "Payment Successful!",
      text2: "Your order has been placed successfully!",
      visibilityTime: 3000,
    });

    // Navigate back to product listing
    navigation.navigate("ProductListing");
    setShowPaymentWebView(false);
    setIsProcessing(false);
  };

  const handlePaymentFailure = () => {
    Toast.show({
      type: "error",
      text1: "Payment Failed",
      text2: "Your payment was not completed successfully",
      visibilityTime: 3000,
    });
    setShowPaymentWebView(false);
    setIsProcessing(false);
  };

  const handlePaymentCancel = () => {
    Toast.show({
      type: "info",
      text1: "Payment Cancelled",
      text2: "You cancelled the payment process",
      visibilityTime: 3000,
    });
    setShowPaymentWebView(false);
    setIsProcessing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <ScrollView 
        className="flex-1 px-4 py-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full items-center justify-center mb-4"
          >
            <Feather name="chevron-left" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text className="text-2xl font-outfit-black text-slate-900 dark:text-white">
            Checkout
          </Text>
          <Text className="text-lg font-outfit-bold text-slate-500">
            Complete your purchase
          </Text>
        </View>

        {/* Order Summary */}
        <View className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 mb-6">
          <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white mb-3">
            Order Summary
          </Text>
          {cart.map((item: CartItem) => (
            <View key={item.id} className="flex-row justify-between py-2 border-b border-slate-100 dark:border-slate-700">
              <Text className="text-slate-600 dark:text-slate-300">
                {item.name} x{item.quantity}
              </Text>
              <Text className="text-slate-900 dark:text-white font-outfit-bold">
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View className="flex-row justify-between pt-3 mt-2">
            <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white">
              Total:
            </Text>
            <Text className="text-xl font-outfit-black text-indigo-600 dark:text-indigo-400">
              ${calculateTotal().toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Personal Information */}
        <View className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 mb-6">
          <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white mb-4">
            Personal Information
          </Text>
          
          <View className="grid grid-cols-2 gap-4 mb-4">
            <View>
              <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
                First Name *
              </Text>
              <TextInput
                value={formData.firstName}
                onChangeText={(value) => handleChange("firstName", value)}
                placeholder="John"
                className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                  errors.firstName ? "border-red-500" : "border-slate-200 dark:border-slate-600"
                } text-slate-900 dark:text-white`}
              />
              {errors.firstName && (
                <Text className="text-red-500 text-xs mt-1">{errors.firstName}</Text>
              )}
            </View>
            
            <View>
              <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
                Last Name *
              </Text>
              <TextInput
                value={formData.lastName}
                onChangeText={(value) => handleChange("lastName", value)}
                placeholder="Doe"
                className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                  errors.lastName ? "border-red-500" : "border-slate-200 dark:border-slate-600"
                } text-slate-900 dark:text-white`}
              />
              {errors.lastName && (
                <Text className="text-red-500 text-xs mt-1">{errors.lastName}</Text>
              )}
            </View>
          </View>
          
          <View className="mb-4">
            <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
              Email Address *
            </Text>
            <TextInput
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              placeholder="john@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                errors.email ? "border-red-500" : "border-slate-200 dark:border-slate-600"
              } text-slate-900 dark:text-white`}
            />
            {errors.email && (
              <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
            )}
          </View>
          
          <View>
            <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number *
            </Text>
            <TextInput
              value={formData.phone}
              onChangeText={(value) => handleChange("phone", value)}
              placeholder="+1 (555) 123-4567"
              keyboardType="phone-pad"
              className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                errors.phone ? "border-red-500" : "border-slate-200 dark:border-slate-600"
              } text-slate-900 dark:text-white`}
            />
            {errors.phone && (
              <Text className="text-red-500 text-xs mt-1">{errors.phone}</Text>
            )}
          </View>
        </View>

        {/* Shipping Address */}
        <View className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 mb-6">
          <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white mb-4">
            Shipping Address
          </Text>
          
          <View className="mb-4">
            <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
              Address *
            </Text>
            <TextInput
              value={formData.address}
              onChangeText={(value) => handleChange("address", value)}
              placeholder="123 Main St"
              className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                errors.address ? "border-red-500" : "border-slate-200 dark:border-slate-600"
              } text-slate-900 dark:text-white`}
            />
            {errors.address && (
              <Text className="text-red-500 text-xs mt-1">{errors.address}</Text>
            )}
          </View>
          
          <View className="grid grid-cols-2 gap-4 mb-4">
            <View>
              <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
                City *
              </Text>
              <TextInput
                value={formData.city}
                onChangeText={(value) => handleChange("city", value)}
                placeholder="New York"
                className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                  errors.city ? "border-red-500" : "border-slate-200 dark:border-slate-600"
                } text-slate-900 dark:text-white`}
              />
              {errors.city && (
                <Text className="text-red-500 text-xs mt-1">{errors.city}</Text>
              )}
            </View>
            
            <View>
              <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
                State *
              </Text>
              <TextInput
                value={formData.state}
                onChangeText={(value) => handleChange("state", value)}
                placeholder="NY"
                className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                  errors.state ? "border-red-500" : "border-slate-200 dark:border-slate-600"
                } text-slate-900 dark:text-white`}
              />
              {errors.state && (
                <Text className="text-red-500 text-xs mt-1">{errors.state}</Text>
              )}
            </View>
          </View>
          
          <View className="grid grid-cols-2 gap-4 mb-4">
            <View>
              <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
                ZIP Code *
              </Text>
              <TextInput
                value={formData.zipCode}
                onChangeText={(value) => handleChange("zipCode", value)}
                placeholder="10001"
                className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                  errors.zipCode ? "border-red-500" : "border-slate-200 dark:border-slate-600"
                } text-slate-900 dark:text-white`}
              />
              {errors.zipCode && (
                <Text className="text-red-500 text-xs mt-1">{errors.zipCode}</Text>
              )}
            </View>
            
            <View>
              <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
                Country *
              </Text>
              <TextInput
                value={formData.country}
                onChangeText={(value) => handleChange("country", value)}
                placeholder="USA"
                className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                  errors.country ? "border-red-500" : "border-slate-200 dark:border-slate-600"
                } text-slate-900 dark:text-white`}
              />
              {errors.country && (
                <Text className="text-red-500 text-xs mt-1">{errors.country}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Payment Information */}
        <View className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 mb-6">
          <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white mb-4">
            Payment Information
          </Text>
          
          <View className="mb-4">
            <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
              Card Number *
            </Text>
            <TextInput
              value={formData.cardNumber}
              onChangeText={(value) => handleChange("cardNumber", value)}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              maxLength={19}
              className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                errors.cardNumber ? "border-red-500" : "border-slate-200 dark:border-slate-600"
              } text-slate-900 dark:text-white`}
            />
            {errors.cardNumber && (
              <Text className="text-red-500 text-xs mt-1">{errors.cardNumber}</Text>
            )}
          </View>
          
          <View className="mb-4">
            <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
              Cardholder Name *
            </Text>
            <TextInput
              value={formData.cardHolderName}
              onChangeText={(value) => handleChange("cardHolderName", value)}
              placeholder="John Doe"
              className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                errors.cardHolderName ? "border-red-500" : "border-slate-200 dark:border-slate-600"
              } text-slate-900 dark:text-white`}
            />
            {errors.cardHolderName && (
              <Text className="text-red-500 text-xs mt-1">{errors.cardHolderName}</Text>
            )}
          </View>
          
          <View className="grid grid-cols-2 gap-4 mb-4">
            <View>
              <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
                Expiry Date *
              </Text>
              <TextInput
                value={formData.expiryDate}
                onChangeText={(value) => handleChange("expiryDate", value)}
                placeholder="MM/YY"
                keyboardType="numeric"
                maxLength={5}
                className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                  errors.expiryDate ? "border-red-500" : "border-slate-200 dark:border-slate-600"
                } text-slate-900 dark:text-white`}
              />
              {errors.expiryDate && (
                <Text className="text-red-500 text-xs mt-1">{errors.expiryDate}</Text>
              )}
            </View>
            
            <View>
              <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
                CVV *
              </Text>
              <TextInput
                value={formData.cvv}
                onChangeText={(value) => handleChange("cvv", value)}
                placeholder="123"
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
                className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                  errors.cvv ? "border-red-500" : "border-slate-200 dark:border-slate-600"
                } text-slate-900 dark:text-white`}
              />
              {errors.cvv && (
                <Text className="text-red-500 text-xs mt-1">{errors.cvv}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity
          className="bg-indigo-600 h-14 rounded-xl items-center justify-center mt-4"
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <View className="flex-row items-center">
              <Feather name="loader" size={20} color="#FFFFFF" className="animate-spin" />
              <Text className="text-white font-outfit-bold text-lg ml-2">
                Processing...
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <Text className="text-white font-outfit-bold text-lg">
                Place Order - ${calculateTotal().toFixed(2)}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
      
      {/* SSLCommerz Payment WebView */}
      {showPaymentWebView && (
        <WebView
          source={{ uri: paymentUrl }}
          className="absolute top-0 left-0 w-full h-full bg-white z-10"
          onNavigationStateChange={(navState: WebViewNavigation) => {
            // Handle success, fail, and cancel redirects
            if (navState.url.includes('success')) {
              handlePaymentSuccess();
            } else if (navState.url.includes('fail')) {
              handlePaymentFailure();
            } else if (navState.url.includes('cancel')) {
              handlePaymentCancel();
            }
          }}
          onError={() => {
            handlePaymentFailure();
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default CheckoutScreen;