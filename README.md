# 🛍️ Remart - React Native E-Commerce Application

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-~54.0-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12.8.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Redux](https://img.shields.io/badge/Redux_Toolkit-2.11.2-764ABC?style=for-the-badge&logo=redux&logoColor=white)

A modern, feature-rich e-commerce mobile application built with React Native and Expo, featuring seamless shopping experience with persistent cart, wishlist management, secure authentication, and integrated payment processing.

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-technology-stack) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [API Integrations](#-api-integrations)
- [Development Workflow](#-development-workflow)
- [Key Screens](#-key-screens)
- [State Management](#-state-management)
- [Authentication Flow](#-authentication-flow)
- [Payment Integration](#-payment-integration)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Remart** is a full-featured mobile e-commerce application that provides users with a seamless shopping experience. Built with modern React Native practices, it offers persistent data storage, real-time inventory management, secure authentication, and integrated payment processing through SSLCommerz.

### Why Remart?

- ✅ **Production-Ready**: Complete e-commerce functionality with order management
- ✅ **Persistent State**: Cart and wishlist data survives app restarts
- ✅ **Modern UI/UX**: Beautiful, responsive design with dark mode support
- ✅ **Real-time Updates**: Firebase Firestore for instant data synchronization
- ✅ **Secure Payments**: Integrated SSLCommerz payment gateway
- ✅ **Stock Management**: Real-time inventory tracking with low-stock alerts

---

## ✨ Features

### 🛒 Shopping Experience
- **Product Catalog**: Browse 20+ products across multiple categories (Electronics, Furniture, Fashion, Sports)
- **Advanced Search & Filter**: Search by name and filter by category
- **Product Details**: Comprehensive product information with specifications and customer reviews
- **Stock Management**: Real-time stock tracking with visual indicators (In Stock, Low Stock, Out of Stock)
- **Quantity Limits**: Prevents adding more items than available in stock

### 🛍️ Cart & Wishlist
- **Persistent Cart**: Cart items saved to AsyncStorage, persists across app sessions
- **Persistent Wishlist**: Wishlist synced with AsyncStorage for seamless experience
- **Cart Management**: Add, remove, update quantities with real-time total calculation
- **Wishlist Toggle**: Quick add/remove from wishlist with visual feedback
- **Badge Indicators**: Real-time cart and wishlist item counts

### 👤 User Authentication
- **Email/Password Registration**: Secure user account creation with Firebase Auth
- **Login System**: Email-based authentication with session persistence
- **Forgot Password**: Password reset via email with Firebase
- **Profile Management**: View and manage user profile information
- **Auto-Login**: Seamless authentication state management

### 💳 Checkout & Payment
- **Multi-Step Checkout**: Personal information, shipping address, and payment details
- **Form Validation**: Comprehensive client-side validation for all inputs
- **SSLCommerz Integration**: Secure hosted payment processing
- **Payment Confirmation**: Order confirmation with detailed receipt
- **Order History**: View all past orders with status tracking

### 📦 Order Management
- **Order Tracking**: Real-time order status updates (Processing, Delivered, Cancelled)
- **Order Details**: Comprehensive order information with item breakdown
- **Order Cancellation**: Cancel orders before delivery with confirmation dialog
- **Reorder Functionality**: Quick reorder previous purchases
- **Order History**: Paginated list with search and filter capabilities

### 🎨 UI/UX Features
- **Dark Mode Support**: System-responsive dark/light theme
- **Responsive Design**: Optimized for phones and tablets
- **Custom Toast Notifications**: Beautiful feedback messages for all actions
- **Loading States**: Skeleton screens and activity indicators
- **Empty States**: Helpful messages and CTAs for empty carts/wishlists
- **Error Handling**: User-friendly error messages throughout

---

## 🛠️ Technology Stack

### Frontend
- **React Native** (0.81.5) - Cross-platform mobile framework
- **Expo** (~54.0) - Development and build tooling
- **TypeScript** (5.9.2) - Type-safe JavaScript
- **React Navigation** (7.x) - Navigation library
  - Native Stack Navigator
  - Bottom Tab Navigator

### State Management
- **Redux Toolkit** (2.11.2) - Predictable state container
- **Redux Thunk** (3.1.0) - Async action handling
- **React Redux** (9.1.2) - React bindings for Redux

### Backend & Database
- **Firebase** (12.8.0)
  - Authentication - User management
  - Firestore - NoSQL database
  - Storage - Asset management
- **AsyncStorage** (2.2.0) - Local data persistence

### UI & Styling
- **NativeWind** (4.2.1) - Tailwind CSS for React Native
- **Tailwind CSS** (3.4.19) - Utility-first CSS framework
- **Expo Google Fonts** - Custom font integration (Outfit)
- **Lucide React Native** (0.562.0) - Icon library

### Payment Processing
- **SSLCommerz** - Payment gateway integration
- **Axios** (1.7.7) - HTTP client for API requests

### Development Tools
- **React Native Reanimated** (4.1.1) - Advanced animations
- **React Native Toast Message** (2.3.3) - Toast notifications
- **React Native Dotenv** (3.4.11) - Environment variable management

---

## 📥 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Git**
- **iOS Simulator** (Mac only) or **Android Studio** (for Android development)

### Step 1: Clone the Repository

```bash
git clone https://github.com/tausif1337/remart.git
cd remart
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory (see [Environment Setup](#-environment-setup) section for details):

```bash
cp .env.example .env
```

Edit `.env` with your Firebase and SSLCommerz credentials:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id

# SSLCommerz Payment Gateway
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
```

### Step 4: Start Development Server

```bash
npm start
# or
expo start
```

### Step 5: Run on Device/Simulator

- **iOS**: Press `i` in terminal or scan QR code with Expo Go app
- **Android**: Press `a` in terminal or scan QR code with Expo Go app
- **Web**: Press `w` in terminal (limited functionality)

---

## 🔐 Environment Setup

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Google Analytics (optional)

2. **Register Your App**
   - Click "Add app" and select Web (</> icon)
   - Register app with nickname "Remart"
   - Copy the Firebase configuration values

3. **Enable Authentication**
   - Navigate to Authentication → Sign-in method
   - Enable "Email/Password" provider
   - Configure email templates (optional)

4. **Create Firestore Database**
   - Navigate to Firestore Database
   - Click "Create database"
   - Start in **test mode** (for development)
   - Choose a location closest to your users

5. **Firestore Collections Structure**
   ```
   remart-db/
   ├── products/          # Product catalog
   │   ├── {productId}
   │   │   ├── name
   │   │   ├── price
   │   │   ├── category
   │   │   ├── stock
   │   │   └── ...
   │
   ├── orders/            # User orders
   │   ├── {orderId}
   │   │   ├── userId
   │   │   ├── items[]
   │   │   ├── status
   │   │   ├── amount
   │   │   └── ...
   │
   └── reviews/           # Product reviews
       ├── {reviewId}
       │   ├── productId
       │   ├── userName
       │   ├── rating
       │   └── ...
   ```

6. **Seed Database**
   - The app automatically seeds the database on first run if empty
   - 20 products and sample reviews are created automatically

### SSLCommerz Setup

1. **Create Account**
   - Visit [SSLCommerz](https://www.sslcommerz.com/)
   - Sign up for a merchant account
   - Get sandbox credentials for testing

2. **Get Credentials**
   - Login to merchant dashboard
   - Navigate to Settings → API Credentials
   - Copy Store ID and Store Password

3. **Configure Webhook URLs** (Optional for production)
   - Success URL: `https://your-domain.com/payment-success`
   - Fail URL: `https://your-domain.com/payment-fail`
   - Cancel URL: `https://your-domain.com/payment-cancel`

### Security Rules (Production)

For production deployment, update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products: Read-only for all, write only for admins
    match /products/{productId} {
      allow read: if true;
      allow write: if false; // Only admin via console
    }
    
    // Orders: Users can only read/write their own orders
    match /orders/{orderId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
    
    // Reviews: Authenticated users can read all, write their own
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                               resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 📖 Usage Guide

### First-Time Setup

1. **Launch the app** - Opens to Product Listing screen
2. **Browse products** - Scroll through available items
3. **Create account** - Tap Account tab → Create Account
4. **Add items to cart** - Browse products and tap "Add to Cart"
5. **Checkout** - Navigate to Cart → Proceed to Checkout
6. **Complete payment** - Fill form and pay via SSLCommerz

### Key User Flows

#### Shopping Flow
```
Home → Product Detail → Add to Cart → Cart → Checkout → Payment → Order Confirmation
```

#### Authentication Flow
```
Account Tab → Login/Register → Enter Credentials → Home (Authenticated)
```

#### Order Management Flow
```
Account → Order History → Select Order → View Details → Cancel/Reorder
```

#### Password Recovery Flow
```
Login Screen → Forgot Password? → Enter Email → Check Email → Reset Password
```

### Common Actions

**Add Product to Cart**
1. Browse products on home screen
2. Tap on a product card
3. Select quantity
4. Tap "Add to Cart" button
5. Receive confirmation toast

**Add to Wishlist**
1. Navigate to any product
2. Tap heart icon on product card or detail screen
3. Item added to wishlist (accessible via header icon)

**Place an Order**
1. Add items to cart
2. Tap Cart tab
3. Review items and tap "Checkout"
4. Fill in shipping information
5. Tap "Place Order"
6. Complete payment in SSLCommerz window
7. View order confirmation

**Cancel an Order**
1. Navigate to Account → Order History
2. Select an order (not cancelled/delivered)
3. Scroll down and tap "Cancel Order"
4. Confirm cancellation in dialog
5. Order status updates to "Cancelled"

---

## 📁 Project Structure

```
remart/
├── components/              # Reusable UI components
│   ├── CartIconWithBadge.tsx
│   ├── WishlistIconWithBadge.tsx
│   ├── ProductCard.tsx
│   ├── SearchBar.tsx
│   ├── CategoryFilter.tsx
│   ├── ReviewSection.tsx
│   └── ConfirmationModal.tsx
│
├── navigation/              # Navigation configuration
│   ├── AppNavigator.tsx     # Root navigator
│   ├── MainTabNavigator.tsx # Bottom tab navigation
│   └── types.ts             # Navigation type definitions
│
├── screens/                 # Screen components
│   ├── ProductListingScreen.tsx
│   ├── ProductDetailScreen.tsx
│   ├── CartScreen.tsx
│   ├── WishlistScreen.tsx
│   ├── CheckoutScreen.tsx
│   ├── OrderConfirmationScreen.tsx
│   ├── OrderHistoryScreen.tsx
│   ├── OrderDetailScreen.tsx
│   ├── AccountScreen.tsx
│   ├── ProfileScreen.tsx
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   └── ForgotPasswordScreen.tsx
│
├── store/                   # Redux state management
│   ├── index.ts             # Store configuration
│   ├── authSlice.ts         # Authentication state
│   ├── cartSlice.ts         # Cart state with persistence
│   ├── wishlistSlice.ts     # Wishlist state with persistence
│   └── types.ts             # Type definitions
│
├── utils/                   # Utility functions
│   ├── apiService.ts        # SSLCommerz API client
│   ├── firebaseConfig.js    # Firebase initialization
│   ├── firebaseServices.js  # Firebase CRUD operations
│   └── seedData.js          # Initial database seed data
│
├── App.tsx                  # Root component
├── AppWrapper.tsx           # Redux provider & auth observer
├── global.css               # Global styles
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
├── babel.config.js          # Babel configuration
├── metro.config.js          # Metro bundler config
├── package.json             # Dependencies
├── .env.example             # Environment template
└── README.md               # This file
```

### Key Directories Explained

**`/components`** - Reusable UI components used across multiple screens
- Icon badges with real-time counts
- Product cards with wishlist toggle
- Search and filter components
- Confirmation modals

**`/navigation`** - React Navigation setup with TypeScript
- Stack navigator for screens
- Tab navigator for main app sections
- Type-safe navigation parameters

**`/screens`** - Full-screen components representing app pages
- Authentication screens (Login, Register, Forgot Password)
- Shopping screens (Products, Details, Cart, Checkout)
- Account screens (Profile, Orders)

**`/store`** - Redux Toolkit state management
- Slices for cart, wishlist, and auth
- AsyncStorage persistence
- Type-safe actions and selectors

**`/utils`** - Helper functions and configurations
- Firebase setup and CRUD operations
- API service for SSLCommerz
- Seed data for initial database population

---

## 🔌 API Integrations

### Firebase Integration

#### Authentication
```typescript
// Sign up new user
import { createUserWithEmailAndPassword } from 'firebase/auth';
await createUserWithEmailAndPassword(auth, email, password);

// Sign in user
import { signInWithEmailAndPassword } from 'firebase/auth';
await signInWithEmailAndPassword(auth, email, password);

// Password reset
import { sendPasswordResetEmail } from 'firebase/auth';
await sendPasswordResetEmail(auth, email);
```

#### Firestore Operations
```typescript
// Fetch products
const productsCollection = collection(db, 'products');
const snapshot = await getDocs(productsCollection);

// Save order
const ordersCollection = collection(db, 'orders');
await addDoc(ordersCollection, orderData);

// Update order status
const orderDoc = doc(db, 'orders', orderId);
await setDoc(orderDoc, { status: 'Cancelled' }, { merge: true });
```

### SSLCommerz Payment Gateway

#### Payment Initiation
```typescript
const response = await apiService.initiatePayment({
  total_amount: 1500.00,
  currency: 'BDT',
  tran_id: 'INV-' + Date.now(),
  success_url: 'https://remart-app.com/payment-success',
  fail_url: 'https://remart-app.com/payment-fail',
  cancel_url: 'https://remart-app.com/payment-cancel',
  cus_name: 'John Doe',
  cus_email: 'john@example.com',
  // ... other required fields
});

// Response includes GatewayPageURL for hosted payment
if (response.status === 'SUCCESS') {
  // Open payment URL in WebView
  window.open(response.GatewayPageURL);
}
```

#### Payment Flow
1. User completes checkout form
2. App calls `initiatePayment` API
3. SSLCommerz returns hosted payment URL
4. App opens URL in WebView
5. User completes payment
6. SSLCommerz redirects to success/fail/cancel URL
7. App detects redirect and updates order status

---

## 🔧 Development Workflow

### Running the App

```bash
# Start Expo development server
npm start

# Run on specific platform
npm run ios       # iOS simulator
npm run android   # Android emulator
npm run web       # Web browser
```

### Debug Logging

The application includes comprehensive debug logging:

```typescript
console.log('[DEBUG] Cart saved to storage:', cart.length, 'items');
console.log('[DEBUG] User authentication state changed');
console.error('[ERROR] Failed to load wishlist:', error);
```

Filter logs by prefix:
- `[DEBUG]` - General debug information
- `[ERROR]` - Error conditions
- `[INFO]` - Informational messages

### Testing Payments

Use SSLCommerz sandbox credentials for testing:

**Test Card Numbers:**
```
Card Number: 4111 1111 1111 1111
Expiry: Any future date
CVV: Any 3 digits
```

### Database Seeding

The app automatically seeds the database on first launch:

```javascript
// Triggered in ProductListingScreen.tsx
if (products.length === 0) {
  await seedDatabase();
}
```

To manually reset database:
1. Delete all collections in Firestore console
2. Restart the app
3. Database will be re-seeded automatically

### Hot Reload

Expo provides hot reloading for rapid development:
- **Shake device** or press `Cmd+D` (iOS) / `Cmd+M` (Android)
- Select "Reload" or "Enable Fast Refresh"
- Changes reflect immediately without full restart

---

## 📱 Key Screens

### Home Screen (Product Listing)
- Grid layout with responsive columns
- Category filter chips
- Search functionality
- Cart and wishlist badges in header
- Pull-to-refresh for latest products

### Product Detail Screen
- Large product image
- Stock status indicator (In Stock/Low Stock/Out of Stock)
- Quantity selector with stock limits
- Add to Cart button (disabled if out of stock)
- Product specifications tabs
- Customer reviews section

### Cart Screen
- List of cart items with images
- Quantity adjustment controls
- Remove item confirmation
- Subtotal and total calculation
- Proceed to Checkout button

### Checkout Screen
- Multi-section form:
  - Personal information (name, email, phone)
  - Shipping address
  - Payment method selection
- Form validation with error messages
- Order summary with item breakdown
- SSLCommerz payment integration

### Order Confirmation Screen
- Success message with order ID
- Order details summary
- Customer information
- Shipping address
- Action buttons (Continue Shopping, View Cart)

### Order History Screen
- List of all user orders
- Status badges (Processing, Delivered, Cancelled)
- Pull-to-refresh functionality
- Tap to view order details

### Order Detail Screen
- Comprehensive order information
- Invoice-style header with order ID and status
- Item list with images and prices
- Pricing breakdown
- Shipping address
- Reorder button
- Cancel Order button (if applicable)

### Account/Profile Screen
- User information display
- Menu items:
  - My Orders
  - Wishlist
  - Shipping Address
  - Payment Methods
  - Settings
- Sign Out button

### Login Screen
- Email and password inputs
- Show/hide password toggle
- Login button with loading state
- "Forgot Password?" link
- "Create Account" link

### Register Screen
- Full name, email, and password inputs
- Form validation
- Create account button with loading state
- Link back to login

### Forgot Password Screen
- Email input with validation
- Send reset link button
- Success state with confirmation message
- Link back to login

---

## 🔄 State Management

### Redux Store Structure

```typescript
{
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    isLoading: boolean
  },
  cart: {
    products: Product[],      // Cached products
    reviews: Review[],        // Cached reviews
    cart: CartItem[],         // Cart items
    isHydrated: boolean       // AsyncStorage loaded
  },
  wishlist: {
    items: Product[],         // Wishlist items
    isHydrated: boolean       // AsyncStorage loaded
  }
}
```

### Cart Persistence

Cart items are automatically saved to AsyncStorage on every change:

```typescript
// Automatic save in cartSlice
addToCart: (state, action) => {
  // ... update state
  saveCartToStorage(state.cart);
}

// Automatic load on app start (AppWrapper.tsx)
useEffect(() => {
  const cartData = await loadCartFromStorage();
  dispatch(hydrateCart(cartData));
}, []);
```

### Wishlist Persistence

Similar pattern for wishlist:

```typescript
toggleWishlist: (state, action) => {
  // ... update state
  saveWishlistToStorage(state.items);
}
```

---

## 🔐 Authentication Flow

### Registration
1. User fills registration form
2. Firebase creates user account
3. User profile updated with display name
4. Auto-login after successful registration
5. Redux state updated with user info

### Login
1. User enters credentials
2. Firebase authenticates user
3. Session persisted automatically
4. Redux state updated
5. Navigate to previous screen

### Session Management
```typescript
// Auto-login on app start
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(setUser({
        id: user.uid,
        email: user.email,
        displayName: user.displayName
      }));
    }
  });
  return unsubscribe;
}, []);
```

### Protected Routes
- Orders require authentication
- Guest users redirected to login
- Auth state checked via Redux

---

## 💳 Payment Integration

### Checkout Process

1. **Form Validation**
   ```typescript
   const validateForm = () => {
     // Email validation
     if (!validateEmail(email)) {
       return false;
     }
     // Phone validation
     if (!validatePhone(phone)) {
       return false;
     }
     // ... other validations
     return true;
   };
   ```

2. **Payment Initiation**
   ```typescript
   const response = await apiService.initiatePayment({
     total_amount: calculateTotal(),
     tran_id: `INV-${Date.now()}`,
     cus_name: `${firstName} ${lastName}`,
     // ... other parameters
   });
   ```

3. **Payment WebView**
   - Opens SSLCommerz hosted page
   - User completes payment securely
   - App monitors URL changes

4. **Payment Callback**
   ```typescript
   onNavigationStateChange={(navState) => {
     if (navState.url.startsWith(SUCCESS_URL)) {
       // Save order to Firebase
       await saveOrder(orderDetails);
       // Clear cart
       dispatch(clearCart());
       // Navigate to confirmation
       navigation.navigate('OrderConfirmation');
     }
   }}
   ```

### Order Saving

```typescript
const orderDetails = {
  orderId: invoiceNumber,
  transactionId: 'SSL-' + Date.now(),
  userId: user.id,
  amount: totalAmount,
  items: cart.map(item => ({ ... })),
  shippingAddress: { ... },
  status: 'Processing',
  orderDate: new Date().toISOString()
};

await saveOrder(orderDetails);
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- Follow existing TypeScript conventions
- Use functional components with hooks
- Include debug logging for important operations
- Write descriptive commit messages
- Add comments for complex logic

### Testing
- Test on both iOS and Android
- Verify payment flow in sandbox mode
- Check persistence after app restart
- Test error scenarios

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Remart Development Team**

- GitHub: [@tausif1337](https://github.com/tausif1337)
- Email: technicalbind@gmail.com

---

## 🙏 Acknowledgments

- [React Native](https://reactnative.dev/) - Framework
- [Expo](https://expo.dev/) - Development platform
- [Firebase](https://firebase.google.com/) - Backend services
- [SSLCommerz](https://www.sslcommerz.com/) - Payment gateway
- [NativeWind](https://www.nativewind.dev/) - Styling solution
- [Redux Toolkit](https://redux-toolkit.js.org/) - State management

---

## 📞 Support

For support, email support@remart.com or open an issue on GitHub.

---

<div align="center">

**Built with ❤️ using React Native**

[⬆ Back to Top](#️-remart---react-native-e-commerce-application)

</div>
