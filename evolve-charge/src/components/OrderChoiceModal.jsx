import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

// Custom hook to detect mobile devices
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsMobile(mediaQuery.matches);

    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, []);

  return isMobile;
}

export default function OrderChoiceModal({ isOpen, onClose }) {
  const isMobile = useIsMobile();
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  // Reserve content
  const reserveContent = (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">Secure your spot</p>
        </div>
        <span className="text-xl font-light text-white">$5</span>
      </div>
      <div className="space-y-2 text-sm text-gray-400">
        <p>• Join the delivery queue</p>
        <p>• Pay balance when ready</p>
        <p>• Full refund anytime</p>
      </div>
      <div className="text-center">
        <Link href="/reserve" className="text-sm text-[#D4AF37] hover:text-[#B8860B] transition-colors font-medium">
          Reserve Now →
        </Link>
      </div>
    </div>
  );

  // Order content
  const orderContent = (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-400">Skip the line</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400 line-through">$124</div>
          <div className="text-xl font-light text-white">$99</div>
        </div>
      </div>
      <div className="space-y-2 text-sm text-gray-400">
        <p>• First in delivery queue</p>
        <p>• Guaranteed Dec 1, 2025</p>
        <p>• Early access features</p>
      </div>
      <div className="text-center">
        <Link href="/order" className="text-sm text-[#D4AF37] hover:text-[#B8860B] transition-colors font-medium">
          Order Now →
        </Link>
      </div>
    </div>
  );

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
            className="bg-[#1A1A1A] rounded-3xl p-8 max-w-md w-full shadow-2xl relative backdrop-blur-xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 id="modal-title" className="text-2xl font-light text-white mb-2 tracking-tight">
                  Get Your Ampereon
                </h2>
                <div className="w-8 h-px bg-gradient-to-r from-[#D4AF37] to-[#B8860B]" />
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content: Vertical layout for all screens */}
            <div className="space-y-4">
              {/* Reserve Section */}
              <div className="group relative">
                {isMobile ? (
                  <div className="dropdown">
                    <button
                      onClick={() => setIsReserveOpen(!isReserveOpen)}
                      className="flex justify-between items-center p-6 bg-[#2A2A2A]/80 rounded-2xl hover:bg-[#3A3A3A]/80 transition-colors w-full backdrop-blur-sm border border-gray-700 hover:border-[#D4AF37]/50"
                    >
                      <div className="flex flex-col items-start">
                        <h3 className="text-lg font-medium text-white">Reserve</h3>
                        <div className="w-8 h-px bg-gradient-to-r from-[#D4AF37] to-[#B8860B] mt-1" />
                      </div>
                      <ChevronDown className={`w-5 h-5 text-[#D4AF37] transform ${isReserveOpen ? 'rotate-180' : ''} transition-transform`} />
                    </button>
                    <AnimatePresence>
                      {isReserveOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                          className="p-6 bg-[#1A1A1A]/90 rounded-b-2xl overflow-hidden border border-gray-700 border-t-0"
                        >
                          {reserveContent}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="border border-gray-700 rounded-2xl p-6 hover:border-[#D4AF37]/50 hover:bg-[#2A2A2A]/20 transition-colors">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-white">Reserve</h3>
                      <div className="w-8 h-px bg-gradient-to-r from-[#D4AF37] to-[#B8860B] mt-1" />
                    </div>
                    {reserveContent}
                  </div>
                )}
              </div>

              {/* Priority Order Section */}
              <div className="group relative">
                {isMobile ? (
                  <div className="dropdown">
                    <button
                      onClick={() => setIsOrderOpen(!isOrderOpen)}
                      className="flex justify-between items-center p-6 bg-[#2A2A2A]/80 rounded-2xl hover:bg-[#3A3A3A]/80 transition-colors w-full backdrop-blur-sm border-2 border-[#D4AF37]"
                    >
                      <div className="flex flex-col items-start">
                        <h3 className="text-lg font-medium text-white">Priority Order</h3>
                        <div className="w-8 h-px bg-gradient-to-r from-[#D4AF37] to-[#B8860B] mt-1" />
                      </div>
                      <ChevronDown className={`w-5 h-5 text-[#D4AF37] transform ${isOrderOpen ? 'rotate-180' : ''} transition-transform`} />
                    </button>
                    <AnimatePresence>
                      {isOrderOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                          className="p-6 bg-[#1A1A1A]/90 rounded-b-2xl overflow-hidden border border-[#D4AF37] border-t-0 relative"
                        >
                          <div className="absolute -top-3 left-4 bg-[#D4AF37] text-white text-xs px-3 py-1 rounded-full shadow-sm">
                            Popular
                          </div>
                          {orderContent}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="border-2 border-[#D4AF37] rounded-2xl p-6 hover:bg-[#D4AF37]/10 transition-colors relative">
                    <div className="absolute -top-3 left-4 bg-[#D4AF37] text-white text-xs px-3 py-1 rounded-full shadow-sm">
                      Popular
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg font-medium text-white">Priority Order</h3>
                      <div className="w-8 h-px bg-gradient-to-r from-[#D4AF37] to-[#B8860B] mt-1" />
                    </div>
                    {orderContent}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 font-light">
                Questions? Contact our team for assistance.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}