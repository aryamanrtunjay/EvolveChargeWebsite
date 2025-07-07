import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronDown, Zap, Crown, ArrowRight, Check, Clock, Shield } from 'lucide-react';

// Simplified pattern overlay
const SubtlePattern = ({ opacity = 0.02 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <svg width="100%" height="100%" className="text-[#D4AF37]">
      <defs>
        <pattern id="modalGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="0.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#modalGrid)" />
    </svg>
  </div>
);

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

  // Reserve content - condensed
  const reserveContent = (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-white">Reserve Your Unit</p>
          <p className="text-xs text-gray-400">Pay remaining balance at delivery</p>
        </div>
        <div className="text-right">
          <span className="text-xl font-semibold text-white">$5</span>
          <p className="text-xs text-gray-400">fully refundable</p>
        </div>
      </div>
      
      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
        <div className="flex items-start gap-2">
          <Clock className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-300 space-y-0.5">
            <p>• Secure spot with $5 deposit • Get shipping notification</p>
            <p>• Pay remaining $120 before delivery • Full refund anytime</p>
          </div>
        </div>
      </div>
      
      <Link href="/reserve">
        <motion.div
          className="inline-flex items-center gap-2 text-sm font-medium text-[#D4AF37] 
                   hover:text-white transition-colors duration-200 mt-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Reserve Now</span>
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </Link>
    </div>
  );

  // Order content - condensed
  const orderContent = (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-white">Complete Purchase</p>
          <p className="text-xs text-gray-400">Priority delivery and exclusive benefits</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-gray-400 line-through">$124.99</span>
            <div className="bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded text-xs font-medium">
              20% OFF
            </div>
          </div>
          <span className="text-xl font-semibold text-white">$99.99</span>
          <p className="text-xs text-gray-400">complete payment</p>
        </div>
      </div>
      <div className="bg-[#D4AF37]/10 rounded-lg p-3 border border-[#D4AF37]/20">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-300 space-y-0.5">
            <p>• First production batch (Q2 2026) • Skip reservation queue</p>
            <p>• Beta features & priority support • 30-day money-back guarantee</p>
          </div>
        </div>
      </div>
      
      <Link href="/order">
        <motion.div
          className="inline-flex items-center gap-2 text-sm font-medium text-white 
                   bg-gradient-to-r from-[#D4AF37] to-[#B8860B] px-4 py-2 rounded-lg
                   hover:shadow-md hover:shadow-[#D4AF37]/20 transition-all duration-200 mt-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Purchase Now</span>
          <ArrowRight className="w-4 h-4" />
        </motion.div>
      </Link>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-[#1A1A1A] rounded-2xl p-5 max-w-lg w-full shadow-xl 
                     border border-[#D4AF37]/20 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <SubtlePattern />

            {/* Header - more compact */}
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <h2 id="modal-title" className="text-xl font-semibold text-white mb-0.5">
                  Get Your <span className="text-[#D4AF37]">Ampereon</span>
                </h2>
                <p className="text-gray-400 text-sm">Choose the option that works best for you</p>
              </div>
              <motion.button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                aria-label="Close"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Content - more compact layout */}
            <div className="space-y-3 relative z-10">
              {/* Reserve Section */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {isMobile ? (
                  <div className="dropdown">
                    <motion.button
                      onClick={() => setIsReserveOpen(!isReserveOpen)}
                      className="flex justify-between items-center p-3 bg-[#2A2A2A]/60 
                               rounded-xl hover:bg-[#2A2A2A]/80 transition-all w-full
                               border border-[#D4AF37]/20 hover:border-[#D4AF37]/40"
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#D4AF37]/20 rounded-lg 
                                      flex items-center justify-center border border-[#D4AF37]/30">
                          <Zap className="w-4 h-4 text-[#D4AF37]" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-semibold text-white">Reserve</h3>
                          <p className="text-xs text-gray-400">$5 deposit</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-[#D4AF37] transform ${isReserveOpen ? 'rotate-180' : ''} 
                                            transition-transform duration-200`} />
                    </motion.button>
                    <AnimatePresence>
                      {isReserveOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-[#2A2A2A]/60 rounded-b-xl overflow-hidden 
                                   border border-[#D4AF37]/20 border-t-0"
                        >
                          <div className="p-3">
                            {reserveContent}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="bg-[#2A2A2A]/60 border border-[#D4AF37]/20 
                               rounded-xl p-4 hover:border-[#D4AF37]/40 transition-all duration-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-lg 
                                    flex items-center justify-center border border-[#D4AF37]/30">
                        <Zap className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">Reserve Your Unit</h3>
                        <p className="text-sm text-gray-400">$5 fully refundable deposit</p>
                      </div>
                    </div>
                    {reserveContent}
                  </div>
                )}
              </motion.div>

              {/* Order Section - with subtle "Recommended" badge */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isMobile ? (
                  <div className="dropdown relative">
                    <div className="absolute -top-1.5 right-3 bg-[#D4AF37] text-black 
                                  text-xs font-medium px-2 py-0.5 rounded-full z-10">
                      Recommended
                    </div>
                    
                    <motion.button
                      onClick={() => setIsOrderOpen(!isOrderOpen)}
                      className="flex justify-between items-center p-3 bg-[#D4AF37]/10 
                               rounded-xl hover:bg-[#D4AF37]/20 transition-all w-full
                               border border-[#D4AF37] mt-2"
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-lg 
                                      flex items-center justify-center">
                          <Crown className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-sm font-semibold text-white">Purchase</h3>
                          <p className="text-xs text-gray-300">$99 complete</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-[#D4AF37] transform ${isOrderOpen ? 'rotate-180' : ''} 
                                            transition-transform duration-200`} />
                    </motion.button>
                    
                    <AnimatePresence>
                      {isOrderOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-[#D4AF37]/10 rounded-b-xl overflow-hidden 
                                   border border-[#D4AF37] border-t-0"
                        >
                          <div className="p-3">
                            {orderContent}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="bg-[#D4AF37]/10 border border-[#D4AF37] 
                               rounded-xl p-4 hover:bg-[#D4AF37]/15 transition-all duration-200 relative">
                    <div className="absolute -top-1.5 right-3 bg-[#D4AF37] text-black 
                                  text-xs font-medium px-2 py-0.5 rounded-full">
                      Recommended
                    </div>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-lg 
                                    flex items-center justify-center">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white">Complete Purchase</h3>
                        <p className="text-sm text-gray-300">$99 with priority benefits</p>
                      </div>
                    </div>
                    {orderContent}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Footer - more compact trust indicators */}
            <motion.div 
              className="mt-4 pt-3 border-t border-[#D4AF37]/20 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#D4AF37]" />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#D4AF37]" />
                  <span>Money-back guarantee</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#D4AF37]" />
                  <span>Expert support</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}