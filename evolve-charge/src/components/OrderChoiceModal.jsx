import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ChevronDown, Zap, Crown, ArrowRight, Check, Star, Clock } from 'lucide-react';

// Modern tech pattern overlay
const TechPattern = ({ opacity = 0.05 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <svg width="100%" height="100%" className="text-[#D4AF37]">
      <defs>
        <pattern id="modalTechGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="1.5" fill="currentColor" />
          <circle cx="0" cy="0" r="1" fill="currentColor" />
          <circle cx="60" cy="60" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#modalTechGrid)" />
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

  // Reserve content with enhanced styling
  const reserveContent = (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-white">Reserve Your Spot</p>
          <p className="text-xs text-gray-400">Pay full amount when charger ships</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-light text-white">$5</span>
          <p className="text-xs text-gray-400">refundable</p>
        </div>
      </div>
      
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-sm font-medium text-white">How it works:</span>
        </div>
        <div className="space-y-1 text-xs text-gray-300">
          <p>• Reserve your place in line for $5</p>
          <p>• We'll notify you when ready to ship</p>
          <p>• Pay remaining $94 before delivery</p>
        </div>
      </div>
      
      <Link href="/reserve">
        <motion.div
          className="group inline-flex items-center gap-2 text-sm font-medium text-[#D4AF37] 
                   hover:text-white transition-all duration-300 relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">Reserve Spot</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/20 rounded-lg px-3 py-1 -mx-3 -my-1"
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      </Link>
    </div>
  );

  // Order content with enhanced styling
  const orderContent = (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-white">Order Complete Charger</p>
          <p className="text-xs text-gray-400">Get yours as soon as it's manufactured</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-gray-400 line-through">$124</span>
            <div className="bg-red-500/20 text-red-300 px-2 py-1 rounded-full text-xs font-medium">
              -20%
            </div>
          </div>
          <span className="text-2xl font-light text-white">$99</span>
          <p className="text-xs text-gray-400">full payment</p>
        </div>
      </div>
      
      <div className="bg-[#D4AF37]/10 rounded-xl p-4 border border-[#D4AF37]/30">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-sm font-medium text-white">Priority benefits:</span>
        </div>
        <div className="space-y-1 text-xs text-gray-300">
          <p>• First batch delivery (Dec 2025)</p>
          <p>• Skip the reservation queue</p>
          <p>• Beta access & priority support</p>
        </div>
      </div>
      
      <Link href="/order">
        <motion.div
          className="group inline-flex items-center gap-2 text-sm font-medium text-white 
                   bg-gradient-to-r from-[#D4AF37] to-[#B8860B] px-5 py-2.5 rounded-xl
                   shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="relative z-10">Order Now</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />
        </motion.div>
      </Link>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-gradient-to-br from-[#1A1A1A]/95 to-[#2A2A2A]/90 backdrop-blur-xl rounded-3xl 
                     p-6 max-w-lg w-full shadow-2xl relative border border-[#D4AF37]/20 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <TechPattern />
            
            {/* Animated background orbs */}
            <motion.div 
              className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-0 left-0 w-24 h-24 bg-[#B8860B]/10 rounded-full blur-2xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />

            {/* Header */}
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div>
                <motion.h2 
                  id="modal-title" 
                  className="text-2xl font-extralight text-white mb-2 tracking-tight"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Get Your <span className="font-bold text-[#D4AF37]">Ampereon</span>
                </motion.h2>
                <motion.div 
                  className="w-12 h-0.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                />
              </div>
              <motion.button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
                aria-label="Close"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Content: Enhanced design for all screens */}
            <div className="space-y-6 relative z-10">
              {/* Reserve Section */}
              <motion.div 
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {isMobile ? (
                  <div className="dropdown">
                    <motion.button
                      onClick={() => setIsReserveOpen(!isReserveOpen)}
                      className="flex justify-between items-center p-5 bg-gradient-to-br from-white/10 to-white/5 
                               rounded-2xl hover:from-white/15 hover:to-white/10 transition-all w-full backdrop-blur-sm 
                               border border-white/20 hover:border-[#D4AF37]/50 relative overflow-hidden"
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 rounded-xl 
                                      flex items-center justify-center border border-[#D4AF37]/30">
                          <Zap className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div className="flex flex-col items-start">
                          <h3 className="text-lg font-semibold text-white tracking-tight">Reserve Spot</h3>
                          <p className="text-sm text-gray-400">$5 • Pay $94 later</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-6 h-6 text-[#D4AF37] transform ${isReserveOpen ? 'rotate-180' : ''} 
                                            transition-transform duration-300 relative z-10`} />
                    </motion.button>
                    <AnimatePresence>
                      {isReserveOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                          className="bg-gradient-to-br from-[#1A1A1A]/95 to-[#2A2A2A]/90 backdrop-blur-xl rounded-b-2xl 
                                   overflow-hidden border border-white/20 border-t-0 relative"
                        >
                          <div className="p-5">
                            {reserveContent}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div 
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 
                             rounded-2xl p-7 hover:border-[#D4AF37]/50 hover:from-white/15 hover:to-white/10 
                             transition-all duration-500 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 opacity-5">
                      <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/30 to-[#B8860B]/30" />
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 
                                  group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 rounded-xl 
                                      flex items-center justify-center border border-[#D4AF37]/30 
                                      transition-transform duration-300">
                          <Zap className="w-7 h-7 text-[#D4AF37]" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white tracking-tight">Reserve Spot</h3>
                          <p className="text-sm text-gray-400 mt-1">$5 • Pay $94 when ready</p>
                        </div>
                      </div>
                      {reserveContent}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Priority Order Section */}
              <motion.div 
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {isMobile ? (
                  <div className="dropdown relative">
                    <div className="absolute -top-3 left-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white 
                                  text-xs font-bold px-4 py-2 rounded-full shadow-lg z-20 flex items-center gap-2">
                      <Star className="w-3 h-3" />
                      Popular
                    </div>
                    
                    <motion.button
                      onClick={() => setIsOrderOpen(!isOrderOpen)}
                      className="flex justify-between items-center p-5 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 
                               rounded-2xl hover:from-[#D4AF37]/30 hover:to-[#B8860B]/20 transition-all w-full backdrop-blur-sm 
                               border-2 border-[#D4AF37] relative overflow-hidden mt-4"
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-xl 
                                      flex items-center justify-center shadow-lg">
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col items-start">
                          <h3 className="text-lg font-semibold text-white tracking-tight">Order Now</h3>
                          <p className="text-sm text-gray-300">$99 • Get it first</p>
                        </div>
                      </div>
                      <ChevronDown className={`w-6 h-6 text-[#D4AF37] transform ${isOrderOpen ? 'rotate-180' : ''} 
                                            transition-transform duration-300 relative z-10`} />
                    </motion.button>
                    
                    <AnimatePresence>
                      {isOrderOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                          className="bg-gradient-to-br from-[#1A1A1A]/95 to-[#2A2A2A]/90 backdrop-blur-xl rounded-b-2xl 
                                   overflow-hidden border-2 border-[#D4AF37] border-t-0 relative"
                        >
                          <div className="p-5">
                            {orderContent}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div 
                    className="bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 backdrop-blur-xl border-2 border-[#D4AF37] 
                             rounded-2xl p-7 hover:from-[#D4AF37]/30 hover:to-[#B8860B]/20 transition-all duration-500 
                             relative overflow-hidden group"
                  >
                    <div className="absolute -top-4 left-8 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white 
                                  text-xs font-bold px-4 py-2 rounded-full shadow-xl z-20 flex items-center gap-2">
                      <Star className="w-3 h-3" />
                      Popular
                    </div>
                    
                    <div className="absolute inset-0 opacity-10">
                      <div className="w-full h-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B]" />
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/10 opacity-0 
                                  group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-xl 
                                      flex items-center justify-center shadow-lg transition-transform duration-300">
                          <Crown className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white tracking-tight">Order Now</h3>
                          <p className="text-sm text-gray-300 mt-1">$99 • Get yours first</p>
                        </div>
                      </div>
                      {orderContent}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}