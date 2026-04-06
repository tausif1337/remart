import { NavigatorScreenParams } from "@react-navigation/native";

/**
 * navigation/types.ts
 *
 * This file is the single source of truth for all navigation route names
 * and the parameters they accept. TypeScript uses these to give you
 * autocomplete + errors if you navigate to the wrong route or pass wrong params.
 *
 * Beginner tip: 'undefined' means a screen takes NO parameters.
 * If a screen needs data, you define it as an object like { productId: string }.
 */

// ----- Bottom Tab Navigator Screens -----
// These are the 3 main tabs visible at the bottom of the app.
export type MainTabParamList = {
  Home: undefined;     // Product listing screen - no params needed
  Cart: undefined;     // Shopping cart - no params needed
  Account: undefined;  // Profile / Auth gatekeeper - no params needed
};

// ----- Full App Stack Screens (can be navigated to from anywhere) -----
export type RootStackParamList = {
  // The tab navigator itself is treated as a single "screen" in the stack
  MainTab: NavigatorScreenParams<MainTabParamList>;

  // Requires product ID to fetch and display the specific product
  ProductDetail: { productId: string };

  // Auth screens - no parameters needed
  Wishlist: undefined;
  Checkout: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OrderHistory: undefined;

  // Requires the full order object (typed as 'any' for flexibility)
  OrderDetail: { order: any };

  // Requires the complete order confirmation details to display the summary page
  OrderConfirmation: {
    orderDetails: {
      orderId: string;
      transactionId: string;
      amount: number;
      customerName: string;
      email: string;
      items: Array<{
        name: string;
        quantity: number;
        price: number;
      }>;
      shippingAddress: {
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
      orderDate: string;
    };
  };
};
