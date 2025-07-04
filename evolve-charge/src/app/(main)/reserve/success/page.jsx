'use client';

import { Suspense, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, CheckCircle, Mail, Phone, ChevronRight, Clock } from 'lucide-react';
import Script from 'next/script';

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

function ReserveSuccessContent() {
  const searchParams = useSearchParams();
  const [activeAccordion, setActiveAccordion] = useState(null);
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, 20]);

  // Get query parameters
  const reservationId = searchParams.get('reservationId');
  const name = searchParams.get('name');
  const fullName = searchParams.get('fullName');
  const reservationNumber = reservationId ? `EV-${reservationId.slice(-6).toUpperCase()}` : null;

  // Reservation data
  const reservationData = {
    displayName: fullName ? decodeURIComponent(fullName) : (name ? decodeURIComponent(name) : null),
    amount: 4.99,
  };

  // Error state
  if (!reservationId || !reservationNumber) {
    return (
      <div className="min-h-screen bg-[#F5F6F7] text-[#111111] pt-32 pb-20">
        <motion.div 
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Reservation Error</h1>
          <p className="text-lg text-red-600 mb-4">Invalid or missing reservation details. Please contact support.</p>
          <p className="text-[#6F6F6F] mb-8">
            Reach out at{' '}
            <a href="mailto:support@evolve-charge.com" className="text-[#EFBF04] hover:text-[#B48F55] underline">
              support@evolve-charge.com
            </a>{' '}
            or call (425) 324-4529.
          </p>
          <Link
            href="/"
            className="px-8 py-4 border border-[#111111]/15 rounded-full text-[#111111] font-semibold hover:bg-white/40 transition transform hover:scale-105"
          >
            Return to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  const nextSteps = [
    { 
      title: "Email Confirmation", 
      desc: "Check your inbox for your reservation details and confirmation.", 
      icon: <Mail className="w-6 h-6" /> 
    },
    { 
      title: "Production Updates", 
      desc: "We’ll notify you when your charger is ready, and you can pay the remaining balance.", 
      icon: <Clock className="w-6 h-6" /> 
    },
    { 
      title: "Priority Access", 
      desc: "Your reservation ensures early delivery and exclusive updates.", 
      icon: <ChevronRight className="w-6 h-6" /> 
    },
  ];

  return (
    <div className="bg-[#F5F6F7] text-[#111111] overflow-x-hidden">
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('config','q1blv');
          `,
        }}
      />

      {/* Hero Section */}
      <motion.section
        className="relative min-h-[60vh] flex items-center justify-center px-6"
        style={{ y: heroParallax }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#F5F6F7]" />
        <motion.div
          className="relative z-10 backdrop-blur-sm bg-white/70 border border-[#111111]/5 rounded-2xl p-10 max-w-3xl mx-auto shadow-xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block bg-[#EFBF04]/10 p-3 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-[#EFBF04]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Your Reservation is <span className="text-[#EFBF04]">Confirmed!</span>
          </h1>
          {reservationData.displayName && (
            <p className="text-lg text-[#6F6F6F] mb-4">
              Congratulations, {reservationData.displayName}! You’re an early adopter of Ampereon.
            </p>
          )}
          <p className="text-md text-[#6F6F6F] mb-6">
            Reservation #: <span className="font-medium">{reservationNumber}</span>
          </p>
          <div className="inline-block text-sm bg-[#EFBF04]/10 text-[#EFBF04] px-4 py-2 rounded-full">
            An email confirmation has been sent to your registered email.
          </div>
        </motion.div>
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <ChevronDown className="w-5 h-5 text-[#111111] drop-shadow" />
        </motion.div>
      </motion.section>

      {/* Reservation Details Section */}
      <motion.section
        className="py-24 px-6 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-[#F5F6F7] backdrop-blur-sm rounded-2xl p-8 border border-[#111111]/8 shadow-sm"
            variants={staggerContainer}
          >
            <h2 className="text-2xl font-bold mb-6 tracking-tight">Reservation Details</h2>
            <motion.div variants={fadeUpVariants} className="flex items-center mb-6 pb-6 border-b border-[#111111]/8">
              <div className="mr-4 text-[#EFBF04]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Ampereon Reservation</h3>
                <p className="text-[#6F6F6F]">$4.99 deposit for the world’s first automatic EV charger</p>
              </div>
            </motion.div>
            {reservationData.displayName && (
              <motion.div variants={fadeUpVariants} className="mb-6">
                <h3 className="font-medium mb-2">Customer Information</h3>
                <p className="text-[#6F6F6F]">{reservationData.displayName}</p>
              </motion.div>
            )}
            <motion.div variants={fadeUpVariants} className="border-t border-[#111111]/8 pt-6">
              <h3 className="font-medium mb-4">Payment Summary</h3>
              <div className="flex justify-between mb-2 text-[#6F6F6F]">
                <span>Reservation Deposit</span>
                <span>${reservationData.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold mt-4 pt-4 border-t border-[#111111]/8">
                <span>Total Paid</span>
                <span>${reservationData.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-2 text-sm text-[#6F6F6F]">
                <span>Payment Method</span>
                <span>Credit Card</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* What's Next Section */}
      <motion.section
        className="py-24 px-6 bg-[#F5F6F7]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight">
            What’s Next for Your EVolve Journey
          </h2>
          <div className="grid grid-cols-1 gap-8">
            {nextSteps.map((step, i) => (
              <motion.div
                key={i}
                className="bg-white backdrop-blur-sm rounded-2xl p-8 border border-[#111111]/8 hover:border-[#EFBF04]/30 transition-all shadow-sm"
                variants={fadeUpVariants}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-[#EFBF04] text-white w-8 h-8 rounded-full flex items-center justify-center">{i + 1}</span>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                </div>
                <p className="text-[#6F6F6F]">{step.desc}</p>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                  className="flex items-center gap-2 text-[#EFBF04] hover:text-[#B48F55] transition-colors mt-4 focus:outline-none focus:ring-2 focus:ring-[#EFBF04] focus:ring-offset-2 rounded px-2 py-1"
                >
                  Learn More <ChevronDown className={`w-4 h-4 transition-transform ${activeAccordion === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {activeAccordion === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-4"
                    >
                      <p className="text-[#6F6F6F]">{step.desc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Support Section */}
      <motion.section
        className="py-16 px-6 bg-white border-y border-[#111111]/8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Need Help?</h2>
          <p className="text-lg text-[#6F6F6F] mb-8">
            Our team is here to assist with any questions about your reservation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="mailto:support@evolve-charge.com"
              className="flex items-center justify-center text-[#EFBF04] hover:text-[#B48F55] transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              support@evolve-charge.com
            </a>
            <a
              href="tel:+14253244529"
              className="flex items-center justify-center text-[#EFBF04] hover:text-[#B48F55] transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              (425) 324-4529
            </a>
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        className="py-16 px-6 bg-[#F5F6F7] text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Ready to Explore More?
          </h2>
          <p className="text-lg text-[#6F6F6F] mb-8">
            Learn more about Ampereon and join the future of EV charging.
          </p>
          <Link
            href="/"
            className="px-8 py-4 bg-[#EFBF04] text-white font-semibold rounded-full hover:brightness-110 transition transform hover:scale-105 focus:ring-2 focus:ring-[#EFBF04]/40 shadow-lg shadow-[#EFBF04]/30"
          >
            Return to Home
          </Link>
        </div>
      </motion.section>
    </div>
  );
}

export default function ReserveSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F6F7] flex justify-center items-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#EFBF04] rounded-full border-t-transparent"></div>
        </div>
      }
    >
      <ReserveSuccessContent />
    </Suspense>
  );
}