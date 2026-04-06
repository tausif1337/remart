/**
 * store/types.ts — Shared Data Models
 *
 * These TypeScript interfaces define the shape of the core data entities
 * in the app. They are imported across components, screens, and slices
 * to ensure consistent data structures everywhere.
 *
 * Beginner tip: An 'interface' is like a contract — it describes what
 * properties an object MUST have and their types.
 */

/** A product as it exists in Firestore and the product listings */
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;      // URL string to the product image
  rating: number;     // Average customer rating (e.g. 4.5)
  description: string;
  specifications: { label: string; value: string }[]; // Key-value array (e.g. "Color: Red")
  stock: number;                    // Available quantity in inventory
  lowStockThreshold?: number;       // Optional: threshold for low stock warning (default: 5)
}

/** A customer review left on a product's detail page */
export interface Review {
  id: string;
  productId: string;  // Links this review to a specific Product
  userName: string;
  userImage: string;  // Avatar URL for the reviewer
  rating: number;
  comment: string;
  date: string;       // Date string (ISO format or human-readable)
}

/**
 * A CartItem is a Product that has been added to the shopping cart.
 * It extends Product (inherits all its fields) and adds a 'quantity' field.
 */
export interface CartItem extends Product {
  quantity: number; // How many of this product the user wants to buy
}