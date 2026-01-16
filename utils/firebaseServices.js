import app from './firebaseConfig';
import { getFirestore, collection, getDocs, addDoc, doc, getDoc, query, where, orderBy, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Firebase services
const db = getFirestore(app);
const storage = getStorage(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

import { MOCK_PRODUCTS, MOCK_REVIEWS } from './seedData';

const seedDatabase = async () => {
  try {
    console.log("Starting database seed...");
    
    // Seed Products
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

// Example functions to interact with Firestore
const getProducts = async () => {
  try {
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    
    if (productsSnapshot.empty) {
      return [];
    }

    const productsList = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return productsList;
  } catch (error) {
    console.error('Firestore fetch failed:', error);
    return [];
  }
};

const getProductById = async (productId) => {
  try {
    const productDoc = doc(db, 'products', productId);
    const productSnapshot = await getDoc(productDoc);
    
    if (productSnapshot.exists()) {
      return {
        id: productSnapshot.id,
        ...productSnapshot.data()
      };
    } else {
      console.log('Product not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

const saveOrder = async (orderData) => {
  try {
    const ordersCollection = collection(db, 'orders');
    const docRef = await addDoc(ordersCollection, {
      ...orderData,
      createdAt: serverTimestamp(),
      status: 'Processing',
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving order:', error);
    return { success: false, error: error.message };
  }
};

const getUserOrders = async (userId) => {
  try {
    const ordersCollection = collection(db, 'orders');
    const q = query(
      ordersCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return [];

    const ordersList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString() || new Date().toISOString()
    }));
    return ordersList;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

const getReviewsByProductId = async (productId) => {
  try {
    const reviewsCollection = collection(db, 'reviews');
    const q = query(reviewsCollection, where('productId', '==', productId));
    const querySnapshot = await getDocs(q);
    const reviewsList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return reviewsList;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export { db, storage, auth, getProducts, getProductById, saveOrder, getUserOrders, seedDatabase, getReviewsByProductId };