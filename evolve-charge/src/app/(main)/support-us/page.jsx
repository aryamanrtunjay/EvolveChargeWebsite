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

// Modern tech pattern overlay
const TechPattern = ({ opacity = 0.05 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <svg width="100%" height="100%" className="text-[#D4AF37]">
      <defs>
        <pattern id="techGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="1.5" fill="currentColor" />
          <circle cx="0" cy="0" r="1" fill="currentColor" />
          <circle cx="60" cy="60" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#techGrid)" />
    </svg>
  </div>
);

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
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
        <label className="block text-sm font-medium text-gray-300 mb-2 tracking-wide">
          Card Information
        </label>
        <PaymentElement />
      </div>
      
      {errorMessage && (
        <div className="p-4 bg-red-500/10 text-red-300 rounded-xl text-sm border border-red-500/20 backdrop-blur-sm">
          {errorMessage}
        </div>
      )}
      
      <motion.button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold 
                 shadow-2xl hover:shadow-[#D4AF37]/30 transition-all flex justify-center items-center disabled:opacity-50
                 focus:ring-2 focus:ring-[#D4AF37]/40 relative overflow-hidden"
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
        
        {/* Button shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-[#1A1A1A]/95 to-[#2A2A2A]/90 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full 
                 border border-[#D4AF37]/20 shadow-2xl relative overflow-hidden"
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/30 to-[#B8860B]/30" />
        </div>
        
        <div className="text-center relative z-10">
          <motion.div 
            className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-3xl flex items-center justify-center mx-auto mb-6
                     shadow-xl shadow-[#D4AF37]/30"
            whileHover={{ rotate: 5, scale: 1.05 }}
          >
            <CheckCircle className="h-10 w-10 text-white" />
          </motion.div>
          <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">Thank You!</h3>
          <p className="text-gray-300 mb-8 leading-relaxed text-lg">
            Your donation of ${donationAmount ? donationAmount.toFixed(2) : '0.00'} will help advance smart, automatic EV charging and sustainable transportation.
          </p>
          <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl mb-8 border border-white/10">
            <p className="text-sm text-gray-400">
              You'll receive a receipt via email shortly. Download your receipt below for your records.
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <motion.button
              onClick={generatePDF}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold 
                       shadow-xl hover:shadow-[#D4AF37]/30 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Download Receipt
            </motion.button>
            <div className="flex space-x-4">
              <motion.button
                onClick={() => window.location.href = '/'}
                className="w-1/2 py-3 rounded-2xl bg-white/10 backdrop-blur-sm text-gray-300 font-medium 
                         hover:bg-[#D4AF37]/10 border border-white/20 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Back to Home
              </motion.button>
              <motion.button
                onClick={onClose}
                className="w-1/2 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium 
                         shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
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
    { amount: 25, impact: "Supports Ampereon's research and development", icon: "🔬" },
    { amount: 50, impact: "Funds development of smart charging software", icon: "💻" },
    { amount: 100, impact: "Contributes to scalable smart charging prototypes", icon: "⚡" },
    { amount: 250, impact: "Helps deploy charging solutions in underserved areas", icon: "🌍" },
    { amount: 500, impact: "Advances partnerships for global EV infrastructure", icon: "🤝" },
    { amount: 1000, impact: "Drives large-scale adoption of smart, automatic EV charging", icon: "🚀" }
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
        borderRadius: '12px',
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

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-[#1A1A1A]">
        <TechPattern />
        
        {/* Animated orbs */}
        <motion.div 
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-[#D4AF37]/5 to-transparent rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-3 text-sm font-semibold text-[#D4AF37] 
                         bg-gradient-to-r from-[#D4AF37]/15 to-[#B8860B]/10 backdrop-blur-sm 
                         px-8 py-4 rounded-full mb-8 border border-[#D4AF37]/30"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Heart className="w-4 h-4" />
              <span className="tracking-wide">Join Our Mission</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-extralight mb-8 tracking-tighter text-white leading-tight">
              Support the Future of{' '}
              <span className="font-bold bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
                Smart EV Charging
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-5xl mx-auto mb-12 font-light leading-relaxed">
              Your donation powers Ampereon's mission to develop cutting-edge smart, automatic charging technology, 
              making electric vehicles more accessible and sustainable for everyone.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400 mb-8">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-[#D4AF37]" />
                Secure payments via Stripe
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-[#D4AF37]" />
                100% goes to EV innovation
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-[#D4AF37]" />
                Global impact initiative
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: DollarSign, value: `$${totalAmount.toFixed(0)}`, label: "Total Raised", color: "text-[#D4AF37]" },
              { icon: Target, value: "$10,000", label: "Goal", color: "text-[#D4AF37]" },
              { icon: Users, value: donorsWithAmounts.length, label: "Supporters", color: "text-[#D4AF37]" },
              { icon: TrendingUp, value: `${progress.toFixed(1)}%`, label: "Complete", color: "text-[#D4AF37]" }
            ].map(({ icon: Icon, value, label, color }) => (
              <motion.div 
                key={label} 
                variants={fadeIn} 
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 
                         border border-white/20 shadow-2xl hover:shadow-[#D4AF37]/20 hover:scale-105 transition-all duration-500
                         relative overflow-hidden group"
                whileHover={{ y: -8 }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                
                <div className="relative z-10">
                  <Icon className={`w-10 h-10 ${color} mx-auto mb-4`} />
                  <div className="text-3xl font-bold text-white mb-2">{value}</div>
                  <div className="text-sm text-gray-300 font-medium tracking-wider">{label}</div>
                  {label === "Total Raised" && (
                    <div className="text-xs text-gray-400 mt-2">
                      Donations: ${totalDonations.toFixed(0)} • Orders: ${totalPreOrders.toFixed(0)}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.8 }} 
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 
                          border border-white/20 shadow-2xl relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/30 to-[#B8860B]/30" />
              </div>
              
              <div className="relative z-10">
                <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-6">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full
                             shadow-lg shadow-[#D4AF37]/50"
                  />
                </div>
                <div className="text-center text-gray-300 font-medium text-lg">
                  {progress.toFixed(1)}% of our $10,000 goal • ${Math.max(10000 - totalAmount, 0).toFixed(0)} remaining
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#0F0F0F] relative overflow-hidden">
        <TechPattern opacity={0.03} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Step Navigation */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="flex items-center justify-center space-x-6 mb-12">
              {[1, 2, 3].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <motion.div 
                    className={`flex items-center justify-center w-16 h-16 rounded-2xl text-lg font-bold transition-all duration-500 ${
                      step >= stepNum 
                        ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-white shadow-lg shadow-[#D4AF37]/30' 
                        : 'bg-white/10 text-gray-400 backdrop-blur-sm border border-white/20'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {stepNum}
                  </motion.div>
                  {stepNum < 3 && (
                    <div className={`h-1 w-20 rounded-full transition-all duration-500 ${
                      step > stepNum ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B]' : 'bg-white/20'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-center space-x-20 text-sm text-gray-400">
              <span className={`transition-all duration-300 ${step >= 1 ? 'text-white font-semibold' : ''}`}>Choose Amount</span>
              <span className={`transition-all duration-300 ${step >= 2 ? 'text-white font-semibold' : ''}`}>Your Info</span>
              <span className={`transition-all duration-300 ${step >= 3 ? 'text-white font-semibold' : ''}`}>Payment</span>
            </div>
          </div>

          {step === 1 && (
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6 tracking-tight">
                  Choose Your <span className="font-bold text-[#D4AF37] italic">Impact</span>
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed font-light max-w-3xl mx-auto">
                  Every contribution accelerates the future of smart, automatic EV charging
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-12 
                                border border-white/20 relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/30 to-[#B8860B]/30" />
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="text-3xl font-bold text-white mb-8 tracking-tight">Suggested Amounts</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                        {predefinedAmounts.map((amount) => (
                          <motion.button
                            key={amount}
                            onClick={() => handleAmountSelect(amount)}
                            className={`p-8 rounded-2xl border-2 transition-all transform relative overflow-hidden ${
                              selectedAmount === amount && !customAmount
                                ? 'border-[#D4AF37] bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 text-white shadow-xl shadow-[#D4AF37]/30'
                                : 'border-white/20 hover:border-[#D4AF37]/50 text-gray-300 hover:shadow-xl backdrop-blur-sm bg-white/5'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div className="text-4xl font-bold">${amount}</div>
                          </motion.button>
                        ))}
                      </div>

                      <div className="mb-10">
                        <h3 className="text-2xl font-semibold text-white mb-6 tracking-wide">Custom Amount</h3>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-2xl">$</span>
                          </div>
                          <input
                            type="text"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            placeholder="Enter amount"
                            className="w-full text-white pl-12 pr-6 py-6 text-2xl border border-white/20 rounded-2xl 
                                     bg-white/5 backdrop-blur-sm focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] 
                                     transition-all placeholder-gray-500"
                          />
                        </div>
                      </div>

                      <motion.button
                        onClick={nextStep}
                        className="w-full py-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold text-xl
                                 shadow-2xl hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center
                                 focus:ring-2 focus:ring-[#D4AF37]/40 relative overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="relative z-10">
                          Continue with ${getCurrentAmount().toFixed(2)}
                        </span>
                        <ArrowRight className="w-6 h-6 ml-3 relative z-10" />
                        
                        {/* Button shine effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                        />
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="sticky top-8 space-y-8">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 
                                  border border-white/20 relative overflow-hidden">
                      {/* Background pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/30 to-[#B8860B]/30" />
                      </div>
                      
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-6 tracking-wide">Your Impact</h3>
                        <div className="text-center">
                          <div className="text-6xl mb-4">{getCurrentImpact().icon}</div>
                          <div className="text-4xl font-bold text-[#D4AF37] mb-4">
                            ${getCurrentAmount().toFixed(2)}
                          </div>
                          <p className="text-gray-300 text-base leading-relaxed">
                            {getCurrentImpact().impact}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 
                                  border border-white/20 shadow-2xl">
                      <h3 className="text-xl font-bold text-white mb-6 tracking-wide">Our Mission</h3>
                      <div className="space-y-4 text-base text-gray-300">
                        <div className="flex items-start gap-4">
                          <Zap className="w-5 h-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                          <p>Develop innovative smart EV charging solutions</p>
                        </div>
                        <div className="flex items-start gap-4">
                          <Globe className="w-5 h-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                          <p>Make electric vehicle ownership more accessible</p>
                        </div>
                        <div className="flex items-start gap-4">
                          <Heart className="w-5 h-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                          <p>Reduce carbon emissions through sustainable technology</p>
                        </div>
                        <div className="flex items-start gap-4">
                          <Target className="w-5 h-5 text-[#D4AF37] mt-1 flex-shrink-0" />
                          <p>Ensure you never run out of charge again</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-tight">
                  Your <span className="font-bold text-[#D4AF37] italic">Information</span>
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed font-light">
                  Help us send your receipt and keep you updated on our progress
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-10 
                                border border-white/20 relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/30 to-[#B8860B]/30" />
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-white mb-8 tracking-wide">Contact Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-3 tracking-wide">
                            First Name *
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full text-white px-5 py-4 border rounded-xl transition-all bg-white/5 backdrop-blur-sm ${
                              validationErrors.firstName 
                                ? 'border-red-400 bg-red-500/10' 
                                : 'border-white/20 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]'
                            }`}
                          />
                          {validationErrors.firstName && (
                            <p className="mt-2 text-sm text-red-300">{validationErrors.firstName}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-3 tracking-wide">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full text-white px-5 py-4 border rounded-xl transition-all bg-white/5 backdrop-blur-sm ${
                              validationErrors.lastName 
                                ? 'border-red-400 bg-red-500/10' 
                                : 'border-white/20 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]'
                            }`}
                          />
                          {validationErrors.lastName && (
                            <p className="mt-2 text-sm text-red-300">{validationErrors.lastName}</p>
                          )}
                        </div>
                      </div>

                      <div className="mb-8">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-3 tracking-wide">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full text-white px-5 py-4 border rounded-xl transition-all bg-white/5 backdrop-blur-sm ${
                            validationErrors.email 
                              ? 'border-red-400 bg-red-500/10' 
                              : 'border-white/20 focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]'
                          }`}
                        />
                        {validationErrors.email && (
                          <p className="mt-2 text-sm text-red-300">{validationErrors.email}</p>
                        )}
                      </div>

                      <div className="border-t border-white/20 pt-8 mb-8">
                        <h4 className="text-xl font-semibold text-white mb-6 tracking-wide">Gift Options</h4>
                        
                        <div className="space-y-6">
                          <div className="flex items-start gap-4">
                            <input
                              id="dedicateGift"
                              name="dedicateGift"
                              type="checkbox"
                              checked={formData.dedicateGift}
                              onChange={handleInputChange}
                              className="h-5 w-5 text-[#D4AF37] border-white/30 rounded focus:ring-[#D4AF37]/50 mt-1 bg-white/10"
                            />
                            <div>
                              <label htmlFor="dedicateGift" className="font-medium text-white tracking-wide">
                                Dedicate this gift in honor or memory of someone
                              </label>
                            </div>
                          </div>

                          {formData.dedicateGift && (
                            <motion.div 
                              className="ml-9"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              transition={{ duration: 0.3 }}
                            >
                              <label htmlFor="dedicateTo" className="block text-sm font-medium text-gray-300 mb-3 tracking-wide">
                                In honor/memory of
                              </label>
                              <input
                                type="text"
                                id="dedicateTo"
                                name="dedicateTo"
                                value={formData.dedicateTo}
                                onChange={handleInputChange}
                                placeholder="Enter name"
                                className="w-full text-white px-5 py-4 border border-white/20 rounded-xl 
                                         focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all 
                                         bg-white/5 backdrop-blur-sm placeholder-gray-500"
                              />
                            </motion.div>
                          )}

                          <div className="flex items-start gap-4">
                            <input
                              id="anonymous"
                              name="anonymous"
                              type="checkbox"
                              checked={formData.anonymous}
                              onChange={handleInputChange}
                              className="h-5 w-5 text-[#D4AF37] border-white/30 rounded focus:ring-[#D4AF37]/50 mt-1 bg-white/10"
                            />
                            <div>
                              <label htmlFor="anonymous" className="font-medium text-white tracking-wide">
                                Make this donation anonymous
                              </label>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <input
                              id="updates"
                              name="updates"
                              type="checkbox"
                              checked={formData.updates}
                              onChange={handleInputChange}
                              className="h-5 w-5 text-[#D4AF37] border-white/30 rounded focus:ring-[#D4AF37]/50 mt-1 bg-white/10"
                            />
                            <div>
                              <label htmlFor="updates" className="font-medium text-white tracking-wide">
                                Send me updates about Ampereon's progress
                              </label>
                              <p className="text-sm text-gray-400 mt-1">
                                Stay informed about our smart EV charging innovations
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-4">
                            <input
                              id="agreeTerms"
                              name="agreeTerms"
                              type="checkbox"
                              checked={formData.agreeTerms}
                              onChange={handleInputChange}
                              className={`h-5 w-5 text-[#D4AF37] border rounded focus:ring-[#D4AF37]/50 mt-1 bg-white/10 ${
                                validationErrors.agreeTerms ? 'border-red-400' : 'border-white/30'
                              }`}
                            />
                            <div>
                              <label htmlFor="agreeTerms" className="font-medium text-white tracking-wide">
                                I agree to the Terms of Service and Privacy Policy *
                              </label>
                              {validationErrors.agreeTerms && (
                                <p className="mt-1 text-red-300 text-sm">{validationErrors.agreeTerms}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-6">
                        <motion.button
                          onClick={prevStep}
                          className="w-1/3 py-4 rounded-2xl border border-white/30 text-gray-300 font-medium 
                                   hover:bg-white/10 transition-all flex items-center justify-center backdrop-blur-sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ArrowLeft className="w-5 h-5 mr-2" />
                          Back
                        </motion.button>
                        <motion.button
                          onClick={nextStep}
                          className="w-2/3 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold 
                                   shadow-xl hover:shadow-[#D4AF37]/30 transition-all flex items-center justify-center
                                   relative overflow-hidden"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="relative z-10">Continue to Payment</span>
                          <ArrowRight className="w-5 h-5 ml-2 relative z-10" />
                          
                          {/* Button shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                          />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 
                                sticky top-28 border border-white/20 relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/30 to-[#B8860B]/30" />
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-white mb-8 tracking-wide">Donation Summary</h3>
                      
                      <div className="mb-8">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-gray-300">Donation Amount</span>
                          <span className="text-2xl font-semibold text-white">
                            ${getCurrentAmount().toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-white/20 pt-6 mb-8">
                        <div className="flex justify-between items-center font-bold text-2xl">
                          <span className="text-white">Total</span>
                          <span className="text-[#D4AF37]">${getCurrentAmount().toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="bg-[#D4AF37]/10 p-6 rounded-2xl border border-[#D4AF37]/30 backdrop-blur-sm">
                        <h4 className="font-medium text-white mb-4 tracking-wide">Where Your Money Goes</h4>
                        <div className="space-y-3 text-sm text-gray-300">
                          <div className="flex justify-between">
                            <span>Research & Development</span>
                            <span className="text-[#D4AF37] font-semibold">70%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Manufacturing</span>
                            <span className="text-[#D4AF37] font-semibold">20%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Community Outreach</span>
                            <span className="text-[#D4AF37] font-semibold">5%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Administrative</span>
                            <span className="text-[#D4AF37] font-semibold">5%</span>
                          </div>
                        </div>
                        <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                          <p className="text-xs text-gray-400">
                            <strong>Total funding includes:</strong> Direct donations (${totalDonations.toFixed(0)}) + Pre-orders (${totalPreOrders.toFixed(0)})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extralight text-white mb-6 tracking-tight">
                  Complete Your <span className="font-bold text-[#D4AF37] italic">Donation</span>
                </h2>
                <p className="text-xl text-gray-300 leading-relaxed font-light">
                  Your support drives the future of smart, automatic EV charging
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-10 
                                border border-white/20 relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/30 to-[#B8860B]/30" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/20 mb-8">
                        <Shield className="h-10 w-10 text-[#D4AF37] mr-6" />
                        <div>
                          <p className="text-lg font-semibold text-white tracking-wide">
                            Your Payment is Safe and Secure
                          </p>
                          <p className="text-sm text-gray-300 mt-1">
                            We use Stripe for secure payment processing with 256-bit SSL encryption
                          </p>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-8 tracking-wide">Payment Information</h3>
                      
                      {error && (
                        <div className="mb-8 p-6 bg-red-500/10 text-red-300 rounded-2xl border border-red-500/20 backdrop-blur-sm">
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
                            className="w-12 h-12 border-4 border-[#D4AF37] rounded-full border-t-transparent mb-6"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <p className="text-gray-300 text-lg">
                            {isProcessing ? 'Preparing your donation...' : 'Loading payment form...'}
                          </p>
                        </div>
                      )}

                      <motion.button
                        onClick={prevStep}
                        className="mt-8 px-8 py-3 rounded-2xl border border-white/30 text-gray-300 font-medium 
                                 hover:bg-white/10 transition-all flex items-center backdrop-blur-sm"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Information
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 
                                sticky top-28 border border-white/20 relative overflow-hidden">
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/30 to-[#B8860B]/30" />
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-white mb-8 tracking-wide">Final Summary</h3>
                      
                      <div className="space-y-6 mb-8">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Donation Amount</span>
                          <span className="font-semibold text-white text-lg">
                            ${getCurrentAmount().toFixed(2)}
                          </span>
                        </div>
                        <div className="border-t border-white/20 pt-6">
                          <div className="flex justify-between font-bold text-2xl">
                            <span className="text-white">Total</span>
                            <span className="text-[#D4AF37]">${getCurrentAmount().toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#D4AF37]/10 p-6 rounded-2xl border border-[#D4AF37]/30 backdrop-blur-sm">
                        <h4 className="font-medium text-white mb-3 tracking-wide">Thank You!</h4>
                        <p className="text-sm text-gray-300">
                          Your contribution helps accelerate sustainable transportation technology
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Community Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="mt-24"
          >
            <div className="flex flex-col gap-8">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl shadow-2xl 
                            border border-white/20 relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/30 to-[#B8860B]/30" />
                </div>
                
                <div className="p-8 border-b border-white/20 relative z-10">
                  <div className="flex flex-wrap gap-3 mb-6">
                    {[
                      { label: 'Recent', value: 'recent' },
                      { label: 'Top Day', value: 'top-day' },
                      { label: 'Top Month', value: 'top-month' },
                      { label: 'All Time', value: 'top-all' },
                    ].map(({ label, value }) => (
                      <motion.button
                        key={value}
                        onClick={() => setFilter(value)}
                        className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all ${
                          filter === value
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white shadow-lg shadow-[#D4AF37]/25'
                            : 'bg-white/10 text-gray-300 hover:bg-[#D4AF37]/10 border border-white/20'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {label}
                      </motion.button>
                    ))}
                  </div>
                  <h3 className="text-2xl font-semibold text-white flex items-center tracking-wide">
                    <Users className="w-6 h-6 mr-3 text-[#D4AF37]" />
                    Our Supporters
                  </h3>
                </div>

                <div className="p-8 overflow-x-auto relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <motion.div
                        className="w-8 h-8 border-2 border-[#D4AF37] rounded-full border-t-transparent mr-4"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <p className="text-gray-300 text-lg">Loading our amazing supporters...</p>
                    </div>
                  ) : donorsWithAmounts.length === 0 ? (
                    <div className="text-center py-12">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Heart className="w-16 h-16 text-[#D4AF37]/50 mx-auto mb-6" />
                      </motion.div>
                      <h4 className="text-xl font-medium text-white mb-3">Be the First to Support</h4>
                      <p className="text-gray-400 text-lg max-w-md mx-auto">
                        Join our mission to revolutionize EV charging. Be among the first supporters of this groundbreaking technology.
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-6 overflow-x-auto pb-4">
                      {donorsWithAmounts.slice(0, 10).map((donor, index) => (
                        <motion.div
                          key={donor.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 flex-shrink-0 w-80 
                                   hover:bg-white/10 transition-all border border-white/10 hover:border-[#D4AF37]/30
                                   hover:shadow-lg group"
                          whileHover={{ y: -4, scale: 1.02 }}
                        >
                          <div className="flex items-start gap-4">
                            <motion.div 
                              className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/30 to-[#B8860B]/30 rounded-2xl 
                                        flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                              whileHover={{ rotate: 15 }}
                            >
                              <span className="text-[#D4AF37] font-semibold text-lg">
                                {donor.anonymous ? '?' : (donor.firstName?.[0] || '?')}
                              </span>
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-white truncate text-lg tracking-wide">
                                {donor.anonymous ? 'Anonymous Supporter' : `${donor.firstName} ${donor.lastName}`}
                              </p>
                              <p className="text-[#D4AF37] font-bold text-base">Donated ${donor.amount.toFixed(2)}</p>
                              {donor.dedicateTo && (
                                <p className="text-gray-400 italic text-sm truncate mt-1">In honor of: {donor.dedicateTo}</p>
                              )}
                              <p className="text-gray-500 text-sm mt-2">
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