import { create } from 'zustand';

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

interface AppState {
  products: Product[];
  reviews: Review[];
  cart: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  getReviewsByProductId: (productId: string) => Review[];
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Modern Headphones',
    price: 199.99,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    rating: 4.8,
    description: 'Experience immersive sound with our latest noise-canceling technology. These headphones offer premium comfort and crystal-clear audio quality for music lovers and professionals alike.',
    specifications: [
      { label: 'Type', value: 'Over-ear' },
      { label: 'Connectivity', value: 'Bluetooth 5.0' },
      { label: 'Battery Life', value: '30 Hours' },
      { label: 'Weight', value: '250g' },
    ]
  },
  {
    id: '2',
    name: 'Ergonomic Chair',
    price: 349.00,
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop',
    rating: 4.5,
    description: 'Designed for ultimate comfort during long work hours. This ergonomic chair features adjustable height, lumbar support, and breathable mesh material.',
    specifications: [
      { label: 'Material', value: 'Premium Mesh' },
      { label: 'Weight Capacity', value: '150kg' },
      { label: 'Adjustable', value: 'Height & Lumbar' },
    ]
  },
  {
    id: '3',
    name: 'Smart Watch',
    price: 299.50,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop',
    rating: 4.9,
    description: 'Track your health and stay connected with this stylish smart watch. Includes heart rate monitoring, GPS, and multi-sport tracking.',
    specifications: [
      { label: 'Display', value: '1.4" AMOLED' },
      { label: 'Waterproof', value: 'IP68' },
      { label: 'Sensors', value: 'Heart Rate, GPS' },
    ]
  },
  {
    id: '4',
    name: 'Minimal Lamp',
    price: 89.99,
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1507473888900-52e1ad14db3d?q=80&w=1000&auto=format&fit=crop',
    rating: 4.2,
    description: 'Enhance your workspace with this sleek, minimalist desk lamp. Features touch control and adjustable brightness levels.',
    specifications: [
      { label: 'Power', value: '10W LED' },
      { label: 'Color Temp', value: '3000K - 6500K' },
    ]
  },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: '1',
    userName: 'Alex Johnson',
    userImage: 'https://i.pravatar.cc/150?u=alex',
    rating: 5,
    comment: 'The sound quality is absolutely phenomenal! The noise cancellation really helps me focus at work.',
    date: 'Oct 12, 2025',
  },
  {
    id: 'r2',
    productId: '1',
    userName: 'Sarah Smith',
    userImage: 'https://i.pravatar.cc/150?u=sarah',
    rating: 4,
    comment: 'Very comfortable for long hours, though the battery life could be a bit better.',
    date: 'Nov 5, 2025',
  },
  {
    id: 'r3',
    productId: '2',
    userName: 'David Chen',
    userImage: 'https://i.pravatar.cc/150?u=david',
    rating: 5,
    comment: 'My back pain is gone! This chair is worth every penny.',
    date: 'Dec 1, 2025',
  },
];

export const useStore = create<AppState>((set, get) => ({
  products: MOCK_PRODUCTS,
  reviews: MOCK_REVIEWS,
  cart: [],
  addToCart: (product, quantity) => {
    set((state) => {
      const existingItem = state.cart.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          ),
        };
      }
      return { cart: [...state.cart, { ...product, quantity }] };
    });
  },
  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== productId),
    }));
  },
  updateCartQuantity: (productId, quantity) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    }));
  },
  getReviewsByProductId: (productId) => {
    return get().reviews.filter((review) => review.productId === productId);
  },
}));
