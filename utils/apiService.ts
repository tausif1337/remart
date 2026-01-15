import axios from "axios";
import { PAYSTATION_STORE_ID, PAYSTATION_PASSWORD } from "@env";

const PAYSTATION_API_URL = "https://api.paystation.com.bd";

export interface PayStationRequest {
  invoice_number: string;
  currency: string;
  payment_amount: number;
  reference?: string;
  cust_name: string;
  cust_phone: string;
  cust_email: string;
  cust_address?: string;
  callback_url: string;
  checkout_items?: string;
}

export interface PayStationResponse {
  status_code: string;
  status: string;
  message: string;
  payment_amount?: string;
  invoice_number?: string;
  payment_url?: string;
}

export const apiService = {
  initiatePayment: async (data: PayStationRequest): Promise<PayStationResponse> => {
    try {
      const cleanStoreId = PAYSTATION_STORE_ID.replace(/['"]/g, "").trim();
      const cleanPassword = PAYSTATION_PASSWORD.replace(/['"]/g, "").trim();

      const formData = new FormData();
      formData.append("merchantId", cleanStoreId);
      formData.append("merchant_id", cleanStoreId);
      formData.append("password", cleanPassword);
      formData.append("store_id", cleanStoreId);
      formData.append("store_pass", cleanPassword);
      
      formData.append("invoice_number", data.invoice_number);
      formData.append("currency", data.currency);
      formData.append("payment_amount", Math.round(data.payment_amount).toString());
      formData.append("cust_name", data.cust_name);
      formData.append("cust_phone", data.cust_phone);
      formData.append("cust_email", data.cust_email);
      formData.append("callback_url", data.callback_url);
      
      if (data.reference) formData.append("reference", data.reference);
      if (data.cust_address) formData.append("cust_address", data.cust_address);
      if (data.checkout_items) formData.append("checkout_items", data.checkout_items);

      const response = await axios.post(`${PAYSTATION_API_URL}/initiate-payment`, formData, {
        headers: {
          "Accept": "application/json",
          // Let Axios handle Content-Type boundary for FormData
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("PayStation API Error:", error.response?.data || error.message);
      return {
        status_code: error.response?.status.toString() || "500",
        status: "failed",
        message: error.message || "Internal Server Error",
      };
    }
  },
};
