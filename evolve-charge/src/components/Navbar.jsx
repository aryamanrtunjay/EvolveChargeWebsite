'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const AmpereonNavbar = () => {
  /* ───────────────── state ───────────────── */
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ── scroll hide / shadow ── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 20);
      setIsVisible(y < lastScrollY || y < 100);
      setLastScrollY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

  /* ── lock body when mobile menu OR modal open ── */
  useEffect(() => {
    document.body.style.overflow =
      isMobileMenuOpen || isModalOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen, isModalOpen]);

  /* ───────────────── helpers ───────────────── */
  const openModal = () => {
    setIsModalOpen(true);
    setIsMobileMenuOpen(false); // close slide-out if it's open
  };
  const navLinks = [
    { name: 'Product', href: '/product' },
    { name: 'About',   href: '/about'  },
    { name: 'FAQ',     href: '/faq'    },
    { name: 'Support', href: '/support-us'}
  ];

  /* ───────────────── framer variants ───────────────── */
  const menuVariants = { 
    closed: { opacity: 0, x: '100%' }, 
    open: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } } 
  };
  const linkVariants = {
    closed: { opacity: 0, x: 50 },
    open: (i) => ({ 
      opacity: 1, 
      x: 0, 
      transition: { delay: i * 0.1 + 0.3, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } 
    })
  };

  /* ───────────────── layout ───────────────── */
  return (
    <>
      {/* NAVBAR - Dark Theme */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 z-50 w-full transition-all duration-300
          ${isScrolled
            ? 'bg-[#0A0A0A]/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-[#D4AF37]/20'
            : 'bg-[#1A1A1A]/80 backdrop-blur-md border-b border-[#D4AF37]/10'}`}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-20 items-center justify-between">
            {/* Logo - Dark theme elegant typography */}
            <motion.a 
              href="/" 
              whileHover={{ scale: 1.05 }} 
              transition={{ duration: 0.2 }}
              className="relative group"
            >
              <span className="text-2xl font-light tracking-[0.2em] text-white relative z-10">
                AMPER
                <span className="font-medium bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
                  EON
                </span>
              </span>
              {/* Subtle underline effect */}
              <div className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] 
                            transition-all duration-300 group-hover:w-full" />
            </motion.a>

            {/* Desktop links - Dark theme premium spacing */}
            <div className="hidden md:flex items-center gap-12">
              {navLinks.map((link, index) => (
                <motion.a 
                  key={link.name} 
                  href={link.href}
                  whileHover={{ y: -2 }} 
                  transition={{ duration: 0.2 }}
                  className="relative group font-medium text-gray-300 hover:text-white transition-colors duration-300"
                >
                  <span className="tracking-wide">{link.name}</span>
                  {/* Elegant hover underline */}
                  <span className="absolute left-0 -bottom-2 h-px w-0 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] 
                                 transition-all duration-300 group-hover:w-full"/>
                  {/* Subtle glow effect on hover */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 
                                 bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/20 rounded-lg -mx-3 -my-1" />
                </motion.a>
              ))}
            </div>

            {/* Desktop CTA - Dark luxury button design */}
            <motion.button
              onClick={openModal}
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="hidden md:block relative overflow-hidden rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] 
                         px-8 py-3 font-medium text-white shadow-lg shadow-[#D4AF37]/25
                         hover:shadow-xl hover:shadow-[#D4AF37]/35 transition-all duration-300
                         focus:ring-2 focus:ring-[#D4AF37]/40 focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
            >
              <span className="relative z-10 tracking-wide">Order Now</span>
              {/* Subtle shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                            translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
            </motion.button>

            {/* Mobile burger - Dark refined design */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden rounded-xl p-3 hover:bg-[#D4AF37]/20 transition-colors duration-200 border border-[#D4AF37]/20"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? 
                  <X className="h-5 w-5 text-white"/> : 
                  <Menu className="h-5 w-5 text-white"/>
                }
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU - Dark luxury slide-out */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Slide-out menu - Dark theme */}
            <motion.div
              variants={menuVariants} 
              initial="closed" 
              animate="open" 
              exit="closed"
              className="fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-[#1A1A1A]/95 backdrop-blur-xl 
                         shadow-2xl shadow-black/40 border-l border-[#D4AF37]/20 md:hidden"
            >
              {/* Header with dark elegant styling */}
              <div className="flex items-center justify-between border-b border-[#D4AF37]/20 p-6 bg-[#0F0F0F]/50">
                <span className="text-2xl font-light tracking-[0.2em] text-white">
                  AMPER
                  <span className="font-medium bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
                    EON
                  </span>
                </span>
                <motion.button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="rounded-xl p-2 hover:bg-[#D4AF37]/20 transition-colors duration-200"
                >
                  <X className="h-6 w-6 text-white"/>
                </motion.button>
              </div>

              {/* Navigation links with dark theme staggered animation */}
              <div className="flex-1 px-6 py-12">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name} 
                    href={link.href} 
                    custom={i}
                    variants={linkVariants} 
                    initial="closed" 
                    animate="open"
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{ x: 8, scale: 1.02 }}
                    className="group block py-6 text-xl font-medium text-gray-200 hover:text-[#D4AF37] 
                             transition-all duration-300 border-b border-[#D4AF37]/10 last:border-b-0"
                  >
                    <span className="tracking-wide">{link.name}</span>
                    {/* Elegant side accent */}
                    <div className="h-px w-0 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] 
                                   transition-all duration-300 group-hover:w-12 mt-2" />
                  </motion.a>
                ))}
              </div>

              {/* Mobile CTA with dark premium styling */}
              <div className="border-t border-[#D4AF37]/20 p-6 bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A]">
                <motion.button
                  onClick={openModal}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] 
                           px-8 py-5 font-medium text-white shadow-xl shadow-[#D4AF37]/30
                           transition-all duration-300"
                >
                  <span className="relative z-10 text-lg tracking-wide">Order Now</span>
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
                </motion.button>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="mt-4 text-center text-sm text-gray-400 font-medium tracking-wide"
                >
                  $5 fully refundable deposit
                </motion.p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ORDER CHOICE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <motion.div
            className="bg-[#1A1A1A] rounded-3xl p-8 max-w-md w-full border border-[#D4AF37]/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h3 className="text-2xl font-medium text-white mb-4">Get Started Today</h3>
            <p className="text-gray-300 mb-6">Join thousands of families enjoying effortless EV charging.</p>
            <div className="space-y-4">
              <button className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white rounded-xl font-medium">
                Schedule Free Consultation
              </button>
              <button className="w-full py-3 border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl font-medium">
                Download Brochure
              </button>
              <button 
                className="w-full py-3 text-gray-400 font-medium"
                onClick={() => setIsModalOpen(false)}
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AmpereonNavbar;