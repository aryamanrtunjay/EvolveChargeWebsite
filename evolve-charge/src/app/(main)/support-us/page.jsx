'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { db } from '../../firebaseConfig.js';
import { collection, addDoc, doc, serverTimestamp, query, orderBy, limit, getDocs, where, getFirestore } from 'firebase/firestore';
import { Heart, Users, Zap, Target, TrendingUp, Award, Gift, Shield, CheckCircle, ArrowRight, DollarSign, Globe, ArrowLeft, Clock } from 'lucide-react';
import Head from 'next/head';
import Script from 'next/script';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Simplified pattern overlay
const SubtlePattern = ({ opacity = 0.02 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <svg width="100%" height="100%" className="text-[#D4AF37]">
      <defs>
        <pattern id="supportGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="0.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#supportGrid)" />
    </svg>
  </div>
);

// Professional animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
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
          return_url: `${window.location.origin}/support-us`,
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
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Card Information
        </label>
        <PaymentElement />
      </div>
      
      {errorMessage && (
        <div className="p-4 bg-red-500/10 text-red-300 rounded-xl text-sm border border-red-500/20">
          {errorMessage}
        </div>
      )}
      
      <motion.button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold 
                 hover:shadow-md hover:shadow-[#D4AF37]/20 transition-all flex justify-center items-center disabled:opacity-50
                 focus:ring-2 focus:ring-[#D4AF37]/40"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isProcessing ? (
          <>
            <motion.div
              className="w-5 h-5 border-2 border-white rounded-full border-t-transparent mr-3"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Processing...
          </>
        ) : (
          <>
            Donate ${amount.toFixed(2)}
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </motion.button>
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
      link.download = `Ampereon_Receipt_${donationDetails.donationId || 'UNKNOWN'}.pdf`;
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1A1A1A] rounded-2xl p-8 max-w-md w-full border border-[#D4AF37]/20 shadow-xl relative"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-4">Thank You!</h3>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Your donation of ${donationAmount ? donationAmount.toFixed(2) : '0.00'} helps advance 
            smart EV charging technology and sustainable transportation.
          </p>
          <div className="bg-[#2A2A2A]/60 p-4 rounded-lg mb-6 border border-[#D4AF37]/20">
            <p className="text-sm text-gray-400">
              You'll receive a receipt via email. Download a copy below for your records.
            </p>
          </div>
          <div className="space-y-3">
            <motion.button
              onClick={generatePDF}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Download Receipt
            </motion.button>
            <div className="flex gap-3">
              <motion.button
                onClick={() => window.location.href = '/'}
                className="flex-1 py-3 rounded-lg bg-[#2A2A2A]/60 text-gray-300 font-medium 
                         hover:bg-[#2A2A2A]/80 border border-[#D4AF37]/20 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back to Home
              </motion.button>
              <motion.button
                onClick={onClose}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SupportUsPage() {
  // State management
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
  const [donationDetails, setDonationDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('recent');
  const [donorsWithAmounts, setDonorsWithAmounts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalPreOrders, setTotalPreOrders] = useState(0);

  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];
  const progress = Math.min((totalAmount / 10000) * 100, 100);

  const impactData = [
    { amount: 25, impact: "Supports Ampereon's research and development efforts", icon: "🔬" },
    { amount: 50, impact: "Funds smart charging software development", icon: "💻" },
    { amount: 100, impact: "Contributes to charging system prototypes", icon: "⚡" },
    { amount: 250, impact: "Helps expand charging solutions to more users", icon: "🌍" },
    { amount: 500, impact: "Advances partnerships for EV infrastructure", icon: "🤝" },
    { amount: 1000, impact: "Drives adoption of automatic EV charging", icon: "🚀" }
  ];

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const db = getFirestore();
        
        const [ordersSnapshot, donationsSnapshot] = await Promise.all([
          getDocs(collection(db, "orders")),
          getDocs(collection(db, "donations"))
        ]);

        let preOrderSum = 0;
        ordersSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.paymentStatus === "Completed" && data.total) {
            preOrderSum += data.total;
          }
        });

        let donationSum = 0;
        donationsSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.status === "Completed" && data.amount) {
            donationSum += data.amount;
          }
        });

        setTotalPreOrders(preOrderSum);
        setTotalDonations(donationSum);
        setTotalAmount(preOrderSum + donationSum);

        const donorsRef = collection(db, 'donors');
        let donorsQuery;

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
          default:
            donorsQuery = query(donorsRef, orderBy('createdAt', 'desc'), limit(50));
        }

        const donorsSnapshot = await getDocs(donorsQuery);
        const donorsMap = new Map();
        donorsSnapshot.docs.forEach(doc => {
          donorsMap.set(doc.id, { id: doc.id, ...doc.data() });
        });

        const donorAmounts = new Map();
        donationsSnapshot.docs.forEach(doc => {
          const donation = doc.data();
          const donorId = donation.donorId;
          const amount = donation.amount || 0;
          donorAmounts.set(donorId, (donorAmounts.get(donorId) || 0) + amount);
        });

        const donorsWithAmountsArray = Array.from(donorsMap.values())
          .map(donor => ({ ...donor, amount: donorAmounts.get(donor.id) || 0 }))
          .filter(donor => donor.amount > 0);

        if (filter.startsWith('top-')) {
          donorsWithAmountsArray.sort((a, b) => b.amount - a.amount);
        }

        setDonorsWithAmounts(donorsWithAmountsArray);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [filter]);

  // Helper functions
  const getCurrentAmount = () => customAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  
  const getCurrentImpact = () => {
    const amount = getCurrentAmount();
    return [...impactData].reverse().find(item => item.amount <= amount) || impactData[0];
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Please enter a valid email address';
    if (!formData.agreeTerms) errors.agreeTerms = 'You must agree to the Terms and Privacy Policy';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
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
        throw new Error(`API request failed with status ${response.status}`);
      }

      const { clientSecret } = await response.json();
      if (!clientSecret) throw new Error('No clientSecret returned from API');

      setClientSecret(clientSecret);
      setDonationDetails({
        firstName: formData.firstName,
        lastName: formData.lastName,
        dedicateTo: formData.dedicateGift ? formData.dedicateTo : null,
      });
    } catch (err) {
      setError(`Failed to prepare donation: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      const donorData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        dedicateGift: formData.dedicateGift,
        dedicateTo: formData.dedicateGift ? formData.dedicateTo : null,
        anonymous: formData.anonymous,
        updates: formData.updates,
        createdAt: serverTimestamp(),
      };

      const donorRef = await addDoc(collection(db, 'donors'), donorData);
      const donationData = {
        amount: getCurrentAmount(),
        donationType: 'one-time',
        status: 'Completed',
        donationDate: serverTimestamp(),
        donorId: donorRef.id,
        paymentMethod: 'credit',
        paymentStatus: 'Succeeded',
        paymentIntentId: paymentIntent.id,
        paymentDate: serverTimestamp(),
      };

      const donationRef = await addDoc(collection(db, 'donations'), donationData);
      setDonationId(donationRef.id);
      setDonationDetails({
        donorId: donorRef.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        donationId: `DON-${donationRef.id}`,
        dedicateTo: formData.dedicateGift ? formData.dedicateTo : null,
      });

      fetch('/api/send-donation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          donationId: `DON-${donationRef.id}`,
          amount: getCurrentAmount().toFixed(2),
          firstName: formData.firstName,
          lastName: formData.lastName,
          donationType: 'one-time',
          dedicateTo: formData.dedicateGift ? formData.dedicateTo : null,
          anonymous: formData.anonymous,
          donationDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        }),
      }).catch(console.error);

      setShowSuccess(true);
    } catch (error) {
      setError(`Failed to finalize donation: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      if (getCurrentAmount() <= 0) {
        alert('Please select or enter a donation amount');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!validateForm()) {
        const firstErrorField = Object.keys(validationErrors)[0];
        document.getElementById(firstErrorField)?.focus();
        return;
      }
      setStep(3);
      await prepareDonation();
    }
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#D4AF37',
        colorBackground: '#1A1A1A',
        colorText: '#ffffff',
        colorDanger: '#EF4444',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
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

      {/* Hero Section - Professional */}
      <section className="relative overflow-hidden pt-32 pb-20 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
        <SubtlePattern />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 text-sm font-medium text-[#D4AF37] 
                         bg-[#D4AF37]/10 px-4 py-2 rounded-full mb-8 border border-[#D4AF37]/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Heart className="w-4 h-4" />
              <span>Support Innovation</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-light mb-8 text-white leading-tight">
              Support Advanced{' '}
              <span className="font-semibold text-[#D4AF37]">
                EV Charging Technology
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12 font-light leading-relaxed">
              Your contribution helps accelerate the development of intelligent, automatic charging systems 
              that make electric vehicle ownership more convenient and accessible.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-8">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#D4AF37]" />
                Secure payments
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#D4AF37]" />
                Funds innovation
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#D4AF37]" />
                Sustainable impact
              </div>
            </div>
          </motion.div>

          {/* Stats Cards - Clean design */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: DollarSign, value: `$${totalAmount.toFixed(0)}`, label: "Total Raised" },
              { icon: Target, value: "$10,000", label: "Goal" },
              { icon: Users, value: donorsWithAmounts.length, label: "Supporters" },
              { icon: TrendingUp, value: `${progress.toFixed(1)}%`, label: "Complete" }
            ].map(({ icon: Icon, value, label }) => (
              <motion.div 
                key={label} 
                variants={fadeIn} 
                className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-6 
                         border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-300"
              >
                <Icon className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                <div className="text-2xl font-semibold text-white mb-1">{value}</div>
                <div className="text-sm text-gray-300">{label}</div>
                {label === "Total Raised" && (
                  <div className="text-xs text-gray-400 mt-1">
                    Donations: ${totalDonations.toFixed(0)} • Orders: ${totalPreOrders.toFixed(0)}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Progress Bar - Clean design */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6 }} 
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 border border-[#D4AF37]/20">
              <div className="relative h-2 bg-[#1A1A1A] rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full"
                />
              </div>
              <div className="text-center text-gray-300">
                {progress.toFixed(1)}% of our $10,000 goal • ${Math.max(10000 - totalAmount, 0).toFixed(0)} remaining
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content - Professional layout */}
      <section className="py-20 bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] relative">
        <SubtlePattern />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Step Navigation - Clean design */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="flex items-center justify-center space-x-4 mb-8">
              {[1, 2, 3].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg text-sm font-semibold transition-all ${
                      step >= stepNum 
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white' 
                        : 'bg-[#2A2A2A]/60 text-gray-400 border border-[#D4AF37]/20'
                    }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`h-px w-16 transition-all ${
                      step > stepNum ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B]' : 'bg-[#2A2A2A]'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-center space-x-16 text-sm text-gray-400">
              <span className={step >= 1 ? 'text-white font-medium' : ''}>Choose Amount</span>
              <span className={step >= 2 ? 'text-white font-medium' : ''}>Your Info</span>
              <span className={step >= 3 ? 'text-white font-medium' : ''}>Payment</span>
            </div>
          </div>

          {step === 1 && (
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
                  Choose Your <span className="font-semibold text-[#D4AF37]">Contribution</span>
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto font-light">
                  Every contribution helps advance smart, automatic EV charging technology
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 border border-[#D4AF37]/20">
                    <h3 className="text-xl font-semibold text-white mb-6">Suggested Amounts</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                      {predefinedAmounts.map((amount) => (
                        <motion.button
                          key={amount}
                          onClick={() => handleAmountSelect(amount)}
                          className={`p-6 rounded-lg border transition-all ${
                            selectedAmount === amount && !customAmount
                              ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white'
                              : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/40 text-gray-300 hover:bg-[#2A2A2A]/80'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-2xl font-semibold">${amount}</div>
                        </motion.button>
                      ))}
                    </div>

                    <div className="mb-8">
                      <h4 className="text-lg font-medium text-white mb-4">Custom Amount</h4>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-gray-400 text-lg">$</span>
                        </div>
                        <input
                          type="text"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          placeholder="Enter amount"
                          className="w-full text-white pl-10 pr-4 py-4 text-lg border border-[#D4AF37]/20 rounded-lg 
                                   bg-[#1A1A1A]/60 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] 
                                   transition-all placeholder-gray-500"
                        />
                      </div>
                    </div>

                    <motion.button
                      onClick={nextStep}
                      className="w-full py-4 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold
                               hover:shadow-md hover:shadow-[#D4AF37]/20 transition-all flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue with ${getCurrentAmount().toFixed(2)}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </motion.button>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="sticky top-8 space-y-6">
                    <div className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-6 border border-[#D4AF37]/20">
                      <h4 className="text-lg font-semibold text-white mb-4">Your Impact</h4>
                      <div className="text-center">
                        <div className="text-4xl mb-3">{getCurrentImpact().icon}</div>
                        <div className="text-2xl font-semibold text-[#D4AF37] mb-3">
                          ${getCurrentAmount().toFixed(2)}
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {getCurrentImpact().impact}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-6 border border-[#D4AF37]/20">
                      <h4 className="text-lg font-semibold text-white mb-4">Our Mission</h4>
                      <div className="space-y-3 text-sm text-gray-300">
                        <div className="flex items-start gap-3">
                          <Zap className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                          <p>Develop smart EV charging solutions</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Globe className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                          <p>Make EV ownership more accessible</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <Heart className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                          <p>Reduce emissions through technology</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
                  Your <span className="font-semibold text-[#D4AF37]">Information</span>
                </h2>
                <p className="text-lg text-gray-300 font-light">
                  We'll send your receipt and keep you updated on our progress
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 border border-[#D4AF37]/20">
                    <h3 className="text-xl font-semibold text-white mb-6">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full text-white px-4 py-3 border rounded-lg transition-all bg-[#1A1A1A]/60 ${
                            validationErrors.firstName 
                              ? 'border-red-400' 
                              : 'border-[#D4AF37]/20 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]'
                          }`}
                        />
                        {validationErrors.firstName && (
                          <p className="mt-1 text-sm text-red-300">{validationErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full text-white px-4 py-3 border rounded-lg transition-all bg-[#1A1A1A]/60 ${
                            validationErrors.lastName 
                              ? 'border-red-400' 
                              : 'border-[#D4AF37]/20 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]'
                          }`}
                        />
                        {validationErrors.lastName && (
                          <p className="mt-1 text-sm text-red-300">{validationErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full text-white px-4 py-3 border rounded-lg transition-all bg-[#1A1A1A]/60 ${
                          validationErrors.email 
                            ? 'border-red-400' 
                            : 'border-[#D4AF37]/20 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]'
                        }`}
                      />
                      {validationErrors.email && (
                        <p className="mt-1 text-sm text-red-300">{validationErrors.email}</p>
                      )}
                    </div>

                    <div className="border-t border-[#D4AF37]/20 pt-6 mb-6">
                      <h4 className="text-lg font-medium text-white mb-4">Options</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <input
                            id="dedicateGift"
                            name="dedicateGift"
                            type="checkbox"
                            checked={formData.dedicateGift}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-[#D4AF37] border-[#D4AF37]/30 rounded focus:ring-[#D4AF37]/50 mt-0.5"
                          />
                          <label htmlFor="dedicateGift" className="font-medium text-white">
                            Dedicate this gift in honor or memory of someone
                          </label>
                        </div>

                        {formData.dedicateGift && (
                          <motion.div 
                            className="ml-7"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                          >
                            <input
                              type="text"
                              id="dedicateTo"
                              name="dedicateTo"
                              value={formData.dedicateTo}
                              onChange={handleInputChange}
                              placeholder="Enter name"
                              className="w-full text-white px-4 py-3 border border-[#D4AF37]/20 rounded-lg 
                                       focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all 
                                       bg-[#1A1A1A]/60 placeholder-gray-500"
                            />
                          </motion.div>
                        )}

                        <div className="flex items-start gap-3">
                          <input
                            id="anonymous"
                            name="anonymous"
                            type="checkbox"
                            checked={formData.anonymous}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-[#D4AF37] border-[#D4AF37]/30 rounded focus:ring-[#D4AF37]/50 mt-0.5"
                          />
                          <label htmlFor="anonymous" className="font-medium text-white">
                            Make this donation anonymous
                          </label>
                        </div>

                        <div className="flex items-start gap-3">
                          <input
                            id="updates"
                            name="updates"
                            type="checkbox"
                            checked={formData.updates}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-[#D4AF37] border-[#D4AF37]/30 rounded focus:ring-[#D4AF37]/50 mt-0.5"
                          />
                          <div>
                            <label htmlFor="updates" className="font-medium text-white">
                              Send me updates about Ampereon's progress
                            </label>
                            <p className="text-sm text-gray-400 mt-1">
                              Stay informed about our charging technology developments
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <input
                            id="agreeTerms"
                            name="agreeTerms"
                            type="checkbox"
                            checked={formData.agreeTerms}
                            onChange={handleInputChange}
                            className={`h-4 w-4 text-[#D4AF37] border rounded focus:ring-[#D4AF37]/50 mt-0.5 ${
                              validationErrors.agreeTerms ? 'border-red-400' : 'border-[#D4AF37]/30'
                            }`}
                          />
                          <div>
                            <label htmlFor="agreeTerms" className="font-medium text-white">
                              I agree to the Terms of Service and Privacy Policy *
                            </label>
                            {validationErrors.agreeTerms && (
                              <p className="mt-1 text-red-300 text-sm">{validationErrors.agreeTerms}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <motion.button
                        onClick={prevStep}
                        className="px-6 py-3 rounded-lg border border-[#D4AF37]/30 text-gray-300 font-medium 
                                 hover:bg-[#2A2A2A]/60 transition-all flex items-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </motion.button>
                      <motion.button
                        onClick={nextStep}
                        className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold 
                                 hover:shadow-md hover:shadow-[#D4AF37]/20 transition-all flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Continue to Payment
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-6 border border-[#D4AF37]/20 sticky top-8">
                    <h4 className="text-lg font-semibold text-white mb-6">Donation Summary</h4>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Donation Amount</span>
                        <span className="text-lg font-semibold text-white">
                          ${getCurrentAmount().toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-[#D4AF37]/20 pt-4">
                        <div className="flex justify-between font-semibold text-lg">
                          <span className="text-white">Total</span>
                          <span className="text-[#D4AF37]">${getCurrentAmount().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#D4AF37]/10 p-4 rounded-lg border border-[#D4AF37]/20">
                      <h5 className="font-medium text-white mb-3">Fund Allocation</h5>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex justify-between">
                          <span>Research & Development</span>
                          <span className="text-[#D4AF37] font-medium">70%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Manufacturing</span>
                          <span className="text-[#D4AF37] font-medium">20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Operations</span>
                          <span className="text-[#D4AF37] font-medium">10%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
                  Complete Your <span className="font-semibold text-[#D4AF37]">Donation</span>
                </h2>
                <p className="text-lg text-gray-300 font-light">
                  Your support drives innovation in EV charging technology
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 border border-[#D4AF37]/20">
                    <div className="flex items-center bg-[#1A1A1A]/60 p-6 rounded-lg border border-[#D4AF37]/20 mb-6">
                      <Shield className="h-8 w-8 text-[#D4AF37] mr-4" />
                      <div>
                        <p className="font-medium text-white">Secure Payment Processing</p>
                        <p className="text-sm text-gray-300 mt-1">
                          Protected by Stripe with 256-bit SSL encryption
                        </p>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-6">Payment Information</h3>
                    
                    {error && (
                      <div className="mb-6 p-4 bg-red-500/10 text-red-300 rounded-lg border border-red-500/20">
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
                      <div className="flex flex-col items-center justify-center py-12">
                        <motion.div
                          className="w-8 h-8 border-2 border-[#D4AF37] rounded-full border-t-transparent mb-4"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <p className="text-gray-300">
                          {isProcessing ? 'Preparing donation...' : 'Loading payment form...'}
                        </p>
                      </div>
                    )}

                    <motion.button
                      onClick={prevStep}
                      className="mt-6 px-6 py-3 rounded-lg border border-[#D4AF37]/30 text-gray-300 font-medium 
                               hover:bg-[#2A2A2A]/60 transition-all flex items-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Information
                    </motion.button>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-6 border border-[#D4AF37]/20 sticky top-8">
                    <h4 className="text-lg font-semibold text-white mb-6">Final Summary</h4>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Donation Amount</span>
                        <span className="font-semibold text-white">
                          ${getCurrentAmount().toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-[#D4AF37]/20 pt-4">
                        <div className="flex justify-between font-semibold text-lg">
                          <span className="text-white">Total</span>
                          <span className="text-[#D4AF37]">${getCurrentAmount().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#D4AF37]/10 p-4 rounded-lg border border-[#D4AF37]/20">
                      <h5 className="font-medium text-white mb-2">Thank You!</h5>
                      <p className="text-sm text-gray-300">
                        Your contribution accelerates sustainable transportation technology
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Community Section - Clean supporters list */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="mt-20"
          >
            <div className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl border border-[#D4AF37]/20">
              <div className="p-6 border-b border-[#D4AF37]/20">
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { label: 'Recent', value: 'recent' },
                    { label: 'Top Day', value: 'top-day' },
                    { label: 'Top Month', value: 'top-month' },
                    { label: 'All Time', value: 'top-all' },
                  ].map(({ label, value }) => (
                    <motion.button
                      key={value}
                      onClick={() => setFilter(value)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filter === value
                          ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white'
                          : 'bg-[#1A1A1A]/60 text-gray-300 hover:bg-[#2A2A2A]/80 border border-[#D4AF37]/20'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {label}
                    </motion.button>
                  ))}
                </div>
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-[#D4AF37]" />
                  Our Supporters
                </h3>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <motion.div
                      className="w-6 h-6 border-2 border-[#D4AF37] rounded-full border-t-transparent mr-3"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <p className="text-gray-300">Loading supporters...</p>
                  </div>
                ) : donorsWithAmounts.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-[#D4AF37]/50 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-white mb-2">Be the First Supporter</h4>
                    <p className="text-gray-400">
                      Join our mission to revolutionize EV charging technology.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {donorsWithAmounts.slice(0, 9).map((donor, index) => (
                      <motion.div
                        key={donor.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-[#1A1A1A]/60 rounded-lg p-4 border border-[#D4AF37]/10 
                                 hover:border-[#D4AF37]/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#D4AF37]/30 to-[#B8860B]/30 
                                        rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-[#D4AF37] font-medium text-sm">
                              {donor.anonymous ? '?' : (donor.firstName?.[0] || '?')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate text-sm">
                              {donor.anonymous ? 'Anonymous' : `${donor.firstName || ''} ${donor.lastName?.[0] || ''}.`}
                            </p>
                            <p className="text-[#D4AF37] font-semibold text-sm">
                              ${donor.amount?.toFixed(2) || '0.00'}
                            </p>
                            {donor.dedicateTo && (
                              <p className="text-gray-400 italic text-xs truncate">
                                In honor of: {donor.dedicateTo}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {donorsWithAmounts.length > 9 && (
                  <div className="text-center mt-6">
                    <p className="text-gray-400">
                      And <span className="font-semibold text-[#D4AF37]">{donorsWithAmounts.length - 9} more</span> supporters!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        donationAmount={getCurrentAmount()}
        donationDetails={donationDetails}
      />
    </div>
  );
}