import axios from "axios";
import {
  SSL_COMMERZ_STORE_ID,
  SSL_COMMERZ_STORE_PASSWORD,
  SSL_COMMERZ_SANDBOX,
} from "@env";

const SSL_COMMERZ_BASE_URL =
  SSL_COMMERZ_SANDBOX === "true"
    ? "https://sandbox.sslcommerz.com"
    : "https://securepay.sslcommerz.com";

interface SSLCommerzPaymentData {
  total_amount: number;
  currency: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url?: string;
  shipping_method: string;
  num_of_item: number;
  product_name: string;
  product_category: string;
  product_profile: string;
  cus_name: string;
  cus_email: string;
  cus_phone: string;
  cus_add1: string;
  cus_city: string;
  cus_postcode: string;
  cus_country: string;
  shipping_name?: string;
  shipping_add1?: string;
  shipping_city?: string;
  shipping_postcode?: string;
  shipping_country?: string;
  multi_card_name?: string;
  allowed_bin?: string;
}

interface SSLCommerzResponse {
  status: string;
  failedreason?: string;
  sessionkey: string;
  gw: any;
  redirectGatewayURL?: string;
}

export const sslCommerzService = {
  initiatePayment: async (
    paymentData: SSLCommerzPaymentData
  ): Promise<SSLCommerzResponse> => {
    const payload = {
      store_id: SSL_COMMERZ_STORE_ID,
      store_passwd: SSL_COMMERZ_STORE_PASSWORD,
      ...paymentData,
    };

    try {
      // Convert all values to strings for URLSearchParams
      const stringifiedPayload: Record<string, string> = {};
      Object.keys(payload).forEach((key) => {
        stringifiedPayload[key] = String((payload as any)[key]);
      });

      const response = await axios.post(
        `${SSL_COMMERZ_BASE_URL}/gwprocess/v4/api.php`,
        new URLSearchParams(stringifiedPayload).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Error initiating SSLCommerz payment:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to initiate payment"
      );
    }
  },

  validatePayment: async (
    transactionId: string,
    amount: number,
    currency: string
  ): Promise<any> => {
    const validationPayload = {
      store_id: SSL_COMMERZ_STORE_ID,
      store_passwd: SSL_COMMERZ_STORE_PASSWORD,
      tran_id: transactionId,
      amount: amount,
      currency: currency,
    };

    try {
      // Convert all values to strings for URLSearchParams
      const stringifiedValidationPayload: Record<string, string> = {};
      Object.keys(validationPayload).forEach((key) => {
        stringifiedValidationPayload[key] = String(
          (validationPayload as any)[key]
        );
      });

      const response = await axios.post(
        `${SSL_COMMERZ_BASE_URL}/validator/api/validationserverAPI.php`,
        new URLSearchParams(stringifiedValidationPayload).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Error validating SSLCommerz payment:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "Failed to validate payment"
      );
    }
  },
};
