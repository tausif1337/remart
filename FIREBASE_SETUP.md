# Firebase Setup for ReMart React Native App

This document explains how Firebase has been integrated into the ReMart React Native application.

## Files Created

### 1. `utils/firebaseConfig.js`
This file contains the Firebase configuration and initializes the Firebase app with your project credentials.

### 2. `utils/firebaseServices.js`
This file exports initialized Firebase services (Firestore, Storage, Auth) and includes utility functions to interact with Firestore.

## Services Configured

### Firestore Database
- `getProducts()` - Fetches all products from the 'products' collection
- `getProductById(productId)` - Fetches a specific product by ID

### Storage
- Initialized for file/image uploads

### Authentication
- Initialized for user authentication

## How to Use Firebase in Components

In your components, you can now import and use the Firebase services:

```javascript
import { getProducts, getProductById } from '../utils/firebaseServices';

// Example usage
const fetchProducts = async () => {
  const products = await getProducts();
  console.log(products);
};
```

## Important Notes

1. The Firebase configuration is loaded in `AppWrapper.tsx` to ensure Firebase is initialized when the app starts.

2. The ProductListingScreen has been updated to fetch products from Firestore instead of using static data.

3. Make sure to set up your Firestore security rules in the Firebase Console to control access to your data.

## Adding More Firebase Features

To add more Firebase services (Authentication, Cloud Functions, etc.), you can extend the `firebaseServices.js` file with additional service initializations and helper functions.