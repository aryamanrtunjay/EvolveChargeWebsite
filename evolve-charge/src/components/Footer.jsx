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
    'X': 'https://x.com/evolvecharge',
    'youtube': 'https://youtube.com/@EVolveCharge',
    'instagram': 'https://instagram.com/evolve.charge',
    'linkedin': 'https://linkedin.com/in/evolve-charge-a374b7355/',
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
    <footer className="relative bg-gray-800 text-white pt-16 pb-8 z-20">
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
                 <h3 className="font-bold">1. Information We Collect</h3>
                 <p>
                   We collect information about your EV charging habits, vehicle information, and app usage to provide you with the best charging experience. This includes charging times, energy usage, and preferences you set within the app.
                 </p>
                 
                 <h3 className="font-bold">2. How We Use Your Information</h3>
                 <p>
                   We use your information to optimize your charging experience, provide insights about your energy usage, and improve our products and services. We may also use anonymized data for research and development purposes.
                 </p>
                 
                 <h3 className="font-bold">3. Information Sharing</h3>
                 <p>
                   We do not sell your personal information to third parties. We may share anonymized, aggregated data with partners for research purposes. We may share your information with service providers who help us deliver our services.
                 </p>
                 
                 <h3 className="font-bold">4. Data Security</h3>
                 <p>
                   We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                 </p>
                 
                 <h3 className="font-bold">5. Your Rights</h3>
                 <p>
                   You have the right to access, correct, or delete your personal information. You can manage your privacy settings in the EVolve Charge app or contact our support team for assistance.
                 </p>
                 
                 <h3 className="font-bold">6. Changes to This Policy</h3>
                 <p>
                   We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the effective date.
                 </p>
                 
                 <h3 className="font-bold">7. Contact Us</h3>
                 <p>
                   If you have any questions about this privacy policy, please contact us at privacy@evolvecharge.com.
                 </p>
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
                 <p className="mb-4">These Terms of Service ("Terms") govern your access to and use of the website located at evolve-charge.com (the "Website") and any pre-order transactions conducted therein, operated by EVolve Charge Inc. ("EVolve Charge," "we," "us," or "our"), a corporation based in Washington State. By accessing the Website or placing a pre-order, you agree to be bound by these Terms. If you do not agree, please refrain from using the Website.</p>
 
                 <h3 className="font-bold">1. Company Overview</h3>
                 <p className="mb-3">EVolve Charge Inc. specializes in smart, automated charging solutions for electric vehicles (EVs). Our product features an automatic connection arm, off-peak charging scheduling, and battery health monitoring, all manageable via a proprietary mobile application. The charger is compatible with major EV models and includes professional installation services. Pre-orders are currently available with limited early-bird pricing.</p>
 
                 <h3 className="font-bold">2. Use of the Website</h3>
                 <p className="mb-3">The Website is provided for informational purposes regarding our products and services and to facilitate pre-orders of NeoGen. You may use the Website solely for lawful purposes and in accordance with these Terms. Unauthorized use, including but not limited to attempts to interfere with the Website’s functionality, is strictly prohibited.</p>
 
                 <h3 className="font-bold">3. Pre-Orders and Payment</h3>
                 <p className="mb-3">Pre-orders for NeoGen are subject to a one-time fee, payable at the time of order placement. No fees are charged for general Website access. Early-bird pricing is available on a limited basis. All payments are final upon processing, except in cases where EVolve Charge is unable to fulfill the order, in which event a refund may be issued at our discretion.</p>
 
                 <h3 className="font-bold">4. User Conduct</h3>
                 <p className="mb-3">You agree to comply with the following obligations when using the Website or placing a pre-order: (a) Provide accurate and truthful information during the pre-order process; (b) Refrain from uploading malicious code, viruses, or other harmful materials; (c) Do not attempt to gain unauthorized access to the Website or its systems; (d) Do not resell or transfer pre-order rights without prior written consent from EVolve Charge; (e) Refrain from engaging in harassing, abusive, or unlawful conduct toward EVolve Charge or its representatives. Violation of these obligations may result in termination of your pre-order or access to the Website, at our sole discretion.</p>
 
                 <h3 className="font-bold">5. Intellectual Property</h3>
                 <p className="mb-3">All content on the Website, including text, images, designs, and trademarks, is the exclusive property of EVolve Charge Inc. and is protected by United States copyright and intellectual property laws. You may not reproduce, distribute, or modify such content without our prior written permission.</p>
 
                 <h3 className="font-bold">6. Limitation of Liability</h3>
                 <p className="mb-3">To the fullest extent permitted by law, EVolve Charge shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the Website or pre-order process, including but not limited to service interruptions, data loss, or delays in product delivery. Our total liability shall not exceed the amount paid by you for a pre-order. The Website and products are provided "as is," without warranties of any kind, express or implied, beyond those required by applicable law.</p>
 
                 <h3 className="font-bold">7. Termination</h3>
                 <p className="mb-3">EVolve Charge reserves the right to terminate or suspend your access to the Website or cancel your pre-order, without notice, if you breach these Terms or engage in conduct we deem detrimental to our operations or other users.</p>
 
                 <h3 className="font-bold">8. Governing Law and Jurisdiction</h3>
                 <p className="mb-3">These Terms shall be governed by and construed in accordance with the laws of the State of Washington, without regard to its conflict of law principles. Any disputes arising under these Terms shall be resolved exclusively in the state or federal courts located in Washington State, and you consent to the jurisdiction of such courts.</p>
 
                 <h3 className="font-bold">9. Amendments</h3>
                 <p className="mb-3">We may modify these Terms at our discretion. Updated Terms will be posted on the Website with the effective date indicated. Your continued use of the Website following such changes constitutes acceptance of the revised Terms.</p>
 
                 <h3 className="font-bold">10. Contact Information</h3>
                 <p className="mb-3">For inquiries regarding these Terms, please contact us at: support@evolve-charge.com.</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-12 ">
          {/* First column (unchanged) */}
          <div>
            <Image src={Logo} alt="logo" height={25} className="mb-4"/>
            <p className="text-gray-300 mb-4">Revolutionizing EV charging with smart, automated technology that makes charging easier and more efficient.</p>
            <div className="flex space-x-4">
              {['X', 'youtube', 'instagram', 'linkedin'].map((social) => {
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
          {/* <div>
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
          </div> */}
          
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
        

        <div className="border-t border-gray-700 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© 2025 EVolve Charge Inc. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <a href="#privacypolicy" className="text-gray-500 hover:text-teal-300 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#tos" className="text-gray-500 hover:text-teal-300 transition-colors text-sm">
                Terms of Service
              </a>
            </div>
          </div>
      </div>
    </footer>
  );
}