"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from "../../firebaseConfig.js";
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => {
    async function verifyPayment() {
      try {
        // Get payment_intent from URL query parameters
        const paymentIntentId = searchParams.get('payment_intent');
        
        if (!paymentIntentId) {
          // No payment intent ID found, redirect to orders page
          router.push('/order');
          return;
        }

        // Query Firestore for orders with this payment intent
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('paymentIntentId', '==', paymentIntentId));
        const querySnapshot = await getDocs(q);

        // If no matching order is found
        if (querySnapshot.empty) {
          // This could be a new payment that hasn't been registered yet
          // Optionally verify with your backend/Stripe directly
          
          // For now, just redirect to the order page
          router.push('/order');
          return;
        }

        // Get the order document
        const orderDoc = querySnapshot.docs[0];
        const orderData = orderDoc.data();

        // If order status is not already updated, update it
        if (orderData.status !== 'Paid') {
          await updateDoc(doc(db, 'orders', orderDoc.id), {
            status: 'Paid',
            paymentStatus: 'Completed'
          });
        }

        // Set the order number for display
        setOrderNumber(`EV-${orderDoc.id}`);
        setIsLoading(false);
      } catch (error) {
        console.error('Error verifying payment:', error);
        // In case of error, redirect to the order page
        router.push('/order');
      }
    }

    verifyPayment();
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin inline-block w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Processing your payment...</h2>
          <p className="text-gray-500 mt-2">Please wait while we verify your payment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 p-3 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-lg text-gray-700 mb-2">Your order has been confirmed.</p>
          <p className="text-md text-gray-600">Order #: <span className="font-medium">{orderNumber}</span></p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <p className="text-gray-700 mb-6">
            Thank you for your purchase! We've sent a confirmation email with all the details of your order.
          </p>

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
                <span className="bg-teal-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">2</span>
                <div>
                  <p className="font-medium text-gray-900">Delivery</p>
                  <p className="text-gray-700 text-sm">Your product will be delivered with easy to follow installation instructions.</p>
                </div>
              </li>
              <li className="flex">
                <span className="bg-teal-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">3</span>
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
        </div>
      </div>
    </div>
  );
}