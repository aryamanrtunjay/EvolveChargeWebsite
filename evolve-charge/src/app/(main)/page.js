'use client';

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion'; // Removed unused imports: useScroll, useTransform
import { ChevronDown, Zap, Wifi, DollarSign, Battery, Clock, ChevronRight, Check, Leaf, Home, Settings, TrendingUp, Users, Heart, Award } from 'lucide-react'; // Removed unused icons
import { db } from "../firebaseConfig.js";
import { collection, getDocs, query, orderBy, limit, where, getFirestore } from 'firebase/firestore';
import OrderChoiceModal from '../../components/OrderChoiceModal';

// Lazy load non-critical components
const SubtlePattern = lazy(() => Promise.resolve({ default: ({ opacity = 0.03 }) => (
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
) }));

const AmpereonLanding = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [donorsWithAmounts, setDonorsWithAmounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [donorFilter, setDonorFilter] = useState('recent');
  const [totalAmount, setTotalAmount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [activeStep, setActiveStep] = useState(0);

  const heroRef = useRef(null);

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
      title: "Automatic Home EV Charger", 
      desc: "Your smart home EV charger connects automatically at optimal times. Eliminate daily plugging with hands-free electric vehicle charging at home." 
    },
    { 
      icon: <Wifi className="w-6 h-6" />, 
      title: "Universal Home EV Charging Station Compatibility", 
      desc: "Works with all residential EV chargers and home electric car chargers. Upgrade your existing Level 2 EV charger with Ampereon's smart technology." 
    },
    { 
      icon: <DollarSign className="w-6 h-6" />, 
      title: "Smart Home EV Charging Cost Savings", 
      desc: "AI-driven off-peak charging cuts home EV charging costs by up to 40%. Optimize based on time-of-use rates for maximum savings." 
    },
    { 
      icon: <Battery className="w-6 h-6" />, 
      title: "AI-Optimized EV Battery Management", 
      desc: "Machine learning extends EV battery life while preventing overcharging. Smart schedules maintain optimal battery health for your electric vehicle." 
    }
  ];

  const steps = [
    { 
      num: "01", 
      title: "Easy Home EV Charger Installation", 
      desc: "Attach Ampereon to your existing Level 2 home charging station in 30 minutes", 
      icon: Zap,
      detail: "DIY installation with included hardware - no electrician needed"
    },
    { 
      num: "02", 
      title: "Smart Home EV Integration", 
      desc: "Connect via WiFi and sync with your electric vehicle", 
      icon: Wifi,
      detail: "Simple app-guided setup for seamless operation"
    },
    { 
      num: "03", 
      title: "Automated Home Electric Car Charging", 
      desc: "AI starts charging automatically upon arrival home", 
      icon: Battery,
      detail: "Adapts to your schedule and energy requirements"
    },
    { 
      num: "04", 
      title: "Home EV Charging Insights", 
      desc: "Track usage, savings, and eco-impact", 
      icon: Clock,
      detail: "Live data and monthly reports on your smart EV charging"
    }
  ];

  const stepContent = [
    {
      title: "Professional Home EV Charger Installation",
      icon: Zap,
      description: "Install Ampereon smart home EV charger in 30 minutes using your existing wall unit. Includes all hardware for simple DIY setup.",
      stats: [
        { value: "30min", label: "Install time" },
        { value: "100%", label: "Compatibility" }
      ],
      features: [
        "No wiring changes needed",
        "Fits all Level 2 home EV chargers",
        "Hardware provided",
        "Step-by-step guide"
      ]
    },
    {
      title: "Smart Home EV Charging Setup",
      icon: Wifi,
      description: "Link to home WiFi and pair with your EV via our user-friendly app for intelligent charging control.",
      stats: [
        { value: "2min", label: "Setup time" },
        { value: "All", label: "EV models" }
      ],
      features: [
        "App-guided process",
        "Auto EV detection",
        "Secure connection",
        "Universal EV compatibility"
      ]
    },
    {
      title: "Intelligent Home Electric Vehicle Charging",
      icon: Battery,
      description: "AI learns patterns to charge at lowest rates while keeping your EV ready.",
      stats: [
        { value: "32%", label: "Avg savings" },
        { value: "24/7", label: "Monitoring" }
      ],
      features: [
        "Schedule learning",
        "Rate optimization",
        "Weather adjustments",
        "Custom profiles"
      ]
    },
    {
      title: "Advanced Home EV Charging Analytics",
      icon: Clock,
      description: "Monitor consumption, savings, and carbon reduction with detailed EV charging reports.",
      stats: [
        { value: "$325", label: "Yearly savings" },
        { value: "Real-time", label: "Updates" }
      ],
      features: [
        "Energy tracking",
        "Cost dashboard",
        "Eco monitoring",
        "Monthly reports"
      ]
    }
  ];

  // Auto-advance timer (slower for mature audience)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 8000);
    
    return () => clearInterval(timer);
  }, []);

  const metrics = [
    { value: 325, prefix: "$", suffix: "", label: "Annual Home EV Charging Savings", how: "Off-peak smart charging reduces costs by 32%, saving ~$325/year for average EV owners.", icon: <DollarSign className="w-5 h-5" /> },
    { value: 1100, prefix: "", suffix: " days", label: "Extended EV Battery Life", how: "AI charging reduces degradation by 40%, adding ~3 years to battery life.", icon: <Battery className="w-5 h-5" /> },
    { value: 30, prefix: "", suffix: " hours", label: "Yearly Time Saved", how: "Auto charging saves 5 min/day, equaling 30 hours/year.", icon: <Clock className="w-5 h-5" /> }
  ];

  // Additional SEO-focused content sections
  const evChargingBenefits = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Sustainable Home EV Charging",
      description: "Maximize renewable energy use with smart timing for lower carbon footprint in electric vehicle charging."
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "Upgrade Your Home EV Charging Station", 
      description: "Convert existing setup to smart home EV charger without replacement."
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Custom Smart EV Charging Options",
      description: "Personalize schedules and limits via app for your home electric car charger."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Future-Ready Home EV Charger Technology",
      description: "OTA updates keep your smart EV charger compatible with new electric vehicles."
    }
  ];

  const evOwnershipAdvantages = [
    {
      category: "Cost Efficiency",
      benefits: [
        "Lower home EV charging costs with smart optimization",
        "Reduce electricity bills through intelligent management",
        "Qualify for EV charger tax credits",
        "Boost property value with smart EV infrastructure"
      ]
    },
    {
      category: "Convenience & Automation", 
      benefits: [
        "Hands-free home electric car charging",
        "App-based remote control",
        "Adaptive scheduling to your routine",
        "Charging status alerts"
      ]
    },
    {
      category: "Performance & Reliability",
      benefits: [
        "Optimized Level 2 EV charger speeds",
        "Durable for outdoor use",
        "2-year smart EV charger warranty",
        "24/7 support for home EV charging"
      ]
    }
  ];

  // Load data from Firebase
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const firestoreDb = getFirestore();
        
        const [ordersSnapshot, donationsSnapshot] = await Promise.all([
          getDocs(collection(firestoreDb, "orders")),
          getDocs(collection(firestoreDb, "donations"))
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

        const donorsRef = collection(firestoreDb, 'donors');
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
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        ref={heroRef}
      >
        {/* Subtle video background */}
        <motion.div className="absolute inset-0 z-0 pointer-events-none opacity-30">
          <video
            autoPlay muted loop playsInline controls={false} preload="none"
            className="w-full h-full object-cover"
            title="Smart Home EV Charger Demonstration - Automatic Electric Vehicle Charging"
            poster="https://demo.ampereonenergy.com/poster.png"
            loading="lazy"
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
          <h1 className="font-light leading-tight mb-8 text-white"
              style={{ fontSize: 'clamp(2.5rem,5.5vw,4rem)' }}>
            Automatic Smart Home<br />
            <span className="font-bold text-[#D4AF37]">
              EV Charger
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            Automate connections, cut costs 40%, protect battery life. Works with any Level 2 charger. 
          </p>
          <p className="text-xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed font-light">
            The charge of tomorrow is here, today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium rounded-lg
                        hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300"
              onClick={openModal}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Reserve Now - $5 (Limited)
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

          {/* Trust indicators with SEO keywords */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>30-Day Money-Back</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>2-Year Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>Free Shipping & Support</span>
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

      {/* Features Grid - Enhanced with SEO keywords */}
      <Suspense fallback={null}>
        <motion.section 
          className="py-20 px-6 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
        >
          <Suspense fallback={null}><SubtlePattern /></Suspense>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
                Why Choose Ampereon's <span className="font-semibold text-[#D4AF37]">Smart Home EV Charger</span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                Revolutionize your home electric vehicle charging with AI automation, cost optimization, and seamless integration for all EV models.
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
      </Suspense>

      {/* New Section: EV Charging Benefits */}
      <Suspense fallback={null}>
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
                Benefits of <span className="font-semibold text-[#D4AF37]">Smart Home EV Charging</span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                Explore how Ampereon's intelligent home EV charger enhances sustainability, efficiency, and convenience for electric vehicle owners.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {evChargingBenefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-6 border border-[#D4AF37]/20 
                           hover:border-[#D4AF37]/40 transition-all duration-300"
                  variants={fadeUpVariants}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-center w-12 h-12 mb-4
                                bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 rounded-lg 
                                border border-[#D4AF37]/30 text-[#D4AF37]">
                    {benefit.icon}
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-3 text-white">{benefit.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </Suspense>

      {/* How It Works - Enhanced with SEO keywords */}
      <Suspense fallback={null}>
        <motion.section 
          className="py-20 px-6 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
        >
          <Suspense fallback={null}><SubtlePattern /></Suspense>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
                How to Install and Use Your <span className="font-semibold text-[#D4AF37]">Smart Home EV Charger</span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                Transform your home EV charging station into a smart system with easy installation. Start automated electric vehicle charging in four simple steps.
              </p>
            </motion.div>

            {/* Step selector grid */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Connecting line */}
              <div className="hidden lg:block absolute top-[40px] left-[calc(50%-2px)] w-[calc(100%-4rem)] h-0.5 bg-[#D4AF37]/20 transform -translate-x-1/2" style={{top: '40px'}} />

              {steps.map((step, index) => {
                const IconComponent = step.icon;
                
                return (
                  <motion.div 
                    key={index}
                    className={`cursor-pointer relative z-10 text-center bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-6 border ${
                      activeStep === index ? 'border-[#D4AF37]/40 shadow-lg shadow-[#D4AF37]/20' : 'border-[#D4AF37]/20'
                    } hover:border-[#D4AF37]/40 hover:shadow-md transition-all duration-300`}
                    onClick={() => setActiveStep(index)}
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
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative mb-6">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg transition-colors duration-300 ${
                        activeStep === index ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B]' : 'bg-[#2A2A2A]'
                      }`}>
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
                  </motion.div>
                );
              })}
            </div>

            {/* Detailed step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 border border-[#D4AF37]/20"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] flex-shrink-0">
                    {React.createElement(stepContent[activeStep].icon, { className: "w-8 h-8" })}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-2">{stepContent[activeStep].title}</h3>
                    <p className="text-gray-300 leading-relaxed">{stepContent[activeStep].description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {stepContent[activeStep].stats.map((stat, i) => (
                    <div key={i} className="bg-[#D4AF37]/10 rounded-lg p-4 text-center border border-[#D4AF37]/20">
                      <div className="text-2xl font-bold text-[#D4AF37]">{stat.value}</div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stepContent[activeStep].features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>
      </Suspense>

      {/* New Section: EV Ownership Advantages */}
      <Suspense fallback={null}>
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
                Advantages of <span className="font-semibold text-[#D4AF37]">Smart Home Electric Vehicle Charging</span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                Ampereon delivers comprehensive benefits for EV owners seeking efficient, affordable home charging solutions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {evOwnershipAdvantages.map((category, i) => (
                <motion.div
                  key={i}
                  className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 border border-[#D4AF37]/20 
                           hover:border-[#D4AF37]/40 transition-all duration-300"
                  variants={fadeUpVariants}
                  transition={{ delay: i * 0.1 }}
                >
                  <h3 className="text-xl font-semibold mb-6 text-[#D4AF37]">{category.category}</h3>
                  
                  <ul className="space-y-3">
                    {category.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-[#D4AF37] mt-1 flex-shrink-0" />
                        <span className="text-gray-300 text-sm leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </Suspense>

      {/* Benefits Section - Enhanced with SEO keywords */}
      <Suspense fallback={null}>
        <motion.section 
          className="py-20 px-6 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
        >
          <Suspense fallback={null}><SubtlePattern /></Suspense>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
                Real Savings with <span className="font-semibold text-[#D4AF37]">Smart Home EV Chargers</span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                Verified benefits from Ampereon users: lower costs, longer battery life, and time savings for home electric vehicle charging.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {metrics.map((metric, i) => {
                const { count, ref } = useCounter(metric.value, 2000);
                
                return (
                  <motion.div
                    key={metric.label}
                    ref={ref}
                    className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 text-center 
                            border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-300
                            h-fit"
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
      </Suspense>

      {/* New Section: EV Charging Technology Comparison */}
      <Suspense fallback={null}>
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
                Ampereon Smart Home EV Charger vs <span className="font-semibold text-[#D4AF37]">Traditional Chargers</span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                Compare smart home EV chargers to standard electric vehicle charging stations and see the value in upgrading.
              </p>
            </motion.div>

            <div className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl border border-[#D4AF37]/20 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-[#D4AF37]/20">
                
                {/* Traditional Charger */}
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-600/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-300">Traditional Home EV Charger</h3>
                  <ul className="space-y-3 text-sm text-gray-400">
                    <li>Requires manual plugging daily</li>
                    <li>Charges during peak rates</li>
                    <li>No battery optimization</li>
                    <li>Basic functionality only</li>
                    <li>Higher ongoing costs</li>
                    <li>No analytics</li>
                  </ul>
                </div>

                {/* Ampereon Smart Charger */}
                <div className="p-8 text-center bg-[#D4AF37]/10 relative">
                  <div className="absolute top-4 right-4">
                    <Award className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 rounded-lg 
                                flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/30">
                    <Zap className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-[#D4AF37]">Ampereon Smart Home EV Charger</h3>
                  <ul className="space-y-3 text-sm text-white">
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-[#D4AF37]" />
                      Automatic connection
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-[#D4AF37]" />
                      Off-peak optimization
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-[#D4AF37]" />
                      AI battery protection
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-[#D4AF37]" />
                      Intelligent scheduling
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-[#D4AF37]" />
                      32% cost reduction
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-[#D4AF37]" />
                      Full analytics dashboard
                    </li>
                  </ul>
                </div>

                {/* Premium EV Chargers */}
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-blue-600/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-300">Premium Home EV Chargers</h3>
                  <ul className="space-y-3 text-sm text-gray-400">
                    <li>Basic WiFi connectivity</li>
                    <li>Limited smart features</li>
                    <li>High cost ($800-2000)</li>
                    <li>Needs pro installation</li>
                    <li>Partial automation</li>
                    <li>Basic app controls</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </Suspense>

      {/* Social Proof - Enhanced with SEO keywords */}
      <Suspense fallback={null}>
       <motion.section 
          className="py-20 px-6 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-light mb-4 text-white">
                Our <span className="font-semibold text-[#D4AF37]">Smart EV Charging Community</span>
              </h2>
              
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="text-2xl font-semibold text-[#D4AF37]">
                  ${Math.floor(totalAmount).toLocaleString()}
                </div>
                <span className="text-gray-300">raised by EV owners for smart home charging innovation</span>
              </div>
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
                    { label: 'Recent Supporters', value: 'recent' },
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
                <h3 className="text-xl font-semibold text-white">EV Owners Backing Smart Home Charging</h3>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <motion.div
                    className="w-8 h-8 border-2 border-[#D4AF37] rounded-full border-t-transparent mr-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-gray-400 text-lg">Loading community supporters...</p>
                </div>
              ) : donorsWithAmounts.length === 0 ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Heart className="w-16 h-16 text-[#D4AF37]/50 mx-auto mb-6" />
                  </motion.div>
                  <h4 className="text-xl font-medium text-white mb-3">Be First to Support Smart EV Charging</h4>
                  <p className="text-gray-400 text-lg max-w-md mx-auto">
                    Join the revolution in home EV charging technology as an early supporter.
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
                              Dedicated to: {donor.dedicateTo}
                            </p>
                          )}
                          <p className="text-gray-500 text-xs mt-1">
                            {donor.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }) || 'Recent'}
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
                    Plus <span className="font-bold text-[#D4AF37]">{donorsWithAmounts.length - 8} more</span> supporters of smart home EV charging!
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
                    Support Smart EV Charging Innovation
                  </motion.button>
                </a>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </Suspense>

      {/* CTA Section - Enhanced with SEO keywords */}
      <Suspense fallback={null}>
        <motion.section 
          className="py-20 px-6 bg-[#0A0A0A] relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
        >
          <Suspense fallback={null}><SubtlePattern /></Suspense>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.h2 
              className="text-4xl md:text-5xl font-light mb-6 leading-tight text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Upgrade to the Best <span className="font-semibold text-[#D4AF37]">Smart Home EV Charger Today</span>
            </motion.h2>
            
            <motion.p 
              className="text-xl mb-10 text-gray-300 max-w-3xl mx-auto font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Join EV owners transforming their home charging with Ampereon's automatic smart EV charger. Secure yours now and save on energy costs.
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
                  Reserve Now - $5 Deposit (Limited Spots)
                </motion.button>
              </a>
              
              <a href="/order">
                <motion.button 
                  className="px-8 py-4 bg-white/5 border border-[#D4AF37]/30 text-white font-semibold rounded-lg 
                          hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  Order Smart EV Charger - $99
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
                <span>30-day refund guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>Free US shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>Expert installation help</span>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </Suspense>
      <OrderChoiceModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} />
    </div>
  );
};

export default AmpereonLanding;