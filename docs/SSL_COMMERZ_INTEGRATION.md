# SSLCommerz Payment Gateway Integration

This document explains how to set up and use SSLCommerz payment gateway in the ReMart application.

## Setup Instructions

### 1. Environment Variables
Create/update your `.env` file with the following variables:

```env
SSL_COMMERZ_STORE_ID=your_sslcommerz_store_id
SSL_COMMERZ_STORE_PASSWORD=your_sslcommerz_store_password
SSL_COMMERZ_SANDBOX=true  # Set to 'false' for production
```

### 2. Get SSLCommerz Credentials
1. Register for an SSLCommerz merchant account
2. Get your Store ID and Store Password from the SSLCommerz dashboard
3. For development/testing, you can use the sandbox credentials

### 3. Dependencies
The following dependencies are required:
- `axios` - for making HTTP requests
- `react-native-webview` - for displaying the payment page
- `react-native-dotenv` - for environment variable management

## Configuration

### API Service
The `utils/apiService.ts` file contains:
- `sslCommerzService.initiatePayment()` - Initiates a payment session
- `sslCommerzService.validatePayment()` - Validates a completed payment

### Payment Helper
The `utils/sslCommerzHelper.ts` file contains:
- `initiateSSLCommerzPayment()` - Handles payment initiation with proper error handling

### Checkout Flow
In `screens/CheckoutScreen.tsx`:
1. User fills out checkout form
2. On payment submission, SSLCommerz payment is initiated
3. A WebView opens showing the SSLCommerz payment page
4. After payment completion, user is redirected back to the app
5. Success, failure, or cancellation is handled appropriately

## Testing with Sandbox

SSLCommerz provides test cards for sandbox testing:

| Card Type | Card Number | Expiry | CVV |
|-----------|-------------|--------|-----|
| Visa | 4111111111111111 | Any future date | 123 |
| Mastercard | 5111111111111118 | Any future date | 123 |
| Amex | 371449635398431 | Any future date | 1237 |

## Security Notes

- Never commit your actual SSLCommerz credentials to the repository
- Use the `.env` file to store sensitive information
- In production, make sure `SSL_COMMERZ_SANDBOX` is set to `false`
- SSLCommerz transactions are secured with encryption

## Troubleshooting

1. **Payment page doesn't load**: Check your internet connection and SSLCommerz credentials
2. **Invalid credentials error**: Verify your Store ID and Store Password
3. **Redirect not working**: Ensure your success/failure/cancel URLs are correctly configured in the SSLCommerz dashboard
4. **CORS issues**: These are typically resolved by using the WebView component

## Production Deployment

Before deploying to production:
1. Change `SSL_COMMERZ_SANDBOX` to `false`
2. Use production SSLCommerz credentials
3. Update the success/failure/cancel URLs to your production URLs
4. Test thoroughly with real payment methods