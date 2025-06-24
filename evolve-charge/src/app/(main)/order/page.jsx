"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import Script from 'next/script';
import pricingData from '../../data/pricingData.json';
import { db } from '../../firebaseConfig.js';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

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

// Modal Component for Charging Cable Info
function ChargingCableModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Tesla Wall Connector Plug</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <img
            src="/images/tesla-wall-connector.png"
            alt="Tesla Wall Connector Plug"
            className="w-full h-48 object-contain rounded-lg"
          />
        </div>
        <p className="text-gray-700 text-sm">
          If you have already own a cable that you use to charge your vehicle then DO NOT PURCHASE this add-on. The EVolve Charger is designed to integrate with the charger you already use. If you do not own one then we will provide a charging cable designed to work with the vehicle you own (specify vehicle in next section).
        </p>
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:shadow-md transition-all"
        >
          Close
        </button>
      </div>
    </div>
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
        confirmParams: {
          return_url: `${window.location.origin}/order/success`,
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
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <PaymentElement />
      </div>
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-1/3 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-2/3 py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-md hover:shadow-lg transition-all flex justify-center items-center"
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

  // Handle vehicle field changes
  const handleVehicleChange = (index, field, value) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[index][field] = value;
    setVehicles(updatedVehicles);
    handleInputChange({ target: { name: 'vehicles', value: updatedVehicles } });
  };

  // Add a new vehicle entry
  const addVehicle = () => {
    setVehicles([...vehicles, { make: '', model: '', year: '', vin: '' }]);
  };

  // Remove a vehicle entry
  const removeVehicle = (index) => {
    if (vehicles.length > 1) {
      const updatedVehicles = vehicles.filter((_, i) => i !== index);
      setVehicles(updatedVehicles);
      handleInputChange({ target: { name: 'vehicles', value: updatedVehicles } });
    }
  };

  const router = useRouter();

  const plans = pricingData.plans.reduce((acc, plan) => {
    acc[plan.name.toLowerCase()] = plan;
    return acc;
  }, {});

   const addOnsList = [
    { name: 'professionalInstallation', label: 'Professional Installation', price: 40, description: 'Expert installation at your location.' },
    { 
      name: 'chargingCable', 
      label: 'Charging Cable', 
      price: 320, 
      description: 'High-quality, durable charging cable.',
      additionalDescription: (
        <div className="space-y-3">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-amber-800 text-sm font-semibold mb-2">
              ⚠️ DO NOT PURCHASE if you already have a charging cable for your vehicle
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg text-amber-800 text-sm font-semibold transition-all duration-200 hover:shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Click here to check if you need this
            </button>
          </div>
        </div>
      )
    },
    { name: 'extendedWarranty', label: 'Extended Warranty', price: 50, description: 'Additional 2 years of coverage for your charger.' }
  ];

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\+]?[(]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateZipCode = (zipCode) => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  };

  const validateYear = (year) => {
    const currentYear = new Date().getFullYear() + 1;
    return year >= 1900 && year <= currentYear;
  };

  const validateForm = () => {
    const errors = {};

    // Required fields validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // Address validation (only for non-basic plans)
    if (selectedPlan !== 'basic') {
      if (!formData.address1.trim()) {
        errors.address1 = 'Address is required';
      }

      if (!formData.city.trim()) {
        errors.city = 'City is required';
      }

      if (!formData.state) {
        errors.state = 'State is required';
      }

      if (!formData.zipCode.trim()) {
        errors.zipCode = 'ZIP code is required';
      } else if (!validateZipCode(formData.zipCode)) {
        errors.zipCode = 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)';
      }
    }

    // Vehicle validation
    const vehicleErrors = [];
    formData.vehicles.forEach((vehicle, index) => {
      const vehicleError = {};
      if (!vehicle.make.trim()) {
        vehicleError.make = 'Make is required';
      }
      if (!vehicle.model.trim()) {
        vehicleError.model = 'Model is required';
      }
      if (!vehicle.year) {
        vehicleError.year = 'Year is required';
      } else if (!validateYear(parseInt(vehicle.year))) {
        vehicleError.year = `Year must be between 1900 and ${new Date().getFullYear() + 1}`;
      }
      if (Object.keys(vehicleError).length > 0) {
        vehicleErrors[index] = vehicleError;
      }
    });

    if (vehicleErrors.length > 0) {
      errors.vehicles = vehicleErrors;
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the Terms of Service and Privacy Policy';
    }

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
    const addOnCost = addOnsList.reduce((total, addOn) => {
      return total + (addOns[addOn.name] ? addOn.price : 0);
    }, 0);
    const subtotal = oneTimeFee + addOnCost;
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    setOrderSummary({ subtotal, tax, total, monthlyFee, oneTimeFee, addOnCost });
  }, [selectedPlan, billingCycle, addOns]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };

  const handleAddOnChange = (e) => {
    const { name, checked } = e.target;
    setAddOns({
      ...addOns,
      [name]: checked,
    });
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
    const nextStepNumber = step + 1;
    setStep(nextStepNumber);
    
    if (nextStepNumber === 3) {
      prepareOrder();
    }
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
      if (isNaN(zipCode) || zipCode <= 0) {
        throw new Error('Invalid ZIP code');
      }
      
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
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}. Response: ${errorText}`);
      }

      const responseData = await response.json();
      const { clientSecret } = responseData;
      
      if (!clientSecret) {
        throw new Error('No clientSecret returned from API');
      }

      const paymentIntentId = clientSecret.split('_secret')[0];

      const fullOrderData = {
        ...orderData,
        paymentIntentId,
      };
      
      const orderRef = await addDoc(collection(db, 'orders'), fullOrderData);
      const orderId = orderRef.id;

      setOrderId(orderId);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-32 pb-20">
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('config','q1bwx');
          `,
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Order Progress */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-between mb-8">
            {['Add-Ons', 'Your Information', 'Payment'].map((label, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  step > index + 1 
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25' 
                    : step === index + 1 
                      ? 'bg-white border-2 border-teal-500 text-teal-500 shadow-lg shadow-teal-500/10' 
                      : 'bg-white border border-gray-300 text-gray-400 shadow-sm'
                }`}>
                  {step > index + 1 ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-lg font-bold">{index + 1}</span>
                  )}
                  {step === index + 1 && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur opacity-30 animate-pulse"></div>
                  )}
                </div>
                <span className={`text-sm font-semibold mt-3 transition-colors ${
                  step >= index + 1 ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {label}
                </span>
                {step === index + 1 && (
                  <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(step - 1) * 50}%` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] animate-[shimmer_2s_ease-in-out_infinite]"></div>
          </div>
        </div>

        {/* Step 1: Enhanced Add-Ons */}
        {step === 1 && (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-6xl mx-auto">
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Customize Your <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">Order</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Enhance your EVolve Charge experience with these carefully selected add-ons designed to maximize your charging efficiency.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <motion.div variants={fadeIn} className="lg:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Available Add-Ons</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {addOnsList.map((addOn) => (
                      <div key={addOn.name} className="group relative">
                        <div className={`bg-gradient-to-r p-[1px] rounded-2xl transition-all duration-300 ${
                          addOns[addOn.name] 
                            ? 'from-teal-500 to-cyan-500' 
                            : 'from-gray-200 to-gray-200 group-hover:from-teal-300 group-hover:to-cyan-300'
                        }`}>
                          <div className="bg-white rounded-2xl p-6">
                            <div className="flex items-start">
                              <div className="flex items-center h-6 mt-1">
                                <input
                                  id={addOn.name}
                                  name={addOn.name}
                                  type="checkbox"
                                  checked={addOns[addOn.name]}
                                  onChange={handleAddOnChange}
                                  disabled={addOn.name === 'professionalInstallation' && selectedPlan === 'basic'}
                                  className="h-5 w-5 text-teal-500 border-2 border-gray-300 rounded-lg focus:ring-3 focus:ring-teal-500/20 transition-all"
                                />
                              </div>
                              <div className="ml-4 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <label htmlFor={addOn.name} className="text-xl font-bold text-gray-900 cursor-pointer">
                                    {addOn.label}
                                  </label>
                                  <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                                    ${addOn.price}
                                  </span>
                                </div>
                                <p className="text-gray-600 mb-3 leading-relaxed">{addOn.description}</p>
                                {addOn.additionalDescription && (
                                  <div className="text-sm text-gray-500">{addOn.additionalDescription}</div>
                                )}
                                {addOn.name === 'professionalInstallation' && selectedPlan === 'basic' && (
                                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500 mt-2">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                    </svg>
                                    Not available for Basic Plan
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={fadeIn} className="lg:col-span-1">
                <div className="sticky top-28">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Summary</h2>
                      <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mx-auto"></div>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      {orderSummary.oneTimeFee > 0 && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600 font-medium">Hardware</span>
                          <span className="text-gray-900 font-bold text-lg">${orderSummary.oneTimeFee.toFixed(2)}</span>
                        </div>
                      )}
                      {orderSummary.addOnCost > 0 && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600 font-medium">Add-Ons</span>
                          <span className="text-gray-900 font-bold text-lg">${orderSummary.addOnCost.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">Tax</span>
                        <span className="text-gray-900 font-bold text-lg">${orderSummary.tax.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-6 mb-8">
                      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-900">Total Due Today</span>
                          <span className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                            ${orderSummary.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4 mb-6">
                      <button
                        onClick={prevStep}
                        className="w-1/2 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                      >
                        Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="w-1/2 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:shadow-xl hover:scale-105 transition-all"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            <ChargingCableModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          </motion.div>
        )}

        {/* Step 2: Enhanced Customer Information */}
        {step === 2 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-6xl mx-auto px-4 py-8"
          >
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Your <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">Information</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Please provide your details and vehicle information to complete your order. We'll use this information to personalize your EVolve experience.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <motion.div variants={fadeIn} className="lg:col-span-2 space-y-8">
                {/* Contact Information */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Contact Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-4 text-gray-700 bg-white/70 border-2 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 ${
                          validationErrors.firstName ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Enter your first name"
                      />
                      {validationErrors.firstName && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 4">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {validationErrors.firstName}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-4 text-gray-700 bg-white/70 border-2 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 ${
                          validationErrors.lastName ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="Enter your last name"
                      />
                      {validationErrors.lastName && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {validationErrors.lastName}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-4 text-gray-700 bg-white/70 border-2 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 ${
                          validationErrors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="your@email.com"
                      />
                      {validationErrors.email && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {validationErrors.email}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-4 text-gray-700 bg-white/70 border-2 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 ${
                          validationErrors.phone ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="(555) 123-4567"
                      />
                      {validationErrors.phone && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {validationErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-300">
                  <div className="flex md:justify-between items-center mb-8">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">Vehicle Information</h2>
                    </div>
                    <button
                      onClick={addVehicle}
                      className="hidden md:flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"></path>
                      </svg>
                      Add Vehicle
                    </button>
                  </div>
                  
                  {vehicles.map((vehicle, index) => (
                    <div key={index} className="mb-8 last:mb-0">
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                            <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-xl text-sm flex items-center justify-center mr-3 font-bold">
                              {index + 1}
                            </span>
                            Vehicle {index + 1}
                          </h3>
                          {vehicles.length > 1 && (
                            <button
                              onClick={() => removeVehicle(index)}
                              className="text-red-500 hover:text-red-600 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-all"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor={`make-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
                              Make
                            </label>
                            <input
                              type="text"
                              id={`make-${index}`}
                              value={vehicle.make}
                              onChange={(e) => handleVehicleChange(index, 'make', e.target.value)}
                              required
                              className={`w-full px-4 py-4 text-gray-700 bg-white border-2 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 ${
                                validationErrors.vehicles?.[index]?.make
                                  ? 'border-red-300 bg-red-50/50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              placeholder="Tesla"
                            />
                            {validationErrors.vehicles?.[index]?.make && (
                              <p className="mt-2 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {validationErrors.vehicles[index].make}
                              </p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor={`model-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
                              Model
                            </label>
                            <input
                              type="text"
                              id={`model-${index}`}
                              value={vehicle.model}
                              onChange={(e) => handleVehicleChange(index, 'model', e.target.value)}
                              required
                              className={`w-full px-4 py-4 text-gray-700 bg-white border-2 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 ${
                                validationErrors.vehicles?.[index]?.model
                                  ? 'border-red-300 bg-red-50/50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              placeholder="Model 3"
                            />
                            {validationErrors.vehicles?.[index]?.model && (
                              <p className="mt-2 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {validationErrors.vehicles[index].model}
                              </p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor={`year-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
                              Year
                            </label>
                            <input
                              type="number"
                              id={`year-${index}`}
                              value={vehicle.year}
                              onChange={(e) => handleVehicleChange(index, 'year', e.target.value)}
                              required
                              min="1900"
                              max={new Date().getFullYear() + 1}
                              className={`w-full px-4 py-4 text-gray-700 bg-white border-2 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 ${
                                validationErrors.vehicles?.[index]?.year
                                  ? 'border-red-300 bg-red-50/50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              placeholder="2024"
                            />
                            {validationErrors.vehicles?.[index]?.year && (
                              <p className="mt-2 text-sm text-red-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {validationErrors.vehicles[index].year}
                              </p>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <label htmlFor={`vin-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
                              VIN <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <input
                              type="text"
                              id={`vin-${index}`}
                              value={vehicle.vin}
                              onChange={(e) => handleVehicleChange(index, 'vin', e.target.value)}
                              className="w-full px-4 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                              placeholder="Enter VIN"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={addVehicle}
                    className="md:hidden flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all mt-4"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"></path>
                    </svg>
                    Add Vehicle
                  </button>
                </div>

                {/* Delivery Address */}
                {selectedPlan !== 'basic' && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-300">
                    <div className="flex items-center mb-8">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">Delivery Address</h2>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="address1" className="block text-sm font-semibold text-gray-700 mb-2">
                          Address Line 1
                        </label>
                        <input
                          type="text"
                          id="address1"
                          name="address1"
                          value={formData.address1}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-4 py-4 text-gray-700 bg-white/70 border-2 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 ${
                            validationErrors.address1 ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          placeholder="123 Main Street"
                        />
                        {validationErrors.address1 && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {validationErrors.address1}
                          </p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="address2" className="block text-sm font-semibold text-gray-700 mb-2">
                          Address Line 2 <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          id="address2"
                          name="address2"
                          value={formData.address2}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 text-gray-700 bg-white/70 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
                          placeholder="Apartment, suite, etc."
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-4 py-4 text-gray-700 bg-white/70 border-2 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 ${
                              validationErrors.city ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                            placeholder="San Francisco"
                          />
                          {validationErrors.city && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {validationErrors.city}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                            State
                          </label>
                          <select
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-4 py-4 text-gray-700 bg-white/70 border-2 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 ${
                              validationErrors.state ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <option value="">Select State</option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="DC">District of Columbia</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                            <option value="AS">American Samoa</option>
                            <option value="GU">Guam</option>
                            <option value="MP">Northern Mariana Islands</option>
                            <option value="PR">Puerto Rico</option>
                            <option value="VI">U.S. Virgin Islands</option>
                          </select>
                          {validationErrors.state && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {validationErrors.state}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-700 mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-4 py-4 text-gray-700 bg-white/70 border-2 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 ${
                            validationErrors.zipCode ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          maxLength={10}
                          placeholder="94105"
                        />
                        {validationErrors.zipCode && (
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {validationErrors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Additional Information</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="referralSource" className="block text-sm font-semibold text-gray-700 mb-2">
                        How did you hear about us? <span className="text-gray-400 font-normal">(Optional)</span>
                      </label>
                      <select
                        id="referralSource"
                        name="referralSource"
                        value={formData.referralSource}
                        onChange={handleInputChange}
                        className="w-full px-4 py-4 text-gray-700 bg-white/70 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all duration-300 hover:border-gray-300"
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
                    
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                      <div className="flex items-start">
                        <div className="flex items-center h-6 mt-1">
                          <input
                            id="agreeTerms"
                            name="agreeTerms"
                            type="checkbox"
                            checked={formData.agreeTerms}
                            onChange={handleInputChange}
                            required
                            className={`h-5 w-5 text-teal-500 border-2 rounded-lg focus:ring-4 focus:ring-teal-500/20 transition-all ${
                              validationErrors.agreeTerms ? 'border-red-300' : 'border-gray-300'
                            }`}
                          />
                        </div>
                        <div className="ml-4 text-sm">
                          <label htmlFor="agreeTerms" className="font-semibold text-gray-700 cursor-pointer">
                            I agree to the Terms of Service and Privacy Policy
                          </label>
                          <p className="text-gray-600 mt-1 leading-relaxed">
                            By checking this box, you consent to our{' '}
                            <a href="#tos" className="text-teal-500 hover:text-teal-600 font-semibold underline transition-colors">
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#privacypolicy" className="text-teal-500 hover:text-teal-600 font-semibold underline transition-colors">
                              Privacy Policy
                            </a>
                            .
                          </p>
                          {validationErrors.agreeTerms && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {validationErrors.agreeTerms}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Enhanced Order Summary - Right Column */}
              <motion.div variants={fadeIn} className="lg:col-span-1">
                <div className="sticky top-28">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Summary</h2>
                      <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mx-auto"></div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="space-y-4 mb-8">
                      {orderSummary.oneTimeFee > 0 && (
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-100">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold text-gray-900">Hardware</h3>
                              <p className="text-sm text-gray-600">Smart charging station</p>
                            </div>
                            <span className="text-lg font-bold text-gray-900">${orderSummary.oneTimeFee.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                      {orderSummary.addOnCost > 0 && (
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-100">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold text-gray-900">Add-Ons</h3>
                              <p className="text-sm text-gray-600">Selected enhancements</p>
                            </div>
                            <span className="text-lg font-bold text-gray-900">${orderSummary.addOnCost.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-gray-900">Tax</h3>
                            <p className="text-sm text-gray-600">Local sales tax</p>
                          </div>
                          <span className="text-lg font-bold text-gray-900">${orderSummary.tax.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="border-t border-gray-200 pt-6 mb-8">
                      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-900">Total Due Today</span>
                          <span className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                            ${orderSummary.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-4 mb-6">
                      <button
                        onClick={prevStep}
                        className="w-1/2 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                      >
                        Back
                      </button>
                      <button
                        onClick={nextStep}
                        className="w-1/2 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:shadow-xl hover:scale-105 transition-all"
                      >
                        Continue
                      </button>
                    </div>
                    
                    {/* What's Next Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        What's Next?
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center mr-3 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700">Order confirmation email</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center mr-3 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700">Access to EVolve app</span>
                        </li>
                        <li className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center mr-3 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700">
                            Priority updates
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Enhanced Payment */}
        {step === 3 && (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-6xl mx-auto">
            <motion.div variants={fadeIn} className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                Payment <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">Information</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Secure payment processing to complete your EVolve Charge order. Your information is protected with industry-leading encryption.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <motion.div variants={fadeIn} className="lg:col-span-2">
                {/* Climate Impact Notice */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-green-800 mb-2">Climate Impact Commitment</h3>
                      <p className="text-green-700 leading-relaxed">
                        EVolve Charge contributes part of your payment to removing carbon from the atmosphere to help fight climate change. 
                        Together, we're building a sustainable future.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Payment Form */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-8">
                  <div className="flex items-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Payment Method</h2>
                  </div>
                  
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="font-semibold text-red-800">Error:</div>
                      </div>
                      <div className="text-red-700 mt-1">{error}</div>
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
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="relative">
                        <div className="animate-spin h-12 w-12 border-4 border-teal-500 rounded-full border-t-transparent"></div>
                        <div className="absolute inset-0 h-12 w-12 border-4 border-teal-200 rounded-full"></div>
                      </div>
                      <p className="text-gray-600 mt-6 text-lg font-medium">
                        {isProcessing ? 'Preparing your order...' : 'Loading payment form...'}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Security Notice */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-blue-800 mb-2">Secure Payment Processing</h3>
                      <p className="text-blue-700 leading-relaxed">
                        Your payment information is securely processed by Stripe with industry-leading encryption. 
                        We never store any of your credit card details on our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Enhanced Order Summary - Payment Step */}
              <motion.div variants={fadeIn} className="lg:col-span-1">
                <div className="sticky top-28">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Summary</h2>
                      <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mx-auto"></div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="space-y-4 mb-8">
                      {orderSummary.oneTimeFee > 0 && (
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-100">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold text-gray-900">Hardware</h3>
                              <p className="text-sm text-gray-600">Smart charging station</p>
                            </div>
                            <span className="text-lg font-bold text-gray-900">${orderSummary.oneTimeFee.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                      {orderSummary.addOnCost > 0 && (
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-100">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold text-gray-900">Add-Ons</h3>
                              <p className="text-sm text-gray-600">Selected enhancements</p>
                            </div>
                            <span className="text-lg font-bold text-gray-900">${orderSummary.addOnCost.toFixed(2)}</span>
                          </div>
                        </div>
                      )}
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold text-gray-900">Tax</h3>
                            <p className="text-sm text-gray-600">Local sales tax</p>
                          </div>
                          <span className="text-lg font-bold text-gray-900">${orderSummary.tax.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Total */}
                    <div className="border-t border-gray-200 pt-6 mb-8">
                      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-gray-900">Total Due Today</span>
                          <span className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                            ${orderSummary.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* What's Next Enhanced */}
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                        <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                        </svg>
                        What's Next?
                      </h3>
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-800">Order confirmation email</span>
                            <p className="text-xs text-gray-600 mt-1">Instant receipt and order details</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-800">Access to EVolve app</span>
                            <p className="text-xs text-gray-600 mt-1">Monitor and control your charging</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-800">
                              Priority updates
                            </span>
                            <p className="text-xs text-gray-600 mt-1">
                              Be first to know about updates
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}