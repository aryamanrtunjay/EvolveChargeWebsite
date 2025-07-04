'use client';

import { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig.js';
import Head from 'next/head';
import Script from 'next/script';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
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

// Child component that uses useSearchParams
function OrderSuccessContent() {
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
        } else {
          console.error('Order not found');
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
    subtotal: 499,
    tax: 39.92,
    total: 538.92
  };

  const customer = customerData || {
    'first-name': 'Alex',
    'last-name': 'Johnson',
    'email-address': 'alex.johnson@example.com',
    'phone-number': '(555) 123-4567',
    vehicles: [
      { make: 'Tesla', model: 'Model 3', year: 2023, vin: '5YJ3E1EA0PF123456' },
      { make: 'Ford', model: 'Mustang Mach-E', year: 2022, vin: '3FMTK3SU0NMA12345' }
    ],
    address1: '123 Main Street',
    address2: 'Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    zip: 94105
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <motion.div
          className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-black/10 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center">
            <div className="animate-spin h-8 w-8 border-4 border-[#EFBF04] rounded-full border-t-transparent mb-4"></div>
            <p className="text-[#6F6F6F] text-base tracking-wide">Loading your order details...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto">
          <motion.div variants={fadeIn} className="text-center mb-10">
            <div className="inline-block bg-[#EFBF04]/10 p-3 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#EFBF04]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#111111] mb-4 tracking-tight">Your Order is Confirmed!</h1>
            <p className="text-lg text-[#6F6F6F] mb-2 leading-relaxed">Thank you for your purchase. We're excited to welcome you to EVolve Charge!</p>
            <p className="text-md text-[#6F6F6F] tracking-wide">Order #: <span className="font-medium">{orderNumber}</span></p>
            <div className="mt-4 inline-block text-sm bg-[#F5F6F7] text-[#6F6F6F] px-4 py-2 rounded-full">
              <span>An email confirmation has been sent to {customer['email-address']}</span>
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 mb-8 border border-black/10">
            <h2 className="text-xl font-bold text-[#111111] mb-6 tracking-wide">Order Details</h2>
            <div className="flex items-center mb-6 pb-6 border-b border-black/10">
              <div className="mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#EFBF04]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[#111111] text-lg tracking-wide">EVolve Charge Smart Charger</h3>
                <p className="text-[#6F6F6F] leading-relaxed">Advanced EV charging solution for your home</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-[#111111] mb-2 tracking-wide">Delivery Address</h3>
                <div className="text-[#6F6F6F] leading-relaxed">
                  <p>{customer['first-name']} {customer['last-name']}</p>
                  <p>{customer.address1}</p>
                  {customer.address2 && <p>{customer.address2}</p>}
                  <p>{customer.city}, {customer.state} {customer.zip}</p>
                  <p>{customer['email-address']}</p>
                  <p>{customer['phone-number']}</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-[#111111] mb-2 tracking-wide">Vehicle Information</h3>
                <div className="text-[#6F6F6F] space-y-4 leading-relaxed">
                  {customer.vehicles && customer.vehicles.length > 0 ? (
                    customer.vehicles.map((vehicle, index) => (
                      <div key={index} className="border-l-4 border-[#EFBF04] pl-4">
                        <p className="font-medium text-[#111111] tracking-wide">Vehicle {index + 1}</p>
                        <p><strong>Make:</strong> {vehicle.make || 'Not specified'}</p>
                        <p><strong>Model:</strong> {vehicle.model || 'Not specified'}</p>
                        <p><strong>Year:</strong> {vehicle.year || 'Not specified'}</p>
                        {vehicle.vin && <p><strong>VIN:</strong> {vehicle.vin}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-[#6F6F6F]">No vehicle information provided.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-black/10 pt-6 mb-6">
              <h3 className="font-medium text-[#111111] mb-4 tracking-wide">Payment Summary</h3>
              <div className="flex justify-between mb-2">
                <span className="text-[#6F6F6F]">Hardware</span>
                <span className="text-[#111111]">${orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[#6F6F6F]">Tax</span>
                <span className="text-[#111111]">${orderData.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold mt-4 pt-4 border-t border-black/10">
                <span className="text-[#111111] tracking-wide">Total Paid</span>
                <span className="text-[#111111]">${orderData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-[#6F6F6F]">Payment Method</span>
                <span className="text-[#111111]">Credit Card</span>
              </div>
            </div>
            
            <div className="bg-[#F5F6F7] p-6 rounded-lg mb-6">
              <h3 className="font-medium text-[#111111] flex items-center mb-4 tracking-wide">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#EFBF04] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                What's Next
              </h3>
              <ol className="space-y-4">
                <li className="flex">
                  <span className="bg-[#EFBF04] text-[#111111] w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium text-[#111111] tracking-wide">Production & Preparation</p>
                    <p className="text-[#6F6F6F] text-sm leading-relaxed">Your EVolve Charger will now enter production. We'll keep you updated on its progress.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-[#EFBF04] text-[#111111] w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium text-[#111111] tracking-wide">Development News & Updates</p>
                    <p className="text-[#6F6F6F] text-sm leading-relaxed">You'll receive regular email updates on your order and our latest features.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-[#EFBF04] text-[#111111] w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium text-[#111111] tracking-wide">App Access</p>
                    <p className="text-[#6F6F6F] text-sm leading-relaxed">We'll get your account ready on our app so you can monitor and customize your EVolve Charger</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/"
                  className="px-8 py-3 rounded-full border border-black/10 text-[#111111]/70 font-medium hover:bg-[#F5F6F7] transition-colors flex items-center justify-center"
                >
                  Return to Home
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="text-center">
            <h3 className="text-lg font-medium text-[#111111] mb-3 tracking-wide">Need Help?</h3>
            <p className="text-[#6F6F6F] mb-4 leading-relaxed">If you have any questions about your order, please contact our customer support.</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a
                href="mailto:support@evolve-charge.com"
                className="flex items-center justify-center text-[#EFBF04] hover:text-[#B48F55] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@evolve-charge.com
              </a>
              <a
                href="tel:+14253244529"
                className="flex items-center justify-center text-[#EFBF04] hover:text-[#B48F55] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
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

// Main page component with Suspense boundary
export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex justify-center items-center">
          <motion.div
            className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-black/10 shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col items-center">
              <div className="animate-spin h-8 w-8 border-4 border-[#EFBF04] rounded-full border-t-transparent mb-4"></div>
              <p className="text-[#6F6F6F] text-base tracking-wide">Loading your order details...</p>
            </div>
          </motion.div>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}