"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig.js'; // Adjust path if needed

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

// Sample plans data (replace with actual data source)
const plans = {
  basic: {
    name: "Basic",
    description: "Essential charging for everyday use",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>'
  },
  deluxe: {
    name: "Deluxe",
    description: "Advanced charging with smart features",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2" /></svg>'
  }
};

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  
  // Get the order ID from URL query parameters
  const orderId = searchParams.get('orderId');
  const orderNumber = orderId ? `EV-${orderId}` : 'EV-0000000';

  useEffect(() => {
    // Fetch order details if we have an order ID
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        // Get order data
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);
        
        if (orderSnap.exists()) {
          const orderData = orderSnap.data();
          setOrder(orderData);
          
          // Get customer data if we have a customerID
          if (orderData.customerID) {
            const customerRef = doc(db, 'users', orderData.customerID);
            const customerSnap = await getDoc(customerRef);
            
            if (customerSnap.exists()) {
              setCustomerData(customerSnap.data());
            }
          }
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Fallback data for demo purposes if no real data is available
  const orderData = order || {
    plan: 'deluxe',
    billing: 'monthly',
    subtotal: 499,
    tax: 39.92,
    total: 538.92,
    monthlyFee: 24.99
  };

  const customer = customerData || {
    'first-name': 'Alex',
    'last-name': 'Johnson',
    'email-address': 'alex.johnson@example.com',
    'phone-number': '(555) 123-4567',
    'vehicle-make': 'Tesla',
    'vehicle-model': 'Model 3',
    address1: '123 Main Street',
    address2: 'Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    zip: 94105
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex justify-center items-center">
        <div className="animate-spin h-12 w-12 border-4 border-teal-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto">
          <motion.div variants={fadeIn} className="text-center mb-10">
            <div className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 p-3 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Order is Confirmed!</h1>
            <p className="text-lg text-gray-700 mb-2">Thank you for your purchase. We're excited to welcome you to EVolve Charge!</p>
            <p className="text-md text-gray-600">Order #: <span className="font-medium">{orderNumber}</span></p>
            <div className="mt-4 inline-block text-sm bg-teal-100 text-teal-800 px-4 py-2 rounded-full">
              <span>An email confirmation has been sent to {customer['email-address']}</span>
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Details</h2>
            <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
              <div className="mr-4" dangerouslySetInnerHTML={{ __html: plans[orderData.plan].icon }} />
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{plans[orderData.plan].name} Plan</h3>
                <p className="text-gray-700">{plans[orderData.plan].description}</p>
                <p className="text-gray-500 mt-1">{orderData.billing === 'monthly' ? 'Monthly billing' : 'Annual billing'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Delivery Address</h3>
                <div className="text-gray-700">
                  <p>{customer['first-name']} {customer['last-name']}</p>
                  <p>{customer.address1}</p>
                  {customer.address2 && <p>{customer.address2}</p>}
                  <p>{customer.city}, {customer.state} {customer.zip}</p>
                  <p>{customer['email-address']}</p>
                  <p>{customer['phone-number']}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Vehicle Information</h3>
                <div className="text-gray-700">
                  <p><strong>Make:</strong> {customer['vehicle-make']}</p>
                  <p><strong>Model:</strong> {customer['vehicle-model']}</p>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Payment Summary</h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Hardware</span>
                <span className="text-gray-900">${orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${orderData.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold mt-4 pt-4 border-t border-gray-200">
                <span className="text-gray-900">Total Paid</span>
                <span className="text-gray-900">${orderData.total.toFixed(2)}</span>
              </div>
              {orderData.monthlyFee > 0 && (
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-600">Monthly Service Fee</span>
                  <span className="text-gray-900">${orderData.monthlyFee.toFixed(2)}/mo</span>
                </div>
              )}
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-900">Credit Card</span>
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
                    <p className="font-medium text-gray-900">Production & Preparation</p>
                    <p className="text-gray-700 text-sm">Your EVolve Charger will now enter production. We'll keep you updated on its progress.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-teal-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium text-gray-900">Development News & Updates</p>
                    <p className="text-gray-700 text-sm">You'll receive regular email updates on your order and our latest features.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-teal-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium text-gray-900">Delivery Coordination</p>
                    <p className="text-gray-700 text-sm">We'll reach out to schedule your delivery and installation when your charger is ready.</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {/* <Link
                href="/dashboard"
                className="px-8 py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center"
              >
                Go to My Dashboard
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link> */}
              <Link
                href="/"
                className="px-8 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Return to Home
              </Link>
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Need Help?</h3>
            <p className="text-gray-700 mb-4">If you have any questions about your order, please contact our customer support.</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a
                href="mailto:support@evolvecharge.com"
                className="flex items-center justify-center text-teal-600 hover:text-teal-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@evolve-charge.com
              </a>
              <a
                href="tel:+14253244529"
                className="flex items-center justify-center text-teal-600 hover:text-teal-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (425) 324-4529
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}