"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Script from 'next/script';
import pricingData from '../../data/pricingData.json';
import { db } from '../../firebaseConfig.js';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ChevronDown, ChevronRight, Zap, User, Car, MapPin, CreditCard, Lock, Leaf, Info, Check, X } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_TEST_KEY);

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

// Modal Component for Charging Cable Info
function ChargingCableModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[#F5F6F7] rounded-2xl p-8 max-w-md w-full mx-4 border border-[#111111]/8 shadow-xl"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#111111] tracking-tight">Tesla Wall Connector Plug</h3>
          <button onClick={onClose} className="text-[#6F6F6F] hover:text-[#111111]">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="mb-6">
          <img
            src="/images/tesla-wall-connector.png"
            alt="Tesla Wall Connector Plug"
            className="w-full h-48 object-contain rounded-lg"
          />
        </div>
        <p className="text-[#6F6F6F] text-sm leading-relaxed">
          If you already own a cable that you use to charge your vehicle, DO NOT PURCHASE this add-on. Ampereon integrates with your existing charger. If you need a cable, we’ll provide one compatible with your vehicle (specify vehicle in the next section).
        </p>
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-[#C9A86A] text-white font-semibold rounded-full hover:brightness-110 transition transform hover:scale-105 shadow-lg shadow-[#C9A86A]/30"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}

// Checkout Form Component
function CheckoutForm({ onSuccess, total, isProcessing, setIsProcessing, setError }) {
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
        confirmParams: { return_url: `${window.location.origin}/order/success` },
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
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <PaymentElement />
      </div>
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
          {errorMessage}
        </div>
      )}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-1/3 py-3 rounded-full border border-[#111111]/15 text-[#111111]/70 hover:bg-[#F5F6F7] transition"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-2/3 py-3 bg-[#C9A86A] text-white font-semibold rounded-full hover:brightness-110 transition transform hover:scale-105 shadow-lg shadow-[#C9A86A]/30 flex justify-center items-center"
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
            `Pay $${total.toFixed(2)}`
          )}
        </button>
      </div>
    </form>
  );
}

export default function OrderPage() {
  const [selectedPlan, setSelectedPlan] = useState('advanced');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    installNotes: '',
    referralSource: '',
    agreeTerms: false,
    vehicles: [{ make: '', model: '', year: '', vin: '' }],
  });
  const [addOns, setAddOns] = useState({
    professionalInstallation: false,
    chargingCable: false,
    extendedWarranty: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
    monthlyFee: 0,
    oneTimeFee: 0,
    addOnCost: 0,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [vehicles, setVehicles] = useState(formData.vehicles);

  const router = useRouter();
  const stepRef = useRef(null);
  const isInView = useInView(stepRef, { once: true });

  const plans = pricingData.plans.reduce((acc, plan) => {
    acc[plan.name.toLowerCase()] = plan;
    return acc;
  }, {});

  const addOnsList = [
    {
      name: 'professionalInstallation',
      label: 'Professional Installation',
      price: 40,
      description: 'Expert installation at your location.',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      name: 'chargingCable',
      label: 'Charging Cable',
      price: 320,
      description: 'High-quality, durable charging cable.',
      additionalDescription: (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm font-semibold mb-3">
            ⚠️ DO NOT PURCHASE if you already have a charging cable
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg text-amber-800 text-sm font-semibold"
          >
            <Info className="w-4 h-4 mr-2" /> Check if you need this
          </button>
        </div>
      ),
      icon: <Car className="w-6 h-6" />,
    },
    {
      name: 'extendedWarranty',
      label: 'Extended Warranty',
      price: 50,
      description: 'Additional 2 years of coverage.',
      icon: <Check className="w-6 h-6" />,
    },
  ];

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[\+]?[(]?[\d\s\-\(\)]{10,}$/.test(phone.replace(/\s/g, ''));
  const validateZipCode = (zipCode) => /^\d{5}(-\d{4})?$/.test(zipCode);
  const validateYear = (year) => {
    const currentYear = new Date().getFullYear() + 1;
    return year >= 1900 && year <= currentYear;
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(formData.email)) errors.email = 'Invalid email address';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) errors.phone = 'Invalid phone number';
    if (selectedPlan !== 'basic') {
      if (!formData.address1.trim()) errors.address1 = 'Address is required';
      if (!formData.city.trim()) errors.city = 'City is required';
      if (!formData.state) errors.state = 'State is required';
      if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required';
      else if (!validateZipCode(formData.zipCode)) errors.zipCode = 'Invalid ZIP code';
    }
    const vehicleErrors = [];
    formData.vehicles.forEach((vehicle, index) => {
      const vehicleError = {};
      if (!vehicle.make.trim()) vehicleError.make = 'Make is required';
      if (!vehicle.model.trim()) vehicleError.model = 'Model is required';
      if (!vehicle.year) vehicleError.year = 'Year is required';
      else if (!validateYear(parseInt(vehicle.year))) vehicleError.year = `Year must be 1900–${new Date().getFullYear() + 1}`;
      if (Object.keys(vehicleError).length > 0) vehicleErrors[index] = vehicleError;
    });
    if (vehicleErrors.length > 0) errors.vehicles = vehicleErrors;
    if (!formData.agreeTerms) errors.agreeTerms = 'You must agree to the Terms and Privacy Policy';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const plan = plans[selectedPlan];
    if (!plan) {
      setOrderSummary({ subtotal: 0, tax: 0, total: 0, monthlyFee: 0, oneTimeFee: 0, addOnCost: 0 });
      return;
    }
    const oneTimeFee = plan.oneTimePrice || 0;
    const monthlyFee = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice / 12;
    const addOnCost = addOnsList.reduce((total, addOn) => total + (addOns[addOn.name] ? addOn.price : 0), 0);
    const subtotal = oneTimeFee + addOnCost;
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    setOrderSummary({ subtotal, tax, total, monthlyFee, oneTimeFee, addOnCost });
  }, [selectedPlan, billingCycle, addOns]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const handleAddOnChange = (e) => {
    const { name, checked } = e.target;
    setAddOns({ ...addOns, [name]: checked });
  };

  const handleVehicleChange = (index, field, value) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[index][field] = value;
    setVehicles(updatedVehicles);
    handleInputChange({ target: { name: 'vehicles', value: updatedVehicles } });
  };

  const addVehicle = () => {
    setVehicles([...vehicles, { make: '', model: '', year: '', vin: '' }]);
  };

  const removeVehicle = (index) => {
    if (vehicles.length > 1) {
      const updatedVehicles = vehicles.filter((_, i) => i !== index);
      setVehicles(updatedVehicles);
      handleInputChange({ target: { name: 'vehicles', value: updatedVehicles } });
    }
  };

  const nextStep = () => {
    if (step === 2) {
      if (!validateForm()) {
        const firstErrorField = Object.keys(validationErrors)[0];
        const element = document.getElementById(firstErrorField) || document.getElementById(`make-0`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
        return;
      }
    }
    window.scrollTo(0, 0);
    setStep(step + 1);
    if (step + 1 === 3) prepareOrder();
  };

  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep(step - 1);
  };

  const prepareOrder = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const zipCode = parseInt(formData.zipCode, 10);
      if (isNaN(zipCode) || zipCode <= 0) throw new Error('Invalid ZIP code');
      const userData = {
        'first-name': formData.firstName,
        'last-name': formData.lastName,
        'phone-number': formData.phone,
        'email-address': formData.email,
        vehicles: formData.vehicles.map(v => ({
          make: v.make,
          model: v.model,
          year: parseInt(v.year),
          vin: v.vin || null,
        })),
        reference: formData.referralSource || null,
        address1: formData.address1,
        address2: formData.address2 || null,
        city: formData.city,
        state: formData.state,
        zip: zipCode,
      };
      const userRef = await addDoc(collection(db, 'users'), userData);
      const customerID = userRef.id;
      const orderData = {
        address: {
          street: `${formData.address1}${formData.address2 ? ' ' + formData.address2 : ''}`,
          city: formData.city,
          state: formData.state,
          zip: zipCode,
        },
        subtotal: orderSummary.subtotal,
        tax: orderSummary.tax,
        total: orderSummary.total,
        status: 'Pending',
        orderDate: serverTimestamp(),
        customerID,
        paymentMethod: 'credit',
        paymentStatus: 'Pending',
        addOns: addOns,
        vehicles: formData.vehicles,
      };
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(orderSummary.total * 100),
          metadata: {
            customerID,
            email: formData.email,
            addOns: JSON.stringify(addOns),
            vehicles: JSON.stringify(formData.vehicles),
          },
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.statusText}. Response: ${errorText}`);
      }
      const responseData = await response.json();
      const { clientSecret } = responseData;
      if (!clientSecret) throw new Error('No clientSecret returned from API');
      const paymentIntentId = clientSecret.split('_secret')[0];
      const fullOrderData = { ...orderData, paymentIntentId };
      const orderRef = await addDoc(collection(db, 'orders'), fullOrderData);
      setOrderId(orderRef.id);
      setOrderData(fullOrderData);
      setClientSecret(clientSecret);
      setIsProcessing(false);
    } catch (error) {
      setError(`Failed to prepare order: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'Paid',
        paymentStatus: 'Completed',
        paymentDate: serverTimestamp(),
      });
      if (typeof window !== 'undefined' && window.twq) {
        window.twq('event', 'tw-q1blv-q1bmb', {
          value: orderSummary.total,
          conversion_id: orderId,
          email_address: formData.email,
        });
      } else {
        console.warn('Twitter Pixel (twq) not initialized');
      }
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          orderNumber: `EV-${orderId}`,
          planName: plans[selectedPlan].name,
          total: orderSummary.total,
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: `${formData.address1}${formData.address2 ? ', ' + formData.address2 : ''}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        }),
      });
      router.push(`/order/success?orderId=${orderId}`);
    } catch (error) {
      setError(`Failed to finalize order: ${error.message}`);
    }
  };

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#C9A86A',
        colorBackground: '#F5F6F7',
        colorText: '#111111',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px',
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#F5F6F7] text-[#111111] pt-24 pb-20">
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
      <motion.div
        className="max-w-7xl mx-auto px-6"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        {/* Progress Indicator */}
        <motion.div
          ref={stepRef}
          className="mb-16 max-w-4xl mx-auto"
          variants={fadeUpVariants}
        >
          <div className="flex items-center justify-between mb-6 relative">
            {['Add-Ons', 'Your Information', 'Payment'].map((label, index) => (
              <div key={index} className="flex flex-col items-center relative z-10">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                    step > index + 1
                      ? 'bg-[#C9A86A] text-white border-[#C9A86A]'
                      : step === index + 1
                      ? 'bg-white text-[#C9A86A] border-[#C9A86A]'
                      : 'bg-white text-[#6F6F6F] border-[#111111]/15'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {step > index + 1 ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="text-lg font-bold">{index + 1}</span>
                  )}
                </motion.div>
                <span className={`mt-3 text-sm font-semibold ${step >= index + 1 ? 'text-[#111111]' : 'text-[#6F6F6F]'}`}>
                  {label}
                </span>
              </div>
            ))}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#C9A86A]/20 -z-10" />
            <motion.div
              className="absolute top-1/2 left-0 h-0.5 bg-[#C9A86A] -z-10"
              initial={{ width: '0%' }}
              animate={{ width: `${(step - 1) * 50}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Step 1: Add-Ons */}
        {step === 1 && (
          <motion.div className="max-w-6xl mx-auto" variants={staggerContainer}>
            <motion.div variants={fadeUpVariants} className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#111111]">
                Customize Your <span className="text-[#C9A86A]">Order</span>
              </h1>
              <p className="text-lg text-[#6F6F6F] max-w-3xl mx-auto mt-4">
                Enhance your Ampereon experience with add-ons designed for maximum efficiency and convenience.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div variants={fadeUpVariants} className="lg:col-span-2">
                <div className="bg-[#F5F6F7] backdrop-blur-sm rounded-2xl p-8 border border-[#111111]/8 shadow-sm">
                  <div className="flex items-center mb-8">
                    <div className="text-[#C9A86A] mr-4">
                      <Zap className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#111111] tracking-tight">Available Add-Ons</h2>
                  </div>
                  <div className="space-y-6">
                    {addOnsList.map((addOn, i) => (
                      <motion.div
                        key={addOn.name}
                        className="bg-[#F5F6F7] rounded-2xl p-6 border border-[#111111]/8 hover:border-[#C9A86A]/30 transition-all group"
                        variants={fadeUpVariants}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <div className="flex items-start">
                          <input
                            id={addOn.name}
                            name={addOn.name}
                            type="checkbox"
                            checked={addOns[addOn.name]}
                            onChange={handleAddOnChange}
                            disabled={addOn.name === 'professionalInstallation' && selectedPlan === 'basic'}
                            className="h-5 w-5 text-[#C9A86A] border-[#111111]/15 rounded focus:ring-[#C9A86A]/40 mt-1"
                          />
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <label htmlFor={addOn.name} className="text-xl font-bold text-[#111111] cursor-pointer">
                                {addOn.label}
                              </label>
                              <span className="text-xl font-bold text-[#C9A86A]">${addOn.price}</span>
                            </div>
                            <p className="text-[#6F6F6F]">{addOn.description}</p>
                            {addOn.additionalDescription}
                            {addOn.name === 'professionalInstallation' && selectedPlan === 'basic' && (
                              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#111111]/5 text-[#6F6F6F]">
                                <X className="w-4 h-4 mr-1" /> Not available for Basic Plan
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
              <motion.div variants={fadeUpVariants} className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-[#F5F6F7] backdrop-blur-sm rounded-2xl p-8 border border-[#111111]/8 shadow-sm">
                    <h2 className="text-2xl font-bold text-[#111111] text-center mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-8">
                      {orderSummary.oneTimeFee > 0 && (
                        <div className="flex justify-between text-[#6F6F6F]">
                          <span>Hardware</span>
                          <span className="font-semibold text-[#111111]">${orderSummary.oneTimeFee.toFixed(2)}</span>
                        </div>
                      )}
                      {orderSummary.addOnCost > 0 && (
                        <div className="flex justify-between text-[#6F6F6F]">
                          <span>Add-Ons</span>
                          <span className="font-semibold text-[#111111]">${orderSummary.addOnCost.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[#6F6F6F]">
                        <span>Tax</span>
                        <span className="font-semibold text-[#111111]">${orderSummary.tax.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="border-t border-[#111111]/15 pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-[#111111]">Total Due Today</span>
                        <span className="text-2xl font-bold text-[#C9A86A]">${orderSummary.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-4 mt-8">
                      <button
                        onClick={prevStep}
                        className="w-1/2 py-3 border border-[#111111]/15 rounded-full text-[#111111]/70 hover:bg-[#F5F6F7]"
                      >
                        Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="w-1/2 py-3 bg-[#C9A86A] text-white font-semibold rounded-full hover:brightness-110 transition transform hover:scale-105 shadow-lg"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            <ChargingCableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </motion.div>
        )}

        {/* Step 2: Customer Information */}
        {step === 2 && (
          <motion.div className="max-w-6xl mx-auto" variants={staggerContainer}>
            <motion.div variants={fadeUpVariants} className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#111111]">
                Your <span className="text-[#C9A86A]">Information</span>
              </h1>
              <p className="text-lg text-[#6F6F6F] max-w-3xl mx-auto mt-4">
                Provide your details and vehicle information to personalize your EVolve experience.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div variants={fadeUpVariants} className="lg:col-span-2 space-y-8">
                {/* Contact Information */}
                <motion.div
                  className="bg-[#F5F6F7] backdrop-blur-sm rounded-2xl p-8 border border-[#111111]/8 shadow-sm"
                  variants={fadeUpVariants}
                >
                  <div className="flex items-center mb-8">
                    <div className="text-[#C9A86A] mr-4">
                      <User className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#111111] tracking-tight">Contact Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'Enter your first name' },
                      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Enter your last name' },
                      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
                      { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '(555) 123-4567' },
                    ].map(field => (
                      <div key={field.id} className="space-y-2">
                        <label htmlFor={field.id} className="text-sm font-semibold text-[#111111]">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          id={field.id}
                          name={field.id}
                          value={formData[field.id]}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-4 py-3 bg-white/70 border border-[#111111]/15 rounded-xl focus:ring-2 focus:ring-[#C9A86A]/40 focus:border-[#C9A86A] transition ${
                            validationErrors[field.id] ? 'border-red-300 bg-red-50/50' : ''
                          }`}
                          placeholder={field.placeholder}
                        />
                        {validationErrors[field.id] && (
                          <p className="text-sm text-red-600 flex items-center">
                            <Info className="w-4 h-4 mr-1" /> {validationErrors[field.id]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
                {/* Vehicle Information */}
                <motion.div
                  className="bg-[#F5F6F7] backdrop-blur-sm rounded-2xl p-8 border border-[#111111]/8 shadow-sm"
                  variants={fadeUpVariants}
                >
                  <div className="flex md:justify-between items-center mb-8">
                    <div className="flex items-center">
                      <div className="text-[#C9A86A] mr-4">
                        <Car className="w-8 h-8" />
                      </div>
                      <h2 className="text-3xl font-bold text-[#111111] tracking-tight">Vehicle Information</h2>
                    </div>
                    <button
                      onClick={addVehicle}
                      className="hidden md:flex items-center px-4 py-2 bg-[#C9A86A] text-white rounded-full hover:brightness-110 transition"
                    >
                      <Check className="w-4 h-4 mr-2" /> Add Vehicle
                    </button>
                  </div>
                  {vehicles.map((vehicle, index) => (
                    <motion.div
                      key={index}
                      className="mb-6 last:mb-0 bg-white/50 rounded-xl p-6 border border-[#111111]/8"
                      variants={fadeUpVariants}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-[#111111]">
                          Vehicle {index + 1}
                        </h3>
                        {vehicles.length > 1 && (
                          <button
                            onClick={() => removeVehicle(index)}
                            className="text-red-500 hover:text-red-600 text-sm font-semibold"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { id: `make-${index}`, field: 'make', label: 'Make', placeholder: 'Tesla' },
                          { id: `model-${index}`, field: 'model', label: 'Model', placeholder: 'Model 3' },
                          { id: `year-${index}`, field: 'year', label: 'Year', placeholder: '2024', type: 'number' },
                          { id: `vin-${index}`, field: 'vin', label: 'VIN (Optional)', placeholder: 'Enter VIN', required: false },
                        ].map(field => (
                          <div key={field.id} className="space-y-2">
                            <label htmlFor={field.id} className="text-sm font-semibold text-[#111111]">
                              {field.label}
                            </label>
                            <input
                              type={field.type || 'text'}
                              id={field.id}
                              value={vehicle[field.field]}
                              onChange={(e) => handleVehicleChange(index, field.field, e.target.value)}
                              required={field.required !== false}
                              className={`w-full px-4 py-3 bg-white/70 border border-[#111111]/15 rounded-xl focus:ring-2 focus:ring-[#C9A86A]/40 focus:border-[#C9A86A] transition ${
                                validationErrors.vehicles?.[index]?.[field.field] ? 'border-red-300 bg-red-50/50' : ''
                              }`}
                              placeholder={field.placeholder}
                              {...(field.type === 'number' && { min: 1900, max: new Date().getFullYear() + 1 })}
                            />
                            {validationErrors.vehicles?.[index]?.[field.field] && (
                              <p className="text-sm text-red-600 flex items-center">
                                <Info className="w-4 h-4 mr-1" /> {validationErrors.vehicles[index][field.field]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                  <button
                    onClick={addVehicle}
                    className="md:hidden w-full py-3 bg-[#C9A86A] text-white rounded-full hover:brightness-110 transition mt-4"
                  >
                    Add Vehicle
                  </button>
                </motion.div>
                {/* Delivery Address */}
                {selectedPlan !== 'basic' && (
                  <motion.div
                    className="bg-[#F5F6F7] backdrop-blur-sm rounded-2xl p-8 border border-[#111111]/8 shadow-sm"
                    variants={fadeUpVariants}
                  >
                    <div className="flex items-center mb-8">
                      <div className="text-[#C9A86A] mr-4">
                        <MapPin className="w-8 h-8" />
                      </div>
                      <h2 className="text-3xl font-bold text-[#111111] tracking-tight">Delivery Address</h2>
                    </div>
                    <div className="space-y-6">
                      {[
                        { id: 'address1', label: 'Address Line 1', placeholder: '123 Main Street' },
                        { id: 'address2', label: 'Address Line 2 (Optional)', placeholder: 'Apartment, suite, etc.', required: false },
                        { id: 'city', label: 'City', placeholder: 'San Francisco' },
                        { id: 'zipCode', label: 'ZIP Code', placeholder: '94105', maxLength: 10 },
                      ].map(field => (
                        <div key={field.id} className="space-y-2">
                          <label htmlFor={field.id} className="text-sm font-semibold text-[#111111]">
                            {field.label}
                          </label>
                          <input
                            type="text"
                            id={field.id}
                            name={field.id}
                            value={formData[field.id]}
                            onChange={handleInputChange}
                            required={field.required !== false}
                            maxLength={field.maxLength}
                            className={`w-full px-4 py-3 bg-white/70 border border-[#111111]/15 rounded-xl focus:ring-2 focus:ring-[#C9A86A]/40 focus:border-[#C9A86A] transition ${
                              validationErrors[field.id] ? 'border-red-300 bg-red-50/50' : ''
                            }`}
                            placeholder={field.placeholder}
                          />
                          {validationErrors[field.id] && (
                            <p className="text-sm text-red-600 flex items-center">
                              <Info className="w-4 h-4 mr-1" /> {validationErrors[field.id]}
                            </p>
                          )}
                        </div>
                      ))}
                      <div className="space-y-2">
                        <label htmlFor="state" className="text-sm font-semibold text-[#111111]">
                          State
                        </label>
                        <select
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-4 py-3 bg-white/70 border border-[#111111]/15 rounded-xl focus:ring-2 focus:ring-[#C9A86A]/40 focus:border-[#C9A86A] transition ${
                            validationErrors.state ? 'border-red-300 bg-red-50/50' : ''
                          }`}
                        >
                          <option value="">Select State</option>
                          {[
                            'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME',
                            'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI',
                            'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'AS', 'GU', 'MP', 'PR', 'VI'
                          ].map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        {validationErrors.state && (
                          <p className="text-sm text-red-600 flex items-center">
                            <Info className="w-4 h-4 mr-1" /> {validationErrors.state}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
                {/* Additional Information */}
                <motion.div
                  className="bg-[#F5F6F7] backdrop-blur-sm rounded-2xl p-8 border border-[#111111]/8 shadow-sm"
                  variants={fadeUpVariants}
                >
                  <div className="flex items-center mb-8">
                    <div className="text-[#C9A86A] mr-4">
                      <Info className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#111111] tracking-tight">Additional Information</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="referralSource" className="text-sm font-semibold text-[#111111]">
                        How did you hear about us? (Optional)
                      </label>
                      <select
                        id="referralSource"
                        name="referralSource"
                        value={formData.referralSource}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/70 border border-[#111111]/15 rounded-xl focus:ring-2 focus:ring-[#C9A86A]/40 focus:border-[#C9A86A] transition"
                      >
                        <option value="">Select an option</option>
                        <option value="Google">Google</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Friend or Family">Friend or Family</option>
                        <option value="EV Forum">EV Forum</option>
                        <option value="News Article">News Article</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="bg-white/50 rounded-xl p-6 border border-[#111111]/8">
                      <div className="flex items-start">
                        <input
                          id="agreeTerms"
                          name="agreeTerms"
                          type="checkbox"
                          checked={formData.agreeTerms}
                          onChange={handleInputChange}
                          required
                          className={`h-5 w-5 text-[#C9A86A] border-[#111111]/15 rounded focus:ring-[#C9A86A]/40 mt-1 ${
                            validationErrors.agreeTerms ? 'border-red-300' : ''
                          }`}
                        />
                        <div className="ml-4">
                          <label htmlFor="agreeTerms" className="font-semibold text-[#111111]">
                            I agree to the Terms of Service and Privacy Policy
                          </label>
                          <p className="text-[#6F6F6F] text-sm mt-1">
                            By checking this box, you consent to our{' '}
                            <a href="#tos" className="text-[#C9A86A] hover:text-[#B48F55] underline">
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#privacypolicy" className="text-[#C9A86A] hover:text-[#B48F55] underline">
                              Privacy Policy
                            </a>.
                          </p>
                          {validationErrors.agreeTerms && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <Info className="w-4 h-4 mr-1" /> {validationErrors.agreeTerms}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
              {/* Order Summary */}
              <motion.div variants={fadeUpVariants} className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-[#F5F6F7] backdrop-blur-sm rounded-2xl p-8 border border-[#111111]/8 shadow-sm">
                    <h2 className="text-2xl font-bold text-[#111111] text-center mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-8">
                      {orderSummary.oneTimeFee > 0 && (
                        <div className="flex justify-between text-[#6F6F6F]">
                          <span>Hardware</span>
                          <span className="font-semibold text-[#111111]">${orderSummary.oneTimeFee.toFixed(2)}</span>
                        </div>
                      )}
                      {orderSummary.addOnCost > 0 && (
                        <div className="flex justify-between text-[#6F6F6F]">
                          <span>Add-Ons</span>
                          <span className="font-semibold text-[#111111]">${orderSummary.addOnCost.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[#6F6F6F]">
                        <span>Tax</span>
                        <span className="font-semibold text-[#111111]">${orderSummary.tax.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="border-t border-[#111111]/15 pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-[#111111]">Total Due Today</span>
                        <span className="text-2xl font-bold text-[#C9A86A]">${orderSummary.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-4 mt-8">
                      <button
                        onClick={prevStep}
                        className="w-1/2 py-3 border border-[#111111]/15 rounded-full text-[#111111]/70 hover:bg-[#F5F6F7]"
                      >
                        Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="w-1/2 py-3 bg-[#C9A86A] text-white font-semibold rounded-full hover:brightness-110 transition transform hover:scale-105 shadow-lg"
                      >
                        Continue
                      </button>
                    </div>
                    <div className="mt-6 bg-white/50 rounded-xl p-6 border border-[#111111]/8">
                      <h3 className="font-bold text-[#111111] mb-4 flex items-center">
                        <Info className="w-5 h-5 text-[#C9A86A] mr-2" /> What's Next?
                      </h3>
                      <ul className="space-y-3 text-[#6F6F6F] text-sm">
                        <li className="flex items-center">
                          <Check className="w-4 h-4 text-[#C9A86A] mr-2" /> Order confirmation email
                        </li>
                        <li className="flex items-center">
                          <Check className="w-4 h-4 text-[#C9A86A] mr-2" /> Access to EVolve app
                        </li>
                        <li className="flex items-center">
                          <Check className="w-4 h-4 text-[#C9A86A] mr-2" /> Priority updates
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <motion.div className="max-w-6xl mx-auto" variants={staggerContainer}>
            <motion.div variants={fadeUpVariants} className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#111111]">
                Payment <span className="text-[#C9A86A]">Information</span>
              </h1>
              <p className="text-lg text-[#6F6F6F] max-w-3xl mx-auto mt-4">
                Securely complete your Ampereon order with industry-leading encryption.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div variants={fadeUpVariants} className="lg:col-span-2">
                {/* Climate Impact Notice */}
                <motion.div
                  className="bg-white/50 rounded-2xl p-6 border border-[#111111]/8 mb-8"
                  variants={fadeUpVariants}
                >
                  <div className="flex items-start">
                    <div className="text-[#C9A86A] mr-4">
                      <Leaf className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#111111] mb-2">Climate Impact Commitment</h3>
                      <p className="text-[#6F6F6F] text-sm">
                        A portion of your payment supports carbon removal initiatives, contributing to a sustainable future.
                      </p>
                    </div>
                  </div>
                </motion.div>
                {/* Payment Form */}
                <motion.div
                  className="bg-[#F5F6F7] backdrop-blur-sm rounded-2xl p-8 border border-[#111111]/8 shadow-sm"
                  variants={fadeUpVariants}
                >
                  <div className="flex items-center mb-8">
                    <div className="text-[#C9A86A] mr-4">
                      <CreditCard className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-[#111111] tracking-tight">Payment Method</h2>
                  </div>
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
                      <div className="flex items-center">
                        <Info className="w-5 h-5 mr-2" /> <span className="font-semibold">Error:</span>
                      </div>
                      <div className="mt-1">{error}</div>
                    </div>
                  )}
                  {clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                      <CheckoutForm
                        onSuccess={handlePaymentSuccess}
                        total={orderSummary.total}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                        setError={setError}
                      />
                    </Elements>
                  ) : (
                    <div className="flex flex-col items-center py-12">
                      <div className="relative">
                        <div className="animate-spin h-10 w-10 border-4 border-[#C9A86A] rounded-full border-t-transparent"></div>
                      </div>
                      <p className="text-[#6F6F6F] mt-4">
                        {isProcessing ? 'Preparing your order...' : 'Loading payment form...'}
                      </p>
                    </div>
                  )}
                </motion.div>
                {/* Security Notice */}
                <motion.div
                  className="bg-white/50 rounded-2xl p-6 border border-[#111111]/8"
                  variants={fadeUpVariants}
                >
                  <div className="flex items-start">
                    <div className="text-[#C9A86A] mr-4">
                      <Lock className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#111111] mb-2">Secure Payment Processing</h3>
                      <p className="text-[#6F6F6F] text-sm">
                        Your payment is securely processed by Stripe with industry-leading encryption. We never store your credit card details.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
              {/* Order Summary */}
              <motion.div variants={fadeUpVariants} className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-[#F5F6F7] backdrop-blur-sm rounded-2xl p-8 border border-[#111111]/8 shadow-sm">
                    <h2 className="text-2xl font-bold text-[#111111] text-center mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-8">
                      {orderSummary.oneTimeFee > 0 && (
                        <div className="flex justify-between text-[#6F6F6F]">
                          <span>Hardware</span>
                          <span className="font-semibold text-[#111111]">${orderSummary.oneTimeFee.toFixed(2)}</span>
                        </div>
                      )}
                      {orderSummary.addOnCost > 0 && (
                        <div className="flex justify-between text-[#6F6F6F]">
                          <span>Add-Ons</span>
                          <span className="font-semibold text-[#111111]">${orderSummary.addOnCost.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[#6F6F6F]">
                        <span>Tax</span>
                        <span className="font-semibold text-[#111111]">${orderSummary.tax.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="border-t border-[#111111]/15 pt-6">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-[#111111]">Total Due Today</span>
                        <span className="text-2xl font-bold text-[#C9A86A]">${orderSummary.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="mt-6 bg-white/50 rounded-xl p-6 border border-[#111111]/8">
                      <h3 className="font-bold text-[#111111] mb-4 flex items-center">
                        <Info className="w-5 h-5 text-[#C9A86A] mr-2" /> What's Next?
                      </h3>
                      <ul className="space-y-3 text-[#6F6F6F] text-sm">
                        <li className="flex items-center">
                          <Check className="w-4 h-4 text-[#C9A86A] mr-2" /> Order confirmation email
                        </li>
                        <li className="flex items-center">
                          <Check className="w-4 h-4 text-[#C9A86A] mr-2" /> Access to EVolve app
                        </li>
                        <li className="flex items-center">
                          <Check className="w-4 h-4 text-[#C9A86A] mr-2" /> Priority updates
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}