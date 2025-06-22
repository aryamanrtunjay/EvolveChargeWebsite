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
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-xl w-full mx-4 border border-teal-500/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 sticky top-0 z-10">
              <h2 id="modal-title" className="text-2xl font-bold text-white">Secure Your EVolve Charger</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-gray-300/30 text-white/80 hover:bg-gray-500/50 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-white/70 mb-8 text-center text-base">
              Order now to lock in your spot for the world’s first automatic EV charger.
            </p>

            <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Reserve Option */}
              <div>
                <div className="sm:hidden">
                  <button
                    onClick={() => setReserveOpen(!reserveOpen)}
                    className="w-full p-4 rounded-xl bg-white/5 border border-gray-500/50 flex justify-between items-center hover:bg-white/10 transition-colors"
                    aria-expanded={reserveOpen}
                    aria-controls="reserve-details"
                  >
                    <span className="text-lg font-semibold text-white/90">Reserve Your Spot</span>
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-white/80 mr-2">$4.99</span>
                      <motion.svg
                        className="w-5 h-5 text-white/80"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        animate={{ rotate: reserveOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                              <div className="flex items-center text-white/70">
                                <svg className="w-4 h-4 mr-2 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Join the reservation queue</span>
                              </div>
                              <div className="flex items-center text-white/70">
                                <svg className="w-4 h-4 mr-2 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Pay balance when charger is ready</span>
                              </div>
                              <div className="flex items-center text-white/70">
                                <svg className="w-4 h-4 mr-2 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Delivery based on queue position</span>
                              </div>
                            </div>
                            <div className="mt-4 text-xs text-white/50">
                              Delivery timeline depends on production schedule.
                            </div>
                            <button
                              className="mt-4 w-full px-6 py-3 rounded-full bg-teal-500/20 border border-teal-500/50 text-white font-medium text-center hover:bg-teal-500/30 transition-colors"
                            >
                              Reserve Now
                            </button>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="hidden sm:block">
                  <Link href="/reserve">
                    <div className="w-full p-6 rounded-xl bg-white/5 border border-gray-500/50 cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-white/90">Reserve Your Spot</h3>
                        <span className="text-xl font-bold text-white/80">$4.99</span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center text-white/70">
                          <svg className="w-4 h-4 mr-2 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Join the reservation queue</span>
                        </div>
                        <div className="flex items-center text-white/70">
                          <svg className="w-4 h-4 mr-2 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Pay balance when charger is ready</span>
                        </div>
                        <div className="flex items-center text-white/70">
                          <svg className="w-4 h-4 mr-2 text-white/40" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Delivery based on queue position</span>
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-white/50">
                        Delivery timeline depends on production schedule.
                      </div>
                      <button
                        className="mt-4 w-full px-6 py-3 rounded-full bg-teal-500/20 border border-teal-500/50 text-white font-medium text-center hover:bg-teal-500/30 transition-colors"
                      >
                        Reserve Now
                      </button>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Priority Order Option */}
              <div className="relative">
                <div className="absolute -top-3 left-4 bg-teal-500 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
                  Most Popular
                </div>
                <div className="sm:hidden">
                  <button
                    onClick={() => setPriorityOpen(!priorityOpen)}
                    className="w-full p-4 rounded-xl bg-gradient-to-r from-teal-600/30 to-teal-700/30 border-2 border-teal-400 flex justify-between items-center hover:bg-teal-600/40 transition-colors"
                    aria-expanded={priorityOpen}
                    aria-controls="priority-details"
                  >
                    <span className="text-lg font-semibold text-teal-300">Priority Order</span>
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-teal-200 mr-2">$99.99</span>
                      <motion.svg
                        className="w-5 h-5 text-teal-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        animate={{ rotate: priorityOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                              <div className="flex items-center text-green-300">
                                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">#1 in delivery queue</span>
                              </div>
                              <div className="flex items-center text-green-300">
                                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">Guaranteed delivery by Dec 1, 2025</span>
                              </div>
                              <div className="flex items-center text-green-300">
                                <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span>Pay in full to secure priority</span>
                              </div>
                            </div>
                            <div className="mt-4 text-xs text-teal-200 italic">
                              Limited priority spots available! Ships upon production completion.
                            </div>
                            <button
                              className="mt-4 w-full px-6 py-3 rounded-full bg-teal-500 text-white font-medium text-center hover:bg-teal-600 transition-colors"
                            >
                              Order Now
                            </button>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="hidden sm:block">
                  <Link href="/order">
                    <div className="w-full p-6 rounded-xl bg-gradient-to-r from-teal-600/30 to-teal-700/30 border-2 border-teal-400 cursor-pointer">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-teal-300">Priority Order</h3>
                        <span className="text-2xl font-bold text-teal-200">$99.99</span>
                      </div>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center text-green-300">
                          <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">#1 in delivery queue</span>
                        </div>
                        <div className="flex items-center text-green-300">
                          <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">Guaranteed delivery by Dec 1, 2025</span>
                        </div>
                        <div className="flex items-center text-green-300">
                          <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Pay in full to secure priority</span>
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-teal-200 italic">
                        Limited priority spots available! Ships upon production completion.
                      </div>
                      <button
                        className="mt-4 w-full px-6 py-3 rounded-full bg-teal-500 text-white font-medium text-center hover:bg-teal-600 transition-colors"
                      >
                        Order Now
                      </button>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}