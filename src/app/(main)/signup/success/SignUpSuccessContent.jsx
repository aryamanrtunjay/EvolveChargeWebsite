// app/(main)/signup/success/SignUpSuccessContent.js
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '../../../firebaseConfig.js';
import { doc, getDoc } from 'firebase/firestore';
import { CheckCircle, ArrowRight, Car } from 'lucide-react';

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function SignUpSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      const userId = searchParams.get('userId');
      if (!userId) {
        setError('User ID not found. Please try signing up again.');
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setVehicles(data.tesla_vehicles || []);
        } else {
          setError('User data not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load vehicle data.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchParams]);

  const handleRegister = () => {
    window.open('https://tesla.com/_ak/api.ampereonenergy.com', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#D4AF37] rounded-full border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white py-16">
      <motion.div
        className="max-w-4xl mx-auto px-6"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeUpVariants} className="text-center mb-12">
          <CheckCircle className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h1 className="text-3xl font-light mb-4">Account Paired Successfully!</h1>
          <p className="text-gray-400 mb-8">
            Now, configure virtual keys for your vehicles to enable commands.
          </p>
        </motion.div>

        {vehicles.length === 0 ? (
          <motion.p variants={fadeUpVariants} className="text-center text-gray-400">
            No vehicles found in your Tesla account.
          </motion.p>
        ) : (
          vehicles.map((vehicle, index) => (
            <motion.div 
              key={vehicle.id || index}
              variants={fadeUpVariants}
              className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6 mb-6"
            >
              <div className="flex items-center mb-4">
                <Car className="w-6 h-6 text-[#D4AF37] mr-2" />
                <h2 className="text-xl font-medium">
                  For your {vehicle.display_name || `${vehicle.vehicle_config.car_type} (${vehicle.vehicle_config.trim_badging})`}
                </h2>
              </div>
              <p className="text-gray-300 mb-6">
                1. Open the Tesla app on your phone.<br />
                2. Navigate to this vehicle ({vehicle.display_name || 'your vehicle'}).<br />
                3. Come back to this page.<br />
                4. Click the button below to register the vehicle.
              </p>
              <button
                onClick={handleRegister}
                className="w-full py-3 bg-[#D4AF37] text-black rounded hover:bg-[#B8860B] transition-colors flex items-center justify-center"
              >
                Register Vehicle
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </motion.div>
          ))
        )}

        <motion.button
          variants={fadeUpVariants}
          onClick={() => router.push('/')} // Redirect to home or dashboard
          className="mt-8 w-full py-3 border border-[#D4AF37]/30 rounded text-white hover:bg-[#D4AF37]/10 transition-colors"
        >
          Continue to Dashboard
        </motion.button>
      </motion.div>
    </div>
  );
}