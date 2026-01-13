import React, { useState, useCallback, useMemo } from "react";
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
import { WebView, WebViewNavigation } from "react-native-webview";
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
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentWebView, setShowPaymentWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [isCartEmpty, setIsCartEmpty] = useState(false);

  // Memoized total calculation
  const totalAmount = useMemo(() => {
    return cart.reduce(
      (total: number, item: CartItem) => total + item.price * item.quantity,
      0
    );
  }, [cart]);

  // Calculate total amount
  const calculateTotal = () => {
    return totalAmount;
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

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validate personal information
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
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
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Please enter a complete address";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    } else if (formData.city.trim().length < 2) {
      newErrors.city = "City must be at least 2 characters";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    } else if (formData.state.trim().length < 2) {
      newErrors.state = "State must be at least 2 characters";
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (!validateZipCode(formData.zipCode)) {
      newErrors.zipCode = "Please enter a valid ZIP code";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    } else if (formData.country.trim().length < 2) {
      newErrors.country = "Country must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateEmail, validatePhone, validateZipCode]);

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    // Format address as user types
    if (field === "address") {
      // Capitalize the first letter of each sentence and normalize spaces
      const formattedValue = value
        .split('. ')  // Split by period followed by space
        .map(sentence => 
          sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase()
        )
        .join('. ');
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
        
      // Clear error when user starts typing
      setErrors(prev => {
        if (prev[field]) {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        }
        return prev;
      });
    }
    // Format ZIP code as user types
    else if (field === "zipCode") {
      const alphanumericValue = value.replace(/[^A-Za-z0-9\s\-]/g, "");
      setFormData(prev => ({ ...prev, [field]: alphanumericValue }));
        
      // Clear error when user starts typing
      setErrors(prev => {
        if (prev[field]) {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        }
        return prev;
      });
    }
    // Format phone number as user types
    else if (field === "phone") {
      const phoneValue = value.replace(/[^+\d\s\-\(\)]/g, "");
      setFormData(prev => ({ ...prev, [field]: phoneValue }));
        
      // Clear error when user starts typing
      setErrors(prev => {
        if (prev[field]) {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        }
        return prev;
      });
    }
    // Format city and state to capitalize first letter of each word
    else if (field === "city" || field === "state" || field === "country") {
      const capitalizedValue = value.replace(/\b\w/g, l => l.toUpperCase());
      setFormData(prev => ({ ...prev, [field]: capitalizedValue }));
      
      // Clear error when user starts typing
      setErrors(prev => {
        if (prev[field]) {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        }
        return prev;
      });
    }
    // For other fields
    else {
      setFormData(prev => ({ ...prev, [field]: value }));
        
      // Clear error when user starts typing
      setErrors(prev => {
        if (prev[field]) {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        }
        return prev;
      });
    }
  }, []);

  const handlePayment = useCallback(async () => {
    if (!validateForm()) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please fix all highlighted fields before proceeding",
        visibilityTime: 3000,
      });
      // Scroll to first error field
      const firstErrorField = Object.keys(errors).find(key => errors[key as keyof FormErrors]);
      if (firstErrorField) {
        // We could implement scrolling to the error field if needed
      }
      return;
    }

    setIsProcessing(true);

    try {
      // Show processing toast
      Toast.show({
        type: "info",
        text1: "Processing Payment",
        text2: "Please wait while we prepare your payment...",
        visibilityTime: 2000,
      });

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
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      });

      if (!result.success) {
        throw new Error(result.error || "Payment initiation failed");
      }

      // Set the payment URL and show the webview
      setPaymentUrl(result.paymentUrl || "");
      setShowPaymentWebView(true);
    } catch (error: any) {
      console.error("SSLCommerz payment error:", error);
      Toast.show({
        type: "error",
        text1: "Payment Processing Failed",
        text2: error.message || "An error occurred during payment processing. Please try again.",
        visibilityTime: 4000,
      });
      setIsProcessing(false);
    }
  }, [validateForm, formData, cart, calculateTotal, errors]);

  const handlePaymentSuccess = useCallback(() => {
    Toast.show({
      type: "success",
      text1: "Payment Successful!",
      text2: "Your order has been placed successfully!",
      visibilityTime: 3000,
    });

    // Clear cart after successful payment
    // In a real app, you would dispatch an action to clear the cart
    // dispatch(clearCart());
    
    // Navigate to order confirmation or product listing
    navigation.navigate("ProductListing");
    setShowPaymentWebView(false);
    setIsProcessing(false);
  }, [navigation]);

  const handlePaymentFailure = useCallback(() => {
    Toast.show({
      type: "error",
      text1: "Payment Failed",
      text2: "Your payment was not completed successfully. Please try again.",
      visibilityTime: 4000,
    });
    setShowPaymentWebView(false);
    setIsProcessing(false);
  }, []);

  const handlePaymentCancel = useCallback(() => {
    Toast.show({
      type: "info",
      text1: "Payment Cancelled",
      text2: "You cancelled the payment process. Your cart is still available.",
      visibilityTime: 3000,
    });
    setShowPaymentWebView(false);
    setIsProcessing(false);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <ScrollView
        className="flex-1 px-4 py-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full items-center justify-center mb-4"
          >
            <Feather name="chevron-left" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text className="text-2xl font-outfit-black text-slate-900 dark:text-white mb-1">
            Checkout
          </Text>
          <Text className="text-base font-outfit-regular text-slate-600 dark:text-slate-400">
            Complete your purchase
          </Text>
        </View>

        {/* Order Summary */}
        <View className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 mb-6">
          <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white mb-3">
            Order Summary
          </Text>
          {cart.length > 0 ? (
            cart.map((item: CartItem) => (
              <View
                key={item.id}
                className="flex-row justify-between py-2 border-b border-slate-100 dark:border-slate-700"
              >
                <View className="flex-1">
                  <Text className="text-slate-600 dark:text-slate-300 font-outfit-medium">
                    {item.name}
                  </Text>
                  <Text className="text-slate-500 dark:text-slate-400 text-xs">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </Text>
                </View>
                <Text className="text-slate-900 dark:text-white font-outfit-bold">
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-slate-500 dark:text-slate-400 text-center py-4">
              Your cart is empty
            </Text>
          )}
          <View className="flex-row justify-between pt-3 mt-2">
            <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white">
              Total:
            </Text>
            <Text className="text-xl font-outfit-black text-indigo-600 dark:text-indigo-400">
              ${totalAmount.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity 
            className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700"
            onPress={() => navigation.navigate('Cart')}
          >
            <Text className="text-indigo-600 dark:text-indigo-400 text-center font-outfit-medium">
              Edit Cart
            </Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 mb-6">
          <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white mb-4">
            Personal Information
          </Text>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
                First Name *
              </Text>
              <TextInput
                value={formData.firstName}
                onChangeText={(value) => handleChange("firstName", value)}
                placeholder="John"
                className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                  errors.firstName
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-600"
                } text-slate-900 dark:text-white`}
              />
              {errors.firstName && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.firstName}
                </Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
                Last Name *
              </Text>
              <TextInput
                value={formData.lastName}
                onChangeText={(value) => handleChange("lastName", value)}
                placeholder="Doe"
                className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                  errors.lastName
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-600"
                } text-slate-900 dark:text-white`}
              />
              {errors.lastName && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.lastName}
                </Text>
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
                errors.email
                  ? "border-red-500"
                  : "border-slate-200 dark:border-slate-600"
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
                errors.phone
                  ? "border-red-500"
                  : "border-slate-200 dark:border-slate-600"
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
                errors.address
                  ? "border-red-500"
                  : "border-slate-200 dark:border-slate-600"
              } text-slate-900 dark:text-white`}
            />
            {errors.address && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.address}
              </Text>
            )}
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
                City *
              </Text>
              <TextInput
                value={formData.city}
                onChangeText={(value) => handleChange("city", value)}
                placeholder="New York"
                className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                  errors.city
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-600"
                } text-slate-900 dark:text-white`}
              />
              {errors.city && (
                <Text className="text-red-500 text-xs mt-1">{errors.city}</Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
                State *
              </Text>
              <TextInput
                value={formData.state}
                onChangeText={(value) => handleChange("state", value)}
                placeholder="NY"
                className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                  errors.state
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-600"
                } text-slate-900 dark:text-white`}
              />
              {errors.state && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.state}
                </Text>
              )}
            </View>
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1">
              <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
                ZIP Code *
              </Text>
              <TextInput
                value={formData.zipCode}
                onChangeText={(value) => handleChange("zipCode", value)}
                placeholder="10001"
                className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                  errors.zipCode
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-600"
                } text-slate-900 dark:text-white`}
              />
              {errors.zipCode && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.zipCode}
                </Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-sm font-outfit-bold text-slate-700 dark:text-slate-300 mb-1">
                Country *
              </Text>
              <TextInput
                value={formData.country}
                onChangeText={(value) => handleChange("country", value)}
                placeholder="USA"
                className={`h-12 px-4 bg-slate-50 dark:bg-slate-700 rounded-lg border ${
                  errors.country
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-600"
                } text-slate-900 dark:text-white`}
              />
              {errors.country && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.country}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* SSLCommerz Payment Method Selection */}
        <View className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 mb-6">
          <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white mb-4">
            Payment Method
          </Text>
          <Text className="text-slate-600 dark:text-slate-300 mb-3">
            Select your preferred payment method through SSLCommerz.
            Available options include bKash, Nagad, credit/debit cards, and other mobile banking services.
          </Text>
          <View className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <Text className="text-blue-700 dark:text-blue-300 text-sm">
              <Feather name="info" size={14} className="inline" /> Note: Payment details will be securely handled by SSLCommerz after you tap "Place Order".
            </Text>
          </View>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity
          className={`h-14 rounded-xl items-center justify-center mt-4 ${cart.length > 0 && !isProcessing ? 'bg-indigo-600' : 'bg-gray-400'}`}
          onPress={handlePayment}
          disabled={isProcessing || cart.length === 0}
        >
          {isProcessing ? (
            <View className="flex-row items-center">
              <Feather
                name="loader"
                size={20}
                color="#FFFFFF"
                className="animate-spin"
              />
              <Text className="text-white font-outfit-bold text-lg ml-2">
                Processing Payment...
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              <Text className="text-white font-outfit-bold text-lg">
                {cart.length > 0 ? `Place Order - $${calculateTotal().toFixed(2)}` : 'Cart is Empty'}
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
            if (navState.url.includes("sslcommerz-success")) {
              handlePaymentSuccess();
            } else if (navState.url.includes("sslcommerz-fail")) {
              handlePaymentFailure();
            } else if (navState.url.includes("sslcommerz-cancel")) {
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
