import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function OrderChoiceModal({ isOpen, onClose }) {
  const [reserveOpen, setReserveOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            className="bg-white/70 backdrop-blur-md rounded-2xl p-8 max-w-lg w-full mx-4 border border-black/10 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6 sticky top-0 z-10">
              <h2 id="modal-title" className="text-3xl font-semibold text-[#111111] tracking-wide">
                Order Your Ampereon
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/20 text-[#111111]/80 hover:bg-white/30 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-[#111111]/70 mb-8 text-center text-base leading-relaxed">
              Take the first step in simplifying your charging, right now.
            </p>

            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Reserve Option */}
              <div>
                <div className="sm:hidden">
                  <button
                    onClick={() => setReserveOpen(!reserveOpen)}
                    className="w-full p-4 rounded-xl bg-white/10 border border-black/10 flex justify-between items-center hover:bg-white/20 transition-colors"
                    aria-expanded={reserveOpen}
                    aria-controls="reserve-details"
                  >
                    <span className="text-lg font-medium text-[#111111]">Reserve Your Spot</span>
                    <div className="flex items-center">
                      <span className="text-xl font-semibold text-[#111111] mr-2">$4.99</span>
                      <motion.svg
                        className="w-5 h-5 text-[#111111]/80"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        animate={{ rotate: reserveOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </div>
                  </button>
                  <AnimatePresence>
                    {reserveOpen && (
                      <motion.div
                        id="reserve-details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <Link href="/reserve">
                          <div className="p-4">
                            <div className="space-y-3 text-sm">
                              <div className="flex items-center text-[#111111]/70">
                                <svg className="w-4 h-4 mr-2 text-[#EFBF04]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Join the delivery queue</span>
                              </div>
                              <div className="flex items-center text-[#111111]/70">
                                <svg className="w-4 h-4 mr-2 text-[#EFBF04]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Delivery based on queue position</span>
                              </div>
                              <div className="flex items-center text-[#111111]/70">
                                <svg className="w-4 h-4 mr-2 text-[#EFBF04]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Pay balance when charger is ready</span>
                              </div>
                            </div>
                            <div className="mt-4 text-xs text-[#111111]/50">
                              Delivery timeline depends on production schedule.
                            </div>
                            <motion.button
                              className="mt-4 w-full px-6 py-3 rounded-full bg-[#EFBF04] text-[#111111] font-medium text-center"
                              whileHover={{ scale: 1.05, backgroundColor: '#D1B47A' }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              Reserve Now
                            </motion.button>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="hidden sm:block">
                  <Link href="/reserve">
                    <motion.div
                      className="w-full p-6 rounded-xl bg-white/10 border border-black/10 cursor-pointer"
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium text-[#111111]">Reserve Your Spot</h3>
                        <span className="text-xl font-semibold text-[#111111]">$4.99</span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center text-[#111111]/70">
                          <svg className="w-4 h-4 mr-2 text-[#EFBF04]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Join the delivery queue</span>
                        </div>
                        <div className="flex items-center text-[#111111]/70">
                          <svg className="w-4 h-4 mr-2 text-[#EFBF04]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Delivery based on queue position</span>
                        </div>
                        <div className="flex items-center text-[#111111]/70">
                          <svg className="w-4 h-4 mr-2 text-[#EFBF04]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Pay balance when charger is ready</span>
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-[#111111]/50">
                        Delivery timeline depends on production schedule.
                      </div>
                      <motion.button
                        className="mt-4 w-full px-6 py-3 rounded-full bg-[#EFBF04] text-[#111111] font-medium text-center"
                        whileHover={{ scale: 1.05, backgroundColor: '#D1B47A' }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        Reserve Now
                      </motion.button>
                    </motion.div>
                  </Link>
                </div>
              </div>

              {/* Priority Order Option */}
              <div className="relative">
                <div className="absolute -top-3 left-4 bg-[#EFBF04] text-[#111111] text-xs font-medium px-2.5 py-1 rounded-full z-10">
                  Most Popular
                </div>
                <div className="sm:hidden">
                  <button
                    onClick={() => setPriorityOpen(!priorityOpen)}
                    className="w-full p-4 rounded-xl bg-white/10 border border-black/10 flex justify-between items-center hover:bg-white/20 transition-colors"
                    aria-expanded={priorityOpen}
                    aria-controls="priority-details"
                  >
                    <span className="text-lg font-medium text-[#111111]">Priority Order</span>
                    <div className="flex items-center">
                      <div className="flex flex-col items-end mr-2">
                        <span className="text-sm text-[#111111]/50 line-through">$124.99</span>
                        <span className="text-xl font-semibold text-[#111111]">$99.99</span>
                      </div>
                      <motion.svg
                        className="w-5 h-5 text-[#111111]/80"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        animate={{ rotate: priorityOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </div>
                  </button>
                  <AnimatePresence>
                    {priorityOpen && (
                      <motion.div
                        id="priority-details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <Link href="/order">
                          <div className="p-4">
                            <div className="space-y-3 text-sm">
                              <div className="flex items-center text-[#111111]/70">
                                <svg className="w-4 h-4 mr-2 text-[#EFBF04]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">#1 in delivery queue</span>
                              </div>
                              <div className="flex items-center text-[#111111]/70">
                                <svg className="w-4 h-4 mr-2 text-[#EFBF04]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Guaranteed delivery by Dec 1, 2025</span>
                              </div>
                              <div className="flex items-center text-[#111111]/70">
                                <svg className="w-4 h-4 mr-2 text-[#EFBF04]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Pay in full now and secure priority</span>
                              </div>
                            </div>
                            <div className="mt-4 text-xs text-[#111111]/50 italic">
                              Limited priority spots available! Ships upon production completion.
                            </div>
                            <motion.button
                              className="mt-4 w-full px-6 py-3 rounded-full bg-[#EFBF04] text-[#111111] font-medium text-center"
                              whileHover={{ scale: 1.05, backgroundColor: '#D1B47A' }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                            >
                              Order Now
                            </motion.button>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="hidden sm:block">
                  <Link href="/order">
                    <motion.div
                      className="w-full p-6 rounded-xl bg-white/10 border border-black/10 cursor-pointer"
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-[#111111]">Priority Order</h3>
                        <div className="flex flex-col items-end">
                          <span className="text-lg text-[#111111]/50 line-through">$124.99</span>
                          <span className="text-2xl font-semibold text-[#111111]">$99.99</span>
                        </div>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center text-[#111111]/70">
                          <svg className="w-4 h-4 mr-2 text-[#EFBF04]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">#1 in delivery queue</span>
                        </div>
                        <div className="flex items-center text-[#111111]/70">
                          <svg className="w-4 h-4 mr-2 text-[#EFBF04]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">Guaranteed delivery by Dec 1, 2025</span>
                        </div>
                        <div className="flex items-center text-[#111111]/70">
                          <svg className="w-4 h-4 mr-2 text-[#EFBF04]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Pay in full now and secure priority</span>
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-[#111111]/50 italic">
                        Limited priority spots available! Ships upon production completion.
                      </div>
                      <motion.button
                        className="mt-4 w-full px-6 py-3 rounded-full bg-[#EFBF04] text-[#111111] font-medium text-center"
                        whileHover={{ scale: 1.05, backgroundColor: '#D1B47A' }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        Order Now
                      </motion.button>
                    </motion.div>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}