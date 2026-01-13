import { sslCommerzService } from "./apiService";

interface PaymentDetails {
  totalAmount: number;
  cartItems: any[];
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface SSLCommerzInitiationResult {
  success: boolean;
  paymentUrl?: string;
  sessionId?: string;
  error?: string;
}

export const initiateSSLCommerzPayment = async ({
  totalAmount,
  cartItems,
  customerInfo,
}: PaymentDetails): Promise<SSLCommerzInitiationResult> => {
  try {
    // Sanitize input data to prevent injection attacks
    const sanitizedCustomerInfo = {
      firstName: customerInfo.firstName.trim().substring(0, 50),
      lastName: customerInfo.lastName.trim().substring(0, 50),
      email: customerInfo.email.trim().substring(0, 100),
      phone: customerInfo.phone.trim().substring(0, 20),
      address: customerInfo.address.trim().substring(0, 200),
      city: customerInfo.city.trim().substring(0, 50),
      state: customerInfo.state.trim().substring(0, 50),
      zipCode: customerInfo.zipCode.trim().substring(0, 20),
      country: customerInfo.country.trim().substring(0, 50),
    };

    // Prepare payment data for SSLCommerz
    const paymentData = {
      total_amount: parseFloat(totalAmount.toFixed(2)), // Ensure correct decimal format
      currency: "BDT",
      tran_id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // More unique transaction ID
      success_url: "myapp://sslcommerz-success",
      fail_url: "myapp://sslcommerz-fail",
      cancel_url: "myapp://sslcommerz-cancel",
      ipn_url: "https://yourdomain.com/ipn",
      shipping_method: "Courier",
      num_of_item: cartItems.length,
      product_name: cartItems.slice(0, 10).map((item: any) => item.name.substring(0, 100)).join(","), // Limit items and length
      product_category: "General",
      product_profile: "general",
      cus_name: `${sanitizedCustomerInfo.firstName} ${sanitizedCustomerInfo.lastName}`.substring(0, 100),
      ship_name: `${sanitizedCustomerInfo.firstName} ${sanitizedCustomerInfo.lastName}`.substring(0, 100),
      cus_email: sanitizedCustomerInfo.email,
      cus_phone: sanitizedCustomerInfo.phone,
      cus_add1: sanitizedCustomerInfo.address,
      cus_city: sanitizedCustomerInfo.city,
      cus_state: sanitizedCustomerInfo.state,
      cus_postcode: sanitizedCustomerInfo.zipCode,
      cus_country: sanitizedCustomerInfo.country,
      shipping_name: `${sanitizedCustomerInfo.firstName} ${sanitizedCustomerInfo.lastName}`.substring(0, 100),
      shipping_add1: sanitizedCustomerInfo.address,
      shipping_city: sanitizedCustomerInfo.city,
      shipping_state: sanitizedCustomerInfo.state,
      shipping_postcode: sanitizedCustomerInfo.zipCode,
      shipping_country: sanitizedCustomerInfo.country,
      ship_add1: sanitizedCustomerInfo.address,
      ship_city: sanitizedCustomerInfo.city,
      ship_state: sanitizedCustomerInfo.state,
      ship_postcode: sanitizedCustomerInfo.zipCode,
      ship_country: sanitizedCustomerInfo.country,
    };

    // Initiate payment with SSLCommerz
    const response = await sslCommerzService.initiatePayment(paymentData);

    if (response.status === "FAILED") {
      return {
        success: false,
        error: response.failedreason || "Payment initiation failed",
      };
    }

    // Validate response before returning
    if (!response.sessionkey && !response.redirectGatewayURL) {
      return {
        success: false,
        error: "Invalid response from payment gateway",
      };
    }

    return {
      success: true,
      paymentUrl: response.redirectGatewayURL || response.sessionkey,
      sessionId: response.sessionkey,
    };
  } catch (error: any) {
    console.error("SSLCommerz payment initiation error:", error);
    return {
      success: false,
      error: error.message || "Failed to initiate payment",
    };
  }
};
