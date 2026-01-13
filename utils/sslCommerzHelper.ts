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
    // Prepare payment data for SSLCommerz
    const paymentData = {
      total_amount: totalAmount,
      currency: "BDT",
      tran_id: `order_${Date.now()}`, // Unique transaction ID
      success_url: "https://yourdomain.com/success",
      fail_url: "https://yourdomain.com/fail",
      cancel_url: "https://yourdomain.com/cancel",
      ipn_url: "https://yourdomain.com/ipn",
      shipping_method: "Courier",
      num_of_item: cartItems.length,
      product_name: cartItems.map((item: any) => item.name).join(","),
      product_category: "General",
      product_profile: "general",
      cus_name: `${customerInfo.firstName} ${customerInfo.lastName}`,
      cus_email: customerInfo.email,
      cus_phone: customerInfo.phone,
      cus_add1: customerInfo.address,
      cus_city: customerInfo.city,
      cus_postcode: customerInfo.zipCode,
      cus_country: customerInfo.country,
    };

    // Initiate payment with SSLCommerz
    const response = await sslCommerzService.initiatePayment(paymentData);

    if (response.status === "FAILED") {
      return {
        success: false,
        error: response.failedreason || "Payment initiation failed",
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
