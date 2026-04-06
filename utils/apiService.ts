import axios from "axios";
import { SSLCOMMERZ_STORE_ID, SSLCOMMERZ_STORE_PASSWORD } from "@env";

/**
 * utils/apiService.ts — Payment Gateway Integration (SSLCommerz)
 *
 * This file handles the communication with the SSLCommerz payment gateway.
 * SSLCommerz is a popular payment processor used in Bangladesh.
 *
 * How it works:
 * 1. The app collects order and customer info at checkout
 * 2. apiService.initiatePayment() sends this to the SSLCommerz sandbox API
 * 3. SSLCommerz responds with a GatewayPageURL
 * 4. The app opens that URL in a WebView for the user to complete payment
 *
 * Beginner tip: We're using the SANDBOX (test) URL here.
 * For production, this would change to the live SSLCommerz endpoint.
 */

// SSLCommerz sandbox endpoint — for testing payments without real money
const SSLCOMMERZ_API_URL =
  "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

/**
 * SSLCommerzRequest — The shape of data we send TO the payment gateway.
 * These fields are required by SSLCommerz's API specification.
 */
export interface SSLCommerzRequest {
  total_amount: number;
  currency: string;      // e.g. "BDT" for Bangladeshi Taka
  tran_id: string;       // A unique transaction ID we generate
  success_url: string;   // Where to redirect after successful payment
  fail_url: string;      // Where to redirect on payment failure
  cancel_url: string;    // Where to redirect if user cancels
  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_city: string;
  cus_state: string;
  cus_postcode: string;
  cus_country: string;
  cus_phone: string;
  shipping_method: string;
  product_name: string;
  product_category: string;
  product_profile: string;
}

/**
 * SSLCommerzResponse — The shape of data we receive FROM the payment gateway.
 * The key field is GatewayPageURL — open this in a WebView for payment.
 */
export interface SSLCommerzResponse {
  status: string;            // "SUCCESS" or "FAILED"
  failedreason?: string;     // Error message from SSLCommerz if it failed
  sessionkey?: string;       // Session key for the payment
  GatewayPageURL?: string;   // The URL to show in a WebView for payment
}

export const apiService = {
  /**
   * initiatePayment: Sends a payment request to SSLCommerz and returns
   * the gateway URL that we open in a WebView.
   *
   * Note: SSLCommerz requires form-urlencoded format (not JSON),
   * so we build a URLSearchParams object instead of a plain JS object.
   */
  initiatePayment: async (
    data: SSLCommerzRequest
  ): Promise<SSLCommerzResponse> => {
    try {
      /**
       * Credential sanitization: Environment variable strings can sometimes
       * include stray quotes or spaces when loaded. We strip them to avoid
       * 401 authentication errors from the SSLCommerz API.
       */
      const cleanStoreId = (SSLCOMMERZ_STORE_ID || "")
        .replace(/['"]/g, "")
        .trim();
      const cleanPassword = (SSLCOMMERZ_STORE_PASSWORD || "")
        .replace(/['"]/g, "")
        .trim();

      // Build the request payload as URL-encoded form data (required by SSLCommerz)
      const params = new URLSearchParams();
      params.append("store_id", cleanStoreId);
      params.append("store_passwd", cleanPassword);
      params.append("total_amount", data.total_amount.toString());
      params.append("currency", data.currency);
      params.append("tran_id", data.tran_id);
      params.append("success_url", data.success_url);
      params.append("fail_url", data.fail_url);
      params.append("cancel_url", data.cancel_url);
      params.append("cus_name", data.cus_name);
      params.append("cus_email", data.cus_email);
      params.append("cus_add1", data.cus_add1);
      params.append("cus_city", data.cus_city);
      params.append("cus_state", data.cus_state);
      params.append("cus_postcode", data.cus_postcode);
      params.append("cus_country", data.cus_country);
      params.append("cus_phone", data.cus_phone);
      params.append("shipping_method", data.shipping_method);
      params.append("product_name", data.product_name);
      params.append("product_category", data.product_category);
      params.append("product_profile", data.product_profile);

      // Log request (masking the password for security in debug output)
      console.log(
        "SSLCommerz Request:",
        params.toString().replace(/store_passwd=[^&]*/, "store_passwd=********")
      );

      const response = await axios.post(SSLCOMMERZ_API_URL, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Required by SSLCommerz
        },
      });

      console.log("SSLCommerz Response:", response.data);

      return response.data;
    } catch (error: any) {
      // Handle both API-level errors (with response body) and network errors
      if (error.response) {
        console.error("SSLCommerz API Error Response:", error.response.data);
      } else {
        console.error("SSLCommerz API Error:", error.message);
      }
      // Return a structured failure so the caller can handle it gracefully
      return {
        status: "FAILED",
        failedreason: error.message,
      };
    }
  },
};

