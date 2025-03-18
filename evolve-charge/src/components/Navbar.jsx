"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image'
import Logo from "@/images/Logo.svg"

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
              <Image src={Logo} alt="logo" height={35}/>
            </Link>
          </div>
          
          {/* <nav className="hidden md:flex space-x-8">
            {['Features', 'How It Works', 'Pricing', 'FAQ'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className={`font-medium transition-colors ${
                  scrolled ? 'text-gray-700 hover:text-teal-500' : 'text-white hover:text-teal-200'
                }`}
              >
                {item}
              </a>
            ))}
          </nav> */}
          
          <div className="hidden md:block">
            <a href="reserve">
              <button className={`px-5 py-2 rounded-full font-medium transition-all ${
                scrolled 
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg' 
                  : 'bg-white text-teal-500 hover:bg-teal-50'
              }`}>
                Reserve Now
              </button>
            </a>
            <a href="reserve">
              <button className={`px-5 py-2 ml-12 rounded-full font-medium transition-all ${
                scrolled 
                  ? 'border border-teal-400  text-black hover:shadow-lg' 
                  : 'bg-white text-teal-500 hover:bg-teal-50'
              }`}>
                Watch Demo  
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
            className="md:hidden bg-white shadow-lg"
          >
            <div className="px-4 py-2">
              {['Features', 'How It Works', 'Pricing', 'FAQ'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block py-3 text-gray-700 font-medium border-b border-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="py-4">
                <a href="reserve" className="block">
                  <button className="w-full px-5 py-2 rounded-full font-medium bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
                    Reserve Now
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