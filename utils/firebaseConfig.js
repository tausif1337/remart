/**
 * utils/firebaseConfig.js — Firebase App Initialization
 *
 * This file sets up the connection to the Firebase project.
 * All credentials are loaded from environment variables (via @env / babel-plugin-transform-inline-environment-variables)
 * so they are NEVER hardcoded in source code. They live in the root .env file.
 *
 * The initialized 'app' object is exported and used by other Firebase services
 * (Firestore, Auth, Storage) in firebaseServices.js.
 *
 * Beginner tip: You only need to call initializeApp() ONCE per application.
 * Calling it again would create a duplicate app instance and throw an error.
 */

import { initializeApp } from "firebase/app";
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from "@env";

// Build the Firebase config object using environment variables
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase with our config — returns the app instance
const app = initializeApp(firebaseConfig);

// Export the app for use in firebaseServices.js
export default app;
export { firebaseConfig };