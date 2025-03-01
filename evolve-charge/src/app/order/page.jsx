"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import pricingData from '../data/pricingData.json';
import { db } from "../firebaseConfig.js";
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Create a Checkout Form component that uses Stripe Elements
function CheckoutForm({ onSuccess, total, clientSecret, isProcessing, setIsProcessing, orderData }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    // Confirm the payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/order/success', // Redirect URL after payment
      },
      redirect: 'if_required'
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment successful, call the onSuccess callback
      onSuccess(paymentIntent);
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
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [step, setStep] = useState(1);
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
  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
    monthlyFee: 0
  });
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [customerID, setCustomerID] = useState('');

  // Transform JSON plans array into an object with lowercase keys
  const plans = pricingData.plans.reduce((acc, plan) => {
    acc[plan.name.toLowerCase()] = plan;
    return acc;
  }, {});

  // Vehicle makes for dropdown
  const vehicleMakes = [
    "Tesla", "Ford", "Chevrolet", "Nissan", "BMW", "Audi", 
    "Volkswagen", "Hyundai", "Kia", "Porsche", "Rivian", "Lucid", 
    "Toyota", "Mercedes-Benz", "Polestar", "Volvo", "Other"
  ];

  // Update order summary whenever plan or billing cycle changes
  useEffect(() => {
    const plan = plans[selectedPlan];
    const subtotal = plan.oneTimePrice;
    const tax = (subtotal) * 0.08; // Assume 8% tax
    const total = subtotal + tax;
    const monthlyFee = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice / 12;
    
    setOrderSummary({
      subtotal,
      tax,
      total,
      monthlyFee
    });
  }, [selectedPlan, billingCycle]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle plan selection
  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  // Progress to next step
  const nextStep = () => {
    window.scrollTo(0, 0);
    setStep(step + 1);

    // If moving to payment step, create a payment intent
    if (step === 2) {
      prepareOrder();
    }
  };

  // Go back to previous step
  const prevStep = () => {
    window.scrollTo(0, 0);
    setStep(step - 1);
  };

  // Prepare order data and create a payment intent
  const prepareOrder = async () => {
    setIsProcessing(true);
  
    try {
      // 1. Transform and prepare user data for the "users" collection
      const userData = {
        'first-name': formData.firstName,
        'last-name': formData.lastName,
        'phone-number': formData.phone,
        'email-address': formData.email,
        'vehicle-make': formData.vehicleMake,
        'vehicle-model': formData.vehicleModel,
        reference: formData.referralSource,
        address1: formData.address1,
        address2: formData.address2 || null,
        city: formData.city,
        state: formData.state,
        zip: parseInt(formData.zipCode, 10),
      };
  
      // 2. Upload user data to Firestore and get the document ID
      const userRef = await addDoc(collection(db, 'users'), userData);
      const customerID = userRef.id;
      setCustomerID(customerID);
  
      // 3. Prepare order data for the "orders" collection
      const orderData = {
        address: {
          street: `${formData.address1}${formData.address2 ? ' ' + formData.address2 : ''}`,
          city: formData.city,
          state: formData.state,
          zip: parseInt(formData.zipCode, 10),
        },
        billing: billingCycle,
        plan: selectedPlan,
        subtotal: orderSummary.subtotal,
        tax: orderSummary.tax,
        total: orderSummary.total,
        status: 'Pending', // Will update after payment
        orderDate: serverTimestamp(),
        customerID: customerID,
        paymentMethod: paymentMethod,
        paymentStatus: 'Pending',
      };
  
      setOrderData(orderData);

      // 4. Create a payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          amount: orderSummary.total,
          metadata: {
            customerID,
            plan: selectedPlan,
            billingCycle,
            email: formData.email
          }
        }),
      });
  
      const { clientSecret, error } = await response.json();
      
      if (error) {
        throw new Error(error);
      }
  
      setClientSecret(clientSecret);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error preparing order:', error);
      setIsProcessing(false);
      // Optionally, notify the user of the error
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Update the order data with payment information
      const updatedOrderData = {
        ...orderData,
        status: 'Paid',
        paymentStatus: 'Completed',
        paymentIntentId: paymentIntent.id,
        paymentDate: serverTimestamp(),
      };
  
      // Upload order data to Firestore
      const orderRef = await addDoc(collection(db, 'orders'), updatedOrderData);
  
      // Set order number using the order document ID
      setOrderNumber(`EV-${orderRef.id}`);
  
      // Proceed to the confirmation step
      setStep(4);
    } catch (error) {
      console.error('Error finalizing order:', error);
      // Handle error
    }
  };

  // Appearance options for Stripe Elements
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0d9488', // teal-600
      colorBackground: '#ffffff',
      colorText: '#1f2937', // gray-800
      colorDanger: '#ef4444', // red-500
      fontFamily: 'system-ui, -apple-system, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Order Progress */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between mb-4">
            {['Select Plan', 'Your Information', 'Payment', 'Confirmation'].map((label, index) => (
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
              style={{ width: `${(step - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Plan Selection */}
        {step === 1 && (
            <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-6xl mx-auto"
            >
            <motion.div variants={fadeIn} className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your EVolve Charge Plan</h1>
                <p className="text-lg text-gray-700">Select the plan that best fits your electric vehicle charging needs.</p>
            </motion.div>

            <motion.div variants={fadeIn} className="flex justify-center mb-12">
                <div className="flex items-center bg-white p-1 rounded-full shadow-sm border border-gray-200">
                <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    billingCycle === 'monthly' 
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    Monthly Billing
                </button>
                <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    billingCycle === 'yearly' 
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    Annual Billing
                    <span className="ml-1 text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">Save 20%</span>
                </button>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {Object.keys(plans).map((planKey) => {
                const plan = plans[planKey];
                return (
                    <motion.div
                    key={planKey}
                    variants={fadeIn}
                    onClick={() => handlePlanSelect(planKey)}
                    className={`cursor-pointer transition-all duration-300 transform hover:scale-105 bg-white rounded-xl p-6 shadow-md ${
                        selectedPlan === planKey 
                        ? 'ring-2 ring-teal-500' 
                        : 'hover:shadow-lg'
                    }`}
                    >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                        <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                        <p className="text-gray-500 text-sm">{plan.description}</p>
                        </div>
                        <div 
                        className="flex-shrink-0" 
                        dangerouslySetInnerHTML={{ __html: plan.icon }} 
                        />
                    </div>

                    <div className="mb-6">
                        <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900">${plan.oneTimePrice}</span>
                        <span className="ml-1 text-gray-500">hardware</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-700">
                        +${billingCycle === 'monthly' ? plan.monthlyPrice : (plan.yearlyPrice / 12).toFixed(2)}/month service fee
                        </div>
                        <div className="mt-1 text-sm text-gray-700">
                        {plan.kwhRate} for energy usage
                        </div>
                    </div>

                    <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm">
                            <svg className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className={`${index === 0 && feature.includes("All") ? "font-bold text-gray-900" : "text-gray-700"}`}>
                            {feature}
                            </span>
                        </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => handlePlanSelect(planKey)}
                        className={`w-full py-2 rounded-full text-center font-medium transition-colors ${
                        selectedPlan === planKey 
                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {selectedPlan === planKey ? 'Selected' : 'Select Plan'}
                    </button>
                    </motion.div>
                );
                })}
            </div>

            <motion.div variants={fadeIn} className="flex justify-end">
                <button
                onClick={nextStep}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-md hover:shadow-lg transition-all"
                >
                Continue to Your Information
                </button>
            </motion.div>
            </motion.div>
        )}

        {/* Step 2: Customer Information */}
        {step === 2 && (
            <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
            >
            <motion.div variants={fadeIn} className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Information</h1>
                <p className="text-lg text-gray-700">Please provide your details for account setup.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div variants={fadeIn} className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name*
                        </label>
                        <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name*
                        </label>
                        <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address*
                        </label>
                        <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number*
                        </label>
                        <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h2>
                    
                    <div className="mb-4">
                    <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1*
                    </label>
                    <input
                        type="text"
                        id="address1"
                        name="address1"
                        value={formData.address1}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    </div>

                    <div className="mb-4">
                    <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2
                    </label>
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
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City*
                        </label>
                        <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State*
                        </label>
                        <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                        {/* ... */}
                        </select>
                    </div>
                    </div>

                    <div className="mb-4">
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code*
                    </label>
                    <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        maxLength={10}
                    />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Vehicle Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700 mb-1">
                        Vehicle Make*
                        </label>
                        <select
                        id="vehicleMake"
                        name="vehicleMake"
                        value={formData.vehicleMake}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                        <option value="">Select Make</option>
                        {vehicleMakes.map((make) => (
                            <option key={make} value={make}>{make}</option>
                        ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700 mb-1">
                        Vehicle Model*
                        </label>
                        <input
                        type="text"
                        id="vehicleModel"
                        name="vehicleModel"
                        value={formData.vehicleModel}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="e.g., Model 3, Mach-E, ID.4"
                        />
                    </div>
                    </div>
                </div>

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
                        <option value="Search Engine">Search Engine</option>
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
                        className="h-4 w-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                        I agree to the Terms of Service and Privacy Policy
                        </label>
                        <p className="text-gray-500">
                        By checking this box, you consent to our <a href="#" className="text-teal-500 hover:underline">Terms of Service</a> and <a href="#" className="text-teal-500 hover:underline">Privacy Policy</a>.
                        </p>
                    </div>
                    </div>
                </div>
                </motion.div>

                <motion.div variants={fadeIn} className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-28">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                    
                    <div className="flex items-center mb-6">
                    <div 
                        className="mr-3" 
                        dangerouslySetInnerHTML={{ __html: plans[selectedPlan].icon }} 
                    />
                    <div>
                        <h3 className="font-bold text-gray-900">{plans[selectedPlan].name} Plan</h3>
                        <p className="text-sm text-gray-500">{billingCycle === 'monthly' ? 'Monthly billing' : 'Annual billing'}</p>
                    </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Hardware</span>
                        <span className="text-gray-900">${orderSummary.subtotal.toFixed(2)}</span>
                    </div>
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
                    <div className="flex justify-between mt-2 text-sm">
                        <span className="text-gray-600">Monthly Service Fee</span>
                        <span className="text-gray-900">${orderSummary.monthlyFee.toFixed(2)}/mo</span>
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
                        disabled={!formData.agreeTerms}
                        className={`w-1/2 py-2 rounded-full font-medium ${
                        formData.agreeTerms
                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-md'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
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
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Payment Information</h1>
              <p className="text-lg text-gray-700">Please provide your payment details to complete your order.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div variants={fadeIn} className="md:col-span-2">
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div 
                      onClick={() => setPaymentMethod('credit')}
                      className={`cursor-pointer border rounded-lg p-4 flex flex-col items-center transition-colors ${
                        paymentMethod === 'credit' 
                          ? 'border-teal-500 bg-teal-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">Credit Card</span>
                    </div>
                  </div>

                  {clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                      <CheckoutForm
                        onSuccess={handlePaymentSuccess}
                        total={orderSummary.total}
                        clientSecret={clientSecret}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                        orderData={orderData}
                      />
                    </Elements>
                  )}

                  {!clientSecret && (
                    <div className="flex justify-center">
                      <div className="animate-spin h-8 w-8 border-4 border-teal-500 rounded-full border-t-transparent"></div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Billing Address</h2>
                  
                  <div className="flex items-center mb-6">
                    <input
                      id="sameAddress"
                      name="sameAddress"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="sameAddress" className="ml-2 block text-sm text-gray-700">
                      Same as delivery address
                    </label>
                  </div>
                  
                  <div className="text-gray-500 text-sm italic">
                    Billing address will be the same as the delivery address provided.
                  </div>
                </div>

                <div className="flex items-center bg-gray-100 p-4 rounded-lg mb-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-700">
                    Your payment information is securely processed by Stripe. We never store your full credit card details.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="md:col-span-1">
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-28">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="flex items-center mb-6">
                    <div 
                      className="mr-3" 
                      dangerouslySetInnerHTML={{ __html: plans[selectedPlan].icon }} 
                    />
                    <div>
                      <h3 className="font-bold text-gray-900">{plans[selectedPlan].name} Plan</h3>
                      <p className="text-sm text-gray-500">{billingCycle === 'monthly' ? 'Monthly billing' : 'Annual billing'}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Hardware</span>
                      <span className="text-gray-900">${orderSummary.subtotal.toFixed(2)}</span>
                    </div>
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
                    <div className="flex justify-between mt-2 text-sm">
                      <span className="text-gray-600">Monthly Service Fee</span>
                      <span className="text-gray-900">${orderSummary.monthlyFee.toFixed(2)}/mo</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">What's Next?</h3>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start">
                        <svg className="h-5 w-5 text-teal-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Order confirmation email</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl mx-auto"
          >
            <motion.div variants={fadeIn} className="text-center mb-10">
              <div className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 p-3 rounded-full mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Thank You for Your Order!</h1>
              <p className="text-lg text-gray-700 mb-2">Your order has been successfully placed.</p>
              <p className="text-md text-gray-600">Order #: <span className="font-medium">{orderNumber}</span></p>
            </motion.div>

            <motion.div variants={fadeIn} className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>

              <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
                <div 
                  className="mr-4" 
                  dangerouslySetInnerHTML={{ __html: plans[selectedPlan].icon }} 
                />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{plans[selectedPlan].name} Plan</h3>
                  <p className="text-gray-700">{plans[selectedPlan].description}</p>
                  <p className="text-gray-500 mt-1">{billingCycle === 'monthly' ? 'Monthly billing' : 'Annual billing'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Delivery Address</h3>
                  <div className="text-gray-700">
                    <p>{formData.firstName} {formData.lastName}</p>
                    <p>{formData.address1}</p>
                    {formData.address2 && <p>{formData.address2}</p>}
                    <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                    <p>{formData.email}</p>
                    <p>{formData.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Vehicle Information</h3>
                  <div className="text-gray-700">
                    <p><strong>Make:</strong> {formData.vehicleMake}</p>
                    <p><strong>Model:</strong> {formData.vehicleModel}</p>
                    {formData.installNotes && (
                      <>
                        <p className="mt-2 font-medium">Delivery Notes:</p>
                        <p className="text-sm">{formData.installNotes}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="font-medium text-gray-900 mb-4">Payment Summary</h3>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Hardware</span>
                  <span className="text-gray-900">${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${orderSummary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold mt-4 pt-4 border-t border-gray-200">
                  <span className="text-gray-900">Total Paid</span>
                  <span className="text-gray-900">${orderSummary.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-600">Monthly Service Fee</span>
                  <span className="text-gray-900">${orderSummary.monthlyFee.toFixed(2)}/mo</span>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="text-gray-900">
                    {paymentMethod === 'credit' ? 'Credit Card' : paymentMethod === 'paypal' ? 'PayPal' : 'Bank Transfer'}
                  </span>
                </div>
              </div>

              <div className="bg-teal-50 p-6 rounded-lg mb-6">
                <h3 className="font-medium text-gray-900 flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  What's Next
                </h3>
                <ol className="space-y-4">
                  <li className="flex">
                    <span className="bg-teal-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">1</span>
                    <div>
                      <p className="font-medium text-gray-900">Order Confirmation Email</p>
                      <p className="text-gray-700 text-sm">You'll receive a detailed confirmation email shortly.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="bg-teal-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">3</span>
                    <div>
                      <p className="font-medium text-gray-900">Delivery</p>
                      <p className="text-gray-700 text-sm">Your product will be delivered with easy to follow installation instructions.</p>
                    </div>
                  </li>
                  <li className="flex">
                    <span className="bg-teal-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">4</span>
                    <div>
                      <p className="font-medium text-gray-900">Setup & Activation</p>
                      <p className="text-gray-700 text-sm">Your charging system will be configured and your account activated.</p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="flex justify-center">
                <Link
                  href="/dashboard"
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center"
                >
                  Go to My Dashboard
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}