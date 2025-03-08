"use client";

import { FaYoutube, FaInstagram, FaFacebookF, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from "@/images/Logo.svg";
import { db } from '../app/firebaseConfig.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Modal animation variants (unchanged)
const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

export default function Footer() {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [email, setEmail] = useState(''); // New state for email input

  const socialIcons = {
    'X': FaXTwitter,
    'youtube': FaYoutube,
    'instagram': FaInstagram,
    'facebook': FaFacebookF,
    'linkedin': FaLinkedin,
  };
  
  const socialUrls = {
    'X': 'https://x.com',
    'youtube': 'https://youtube.com',
    'instagram': 'https://instagram.com',
    'facebook': 'https://facebook.com',
    'linkedin': 'https://linkedin.com',
  };

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === '#privacypolicy') {
        setShowPrivacyPolicy(true);
        setShowTermsOfService(false);
      } else if (hash === '#tos') {
        setShowTermsOfService(true);
        setShowPrivacyPolicy(false);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const closePrivacyPolicy = () => {
    setShowPrivacyPolicy(false);
    window.history.pushState(null, '', window.location.pathname);
  };

  const closeTermsOfService = () => {
    setShowTermsOfService(false);
    window.history.pushState(null, '', window.location.pathname);
  };

  // New function to handle form submission
  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'mailing-list'), {
        email: email,
        timestamp: serverTimestamp(),
      });
      setEmail(''); // Clear the input after successful submission
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <footer className="bg-gray-800 text-white pt-16 pb-8">
      {/* Privacy Policy Modal (unchanged) */}
      <AnimatePresence>
        {showPrivacyPolicy && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button 
                onClick={closePrivacyPolicy}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close privacy policy"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl text-center font-bold text-gray-900">Privacy Policy</h2>
              <h2 className="text-lg text-center text-gray-900">Last Updated: February 26, 2025</h2>
              <hr className="my-4 border-black mx-16"/>
              <div className="prose prose-teal prose-sm max-w-none text-gray-700">
                {/* Privacy policy content remains unchanged */}
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={closePrivacyPolicy}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms of Service Modal (unchanged) */}
      <AnimatePresence>
        {showTermsOfService && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button 
                onClick={closeTermsOfService}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close terms of service"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl text-center font-bold text-gray-900">Terms of Service</h2>
              <h2 className="text-lg text-center text-gray-900">Last Updated: February 26, 2025</h2>
              <hr className="my-4 border-black mx-16"/>
              <div className="prose prose-teal prose-sm max-w-none text-gray-700">
                {/* Terms of service content remains unchanged */}
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={closeTermsOfService}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-12 place-items-center">
          {/* First column (unchanged) */}
          <div>
            <Image src={Logo} alt="logo" height={25} className="mb-4"/>
            <p className="text-gray-300 mb-4">Revolutionizing EV charging with smart, automated technology that makes charging easier and more efficient.</p>
            <div className="flex space-x-4">
              {['X', 'youtube', 'instagram', 'facebook', 'linkedin'].map((social) => {
                const Icon = socialIcons[social];
                return (
                  <a
                    key={social}
                    href={socialUrls[social]}
                    className="text-gray-300 hover:text-teal-500 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Second column (unchanged) */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Support'].map((item) => (
                <li key={item}>
                  <a href={`/${item.toLowerCase()}`} className="text-gray-300 hover:text-teal-500 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Third column - Updated mailing list form */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white">Stay Updated</h4>
            <p className="text-gray-300 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
            <form className="flex" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="px-4 py-2 rounded-l-full text-gray-900 focus:outline-none flex-grow"
              />
              <button 
                type="submit"
                className="px-4 py-2 rounded-r-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        {/* Footer bottom (unchanged) */}
        <div className="pt-8 border-t border-gray-700 text-center text-gray-300 text-sm">
          <p>© {new Date().getFullYear()} EVolve Charge Inc. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-6">
            <a href="#privacypolicy" className="hover:text-teal-500 transition-colors">Privacy Policy</a>
            <a href="#tos" className="hover:text-teal-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}