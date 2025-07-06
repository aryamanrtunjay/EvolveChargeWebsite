'use client';

import { Suspense, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, CheckCircle, Mail, Phone, ChevronRight, Clock, Shield, Star } from 'lucide-react';
import Script from 'next/script';

// Subtle pattern overlay
const SubtlePattern = ({ opacity = 0.03 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <svg width="100%" height="100%" className="text-[#D4AF37]">
      <defs>
        <pattern id="subtleGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#subtleGrid)" />
    </svg>
  </div>
);

// Animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.15, delayChildren: 0.1 } 
  }
};

function ReserveSuccessContent() {
  const searchParams = useSearchParams();
  const [activeAccordion, setActiveAccordion] = useState(null);
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, 15]);

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
      <div className="min-h-screen bg-[#0A0A0A] text-white pt-32 pb-20 relative">
        <SubtlePattern />
        <motion.div 
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={fadeUpVariants}
        >
          <div className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-2xl p-8 border border-red-500/30">
            <h1 className="text-3xl md:text-4xl font-light mb-4">
              Reservation <span className="font-semibold text-red-400">Error</span>
            </h1>
            <p className="text-lg text-red-400 mb-4">Invalid or missing reservation details. Please contact support.</p>
            <p className="text-gray-300 mb-8">
              Reach out at{' '}
              <a href="mailto:support@evolve-charge.com" className="text-[#D4AF37] hover:text-[#B8860B] underline transition-colors">
                support@evolve-charge.com
              </a>{' '}
              or call (425) 324-4529.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-8 py-4 border border-[#D4AF37]/30 rounded-xl text-white font-medium 
                       hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-300"
            >
              Return to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const nextSteps = [
    { 
      title: "Email Confirmation", 
      desc: "Check your inbox for your reservation details and confirmation number.", 
      detail: "You'll receive a comprehensive email with your reservation details, timeline, and next steps. Keep this for your records.",
      icon: <Mail className="w-6 h-6" /> 
    },
    { 
      title: "Production Updates", 
      desc: "We'll notify you when your charger is ready, and you can complete your order.", 
      detail: "As an early adopter, you'll receive exclusive updates on manufacturing progress, new features, and priority delivery scheduling.",
      icon: <Clock className="w-6 h-6" /> 
    },
    { 
      title: "Priority Access", 
      desc: "Your reservation ensures early delivery and exclusive updates.", 
      detail: "Skip the waiting list and be among the first to experience the future of EV charging. Plus, get access to our private community of early adopters.",
      icon: <ChevronRight className="w-6 h-6" /> 
    },
  ];

  return (
    <div className="bg-[#0A0A0A] text-white overflow-x-hidden">
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
        className="relative min-h-[70vh] flex items-center justify-center px-6"
        style={{ y: heroParallax }}
      >
        <SubtlePattern />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1A1A1A]/20 to-[#0A0A0A]" />
        
        <motion.div
          className="relative z-10 bg-[#2A2A2A]/60 backdrop-blur-sm border border-[#D4AF37]/20 rounded-2xl p-10 max-w-3xl mx-auto shadow-2xl text-center"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 
                     rounded-full mb-8 border border-[#D4AF37]/30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          >
            <CheckCircle className="h-10 w-10 text-[#D4AF37]" />
          </motion.div>
          
          <h1 className="text-3xl md:text-5xl font-light leading-tight mb-6">
            Your Reservation is{' '}
            <span className="font-semibold text-[#D4AF37]">Confirmed!</span>
          </h1>
          
          {reservationData.displayName && (
            <p className="text-xl text-gray-300 mb-6 font-light">
              Congratulations, {reservationData.displayName}! You're an early adopter of the future.
            </p>
          )}
          
          <div className="inline-flex items-center gap-2 text-sm font-medium text-[#D4AF37] 
                        bg-[#D4AF37]/10 px-4 py-2 rounded-full mb-8 border border-[#D4AF37]/20">
            <Shield className="w-4 h-4" />
            <span>Reservation #{reservationNumber}</span>
          </div>
          
          <div className="text-sm text-gray-400 bg-[#1A1A1A]/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-[#D4AF37]/10">
            Confirmation details sent to your email address
          </div>
        </motion.div>
        
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-[#D4AF37]/70" />
        </motion.div>
      </motion.section>

      {/* Reservation Details Section */}
      <motion.section
        className="py-20 px-6 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <SubtlePattern />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-2xl p-8 border border-[#D4AF37]/20 shadow-xl"
            variants={staggerContainer}
          >
            <h2 className="text-2xl font-light mb-8">
              Reservation <span className="font-semibold text-[#D4AF37]">Details</span>
            </h2>
            
            <motion.div variants={fadeUpVariants} className="flex items-center mb-8 pb-8 border-b border-[#D4AF37]/20">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 rounded-lg 
                            flex items-center justify-center mr-6 border border-[#D4AF37]/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-xl text-white mb-2">Ampereon Reservation</h3>
                <p className="text-gray-300">Early access to the world's first automatic EV charger</p>
              </div>
            </motion.div>
            
            {reservationData.displayName && (
              <motion.div variants={fadeUpVariants} className="mb-8">
                <h3 className="font-medium mb-3 text-white">Customer Information</h3>
                <p className="text-gray-300">{reservationData.displayName}</p>
              </motion.div>
            )}
            
            <motion.div variants={fadeUpVariants} className="border-t border-[#D4AF37]/20 pt-8">
              <h3 className="font-medium mb-6 text-white">Payment Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Reservation Deposit</span>
                  <span>${reservationData.amount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between font-semibold text-xl pt-4 border-t border-[#D4AF37]/20 text-[#D4AF37]">
                  <span>Total Paid</span>
                  <span>${reservationData.amount.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-400 pt-2">
                  <span>Payment Method</span>
                  <span>Credit Card</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* What's Next Section */}
      <motion.section
        className="py-20 px-6 bg-[#0A0A0A] relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6">
              What's <span className="font-semibold text-[#D4AF37]">Next</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
              Your journey to effortless EV charging begins now
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {nextSteps.map((step, i) => (
              <motion.div
                key={i}
                className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 border border-[#D4AF37]/20 
                         hover:border-[#D4AF37]/40 hover:bg-[#2A2A2A]/80 transition-all duration-300 group"
                variants={fadeUpVariants}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-xl 
                                  flex items-center justify-center text-white font-semibold shadow-lg shadow-[#D4AF37]/20">
                      {i + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                    <p className="text-gray-300 leading-relaxed mb-4">{step.desc}</p>
                    
                    <motion.button
                      onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                      className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors 
                               font-medium group-hover:translate-x-1 transition-transform duration-200"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span>Learn more</span>
                      <motion.div
                        animate={{ rotate: activeAccordion === i ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </motion.button>
                    
                    <AnimatePresence>
                      {activeAccordion === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="h-px bg-[#D4AF37]/20 my-4" />
                          <p className="text-gray-300 leading-relaxed">{step.detail}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Support Section */}
      <motion.section
        className="py-20 px-6 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <SubtlePattern />
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-2xl p-8 border border-[#D4AF37]/20">
            <h2 className="text-3xl md:text-4xl font-light mb-6">
              Need <span className="font-semibold text-[#D4AF37]">Help?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-light">
              Our team is here to assist with any questions about your reservation.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a
                href="mailto:support@evolve-charge.com"
                className="flex items-center justify-center gap-3 text-[#D4AF37] hover:text-white 
                         transition-colors duration-300 font-medium group"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>support@evolve-charge.com</span>
              </a>
              <a
                href="tel:+14253244529"
                className="flex items-center justify-center gap-3 text-[#D4AF37] hover:text-white 
                         transition-colors duration-300 font-medium group"
              >
                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>(425) 324-4529</span>
              </a>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <motion.section
        className="py-20 px-6 bg-[#0A0A0A] text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-light mb-6">
            Ready to <span className="font-semibold text-[#D4AF37]">Explore More?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 font-light">
            Learn more about Ampereon and join the future of EV charging.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold rounded-xl 
                       hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300"
            >
              Return to Home
            </Link>
            
            <Link
              href="/product"
              className="px-8 py-4 border border-[#D4AF37]/30 text-white font-semibold rounded-xl 
                       hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-300"
            >
              Learn More About Ampereon
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 mt-10">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              <span>Reservation secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#D4AF37]" />
              <span>Priority access guaranteed</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>100% refundable</span>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default function ReserveSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A0A0A] flex justify-center items-center">
          <motion.div
            className="w-12 h-12 border-2 border-[#D4AF37] rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      }
    >
      <ReserveSuccessContent />
    </Suspense>
  );
}