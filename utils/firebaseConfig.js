// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCt6_5iPVNLIt7bri9xZSYQTFOn5f7Y97k",
  authDomain: "remart-531b2.firebaseapp.com",
  projectId: "remart-531b2",
  storageBucket: "remart-531b2.firebasestorage.app",
  messagingSenderId: "637114173060",
  appId: "1:637114173060:web:d3723d585e073c651a64d1",
  measurementId: "G-2S0HCCTQGK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
export { firebaseConfig };