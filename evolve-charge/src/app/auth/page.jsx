'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Updated import
import { motion } from 'framer-motion';

// Animation variants consistent with landing page
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function Auth() {
  const searchParams = useSearchParams(); // Use useSearchParams to get query parameters
  const state = searchParams.get('state'); // Extract the 'state' parameter

  useEffect(() => {
    if (state) {
      const clientId = process.env.NEXT_PUBLIC_TESLA_CLIENT_ID; // Store in .env.local
      const redirectUri = 'evolvecharge://auth/callback';
      const scope = 'offline_access vehicle_device_data user_data';
      const teslaAuthUrl = `https://auth.tesla.com/oauth2/v3/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
      window.location.href = teslaAuthUrl;
    }
  }, [state]);

  return (
    <Suspense>
      <motion.div
        className="flex items-center justify-center min-h-screen bg-gray-50"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to Tesla</h2>
          <p className="text-gray-600">Please wait while we connect you for authentication...</p>
          {!state && (
            <p className="mt-2 text-red-600">Error: No state parameter provided.</p>
          )}
        </div>
      </motion.div>
    </Suspense>
  );
}