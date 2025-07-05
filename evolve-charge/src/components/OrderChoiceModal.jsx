import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function OrderChoiceModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 id="modal-title" className="text-2xl font-light text-[#1A1A1A] mb-2">
                  Get Your Ampereon
                </h2>
                <div className="w-8 h-px bg-[#D4AF37]" />
              </div>
              <button
                onClick={onClose}
                className="text-[#6A6A6A] hover:text-[#1A1A1A] transition-colors p-1"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* Reserve Option */}
              <Link href="/reserve">
                <div className="border border-gray-200 rounded-2xl p-6 hover:border-[#D4AF37] transition-colors cursor-pointer group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-[#1A1A1A] mb-1">Reserve</h3>
                      <p className="text-sm text-[#6A6A6A]">Secure your spot</p>
                    </div>
                    <span className="text-xl font-light text-[#1A1A1A]">$5</span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-[#6A6A6A] mb-4">
                    <p>• Join the delivery queue</p>
                    <p>• Pay balance when ready</p>
                    <p>• Full refund anytime</p>
                  </div>
                  
                  <div className="text-center">
                    <span className="text-sm text-[#D4AF37] group-hover:text-[#B8860B] transition-colors">
                      Reserve Now →
                    </span>
                  </div>
                </div>
              </Link>

              {/* Priority Order */}
              <Link href="/order">
                <div className="border-2 border-[#D4AF37] rounded-2xl p-6 hover:bg-[#D4AF37]/5 transition-colors cursor-pointer group relative">
                  <div className="absolute -top-3 left-4 bg-[#D4AF37] text-white text-xs px-3 py-1 rounded-full">
                    Popular
                  </div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-[#1A1A1A] mb-1">Priority Order</h3>
                      <p className="text-sm text-[#6A6A6A]">Skip the line</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#6A6A6A] line-through">$124</div>
                      <div className="text-xl font-light text-[#1A1A1A]">$99</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-[#6A6A6A] mb-4">
                    <p>• First in delivery queue</p>
                    <p>• Guaranteed Dec 1, 2025</p>
                    <p>• Early access features</p>
                  </div>
                  
                  <div className="text-center">
                    <span className="text-sm text-[#D4AF37] group-hover:text-[#B8860B] transition-colors font-medium">
                      Order Now →
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-[#6A6A6A]">
                Questions? Contact our team for assistance.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}