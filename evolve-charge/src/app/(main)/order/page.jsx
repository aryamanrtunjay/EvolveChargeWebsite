"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import pricingData from '../../data/pricingData.json';
import { db } from '../../firebaseConfig.js';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_TEST_KEY);

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
          The Tesla Wall Connector plug is a high-power charging solution designed for Tesla vehicles. The standard mobile connector is included with almost all Tesla vehicles, if you have this (or the Tesla Wall Connector) then do not purchase this add-on.
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
    vehicleModel: '',
    vehicleMake: '',
    installNotes: '',
    referralSource: '',
    agreeTerms: false
  });
  const [addOns, setAddOns] = useState({
    professionalInstallation: false,
    chargingCable: false,
    extendedWarranty: false
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
    monthlyFee: 0,
    oneTimeFee: 0,
    addOnCost: 0
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [orderId, setOrderId] = useState('');
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-teal-500 hover:underline text-sm"
        >
          You may already have this
        </button>
      )
    },
    { name: 'extendedWarranty', label: 'Extended Warranty', price: 50, description: 'Additional 2 years of coverage for your charger.' }
  ];

  const vehicleMakes = [
    "Tesla", "Ford", "Chevrolet", "Nissan", "BMW", "Audi",
    "Volkswagen", "Hyundai", "Kia", "Porsche", "Rivian", "Lucid",
    "Toyota", "Mercedes-Benz", "Polestar", "Volvo", "Other"
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
      [name]: type === 'checkbox' ? checked : value
    });

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const handleAddOnChange = (e) => {
    const { name, checked } = e.target;
    setAddOns({
      ...addOns,
      [name]: checked
    });
  };

  const nextStep = () => {
    // Validate form before proceeding to payment step
    if (step === 2) {
      if (!validateForm()) {
        // Scroll to first error
        const firstErrorField = Object.keys(validationErrors)[0];
        const element = document.getElementById(firstErrorField);
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
        'vehicle-make': formData.vehicleMake,
        'vehicle-model': formData.vehicleModel,
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
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Pre-order Progress */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between mb-4">
            {['Add-Ons', 'Your Information', 'Payment'].map((label, index) => (
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

        {/* Step 1: Add-Ons */}
        {step === 1 && (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Customize Your Pre-order with Add-Ons</h1>
              <p className="text-lg text-gray-700">Enhance your EVolve Charge experience with these optional add-ons.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeIn} className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Available Add-Ons</h2>
                  {addOnsList.map((addOn) => (
                    <div key={addOn.name} className="flex items-start mb-4">
                      <div className="flex items-center h-5">
                        <input
                          id={addOn.name}
                          name={addOn.name}
                          type="checkbox"
                          checked={addOns[addOn.name]}
                          onChange={handleAddOnChange}
                          className="h-4 w-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                          disabled={addOn.name === 'professionalInstallation' && selectedPlan === 'basic'}
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor={addOn.name} className="font-medium text-gray-900">
                          {addOn.label} - ${addOn.price}
                        </label>
                        <p className="text-sm text-gray-500">{addOn.description}</p>
                        {addOn.additionalDescription && (
                          <div>{addOn.additionalDescription}</div>
                        )}
                        {addOn.name === 'professionalInstallation' && selectedPlan === 'basic' && (
                          <p className="text-sm text-gray-400">Not available for basic Plan</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div variants={fadeIn} className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-28">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Pre-order Summary</h2>
                  <div className="flex items-center mb-6">
                    <div>
                      <h3 className="font-bold text-gray-900">{plans[selectedPlan]?.name || 'Unknown Plan'}</h3>
                      <p className="text-sm text-gray-500">{billingCycle === 'monthly' ? 'Monthly billing' : 'Annual billing'}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    {orderSummary.oneTimeFee > 0 && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Hardware</span>
                        <span className="text-gray-900">${orderSummary.oneTimeFee.toFixed(2)}</span>
                      </div>
                    )}
                    {orderSummary.addOnCost > 0 && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Add-Ons</span>
                        <span className="text-gray-900">${orderSummary.addOnCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">${orderSummary.tax.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-900">Total Due Today</span>
                      <span className="text-gray-900">${orderSummary.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-4 mb-4">
                    <button
                      onClick={prevStep}
                      className="w-1/2 py-2 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="w-1/2 py-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:shadow-md transition-all"
                    >
                      Continue
                    </button>
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

        {/* Step 2: Customer Information */}
        {step === 2 && (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Information</h1>
              <p className="text-lg text-gray-700">Please provide your details to complete your order.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeIn} className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          validationErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          validationErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          validationErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          validationErrors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                      />
                      {validationErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
                {selectedPlan !== 'basic' && (
                  <>
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h2>
                      <div className="mb-4">
                        <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                        <input
                          type="text"
                          id="address1"
                          name="address1"
                          value={formData.address1}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                            validationErrors.address1 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                        />
                        {validationErrors.address1 && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.address1}</p>
                        )}
                      </div>
                      <div className="mb-4">
                        <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">Address Line 2 (Optional)</label>
                        <input
                          type="text"
                          id="address2"
                          name="address2"
                          value={formData.address2}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                              validationErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                          />
                          {validationErrors.city && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>
                          )}
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                          <select
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                              validationErrors.state ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
                            <p className="mt-1 text-sm text-red-600">{validationErrors.state}</p>
                          )}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                            validationErrors.zipCode ? 'border-red-300 bg-red-50' : 'border-gray-300'
                          }`}
                          maxLength={10}
                        />
                        {validationErrors.zipCode && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors.zipCode}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Additional Information</h2>
                  <div className="mb-6">
                    <label htmlFor="referralSource" className="block text-sm font-medium text-gray-700 mb-1">
                      How did you hear about us? (optional)
                    </label>
                    <select
                      id="referralSource"
                      name="referralSource"
                      value={formData.referralSource}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  <div className="flex items-start mb-4">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeTerms"
                        name="agreeTerms"
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={handleInputChange}
                        required
                        className={`h-4 w-4 text-teal-500 border rounded focus:ring-teal-500 ${
                          validationErrors.agreeTerms ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                        I agree to the Terms of Service and Privacy Policy
                      </label>
                      <p className="text-gray-500">
                        By checking this box, you consent to our{' '}
                        <a href="#tos" className="text-teal-500 hover:underline">Terms of Service</a> and{' '}
                        <a href="#privacypolicy" className="text-teal-500 hover:underline">Privacy Policy</a>.
                      </p>
                      {validationErrors.agreeTerms && (
                        <p className="mt-1 text-red-600">{validationErrors.agreeTerms}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div variants={fadeIn} className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-28">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Pre-order Summary</h2>
                  <div className="flex items-center mb-6">
                    <div>
                      <h3 className="font-bold text-gray-900">{plans[selectedPlan]?.name || 'Unknown Plan'}</h3>
                      <p className="text-sm text-gray-500">{billingCycle === 'monthly' ? 'Monthly billing' : 'Annual billing'}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    {orderSummary.oneTimeFee > 0 && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Hardware</span>
                        <span className="text-gray-900">${orderSummary.oneTimeFee.toFixed(2)}</span>
                      </div>
                    )}
                    {orderSummary.addOnCost > 0 && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Add-Ons</span>
                        <span className="text-gray-900">${orderSummary.addOnCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">${orderSummary.tax.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-900">Total Due Today</span>
                      <span className="text-gray-900">${orderSummary.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-4 mb-4">
                    <button
                      onClick={prevStep}
                      className="w-1/2 py-2 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      className="w-1/2 py-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:shadow-md transition-all"
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
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
            <motion.div variants={fadeIn} className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Payment Information</h1>
              <p className="text-lg text-gray-700">Please provide your payment details to complete your order.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeIn} className="md:col-span-2">
                <div className="flex items-center bg-gray-100 p-4 rounded-lg mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-700">
                    EVolve Charge contributes part of your payment to removing carbon from the atmosphere to help the fight against climate change.
                  </p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
                      <div className="font-medium">Error:</div>
                      <div>{error}</div>
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
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-teal-500 rounded-full border-t-transparent mb-4"></div>
                      <p className="text-gray-600">
                        {isProcessing ? 'Preparing your order...' : 'Loading payment form...'}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center bg-gray-100 p-4 rounded-lg mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-700">
                    Your payment information is securely processed by Stripe. We never store any of your credit card details.
                  </p>
                </div>
              </motion.div>
              <motion.div variants={fadeIn} className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-28">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Pre-order Summary</h2>
                  <div className="flex items-center mb-6">
                    <div>
                      <h3 className="font-bold text-gray-900">{plans[selectedPlan]?.name || 'Unknown Plan'}</h3>
                      <p className="text-sm text-gray-500">{billingCycle === 'monthly' ? 'Monthly billing' : 'Annual billing'}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    {orderSummary.oneTimeFee > 0 && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Hardware</span>
                        <span className="text-gray-900">${orderSummary.oneTimeFee.toFixed(2)}</span>
                      </div>
                    )}
                    {orderSummary.addOnCost > 0 && (
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Add-Ons</span>
                        <span className="text-gray-900">${orderSummary.addOnCost.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">${orderSummary.tax.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-900">Total Due Today</span>
                      <span className="text-gray-900">${orderSummary.total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">What's Next?</h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Pre-order confirmation email</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Access to app</span>
                      </li>
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{selectedPlan === 'basic' ? 'Priority updates on new features' : 'Receiving your smart charger'}</span>
                      </li>
                    </ul>
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