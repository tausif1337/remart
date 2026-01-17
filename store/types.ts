export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  description: string;
  specifications: { label: string; value: string }[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem extends Product {
  quantity: number;
}