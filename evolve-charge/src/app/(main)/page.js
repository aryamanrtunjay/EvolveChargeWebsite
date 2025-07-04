'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Wifi, DollarSign, Battery, Clock, ChevronRight, ArrowRight, Star } from 'lucide-react';
import OrderChoiceModal from '@/components/OrderChoiceModal';
import Link from "next/link";

const AmpereonLanding = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, 20]);
  
  const heroRef = useRef(null);
  const videoOpacity = useTransform(
    scrollY,
    [0, () => heroRef.current?.offsetHeight || 800],
    [1, 0]
  );

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

  const openModal = () => {
    setIsModalOpen(true);
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
    { num: "01", title: "Easy DIY Mount", desc: "Mount in 30 min", icon: <Zap className="w-6 h-6" /> },
    { num: "02", title: "Pair in the App", desc: "Tap to pair", icon: <Wifi className="w-6 h-6" /> },
    { num: "03", title: "Auto-Connect Every Park", desc: "Charging starts itself", icon: <Battery className="w-6 h-6" /> },
    { num: "04", title: "24/7 Smart Monitoring", desc: "Insights on your phone", icon: <Clock className="w-6 h-6" /> }
  ];

  const metrics = [
    { value: 325, prefix: "$", suffix: "", label: "Yearly Savings", how: "Charging off-peak cuts bills by 32%, worth about $325 a year.", icon: <DollarSign className="w-6 h-6" /> },
    { value: 3.1, prefix: "", suffix: "", label: "Extra Battery Years", how: "40% less battery degradation adds 3.1 years to your EV's battery life.", icon: <Battery className="w-6 h-6" /> },
    { value: 6, prefix: "", suffix: "", label: "Hours Saved Per Year", how: "5 minutes saved daily from no-plug convenience equals 6 hours yearly.", icon: <Clock className="w-6 h-6" /> }
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
      <section
        className="relative min-h-screen flex items-center justify-center"
      >
        {/* fixed BG video that fades out after hero */}
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <video
            autoPlay muted loop playsInline controls={false} preload="auto"
            className="w-full h-full object-cover"
            title="How Ampereon Works"
            poster="https://demo.ampereonenergy.com/poster.png"
          >
            <source src="https://demo.ampereonenergy.com/productDemo.mp4#t=1" type="video/mp4" />
          </video>
        </motion.div>

        {/* contrast overlays */}
        <div className="absolute inset-0 bg-black/35 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F5F6F7]" />

        {/* hero */}
        <motion.div
          className="relative z-10 px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .8 }}
        >
          <div className="backdrop-blur-sm bg-white/70 border border-black/5 rounded-2xl p-10 max-w-3xl mx-auto shadow-xl">
            <h1
              className="font-bold tracking-tight leading-tight mb-4 text-center text-[#111]"
              style={{ fontSize: 'clamp(2.75rem,6vw,4.5rem)' }}
            >
              The Charger of <span className="text-[#C9A86A]">Tomorrow</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#333] mb-8 text-center max-w-2xl mx-auto">
              A smart, fully automatic home Electric Vehicle charger that works on top of the charging unit you already own.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-8 py-4 bg-[#C9A86A] text-white font-semibold rounded-full
                          hover:brightness-110 transition transform hover:scale-105
                          focus:ring-2 focus:ring-[#C9A86A]/40 shadow-lg shadow-[#C9A86A]/30"
                onClick={openModal}
              >
                Order now | $5
              </button>

              <Link href="/product">
                <button
                  className="pl-6 pr-8 py-4 border border-black/15 rounded-full text-black/70
                            hover:bg-white/40 flex items-center gap-2"
                >
                <ChevronRight className="w-5 h-5" /> See Ampereon in Action
              </button>
            </Link>
            </div>
          </div>
        </motion.div>

        <OrderChoiceModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} />

        {/* scroll cue */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <ChevronDown className="w-5 h-5 text-[#111111] drop-shadow" />
        </motion.div>
      </section>

      {/* Features Grid */}
      <motion.section 
        className="py-24 px-6 z-10 bg-[#F5F6F7]"
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
                whileHover={{ y: -5, scale: 1.02 }}
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
          <div className="flex gap-8 md:grid md:grid-cols-4 md:gap-6 min-w-max md:min-w-0 relative">
            {/* Horizontal line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#C9A86A]/30 transform -translate-y-1/2" />
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="flex-shrink-0 w-64 md:w-auto relative"
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
                <div className="mt-4 text-[#C9A86A]">{step.icon}</div>
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
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-5xl md:text-6xl font-bold text-[#C9A86A]">{metric.prefix}{displayCount}{metric.suffix}</div>
                    <div className="ml-4 text-[#C9A86A]">{metric.icon}</div>
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
                  transition={{千: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#C9A86A]" />
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
            Order for $99
          </button>
          
          <p className="mt-6 text-sm text-[#6F6F6F]">
            Only 23 spots remaining • Or start with $5 deposit
          </p>
        </div>
      </motion.section>

      {/* Risk Reversal Section */}
      {/* <motion.section 
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
        </div>
      </motion.section> */}

      {/* Final CTA Section */}
      {/* <motion.section 
        className="py-16 px-6 bg-[#F5F6F7] text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-[#111111]">
            Ready to Upgrade Your Charging Experience?
          </h2>
          <p className="text-lg text-[#6F6F6F] mb-8">
            Join the future of EV charging with Ampereon.
          </p>
          <button
            className="px-8 py-4 bg-[#C9A86A] text-white font-semibold rounded-full
                      hover:brightness-110 transition transform hover:scale-105
                      focus:ring-2 focus:ring-[#C9A86A]/40 shadow-lg shadow-[#C9A86A]/30"
            onClick={openModal}
          >
            Order Now
          </button>
        </div>
      </motion.section> */}
    </div>
  );
};

export default AmpereonLanding;