"use client";

import { useState, useRef, useEffect, Suspense } from 'react'; // Add Suspense import
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '../../firebaseConfig.js';
import { collection, addDoc } from 'firebase/firestore';
import axios from 'axios';
import { ChevronRight, User, Mail, Car, Check, X } from 'lucide-react';

// Animation variants (same as provided)
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Modal for Virtual Key Instructions
function VirtualKeyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6 max-w-md w-full mx-4"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-white">Add Virtual Key</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            To enable vehicle commands, open the Tesla app and add the virtual key by visiting: 
            <a href="https://tesla.com/_ak/api.ampereonenergy.com" className="text-[#D4AF37] underline"> tesla.com/_ak/api.ampereonenergy.com</a>.
            Approve the key addition in the app.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#D4AF37] text-black rounded hover:bg-[#B8860B] transition-colors"
          >
            Got It
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPairing, setIsPairing] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const stepRef = useRef(null);
  const isInView = useInView(stepRef, { once: true });

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setIsModalOpen(true); // Show virtual key modal on success
    } else if (searchParams.get('error')) {
      setError(searchParams.get('error'));
    }
  }, [searchParams]);

  // Validation functions (similar to provided)
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(formData.email)) errors.email = 'Invalid email address';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const nextStep = async () => {
    if (step === 1) {
      if (!validateForm()) return;
      try {
        const userRef = await addDoc(collection(db, 'users'), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        });
        setUserId(userRef.id);
        setStep(2);
      } catch (err) {
        setError('Failed to create user');
      }
    }
  };

  const handlePairTesla = async () => {
    setIsPairing(true);
    try {
      const response = await axios.post('https://api.ampereonenergy.com/command', {
        command: 'SETUP',
        userId,
      });
      const { authUrl } = response.data;
      window.location.href = authUrl;
    } catch (err) {
      setError('Failed to initiate pairing');
      setIsPairing(false);
    }
  };

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <div className="min-h-screen bg-[#0A0A0A] text-white py-16">
        <motion.div
          className="max-w-4xl mx-auto px-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={staggerContainer}
        >
          {/* Progress Indicator (similar to provided) */}
          <motion.div ref={stepRef} className="mb-16" variants={fadeUpVariants}>
            <div className="flex items-center justify-between mb-8">
              {['Personal Info', 'Pair Tesla'].map((label, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-medium ${
                    step > index + 1 ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : step === index + 1 ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-gray-600 text-gray-400'
                  }`}>
                    {step > index + 1 ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className={`mt-2 text-sm ${step >= index + 1 ? 'text-white' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="h-px bg-gray-800 relative">
              <div className="h-px bg-[#D4AF37] transition-all duration-500" style={{ width: `${(step - 1) * 100}%` }} />
            </div>
          </motion.div>

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <motion.div variants={staggerContainer} className="space-y-8">
              <motion.div variants={fadeUpVariants} className="text-center">
                <h1 className="text-3xl font-light mb-4">Sign Up</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">Enter your personal information.</p>
              </motion.div>

              <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'firstName', label: 'First Name', icon: User, placeholder: 'First name' },
                    { id: 'lastName', label: 'Last Name', icon: User, placeholder: 'Last name' },
                    { id: 'email', label: 'Email', icon: Mail, placeholder: 'your@email.com', type: 'email' },
                  ].map(field => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">
                        {field.label}
                      </label>
                      <div className="relative">
                        <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type={field.type || 'text'}
                          id={field.id}
                          name={field.id}
                          value={formData[field.id]}
                          onChange={handleInputChange}
                          className={`w-full pl-10 py-2 bg-[#0A0A0A] border rounded text-white placeholder-gray-500 focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                            validationErrors[field.id] ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder={field.placeholder}
                        />
                      </div>
                      {validationErrors[field.id] && (
                        <p className="text-sm text-red-400 mt-1">{validationErrors[field.id]}</p>
                      )}
                    </div>
                  ))}
                </div>
                {error && <p className="text-red-400 mt-4">{error}</p>}
                <button
                  onClick={nextStep}
                  className="w-full mt-6 py-3 bg-[#D4AF37] text-black rounded hover:bg-[#B8860B] transition-colors"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Pair Tesla */}
          {step === 2 && (
            <motion.div variants={staggerContainer} className="space-y-8">
              <motion.div variants={fadeUpVariants} className="text-center">
                <h1 className="text-3xl font-light mb-4">Pair Your Tesla Account</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">Connect your Tesla account to enable vehicle features.</p>
              </motion.div>

              <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-lg p-6 text-center">
                <Car className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
                <button
                  onClick={handlePairTesla}
                  disabled={isPairing}
                  className="py-3 px-6 bg-[#D4AF37] text-black rounded hover:bg-[#B8860B] transition-colors disabled:opacity-50"
                >
                  {isPairing ? 'Pairing...' : 'Pair Tesla Account'}
                </button>
                {error && <p className="text-red-400 mt-4">{error}</p>}
              </div>

              <VirtualKeyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </motion.div>
          )}
        </motion.div>
      </div>
    </Suspense>
  );
}