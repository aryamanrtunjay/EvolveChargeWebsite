'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Wifi, DollarSign, Battery, Clock, ChevronRight } from 'lucide-react';

const AmpereonLanding = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, 20]);
  
  const useCounter = (end, duration = 2000) => {
    const [count, setCount] = useState(0);
    const ref = useRef();
    const inView = useInView(ref, { once: true });
    
    useEffect(() => {
      if (inView) {
        let startTime;
        const animate = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          setCount(Math.floor(progress * end));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, [inView, end, duration]);
    
    return { count, ref };
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const features = [
    { icon: <Zap className="w-8 h-8" />, title: "Hands-Free Connection", desc: "Your charger latches automatically when you park in position." },
    { icon: <Wifi className="w-8 h-8" />, title: "Retrofits Your Charger", desc: "Works with the J1772 or Tesla charger you already installed." },
    { icon: <DollarSign className="w-8 h-8" />, title: "Smart Off-Peak Savings", desc: "Charges only during lowest utility rates to maximize savings." },
    { icon: <Battery className="w-8 h-8" />, title: "Battery-Friendly AI", desc: "Optimizes charge cycles to extend your battery's lifespan." }
  ];

  const steps = [
    { num: "01", title: "Easy DIY Mount", desc: "Mount in 30 min" },
    { num: "02", title: "Pair in the App", desc: "Tap to pair" },
    { num: "03", title: "Auto-Connect Every Park", desc: "Charging starts itself" },
    { num: "04", title: "24/7 Smart Monitoring", desc: "Insights on your phone" }
  ];

  const metrics = [
    { value: 325, prefix: "$", suffix: "", label: "Yearly Savings", how: "Charging off-peak cuts bills by 32%, worth about $325 a year." },
    { value: 3.1, prefix: "", suffix: "", label: "Extra Battery Years", how: "40% less battery degradation adds 3.1 years to your EV's battery life." },
    { value: 6, prefix: "", suffix: "", label: "Hours Saved Per Year", how: "5 minutes saved daily from no-plug convenience equals 6 hours yearly." }
  ];

  const testimonials = [
    { stars: 5, text: "I never touch a plug again—life-changing", author: "Model Y Owner, CA" },
    { stars: 5, text: "Looks as premium as it performs", author: "Taycan Driver, NY" },
    { stars: 5, text: "Finally, smart charging that truly is smart", author: "Leaf Owner, OR" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white text-[#111111] overflow-x-hidden">
      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center bg-white"
        initial="hidden"
        animate="visible"
        variants={fadeUpVariants}
      >
        <div className="absolute inset-0 overflow-hidden">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://demo.evolve-charge.com/productDemo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-white/45 to-white/75" />
        </div>

        <motion.div 
          className="relative z-10 text-center px-6 max-w-4xl mx-auto"
          style={{ y: heroParallax }}
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-medium tracking-tighter mb-6 text-[#111111]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Just Park and <span style={{ color: '#C9A86A', fontWeight: 'bold' }}>Power Up</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-10 text-[#22222] max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Hands-free automatic charging that upgrades the wall unit you already own.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <button className="px-8 py-4 bg-[#C9A86A] text-white font-semibold rounded-full hover:bg-[#B48F55] transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#C9A86A] focus:ring-offset-2 focus:ring-offset-white shadow-lg shadow-[#C9A86A]/20">
              Reserve for $99
            </button>
            <button className="px-8 py-4 border border-[#111111]/8 rounded-full hover:bg-[#F5F6F7] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#C9A86A] focus:ring-offset-2 focus:ring-offset-white">
              <ChevronRight className="w-5 h-5" /> See Ampereon in Action
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="w-6 h-6 text-[#11111]" />
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <motion.section 
        className="py-24 px-6 bg-[#F5F6F7]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="bg-[#F5F6F7] backdrop-blur-sm rounded-2xl p-8 border border-[#111111]/8 hover:border-[#C9A86A]/30 transition-all group shadow-sm hover:shadow-md"
                variants={fadeUpVariants}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-[#C9A86A] mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 tracking-tight text-[#111111]">{feature.title}</h3>
                <p className="text-[#6F6F6F]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Timeline */}
      <motion.section 
        className="py-24 px-6 overflow-x-auto bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight text-[#111111]">
            Your Journey to Effortless Charging
          </h2>
          <div className="flex gap-8 md:grid md:grid-cols-4 md:gap-6 min-w-max md:min-w-0">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="flex-shrink-0 w-64 md:w-auto"
                variants={fadeUpVariants}
                transition={{ delay: i * 0.15 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl font-bold text-[#C9A86A]">{step.num}</span>
                  {i < steps.length - 1 && (
                    <ChevronRight className="hidden md:block w-6 h-6 text-[#6F6F6F]" />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#111111]">{step.title}</h3>
                <p className="text-[#6F6F6F]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Metrics Section */}
      <motion.section 
        className="py-24 px-6 bg-[#F5F6F7]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight text-[#111111]">
            Your Impact, Quantified
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {metrics.map((metric, i) => {
              const { count, ref } = useCounter(metric.value * (metric.value === 3.1 ? 10 : 1), 2000);
              const displayCount = metric.value === 3.1 ? (count / 10).toFixed(1) : count;
              
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  className="bg-[#F5F6F7] backdrop-blur-sm rounded-2xl p-8 border border-[#111111]/8 shadow-sm"
                  variants={fadeUpVariants}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="text-5xl md:text-6xl font-bold mb-2 text-[#C9A86A]">
                    {metric.prefix}{displayCount}{metric.suffix}
                  </div>
                  <div className="text-xl mb-4 text-[#111111]">{metric.label}</div>
                  
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                    className="flex items-center gap-2 text-[#C9A86A] hover:text-[#B48F55] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A86A] focus:ring-offset-2 focus:ring-offset-white rounded px-2 py-1 -ml-2"
                  >
                    How? <ChevronDown className={`w-4 h-4 transition-transform ${activeAccordion === i ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {activeAccordion === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-[#6F6F6F]">{metric.how}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Social Proof */}
      <motion.section 
        className="py-16 px-6 bg-white border-y border-[#111111]/8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-center gap-12">
            <div className="flex gap-8 items-center">
              <div className="text-2xl font-bold text-[#6F6F6F]">Forbes</div>
              <div className="text-2xl font-bold text-[#6F6F6F]">TechCrunch</div>
              <div className="text-2xl font-bold text-[#6F6F6F]">Wired</div>
            </div>
            
            <div className="relative h-24 w-64">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-[#C9A86A] rounded-full" />
                    ))}
                  </div>
                  <p className="text-lg italic text-[#111111]">"{testimonials[currentTestimonial].text}"</p>
                  <p className="text-sm text-[#6F6F6F] mt-1">— {testimonials[currentTestimonial].author}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-24 px-6 bg-[#F5F6F7]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#C9A86A] bg-[#C9A86A]/10 px-4 py-2 rounded-full mb-6">
            <Clock className="w-4 h-4" /> Limited Time Offer
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-[#111111]">
            First 100 Reservations Get Exclusive Benefits
          </h2>
          
          <p className="text-xl mb-8 text-[#6F6F6F] max-w-2xl mx-auto">
            Save 20% on your Ampereon system. Get priority shipping, beta-tester updates, and lifetime perks. Your future of effortless charging starts today.
          </p>
          
          <button className="px-10 py-5 bg-[#C9A86A] text-white font-bold text-lg rounded-full hover:bg-[#B48F55] transition-all transform hover:scale-105 shadow-lg shadow-[#C9A86A]/20 focus:outline-none focus:ring-2 focus:ring-[#C9A86A] focus:ring-offset-2 focus:ring-offset-[#F5F6F7]">
            Reserve for $99
          </button>
          
          <p className="mt-6 text-sm text-[#6F6F6F]">
            Only 23 spots remaining • Or start with $5 deposit
          </p>
        </div>
      </motion.section>

      {/* Risk Reversal Section */}
      <motion.section 
        className="py-16 px-6 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-[#111111]">
            Risk-Free Reservation
          </h2>
          
          <p className="text-lg text-[#6F6F6F] mb-12">
            Your $5 deposit or $99 order is 100% refundable until your Ampereon ships.
          </p>

          <h3 className="text-2xl font-bold mb-8 text-[#111111]">Got questions?</h3>

          <div className="space-y-4 text-left max-w-2xl mx-auto mb-12">
            <details className="border border-[#111111]/8 rounded-lg p-4 hover:bg-[#F5F6F7] transition-colors">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-[#111111]">
                Will it work with my charger?
                <ChevronDown className="w-5 h-5 text-[#6F6F6F]" />
              </summary>
              <p className="mt-3 text-[#6F6F6F]">
                Yes, Ampereon works with all J1772 chargers and Tesla Wall Connectors. If you can charge your EV today, Ampereon will upgrade it to hands-free.
              </p>
            </details>

            <details className="border border-[#111111]/8 rounded-lg p-4 hover:bg-[#F5F6F7] transition-colors">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-[#111111]">
                How do I install it?
                <ChevronDown className="w-5 h-5 text-[#6F6F6F]" />
              </summary>
              <p className="mt-3 text-[#6F6F6F]">
                Mount the device in 30 minutes with basic tools—no electrician needed. Our app guides you through every step with clear video instructions.
              </p>
            </details>

            <details className="border border-[#111111]/8 rounded-lg p-4 hover:bg-[#F5F6F7] transition-colors">
              <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-[#111111]">
                When will it ship?
                <ChevronDown className="w-5 h-5 text-[#6F6F6F]" />
              </summary>
              <p className="mt-3 text-[#6F6F6F]">
                First batch ships Spring 2025 to early reservers. Reserve now to lock in your spot and our founder's edition pricing.
              </p>
            </details>
          </div>

          <button className="px-10 py-5 bg-[#C9A86A] text-white font-bold text-lg rounded-full hover:bg-[#B48F55] transition-all transform hover:scale-105 shadow-lg shadow-[#C9A86A]/20 focus:outline-none focus:ring-2 focus:ring-[#C9A86A] focus:ring-offset-2 focus:ring-offset-white">
            Reserve for $99
          </button>
        </div>
      </motion.section>
    </div>
  );
};

export default AmpereonLanding;