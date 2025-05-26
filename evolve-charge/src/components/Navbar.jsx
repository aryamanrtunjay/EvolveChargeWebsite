"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Logo from "@/images/Logo.svg";
import LogoWhite from "@/images/LogoWhite.svg";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Check if the current page is the order page
  const isOrderPage = pathname === '/order' || pathname === '/order/success' || pathname === '/donate';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If on the order page, render an empty header with the same styling
  if (isOrderPage) {
    return (
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      />
    );
  }

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 shadow-md bg-white/90 backdrop-blur-sm' : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
              <Image src={scrolled ? Logo : LogoWhite} alt="logo" className={scrolled ? "fill-white" : "fill-white"} height={35}/>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <a href="order">
              <button className={`px-5 mx-5 py-2 rounded-full font-medium transition-all ${
                scrolled 
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:from-teal-600 hover:to-cyan-600' 
                  : 'bg-white text-teal-600 hover:bg-gradient-to-r from-teal-400 to-cyan-400 hover:text-white hover:shadow-lg transition-all duration-600'
              }`}>
                Pre-order Now
              </button>
            </a>
            <a href="donate">
              <button className={`px-5 py-2 rounded-full font-medium transition-all ${
                scrolled 
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white border border-cyan-400 hover:shadow-lg hover:from-cyan-600 hover:to-teal-600' 
                  : 'bg-cyan-100 text-teal-800 border border-cyan-300 hover:bg-gradient-to-r from-cyan-400 to-teal-400 hover:text-white hover:shadow-lg transition-all duration-600'
              }`}>
                Support The Mission
              </button>
            </a>
          </div>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 ${scrolled ? 'text-gray-800' : 'text-white'}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden shadow-lg"
          >
            <div className="px-4 py-2">
              <div className="py-4">
                <a href="order" className="block">
                  <button className="w-full px-5 py-2 mb-4 rounded-full font-medium bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:from-teal-600 hover:to-cyan-600">
                    Pre-order Now
                  </button>
                </a>
                <a href="donate" className="block">
                  <button className="w-full px-5 py-2 rounded-full font-medium bg-gradient-to-r from-cyan-500 to-teal-500 text-white border border-cyan-400 hover:shadow-lg hover:from-cyan-600 hover:to-teal-600">
                    Support The Missions
                  </button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}