'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import OrderChoiceModal from '@/components/OrderChoiceModal';

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
    setIsMobileMenuOpen(false); // close slide-out if it’s open
  };
  const navLinks = [
    { name: 'Product', href: '/product' },
    { name: 'About',   href: '/about'  },
    { name: 'FAQ',     href: '/faq'    },
    { name: 'Support', href: '/support-us'}
  ];

  /* ───────────────── framer variants ───────────────── */
  const menuVariants = { closed:{opacity:0,x:'100%'}, open:{opacity:1,x:0} };
  const linkVariants = {
    closed:{opacity:0,x:50},
    open:(i)=>({opacity:1,x:0,transition:{delay:i*0.1+0.2}})
  };

  /* ───────────────── layout ───────────────── */
  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: .3 }}
        className={`fixed top-0 z-50 w-full transition
          ${isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-black/10'
            : 'bg-white/80 backdrop-blur-sm border-b border-black/10'}`}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-20 items-center justify-between">
            {/* logo */}
            <motion.a href="/" whileHover={{ scale:1.05 }} className="text-2xl font-bold tracking-wider text-[#C9A86A]">
              AMPEREON
            </motion.a>

            {/* desktop links */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map(link=>(
                <motion.a key={link.name} href={link.href}
                  whileHover={{ y:-2 }} className="relative font-medium text-[#6F6F6F] hover:text-[#111]">
                  {link.name}
                  <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#C9A86A] transition-all group-hover:w-full"/>
                </motion.a>
              ))}
            </div>

            {/* desktop CTA */}
            <motion.button
              onClick={openModal}
              whileHover={{ scale:1.05 }} whileTap={{ scale:.95 }}
              className="hidden md:block rounded-full bg-[#C9A86A] px-6 py-3 font-semibold text-white
                         shadow-sm transition hover:bg-[#B48F55] focus:ring-2 focus:ring-[#C9A86A]"
            >
              Order Now
            </motion.button>

            {/* mobile burger */}
            <motion.button
              onClick={()=>setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden rounded-lg p-2 hover:bg-[#F5F6F7]"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 fill-[#111111]"/> : <Menu className="h-6 w-6 fill-[#111111]"/>}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={()=>setIsMobileMenuOpen(false)}
            />
            <motion.div
              variants={menuVariants} initial="closed" animate="open" exit="closed"
              className="fixed top-0 right-0 z-50 h-full w-full sm:w-80 bg-white shadow-2xl md:hidden"
            >
              {/* header */}
              <div className="flex items-center justify-between border-b border-black/10 p-6">
                <span className="text-2xl font-bold tracking-wider text-[#C9A86A]">AMPEREON</span>
                <button onClick={()=>setIsMobileMenuOpen(false)} className="rounded-lg p-2 hover:bg-[#F5F6F7]">
                  <X className="h-6 w-6"/>
                </button>
              </div>

              {/* links */}
              <div className="flex-1 px-6 py-8">
                {navLinks.map((link,i)=>(
                  <motion.a
                    key={link.name} href={link.href} custom={i}
                    variants={linkVariants} initial="closed" animate="open"
                    onClick={()=>setIsMobileMenuOpen(false)}
                    className="group block py-4 text-lg font-medium text-[#111] hover:text-[#C9A86A]"
                  >
                    {link.name}
                    <span className="absolute left-0 bottom-3 h-0.5 w-0 bg-[#C9A86A] transition-all group-hover:w-full"/>
                  </motion.a>
                ))}
              </div>

              {/* mobile CTA */}
              <div className="border-t border-black/10 p-6">
                <button
                  onClick={openModal}
                  className="w-full rounded-full bg-[#C9A86A] px-6 py-4 font-semibold text-white shadow-lg
                             transition hover:bg-[#B48F55]"
                >
                  Order Now
                </button>
                <p className="mt-4 text-center text-sm text-[#6F6F6F]">$5 fully refundable deposit</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ORDER CHOICE MODAL */}
      <OrderChoiceModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} />
    </>
  );
};

export default AmpereonNavbar;
