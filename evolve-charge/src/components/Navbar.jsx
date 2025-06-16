'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import LogoWhite from '@/images/LogoWhite.svg';

// Exclude Home since logo links back to home
const NAV_ITEMS = [
  { label: 'Product', href: '/product' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Support', href: '/donate' },
  // { label: 'Support', href: '/support' },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const hideCTA = ['/order', '/order/success'].includes(pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-0 right-0 z-50 mx-4 sm:mx-6 lg:mx-8"
    >
      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-3 rounded-xl bg-[linear-gradient(135deg,rgba(50,50,50,0.6),rgba(80,80,80,0.3))] backdrop-blur-[5px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-gray-400/30">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="inline-block p-1 rounded-md">
              <Image src={LogoWhite} alt="EVolve Charge" height={35} />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-12">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition-colors hover:text-teal-300 drop-shadow-md ${
                  pathname === item.href ? 'text-teal-300' : 'text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTAs */}
          {!hideCTA && (
            <div className="hidden md:flex items-center space-x-6">
              {/* Pre-order Now: Primary, white fill, teal border, big shadow */}
              <Link href="/order">
                <button
                  className="px-6 py-2 rounded-full font-semibold transition-transform transform hover:scale-105 bg-white text-teal-600 border-2 border-teal-600 shadow-lg drop-shadow-lg"
                >
                  Pre-order Now
                </button>
              </Link>
              {/* Support The Mission: Secondary, white fill, gray text, lighter shadow */}
              {/* <Link href="/donate">
                <button
                  className="px-6 py-2 rounded-full font-medium transition-transform transform hover:scale-105 bg-white text-gray-600 border border-gray-300 shadow-sm drop-shadow-sm opacity-90"
                >
                  Support The Mission
                </button>
              </Link> */}
            </div>
          )}

          {/* Mobile Hamburger */}
          {!hideCTA && (
            <button onClick={() => setMobileMenuOpen((o) => !o)} className="md:hidden drop-shadow-lg z-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${'text-white'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {!hideCTA && (
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-2 mx-4 sm:mx-6 lg:mx-8 rounded-xl bg-[linear-gradient(135deg,rgba(50,50,50,0.6),rgba(80,80,80,0.3))] backdrop-blur-[5px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-gray-400/30"
            >
              <div className="px-4 py-4 space-y-4">
                {NAV_ITEMS.map((item) => (
                  <Link key={item.href} href={item.href} className="block font-medium text-white">
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-400/30 space-y-2">
                  <Link href="/order" className="block">
                    <button className="w-full px-6 py-2 rounded-full font-semibold bg-white text-teal-600 border-2 border-teal-600 shadow-lg drop-shadow-lg hover:scale-105 transition-transform">
                      Pre-order Now
                    </button>
                  </Link>
                  <Link href="/donate" className="block">
                    <button className="w-full px-6 py-2 rounded-full font-medium bg-white text-gray-600 border border-gray-300 shadow-sm drop-shadow-sm opacity-90 hover:scale-105 transition-transform">
                      Support The Mission
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.header>
  );
}