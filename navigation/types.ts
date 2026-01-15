export type RootStackParamList = {
  ProductListing: undefined;
  ProductDetail: { productId: string };
  Cart: undefined;
  Wishlist: undefined;
  Checkout: undefined;
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
    }
  };
};
