import { NavigatorScreenParams } from "@react-navigation/native";

export type MainTabParamList = {
  Home: undefined;
  Cart: undefined;
  Account: undefined;
};

export type RootStackParamList = {
  MainTab: NavigatorScreenParams<MainTabParamList>;
  ProductDetail: { productId: string };
  Wishlist: undefined;
  Checkout: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OrderHistory: undefined;
  OrderDetail: { order: any };
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
