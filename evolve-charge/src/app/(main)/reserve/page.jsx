'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { db } from '../../firebaseConfig.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// Digital Wallet Buttons Component
function DigitalWalletButtons({ onPaymentSuccess, isProcessing, setIsProcessing }) {
  return (
    <div className="space-y-3 mb-4">
      <button
        type="button"
        disabled={isProcessing}
        className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium text-base flex items-center justify-center space-x-2 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.88 5.63c-.4-.4-.93-.63-1.49-.63H5.61c-.56 0-1.09.23-1.49.63-.4.4-.63.93-.63 1.49v9.76c0 .56.23 1.09.63 1.49.4.4.93.63 1.49.63h12.78c.56 0 1.09-.23 1.49-.63.4-.4.63-.93.63-1.49V7.12c0-.56-.23-1.09-.63-1.49zm-1.49 1.49v9.76H5.61V7.12h12.78z"/>
          <path d="M8.83 10.28c0-.39.31-.7.7-.7h.93c.39 0 .7.31.7.7v3.44c0 .39-.31.7-.7.7H9.53c-.39 0-.7-.31-.7-.7v-3.44zm4.74 0c0-.39.31-.7.7-.7h.93c.39 0 .7.31.7.7v3.44c0 .39-.31.7-.7.7h-.93c-.39 0-.7-.31-.7-.7v-3.44z"/>
        </svg>
        <span>Pay with Apple Pay</span>
      </button>
      
      <button
        type="button"
        disabled={isProcessing}
        className="w-full bg-white border-2 border-gray-200 text-gray-800 py-3 px-4 rounded-xl font-medium text-base flex items-center justify-center space-x-2 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>Pay with Google Pay</span>
      </button>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-gray-500 font-medium">Or pay with card</span>
        </div>
      </div>
    </div>
  );
}

// Checkout Form Component
function CheckoutForm({ onSuccess, isProcessing, setIsProcessing, setError, formData }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      setErrorMessage('Payment system not initialized.');
      return false;
    }

    // Validate form data before payment
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.agreeTerms) {
      setErrorMessage('Please complete all required fields.');
      return false;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/reserve/success` },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        setIsProcessing(false);
        return false;
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        await onSuccess(paymentIntent);
        return true;
      } else {
        setErrorMessage('Payment did not complete successfully.');
        setIsProcessing(false);
        return false;
      }
    } catch (err) {
      setErrorMessage('Payment failed. Please try again.');
      setIsProcessing(false);
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <PaymentElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#1f2937',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              '::placeholder': { color: '#9ca3af' },
              iconColor: '#059669',
            },
          },
        }}
      />
      
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center space-x-2"
        >
          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
        </motion.div>
      )}
      
      <motion.button
        type="button"
        onClick={handlePayment}
        disabled={!stripe || isProcessing}
        whileHover={{ scale: isProcessing ? 1 : 1.02 }}
        whileTap={{ scale: isProcessing ? 1 : 0.98 }}
        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center min-h-[56px]"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Securing Your Spot...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Reserve Now • $4.99</span>
          </>
        )}
      </motion.button>
    </div>
  );
}

export default function ReservePage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    agreeTerms: false,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [clientSecret, setClientSecret] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Dynamic data for social proof and urgency
  const fastChargingCost = 32; // Full session cost for anchoring
  const reservationsToday = 127;
  const localDrivers = 89;
  const cityName = "your area";

  // Create payment intent on mount
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: 499, // $4.99 in cents
            metadata: { type: 'reservation' },
          }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API request failed: ${errorText}`);
        }
        const { clientSecret } = await response.json();
        if (!clientSecret) throw new Error('No clientSecret returned');
        setClientSecret(clientSecret);
      } catch (err) {
        setError('Unable to initialize secure payment. Please refresh and try again.');
        console.error(err);
      }
    };

    createPaymentIntent();
  }, []);

  // Real-time validation
  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    
    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          errors.fullName = 'Full name is required';
        } else if (value.trim().split(' ').length < 2) {
          errors.fullName = 'Please enter both first and last name';
        } else {
          delete errors.fullName;
        }
        break;
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address';
        } else {
          delete errors.email;
        }
        break;
      case 'agreeTerms':
        if (!value) {
          errors.agreeTerms = 'Please agree to continue';
        } else {
          delete errors.agreeTerms;
        }
        break;
    }
    
    setValidationErrors(errors);
  };

  // Handle input changes with real-time validation
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue,
    });
    
    // Real-time validation
    validateField(name, newValue);
  };

  // Handle payment success
  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const [firstName, ...lastNameParts] = formData.fullName.trim().split(' ');
      const lastName = lastNameParts.join(' ') || '';
      
      const reservationData = {
        firstName,
        lastName,
        fullName: formData.fullName,
        email: formData.email,
        paymentIntentId: paymentIntent.id,
        status: 'confirmed',
        reservationDate: serverTimestamp(),
        amount: 4.99,
      };
      
      const reservationRef = await addDoc(collection(db, 'reservations'), reservationData);
      
      // Send confirmation email
      await fetch('/api/send-reserve-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          reservationNumber: `EV-${reservationRef.id.slice(-6).toUpperCase()}`,
          firstName,
          fullName: formData.fullName,
        }),
      });
      
      router.push(`/reserve/success?reservationId=${reservationRef.id}&name=${encodeURIComponent(firstName)}`);
    } catch (err) {
      setError('Reservation confirmed but email notification failed. Please contact support with your payment confirmation.');
      console.error(err);
    }
  };

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#059669',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#dc2626',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        spacingUnit: '4px',
        borderRadius: '12px',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-emerald-50">
      <div className="max-w-md mx-auto px-4 py-8">
        
        {/* Header Section with Anchoring and Social Proof */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mt-20 mb-8"
        >
          
          <motion.h1
            variants={fadeIn}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight"
          >
            <span className="text-emerald-600">Reserve now</span>
          </motion.h1>

          <motion.div variants={fadeIn} className="flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <span className="font-medium">Become an early adopter of the Next Generation</span>
            </div>
            {/* <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{reservationsToday} reserved today</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{localDrivers} from {cityName}</span>
            </div> */}
          </motion.div>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          variants={slideUp}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            
            {/* Form Fields */}
            <div className="space-y-5 mb-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  autoComplete="name"
                  required
                  className={`w-full px-4 py-3 text-gray-900 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-base ${
                    validationErrors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder="Full Name Here"
                />
                {validationErrors.fullName && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-600 mt-1 flex items-center space-x-1"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{validationErrors.fullName}</span>
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  autoComplete="email"
                  required
                  className={`w-full px-4 py-3 text-gray-900 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-base ${
                    validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'
                  }`}
                  placeholder="your@email.com"
                />
                {validationErrors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-600 mt-1 flex items-center space-x-1"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{validationErrors.email}</span>
                  </motion.p>
                )}
              </div>
            </div>

            {/* Payment Section */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Secure Payment</h3>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-xs text-gray-600 font-medium">256-bit SSL</span>
                </div>
              </div>
              
              {clientSecret ? (
                <Elements options={options} stripe={stripePromise}>
                  {/* <DigitalWalletButtons 
                    onPaymentSuccess={handlePaymentSuccess}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                  /> */}
                  <CheckoutForm
                    onSuccess={handlePaymentSuccess}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                    setError={setError}
                    formData={formData}
                  />
                </Elements>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin h-6 w-6 border-2 border-emerald-500 rounded-full border-t-transparent mx-auto"></div>
                  <p className="text-gray-600 text-sm mt-3">Initializing secure payment...</p>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-start space-x-3">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  required
                  className={`h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-0.5 ${
                    validationErrors.agreeTerms ? 'border-red-300' : ''
                  }`}
                />
                <label htmlFor="agreeTerms" className="text-xs text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <a href="/terms" className="text-emerald-600 hover:text-emerald-700 underline">Terms of Service</a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-emerald-600 hover:text-emerald-700 underline">Privacy Policy</a>.
                </label>
              </div>
              {validationErrors.agreeTerms && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-600 mt-1 ml-7"
                >
                  {validationErrors.agreeTerms}
                </motion.p>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
              >
                {error}
              </motion.div>
            )}
          </div>

          {/* Trust Indicators Footer */}
          <div className="bg-gray-50 px-6 py-4 sm:px-8">
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Priority access guaranteed</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>100% refundable</span>
              </div>
            </div>
            <div className="text-center mt-3">
              <p className="text-xs text-gray-500">
                Secured by <span className="font-semibold text-gray-700">Stripe</span> • 
                PCI DSS Level 1 Certified • Bank-grade encryption
              </p>
            </div>
          </div>
        </motion.div>

        {/* Additional Trust Signals */}
        <motion.div 
          variants={fadeIn}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>HTTPS Secured</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
              </svg>
              <span>Privacy Protected</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}