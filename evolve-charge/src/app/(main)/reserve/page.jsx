'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { db } from '../../firebaseConfig.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Script from 'next/script';
import { Lock, Shield, Star, ChevronDown } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Digital Wallet Buttons Component
function DigitalWalletButtons({ onPaymentSuccess, isProcessing, setIsProcessing }) {
  return (
    <div className="space-y-3 mb-6">
      <button
        type="button"
        disabled={isProcessing}
        className="w-full bg-[#111111] text-white py-3 px-6 rounded-full font-semibold flex items-center justify-center space-x-2 hover:brightness-110 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
        className="w-full bg-white border border-[#111111]/15 text-[#111111] py-3 px-6 rounded-full font-semibold flex items-center justify-center space-x-2 hover:bg-[#F5F6F7] transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
          <div className="w-full border-t border-[#111111]/15"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-[#6F6F6F] font-semibold">Or pay with card</span>
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
    <motion.div className="space-y-4" variants={fadeUpVariants}>
      <PaymentElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#111111',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              '::placeholder': { color: '#6F6F6F' },
              iconColor: '#EFBF04',
            },
          },
        }}
      />
      
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center space-x-2"
          >
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        type="button"
        onClick={handlePayment}
        disabled={!stripe || isProcessing}
        whileHover={{ scale: isProcessing ? 1 : 1.05 }}
        whileTap={{ scale: isProcessing ? 1 : 0.95 }}
        className="w-full py-4 px-8 bg-[#EFBF04] text-white font-semibold rounded-full hover:brightness-110 transition transform shadow-lg shadow-[#EFBF04]/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
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
            <Lock className="w-5 h-5 mr-2" />
            <span>Reserve Now • $4.99</span>
          </>
        )}
      </motion.button>
    </motion.div>
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  // Dynamic data for social proof
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
            amount: 499,
            metadata: { type: 'reservation' },
          }),
        });
        if (!response.ok) throw new Error('API request failed');
        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (err) {
        setError('Unable to initialize secure payment. Please refresh and try again.');
      }
    };
    createPaymentIntent();
  }, []);

  // Real-time validation
  const validateField = (name, value) => {
    const errors = { ...validationErrors };
    switch (name) {
      case 'fullName':
        errors.fullName = !value.trim() ? 'Full name is required' : value.trim().split(' ').length < 2 ? 'Please enter both first and last name' : null;
        break;
      case 'email':
        errors.email = !value.trim() ? 'Email address is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : null;
        break;
      case 'agreeTerms':
        errors.agreeTerms = !value ? 'Please agree to continue' : null;
        break;
    }
    setValidationErrors(errors);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
    validateField(name, newValue);
  };

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
      if (typeof window !== 'undefined' && window.twq) {
        window.twq('event', 'tw-q1blv-q1bmb', {
          value: 4.99,
          conversion_id: reservationRef.id.slice(-6).toUpperCase(),
          email_address: formData.email
        });
      }
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
      setError('Reservation confirmed but email notification failed. Please contact support.');
    }
  };

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#EFBF04',
        colorBackground: '#FFFFFF',
        colorText: '#111111',
        colorDanger: '#dc2626',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        spacingUnit: '4px',
        borderRadius: '12px',
      },
    },
  };

  return (
    <div className="bg-[#F5F6F7] text-[#111111] min-h-screen">
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('config','q1blv');
          `,
        }}
      />
      
      <motion.section
        ref={ref}
        className="py-16 px-6"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <div className="max-w-md mx-auto">
          {/* Header Section */}
          <motion.div className="text-center mb-12" variants={fadeUpVariants}>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Reserve Your <span className="text-[#EFBF04]">Spot</span>
            </h1>
            <p className="text-lg text-[#6F6F6F] max-w-md mx-auto">
              Become an early adopter of the next generation of EV charging for just $4.99.
            </p>
            <div className="flex flex-col items-center gap-2 mt-4 text-sm text-[#6F6F6F]">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#EFBF04]" />
                <span>{reservationsToday} reserved today</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#EFBF04]" />
                <span>{localDrivers} drivers from {cityName}</span>
              </div>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            className="bg-white backdrop-blur-sm rounded-2xl shadow-lg border border-[#111111]/8 p-6 sm:p-8"
            variants={fadeUpVariants}
          >
            <div className="space-y-6">
              {/* Form Fields */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-[#111111] mb-2">
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#EFBF04] focus:border-[#EFBF04] transition-all text-[#111111] ${
                    validationErrors.fullName ? 'border-red-300 bg-red-50' : 'border-[#111111]/15 bg-[#F5F6F7]'
                  }`}
                  placeholder="Full Name"
                />
                <AnimatePresence>
                  {validationErrors.fullName && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-red-600 mt-1 flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{validationErrors.fullName}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#111111] mb-2">
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#EFBF04] focus:border-[#EFBF04] transition-all text-[#111111] ${
                    validationErrors.email ? 'border-red-300 bg-red-50' : 'border-[#111111]/15 bg-[#F5F6F7]'
                  }`}
                  placeholder="your@email.com"
                />
                <AnimatePresence>
                  {validationErrors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-red-600 mt-1 flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{validationErrors.email}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Payment Section */}
              <div className="border-t border-[#111111]/15 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#111111]">Secure Payment</h3>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#EFBF04]" />
                    <span className="text-xs font-semibold text-[#6F6F6F]">256-bit SSL</span>
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
                    <div className="animate-spin h-6 w-6 border-2 border-[#EFBF04] rounded-full border-t-transparent mx-auto"></div>
                    <p className="text-[#6F6F6F] text-sm mt-3">Initializing secure payment...</p>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="pt-4">
                <div className="flex items-start gap-3">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    required
                    className={`h-4 w-4 text-[#EFBF04] border-[#111111]/15 rounded focus:ring-[#EFBF04] mt-0.5 ${
                      validationErrors.agreeTerms ? 'border-red-300' : ''
                    }`}
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-[#6F6F6F] leading-relaxed">
                    I agree to the{' '}
                    <a href="/terms" className="text-[#EFBF04] hover:text-[#B48F55] underline">Terms of Service</a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-[#EFBF04] hover:text-[#B48F55] underline">Privacy Policy</a>.
                  </label>
                </div>
                <AnimatePresence>
                  {validationErrors.agreeTerms && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-red-600 mt-1 ml-7"
                    >
                      {validationErrors.agreeTerms}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Trust Indicators Footer */}
            <div className="bg-[#F5F6F7] px-6 py-4 mt-6 rounded-xl">
              <div className="flex flex-wrap justify-center gap-4 text-xs text-[#6F6F6F]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#EFBF04]" />
                  <span>Priority access guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#EFBF04]" />
                  <span>100% refundable</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#EFBF04]" />
                  <span>Secured by Stripe</span>
                </div>
              </div>
              <p className="text-center text-xs text-[#6F6F6F] mt-3">
                PCI DSS Level 1 Certified • Bank-grade encryption
              </p>
            </div>
          </motion.div>

          {/* Additional Trust Signals */}
          <motion.div className="mt-6 text-center" variants={fadeUpVariants}>
            <div className="inline-flex flex-wrap gap-4 text-xs text-[#6F6F6F]">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-[#EFBF04]" />
                <span>HTTPS Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3 h-3 text-[#EFBF04]" />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-[#EFBF04]" />
                <span>Privacy Protected</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}