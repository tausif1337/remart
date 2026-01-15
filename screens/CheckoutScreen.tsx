import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { CartItem } from "../store/types";
import { clearCart } from "../store/cartSlice";
import { RootStackParamList } from "../navigation/types";
import { WebView, WebViewNavigation } from "react-native-webview";
import { apiService } from "../utils/apiService";

const SUCCESS_URL = "https://remart-app.com/payment-success";
const FAIL_URL = "https://remart-app.com/payment-fail";
const CANCEL_URL = "https://remart-app.com/payment-cancel";

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

// Validation functions
const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

const validateZipCode = (zipCode: string) => {
  const zipRegex = /^[A-Za-z0-9\s\-]{3,10}$/;
  return zipRegex.test(zipCode);
};

const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const cart = useSelector((state: any) => state.cart.cart);

  const [formData, setFormData] = useState<FormData>({
    firstName: "Md. Tausif",
    lastName: "Hossain",
    email: "tausif1337@gmail.com",
    phone: "01748181448",
    address: "53/A, Upazila Road, South Sastapur, Fatullah",
    city: "Narayanganj",
    state: "Narayanganj",
    zipCode: "1420",
    country: "Bangladesh",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [currentInvoice, setCurrentInvoice] = useState<string | null>(null);

  // Memoized total calculation
  const totalAmount = useMemo(() => {
    return cart.reduce(
      (total: number, item: CartItem) => total + item.price * item.quantity,
      0
    );
  }, [cart]);

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
  }, [formData]);

  const handleChange = useCallback((field: keyof FormData, value: string) => {
    // Format address as user types
    if (field === "address") {
      // Capitalize the first letter of each word and normalize spaces
      const formattedValue = value.replace(/\b\w/g, (l) => l.toUpperCase());
      setFormData((prev) => ({ ...prev, [field]: formattedValue }));

      // Clear error when user starts typing
      setErrors((prev) => {
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
      setFormData((prev) => ({ ...prev, [field]: alphanumericValue }));

      // Clear error when user starts typing
      setErrors((prev) => {
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
      setFormData((prev) => ({ ...prev, [field]: phoneValue }));

      // Clear error when user starts typing
      setErrors((prev) => {
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
      const capitalizedValue = value.replace(/\b\w/g, (l) => l.toUpperCase());
      setFormData((prev) => ({ ...prev, [field]: capitalizedValue }));

      // Clear error when user starts typing
      setErrors((prev) => {
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
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      setErrors((prev) => {
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
      return;
    }

    const invoiceNumber = `INV-${Date.now()}`;
    setCurrentInvoice(invoiceNumber);
    setIsProcessing(true);
    console.log("Initiating payment process for invoice:", invoiceNumber);

    try {
      // Show processing toast
      Toast.show({
        type: "info",
        text1: "Processing Order",
        text2: "Generating payment link...",
        visibilityTime: 2000,
      });

      // Process payment through SSLCommerz API
      const response = await apiService.initiatePayment({
        total_amount: Number(totalAmount.toFixed(2)),
        currency: "BDT",
        tran_id: invoiceNumber,
        success_url: SUCCESS_URL,
        fail_url: FAIL_URL,
        cancel_url: CANCEL_URL,
        cus_name: `${formData.firstName} ${formData.lastName}`,
        cus_email: formData.email,
        cus_add1: formData.address,
        cus_city: formData.city,
        cus_state: formData.state,
        cus_postcode: formData.zipCode,
        cus_country: formData.country,
        cus_phone: formData.phone,
        shipping_method: "NO",
        product_name: cart.map((item: CartItem) => item.name).join(", "),
        product_category: "General",
        product_profile: "general",
      });

      console.log("Payment initiation response received:", response);

      if (response.status === "SUCCESS" && response.GatewayPageURL) {
        console.log(
          "Payment URL generated successfully:",
          response.GatewayPageURL
        );
        setPaymentUrl(response.GatewayPageURL);
        setShowWebView(true);
      } else {
        console.warn(
          "Payment initiation failed with status:",
          response.status,
          "Message:",
          response.failedreason
        );
        Toast.show({
          type: "error",
          text1: "Payment Initiation Failed",
          text2:
            response.failedreason ||
            "Could not create payment link. Please try again.",
          visibilityTime: 4000,
        });
      }
    } catch (error: any) {
      console.error("Payment processing error:", error);
      Toast.show({
        type: "error",
        text1: "Payment Error",
        text2: "An unexpected error occurred. Please try again.",
        visibilityTime: 4000,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [validateForm, formData, cart, totalAmount, navigation]);

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      const { url } = navState;
      console.log("WebView navigating to:", url);

      if (url.startsWith(SUCCESS_URL)) {
        console.log("Payment success detected!");
        setShowWebView(false);
        setPaymentUrl(null);

        Toast.show({
          type: "success",
          text1: "Payment Successful!",
          text2: `Order: ${currentInvoice}`,
          visibilityTime: 3000,
        });

        // Clear the cart on successful payment
        dispatch(clearCart());
        console.log("Cart cleared after successful payment");

        // Prepare order details for confirmation screen
        const orderDetails = {
          orderId: currentInvoice || "N/A",
          transactionId: "SSL-" + Date.now(),
          amount: totalAmount,
          customerName: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          items: cart.map((item: CartItem) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          orderDate: new Date().toISOString(),
        };

        navigation.navigate("OrderConfirmation", { orderDetails });
      } else if (url.startsWith(CANCEL_URL)) {
        console.log("Payment cancel detected");
        setShowWebView(false);
        setPaymentUrl(null);
        Toast.show({
          type: "info",
          text1: "Payment Canceled",
          text2:
            "You have canceled the payment process. Your cart items are safe.",
          visibilityTime: 4000,
        });
      } else if (url.startsWith(FAIL_URL)) {
        console.log("Payment fail detected");
        setShowWebView(false);
        setPaymentUrl(null);
        Toast.show({
          type: "error",
          text1: "Payment Failed",
          text2:
            "The payment transaction failed or was declined. Please try again.",
          visibilityTime: 4000,
        });
      }
    },
    [
      currentInvoice,
      totalAmount,
      formData,
      cart,
      navigation,
      dispatch,
      setShowWebView,
      setPaymentUrl,
    ]
  );

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
                    Qty: {item.quantity} × ৳{item.price.toFixed(2)}
                  </Text>
                </View>
                <Text className="text-slate-900 dark:text-white font-outfit-bold">
                  ৳{(item.price * item.quantity).toFixed(2)}
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
              ৳{totalAmount.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700"
            onPress={() => navigation.navigate("Cart")}
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

        {/* Payment Method Selection */}
        <View className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4 mb-6">
          <Text className="text-lg font-outfit-bold text-slate-900 dark:text-white mb-4">
            Payment Method
          </Text>
          <View className="flex-row items-center p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl">
            <View className="w-12 h-12 bg-white dark:bg-slate-700 rounded-full items-center justify-center mr-4 shadow-sm">
              <Feather name="credit-card" size={24} color="#4F46E5" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-outfit-bold text-slate-900 dark:text-white">
                SSLCommerz
              </Text>
              <Text className="text-sm text-slate-600 dark:text-slate-400">
                Secure Hosted Payment
              </Text>
            </View>
            <View className="bg-indigo-600 rounded-full p-1">
              <Feather name="check" size={14} color="#FFFFFF" />
            </View>
          </View>
          <View className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <Text className="text-green-700 dark:text-green-300 text-sm">
              <Feather name="shield" size={14} /> Your payment is encrypted and
              processed securely by SSLCommerz.
            </Text>
          </View>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity
          className={`h-14 rounded-xl items-center justify-center mt-4 ${
            cart.length > 0 && !isProcessing ? "bg-indigo-600" : "bg-gray-400"
          }`}
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
                {cart.length > 0
                  ? `Place Order - ৳${totalAmount.toFixed(2)}`
                  : "Cart is Empty"}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* SSLCommerz Payment Modal */}
      <Modal
        visible={showWebView}
        animationType="slide"
        onRequestClose={() => setShowWebView(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-slate-100">
            <Text className="text-lg font-outfit-bold text-slate-900">
              SSLCommerz Payment
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowWebView(false);
                setPaymentUrl(null);
                Toast.show({
                  type: "info",
                  text1: "Payment Closed",
                  text2: "Payment window was closed. Your cart remains intact.",
                  visibilityTime: 4000,
                });
              }}
            >
              <Feather name="x" size={24} color="#1E293B" />
            </TouchableOpacity>
          </View>
          {paymentUrl ? (
            <WebView
              source={{ uri: paymentUrl }}
              onNavigationStateChange={handleNavigationStateChange}
              startInLoadingState={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              renderLoading={() => (
                <View className="absolute inset-0 items-center justify-center bg-white">
                  <ActivityIndicator size="large" color="#4F46E5" />
                </View>
              )}
            />
          ) : null}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default CheckoutScreen;
