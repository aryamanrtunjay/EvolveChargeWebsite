'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, MapPin, Phone, ChevronRight, Youtube, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import Logo from '../images/Logo.png'

const AmpereonFooter = () => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.3 }
    }
  };

  // Custom X icon component
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

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return;
    
    setSubscribeStatus('loading');
    try {
      // Mock subscription - replace with actual Firebase logic
      await new Promise(resolve => setTimeout(resolve, 1000));
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
      <footer className="bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0F0F0F] relative overflow-hidden border-t border-[#D4AF37]/20">
        {/* Dark elegant background patterns */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          {/* Main footer content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column - Dark Enhanced */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Image 
                  src={Logo}
                  alt="Ampereon Logo" 
                  className="h-10 w-auto mb-6"
                />
                <p className="text-gray-300 mb-8 leading-relaxed font-light">
                  The future of EV charging. Hands-free, automatic, and intelligent charging solutions for the modern world.
                </p>
                
                {/* Enhanced dark social links */}
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-[#2A2A2A]/80 backdrop-blur-sm rounded-full flex items-center justify-center 
                               border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 
                               transition-all duration-300 group shadow-lg hover:shadow-[#D4AF37]/20"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      aria-label={social.name}
                    >
                      <social.icon className="w-5 h-5 text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-300" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quick Links - Dark Refined */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h4 className="font-medium text-white mb-6 text-lg tracking-wide">Navigation</h4>
                <ul className="space-y-4">
                  {quickLinks.map((link, index) => (
                    <motion.li 
                      key={link.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 
                                 flex items-center gap-2 group font-light tracking-wide"
                      >
                        <span>{link.name}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 
                                               group-hover:ml-0 transition-all duration-300" />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Contact Info - Dark Enhanced */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h4 className="font-medium text-white mb-6 text-lg tracking-wide">Get in Touch</h4>
                <ul className="space-y-5">
                  <motion.li 
                    className="flex items-start gap-4 text-gray-300 group"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Mail className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <a href="mailto:support@ampereonenergy.com" 
                       className="hover:text-[#D4AF37] transition-colors duration-300 font-light leading-relaxed">
                      support@ampereonenergy.com
                    </a>
                  </motion.li>
                  <motion.li 
                    className="flex items-start gap-4 text-gray-300"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Phone className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <span className="font-light leading-relaxed">1-425-324-4529</span>
                  </motion.li>
                  <motion.li 
                    className="flex items-start gap-4 text-gray-300"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    <span className="font-light leading-relaxed">Sammamish, Washington</span>
                  </motion.li>
                </ul>
              </motion.div>
            </div>

            {/* Newsletter - Dark Premium design */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h4 className="font-medium text-white mb-6 text-lg tracking-wide">Stay Connected</h4>
                <p className="text-gray-300 mb-6 font-light leading-relaxed">
                  Get exclusive updates on shipping, new features, and special offers for early supporters.
                </p>
                <div className="relative mb-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-6 py-4 pr-14 bg-[#2A2A2A]/80 backdrop-blur-sm border border-[#D4AF37]/20 
                             rounded-2xl text-white placeholder-gray-400 focus:outline-none 
                             focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] 
                             transition-all duration-300 font-light shadow-lg hover:shadow-[#D4AF37]/20"
                  />
                  <motion.button
                    onClick={handleSubscribe}
                    disabled={subscribeStatus === 'loading'}
                    className="absolute right-2 top-2 w-10 h-10 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] 
                             rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-[#D4AF37]/25 
                             transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] 
                             focus:ring-offset-2 focus:ring-offset-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
                
                <AnimatePresence>
                  {subscribeStatus === 'success' && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-[#4CAF8E] font-light"
                    >
                      ✓ Welcome to the Ampereon community!
                    </motion.p>
                  )}
                  {subscribeStatus === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-red-400 font-light"
                    >
                      Something went wrong. Please try again.
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* Bottom Bar - Dark Enhanced */}
          <motion.div 
            className="pt-8 border-t border-[#D4AF37]/20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-sm text-gray-400 font-light tracking-wide">
                © 2025 Ampereon Inc. All rights reserved. Crafted with precision in Washington.
              </p>
              <div className="flex gap-8">
                <button
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors duration-300 font-light tracking-wide"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => setShowTermsOfService(true)}
                  className="text-sm text-gray-400 hover:text-[#D4AF37] transition-colors duration-300 font-light tracking-wide"
                >
                  Terms of Service
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] 
                     rounded-full flex items-center justify-center shadow-lg shadow-[#D4AF37]/25 
                     hover:shadow-xl hover:shadow-[#D4AF37]/35 transition-all duration-300 z-40
                     focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#0A0A0A]"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="w-5 h-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Enhanced Dark Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacyPolicy && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeModal('privacy')}
          >
            <motion.div 
              className="bg-[#1A1A1A] rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-10 relative 
                       shadow-2xl shadow-black/40 border border-[#D4AF37]/20"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => closeModal('privacy')}
                className="absolute top-8 right-8 w-12 h-12 bg-[#2A2A2A] rounded-full flex items-center justify-center 
                         hover:bg-[#D4AF37]/20 transition-colors duration-300 group"
                aria-label="Close privacy policy"
              >
                <X className="w-5 h-5 text-gray-300 group-hover:text-[#D4AF37] transition-colors duration-300" />
              </button>
              
              <div className="mb-8">
                <h2 className="text-4xl font-light text-white mb-3 tracking-tight">Privacy Policy</h2>
                <div className="w-16 h-px bg-gradient-to-r from-[#D4AF37] to-transparent mb-4" />
                <p className="text-gray-400 font-light">Last Updated: July 4, 2025</p>
              </div>
              
              <div className="space-y-8 text-white">
                <div>
                  <h3 className="text-xl font-medium mb-4 text-white">1. Information We Collect</h3>
                  <p className="text-gray-300 leading-relaxed font-light">
                    We collect information about your EV charging habits, vehicle information, and app usage to provide you with the best charging experience. This includes charging times, energy usage, and preferences you set within the app.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4 text-white">2. How We Use Your Information</h3>
                  <p className="text-gray-300 leading-relaxed font-light">
                    We use your information to optimize your charging experience, provide insights about your energy usage, and improve our products and services. We may also use anonymized data for research and development purposes.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4 text-white">3. Information Sharing</h3>
                  <p className="text-gray-300 leading-relaxed font-light">
                    We do not sell your personal information to third parties. We may share anonymized, aggregated data with partners for research purposes. We may share your information with service providers who help us deliver our services.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4 text-white">4. Data Security</h3>
                  <p className="text-gray-300 leading-relaxed font-light">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4 text-white">5. Your Rights</h3>
                  <p className="text-gray-300 leading-relaxed font-light">
                    You have the right to access, correct, or delete your personal information. You can manage your privacy settings in the Ampereon app or contact our support team for assistance.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4 text-white">6. Contact Us</h3>
                  <p className="text-gray-300 leading-relaxed font-light">
                    If you have any questions about this privacy policy, please contact us at privacy@ampereonenergy.com.
                  </p>
                </div>
              </div>
              
              <div className="mt-10 flex justify-end">
                <motion.button 
                  onClick={() => closeModal('privacy')}
                  className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium 
                           rounded-2xl hover:shadow-lg hover:shadow-[#D4AF37]/25 transition-all duration-300
                           focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Dark Terms of Service Modal */}
      <AnimatePresence>
        {showTermsOfService && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeModal('terms')}
          >
            <motion.div 
              className="bg-[#1A1A1A] rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-10 relative 
                       shadow-2xl shadow-black/40 border border-[#D4AF37]/20"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => closeModal('terms')}
                className="absolute top-8 right-8 w-12 h-12 bg-[#2A2A2A] rounded-full flex items-center justify-center 
                         hover:bg-[#D4AF37]/20 transition-colors duration-300 group"
                aria-label="Close terms of service"
              >
                <X className="w-5 h-5 text-gray-300 group-hover:text-[#D4AF37] transition-colors duration-300" />
              </button>
              
              <div className="mb-8">
                <h2 className="text-4xl font-light text-white mb-3 tracking-tight">Terms of Service</h2>
                <div className="w-16 h-px bg-gradient-to-r from-[#D4AF37] to-transparent mb-4" />
                <p className="text-gray-400 font-light">Last Updated: July 4, 2025</p>
              </div>
              
              <div className="space-y-8 text-white">
                <p className="text-gray-300 leading-relaxed font-light">
                  These Terms of Service ("Terms") govern your access to and use of Ampereon products and services. By using our products or services, you agree to be bound by these Terms.
                </p>
                
                <div>
                  <h3 className="text-xl font-medium mb-4 text-white">1. Product Overview</h3>
                  <p className="text-gray-300 leading-relaxed font-light">
                    Ampereon provides automated EV charging solutions including hardware and software. Our products are designed to work with existing charging infrastructure and include features such as automatic connection, smart scheduling, and battery optimization.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4 text-white">2. Orders and Payments</h3>
                  <p className="text-gray-300 leading-relaxed font-light">
                    Reservations require a deposit which is fully refundable until your product ships. Final payment is due before shipping. We accept major credit cards and digital payment methods. Prices are subject to change for new orders.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4 text-white">3. Installation and Use</h3>
                  <p className="text-gray-300 leading-relaxed font-light">
                    Ampereon products must be installed according to provided instructions. While designed for DIY installation, professional installation is recommended for optimal performance. Improper installation may void warranty coverage.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4 text-white">4. Warranty and Support</h3>
                  <p className="text-gray-300 leading-relaxed font-light">
                    Ampereon products come with a 2-year limited warranty covering defects in materials and workmanship. Extended warranty options are available. Support is provided via email, phone, and in-app chat.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4 text-white">5. Limitation of Liability</h3>
                  <p className="text-gray-300 leading-relaxed font-light">
                    To the extent permitted by law, Ampereon's total liability shall not exceed the purchase price of the product. We are not liable for indirect, incidental, or consequential damages.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-4 text-white">6. Contact Information</h3>
                  <p className="text-gray-300 leading-relaxed font-light">
                    For questions about these Terms, contact us at legal@ampereonenergy.com.
                  </p>
                </div>
              </div>
              
              <div className="mt-10 flex justify-end">
                <motion.button 
                  onClick={() => closeModal('terms')}
                  className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium 
                           rounded-2xl hover:shadow-lg hover:shadow-[#D4AF37]/25 transition-all duration-300
                           focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AmpereonFooter;