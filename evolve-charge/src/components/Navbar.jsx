"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image'
import Logo from "@/images/Logo.svg"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Support', href: '/support' }
  ];

  const isActive = (path) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className={`fixed w-full z-50 bg-white/90 backdrop-blur-sm transition-shadow ${isAtTop ? '' : 'shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0 flex items-center"
            >
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
              <Image src={Logo} alt="logo" height={35}/>
              </Link>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.1, delayChildren: 0.3 }}
              className="flex space-x-8"
            >
              {/* {navItems.map((item) => (
                <motion.div key={item.name} whileHover={{ y: -2 }}>
                  <Link 
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium ${
                      isActive(item.href)
                        ? 'text-teal-500 font-semibold border-b-2 border-teal-500'
                        : 'text-gray-700 hover:text-teal-500'
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))} */}
            </motion.div>
            
            <Link href="reserve">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ml-8 px-6 py-2 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all"
              >
                Reserve Your NeoGen
              </motion.button>
            </Link>
            <Link href="/#how-it-works">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 rounded-full border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all"
              >
                Watch Demo
              </motion.button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-teal-500"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <motion.div
        initial={false}
        animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
          {/* {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block px-3 py-2 text-base font-medium ${
                isActive(item.href)
                  ? 'text-teal-500 font-semibold border-l-4 border-teal-500 pl-2'
                  : 'text-gray-700 hover:text-teal-500'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))} */}
          <Link href="reserve">
            <button className="mt-2 w-full px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-md">
              Reserve Your NeoGen
            </button>
          </Link>
          <Link href="/#how-it-works">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-2 w-full px-6 py-3  rounded-full border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all"
            >
              Watch Demo
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </nav>
  );
}