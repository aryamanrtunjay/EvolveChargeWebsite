'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Wifi, DollarSign, Battery, Clock, ChevronRight, ArrowRight, Star, Users, Heart, Globe, Shield } from 'lucide-react';
import OrderChoiceModal from '@/components/OrderChoiceModal';
import Link from "next/link";
import db from "../firebaseConfig.js"
import { getFirestore, collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';

// Modern tech pattern overlay
const TechPattern = ({ opacity = 0.05 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <svg width="100%" height="100%" className="text-[#D4AF37]">
      <defs>
        <pattern id="techGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="1.5" fill="currentColor" />
          <circle cx="0" cy="0" r="1" fill="currentColor" />
          <circle cx="60" cy="60" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#techGrid)" />
    </svg>
  </div>
);

const AmpereonLanding = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [donorsWithAmounts, setDonorsWithAmounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [donorFilter, setDonorFilter] = useState('recent');
  const [totalAmount, setTotalAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, 20]);
  
  const heroRef = useRef(null);
  const videoOpacity = useTransform(
    scrollY,
    [0, () => heroRef.current?.offsetHeight || 800],
    [1, 0]
  );

  const [activeStep, setActiveStep] = useState(0);

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
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  const features = [
    { icon: <Zap className="w-8 h-8" />, title: "Hands-Free Connection", desc: "Your charger latches automatically when you park in position." },
    { icon: <Wifi className="w-8 h-8" />, title: "Retrofits Your Charger", desc: "Works with the J1772 or Tesla charger you already installed." },
    { icon: <DollarSign className="w-8 h-8" />, title: "Smart Off-Peak Savings", desc: "Charges only during lowest utility rates to maximize savings." },
    { icon: <Battery className="w-8 h-8" />, title: "Battery-Friendly AI", desc: "Optimizes charge cycles to extend your battery's lifespan." }
  ];

  const steps = [
    { 
      num: "01", 
      title: "Easy DIY Mount", 
      desc: "Mount in 30 min", 
      icon: Zap,
      detail: "No electrician needed - uses your existing charger"
    },
    { 
      num: "02", 
      title: "Pair in the App", 
      desc: "Tap to pair", 
      icon: Wifi,
      detail: "One-time setup with guided walkthrough"
    },
    { 
      num: "03", 
      title: "Auto-Connect Every Park", 
      desc: "Charging starts itself", 
      icon: Battery,
      detail: "AI learns your schedule for optimal timing"
    },
    { 
      num: "04", 
      title: "24/7 Smart Monitoring", 
      desc: "Insights on your phone", 
      icon: Clock,
      detail: "Real-time energy usage and savings tracking"
    }
  ];

  const stepContent = [
    {
      title: "Quick Installation",
      icon: Zap,
      description: "Most installations take under 30 minutes. Our mounting system works with any J1772 or Tesla wall charger.",
      stats: [
        { value: "30min", label: "Average install time" },
        { value: "100%", label: "Compatible units" }
      ],
      features: [
        "No electrical work required",
        "Works with existing charger",
        "Includes all mounting hardware",
        "Video installation guide"
      ]
    },
    {
      title: "Smart Connection",
      icon: Wifi,
      description: "Connect Ampereon to your home WiFi and pair with your vehicle in minutes using our intuitive mobile app.",
      stats: [
        { value: "2min", label: "Setup time" },
        { value: "All", label: "EV models" }
      ],
      features: [
        "Guided app walkthrough",
        "Automatic vehicle detection",
        "Secure encrypted connection",
        "Offline backup mode"
      ]
    },
    {
      title: "Intelligent Automation",
      icon: Battery,
      description: "Ampereon's AI learns your daily routine and optimizes charging to save money while ensuring your car is ready when you need it.",
      stats: [
        { value: "32%", label: "Average savings" },
        { value: "24/7", label: "Monitoring" }
      ],
      features: [
        "Learns driving patterns",
        "Off-peak rate optimization",
        "Weather-aware charging",
        "Schedule customization"
      ]
    },
    {
      title: "Complete Insights",
      icon: Clock,
      description: "Track your energy usage, savings, and environmental impact with detailed analytics and real-time monitoring.",
      stats: [
        { value: "$325", label: "Yearly savings" },
        { value: "Live", label: "Updates" }
      ],
      features: [
        "Energy usage tracking",
        "Cost savings analysis",
        "Carbon footprint reduction",
        "Monthly reports"
      ]
    }
  ];

  // Auto-advance timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [steps.length]);

  const metrics = [
    { value: 325, prefix: "$", suffix: "", label: "Yearly Savings", how: "Charging off-peak cuts bills by 32%, worth about $325 a year.", icon: <DollarSign className="w-6 h-6" /> },
    { value: 3.1, prefix: "", suffix: "", label: "Extra Battery Years", how: "40% less battery degradation adds 3.1 years to your EV's battery life.", icon: <Battery className="w-6 h-6" /> },
    { value: 6, prefix: "", suffix: "", label: "Hours Saved Per Year", how: "5 minutes saved daily from no-plug convenience equals 6 hours yearly.", icon: <Clock className="w-6 h-6" /> }
  ];

  const testimonials = [
    { stars: 5, text: "Can't wait for this to launch - charging will finally be effortless", author: "Early Supporter, Seattle" },
    { stars: 5, text: "This is exactly what the EV market has been missing", author: "Tesla Owner, Portland" },
    { stars: 5, text: "Smart automation done right - excited to be part of the beta", author: "EV Enthusiast, SF" }
  ];

  // Load donor data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [ordersSnapshot, donationsSnapshot] = await Promise.all([
          getDocs(collection(db, "orders")),
          getDocs(collection(db, "donations"))
        ]);

        let preOrderSum = 0;
        ordersSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.paymentStatus === "Completed" && data.total) {
            preOrderSum += data.total;
          }
        });

        let donationSum = 0;
        donationsSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.status === "Completed" && data.amount) {
            donationSum += data.amount;
          }
        });

        setTotalAmount(preOrderSum + donationSum);

        const donorsRef = collection(db, 'donors');
        let donorsQuery;

        switch (donorFilter) {
          case 'recent':
            donorsQuery = query(donorsRef, orderBy('createdAt', 'desc'), limit(50));
            break;
          case 'top-day':
            const dayAgo = new Date();
            dayAgo.setDate(dayAgo.getDate() - 1);
            donorsQuery = query(donorsRef, where('createdAt', '>=', dayAgo), orderBy('createdAt', 'desc'));
            break;
          case 'top-month':
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            donorsQuery = query(donorsRef, where('createdAt', '>=', monthAgo), orderBy('createdAt', 'desc'));
            break;
          default:
            donorsQuery = query(donorsRef, orderBy('createdAt', 'desc'), limit(50));
        }

        const donorsSnapshot = await getDocs(donorsQuery);
        const donorsMap = new Map();
        donorsSnapshot.docs.forEach(doc => {
          donorsMap.set(doc.id, { id: doc.id, ...doc.data() });
        });

        const donorAmounts = new Map();
        donationsSnapshot.docs.forEach(doc => {
          const donation = doc.data();
          const donorId = donation.donorId;
          const amount = donation.amount || 0;
          donorAmounts.set(donorId, (donorAmounts.get(donorId) || 0) + amount);
        });

        const donorsWithAmountsArray = Array.from(donorsMap.values())
          .map(donor => ({ ...donor, amount: donorAmounts.get(donor.id) || 0 }))
          .filter(donor => donor.amount > 0);

        if (donorFilter.startsWith('top-')) {
          donorsWithAmountsArray.sort((a, b) => b.amount - a.amount);
        }

        setDonorsWithAmounts(donorsWithAmountsArray);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [donorFilter]);

  return (
    <div className="bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* Hero Section - Enhanced glassmorphism with floating elements */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        ref={heroRef}
      >
        {/* Advanced video background with geometric overlay */}
        <motion.div className="absolute inset-0 z-0 pointer-events-none">
          <video
            autoPlay muted loop playsInline controls={false} preload="auto"
            className="w-full h-full object-cover"
            title="How Ampereon Works"
            poster="https://demo.ampereonenergy.com/poster.png"
          >
            <source src="https://demo.ampereonenergy.com/productDemo.mp4#t=1" type="video/mp4" />
          </video>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40" />

        {/* Hero content with advanced glassmorphism */}
        <motion.div
          className="relative z-10 px-6"
          style={{ y: heroParallax }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="backdrop-blur-md bg-black/40 border border-white/10 rounded-[2.5rem] p-16 max-w-5xl mx-auto 
                        shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden">
            
            {/* Subtle animated background pattern */}
            <div className="absolute inset-0 opacity-3">
              <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20" />
            </div>
            
            <div className="relative z-10">
              {/* <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="inline-flex items-center gap-3 text-sm font-semibold text-[#D4AF37] 
                         bg-gradient-to-r from-[#D4AF37]/15 to-[#B8860B]/10 backdrop-blur-sm 
                         px-8 py-4 rounded-full mb-8 border border-[#D4AF37]/20"
              >
                <Globe className="w-4 h-4" />
                <span className="tracking-wide">The Future of EV Charging</span>
              </motion.div> */}

              <h1 className="font-light tracking-tighter leading-[0.95] mb-8 text-center text-white"
                  style={{ fontSize: 'clamp(3.5rem,8vw,6rem)' }}>
                The Charger of{' '}
                <span className="font-bold bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
                  Tomorrow
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-gray-300 mb-12 text-center max-w-4xl mx-auto font-light leading-relaxed">
                A smart, fully automatic home Electric Vehicle charger that works on top of the charging unit you already own.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  className="group px-12 py-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold rounded-2xl
                            shadow-2xl hover:shadow-[#D4AF37]/30 transition-all duration-300
                            focus:ring-2 focus:ring-[#D4AF37]/40 relative overflow-hidden"
                  onClick={openModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Order now | $5
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  
                  {/* Button shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  />
                </motion.button>

                <Link href="/product">
                  <motion.button
                    className="group px-10 py-6 border-2 border-[#D4AF37]/40 backdrop-blur-sm rounded-2xl text-white font-semibold
                              hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/60 flex items-center gap-3 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                  >
                    <ChevronRight className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    See Ampereon in Action
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <OrderChoiceModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} />

        {/* Modern scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent mb-3" />
          <motion.div
            className="w-8 h-8 border-2 border-[#D4AF37]/50 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.2 }}
          >
            <ChevronDown className="w-4 h-4 text-[#D4AF37]" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid - Dark asymmetric luxury layout with 3D effects */}
      <motion.section 
        className="py-32 px-6 bg-gradient-to-br from-[#1A1A1A] via-[#0F0F0F] to-[#1A1A1A] relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <TechPattern />
        
        {/* Geometric background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rotate-45 translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full -translate-x-48 translate-y-48" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div className="text-center mb-20">
            <motion.div
              className="inline-block text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase mb-6"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "auto", opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Core Features
            </motion.div>
            
            <h2 className="text-6xl md:text-7xl font-extralight mb-8 tracking-tighter text-white">
              Effortless <span className="font-bold text-[#D4AF37] italic">Innovation</span>
            </h2>
            
            <div className="flex justify-center mb-8">
              <motion.div 
                className="h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "8rem" }}
                transition={{ duration: 1.5 }}
              />
            </div>
          </motion.div>

          {/* Simplified feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="group relative"
                variants={fadeUpVariants}
                transition={{ delay: i * 0.15 }}
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] 
                             rounded-3xl border-l-4 border-[#D4AF37] shadow-xl hover:shadow-2xl p-12
                             transition-all duration-500 overflow-hidden relative group">
                  
                  {/* Diagonal accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 
                                bg-gradient-to-bl from-[#D4AF37]/20 to-transparent 
                                rounded-bl-full" />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="inline-flex items-center justify-center w-20 h-20 mb-8
                               bg-gradient-to-br from-[#D4AF37] to-[#B8860B] 
                               rounded-tr-2xl rounded-bl-2xl
                               shadow-lg text-white"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {feature.icon}
                    </motion.div>
                    
                    <h3 className="text-3xl font-bold mb-6 tracking-tight text-white">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-xl font-light">{feature.desc}</p>
                    
                    {/* Modern accent element */}
                    <div className="mt-8 w-20 h-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-r-full" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Timeline - Enhanced futuristic split-screen design */}
      <motion.section 
        className="py-32 px-6 bg-[#0F0F0F] text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        {/* Futuristic grid background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#0F0F0F] to-[#0A0A0A]" />
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="futuristicGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#D4AF37" strokeWidth="0.5"/>
                  <circle cx="0" cy="0" r="2" fill="#D4AF37" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#futuristicGrid)" />
            </svg>
          </div>
        </div>

        {/* Animated orbs */}
        <motion.div 
          className="absolute top-20 right-20 w-64 h-64 bg-[#D4AF37]/15 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 left-20 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div className="text-center mb-20">
            <motion.div
              className="inline-block text-[#D4AF37] text-sm font-medium tracking-[0.2em] uppercase mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: "auto" }}
              transition={{ duration: 1 }}
            >
              Your Journey
            </motion.div>
            
            <h2 className="text-6xl md:text-8xl font-extralight mb-8 tracking-tighter text-white">
              Your Journey to <span className="font-bold text-[#D4AF37] italic">Effortless</span> Charging
            </h2>
            
            <div className="flex justify-center mb-8">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            </div>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
              From installation to daily use, Ampereon transforms your charging experience in four simple steps
            </p>
          </motion.div>

          {/* Split screen layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch min-h-[800px]">
            {/* Left: Interactive timeline */}
            <div className="space-y-6">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = activeStep === index;
                
                return (
                  <motion.div 
                    key={index}
                    className={`relative cursor-pointer transition-all duration-700 ${
                      isActive ? 'scale-105' : 'hover:scale-102'
                    }`}
                    onMouseEnter={() => setActiveStep(index)}
                    onClick={() => setActiveStep(index)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{
                      hidden: { opacity: 0, x: -30 },
                      visible: { 
                        opacity: 1, 
                        x: 0,
                        transition: { delay: index * 0.2, duration: 0.6 }
                      }
                    }}
                  >
                    <div className={`relative p-8 rounded-2xl border transition-all duration-500
                                   ${isActive 
                                     ? 'bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/15 border-[#D4AF37]/40 shadow-2xl shadow-[#D4AF37]/20' 
                                     : 'bg-[#1A1A1A]/80 border-white/10 hover:border-[#D4AF37]/20 backdrop-blur-sm'
                                   }`}>
                      
                      <div className="flex items-center gap-6">
                        <div className={`relative flex items-center justify-center w-16 h-16 rounded-xl
                                       transition-all duration-500 ${
                                         isActive 
                                           ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] shadow-lg shadow-[#D4AF37]/30' 
                                           : 'bg-[#2A2A2A] border border-[#D4AF37]/20'
                                       }`}>
                          {(() => {
                            const IconComponent = step.icon;
                            return <IconComponent className={`w-8 h-8 ${isActive ? 'text-white' : 'text-[#D4AF37]'}`} />;
                          })()}
                        </div>
                        
                        <div className="flex-1">
                          <h3 className={`text-2xl font-semibold mb-2 transition-colors duration-300 ${
                            isActive ? 'text-white' : 'text-gray-300'
                          }`}>
                            {step.title}
                          </h3>
                          <div className="text-[#D4AF37] font-medium text-sm tracking-wider">
                            STEP {step.num}
                          </div>
                          <p className="text-gray-400 text-sm mt-2">{step.desc}</p>
                        </div>

                        <div className={`w-2 h-16 rounded-full transition-all duration-500 ${
                          isActive 
                            ? 'bg-gradient-to-b from-[#D4AF37] to-[#B8860B] shadow-lg shadow-[#D4AF37]/50' 
                            : 'bg-gray-600'
                        }`} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right: Content display */}
            <div className="relative">
              <div className="sticky top-8">
                <div className="relative bg-gradient-to-br from-[#1A1A1A]/90 to-[#0F0F0F]/80 backdrop-blur-xl 
                              border border-[#D4AF37]/20 rounded-3xl p-12 min-h-[600px] 
                              shadow-2xl overflow-hidden">
                  
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/30 to-[#B8860B]/30" />
                  </div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -30, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                        className="space-y-8"
                      >
                        {/* Header */}
                        <div className="flex items-center gap-4">
                          <motion.div 
                            className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] 
                                      rounded-2xl flex items-center justify-center shadow-xl"
                            whileHover={{ rotate: 5, scale: 1.05 }}
                          >
                            {(() => {
                              const IconComponent = stepContent[activeStep].icon;
                              return <IconComponent className="w-10 h-10 text-white" />;
                            })()}
                          </motion.div>
                          <h3 className="text-4xl font-bold text-white tracking-tight">
                            {stepContent[activeStep].title}
                          </h3>
                        </div>

                        <p className="text-xl leading-relaxed text-gray-300 font-light">
                          {stepContent[activeStep].description}
                        </p>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 gap-4">
                          {stepContent[activeStep].stats.map((stat, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.1 + 0.3 }}
                              className="bg-[#2A2A2A]/80 rounded-xl p-4 border border-[#D4AF37]/20 backdrop-blur-sm"
                            >
                              <div className="text-2xl font-bold text-[#D4AF37] mb-1">{stat.value}</div>
                              <div className="text-sm text-gray-300">{stat.label}</div>
                            </motion.div>
                          ))}
                        </div>
                        
                        {/* Features list */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-white mb-3">Key Features:</h4>
                          {stepContent[activeStep].features.map((feature, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 + 0.4 }}
                              className="flex items-center gap-3"
                            >
                              <div className="w-2 h-2 bg-[#D4AF37] rounded-full flex-shrink-0" />
                              <span className="text-gray-300">{feature}</span>
                            </motion.div>
                          ))}
                        </div>

                        {/* Progress indicator */}
                        <div className="flex items-center gap-4 pt-6">
                          <div className="px-6 py-3 bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/20 
                                        text-[#D4AF37] font-bold rounded-full border border-[#D4AF37]/30
                                        backdrop-blur-sm text-sm tracking-wider">
                            STEP {steps[activeStep].num}
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-r from-[#D4AF37]/30 to-transparent" />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern progress indicator */}
          <div className="flex justify-center mt-20">
            <div className="flex gap-4">
              {steps.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`relative h-3 rounded-full transition-all duration-500 overflow-hidden ${
                    activeStep === index ? 'w-16' : 'w-3 hover:w-6'
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className={`h-full transition-all duration-500 ${
                    activeStep === index 
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B]' 
                      : 'bg-gray-500 hover:bg-[#D4AF37]/50'
                  }`} />
                </motion.button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div 
            className="text-center mt-20"
            variants={fadeUpVariants}
            transition={{ delay: 1.1 }}
          >
            <motion.button 
              onClick={openModal}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 text-sm font-medium text-[#D4AF37] bg-[#D4AF37]/15 px-8 py-4 rounded-full mb-6 
                       border border-[#D4AF37]/30 backdrop-blur-sm hover:bg-[#D4AF37]/20 transition-all duration-300"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Ready to get started?</span>
            </motion.button>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Join thousands of EV owners who've made the switch to effortless charging with Ampereon
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Metrics Section - Enhanced with modern styling */}
      <motion.section 
        className="py-32 px-6 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#2A2A2A] text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        {/* Advanced background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-[#D4AF37]/10 via-transparent to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-20">
          <motion.div className="text-center mb-20">
            <motion.div
              className="inline-block text-[#D4AF37] text-sm font-medium tracking-[0.2em] uppercase mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: "auto" }}
              transition={{ duration: 1 }}
            >
              Impact Metrics
            </motion.div>
            
            <h2 className="text-6xl md:text-8xl font-extralight mb-8 tracking-tighter text-white relative z-20">
              Your Impact, <span className="font-bold text-[#D4AF37] italic">Quantified</span>
            </h2>
            
            <div className="flex justify-center">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {metrics.map((metric, i) => {
              const { count, ref } = useCounter(metric.value * (metric.value === 3.1 ? 10 : 1), 2000);
              const displayCount = metric.value === 3.1 ? (count / 10).toFixed(1) : count;
              
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  className="relative group"
                  variants={fadeUpVariants}
                  transition={{ delay: i * 0.15 }}
                >
                  <motion.div 
                    className="bg-white/10 backdrop-blur-sm rounded-3xl p-10 border border-white/20 shadow-2xl 
                              hover:border-[#D4AF37]/30 transition-all duration-500 hover:shadow-[#D4AF37]/20 relative z-20"
                    whileHover={{ scale: 1.02, rotateY: 5 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    
                    {/* Enhanced glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                    
                    <div className="relative z-30">
                      <div className="flex items-center justify-between mb-6">
                        <motion.div 
                          className="text-6xl md:text-7xl font-extralight text-[#D4AF37] relative z-30"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                        >
                          {metric.prefix}{displayCount}{metric.suffix}
                        </motion.div>
                        <motion.div 
                          className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-300"
                          whileHover={{ rotate: 15 }}
                        >
                          {metric.icon}
                        </motion.div>
                      </div>
                      
                      <h3 className="text-xl font-medium mb-6 text-white relative z-30">{metric.label}</h3>
                      
                      <motion.button
                        onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                        className="flex items-center gap-3 text-[#D4AF37] hover:text-white transition-colors duration-300 
                                 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 
                                 focus:ring-offset-[#1A1A1A] rounded-lg px-3 py-2 -ml-3 relative z-30"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-sm font-medium tracking-wide">HOW?</span>
                        <motion.div
                          animate={{ rotate: activeAccordion === i ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
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
                            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="h-px bg-gradient-to-r from-[#D4AF37]/30 to-transparent my-6" />
                            <p className="text-[#E0E0E0] leading-relaxed relative z-30">{metric.how}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Community Support - Dark glassmorphism design */}
      <motion.section 
        className="py-32 px-6 bg-gradient-to-br from-[#1A1A1A] via-[#0F0F0F] to-[#1A1A1A] relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <TechPattern />
        
        {/* Geometric background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#D4AF37]/10 rotate-45 -translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full translate-x-48 translate-y-48" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <motion.div className="text-center mb-16">
            <motion.div
              className="inline-block text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase mb-6"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "auto", opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Community
            </motion.div>
            
            <h2 className="text-6xl md:text-7xl font-extralight mb-8 tracking-tighter text-white">
              Our Amazing <span className="font-bold text-[#D4AF37] italic">Community</span>
            </h2>
            
            <div className="flex justify-center mb-8">
              <motion.div 
                className="h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "8rem" }}
                transition={{ duration: 1.5 }}
              />
            </div>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed mb-8">
              Meet the incredible supporters who are helping bring the future of EV charging to life
            </p>
            
            {/* Total support amount with enhanced styling */}
            <motion.div 
              className="inline-flex items-center gap-4 bg-gradient-to-r from-[#1A1A1A]/80 to-[#2A2A2A]/60 
                        backdrop-blur-xl px-10 py-6 rounded-3xl border border-[#D4AF37]/20 shadow-xl"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-8 h-8 text-[#D4AF37]" />
              </motion.div>
              <span className="text-3xl font-extralight text-white">
                <span className="font-bold text-[#D4AF37]">${totalAmount.toLocaleString()}</span> raised by our community
              </span>
            </motion.div>
          </motion.div>

          {/* Filter buttons with modern styling */}
          <motion.div 
            className="flex justify-center mb-12"
            variants={fadeUpVariants}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-[#1A1A1A]/80 backdrop-blur-xl rounded-3xl p-3 border border-[#D4AF37]/20 shadow-xl">
              <div className="flex gap-3">
                {[
                  { label: 'Recent', value: 'recent' },
                  { label: 'Top Month', value: 'top-month' },
                  { label: 'All Time', value: 'top-all' },
                ].map(({ label, value }) => (
                  <motion.button
                    key={value}
                    onClick={() => setDonorFilter(value)}
                    className={`px-8 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                      donorFilter === value
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white shadow-lg shadow-[#D4AF37]/25'
                        : 'text-gray-400 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Supporters list with enhanced styling */}
          <motion.div 
            className="bg-gradient-to-br from-[#1A1A1A]/90 to-[#2A2A2A]/70 backdrop-blur-xl rounded-3xl p-12 
                     border border-[#D4AF37]/20 shadow-2xl relative overflow-hidden"
            variants={fadeUpVariants}
            transition={{ delay: 0.3 }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/30 to-[#B8860B]/30" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-12">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-2xl 
                           flex items-center justify-center shadow-xl"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-3xl font-bold text-white tracking-tight">Our Supporters</h3>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <motion.div
                    className="w-12 h-12 border-4 border-[#D4AF37] rounded-full border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-gray-400 font-light ml-6 text-lg">Loading our awesome supporters...</p>
                </div>
              ) : donorsWithAmounts.length === 0 ? (
                <div className="text-center py-20">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="w-20 h-20 text-[#D4AF37]/50 mx-auto mb-8" />
                  </motion.div>
                  <h4 className="text-2xl font-medium text-white mb-4">Be the First to Support</h4>
                  <p className="text-gray-400 font-light max-w-md mx-auto text-lg">
                    Join our mission to revolutionize EV charging. Be among the first supporters of this groundbreaking technology.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {donorsWithAmounts.slice(0, 12).map((donor, index) => (
                    <motion.div
                      key={donor.id}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-[#2A2A2A]/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-[#2A2A2A]/90 transition-all duration-300 
                               border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 hover:shadow-lg group"
                      whileHover={{ y: -4, scale: 1.02 }}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div 
                          className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/30 to-[#B8860B]/30 rounded-full 
                                    flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
                          whileHover={{ rotate: 15 }}
                        >
                          <span className="text-[#D4AF37] font-medium text-lg">
                            {donor.anonymous ? '?' : (donor.firstName?.[0] || '?')}
                          </span>
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate mb-1 tracking-wide">
                            {donor.anonymous ? 'Anonymous Supporter' : `${donor.firstName || ''} ${donor.lastName || ''}`.trim()}
                          </p>
                          <p className="text-[#D4AF37] font-semibold text-sm mb-2">
                            ${donor.amount?.toFixed(2) || '0.00'}
                          </p>
                          {donor.dedicateTo && (
                            <p className="text-gray-400 italic text-sm truncate mb-2">
                              In honor of: {donor.dedicateTo}
                            </p>
                          )}
                          <p className="text-gray-500 text-xs font-light">
                            {donor.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }) || 'Recently'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Show more supporters indicator */}
              {donorsWithAmounts.length > 12 && (
                <div className="text-center mt-12">
                  <p className="text-gray-400 font-light text-lg">
                    And <span className="font-bold text-[#D4AF37]">{donorsWithAmounts.length - 12} more</span> amazing supporters!
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Call to action */}
          <motion.div 
            className="text-center mt-16"
            variants={fadeUpVariants}
            transition={{ delay: 0.5 }}
          >
            <motion.button 
              onClick={openModal}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 text-sm font-medium text-[#D4AF37] bg-[#D4AF37]/10 
                       px-8 py-4 rounded-full mb-6 border border-[#D4AF37]/30 backdrop-blur-sm 
                       hover:bg-[#D4AF37]/20 transition-all duration-300"
            >
              <Heart className="w-4 h-4" />
              <span>Join our community</span>
            </motion.button>
            <p className="text-gray-400 max-w-2xl mx-auto font-light leading-relaxed text-lg">
              Every supporter brings us closer to revolutionizing EV charging. Join this incredible community of forward-thinking individuals.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section - Enhanced futuristic design */}
      <motion.section 
        className="py-32 px-6 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#2A2A2A] text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        {/* Advanced background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-[#D4AF37]/15 via-transparent to-transparent" />
          <div className="absolute inset-0">
            <motion.div
              className="w-full h-full opacity-10"
              style={{
                backgroundImage: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, #D4AF37 90deg, transparent 180deg, #B8860B 270deg, transparent 360deg)`
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
        
        {/* Static geometric shapes */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl opacity-30" />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            className="inline-flex items-center gap-3 text-sm font-semibold text-[#D4AF37] 
                       bg-gradient-to-r from-[#D4AF37]/15 to-[#B8860B]/10 backdrop-blur-sm 
                       px-8 py-4 rounded-full mb-8 border border-[#D4AF37]/30"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Clock className="w-4 h-4" />
            <span className="tracking-wide text-[#D4AF37]">LIMITED TIME OFFER</span>
          </motion.div>
          
          <motion.h2 
            className="text-6xl md:text-8xl font-extralight mb-8 tracking-tighter text-white leading-tight relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            First 100 Reservations Get{' '}
            <span className="font-bold text-[#D4AF37] italic">Exclusive Benefits</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl mb-12 text-gray-300 max-w-5xl mx-auto font-light leading-relaxed relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Save 20% on your Ampereon system. Get priority shipping, beta-tester updates, and lifetime perks. 
            Your future of effortless charging starts today.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-8 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Link href="/order">
              <motion.button 
                className="group relative px-12 py-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-bold text-xl rounded-2xl 
                           shadow-2xl hover:shadow-[#D4AF37]/40 transition-all duration-300
                           focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]
                           overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Order for $99</span>
                
                {/* Animated background shine */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
              </motion.button>
            </Link>
            
            <div className="flex items-center gap-4 text-gray-400">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-600" />
              <span className="text-sm font-light">or</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-600" />
            </div>

            <Link href="/reserve">
              <motion.button 
                className="px-10 py-5 bg-white/5 backdrop-blur-sm border-2 border-[#D4AF37]/30 text-white font-semibold text-lg rounded-2xl 
                           hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-300
                           focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
                whileHover={{ scale: 1.02 }}
              >
                Reserve for $5
              </motion.button>
            </Link>
          </motion.div>
          
          <motion.p 
            className="mt-12 text-sm text-gray-500 font-medium tracking-wide relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Only 23 spots remaining
          </motion.p>
        </div>
      </motion.section>
    </div>
  );
};

export default AmpereonLanding;