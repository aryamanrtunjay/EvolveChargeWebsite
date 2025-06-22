'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import LogoWhite from '@/images/LogoWhite.svg';
import OrderChoiceModal from './OrderChoiceModal';

// Exclude Home since logo links back to home
const NAV_ITEMS = [
  { label: 'Product', href: '/product' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Support Us', href: '/support-us' },
];

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const pathname = usePathname();
  const hideCTA = ['/order', '/order/success', '/reserve', '/reserve/success'].includes(pathname);
  const navRefs = useRef({});
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const modalRef = useRef(null);
  const activeHref = NAV_ITEMS.find((item) => item.href === pathname)?.href || null;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect desktop vs mobile
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Handle clicks outside mobile menu and modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        hamburgerRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
      if (
        isModalOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen, isModalOpen]);

  // Focus trap for modal
  useEffect(() => {
    if (isModalOpen) {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0];
      const lastElement = focusableElements?.[focusableElements.length - 1];

      const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
        if (e.key === 'Escape') {
          setIsModalOpen(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      firstElement?.focus();
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isModalOpen]);

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
          <div className="hidden md:flex space-x-12 relative">
            {NAV_ITEMS.map((item) => (
              item.href === '/product' && !isDesktop ? null : (
                <Link
                  key={item.href}
                  href={item.href}
                  ref={(el) => (navRefs.current[item.href] = el)}
                  className={`font-medium transition-colors hover:text-teal-300 drop-shadow-md ${
                    pathname === item.href ? 'text-teal-300' : 'text-white'
                  } relative`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>

          {/* Desktop CTAs */}
          {!hideCTA && (
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-2 rounded-full font-semibold transition-transform transform hover:scale-105 bg-white text-teal-600 border-2 border-teal-600 shadow-lg drop-shadow-lg"
              >
                Order Now
              </button>
            </div>
          )}

          {/* Mobile Hamburger */}
          {!hideCTA && (
            <button
              ref={hamburgerRef}
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="md:hidden drop-shadow-lg z-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
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
              ref={mobileMenuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden mt-2 mx-4 sm:mx-6 lg:mx-8 rounded-xl bg-[linear-gradient(135deg,rgba(50,50,50,0.6),rgba(80,80,80,0.3))] backdrop-blur-[5px] shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-gray-400/30 overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.15, ease: 'easeOut' }}
                className="px-4 py-4 space-y-4"
              >
                {NAV_ITEMS.map((item, index) => (
                  item.href === '/product' ? null : (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.15 + (index * 0.05) }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block font-medium text-white hover:text-teal-300 transition-colors"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  )
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.15 + (NAV_ITEMS.length * 0.05) }}
                  className="pt-4 border-t border-gray-400/30 space-y-2"
                >
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="w-full px-6 py-2 rounded-full font-semibold bg-white text-teal-600 border-2 border-teal-600 shadow-lg drop-shadow-lg hover:scale-105 transition-transform"
                  >
                    Order Now
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Modal */}
      <OrderChoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.header>
  );
}