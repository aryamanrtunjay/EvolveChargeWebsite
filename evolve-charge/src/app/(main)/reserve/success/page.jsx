'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import Script from 'next/script';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

// Child component that uses useSearchParams
function ReserveSuccessContent() {
  const searchParams = useSearchParams();

  // Get query parameters
  const reservationId = searchParams.get('reservationId');
  const name = searchParams.get('name');
  const fullName = searchParams.get('fullName');
  const reservationNumber = reservationId ? `EV-${reservationId.slice(-6).toUpperCase()}` : null;

  // Reservation data (no fallbacks)
  const reservationData = {
    displayName: fullName ? decodeURIComponent(fullName) : (name ? decodeURIComponent(name) : null),
    email: null, // Email not passed in query params, rely on Firestore/email
    amount: 4.99,
  };

  // Error state for invalid/missing reservationId
  if (!reservationId || !reservationNumber) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Reservation Error</h1>
            <p className="text-lg text-red-600 mb-4">Invalid or missing reservation details. Please contact support.</p>
            <p className="text-gray-700 mb-4">
              If you have questions about your reservation, reach out to us at{' '}
              <a href="mailto:support@evolve-charge.com" className="text-teal-600 hover:text-teal-700 underline">
                support@evolve-charge.com
              </a>{' '}
              or call (425) 324-4529.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Return to Home
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
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
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto">
          <motion.div variants={fadeIn} className="text-center mb-10">
            <div className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 p-3 rounded-full mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Reservation is Confirmed!</h1>
            {reservationData.displayName && (
              <p className="text-lg text-gray-700 mb-2">
                Congratulations, {reservationData.displayName}! You’re one of the early adopters of the EVolve Charger.
              </p>
            )}
            <p className="text-md text-gray-600">Reservation #: <span className="font-medium">{reservationNumber}</span></p>
            <div className="mt-4 inline-block text-sm bg-teal-100 text-teal-800 px-4 py-2 rounded-full">
              <span>An email confirmation has been sent to your registered email address.</span>
            </div>
          </motion.div>

          <motion.div variants={fadeIn} className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Reservation Details</h2>
            <div className="flex items-center mb-6 pb-6 border-b border-gray-200">
              <div className="mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">EVolve Charge Reservation</h3>
                <p className="text-gray-700">$4.99 deposit for the world’s first automatic EV charger</p>
              </div>
            </div>
            {reservationData.displayName && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                <div className="text-gray-700">
                  <p>{reservationData.displayName}</p>
                </div>
              </div>
            )}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="font-medium text-gray-900 mb-4">Payment Summary</h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Reservation Deposit</span>
                <span className="text-gray-900">${reservationData.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold mt-4 pt-4 border-t border-gray-200">
                <span className="text-gray-900">Total Paid</span>
                <span className="text-gray-900">${reservationData.amount.toFixed(2)}</span>
              </div>
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
                What’s Next
              </h3>
              <ol className="space-y-4">
                <li className="flex">
                  <span className="bg-teal-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium text-gray-900">Email Confirmation</p>
                    <p className="text-gray-700 text-sm">Check your inbox for your reservation details and confirmation.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-teal-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium text-gray-900">Production Updates</p>
                    <p className="text-gray-700 text-sm">We’ll notify you when your charger is ready, and you can pay the remaining balance.</p>
                  </div>
                </li>
                <li className="flex">
                  <span className="bg-teal-500 text-white w-6 h-6 rounded-full flex items-center justify-center mr-3 flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium text-gray-900">Priority Access</p>
                    <p className="text-gray-700 text-sm">Your reservation ensures early delivery and exclusive updates.</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
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
            <p className="text-gray-700 mb-4">If you have any questions about your reservation, please contact our customer support.</p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <a
                href="mailto:support@evolve-charge.com"
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

// Main page component with Suspense boundary
export default function ReserveSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 flex justify-center items-center">
          <div className="animate-spin h-12 w-12 border-4 border-teal-500 rounded-full border-t-transparent"></div>
        </div>
      }
    >
      <ReserveSuccessContent />
    </Suspense>
  );
}