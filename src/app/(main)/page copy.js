'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap, Wifi, DollarSign, Battery, Clock, ChevronRight, ArrowRight, Star, Users, Heart, Globe, Shield, Check, Link } from 'lucide-react';
import { db } from "../firebaseConfig.js";
import { collection, getDocs, query, orderBy, limit, where, getFirestore } from 'firebase/firestore';
import OrderChoiceModal from '../../components/OrderChoiceModal';


// Simplified pattern overlay
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

const AmpereonLanding = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [donorsWithAmounts, setDonorsWithAmounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [donorFilter, setDonorFilter] = useState('recent');
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalPreOrders, setTotalPreOrders] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const heroRef = useRef(null);

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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  const features = [
    { 
      icon: <Zap className="w-6 h-6" />, 
      title: "Automatic Connection", 
      desc: "Your charger connects automatically when you park. No more plugging in every day." 
    },
    { 
      icon: <Wifi className="w-6 h-6" />, 
      title: "Works with Your Charger", 
      desc: "Compatible with all existing home EV chargers. Ampereon takes your normal charger and brings it into the future." 
    },
    { 
      icon: <DollarSign className="w-6 h-6" />, 
      title: "Lower Electricity Bills", 
      desc: "Charges during off-peak hours when rates are lowest, saving you money every month." 
    },
    { 
      icon: <Battery className="w-6 h-6" />, 
      title: "AI Charging Optimization", 
      desc: "Advanced AI that learns every day to make every charge smarter, improving battery life, cost, and aligning to your." 
    }
  ];

  const steps = [
    { 
      num: "01", 
      title: "Install in 30 Minutes", 
      desc: "Mount using your existing charger", 
      icon: Zap,
      detail: "Simple installation with included hardware"
    },
    { 
      num: "02", 
      title: "Connect via App", 
      desc: "One-time setup", 
      icon: Wifi,
      detail: "Quick pairing with guided setup"
    },
    { 
      num: "03", 
      title: "Automatic Charging", 
      desc: "Starts charging when you park", 
      icon: Battery,
      detail: "Learns your schedule for optimal timing"
    },
    { 
      num: "04", 
      title: "Track Savings", 
      desc: "Monitor usage and costs", 
      icon: Clock,
      detail: "Real-time insights and monthly reports"
    }
  ];

  const stepContent = [
    {
      title: "Quick Installation",
      icon: Zap,
      description: "Install Ampereon in about 30 minutes using your existing wall charger. All mounting hardware included.",
      stats: [
        { value: "30min", label: "Install time" },
        { value: "100%", label: "Compatibility" }
      ],
      features: [
        "No electrical work required",
        "Uses existing charger",
        "All hardware included",
        "Step-by-step guide"
      ]
    },
    {
      title: "Smart Setup",
      icon: Wifi,
      description: "Connect to your home WiFi and pair with your vehicle using our mobile app.",
      stats: [
        { value: "2min", label: "Setup time" },
        { value: "All", label: "EV models" }
      ],
      features: [
        "Guided app setup",
        "Auto vehicle detection",
        "Secure connection",
        "Works offline too"
      ]
    },
    {
      title: "Intelligent Charging",
      icon: Battery,
      description: "Ampereon learns your routine and charges when electricity rates are lowest while ensuring your car is ready.",
      stats: [
        { value: "32%", label: "Average savings" },
        { value: "24/7", label: "Monitoring" }
      ],
      features: [
        "Learns your schedule",
        "Off-peak optimization",
        "Weather adjustments",
        "Custom schedules"
      ]
    },
    {
      title: "Usage Insights",
      icon: Clock,
      description: "Track energy usage, cost savings, and environmental impact with detailed reports.",
      stats: [
        { value: "$325", label: "Yearly savings" },
        { value: "Real-time", label: "Updates" }
      ],
      features: [
        "Energy tracking",
        "Cost analysis",
        "Environmental impact",
        "Monthly summaries"
      ]
    }
  ];

  // Auto-advance timer (slower for mature audience)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 8000);
    
    return () => clearInterval(timer);
  }, [steps.length]);

  const metrics = [
    { value: 325, prefix: "$", suffix: "", label: "Average Yearly Savings", how: "Off-peak charging reduces electricity costs by about 32%, saving approximately $325 annually for typical EV owners.", icon: <DollarSign className="w-5 h-5" /> },
    { value: 3, prefix: "", suffix: " years", label: "Extended Battery Life", how: "Optimized charging reduces battery degradation by 40%, adding approximately 3 years to your EV battery's useful life.", icon: <Battery className="w-5 h-5" /> },
    { value: 30, prefix: "", suffix: " hours", label: "Time Saved Annually", how: "No more daily plugging and unplugging. Save 5 minutes per day, which adds up to 30 hours of time saved each year.", icon: <Clock className="w-5 h-5" /> }
  ];

  // Load data from Firebase
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

        setTotalPreOrders(preOrderSum);
        setTotalDonations(donationSum);
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
          case 'top-all':
            donorsQuery = query(donorsRef, orderBy('createdAt', 'desc'));
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
      {/* Hero Section - Professional with gold accents */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        ref={heroRef}
      >
        {/* Subtle video background */}
        <motion.div className="absolute inset-0 z-0 pointer-events-none opacity-30">
          <video
            autoPlay muted loop playsInline controls={false} preload="auto"
            className="w-full h-full object-cover"
            title="How Ampereon Works"
            poster="https://demo.ampereonenergy.com/poster.png"
          >
            <source src="https://demo.ampereonenergy.com/productDemo.mp4#t=1" type="video/mp4" />
          </video>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1A1A1A]/20 to-[#1A1A1A]/40" />

        {/* Hero content */}
        <motion.div
          className="relative z-10 px-6 max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#D4AF37] 
                       bg-[#D4AF37]/10 px-4 py-2 rounded-full mb-8 border border-[#D4AF37]/20 backdrop-blur-sm"
          >
            <Shield className="w-4 h-4" />
            <span>Trusted by over 500 EV owners</span>
          </motion.div> */}

          <h1 className="font-light leading-tight mb-8 text-white"
              style={{ fontSize: 'clamp(2.5rem,5.5vw,4rem)' }}>
            The EV Charger of
            <br />
            <span className="font-bold text-[#D4AF37]">
              Tomorrow
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed font-light">
            A smart, fully automatic home Electric Vehicle charger that works on top of the charging unit you already use every day.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium rounded-lg
                        hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300"
              onClick={openModal}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Reserve Yours - $5
            </motion.button>

            <a href="/product">
              <motion.button
                className="px-8 py-4 border border-[#D4AF37]/30 text-white font-medium rounded-lg
                          hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <span className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Learn More
                </span>
              </motion.button>
            </a>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>30-day money back</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>2-year warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>Expert support</span>
            </div>
          </div>
        </motion.div>

        {/* Subtle scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent mb-2" />
          <ChevronDown className="w-5 h-5 text-[#D4AF37]/70" />
        </motion.div>
      </section>

      {/* Features Grid - Professional dark layout */}
      <motion.section 
        className="py-20 px-6 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <SubtlePattern />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
              Why Choose <span className="font-semibold text-[#D4AF37]">Ampereon</span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
              Practical benefits that make EV ownership more convenient and cost-effective
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="group"
                variants={fadeUpVariants}
                transition={{ delay: i * 0.1 }}
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 h-full border border-[#D4AF37]/20 
                             hover:border-[#D4AF37]/40 hover:bg-[#2A2A2A]/80 transition-all duration-300">
                  
                  <div className="flex items-start gap-6">
                    <div className="flex items-center justify-center w-12 h-12 mb-4
                                  bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 rounded-lg 
                                  border border-[#D4AF37]/30 text-[#D4AF37] flex-shrink-0">
                      {feature.icon}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* How It Works - Clean timeline */}
      <motion.section 
        className="py-20 px-6 bg-[#0A0A0A]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
              How It <span className="font-semibold text-[#D4AF37]">Works</span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
              Simple setup, automatic operation. Get started in four straightforward steps.
            </p>
          </motion.div>

          {/* Simple step-by-step layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              
              return (
                <motion.div 
                  key={index}
                  className="text-center relative"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.15, duration: 0.6 }
                    }
                  }}
                >
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-xl 
                                  flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#D4AF37]/20">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-sm font-medium text-[#D4AF37] mb-2">
                      STEP {step.num}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{step.desc}</p>
                  
                  {/* Connection line (except for last item) */}
                  {/* {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-[#D4AF37]/20 transform translate-x-4" />
                  )} */}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Benefits Section - Data-driven with gold accents */}
      <motion.section 
        className="py-20 px-6 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <SubtlePattern />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
              Proven <span className="font-semibold text-[#D4AF37]">Benefits</span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
              Real savings and benefits based on actual usage data
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {metrics.map((metric, i) => {
              const { count, ref } = useCounter(metric.value, 2000);
              
              return (
                <motion.div
                  key={metric.label} // Use a unique identifier
                  ref={ref}
                  className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 text-center 
                          border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-300
                          h-fit" // Added h-fit to make height fit content
                  variants={fadeUpVariants}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="text-[#D4AF37]">
                      {metric.icon}
                    </div>
                  </div>
                  
                  <div className="text-3xl font-semibold text-white mb-2">
                    {metric.prefix}{count}{metric.suffix}
                  </div>
                  
                  <h3 className="text-lg font-medium mb-4 text-white">{metric.label}</h3>
                  
                  <motion.button
                    onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
                    className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors duration-200 
                            mx-auto text-sm font-medium"
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
                        <p className="text-gray-300 text-sm leading-relaxed">{metric.how}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Social Proof - Professional with gold accents */}
     <motion.section 
        className="py-20 px-6 bg-[#0A0A0A]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
              Our <span className="font-semibold text-[#D4AF37]">Community</span>
            </h2>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="text-2xl font-semibold text-[#D4AF37]">
                ${Math.floor(totalAmount).toLocaleString()}
              </div>
              <span className="text-gray-300">raised by our community</span>
            </div>
            
            {/* {totalDonations > 0 && totalPreOrders > 0 && (
              <div className="text-sm text-gray-400 mb-8">
                Donations: ${totalDonations.toLocaleString()} • Pre-orders: ${totalPreOrders.toLocaleString()}
              </div>
            )} */}
          </motion.div>

          {/* Filter buttons */}
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

          {/* Supporter list - clean and professional */}
          <motion.div 
            className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 border border-[#D4AF37]/20"
            variants={fadeUpVariants}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 rounded-lg 
                            flex items-center justify-center border border-[#D4AF37]/30">
                <Users className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-semibold text-white">Our Supporters</h3>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  className="w-8 h-8 border-2 border-[#D4AF37] rounded-full border-t-transparent mr-4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-gray-400 text-lg">Loading our amazing supporters...</p>
              </div>
            ) : donorsWithAmounts.length === 0 ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-16 h-16 text-[#D4AF37]/50 mx-auto mb-6" />
                </motion.div>
                <h4 className="text-xl font-medium text-white mb-3">Be the First to Support</h4>
                <p className="text-gray-400 text-lg max-w-md mx-auto">
                  Join our mission to revolutionize EV charging. Be among the first supporters of this groundbreaking technology.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {donorsWithAmounts.slice(0, 8).map((donor, index) => (
                  <motion.div
                    key={donor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-[#1A1A1A]/80 rounded-lg p-4 border border-[#D4AF37]/10 
                            hover:border-[#D4AF37]/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37]/30 to-[#B8860B]/30 
                                    rounded-full flex items-center justify-center flex-shrink-0 
                                    border border-[#D4AF37]/20">
                        <span className="text-[#D4AF37] font-medium text-sm">
                          {donor.anonymous ? '?' : (donor.firstName?.[0] || '?')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate text-sm">
                          {donor.anonymous ? 'Anonymous Supporter' : `${donor.firstName || ''} ${donor.lastName?.[0] || ''}.`}
                        </p>
                        <p className="text-[#D4AF37] font-semibold text-sm">
                          ${donor.amount?.toFixed(2) || '0.00'}
                        </p>
                        {donor.dedicateTo && (
                          <p className="text-gray-400 italic text-xs truncate mt-1">
                            In honor of: {donor.dedicateTo}
                          </p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
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
            {donorsWithAmounts.length > 8 && (
              <div className="text-center mt-8">
                <p className="text-gray-400 font-light text-lg">
                  And <span className="font-bold text-[#D4AF37]">{donorsWithAmounts.length - 8} more</span> amazing supporters!
                </p>
              </div>
            )}

            {/* CTA Button to /support-us */}
            <div className="text-center mt-8">
              <a href="/support-us">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold rounded-lg 
                            hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Join Our Community
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section - Professional with gold branding */}
      <motion.section 
        className="py-20 px-6 bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUpVariants}
      >
        <SubtlePattern />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 
            className="text-4xl md:text-5xl font-light mb-6 leading-tight text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Ready to Upgrade Your{' '}
            <span className="font-semibold text-[#D4AF37]">Charging Experience?</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-10 text-gray-300 max-w-3xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Join hundreds of EV owners who've made the switch to effortless charging. 
            Reserve your Ampereon system today.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <a href="/reserve">
              <motion.button 
                className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold rounded-lg 
                        hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reserve Now - $5
              </motion.button>
            </a>
            
            <a href="/order">
              <motion.button 
                className="px-8 py-4 bg-white/5 border border-[#D4AF37]/30 text-white font-semibold rounded-lg 
                        hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                Full Purchase - $224
              </motion.button>
            </a>
          </motion.div>
          
          <motion.div 
            className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>30-day money back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>Free shipping</span>
            </div>
          </motion.div>
        </div>
      </motion.section>
      <OrderChoiceModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} />
    </div>
  );
};

export default AmpereonLanding;