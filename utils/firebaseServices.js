/**
 * utils/firebaseServices.js — Firestore & Firebase Auth Helpers
 *
 * This file is the DATA LAYER of the app. All interactions with Firebase
 * (reading products, saving orders, cancelling orders, fetching reviews)
 * are centralized here. Screens import these functions instead of calling
 * Firebase APIs directly, keeping the codebase clean and maintainable.
 *
 * Exports:
 * - db, storage, auth: Firebase service instances
 * - getProducts, getProductById: Product data
 * - saveOrder, getUserOrders, cancelOrder: Order management
 * - getReviewsByProductId: Customer reviews
 * - seedDatabase: Dev-only helper to populate sample data
 */

import app from "./firebaseConfig";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- Initialize Firebase services ---

const db = getFirestore(app);       // Firestore database instance
const storage = getStorage(app);    // Firebase Storage (for images, files)

/**
 * Auth with persistence: Using AsyncStorage means the user stays logged in
 * even after closing the app. Without this, they'd need to login every time.
 */
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

import { MOCK_PRODUCTS, MOCK_REVIEWS } from "./seedData";

/**
 * seedDatabase: Populates Firestore with mock products and reviews.
 * Used in DEVELOPMENT only when the database is empty.
 * Uses setDoc with a known ID to avoid duplicate entries per seed.
 */
const seedDatabase = async () => {
  try {
    console.log("Starting database seed...");

    // Seed Products — write each product using its own ID as the document key
    for (const product of MOCK_PRODUCTS) {
      await setDoc(doc(db, "products", product.id), product);
    }
    console.log("Products seeded successfully!");

    // Seed Reviews
    for (const review of MOCK_REVIEWS) {
      await setDoc(doc(db, "reviews", review.id), review);
    }
    console.log("Reviews seeded successfully!");

    return { success: true };
  } catch (error) {
    console.error("Error seeding database:", error);
    return { success: false, error: error.message };
  }
};

/**
 * getProducts: Fetches all products from the "products" Firestore collection.
 * Returns an empty array (not an error) if the collection is empty.
 */
const getProducts = async () => {
  try {
    const productsCollection = collection(db, "products");
    const productsSnapshot = await getDocs(productsCollection);

    if (productsSnapshot.empty) {
      return [];
    }

    // Map each Firestore document to a plain JS object with its ID included
    const productsList = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return productsList;
  } catch (error) {
    console.error("Firestore fetch failed:", error);
    return [];
  }
};

/**
 * getProductById: Fetches a single product document by its Firestore document ID.
 * Returns null if the product doesn't exist.
 */
const getProductById = async (productId) => {
  try {
    const productDoc = doc(db, "products", productId);
    const productSnapshot = await getDoc(productDoc);

    if (productSnapshot.exists()) {
      return {
        id: productSnapshot.id,
        ...productSnapshot.data(),
      };
    } else {
      console.log("Product not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

/**
 * saveOrder: Creates a new order document in Firestore.
 * serverTimestamp() uses Firebase's server clock (not the client's) for accuracy.
 * The initial status is always "Processing".
 * Returns the new document's auto-generated ID on success.
 */
const saveOrder = async (orderData) => {
  try {
    const ordersCollection = collection(db, "orders");
    const docRef = await addDoc(ordersCollection, {
      ...orderData,
      createdAt: serverTimestamp(), // Firebase server time — more reliable than Date.now()
      status: "Processing",
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error saving order:", error);
    return { success: false, error: error.message };
  }
};

/**
 * getUserOrders: Fetches all orders belonging to a specific user.
 * - Filters by userId to only show the current user's orders
 * - Orders by createdAt descending (newest first)
 * - Converts Firestore Timestamp to ISO string for compatibility with JS Date
 */
const getUserOrders = async (userId) => {
  try {
    const ordersCollection = collection(db, "orders");
    const q = query(
      ordersCollection,
      where("userId", "==", userId),   // Only this user's orders
      orderBy("createdAt", "desc")      // Newest first
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) return [];

    const ordersList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamp to a regular ISO string, fallback to now if missing
      createdAt:
        doc.data().createdAt?.toDate().toISOString() ||
        new Date().toISOString(),
    }));
    return ordersList;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};

/**
 * getReviewsByProductId: Fetches all reviews for a specific product.
 * Reviews are stored in a separate top-level "reviews" collection to keep
 * the product documents lean.
 */
const getReviewsByProductId = async (productId) => {
  try {
    const reviewsCollection = collection(db, "reviews");
    const q = query(reviewsCollection, where("productId", "==", productId));
    const querySnapshot = await getDocs(q);
    const reviewsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return reviewsList;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

/**
 * cancelOrder: Changes an order's status to "Cancelled" in Firestore.
 *
 * Steps:
 * 1. Verifies the order exists (avoids silent failures)
 * 2. Checks ownership against the current auth user (logs a warning if mismatched)
 * 3. Uses updateDoc (partial update) instead of setDoc (full overwrite)
 * 4. Records a cancelledAt timestamp for audit purposes
 */
const cancelOrder = async (orderId) => {
  try {
    const currentUser = auth.currentUser;
    console.log("[DEBUG] Current Auth User:", currentUser ? currentUser.uid : "Not Authenticated");
    console.log("[DEBUG] Attempting to cancel order:", orderId);

    const orderDoc = doc(db, "orders", orderId);

    // First, verify the order exists
    const orderSnap = await getDoc(orderDoc);
    if (!orderSnap.exists()) {
      return { success: false, error: "Order not found" };
    }

    const orderData = orderSnap.data();
    console.log("[DEBUG] Order found. Owner ID:", orderData.userId);

    // Ownership check — log a warning if there's a mismatch, but allow it
    if (currentUser && orderData.userId !== currentUser.uid) {
      console.warn("[WARN] Order ownership mismatch. Current user:", currentUser.uid, "Order owner:", orderData.userId);
    }

    // Update only the status and add a cancellation timestamp
    await updateDoc(orderDoc, {
      status: "Cancelled",
      cancelledAt: serverTimestamp(),
    });

    console.log("[DEBUG] Order cancelled successfully:", orderId);
    return { success: true };
  } catch (error) {
    console.error("[ERROR] Error cancelling order:", error);
    // Translate Firebase error codes to user-friendly messages
    let errorMessage = error.message;
    if (error.code === 'permission-denied') {
      errorMessage = "Permission denied. You might not have the rights to cancel this order.";
    }
    return { success: false, error: errorMessage };
  }
};

// Export all service instances and helper functions
export {
  db,
  storage,
  auth,
  getProducts,
  getProductById,
  saveOrder,
  getUserOrders,
  seedDatabase,
  getReviewsByProductId,
  cancelOrder,
};