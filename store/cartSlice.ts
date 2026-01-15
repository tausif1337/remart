import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Product, Review, CartItem } from "./types";

interface CartState {
  products: Product[];
  reviews: Review[];
  cart: CartItem[];
}

// Define mock data (same as in the previous Zustand implementation)
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Modern Headphones",
    price: 199.99,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    description:
      "Experience immersive sound with our latest noise-canceling technology. These headphones offer premium comfort and crystal-clear audio quality for music lovers and professionals alike.",
    specifications: [
      { label: "Type", value: "Over-ear" },
      { label: "Connectivity", value: "Bluetooth 5.0" },
      { label: "Battery Life", value: "30 Hours" },
      { label: "Weight", value: "250g" },
    ],
  },
  {
    id: "2",
    name: "Ergonomic Chair",
    price: 349.0,
    category: "furniture",
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000&auto=format&fit=crop",
    rating: 4.5,
    description:
      "Designed for ultimate comfort during long work hours. This ergonomic chair features adjustable height, lumbar support, and breathable mesh material.",
    specifications: [
      { label: "Material", value: "Premium Mesh" },
      { label: "Weight Capacity", value: "150kg" },
      { label: "Adjustable", value: "Height & Lumbar" },
    ],
  },
  {
    id: "3",
    name: "Smart Watch",
    price: 299.5,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    description:
      "Track your health and stay connected with this stylish smart watch. Includes heart rate monitoring, GPS, and multi-sport tracking.",
    specifications: [
      { label: "Display", value: '1.4" AMOLED' },
      { label: "Waterproof", value: "IP68" },
      { label: "Sensors", value: "Heart Rate, GPS" },
    ],
  },
  {
    id: "4",
    name: "Minimal Lamp",
    price: 89.99,
    category: "furniture",
    image:
      "https://images.unsplash.com/photo-1507473888900-52e1ad14db3d?q=80&w=1000&auto=format&fit=crop",
    rating: 4.2,
    description:
      "Enhance your workspace with this sleek, minimalist desk lamp. Features touch control and adjustable brightness levels.",
    specifications: [
      { label: "Power", value: "10W LED" },
      { label: "Color Temp", value: "3000K - 6500K" },
    ],
  },
  {
    id: "5",
    name: "Wireless Keyboard",
    price: 79.99,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000&auto=format&fit=crop",
    rating: 4.6,
    description:
      "Sleek wireless keyboard with mechanical switches for a premium typing experience. Features long battery life and customizable RGB lighting.",
    specifications: [
      { label: "Type", value: "Mechanical" },
      { label: "Connectivity", value: "Bluetooth & USB" },
      { label: "Battery Life", value: "60 Days" },
      { label: "Backlight", value: "RGB" },
    ],
  },
  {
    id: "6",
    name: "Gaming Mouse",
    price: 59.99,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1598436908734-73bae32a3b34?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    description:
      "High-precision gaming mouse with programmable buttons and adjustable DPI settings. Ergonomic design for extended use.",
    specifications: [
      { label: "DPI", value: "16000" },
      { label: "Buttons", value: "11 Programmable" },
      { label: "Connectivity", value: "Wireless" },
      { label: "Weight", value: "120g" },
    ],
  },
  {
    id: "7",
    name: "Coffee Table",
    price: 199.99,
    category: "furniture",
    image:
      "https://images.unsplash.com/photo-1550966872-44e3d2b0e465?q=80&w=1000&auto=format&fit=crop",
    rating: 4.4,
    description:
      "Modern coffee table with a minimalist design. Features a tempered glass top and solid wood legs for durability.",
    specifications: [
      { label: "Material", value: "Glass & Wood" },
      { label: "Dimensions", value: '40" x 24" x 18"' },
      { label: "Weight Capacity", value: "100kg" },
    ],
  },
  {
    id: "8",
    name: "Yoga Mat",
    price: 34.99,
    category: "sports",
    image:
      "https://images.unsplash.com/photo-1576671418898-8a6c3d68e641?q=80&w=1000&auto=format&fit=crop",
    rating: 4.3,
    description:
      "Non-slip yoga mat with extra cushioning for comfort during workouts. Eco-friendly material with carrying strap included.",
    specifications: [
      { label: "Thickness", value: "6mm" },
      { label: "Material", value: "TPE" },
      { label: "Dimensions", value: '71" x 24"' },
      { label: "Weight", value: "2.2kg" },
    ],
  },
  {
    id: "9",
    name: "Bluetooth Speaker",
    price: 129.99,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1613047508032-34a0d5935d9a?q=80&w=1000&auto=format&fit=crop",
    rating: 4.5,
    description:
      "Portable Bluetooth speaker with 360-degree sound and deep bass. Waterproof design for outdoor use.",
    specifications: [
      { label: "Power", value: "20W" },
      { label: "Battery Life", value: "12 Hours" },
      { label: "Waterproof", value: "IPX7" },
      { label: "Range", value: "30ft" },
    ],
  },
  {
    id: "10",
    name: "Desk Organizer",
    price: 29.99,
    category: "furniture",
    image:
      "https://images.unsplash.com/photo-1596466596120-2a8e4b5d2c3a?q=80&w=1000&auto=format&fit=crop",
    rating: 4.1,
    description:
      "Elegant desk organizer with multiple compartments to keep your workspace tidy and efficient.",
    specifications: [
      { label: "Material", value: "Wood & Metal" },
      { label: "Compartments", value: "5 Sections" },
      { label: "Dimensions", value: '12" x 8" x 3"' },
    ],
  },
  {
    id: "11",
    name: "Running Shoes",
    price: 129.99,
    category: "sports",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    description:
      "Lightweight running shoes with responsive cushioning and breathable mesh upper. Perfect for daily runs and gym sessions.",
    specifications: [
      { label: "Material", value: "Mesh & Rubber" },
      { label: "Cushioning", value: "Gel" },
      { label: "Weight", value: "280g" },
    ],
  },
  {
    id: "12",
    name: "Water Bottle",
    price: 24.99,
    category: "sports",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1000&auto=format&fit=crop",
    rating: 4.2,
    description:
      "Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    specifications: [
      { label: "Capacity", value: "500ml" },
      { label: "Material", value: "Stainless Steel" },
      { label: "Insulation", value: "Double Wall" },
    ],
  },
  {
    id: "13",
    name: "Backpack",
    price: 89.99,
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop",
    rating: 4.4,
    description:
      "Durable backpack with laptop compartment and multiple pockets. Water-resistant material for all weather conditions.",
    specifications: [
      { label: "Capacity", value: "20L" },
      { label: "Material", value: "Nylon" },
      { label: "Laptop Size", value: '15"' },
      { label: "Water Resistant", value: "Yes" },
    ],
  },
  {
    id: "14",
    name: "Sunglasses",
    price: 79.99,
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=1000&auto=format&fit=crop",
    rating: 4.3,
    description:
      "Stylish sunglasses with UV protection and polarized lenses. Lightweight frame for all-day comfort.",
    specifications: [
      { label: "Lens Type", value: "Polarized" },
      { label: "UV Protection", value: "100%" },
      { label: "Frame Material", value: "TR90" },
    ],
  },
  {
    id: "15",
    name: "Smartphone",
    price: 899.99,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    description:
      "Latest smartphone with high-resolution camera, long battery life, and fast processing power.",
    specifications: [
      { label: "Display", value: '6.7" OLED' },
      { label: "Storage", value: "256GB" },
      { label: "Camera", value: "108MP" },
      { label: "Battery", value: "5000mAh" },
    ],
  },
  {
    id: "16",
    name: "Laptop",
    price: 1299.99,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    description:
      "Powerful laptop with high-performance processor, perfect for work and entertainment. Lightweight and portable.",
    specifications: [
      { label: "Processor", value: "Intel i7" },
      { label: "RAM", value: "16GB" },
      { label: "Storage", value: "512GB SSD" },
      { label: "Display", value: '15.6" 4K' },
    ],
  },
  {
    id: "17",
    name: "Dining Table",
    price: 599.99,
    category: "furniture",
    image:
      "https://images.unsplash.com/photo-1556228453-efd17c9d9b39?q=80&w=1000&auto=format&fit=crop",
    rating: 4.6,
    description:
      "Solid wood dining table that seats 6 people. Rustic design with durable finish.",
    specifications: [
      { label: "Material", value: "Solid Wood" },
      { label: "Seats", value: "6 People" },
      { label: "Dimensions", value: '72" x 36" x 30"' },
    ],
  },
  {
    id: "18",
    name: "Fitness Tracker",
    price: 79.99,
    category: "electronics",
    image:
      "https://images.unsplash.com/photo-1574842268427-9a3f03d0d401?q=80&w=1000&auto=format&fit=crop",
    rating: 4.2,
    description:
      "Track your steps, heart rate, and sleep patterns with this affordable fitness tracker.",
    specifications: [
      { label: "Display", value: '1.1" LCD' },
      { label: "Battery Life", value: "7 Days" },
      { label: "Waterproof", value: "IP67" },
      { label: "Features", value: "Heart Rate, Sleep" },
    ],
  },
  {
    id: "19",
    name: "Sneakers",
    price: 119.99,
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop",
    rating: 4.5,
    description:
      "Comfortable everyday sneakers with cushioned sole and breathable material. Available in multiple colors.",
    specifications: [
      { label: "Material", value: "Canvas & Rubber" },
      { label: "Closure", value: "Laces" },
      { label: "Colors", value: "Black, White, Blue" },
    ],
  },
  {
    id: "20",
    name: "Winter Jacket",
    price: 149.99,
    category: "fashion",
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    description:
      "Warm winter jacket with waterproof outer layer and insulated interior. Perfect for cold weather.",
    specifications: [
      { label: "Material", value: "Nylon & Down" },
      { label: "Waterproof", value: "Yes" },
      { label: "Insulation", value: "Down Fill" },
    ],
  },
  {
    id: "21",
    name: "Desk Fan",
    price: 39.99,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1609434263767-49dbb224ecda?q=80&w=1000&auto=format&fit=crop",
    rating: 4.0,
    description:
      "Quiet desk fan with adjustable height and multiple speed settings. Perfect for personal cooling.",
    specifications: [
      { label: "Speeds", value: "3 Settings" },
      { label: "Height", value: "Adjustable" },
      { label: "Power", value: "25W" },
    ],
  },
  {
    id: "22",
    name: "Blender",
    price: 69.99,
    category: "home",
    image:
      "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?q=80&w=1000&auto=format&fit=crop",
    rating: 4.4,
    description:
      "Powerful blender for smoothies and food preparation. Multiple speed settings and large capacity.",
    specifications: [
      { label: "Power", value: "1000W" },
      { label: "Capacity", value: "1.5L" },
      { label: "Speeds", value: "Variable" },
    ],
  },
];

const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    productId: "1",
    userName: "Alex Johnson",
    userImage: "https://i.pravatar.cc/150?u=alex",
    rating: 5,
    comment:
      "The sound quality is absolutely phenomenal! The noise cancellation really helps me focus at work.",
    date: "Oct 12, 2025",
  },
  {
    id: "r2",
    productId: "1",
    userName: "Sarah Smith",
    userImage: "https://i.pravatar.cc/150?u=sarah",
    rating: 4,
    comment:
      "Very comfortable for long hours, though the battery life could be a bit better.",
    date: "Nov 5, 2025",
  },
  {
    id: "r3",
    productId: "2",
    userName: "David Chen",
    userImage: "https://i.pravatar.cc/150?u=david",
    rating: 5,
    comment: "My back pain is gone! This chair is worth every penny.",
    date: "Dec 1, 2025",
  },
  {
    id: "r4",
    productId: "2",
    userName: "Emily Wilson",
    userImage: "https://i.pravatar.cc/150?u=emily",
    rating: 4,
    comment:
      "Great support and adjustable features. The armrests could be more padded.",
    date: "Nov 15, 2025",
  },
  {
    id: "r5",
    productId: "3",
    userName: "Michael Brown",
    userImage: "https://i.pravatar.cc/150?u=michael",
    rating: 5,
    comment:
      "Perfect for tracking my fitness goals. The GPS accuracy is impressive.",
    date: "Oct 20, 2025",
  },
  {
    id: "r6",
    productId: "3",
    userName: "Jessica Davis",
    userImage: "https://i.pravatar.cc/150?u=jessica",
    rating: 4,
    comment:
      "Stylish and functional. Battery life could be better but overall very satisfied.",
    date: "Sep 30, 2025",
  },
  {
    id: "r7",
    productId: "4",
    userName: "Robert Taylor",
    userImage: "https://i.pravatar.cc/150?u=robert",
    rating: 4,
    comment:
      "Beautiful minimalist design that fits perfectly with my desk setup.",
    date: "Nov 22, 2025",
  },
  {
    id: "r8",
    productId: "5",
    userName: "Olivia Martin",
    userImage: "https://i.pravatar.cc/150?u=olivia",
    rating: 5,
    comment:
      "The mechanical switches feel great and the RGB lighting is a nice touch.",
    date: "Dec 5, 2025",
  },
  {
    id: "r9",
    productId: "6",
    userName: "William Garcia",
    userImage: "https://i.pravatar.cc/150?u=william",
    rating: 4,
    comment:
      "Precise tracking and comfortable grip. Perfect for long gaming sessions.",
    date: "Oct 18, 2025",
  },
  {
    id: "r10",
    productId: "7",
    userName: "Sophia Rodriguez",
    userImage: "https://i.pravatar.cc/150?u=sophia",
    rating: 4,
    comment:
      "Solid construction and modern look. Perfect size for my living room.",
    date: "Nov 10, 2025",
  },
  {
    id: "r11",
    productId: "8",
    userName: "James Martinez",
    userImage: "https://i.pravatar.cc/150?u=james",
    rating: 5,
    comment:
      "Great cushioning and non-slip surface. Really helps with my yoga practice.",
    date: "Sep 25, 2025",
  },
  {
    id: "r12",
    productId: "9",
    userName: "Ava Thompson",
    userImage: "https://i.pravatar.cc/150?u=ava",
    rating: 4,
    comment:
      "Excellent sound quality and good battery life. Waterproof feature is great.",
    date: "Oct 30, 2025",
  },
  {
    id: "r13",
    productId: "10",
    userName: "Benjamin Jackson",
    userImage: "https://i.pravatar.cc/150?u=benjamin",
    rating: 4,
    comment:
      "Keeps my desk organized and looks professional. Good value for money.",
    date: "Nov 18, 2025",
  },
  {
    id: "r14",
    productId: "11",
    userName: "Mia White",
    userImage: "https://i.pravatar.cc/150?u=mia",
    rating: 5,
    comment:
      "Perfect for running! The cushioning provides great support for long distances.",
    date: "Dec 8, 2025",
  },
  {
    id: "r15",
    productId: "12",
    userName: "Ethan Harris",
    userImage: "https://i.pravatar.cc/150?u=ethan",
    rating: 4,
    comment: "Keeps my drinks cold for hours. Durable and leak-proof design.",
    date: "Oct 25, 2025",
  },
  {
    id: "r16",
    productId: "13",
    userName: "Isabella Clark",
    userImage: "https://i.pravatar.cc/150?u=isabella",
    rating: 4,
    comment:
      "Spacious and well-organized. Perfect for daily commute and travel.",
    date: "Nov 12, 2025",
  },
  {
    id: "r17",
    productId: "14",
    userName: "Lucas Lewis",
    userImage: "https://i.pravatar.cc/150?u=lucas",
    rating: 5,
    comment:
      "Great UV protection and stylish design. Very comfortable to wear.",
    date: "Sep 20, 2025",
  },
  {
    id: "r18",
    productId: "15",
    userName: "Charlotte Walker",
    userImage: "https://i.pravatar.cc/150?u=charlotte",
    rating: 4,
    comment:
      "Excellent camera quality and performance. Battery life could be better.",
    date: "Oct 15, 2025",
  },
  {
    id: "r19",
    productId: "16",
    userName: "Henry Hall",
    userImage: "https://i.pravatar.cc/150?u=henry",
    rating: 5,
    comment:
      "Powerful performance and beautiful display. Perfect for work and entertainment.",
    date: "Nov 28, 2025",
  },
  {
    id: "r20",
    productId: "17",
    userName: "Amelia Young",
    userImage: "https://i.pravatar.cc/150?u=amelia",
    rating: 4,
    comment:
      "Solid wood construction and beautiful finish. Great for family dinners.",
    date: "Dec 15, 2025",
  },
  {
    id: "r21",
    productId: "18",
    userName: "Daniel King",
    userImage: "https://i.pravatar.cc/150?u=daniel",
    rating: 4,
    comment:
      "Good fitness tracking features at an affordable price. Display is clear.",
    date: "Oct 5, 2025",
  },
  {
    id: "r22",
    productId: "19",
    userName: "Harper Wright",
    userImage: "https://i.pravatar.cc/150?u=harper",
    rating: 5,
    comment:
      "Very comfortable for everyday wear. Good quality materials and construction.",
    date: "Nov 2, 2025",
  },
  {
    id: "r23",
    productId: "20",
    userName: "Jackson Scott",
    userImage: "https://i.pravatar.cc/150?u=jackson",
    rating: 4,
    comment:
      "Warm and waterproof. Perfect for winter activities and cold weather.",
    date: "Dec 20, 2025",
  },
  {
    id: "r24",
    productId: "21",
    userName: "Evelyn Green",
    userImage: "https://i.pravatar.cc/150?u=evelyn",
    rating: 4,
    comment:
      "Quiet operation and adjustable height. Provides great relief during hot days.",
    date: "Oct 10, 2025",
  },
  {
    id: "r25",
    productId: "22",
    userName: "Sebastian Adams",
    userImage: "https://i.pravatar.cc/150?u=sebastian",
    rating: 4,
    comment:
      "Powerful motor and large capacity. Perfect for making smoothies and soups.",
    date: "Nov 25, 2025",
  },
];

const initialState: CartState = {
  products: MOCK_PRODUCTS,
  reviews: MOCK_REVIEWS,
  cart: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ product: Product; quantity: number }>
    ) => {
      const { product, quantity } = action.payload;
      const existingItem = state.cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({ ...product, quantity });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const productId = action.payload;

      // Defensive: validate productId and ensure it's a proper string
      if (!productId || typeof productId !== "string") {
        console.warn(
          "Invalid productId provided to removeFromCart:",
          productId
        );
        return;
      }

      // Filter out only the item with the matching ID
      state.cart = state.cart.filter((item) => item.id !== productId);
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) => {
      const { productId, quantity } = action.payload;
      const item = state.cart.find((item) => item.id === productId);

      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

export const { addToCart, removeFromCart, updateCartQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
