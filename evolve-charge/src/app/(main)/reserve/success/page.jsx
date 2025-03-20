"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const pulseAnimation = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.05, 1],
    transition: { 
      duration: 2,
      repeat: Infinity,
      repeatType: "loop"
    }
  }
};

function ReserveSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [reservationDetails, setReservationDetails] = useState({
    firstName: '',
    email: '',
    reservationId: '',
    isNewUser: true,
  });

  useEffect(() => {
    // Extract parameters from URL
    const firstName = searchParams.get('firstName') || '';
    const email = searchParams.get('email') || '';
    
    setReservationDetails({
      firstName,
      email,
    });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-teal-600 to-cyan-600 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer} 
          className="max-w-3xl mx-auto"
        >
          {/* Success Confirmation */}
          <motion.div variants={fadeIn} className="text-center mb-16">
            <motion.div 
              initial="initial"
              animate="animate"
              variants={pulseAnimation}
              className="inline-block bg-white rounded-full p-6 mb-8"
            >
              <svg className="h-20 w-20 text-teal-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Reservation Confirmed!
            </h1>
            
            <p className="text-xl text-gray-50 mb-4">
              {reservationDetails.firstName ? `Thank you, ${reservationDetails.firstName}!` : 'Thank you!'}
            </p>
            
            <p className="text-lg text-gray-50">
              Your NeoGen reservation has been successfully processed.
            </p>
          </motion.div>

          {/* Details Card */}
          <motion.div 
            variants={fadeIn} 
            className="bg-white rounded-xl shadow-lg p-8 mb-10"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              What's Next?
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-teal-100 rounded-full p-2">
                    <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Check Your Email</h3>
                  <p className="mt-1 text-gray-600">
                    We've sent a welcome email to {reservationDetails.email.substring(0, reservationDetails.email.length - 1)} with all the benefits you get by placing this reservation.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-teal-100 rounded-full p-2">
                    <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Stay Tuned</h3>
                  <p className="mt-1 text-gray-600">
                    We'll be in touch with updates about your NeoGen availability and installation details.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-teal-100 rounded-full p-2">
                    <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Need Help?</h3>
                  <p className="mt-1 text-gray-600">
                    If you have any questions, our support team is ready to assist you.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <Link href="/" className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-teal-700 bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200">
              Return to Home
            </Link>
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