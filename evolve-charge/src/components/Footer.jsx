'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, MapPin, Phone, ChevronRight, Youtube, Instagram, Linkedin } from 'lucide-react';
import { db } from '../app/firebaseConfig.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AmpereonFooter = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('');

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  // Custom X icon component since lucide-react doesn't have the X logo
  const XIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  const socialLinks = [
    { name: 'X', icon: XIcon, url: 'https://x.com/ampereonenergy' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@ampereonenergy' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/ampereonenergy' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/company/ampereonenergy' },
  ];

  const quickLinks = [
    { name: 'Product', href: '/product' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Support Us', href: '/support' },
  ];

  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === '#privacy') {
        setShowPrivacyPolicy(true);
        setShowTermsOfService(false);
      } else if (hash === '#terms') {
        setShowTermsOfService(true);
        setShowPrivacyPolicy(false);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const closeModal = (type) => {
    if (type === 'privacy') {
      setShowPrivacyPolicy(false);
    } else {
      setShowTermsOfService(false);
    }
    window.history.pushState(null, '', window.location.pathname);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribeStatus('loading');
    try {
      await addDoc(collection(db, 'mailing-list'), {
        email: email,
        timestamp: serverTimestamp(),
      });
      setEmail('');
      setSubscribeStatus('success');
      setTimeout(() => setSubscribeStatus(''), 3000);
    } catch (error) {
      console.error('Error adding document: ', error);
      setSubscribeStatus('error');
      setTimeout(() => setSubscribeStatus(''), 3000);
    }
  };

  return (
    <>
      <footer className="bg-[#F5F6F7] border-t border-[#111111]/8">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-bold text-[#111111] tracking-tight mb-4">
                Ampereon
              </h3>
              <p className="text-[#6F6F6F] mb-6 leading-relaxed">
                The future of EV charging. Hands-free, automatic, and intelligent.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-[#111111]/8 hover:border-[#C9A86A]/30 hover:bg-[#C9A86A]/5 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5 text-[#6F6F6F] hover:text-[#C9A86A] transition-colors" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-[#111111] mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-[#6F6F6F] hover:text-[#C9A86A] transition-colors flex items-center gap-1 group"
                    >
                      <span>{link.name}</span>
                      <ChevronRight className="w-4 h-4 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-[#111111] mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-[#6F6F6F]">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <a href="mailto:support@evolve-charge.com" className="hover:text-[#C9A86A] transition-colors">
                    support@ampereonenergy.com
                  </a>
                </li>
                <li className="flex items-start gap-3 text-[#6F6F6F]">
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>1-425-324-4529</span>
                </li>
                <li className="flex items-start gap-3 text-[#6F6F6F]">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Sammamish, WA</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold text-[#111111] mb-4">Stay in the Loop</h4>
              <p className="text-[#6F6F6F] mb-4">
                Get updates on shipping, features, and exclusive offers.
              </p>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 bg-white border border-[#111111]/8 rounded-full text-[#111111] placeholder-[#6F6F6F] focus:outline-none focus:ring-2 focus:ring-[#C9A86A] focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === 'loading'}
                  className="absolute right-1.5 top-1.5 w-9 h-9 bg-[#C9A86A] rounded-full flex items-center justify-center hover:bg-[#B48F55] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A86A] focus:ring-offset-2 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </form>
              <AnimatePresence>
                {subscribeStatus === 'success' && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 text-sm text-[#4CAF8E]"
                  >
                    Thanks! You're on the list.
                  </motion.p>
                )}
                {subscribeStatus === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-2 text-sm text-red-500"
                  >
                    Something went wrong. Please try again.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-[#111111]/8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-[#6F6F6F]">
                © 2025 Ampereon Inc. All rights reserved.
              </p>
              <div className="flex gap-6">
                <button
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="text-sm text-[#6F6F6F] hover:text-[#C9A86A] transition-colors"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setShowTermsOfService(true)}
                  className="text-sm text-[#6F6F6F] hover:text-[#C9A86A] transition-colors"
                >
                  Terms of Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacyPolicy && (
          <motion.div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeModal('privacy')}
          >
            <motion.div 
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 relative shadow-2xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => closeModal('privacy')}
                className="absolute top-6 right-6 w-10 h-10 bg-[#F5F6F7] rounded-full flex items-center justify-center hover:bg-[#111111]/10 transition-colors"
                aria-label="Close privacy policy"
              >
                <X className="w-5 h-5 text-[#111111]" />
              </button>
              
              <h2 className="text-3xl font-bold text-[#111111] mb-2">Privacy Policy</h2>
              <p className="text-[#6F6F6F] mb-6">Last Updated: July 4, 2025</p>
              
              <div className="space-y-6 text-[#111111]">
                <div>
                  <h3 className="text-xl font-bold mb-3">1. Information We Collect</h3>
                  <p className="text-[#6F6F6F] leading-relaxed">
                    We collect information about your EV charging habits, vehicle information, and app usage to provide you with the best charging experience. This includes charging times, energy usage, and preferences you set within the app.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">2. How We Use Your Information</h3>
                  <p className="text-[#6F6F6F] leading-relaxed">
                    We use your information to optimize your charging experience, provide insights about your energy usage, and improve our products and services. We may also use anonymized data for research and development purposes.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">3. Information Sharing</h3>
                  <p className="text-[#6F6F6F] leading-relaxed">
                    We do not sell your personal information to third parties. We may share anonymized, aggregated data with partners for research purposes. We may share your information with service providers who help us deliver our services.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">4. Data Security</h3>
                  <p className="text-[#6F6F6F] leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">5. Your Rights</h3>
                  <p className="text-[#6F6F6F] leading-relaxed">
                    You have the right to access, correct, or delete your personal information. You can manage your privacy settings in the Ampereon app or contact our support team for assistance.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">6. Contact Us</h3>
                  <p className="text-[#6F6F6F] leading-relaxed">
                    If you have any questions about this privacy policy, please contact us at privacy@ampereon.com.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => closeModal('privacy')}
                  className="px-6 py-3 bg-[#C9A86A] text-white font-semibold rounded-full hover:bg-[#B48F55] transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms of Service Modal */}
      <AnimatePresence>
        {showTermsOfService && (
          <motion.div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeModal('terms')}
          >
            <motion.div 
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 relative shadow-2xl"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => closeModal('terms')}
                className="absolute top-6 right-6 w-10 h-10 bg-[#F5F6F7] rounded-full flex items-center justify-center hover:bg-[#111111]/10 transition-colors"
                aria-label="Close terms of service"
              >
                <X className="w-5 h-5 text-[#111111]" />
              </button>
              
              <h2 className="text-3xl font-bold text-[#111111] mb-2">Terms of Service</h2>
              <p className="text-[#6F6F6F] mb-6">Last Updated: July 4, 2025</p>
              
              <div className="space-y-6 text-[#111111]">
                <p className="text-[#6F6F6F] leading-relaxed">
                  These Terms of Service ("Terms") govern your access to and use of Ampereon products and services. By using our products or services, you agree to be bound by these Terms.
                </p>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">1. Product Overview</h3>
                  <p className="text-[#6F6F6F] leading-relaxed">
                    Ampereon provides automated EV charging solutions including hardware and software. Our products are designed to work with existing charging infrastructure and include features such as automatic connection, smart scheduling, and battery optimization.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">2. Orders and Payments</h3>
                  <p className="text-[#6F6F6F] leading-relaxed">
                    Reservations require a deposit which is fully refundable until your product ships. Final payment is due before shipping. We accept major credit cards and digital payment methods. Prices are subject to change for new orders.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">3. Installation and Use</h3>
                  <p className="text-[#6F6F6F] leading-relaxed">
                    Ampereon products must be installed according to provided instructions. While designed for DIY installation, professional installation is recommended for optimal performance. Improper installation may void warranty coverage.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">4. Warranty and Support</h3>
                  <p className="text-[#6F6F6F] leading-relaxed">
                    Ampereon products come with a 2-year limited warranty covering defects in materials and workmanship. Extended warranty options are available. Support is provided via email, phone, and in-app chat.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">5. Limitation of Liability</h3>
                  <p className="text-[#6F6F6F] leading-relaxed">
                    To the extent permitted by law, Ampereon's total liability shall not exceed the purchase price of the product. We are not liable for indirect, incidental, or consequential damages.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">6. Contact Information</h3>
                  <p className="text-[#6F6F6F] leading-relaxed">
                    For questions about these Terms, contact us at legal@ampereon.com.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => closeModal('terms')}
                  className="px-6 py-3 bg-[#C9A86A] text-white font-semibold rounded-full hover:bg-[#B48F55] transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AmpereonFooter;