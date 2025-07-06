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
import { ChevronDown, ChevronRight, Zap, User, Car, MapPin, CreditCard, Lock, Leaf, Info, Check, X, Shield, Star } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1 } 
  }
};

// Modal Component for Charging Cable Info
function ChargingCableModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6 max-w-md w-full mx-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Tesla Wall Connector</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mb-4">
            <img
              src="/images/tesla-wall-connector.png"
              alt="Tesla Wall Connector"
              className="w-full h-32 object-contain rounded bg-[#0A0A0A]"
            />
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            If you already own a charging cable, do not purchase this add-on. 
            Ampereon integrates with your existing charger.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#D4AF37] text-black rounded hover:bg-[#B8860B] transition-colors"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="p-4 bg-red-900/20 border border-red-500/30 rounded text-sm text-red-300">
          {errorMessage}
        </div>
      )}
      
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 py-3 border border-[#D4AF37]/30 rounded text-white hover:bg-[#D4AF37]/10 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-2 py-3 bg-[#D4AF37] text-black rounded hover:bg-[#B8860B] transition-colors 
                   disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-black rounded-full border-t-transparent mr-2" />
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
      description: 'Expert installation at your location',
    },
    {
      name: 'chargingCable',
      label: 'Charging Cable',
      price: 320,
      description: 'High-quality charging cable',
      additionalDescription: (
        <div className="mt-3 p-3 bg-amber-900/20 border border-amber-600/30 rounded text-sm">
          <p className="text-amber-300 font-medium mb-2">
            Only purchase if you don't have a charging cable
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-amber-300 hover:text-amber-200 underline"
          >
            Check compatibility
          </button>
        </div>
      ),
    },
    {
      name: 'extendedWarranty',
      label: 'Extended Warranty',
      price: 50,
      description: 'Additional 2 years of coverage',
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
      theme: 'night',
      variables: {
        colorPrimary: '#D4AF37',
        colorBackground: '#1A1A1A',
        colorText: '#FFFFFF',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        spacingUnit: '4px',
        borderRadius: '6px',
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white py-16">
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
        className="max-w-4xl mx-auto px-6"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        {/* Progress Indicator */}
        <motion.div
          ref={stepRef}
          className="mb-16"
          variants={fadeUpVariants}
        >
          <div className="flex items-center justify-between mb-8">
            {['Add-Ons', 'Information', 'Payment'].map((label, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-medium ${
                  step > index + 1
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                    : step === index + 1
                    ? 'border-[#D4AF37] text-[#D4AF37]'
                    : 'border-gray-600 text-gray-400'
                }`}>
                  {step > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`mt-2 text-sm ${step >= index + 1 ? 'text-white' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-px bg-gray-800 relative">
            <div 
              className="h-px bg-[#D4AF37] transition-all duration-500"
              style={{ width: `${(step - 1) * 50}%` }}
            />
          </div>
        </motion.div>

        {/* Step 1: Add-Ons */}
        {step === 1 && (
          <motion.div variants={staggerContainer} className="space-y-8">
            <motion.div variants={fadeUpVariants} className="text-center">
              <h1 className="text-3xl font-light mb-4">Customize Your Order</h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Select add-ons to enhance your Ampereon experience.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div variants={fadeUpVariants} className="lg:col-span-2">
                <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6">
                  <h2 className="text-xl font-medium mb-6">Available Add-Ons</h2>
                  
                  <div className="space-y-4">
                    {addOnsList.map((addOn, i) => (
                      <motion.div
                        key={addOn.name}
                        className="border border-gray-700 rounded-lg p-4 hover:border-[#D4AF37]/30 transition-colors"
                        variants={fadeUpVariants}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <input
                              id={addOn.name}
                              name={addOn.name}
                              type="checkbox"
                              checked={addOns[addOn.name]}
                              onChange={handleAddOnChange}
                              disabled={addOn.name === 'professionalInstallation' && selectedPlan === 'basic'}
                              className="mt-1 w-4 h-4 text-[#D4AF37] bg-[#0A0A0A] border-gray-600 rounded focus:ring-[#D4AF37]"
                            />
                            <div className="flex-1">
                              <label htmlFor={addOn.name} className="font-medium text-white cursor-pointer">
                                {addOn.label}
                              </label>
                              <p className="text-sm text-gray-400 mt-1">{addOn.description}</p>
                              {addOn.additionalDescription}
                              {addOn.name === 'professionalInstallation' && selectedPlan === 'basic' && (
                                <div className="mt-2 text-sm text-gray-500">
                                  Not available for Basic Plan
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="font-medium text-[#D4AF37]">${addOn.price}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={fadeUpVariants}>
                <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6 sticky top-6">
                  <h3 className="font-medium mb-4">Order Summary</h3>
                  
                  <div className="space-y-2 text-sm">
                    {orderSummary.oneTimeFee > 0 && (
                      <div className="flex justify-between text-gray-400">
                        <span>Hardware</span>
                        <span className="text-white">${orderSummary.oneTimeFee.toFixed(2)}</span>
                      </div>
                    )}
                    {orderSummary.addOnCost > 0 && (
                      <div className="flex justify-between text-gray-400">
                        <span>Add-Ons</span>
                        <span className="text-white">${orderSummary.addOnCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-400">
                      <span>Tax</span>
                      <span className="text-white">${orderSummary.tax.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 mt-4 pt-4">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-[#D4AF37]">${orderSummary.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={nextStep}
                    className="w-full mt-6 py-3 bg-[#D4AF37] text-black rounded hover:bg-[#B8860B] transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            </div>
            
            <ChargingCableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          </motion.div>
        )}

        {/* Step 2: Customer Information */}
        {step === 2 && (
          <motion.div variants={staggerContainer} className="space-y-8">
            <motion.div variants={fadeUpVariants} className="text-center">
              <h1 className="text-3xl font-light mb-4">Your Information</h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Please provide your details and vehicle information.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div variants={fadeUpVariants} className="lg:col-span-2 space-y-8">
                {/* Contact Information */}
                <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6">
                  <h2 className="text-xl font-medium mb-6">Contact Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'First name' },
                      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Last name' },
                      { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 123-4567' },
                    ].map(field => (
                      <div key={field.id}>
                        <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          id={field.id}
                          name={field.id}
                          value={formData[field.id]}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-3 py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                            validationErrors[field.id] ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder={field.placeholder}
                        />
                        {validationErrors[field.id] && (
                          <p className="text-sm text-red-400 mt-1">{validationErrors[field.id]}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-medium">Vehicle Information</h2>
                    <button
                      onClick={addVehicle}
                      className="text-sm text-[#D4AF37] hover:text-[#B8860B]"
                    >
                      + Add Vehicle
                    </button>
                  </div>
                  
                  {vehicles.map((vehicle, index) => (
                    <div key={index} className="mb-6 last:mb-0 p-4 border border-gray-700 rounded">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Vehicle {index + 1}</h3>
                        {vehicles.length > 1 && (
                          <button
                            onClick={() => removeVehicle(index)}
                            className="text-sm text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { id: `make-${index}`, field: 'make', label: 'Make', placeholder: 'Tesla' },
                          { id: `model-${index}`, field: 'model', label: 'Model', placeholder: 'Model 3' },
                          { id: `year-${index}`, field: 'year', label: 'Year', placeholder: '2024', type: 'number' },
                          { id: `vin-${index}`, field: 'vin', label: 'VIN (Optional)', placeholder: 'VIN', required: false },
                        ].map(field => (
                          <div key={field.id}>
                            <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">
                              {field.label}
                            </label>
                            <input
                              type={field.type || 'text'}
                              id={field.id}
                              value={vehicle[field.field]}
                              onChange={(e) => handleVehicleChange(index, field.field, e.target.value)}
                              required={field.required !== false}
                              className={`w-full px-3 py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                                validationErrors.vehicles?.[index]?.[field.field] ? 'border-red-500' : 'border-gray-600'
                              }`}
                              placeholder={field.placeholder}
                              {...(field.type === 'number' && { min: 1900, max: new Date().getFullYear() + 1 })}
                            />
                            {validationErrors.vehicles?.[index]?.[field.field] && (
                              <p className="text-sm text-red-400 mt-1">
                                {validationErrors.vehicles[index][field.field]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address */}
                {selectedPlan !== 'basic' && (
                  <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6">
                    <h2 className="text-xl font-medium mb-6">Delivery Address</h2>
                    
                    <div className="space-y-4">
                      {[
                        { id: 'address1', label: 'Address', placeholder: '123 Main Street' },
                        { id: 'address2', label: 'Address Line 2 (Optional)', placeholder: 'Apartment, suite, etc.', required: false },
                        { id: 'city', label: 'City', placeholder: 'San Francisco' },
                        { id: 'zipCode', label: 'ZIP Code', placeholder: '94105' },
                      ].map(field => (
                        <div key={field.id}>
                          <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">
                            {field.label}
                          </label>
                          <input
                            type="text"
                            id={field.id}
                            name={field.id}
                            value={formData[field.id]}
                            onChange={handleInputChange}
                            required={field.required !== false}
                            className={`w-full px-3 py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                              validationErrors[field.id] ? 'border-red-500' : 'border-gray-600'
                            }`}
                            placeholder={field.placeholder}
                          />
                          {validationErrors[field.id] && (
                            <p className="text-sm text-red-400 mt-1">{validationErrors[field.id]}</p>
                          )}
                        </div>
                      ))}
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-300 mb-2">
                          State
                        </label>
                        <select
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-3 py-2 bg-[#0A0A0A] border rounded text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                            validationErrors.state ? 'border-red-500' : 'border-gray-600'
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
                          <p className="text-sm text-red-400 mt-1">{validationErrors.state}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6">
                  <h2 className="text-xl font-medium mb-6">Additional Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="referralSource" className="block text-sm font-medium text-gray-300 mb-2">
                        How did you hear about us? (Optional)
                      </label>
                      <select
                        id="referralSource"
                        name="referralSource"
                        value={formData.referralSource}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[#0A0A0A] border border-gray-600 rounded text-white focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
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
                    
                    <div className="flex items-start space-x-3">
                      <input
                        id="agreeTerms"
                        name="agreeTerms"
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        required
                        className="mt-1 w-4 h-4 text-[#D4AF37] bg-[#0A0A0A] border-gray-600 rounded focus:ring-[#D4AF37]"
                      />
                      <div className="text-sm">
                        <label htmlFor="agreeTerms" className="font-medium text-white">
                          I agree to the Terms of Service and Privacy Policy
                        </label>
                        <p className="text-gray-400 mt-1">
                          By checking this box, you consent to our{' '}
                          <a href="#" className="text-[#D4AF37] hover:text-[#B8860B] underline">Terms of Service</a>{' '}
                          and{' '}
                          <a href="#" className="text-[#D4AF37] hover:text-[#B8860B] underline">Privacy Policy</a>.
                        </p>
                        {validationErrors.agreeTerms && (
                          <p className="text-red-400 mt-1">{validationErrors.agreeTerms}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Order Summary */}
              <motion.div variants={fadeUpVariants}>
                <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6 sticky top-6">
                  <h3 className="font-medium mb-4">Order Summary</h3>
                  
                  <div className="space-y-2 text-sm">
                    {orderSummary.oneTimeFee > 0 && (
                      <div className="flex justify-between text-gray-400">
                        <span>Hardware</span>
                        <span className="text-white">${orderSummary.oneTimeFee.toFixed(2)}</span>
                      </div>
                    )}
                    {orderSummary.addOnCost > 0 && (
                      <div className="flex justify-between text-gray-400">
                        <span>Add-Ons</span>
                        <span className="text-white">${orderSummary.addOnCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-400">
                      <span>Tax</span>
                      <span className="text-white">${orderSummary.tax.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 mt-4 pt-4">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-[#D4AF37]">${orderSummary.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-6">
                    <button
                      onClick={prevStep}
                      className="flex-1 py-3 border border-[#D4AF37]/30 rounded text-white hover:bg-[#D4AF37]/10 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="flex-1 py-3 bg-[#D4AF37] text-black rounded hover:bg-[#B8860B] transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <motion.div variants={staggerContainer} className="space-y-8">
            <motion.div variants={fadeUpVariants} className="text-center">
              <h1 className="text-3xl font-light mb-4">Payment</h1>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Complete your order with secure payment processing.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div variants={fadeUpVariants} className="lg:col-span-2">
                <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6">
                  <h2 className="text-xl font-medium mb-6">Payment Information</h2>
                  
                  {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded text-red-300">
                      {error}
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
                    <div className="text-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-[#D4AF37] rounded-full border-t-transparent mx-auto mb-4" />
                      <p className="text-gray-400">
                        {isProcessing ? 'Preparing your order...' : 'Loading payment form...'}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 bg-[#0A0A0A] border border-[#D4AF37]/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-sm text-gray-400">
                      Secured by 256-bit SSL encryption
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Order Summary */}
              <motion.div variants={fadeUpVariants}>
                <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6 sticky top-6">
                  <h3 className="font-medium mb-4">Order Summary</h3>
                  
                  <div className="space-y-2 text-sm">
                    {orderSummary.oneTimeFee > 0 && (
                      <div className="flex justify-between text-gray-400">
                        <span>Hardware</span>
                        <span className="text-white">${orderSummary.oneTimeFee.toFixed(2)}</span>
                      </div>
                    )}
                    {orderSummary.addOnCost > 0 && (
                      <div className="flex justify-between text-gray-400">
                        <span>Add-Ons</span>
                        <span className="text-white">${orderSummary.addOnCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-400">
                      <span>Tax</span>
                      <span className="text-white">${orderSummary.tax.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 mt-4 pt-4">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-[#D4AF37]">${orderSummary.total.toFixed(2)}</span>
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