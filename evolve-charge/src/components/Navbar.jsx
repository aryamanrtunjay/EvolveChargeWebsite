'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import OrderChoiceModal from './OrderChoiceModal';
import Logo from '../images/Logo.png';
import Image from 'next/image';

const AmpereonNavbar = () => {
  /* ───────────────── state ───────────────── */
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  /* ── detect mobile view ── */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ── lock body when mobile menu OR modal open ── */
  useEffect(() => {
    document.body.style.overflow =
      isMobileMenuOpen || isModalOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen, isModalOpen]);

  /* ───────────────── helpers ───────────────── */
  const openModal = () => {
    setIsModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Product', href: '/product' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Support Us', href: '/support-us' },
  ];

  const filteredNavLinks = isMobile
    ? navLinks.filter((link) => link.name !== 'Product')
    : navLinks;

  /* ───────────────── framer variants ───────────────── */
  const menuVariants = {
    closed: { opacity: 0, x: '100%' },
    open: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        duration: 0.4, 
        ease: [0.23, 1, 0.32, 1],
        staggerChildren: 0.1
      } 
    },
  };

  const linkVariants = {
    closed: { opacity: 0, y: 20 },
    open: (i) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: i * 0.08 + 0.3, 
        duration: 0.5, 
        ease: [0.23, 1, 0.32, 1] 
      },
    }),
  };

  const dropdownVariants = {
    closed: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    open: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] }
    },
  };

  /* ───────────────── layout ───────────────── */
  return (
    <>
      {/* NAVBAR - Premium Luxury Design */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-0 z-50 w-full transition-all duration-500
          ${
            isScrolled
              ? 'bg-[#0A0A0A]/97 backdrop-blur-xl shadow-2xl shadow-black/20 border-b border-[#D4AF37]/25'
              : 'bg-[#1A1A1A]/95 backdrop-blur-lg border-b border-[#D4AF37]/15'
          }`}
      >
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo - Enhanced with subtle glow */}
            <motion.a
              href="/"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-lg bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg" />
              <Image 
                src={Logo} 
                alt="Ampereon Logo" 
                className="h-10 w-auto relative z-10 transition-all duration-300 group-hover:brightness-110" 
              />
            </motion.a>

            {/* Desktop Navigation - Premium spacing and typography */}
            <div className="hidden md:flex items-center gap-10">
              {filteredNavLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="relative font-medium text-gray-200 hover:text-white 
                           transition-all duration-300 tracking-wide text-[15px] py-2 group"
                >
                  <span className="relative">
                    {link.name}
                    {/* Premium underline animation */}
                    <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] 
                                   transition-all duration-300 group-hover:w-full rounded-full"/>
                  </span>
                </motion.a>
              ))}
            </div>

            {/* Desktop CTA - Subtle luxury button */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                onClick={openModal}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] 
                         px-6 py-3 text-[15px] font-medium text-white
                         hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300
                         focus:ring-2 focus:ring-[#D4AF37]/40 focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
              >
                Order Now
              </motion.button>
            </div>

            {/* Mobile Menu Button - Clean design */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-3 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 
                       transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-[#D4AF37]" />
              ) : (
                <Menu className="h-5 w-5 text-[#D4AF37]" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU - Premium slide-out with enhanced design */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Enhanced Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Premium Slide-out Menu */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 z-50 h-full w-full sm:w-80 bg-[#1A1A1A]/95 backdrop-blur-lg 
                       shadow-xl border-l border-[#D4AF37]/20 md:hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#D4AF37]/15 p-6">
                <motion.a
                  href="/"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Image
                    src={Logo}
                    alt="Ampereon Logo"
                    className="h-8 w-auto"
                  />
                </motion.a>
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg p-2 hover:bg-[#D4AF37]/10 transition-colors duration-200"
                >
                  <X className="h-5 w-5 text-white" />
                </motion.button>
              </div>

              {/* Navigation Links with clean styling */}
              <div className="flex-1 px-6 py-8">
                {filteredNavLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    custom={i}
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                    onClick={() => setIsMobileMenuOpen(false)}
                    whileHover={{ x: 4 }}
                    className="block py-4 text-lg font-medium text-gray-200 hover:text-[#D4AF37] 
                             transition-all duration-200 border-b border-[#D4AF37]/10 last:border-b-0"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="border-t border-[#D4AF37]/15 p-6">
                <motion.button
                  onClick={openModal}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] 
                           px-6 py-4 font-medium text-white
                           transition-all duration-200"
                >
                  Order Now
                </motion.button>

                <p className="mt-3 text-center text-sm text-gray-400">
                  $5 fully refundable deposit
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <OrderChoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default AmpereonNavbar;