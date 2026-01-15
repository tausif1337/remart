import axios from "axios";
import { SSLCOMMERZ_STORE_ID, SSLCOMMERZ_STORE_PASSWORD } from "@env";

const SSLCOMMERZ_API_URL = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

export interface SSLCommerzRequest {
  total_amount: number;
  currency: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
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

export interface SSLCommerzResponse {
  status: string;
  failedreason?: string;
  sessionkey?: string;
  GatewayPageURL?: string;
}

export const apiService = {
  initiatePayment: async (data: SSLCommerzRequest): Promise<SSLCommerzResponse> => {
    try {
      const cleanStoreId = (SSLCOMMERZ_STORE_ID || "").replace(/['"]/g, "").trim();
      const cleanPassword = (SSLCOMMERZ_STORE_PASSWORD || "").replace(/['"]/g, "").trim();

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

      console.log("SSLCommerz Request:", params.toString().replace(/store_passwd=[^&]*/, "store_passwd=********"));

      const response = await axios.post(SSLCOMMERZ_API_URL, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log("SSLCommerz Response:", response.data);

      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error("SSLCommerz API Error Response:", error.response.data);
      } else {
        console.error("SSLCommerz API Error:", error.message);
      }
      return {
        status: "FAILED",
        failedreason: error.message,
      };
    }
  },
};