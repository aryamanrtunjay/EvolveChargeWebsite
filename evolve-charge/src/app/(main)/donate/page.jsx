'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { db } from '../../firebaseConfig.js';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
};

// Checkout Form Component
function CheckoutForm({ onSuccess, amount, isProcessing, setIsProcessing, setError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      setErrorMessage('Payment system not initialized. Please try again.');
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donate`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message);
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      } else {
        setErrorMessage('Payment did not complete. Please try again.');
        setIsProcessing(false);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <PaymentElement />
      </div>
      
      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-md hover:shadow-lg transition-all flex justify-center items-center disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          `Donate $${amount.toFixed(2)}`
        )}
      </button>
    </form>
  );
}

// Success Modal Component
function SuccessModal({ isOpen, onClose, donationAmount, donationDetails }) {
  if (!isOpen) return null;

  const generatePDF = async () => {
    try {
      // Ensure all required fields are present
      const pdfData = {
        firstName: donationDetails.firstName || 'Donor',
        lastName: donationDetails.lastName || '',
        amount: donationAmount ? donationAmount.toFixed(2) : '0.00',
        donationId: donationDetails.donationId || 'UNKNOWN',
        donationDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        dedicateTo: donationDetails.dedicateTo || null,
      };

      console.log('Generating PDF with data:', pdfData);

      const response = await fetch('/api/generate-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pdfData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate PDF: ${response.status} - ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `EvolveCharge_Receipt_${donationDetails.donationId || 'UNKNOWN'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert(`Error generating PDF: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-6">
            Your tax-deductible donation of ${donationAmount ? donationAmount.toFixed(2) : '0.00'} will help advance wireless EV charging and sustainable transportation.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              You'll receive a receipt via email shortly. Download your tax-deductible receipt below for your records.
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <button
              onClick={generatePDF}
              className="w-full py-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:shadow-md transition-all"
            >
              Download Receipt
            </button>
            <div className="flex space-x-4">
              <button
                onClick={() => window.location.href = '/'}
                className="w-1/2 py-2 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-all"
              >
                Back to Home
              </button>
              <button
                onClick={onClose}
                className="w-1/2 py-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:shadow-md transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function DonationsPage() {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    city: '',
    state: '',
    zipCode: '',
    dedicateGift: false,
    dedicateTo: '',
    anonymous: false,
    updates: true,
    agreeTerms: false
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [clientSecret, setClientSecret] = useState('');
  const [donationId, setDonationId] = useState('');
  const [error, setError] = useState(null);
  const [donationDetails, setDonationDetails] = useState({
    donorId: '',
    firstName: '',
    lastName: '',
    donationId: '',
    dedicateTo: null,
  });

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];

  const impactData = [
    {
      amount: 25,
      impact: "Supports research into wireless charging efficiency",
      icon: "🔬"
    },
    {
      amount: 50,
      impact: "Funds development of smart charging software",
      icon: "💻"
    },
    {
      amount: 100,
      impact: "Contributes to scalable wireless charging prototypes",
      icon: "⚙️"
    },
    {
      amount: 250,
      impact: "Helps deploy charging solutions in underserved areas",
      icon: "🏙️"
    },
    {
      amount: 500,
      impact: "Advances partnerships for global EV infrastructure",
      icon: "🤝"
    },
    {
      amount: 1000,
      impact: "Drives large-scale adoption of wireless EV charging",
      icon: "⚡"
    }
  ];

  const getCurrentAmount = () => {
    return customAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  };

  const getCurrentImpact = () => {
    const amount = getCurrentAmount();
    const impact = impactData.find(item => item.amount <= amount);
    return impact || impactData[0];
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the Terms and Privacy Policy';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(0);
    }
  };

  const handleSliderChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount(0);
  };

  const prepareDonation = async (donorId) => {
    setIsProcessing(true);
    setError(null);

    try {
      if (!donorId) {
        throw new Error('Donor ID is missing. Please try again.');
      }

      const donationData = {
        amount: getCurrentAmount(),
        donationType: 'one-time',
        status: 'Pending',
        donationDate: serverTimestamp(),
        donorId: donorId,
        paymentMethod: 'credit',
        paymentStatus: 'Pending',
      };

      const donationRef = await addDoc(collection(db, 'donations'), donationData);
      const donationId = donationRef.id;

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(getCurrentAmount() * 100),
          metadata: {
            donorId: donorId,
            email: formData.email,
            donationType: 'one-time',
            donationId: `DON-${donationId}`,
            firstName: formData.firstName,
            lastName: formData.lastName,
            dedicateTo: formData.dedicateGift ? formData.dedicateTo : null,
            anonymous: formData.anonymous,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      const { clientSecret, metadata } = responseData;

      if (!clientSecret) {
        throw new Error('No clientSecret returned from API');
      }

      const paymentIntentId = clientSecret.split('_secret')[0];

      await updateDoc(doc(db, 'donations', donationId), {
        paymentIntentId,
      });

      setDonationId(donationId);
      setClientSecret(clientSecret);
      setDonationDetails({
        donorId: donorId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        donationId: metadata.donationId,
        dedicateTo: metadata.dedicateTo,
      });
      setIsProcessing(false);
    } catch (err) {
      setError(`Failed to prepare donation: ${err.message}`);
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      await updateDoc(doc(db, 'donations', donationId), {
        status: 'Completed',
        paymentStatus: 'Succeeded',
        paymentDate: serverTimestamp(),
      });

      const emailResponse = await fetch('/api/send-donation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          donationId: `DON-${donationId}`,
          amount: getCurrentAmount().toFixed(2),
          firstName: formData.firstName,
          lastName: formData.lastName,
          donationType: 'one-time',
          dedicateTo: formData.dedicateGift ? formData.dedicateTo : null,
          anonymous: formData.anonymous,
          donationDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        }),
      });

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.error(`Failed to send donation email: ${emailResponse.status} - ${errorText}`);
      }

      setIsProcessing(false);
      setShowSuccess(true);
    } catch (error) {
      setError(`Failed to finalize donation: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      if (getCurrentAmount() <= 0) {
        alert('Please select or enter a donation amount');
        return;
      }
      window.scrollTo(0, 0);
      setStep(step + 1);
    } else if (step === 2) {
      if (!validateForm()) {
        const firstErrorField = Object.keys(validationErrors)[0];
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
        return;
      }

      try {
        const zipCode = formData.zipCode ? parseInt(formData.zipCode, 10) : null;
        if (formData.zipCode && (isNaN(zipCode) || zipCode <= 0)) {
          setValidationErrors({ ...validationErrors, zipCode: 'Invalid ZIP code' });
          return;
        }

        const donorData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          address1: formData.address1 || null,
          city: formData.city || null,
          state: formData.state || null,
          zipCode: zipCode || null,
          dedicateGift: formData.dedicateGift,
          dedicateTo: formData.dedicateGift ? formData.dedicateTo : null,
          anonymous: formData.anonymous,
          updates: formData.updates,
          createdAt: serverTimestamp(),
        };

        const donorRef = await addDoc(collection(db, 'donors'), donorData);
        const donorId = donorRef.id;

        setDonationDetails({
          ...donationDetails,
          donorId: donorId,
          firstName: formData.firstName,
          lastName: formData.lastName,
        });

        window.scrollTo(0, 0);
        setStep(step + 1);

        if (step + 1 === 3) {
          await prepareDonation(donorId);
        }
      } catch (err) {
        setError(`Failed to save donor information: ${err.message}`);
      }
    }
  };

  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep(step - 1);
  };

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0d9488',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeIn}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Accelerate the Future of
            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent"> Wireless EV Charging</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Your tax-deductible donation powers Evolve Charge’s mission to develop cutting-edge wireless charging technology, making electric vehicles more accessible and sustainable for all.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
              Tax-deductible
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
              Secure payments
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-teal-500 rounded-full mr-2"></div>
              Supports EV innovation
            </div>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between mb-4">
            {['Amount', 'Your Information', 'Payment'].map((label, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step > index + 1 
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white' 
                    : step === index + 1 
                      ? 'bg-white border-2 border-teal-500 text-teal-500' 
                      : 'bg-white border border-gray-300 text-gray-300'
                }`}>
                  {step > index + 1 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className={`text-xs mt-2 ${
                  step >= index + 1 ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="relative h-1 bg-gray-200 rounded-full">
            <div 
              className="absolute h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${(step - 1) * 50}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Donation Amount */}
        {step === 1 && (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div variants={slideInLeft} className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Impact</h2>
                  
                  {/* Predefined Amounts */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Amounts</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {predefinedAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => handleAmountSelect(amount)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedAmount === amount && !customAmount
                              ? 'border-teal-500 bg-teal-50 text-teal-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="text-2xl font-bold">${amount}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount with Slider */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Amount</h3>
                    <div className="mb-4">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        step="1"
                        value={customAmount || 0}
                        onChange={handleSliderChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${(customAmount || 0) / 1000 * 100}%, #e5e7eb ${(customAmount || 0) / 1000 * 100}%, #e5e7eb 100%)`
                        }}
                      />
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>$0</span>
                        <span>$1,000</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-lg">$</span>
                      </div>
                      <input
                        type="text"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        placeholder="Enter amount"
                        className="w-full text-black pl-8 pr-3 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    onClick={nextStep}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Continue with ${getCurrentAmount().toFixed(2)}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={slideInRight} className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Your Impact</h3>
                  <div className="text-center">
                    <div className="text-4xl mb-2">{getCurrentImpact().icon}</div>
                    <div className="text-2xl font-bold text-teal-600 mb-2">
                      ${getCurrentAmount().toFixed(2)}
                    </div>
                    <p className="text-gray-600 text-sm">
                      {getCurrentImpact().impact}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Our Mission</h3>
                  <div className="space-y-4 text-sm text-gray-700">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p>Pioneering wireless EV charging technology</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p>Simplifying EV charging for universal adoption</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p>Promoting sustainable transportation globally</p>
                    </div>
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p>Reducing carbon emissions through innovation</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Donor Information */}
        {step === 2 && (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Information</h1>
              <p className="text-lg text-gray-700">Provide your details to receive your tax-deductible receipt and updates on our wireless charging innovations.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div variants={slideInLeft} className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full text-black px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          validationErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full text-black px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          validationErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full text-black px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Gift Options</h3>
                    
                    <div className="mb-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="dedicateGift"
                            name="dedicateGift"
                            type="checkbox"
                            checked={formData.dedicateGift}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-black text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="dedicateGift" className="font-medium text-gray-700">
                            Dedicate this gift in honor or memory of someone
                          </label>
                        </div>
                      </div>
                    </div>

                    {formData.dedicateGift && (
                      <div className="mb-4">
                        <label htmlFor="dedicateTo" className="block text-sm font-medium text-gray-700 mb-1">
                          In honor/memory of
                        </label>
                        <input
                          type="text"
                          id="dedicateTo"
                          name="dedicateTo"
                          value={formData.dedicateTo}
                          onChange={handleInputChange}
                          placeholder="Enter name"
                          className="w-full text-black px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                    )}

                    <div className="mb-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="anonymous"
                            name="anonymous"
                            type="checkbox"
                            checked={formData.anonymous}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-black text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="anonymous" className="font-medium text-gray-700">
                            Make this donation anonymous
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <div className="mb-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="updates"
                            name="updates"
                            type="checkbox"
                            checked={formData.updates}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-black text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="updates" className="font-medium text-gray-700">
                            Send me updates about Evolve Charge's progress
                          </label>
                          <p className="text-sm text-gray-500">
                            Stay informed about our advancements in wireless EV charging.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="agreeTerms"
                            name="agreeTerms"
                            type="checkbox"
                            checked={formData.agreeTerms}
                            onChange={handleInputChange}
                            className={`h-4 w-4 text-teal-500 border rounded focus:ring-teal-500 ${
                              validationErrors.agreeTerms ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                            I agree to the Terms of Service and Privacy Policy *
                          </label>
                          <p className="text-sm text-gray-500 mt-1">
                            By checking this box, you consent to our{' '}
                            <a href="/terms" className="text-teal-500 hover:underline">Terms of Service</a> and{' '}
                            <a href="/privacy" className="text-teal-500 hover:underline">Privacy Policy</a>.
                          </p>
                          {validationErrors.agreeTerms && (
                            <p className="mt-1 text-red-600 text-sm">{validationErrors.agreeTerms}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={prevStep}
                      className="w-1/3 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="w-2/3 py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={slideInRight} className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-28">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Donation Summary</h2>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Donation Amount</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${getCurrentAmount().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">${getCurrentAmount().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-green-800">Tax Deductible</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Your donation is tax-deductible. You'll receive a receipt for your records.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Where Your Money Goes</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>Research & Development</span>
                        <span>70%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pilot Deployments</span>
                        <span>20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Community Outreach</span>
                        <span>5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Administrative</span>
                        <span>5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Donation</h1>
              <p className="text-lg text-gray-700">Your tax-deductible support drives the future of wireless EV charging.</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div variants={slideInLeft} className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="flex items-center bg-blue-50 p-4 rounded-lg mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-blue-700">
                      <strong>Impact:</strong> Your donation accelerates the development and deployment of wireless charging technology.
                    </p>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h2>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                      <div className="font-medium">Error:</div>
                      <div>{error}</div>
                    </div>
                  )}

                  {clientSecret ? (
                    <Elements options={stripeOptions} stripe={stripePromise}>
                      <CheckoutForm
                        onSuccess={handlePaymentSuccess}
                        amount={getCurrentAmount()}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                        setError={setError}
                      />
                    </Elements>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-teal-500 rounded-full border-t-transparent mb-4"></div>
                      <p className="text-gray-600">
                        {isProcessing ? 'Preparing your donation...' : 'Loading payment form...'}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center bg-gray-50 p-4 rounded-lg mt-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-sm text-gray-700">
                      Your payment is secure and encrypted. We never store your credit card information.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={slideInRight} className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-28">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Donation Summary</h2>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Donation Amount</span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${getCurrentAmount().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">${getCurrentAmount().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium text-green-800">Tax Deductible</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Your donation is tax-deductible. You'll receive a receipt for your records.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Where Your Money Goes</h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>Research & Development</span>
                        <span>70%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pilot Deployments</span>
                        <span>20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Community Outreach</span>
                        <span>5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Administrative</span>
                        <span>5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          donationAmount={getCurrentAmount()}
          donationDetails={donationDetails}
        />
      </div>
    </div>
  );
}