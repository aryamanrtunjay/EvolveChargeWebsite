"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { db } from '../../firebaseConfig.js';
import { collection, addDoc, doc, serverTimestamp, query, orderBy, limit, getDocs, where, getFirestore } from 'firebase/firestore';
import { Heart, Users, Zap, Target, TrendingUp, Award, Gift, Shield, CheckCircle, ArrowRight, DollarSign, Globe } from 'lucide-react';

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
          return_url: `${window.location.origin}/support`,
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
      const pdfData = {
        firstName: donationDetails.firstName || 'Donor',
        lastName: donationDetails.lastName || '',
        amount: donationAmount ? donationAmount.toFixed(2) : '0.00',
        donationId: donationDetails.donationId || 'UNKNOWN',
        donationDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        dedicateTo: donationDetails.dedicateTo || null,
      };

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
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-6">
            Your donation of ${donationAmount ? donationAmount.toFixed(2) : '0.00'} will help advance wireless EV charging and sustainable transportation.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-700">
              You'll receive a receipt via email shortly. Download your receipt below for your records.
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

export default function SupportUsPage() {
  // Donation form states
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

  // Donor stats states
  const [donorsWithAmounts, setDonorsWithAmounts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalPreOrders, setTotalPreOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [filter, setFilter] = useState('recent');

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];
  const progress = (totalAmount / 10000) * 100;

  const impactData = [
    {
      amount: 25,
      impact: "Supports EVolve Charge's research and development to build innovative charging solutions",
    },
    {
      amount: 50,
      impact: "Funds development of smart charging software",
    },
    {
      amount: 100,
      impact: "Contributes to scalable wireless charging prototypes",
    },
    {
      amount: 250,
      impact: "Helps deploy charging solutions in underserved areas",
    },
    {
      amount: 500,
      impact: "Advances partnerships for global EV infrastructure",
    },
    {
      amount: 1000,
      impact: "Drives large-scale adoption of wireless EV charging",
    }
  ];

  // Load donor data and revenue
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setStatsError(null);

      try {
        const db = getFirestore();
        
        // Fetch orders data
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        let preOrderSum = 0;
        ordersSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.paymentStatus === "Completed" && data.total) {
            preOrderSum += data.total;
          }
        });
        setTotalPreOrders(preOrderSum);

        // Fetch donations data
        const donationsSnapshot = await getDocs(collection(db, "donations"));
        let donationSum = 0;
        donationsSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.status === "Completed" && data.amount) {
            donationSum += data.amount;
          }
        });
        setTotalDonations(donationSum);

        // Calculate total amount
        const total = preOrderSum + donationSum;
        setTotalAmount(total);

        // Load donors for display
        let donorsQuery;
        const donorsRef = collection(db, 'donors');

        // Set up query based on filter
        switch (filter) {
          case 'recent':
            donorsQuery = query(donorsRef, orderBy('createdAt', 'desc'), limit(50));
            break;
          case 'top-day':
            const dayAgo = new Date();
            dayAgo.setDate(dayAgo.getDate() - 1);
            donorsQuery = query(donorsRef, where('createdAt', '>=', dayAgo), orderBy('createdAt', 'desc'));
            break;
          case 'top-month':
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            donorsQuery = query(donorsRef, where('createdAt', '>=', monthAgo), orderBy('createdAt', 'desc'));
            break;
          case 'top-all':
            donorsQuery = query(donorsRef, orderBy('createdAt', 'desc'));
            break;
          default:
            donorsQuery = query(donorsRef, orderBy('createdAt', 'desc'), limit(50));
        }

        const donorsSnapshot = await getDocs(donorsQuery);

        // Create maps for efficient lookup
        const donorsMap = new Map();
        donorsSnapshot.docs.forEach(doc => {
          donorsMap.set(doc.id, { id: doc.id, ...doc.data() });
        });

        const donorAmounts = new Map();

        donationsSnapshot.docs.forEach(doc => {
          const donation = doc.data();
          const donorId = donation.donorId;
          const amount = donation.amount || 0;
          
          if (donorAmounts.has(donorId)) {
            donorAmounts.set(donorId, donorAmounts.get(donorId) + amount);
          } else {
            donorAmounts.set(donorId, amount);
          }
        });

        // Combine donor info with amounts
        const donorsWithAmountsArray = Array.from(donorsMap.values())
          .map(donor => ({
            ...donor,
            amount: donorAmounts.get(donor.id) || 0
          }))
          .filter(donor => donor.amount > 0);

        // Sort based on filter
        if (filter.startsWith('top-')) {
          donorsWithAmountsArray.sort((a, b) => b.amount - a.amount);
        }

        setDonorsWithAmounts(donorsWithAmountsArray);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setStatsError('Failed to load data');
        setIsLoading(false);
      }
    };

    loadData();
  }, [filter]);

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

  const prepareDonation = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(getCurrentAmount() * 100),
          metadata: {
            email: formData.email,
            donationType: 'one-time',
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
      const { clientSecret } = responseData;

      if (!clientSecret) {
        throw new Error('No clientSecret returned from API');
      }

      setClientSecret(clientSecret);
      setDonationDetails({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dedicateTo: formData.dedicateGift ? formData.dedicateTo : null,
      });
      setIsProcessing(false);
    } catch (err) {
      setError(`Failed to prepare donation: ${err.message}`);
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const zipCode = formData.zipCode ? parseInt(formData.zipCode, 10) : null;
      if (formData.zipCode && (isNaN(zipCode) || zipCode <= 0)) {
        throw new Error('Invalid ZIP code');
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

      const donationData = {
        amount: getCurrentAmount(),
        donationType: 'one-time',
        status: 'Completed',
        donationDate: serverTimestamp(),
        donorId: donorId,
        paymentMethod: 'credit',
        paymentStatus: 'Succeeded',
        paymentIntentId: paymentIntent.id,
        paymentDate: serverTimestamp(),
      };

      const donationRef = await addDoc(collection(db, 'donations'), donationData);
      const donationId = donationRef.id;

      setDonationId(donationId);
      setDonationDetails({
        donorId: donorId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        donationId: `DON-${donationId}`,
        dedicateTo: formData.dedicateGift ? formData.dedicateTo : null,
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

      window.scrollTo(0, 0);
      setStep(step + 1);

      if (step + 1 === 3) {
        await prepareDonation();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={fadeIn}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full text-sm font-medium text-teal-800 mb-6">
              <Heart className="w-4 h-4 mr-2" />
              Join Our Mission
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-teal-800 to-cyan-800 bg-clip-text text-transparent mb-8">
              Support the Future of
              <br />
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Wireless EV Charging
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-12 leading-relaxed">
              Your donation powers EVolve Charge's mission to develop cutting-edge wireless charging technology, making electric vehicles more accessible and sustainable for everyone.
            </p>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 mb-8">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-teal-500" />
                Secure payments via Stripe
              </div>
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-teal-500" />
                100% goes to EV innovation
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-teal-500" />
                Global impact initiative
              </div>
            </div>
          </motion.div>

          {/* Impact Stats Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
          >
            <motion.div variants={fadeIn} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center hover:scale-105 transition-all duration-300">
              <DollarSign className="w-8 h-8 text-teal-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(0)}</div>
              <div className="text-sm text-gray-600">Total Raised</div>
              <div className="text-xs text-gray-500 mt-1">
                Donations: ${totalDonations.toFixed(0)} • Pre-orders: ${totalPreOrders.toFixed(0)}
              </div>
            </motion.div>
            
            <motion.div variants={fadeIn} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center hover:scale-105 transition-all duration-300">
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">$10,000</div>
              <div className="text-sm text-gray-600">Funding Goal</div>
            </motion.div>
            
            <motion.div variants={fadeIn} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center hover:scale-105 transition-all duration-300">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">{donorsWithAmounts.length}</div>
              <div className="text-sm text-gray-600">Supporters</div>
            </motion.div>
            
            <motion.div variants={fadeIn} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center hover:scale-105 transition-all duration-300">
              <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <div className="text-2xl font-bold text-gray-900">{progress.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </motion.div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
              <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full"
                />
              </div>
              <div className="text-center text-gray-700 font-medium">
                {progress.toFixed(1)}% of our $10,000 goal • ${(10000 - totalAmount).toFixed(0)} remaining
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Always show amount selection and community section */}
          {/* Donation Form - Amount Selection */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Impact</h2>
              <p className="text-xl text-gray-600">Every contribution accelerates the future of wireless EV charging</p>
            </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div variants={slideInLeft} className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Suggested Amounts</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                      {predefinedAmounts.map((amount) => (
                        <button
                          key={amount}
                          onClick={() => handleAmountSelect(amount)}
                          className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                            selectedAmount === amount && !customAmount
                              ? 'border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-700 shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:shadow-md'
                          }`}
                        >
                          <div className="text-3xl font-bold">${amount}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {impactData.find(item => item.amount === amount)?.icon}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Custom Amount</h3>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-xl">$</span>
                        </div>
                        <input
                          type="text"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          placeholder="Enter amount"
                          className="w-full text-black pl-10 pr-4 py-4 text-xl border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const amount = getCurrentAmount();
                        if (amount <= 0) {
                          alert('Please select or enter a donation amount');
                          return;
                        }
                        // Redirect to donate page with amount as URL parameter
                        window.location.href = `/donate?amount=${amount}`;
                      }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center"
                    >
                      Continue with ${getCurrentAmount().toFixed(2)}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={slideInRight} className="lg:col-span-1">
                  <div className="sticky top-8 space-y-6">
                    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Your Impact</h3>
                      <div className="text-center">
                        <div className="text-5xl mb-3">{getCurrentImpact().icon}</div>
                        <div className="text-3xl font-bold text-teal-600 mb-3">
                          ${getCurrentAmount().toFixed(2)}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {getCurrentImpact().impact}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Our Mission</h3>
                      <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-start">
                          <Zap className="w-4 h-4 text-teal-500 mt-1 mr-3 flex-shrink-0" />
                          <p>Develop innovative smart EV charging solutions</p>
                        </div>
                        <div className="flex items-start">
                          <Globe className="w-4 h-4 text-teal-500 mt-1 mr-3 flex-shrink-0" />
                          <p>Make electric vehicle ownership more accessible</p>
                        </div>
                        <div className="flex items-start">
                          <Heart className="w-4 h-4 text-teal-500 mt-1 mr-3 flex-shrink-0" />
                          <p>Reduce carbon emissions through sustainable technology</p>
                        </div>
                        <div className="flex items-start">
                          <Target className="w-4 h-4 text-teal-500 mt-1 mr-3 flex-shrink-0" />
                          <p>Ensure you never run out of charge again</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          

          {step === 2 && (
            // Donor Information Form
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
              <motion.div variants={fadeIn} className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Information</h2>
                <p className="text-lg text-gray-700">Help us send your receipt and keep you updated on our progress</p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div variants={slideInLeft} className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                            validationErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                            validationErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full text-black px-4 py-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all ${
                          validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-6 mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Gift Options</h4>
                      
                      <div className="mb-4">
                        <div className="flex items-start">
                          <input
                            id="dedicateGift"
                            name="dedicateGift"
                            type="checkbox"
                            checked={formData.dedicateGift}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500 mt-1"
                          />
                          <div className="ml-3">
                            <label htmlFor="dedicateGift" className="font-medium text-gray-700">
                              Dedicate this gift in honor or memory of someone
                            </label>
                          </div>
                        </div>
                      </div>

                      {formData.dedicateGift && (
                        <div className="mb-4">
                          <label htmlFor="dedicateTo" className="block text-sm font-medium text-gray-700 mb-2">
                            In honor/memory of
                          </label>
                          <input
                            type="text"
                            id="dedicateTo"
                            name="dedicateTo"
                            value={formData.dedicateTo}
                            onChange={handleInputChange}
                            placeholder="Enter name"
                            className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          />
                        </div>
                      )}

                      <div className="mb-4">
                        <div className="flex items-start">
                          <input
                            id="anonymous"
                            name="anonymous"
                            type="checkbox"
                            checked={formData.anonymous}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500 mt-1"
                          />
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
                          <input
                            id="updates"
                            name="updates"
                            type="checkbox"
                            checked={formData.updates}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500 mt-1"
                          />
                          <div className="ml-3">
                            <label htmlFor="updates" className="font-medium text-gray-700">
                              Send me updates about EVolve Charge's progress
                            </label>
                            <p className="text-sm text-gray-500 mt-1">
                              Stay informed about our wireless EV charging innovations
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-start">
                          <input
                            id="agreeTerms"
                            name="agreeTerms"
                            type="checkbox"
                            checked={formData.agreeTerms}
                            onChange={handleInputChange}
                            className={`h-4 w-4 text-teal-500 border rounded focus:ring-teal-500 mt-1 ${
                              validationErrors.agreeTerms ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                          <div className="ml-3">
                            <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                              I agree to the Terms of Service and Privacy Policy *
                            </label>
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
                        className="w-1/3 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                      >
                        Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] flex items-center justify-center"
                      >
                        Continue to Payment
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </button>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={slideInRight} className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-28 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Donation Summary</h3>
                    
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Donation Amount</span>
                        <span className="text-xl font-semibold text-gray-900">
                          ${getCurrentAmount().toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between items-center font-bold text-xl">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">${getCurrentAmount().toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Where Your Money Goes</h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between">
                          <span>Research & Development</span>
                          <span>70%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Manufacturing</span>
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
                      <div className="mt-4 p-3 bg-teal-50 rounded-lg border border-teal-100">
                        <p className="text-xs text-teal-700">
                          <strong>Total funding includes:</strong> Direct donations (${totalDonations.toFixed(0)}) + Pre-order revenue (${totalPreOrders.toFixed(0)})
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            // Payment Step
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
              <motion.div variants={fadeIn} className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Donation</h2>
                <p className="text-lg text-gray-700">Your support drives the future of wireless EV charging</p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div variants={slideInLeft} className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="flex items-center bg-blue-50 p-6 rounded-lg border border-blue-100 mb-6">
                      <Shield className="h-8 w-8 text-blue-600 mr-4" />
                      <div>
                        <p className="text-base font-semibold text-gray-900">
                          Your Payment is Safe and Secure
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          We use Stripe for secure payment processing with 256-bit SSL encryption
                        </p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Information</h3>
                    
                    {error && (
                      <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
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
                  </div>
                </motion.div>

                <motion.div variants={slideInRight} className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-28 border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Final Summary</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Donation Amount</span>
                        <span className="font-semibold">${getCurrentAmount().toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between font-bold text-xl">
                          <span>Total</span>
                          <span className="text-teal-600">${getCurrentAmount().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                      <h4 className="font-medium text-teal-900 mb-2">Thank You!</h4>
                      <p className="text-sm text-teal-700">
                        Your contribution helps accelerate sustainable transportation technology
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Community Section - Always visible */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="mt-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div variants={slideInLeft} className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                        Our Amazing Supporters
                      </span>
                    </h2>
                    <p className="text-lg text-gray-600">
                      Thank you to everyone helping us revolutionize EV charging
                    </p>
                  </div>

                  <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    {[
                      { label: "Total Raised", value: `${totalAmount.toFixed(2)}`, color: "text-teal-600", icon: DollarSign },
                      { label: "Goal", value: "$10,000", color: "text-gray-900", icon: Target },
                      { label: "Progress", value: `${progress.toFixed(1)}%`, color: "text-teal-600", icon: TrendingUp },
                    ].map(({ label, value, color, icon: Icon }) => (
                      <motion.div
                        key={label}
                        variants={fadeIn}
                        className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md border border-gray-100 text-center hover:shadow-lg transition-all"
                      >
                        <Icon className="w-6 h-6 mx-auto mb-2 text-teal-500" />
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                        <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
                      </motion.div>
                    ))}
                  </motion.div>

                  <div className="max-w-lg mx-auto mb-8">
                    <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-400 to-cyan-400"
                      />
                    </div>
                    <div className="mt-2 text-sm font-semibold text-gray-700 text-center">
                      {progress.toFixed(1)}% of our $10,000 goal
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        // Redirect to donate page with default amount
                        window.location.href = `/donate?amount=50`;
                      }}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center"
                    >
                      <Gift className="w-5 h-5 mr-2" />
                      Join Our Supporters
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={slideInRight} className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-h-[600px] flex flex-col">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[
                        { label: "Recent", value: "recent" },
                        { label: "Top (Day)", value: "top-day" },
                        { label: "Top (Month)", value: "top-month" },
                        { label: "Top (All Time)", value: "top-all" },
                      ].map(({ label, value }) => (
                        <button
                          key={value}
                          onClick={() => setFilter(value)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                            filter === value 
                              ? 'bg-teal-500 text-white shadow-md' 
                              : 'bg-gray-100 text-gray-700 hover:bg-teal-100'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-teal-500" />
                      Our Donors
                    </h3>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="animate-spin h-6 w-6 border-2 border-teal-500 rounded-full border-t-transparent mb-2"></div>
                        <p className="text-gray-600 text-sm">Loading supporters...</p>
                      </div>
                    ) : statsError ? (
                      <p className="text-red-600 text-center text-sm">{statsError}</p>
                    ) : donorsWithAmounts.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600 text-sm">No supporters yet. Be the first to join our mission!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {donorsWithAmounts.slice(0, 10).map((donor) => (
                          <motion.div
                            key={donor.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-b border-gray-100 pb-4 last:border-b-0 hover:bg-gray-50 p-3 rounded-lg transition-all"
                          >
                            <div className="flex items-start">
                              <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                <Users className="w-5 h-5 text-teal-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                  {donor.anonymous ? 'Anonymous Supporter' : `${donor.firstName} ${donor.lastName}`}
                                </p>
                                <p className="text-teal-600 font-semibold text-sm">Donated ${donor.amount.toFixed(2)}</p>
                                {donor.dedicateTo && (
                                  <p className="text-gray-500 italic text-xs truncate">
                                    In honor of: {donor.dedicateTo}
                                  </p>
                                )}
                                <p className="text-gray-400 text-xs">
                                  {donor.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  }) || 'Recently'}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Success Modal - Remove since payments happen on donate page */}
    </div>
  );
}