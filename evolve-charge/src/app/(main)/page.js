'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Wifi, DollarSign, Battery, Clock, ChevronRight, ArrowRight, Star, Users, Heart } from 'lucide-react';
import OrderChoiceModal from '@/components/OrderChoiceModal';
import Link from "next/link";
import { getFirestore, collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';

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
      icon: <Zap className="w-6 h-6" />,
      detail: "No electrician needed - uses your existing charger"
    },
    { 
      num: "02", 
      title: "Pair in the App", 
      desc: "Tap to pair", 
      icon: <Wifi className="w-6 h-6" />,
      detail: "One-time setup with guided walkthrough"
    },
    { 
      num: "03", 
      title: "Auto-Connect Every Park", 
      desc: "Charging starts itself", 
      icon: <Battery className="w-6 h-6" />,
      detail: "AI learns your schedule for optimal timing"
    },
    { 
      num: "04", 
      title: "24/7 Smart Monitoring", 
      desc: "Insights on your phone", 
      icon: <Clock className="w-6 h-6" />,
      detail: "Real-time energy usage and savings tracking"
    }
  ];

  const stepContent = [
    {
      title: "Quick Installation",
      icon: <Zap className="w-6 h-6" />,
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
      icon: <Wifi className="w-6 h-6" />,
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
      icon: <Battery className="w-6 h-6" />,
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
      icon: <Clock className="w-6 h-6" />,
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
    }, 5000); // Advance every 5 seconds
    
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
        const db = getFirestore();
        
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
    <div className="bg-[#FAFAFA] text-[#1A1A1A] overflow-x-hidden">
      {/* Hero Section - Cinematic with subtle luxury */}
      <section
        className="relative min-h-screen flex items-center justify-center"
        ref={heroRef}
      >
        {/* Sophisticated video background */}
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

        {/* Refined overlays */}
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-[#FAFAFA]/90" />

        {/* Hero content with glass morphism */}
        <motion.div
          className="relative z-10 px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="backdrop-blur-md bg-white/80 border border-white/20 rounded-3xl p-12 max-w-4xl mx-auto shadow-2xl shadow-black/10">
            <h1
              className="font-light tracking-tight leading-[1.1] mb-6 text-center text-[#1A1A1A]"
              style={{ fontSize: 'clamp(3rem,7vw,5rem)' }}
            >
              The Charger of <span className="font-medium text-[#D4AF37] bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">Tomorrow</span>
            </h1>

            <p className="text-xl sm:text-2xl text-[#4A4A4A] mb-10 text-center max-w-3xl mx-auto font-light leading-relaxed">
              A smart, fully automatic home Electric Vehicle charger that works on top of the charging unit you already own.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                className="px-10 py-5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium rounded-full
                          hover:shadow-2xl hover:shadow-[#D4AF37]/30 transition-all duration-300 transform hover:scale-105
                          focus:ring-2 focus:ring-[#D4AF37]/40 shadow-xl"
                onClick={openModal}
              >
                Order now | $5
              </button>

              <Link href="/product">
                <button
                  className="pl-8 pr-10 py-5 border border-white/30 backdrop-blur-sm rounded-full text-[#1A1A1A] font-medium
                            hover:bg-white/50 hover:border-white/50 flex items-center gap-3 transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" /> See Ampereon in Action
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        <OrderChoiceModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} />

        {/* Elegant scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-[#D4AF37] mb-2" />
          <ChevronDown className="w-6 h-6 text-[#D4AF37]" />
        </motion.div>
      </section>

      {/* Features Grid - Asymmetric luxury layout */}
      <motion.section 
        className="py-32 px-6 bg-white relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.01]" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1A1A1A 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="max-w-7xl mx-auto relative">
          <motion.div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight text-[#1A1A1A]">
              Effortless <span className="font-medium text-[#D4AF37]">Innovation</span>
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className={`group relative ${i % 2 === 0 ? 'lg:mt-8' : 'lg:mb-8'}`}
                variants={fadeUpVariants}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8 }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 border border-[#1A1A1A]/5 
                              hover:border-[#D4AF37]/20 transition-all duration-500 shadow-lg hover:shadow-2xl
                              hover:shadow-[#D4AF37]/10 relative overflow-hidden">
                  
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="text-[#D4AF37] mb-6 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-medium mb-4 tracking-tight text-[#1A1A1A]">{feature.title}</h3>
                    <p className="text-[#6A6A6A] leading-relaxed text-lg">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Timeline - Enhanced design with more content */}
      <motion.section 
        className="py-32 px-6 bg-gradient-to-br from-[#F8F8F8] to-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        {/* Enhanced decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-[#D4AF37]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#D4AF37]/3 to-transparent rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight text-[#1A1A1A]">
              Your Journey to <span className="font-medium text-[#D4AF37]">Effortless</span> Charging
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-4" />
            <p className="text-xl text-[#6A6A6A] max-w-3xl mx-auto font-light leading-relaxed">
              From installation to daily use, Ampereon transforms your charging experience in four simple steps
            </p>
          </motion.div>

          <div className="space-y-16">
            {/* Horizontal Timeline */}
            <div className="relative">
              {/* Horizontal timeline line */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-[#D4AF37] via-[#D4AF37]/50 to-[#D4AF37] transform -translate-y-1/2" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    className="relative cursor-pointer group"
                    variants={fadeUpVariants}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setActiveStep(i)}
                  >
                    {/* Timeline dot */}
                    <div className="flex justify-center mb-6">
                      <div className={`w-8 h-8 rounded-full border-4 border-white shadow-lg transition-all duration-300 ${
                        activeStep === i 
                          ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] shadow-[#D4AF37]/30 scale-125' 
                          : 'bg-[#D4AF37]/30 shadow-[#D4AF37]/10 hover:bg-[#D4AF37]/50 hover:scale-110'
                      }`} />
                    </div>
                    
                    {/* Step card */}
                    <div className={`backdrop-blur-sm rounded-2xl p-6 border shadow-lg transition-all duration-300 ${
                      activeStep === i
                        ? 'bg-white/95 border-[#D4AF37]/30 shadow-xl scale-105 shadow-[#D4AF37]/10'
                        : 'bg-white/80 border-[#1A1A1A]/5 hover:bg-white/90 hover:shadow-xl hover:scale-102'
                    }`}>
                      <div className="text-center">
                        <span className={`text-4xl font-light mb-4 block transition-colors duration-300 ${
                          activeStep === i ? 'text-[#D4AF37]' : 'text-[#D4AF37]/70'
                        }`}>{step.num}</span>
                        
                        <div className={`inline-flex items-center justify-center mb-4 transition-all duration-300 p-3 rounded-xl ${
                          activeStep === i 
                            ? 'text-[#D4AF37] bg-[#D4AF37]/10 scale-110' 
                            : 'text-[#D4AF37]/70 bg-[#D4AF37]/5 group-hover:scale-110'
                        }`}>
                          {step.icon}
                        </div>
                        
                        <h3 className="text-xl font-medium mb-2 text-[#1A1A1A]">{step.title}</h3>
                        <p className="text-[#6A6A6A] leading-relaxed text-sm">{step.desc}</p>
                      </div>
                    </div>

                    {/* Connection line to next step (hidden on last item) */}
                    {i < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-[#D4AF37]/30 transform -translate-y-1/2 z-0" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Progress indicator for mobile */}
              <div className="flex items-center justify-center gap-2 mt-8 lg:hidden">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeStep === i ? 'bg-[#D4AF37] w-8' : 'bg-[#D4AF37]/30 hover:bg-[#D4AF37]/50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Dynamic content below timeline */}
            <div className="min-h-[600px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  {/* Main content card */}
                  <div className="bg-gradient-to-br from-white to-[#F8F8F8] rounded-3xl p-8 border border-[#1A1A1A]/5 shadow-lg">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center">
                        {stepContent[activeStep].icon}
                      </div>
                      <h3 className="text-2xl font-medium text-[#1A1A1A]">{stepContent[activeStep].title}</h3>
                    </div>
                    <p className="text-[#6A6A6A] mb-6 leading-relaxed text-lg">
                      {stepContent[activeStep].description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {stepContent[activeStep].stats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 border border-[#1A1A1A]/5">
                          <div className="text-2xl font-bold text-[#D4AF37] mb-1">{stat.value}</div>
                          <div className="text-sm text-[#6A6A6A]">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Features list */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-[#1A1A1A] mb-3">Key Features:</h4>
                      {stepContent[activeStep].features.map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 + 0.2 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 bg-[#D4AF37] rounded-full flex-shrink-0" />
                          <span className="text-[#6A6A6A]">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Secondary content based on step */}
                  <div className="space-y-6">
                    {activeStep === 0 && (
                      <>
                        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-8 text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl" />
                          <div className="relative z-10">
                            <h4 className="text-xl font-medium mb-4">Installation Package</h4>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="text-sm">• Mounting bracket</div>
                              <div className="text-sm">• Installation tools</div>
                              <div className="text-sm">• Cable management</div>
                              <div className="text-sm">• Quick start guide</div>
                            </div>
                            <p className="text-sm text-[#B0B0B0]">
                              Everything you need for a professional installation in under 30 minutes.
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 border border-[#1A1A1A]/5 shadow-md">
                          <h4 className="font-medium text-[#1A1A1A] mb-3">Compatibility</h4>
                          <div className="space-y-2 text-sm text-[#6A6A6A]">
                            <div>✓ Tesla Wall Connector (Gen 2 & 3)</div>
                            <div>✓ J1772 Standard Chargers</div>
                            <div>✓ ChargePoint Home Flex</div>
                            <div>✓ JuiceBox Pro Series</div>
                          </div>
                        </div>
                      </>
                    )}

                    {activeStep === 1 && (
                      <>
                        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-8 text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl" />
                          <div className="relative z-10">
                            <h4 className="text-xl font-medium mb-4">Mobile App Features</h4>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Wifi className="w-4 h-4 text-[#D4AF37]" />
                                <span className="text-sm">Real-time connection status</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Battery className="w-4 h-4 text-[#D4AF37]" />
                                <span className="text-sm">Battery level monitoring</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-[#D4AF37]" />
                                <span className="text-sm">Charging schedule management</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 border border-[#1A1A1A]/5 shadow-md">
                          <h4 className="font-medium text-[#1A1A1A] mb-3">Setup Process</h4>
                          <div className="space-y-2 text-sm text-[#6A6A6A]">
                            <div>1. Download Ampereon app</div>
                            <div>2. Create your account</div>
                            <div>3. Scan QR code on device</div>
                            <div>4. Connect to home WiFi</div>
                            <div>5. Pair with your vehicle</div>
                          </div>
                        </div>
                      </>
                    )}

                    {activeStep === 2 && (
                      <>
                        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-8 text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl" />
                          <div className="relative z-10">
                            <h4 className="text-xl font-medium mb-4">AI Learning Process</h4>
                            <p className="text-sm text-[#B0B0B0] mb-4">
                              Ampereon's AI adapts to your lifestyle, learning when you typically drive and optimizing charging accordingly.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-2xl font-bold text-[#D4AF37]">7 days</div>
                                <div className="text-xs text-[#B0B0B0]">to learn patterns</div>
                              </div>
                              <div>
                                <div className="text-2xl font-bold text-[#D4AF37]">24/7</div>
                                <div className="text-xs text-[#B0B0B0]">optimization</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 border border-[#1A1A1A]/5 shadow-md">
                          <h4 className="font-medium text-[#1A1A1A] mb-3">Smart Features</h4>
                          <div className="space-y-2 text-sm text-[#6A6A6A]">
                            <div>🧠 Learns your daily routine</div>
                            <div>⚡ Optimizes for off-peak rates</div>
                            <div>🌤️ Weather-aware charging</div>
                            <div>🔋 Battery health protection</div>
                            <div>📅 Calendar integration</div>
                          </div>
                        </div>
                      </>
                    )}

                    {activeStep === 3 && (
                      <>
                        <div className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] rounded-3xl p-8 text-white relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl" />
                          <div className="relative z-10">
                            <h4 className="text-xl font-medium mb-4">Live Analytics</h4>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <div className="text-lg font-bold text-[#D4AF37]">$27</div>
                                <div className="text-xs text-[#B0B0B0]">Saved this month</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-[#D4AF37]">156 kWh</div>
                                <div className="text-xs text-[#B0B0B0]">Energy consumed</div>
                              </div>
                            </div>
                            <p className="text-sm text-[#B0B0B0]">
                              Track your savings and energy usage in real-time with detailed monthly reports.
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-2xl p-6 border border-[#1A1A1A]/5 shadow-md">
                          <h4 className="font-medium text-[#1A1A1A] mb-3">Insights & Reports</h4>
                          <div className="space-y-2 text-sm text-[#6A6A6A]">
                            <div>📊 Energy usage tracking</div>
                            <div>💰 Cost savings analysis</div>
                            <div>🌱 Carbon footprint reduction</div>
                            <div>📈 Monthly efficiency reports</div>
                            <div>⏰ Peak vs off-peak usage</div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div 
            className="text-center mt-20"
            variants={fadeUpVariants}
            transition={{ delay: 1.1 }}
          >
            <motion.button 
              onClick={openModal}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 text-sm font-medium text-[#D4AF37] bg-[#D4AF37]/10 px-6 py-3 rounded-full mb-6"
            >
              <ArrowRight className="w-4 h-4" />
              <span>Ready to get started?</span>
            </motion.button>
            <p className="text-[#6A6A6A] max-w-2xl mx-auto">
              Join thousands of EV owners who've made the switch to effortless charging with Ampereon
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Metrics Section - Sophisticated cards */}
      <motion.section 
        className="py-32 px-6 bg-[#1A1A1A] text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        {/* Elegant background pattern */}
        <div className="absolute inset-0 opacity-5" 
             style={{ backgroundImage: 'linear-gradient(45deg, #D4AF37 25%, transparent 25%), linear-gradient(-45deg, #D4AF37 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #D4AF37 75%), linear-gradient(-45deg, transparent 75%, #D4AF37 75%)', backgroundSize: '60px 60px' }} />
        
        <div className="max-w-7xl mx-auto relative z-20">
          <motion.div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light mb-6 tracking-tight text-white relative z-20">
              Your Impact, <span className="font-medium text-[#D4AF37]">Quantified</span>
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
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
                  <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-10 border border-white/20 shadow-2xl 
                                hover:border-[#D4AF37]/30 transition-all duration-500 hover:shadow-[#D4AF37]/20 relative z-20">
                    
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                    
                    <div className="relative z-30">
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-6xl md:text-7xl font-light text-[#D4AF37] relative z-30">
                          {metric.prefix}{displayCount}{metric.suffix}
                        </div>
                        <div className="text-[#D4AF37] group-hover:scale-110 transition-transform duration-300">
                          {metric.icon}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-medium mb-6 text-white relative z-30">{metric.label}</h3>
                      
                      <button
                        onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                        className="flex items-center gap-3 text-[#D4AF37] hover:text-white transition-colors duration-300 
                                 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 
                                 focus:ring-offset-[#1A1A1A] rounded-lg px-3 py-2 -ml-3 relative z-30"
                      >
                        <span className="text-sm font-medium tracking-wide">HOW?</span>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeAccordion === i ? 'rotate-180' : ''}`} />
                      </button>
                      
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
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Community Support - Our Supporters */}
      <motion.section 
        className="py-24 px-6 bg-white relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight text-[#1A1A1A]">
              Our Amazing <span className="font-medium text-[#D4AF37]">Community</span>
            </h2>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6" />
            <p className="text-xl text-[#6A6A6A] max-w-3xl mx-auto font-light leading-relaxed mb-8">
              Meet the incredible supporters who are helping bring the future of EV charging to life
            </p>
            
            {/* Total support amount */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#D4AF37]/10 to-[#B8860B]/10 
                          backdrop-blur-sm px-8 py-4 rounded-2xl border border-[#D4AF37]/20">
              <Heart className="w-6 h-6 text-[#D4AF37]" />
              <span className="text-2xl font-light text-[#1A1A1A]">
                <span className="font-medium text-[#D4AF37]">${totalAmount.toLocaleString()}</span> raised by our community
              </span>
            </div>
          </motion.div>

          {/* Filter buttons */}
          <motion.div 
            className="flex justify-center mb-12"
            variants={fadeUpVariants}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-[#1A1A1A]/10 shadow-lg">
              <div className="flex gap-2">
                {[
                  { label: 'Recent', value: 'recent' },
                  { label: 'Top Month', value: 'top-month' },
                  { label: 'All Time', value: 'top-all' },
                ].map(({ label, value }) => (
                  <motion.button
                    key={value}
                    onClick={() => setDonorFilter(value)}
                    className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      donorFilter === value
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white shadow-lg shadow-[#D4AF37]/25'
                        : 'text-[#6A6A6A] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]'
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

          {/* Supporters list */}
          <motion.div 
            className="bg-gradient-to-br from-white to-[#F8F8F8] rounded-3xl p-8 border border-[#1A1A1A]/5 shadow-lg"
            variants={fadeUpVariants}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-medium text-[#1A1A1A] tracking-tight">Our Supporters</h3>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin h-8 w-8 border-3 border-[#D4AF37] rounded-full border-t-transparent mr-4"></div>
                <p className="text-[#6A6A6A] font-light">Loading our awesome supporters...</p>
              </div>
            ) : donorsWithAmounts.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-16 h-16 text-[#D4AF37]/50 mx-auto mb-6" />
                <h4 className="text-xl font-medium text-[#1A1A1A] mb-3">Be the First to Support</h4>
                <p className="text-[#6A6A6A] font-light max-w-md mx-auto">
                  Join our mission to revolutionize EV charging. Be among the first supporters of this groundbreaking technology.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {donorsWithAmounts.slice(0, 12).map((donor, index) => (
                  <motion.div
                    key={donor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:bg-white transition-all duration-300 
                             border border-[#1A1A1A]/5 hover:border-[#D4AF37]/20 hover:shadow-md group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 rounded-full 
                                    flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-[#D4AF37] font-medium text-lg">
                          {donor.anonymous ? '?' : (donor.firstName?.[0] || '?')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#1A1A1A] truncate mb-1 tracking-wide">
                          {donor.anonymous ? 'Anonymous Supporter' : `${donor.firstName || ''} ${donor.lastName || ''}`.trim()}
                        </p>
                        <p className="text-[#D4AF37] font-semibold text-sm mb-2">
                          ${donor.amount?.toFixed(2) || '0.00'}
                        </p>
                        {donor.dedicateTo && (
                          <p className="text-[#6A6A6A] italic text-sm truncate mb-2">
                            In honor of: {donor.dedicateTo}
                          </p>
                        )}
                        <p className="text-[#8A8A8A] text-xs font-light">
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
              <div className="text-center mt-8">
                <p className="text-[#6A6A6A] font-light">
                  And <span className="font-medium text-[#D4AF37]">{donorsWithAmounts.length - 12} more</span> amazing supporters!
                </p>
              </div>
            )}
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
              className="inline-flex items-center gap-3 text-sm font-medium text-[#D4AF37] bg-[#D4AF37]/10 px-6 py-3 rounded-full mb-6"
            >
              <Heart className="w-4 h-4" />
              <span>Join our community</span>
            </motion.button>
            <p className="text-[#6A6A6A] max-w-2xl mx-auto font-light leading-relaxed">
              Every supporter brings us closer to revolutionizing EV charging. Join this incredible community of forward-thinking individuals.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section - Premium finish */}
      <motion.section 
        className="py-32 px-6 bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        {/* Luxurious background effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            className="inline-flex items-center gap-3 text-sm font-medium text-[#D4AF37] 
                       bg-[#D4AF37]/15 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-[#D4AF37]/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Clock className="w-4 h-4" />
            <span className="tracking-wide text-[#D4AF37]">LIMITED TIME OFFER</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-light mb-8 tracking-tight text-white leading-tight relative z-10">
            First 100 Reservations Get <span className="font-medium text-[#D4AF37]">Exclusive Benefits</span>
          </h2>
          
          <p className="text-xl md:text-2xl mb-12 text-[#E0E0E0] max-w-4xl mx-auto font-light leading-relaxed relative z-10">
            Save 20% on your Ampereon system. Get priority shipping, beta-tester updates, and lifetime perks. 
            Your future of effortless charging starts today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/order">
              <button 
                className="px-12 py-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium text-xl rounded-full 
                           hover:shadow-2xl hover:shadow-[#D4AF37]/40 transition-all duration-300 transform hover:scale-105
                           focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
              >
                Order for $99
              </button>
            </Link>
            
            <div className="flex items-center gap-4 text-[#E0E0E0]">
              <span className="text-sm font-light">or</span>
            </div>

            <Link href="/reserve">
              <button 
                className="px-10 py-5 bg-white/10 backdrop-blur-sm border border-[#D4AF37]/30 text-white font-medium text-lg rounded-full 
                           hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 transform hover:scale-105
                           focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
              >
                Reserve for $5
              </button>
            </Link>
          </div>
          
          <p className="mt-8 text-sm text-[#B0B0B0] font-medium tracking-wide relative z-10">
            Only 23 spots remaining
          </p>
        </div>
      </motion.section>
    </div>
  );
};

export default AmpereonLanding;