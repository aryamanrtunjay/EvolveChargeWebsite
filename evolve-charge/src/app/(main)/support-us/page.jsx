'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { db } from '../../firebaseConfig.js';
import { collection, addDoc, doc, serverTimestamp, query, orderBy, limit, getDocs, where, getFirestore } from 'firebase/firestore';
import { Heart, Users, Zap, Target, TrendingUp, Award, Gift, Shield, CheckCircle, ArrowRight, DollarSign, Globe, ArrowLeft } from 'lucide-react';
import Head from 'next/head';
import Script from 'next/script';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_TEST_KEY);

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
        <label className="block text-sm font-medium text-[#111111] mb-2 tracking-wide">
          Card Information
        </label>
        <PaymentElement />
      </div>
      
      {errorMessage && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
          {errorMessage}
        </div>
      )}
      
      <motion.button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-3 rounded-full bg-[#C9A86A] text-[#111111] font-medium shadow-lg hover:shadow-xl transition-all flex justify-center items-center disabled:opacity-50"
        whileHover={{ scale: 1.05, backgroundColor: '#D1B47A' }}
        whileTap={{ scale: 0.95 }}
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#111111]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          `Donate $${amount.toFixed(2)}`
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/70 backdrop-blur-md rounded-xl p-8 max-w-md w-full mx-4 border border-black/10 shadow-lg"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-[#C9A86A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-[#C9A86A]" />
          </div>
          <h3 className="text-2xl font-bold text-[#111111] mb-2 tracking-wide">Thank You!</h3>
          <p className="text-[#6F6F6F] mb-6 leading-relaxed">
            Your donation of ${donationAmount ? donationAmount.toFixed(2) : '0.00'} will help advance smart, automatic EV charging and sustainable transportation.
          </p>
          <div className="bg-[#F5F6F7] p-4 rounded-lg mb-6">
            <p className="text-sm text-[#6F6F6F]">
              You'll receive a receipt via email shortly. Download your receipt below for your records.
            </p>
          </div>
          <div className="flex flex-col space-y-4">
            <motion.button
              onClick={generatePDF}
              className="w-full py-2 rounded-full bg-[#C9A86A] text-[#111111] font-medium shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05, backgroundColor: '#D1B47A' }}
              whileTap={{ scale: 0.95 }}
            >
              Download Receipt
            </motion.button>
            <div className="flex space-x-4">
              <motion.button
                onClick={() => window.location.href = '/'}
                className="w-1/2 py-2 rounded-full bg-[#F5F6F7] text-[#111111]/70 font-medium hover:bg-[#C9A86A]/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Back to Home
              </motion.button>
              <motion.button
                onClick={onClose}
                className="w-1/2 py-2 rounded-full bg-[#C9A86A] text-[#111111] font-medium shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05, backgroundColor: '#D1B47A' }}
                whileTap={{ scale: 0.95 }}
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
      theme: 'flat',
      variables: {
        colorPrimary: '#C9A86A',
        colorBackground: '#FFFFFF',
        colorText: '#111111',
        colorDanger: '#EF4444',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
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
      <section className="relative overflow-hidden pt-32 pb-20 bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F6F7] to-white"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[#C9A86A]/10 rounded-full text-sm font-medium text-[#C9A86A] mb-6 tracking-wide">
              <Heart className="w-4 h-4 mr-2" />
              Join Our Mission
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-[#111111] mb-8 tracking-tight">
              Support the Future of
              <br />
              <span className="text-[#C9A86A]">
                Smart EV Charging
              </span>
            </h1>
            <p className="text-xl text-[#6F6F6F] max-w-4xl mx-auto mb-12 leading-relaxed">
              Your donation powers Ampereon's mission to develop cutting-edge smart, automatic charging technology, making electric vehicles more accessible and sustainable for everyone.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-[#6F6F6F] mb-8">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-[#C9A86A]" />
                Secure payments via Stripe
              </div>
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-[#C9A86A]" />
                100% goes to EV innovation
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-[#C9A86A]" />
                Global impact initiative
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: DollarSign, value: `$${totalAmount.toFixed(0)}`, label: "Total Raised", color: "text-[#C9A86A]" },
              { icon: Target, value: "$10,000", label: "Goal", color: "text-[#C9A86A]" },
              { icon: Users, value: donorsWithAmounts.length, label: "Supporters", color: "text-[#C9A86A]" },
              { icon: TrendingUp, value: `${progress.toFixed(1)}%`, label: "Complete", color: "text-[#C9A86A]" }
            ].map(({ icon: Icon, value, label, color }) => (
              <motion.div key={label} variants={fadeIn} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-black/10 shadow-lg hover:scale-105 transition-all duration-300">
                <Icon className={`w-8 h-8 ${color} mx-auto mb-3`} />
                <div className="text-2xl font-bold text-[#111111]">{value}</div>
                <div className="text-sm text-[#6F6F6F]">{label}</div>
                {label === "Total Raised" && (
                  <div className="text-xs text-[#6F6F6F] mt-1">
                    Donations: ${totalDonations.toFixed(0)} • Orders: ${totalPreOrders.toFixed(0)}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Progress Bar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="max-w-2xl mx-auto mb-16">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-black/10 shadow-lg">
              <div className="relative h-2 bg-[#F5F6F7] rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute left-0 top-0 h-full bg-[#C9A86A] rounded-full"
                />
              </div>
              <div className="text-center text-[#6F6F6F] font-medium">
                {progress.toFixed(1)}% of our $10,000 goal • ${Math.max(10000 - totalAmount, 0).toFixed(0)} remaining
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-[#F5F6F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step Navigation */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-center space-x-4 mb-8">
              {[1, 2, 3].map((stepNum) => (
                <React.Fragment key={stepNum}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= stepNum ? 'bg-[#C9A86A] text-[#111111]' : 'bg-[#F5F6F7] text-[#6F6F6F]'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`h-1 w-16 ${step > stepNum ? 'bg-[#C9A86A]' : 'bg-[#F5F6F7]'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-center space-x-16 text-sm text-[#6F6F6F]">
              <span className={step >= 1 ? 'text-[#111111] font-medium' : ''}>Choose Amount</span>
              <span className={step >= 2 ? 'text-[#111111] font-medium' : ''}>Your Info</span>
              <span className={step >= 3 ? 'text-[#111111] font-medium' : ''}>Payment</span>
            </div>
          </div>

          {step === 1 && (
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-[#111111] mb-4 tracking-tight">Choose Your Impact</h2>
                <p className="text-xl text-[#6F6F6F] leading-relaxed">Every contribution accelerates the future of smart, automatic EV charging</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-black/10">
                    <h3 className="text-2xl font-bold text-[#111111] mb-6 tracking-wide">Suggested Amounts</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                      {predefinedAmounts.map((amount) => (
                        <motion.button
                          key={amount}
                          onClick={() => handleAmountSelect(amount)}
                          className={`p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                            selectedAmount === amount && !customAmount
                              ? 'border-[#C9A86A] bg-[#C9A86A]/10 text-[#111111] shadow-lg'
                              : 'border-black/10 hover:border-[#C9A86A]/30 text-[#111111] hover:shadow-md'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-3xl font-bold">${amount}</div>
                        </motion.button>
                      ))}
                    </div>

                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-[#111111] mb-4 tracking-wide">Custom Amount</h3>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-[#6F6F6F] text-xl">$</span>
                        </div>
                        <input
                          type="text"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          placeholder="Enter amount"
                          className="w-full text-[#111111] pl-10 pr-4 py-4 text-xl border border-black/10 rounded-xl bg-white/70 backdrop-blur-md focus:ring-2 focus:ring-[#C9A86A]/50 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <motion.button
                      onClick={nextStep}
                      className="w-full py-4 rounded-full bg-[#C9A86A] text-[#111111] font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                      whileHover={{ scale: 1.05, backgroundColor: '#D1B47A' }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Continue with ${getCurrentAmount().toFixed(2)}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </motion.button>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="sticky top-8 space-y-6">
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-black/10">
                      <h3 className="text-xl font-bold text-[#111111] mb-4 tracking-wide">Your Impact</h3>
                      <div className="text-center">
                        <div className="text-5xl mb-3">{getCurrentImpact().icon}</div>
                        <div className="text-3xl font-bold text-[#111111] mb-3">
                          ${getCurrentAmount().toFixed(2)}
                        </div>
                        <p className="text-[#6F6F6F] text-sm leading-relaxed">
                          {getCurrentImpact().impact}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-black/10">
                      <h3 className="text-lg font-bold text-[#111111] mb-4 tracking-wide">Our Mission</h3>
                      <div className="space-y-3 text-sm text-[#6F6F6F]">
                        <div className="flex items-start">
                          <Zap className="w-4 h-4 text-[#C9A86A] mt-1 mr-3 flex-shrink-0" />
                          <p>Develop innovative smart EV charging solutions</p>
                        </div>
                        <div className="flex items-start">
                          <Globe className="w-4 h-4 text-[#C9A86A] mt-1 mr-3 flex-shrink-0" />
                          <p>Make electric vehicle ownership more accessible</p>
                        </div>
                        <div className="flex items-start">
                          <Heart className="w-4 h-4 text-[#C9A86A] mt-1 mr-3 flex-shrink-0" />
                          <p>Reduce carbon emissions through sustainable technology</p>
                        </div>
                        <div className="flex items-start">
                          <Target className="w-4 h-4 text-[#C9A86A] mt-1 mr-3 flex-shrink-0" />
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
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[#111111] mb-4 tracking-tight">Your Information</h2>
                <p className="text-lg text-[#6F6F6F] leading-relaxed">Help us send your receipt and keep you updated on our progress</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-black/10">
                    <h3 className="text-xl font-bold text-[#111111] mb-6 tracking-wide">Contact Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-[#111111] mb-2 tracking-wide">
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full text-[#111111] px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9A86A]/50 focus:border-transparent transition-all bg-white/70 backdrop-blur-md ${
                            validationErrors.firstName ? 'border-red-300 bg-red-50' : 'border-black/10'
                          }`}
                        />
                        {validationErrors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-[#111111] mb-2 tracking-wide">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full text-[#111111] px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9A86A]/50 focus:border-transparent transition-all bg-white/70 backdrop-blur-md ${
                            validationErrors.lastName ? 'border-red-300 bg-red-50' : 'border-black/10'
                          }`}
                        />
                        {validationErrors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="email" className="block text-sm font-medium text-[#111111] mb-2 tracking-wide">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full text-[#111111] px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#C9A86A]/50 focus:border-transparent transition-all bg-white/70 backdrop-blur-md ${
                          validationErrors.email ? 'border-red-300 bg-red-50' : 'border-black/10'
                        }`}
                      />
                      {validationErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                      )}
                    </div>

                    <div className="border-t border-black/10 pt-6 mb-6">
                      <h4 className="text-lg font-semibold text-[#111111] mb-4 tracking-wide">Gift Options</h4>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <input
                            id="dedicateGift"
                            name="dedicateGift"
                            type="checkbox"
                            checked={formData.dedicateGift}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-[#C9A86A] border-black/10 rounded focus:ring-[#C9A86A]/50 mt-1"
                          />
                          <div className="ml-3">
                            <label htmlFor="dedicateGift" className="font-medium text-[#111111] tracking-wide">
                              Dedicate this gift in honor or memory of someone
                            </label>
                          </div>
                        </div>

                        {formData.dedicateGift && (
                          <div className="ml-7">
                            <label htmlFor="dedicateTo" className="block text-sm font-medium text-[#111111] mb-2 tracking-wide">
                              In honor/memory of
                            </label>
                            <input
                              type="text"
                              id="dedicateTo"
                              name="dedicateTo"
                              value={formData.dedicateTo}
                              onChange={handleInputChange}
                              placeholder="Enter name"
                              className="w-full text-[#111111] px-4 py-3 border border-black/10 rounded-lg focus:ring-2 focus:ring-[#C9A86A]/50 focus:border-transparent transition-all bg-white/70 backdrop-blur-md"
                            />
                          </div>
                        )}

                        <div className="flex items-start">
                          <input
                            id="anonymous"
                            name="anonymous"
                            type="checkbox"
                            checked={formData.anonymous}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-[#C9A86A] border-black/10 rounded focus:ring-[#C9A86A]/50 mt-1"
                          />
                          <div className="ml-3">
                            <label htmlFor="anonymous" className="font-medium text-[#111111] tracking-wide">
                              Make this donation anonymous
                            </label>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <input
                            id="updates"
                            name="updates"
                            type="checkbox"
                            checked={formData.updates}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-[#C9A86A] border-black/10 rounded focus:ring-[#C9A86A]/50 mt-1"
                          />
                          <div className="ml-3">
                            <label htmlFor="updates" className="font-medium text-[#111111] tracking-wide">
                              Send me updates about Ampereon's progress
                            </label>
                            <p className="text-sm text-[#6F6F6F] mt-1">
                              Stay informed about our smart EV charging innovations
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <input
                            id="agreeTerms"
                            name="agreeTerms"
                            type="checkbox"
                            checked={formData.agreeTerms}
                            onChange={handleInputChange}
                            className={`h-4 w-4 text-[#C9A86A] border rounded focus:ring-[#C9A86A]/50 mt-1 ${
                              validationErrors.agreeTerms ? 'border-red-300' : 'border-black/10'
                            }`}
                          />
                          <div className="ml-3">
                            <label htmlFor="agreeTerms" className="font-medium text-[#111111] tracking-wide">
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
                      <motion.button
                        onClick={prevStep}
                        className="w-1/3 py-3 rounded-full border border-black/10 text-[#111111]/70 font-medium hover:bg-[#F5F6F7] transition-all flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </motion.button>
                      <motion.button
                        onClick={nextStep}
                        className="w-2/3 py-3 rounded-full bg-[#C9A86A] text-[#111111] font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                        whileHover={{ scale: 1.05, backgroundColor: '#D1B47A' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Continue to Payment
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 sticky top-28 border border-black/10">
                    <h3 className="text-xl font-bold text-[#111111] mb-6 tracking-wide">Donation Summary</h3>
                    
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[#6F6F6F]">Donation Amount</span>
                        <span className="text-xl font-semibold text-[#111111]">
                          ${getCurrentAmount().toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-black/10 pt-4 mb-6">
                      <div className="flex justify-between items-center font-bold text-xl">
                        <span className="text-[#111111]">Total</span>
                        <span className="text-[#111111]">${getCurrentAmount().toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="bg-[#F5F6F7] p-4 rounded-lg">
                      <h4 className="font-medium text-[#111111] mb-3 tracking-wide">Where Your Money Goes</h4>
                      <div className="space-y-2 text-sm text-[#6F6F6F]">
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
                      <div className="mt-4 p-3 bg-[#C9A86A]/10 rounded-lg border border-[#C9A86A]/30">
                        <p className="text-xs text-[#6F6F6F]">
                          <strong>Total funding includes:</strong> Direct donations (${totalDonations.toFixed(0)}) + Pre-orders (${totalPreOrders.toFixed(0)})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-[#111111] mb-4 tracking-tight">Complete Your Donation</h2>
                <p className="text-lg text-[#6F6F6F] leading-relaxed">Your support drives the future of smart, automatic EV charging</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-8 border border-black/10">
                    <div className="flex items-center bg-[#F5F6F7] p-6 rounded-lg border border-black/10 mb-6">
                      <Shield className="h-8 w-8 text-[#C9A86A] mr-4" />
                      <div>
                        <p className="text-base font-semibold text-[#111111] tracking-wide">
                          Your Payment is Safe and Secure
                        </p>
                        <p className="text-sm text-[#6F6F6F] mt-1">
                          We use Stripe for secure payment processing with 256-bit SSL encryption
                        </p>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-[#111111] mb-6 tracking-wide">Payment Information</h3>
                    
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
                        <div className="animate-spin h-8 w-8 border-4 border-[#C9A86A] rounded-full border-t-transparent mb-4"></div>
                        <p className="text-[#6F6F6F]">
                          {isProcessing ? 'Preparing your donation...' : 'Loading payment form...'}
                        </p>
                      </div>
                    )}

                    <motion.button
                      onClick={prevStep}
                      className="mt-6 px-6 py-2 rounded-full border border-black/10 text-[#111111]/70 font-medium hover:bg-[#F5F6F7] transition-all flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Information
                    </motion.button>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg p-6 sticky top-28 border border-black/10">
                    <h3 className="text-xl font-bold text-[#111111] mb-6 tracking-wide">Final Summary</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-[#6F6F6F]">Donation Amount</span>
                        <span className="font-semibold text-[#111111]">
                          ${getCurrentAmount().toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-black/10 pt-4">
                        <div className="flex justify-between font-bold text-xl">
                          <span className="text-[#111111]">Total</span>
                          <span className="text-[#111111]">${getCurrentAmount().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#C9A86A]/10 p-4 rounded-lg border border-[#C9A86A]/30">
                      <h4 className="font-medium text-[#111111] mb-2 tracking-wide">Thank You!</h4>
                      <p className="text-sm text-[#6F6F6F]">
                        Your contribution helps accelerate sustainable transportation technology
                      </p>
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
            className="mt-20"
          >
            <div className="flex flex-col gap-6">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-black/10">
                <div className="p-6 border-b border-black/10">
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
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                          filter === value
                            ? 'bg-[#C9A86A] text-[#111111] shadow-md'
                            : 'bg-[#F5F6F7] text-[#111111]/70 hover:bg-[#C9A86A]/10'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {label}
                      </motion.button>
                    ))}
                  </div>
                  <h3 className="text-xl font-semibold text-[#111111] flex items-center tracking-wide">
                    <Users className="w-5 h-5 mr-2 text-[#C9A86A]" />
                    Our Donors
                  </h3>
                </div>

                <div className="p-6 overflow-x-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin h-6 w-6 border-2 border-[#C9A86A] rounded-full border-t-transparent mr-2"></div>
                      <p className="text-[#6F6F6F] text-sm">Loading supporters...</p>
                    </div>
                  ) : donorsWithAmounts.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="w-12 h-12 text-[#6F6F6F] mx-auto mb-3" />
                      <p className="text-[#6F6F6F] text-sm">No supporters yet. Be the first to join our mission!</p>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      {donorsWithAmounts.slice(0, 10).map((donor) => (
                        <motion.div
                          key={donor.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white/70 backdrop-blur-md rounded-lg p-4 flex-shrink-0 w-64 hover:bg-white/80 transition-all border border-black/10"
                        >
                          <div className="flex items-start">
                            <div className="w-8 h-8 bg-[#C9A86A]/10 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                              <Users className="w-4 h-4 text-[#C9A86A]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-[#111111] truncate text-sm tracking-wide">
                                {donor.anonymous ? 'Anonymous Supporter' : `${donor.firstName} ${donor.lastName}`}
                              </p>
                              <p className="text-[#C9A86A] font-semibold text-xs">Donated ${donor.amount.toFixed(2)}</p>
                              {donor.dedicateTo && (
                                <p className="text-[#6F6F6F] italic text-xs truncate">In honor of: {donor.dedicateTo}</p>
                              )}
                              <p className="text-[#6F6F6F] text-xs">
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