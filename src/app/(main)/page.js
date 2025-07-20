'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, useInView } from 'framer-motion';
import { ChevronDown, Zap, Wifi, DollarSign, Battery, Clock, ChevronRight, Check, Home, Settings, Users, Heart } from 'lucide-react';
import { db } from "../firebaseConfig.js";
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import OrderChoiceModal from '../../components/OrderChoiceModal';

// Lazy load non-critical components
const SubtlePattern = React.lazy(() => Promise.resolve({ default: ({ opacity = 0.03 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <div className="w-full h-full bg-[radial-gradient(circle,#D4AF37_1px,transparent_1px)] bg-[size:60px_60px]" />
  </div>
) }));

const AmpereonLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [activeStep, setActiveStep] = useState(0);
  const [activeComponent, setActiveComponent] = useState(0);

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

  // Merged features with benefits for more value per item
  const features = [
    { 
      icon: <Zap className="w-6 h-6" />, 
      title: "Automatic Home EV Charger", 
      desc: "Hands-free charging activates on arrival, eliminating daily plugging. Compatible with all Level 2 chargers, saving 5 minutes per session (30 hours/year).", 
      stats: [{ value: "30hrs", label: "Time saved/year" }]
    },
    { 
      icon: <Wifi className="w-6 h-6" />, 
      title: "Universal Compatibility & Integration", 
      desc: "Seamless upgrade for existing home EV stations. AI integrates with utility rates and EV data for optimized scheduling, supporting all major EV models.", 
      stats: [{ value: "100%", label: "EV compatibility" }]
    },
    { 
      icon: <DollarSign className="w-6 h-6" />, 
      title: "Cost Savings & Efficiency", 
      desc: "AI shifts charging to off-peak hours, cutting costs by up to 40% ($325/year average). Includes tax credit eligibility and real-time cost tracking.", 
      stats: [{ value: "40%", label: "Cost reduction" }]
    },
    { 
      icon: <Battery className="w-6 h-6" />, 
      title: "Battery Health & Sustainability", 
      desc: "Machine learning prevents overcharging, extending battery life by 3 years. Maximizes renewable energy use, reducing carbon footprint by 20-30%.", 
      stats: [{ value: "3yrs", label: "Battery extension" }]
    }
  ];

  const steps = [
    { 
      num: "01", 
      title: "Installation", 
      desc: "Attach to existing charger in 30 minutes - no electrician needed. Includes hardware and guided app setup.", 
      icon: Zap,
      detail: "DIY with video tutorials; compatible with all Level 2 units."
    },
    { 
      num: "02", 
      title: "Setup & Integration", 
      desc: "Connect via WiFi and pair with your EV. App detects vehicle and utility rates automatically.", 
      icon: Wifi,
      detail: "Secure setup in 2 minutes; OTA updates for future compatibility."
    },
    { 
      num: "03", 
      title: "Automated Charging", 
      desc: "AI learns your routine to charge optimally. Adjusts for weather, rates, and battery needs.", 
      icon: Battery,
      detail: "Custom profiles and remote overrides via app."
    },
    { 
      num: "04", 
      title: "Monitoring & Insights", 
      desc: "Track savings, usage, and eco-impact with detailed analytics and monthly reports.", 
      icon: Clock,
      detail: "Export data for tax purposes; shareable reports."
    }
  ];

  const stepContent = [
    {
      title: "Professional Home EV Charger Installation",
      icon: Zap,
      description: "Simple DIY attachment to your wall unit. No wiring changes; full compatibility verified pre-purchase.",
      stats: [
        { value: "30min", label: "Install time" },
        { value: "100%", label: "Compatibility" }
      ],
      features: [
        "No electrician required",
        "All hardware included",
        "Video-guided process",
        "Reversible installation"
      ]
    },
    {
      title: "Smart Home EV Charging Setup",
      icon: Wifi,
      description: "App-based WiFi connection and EV pairing. Automatic detection of utility providers for rate optimization.",
      stats: [
        { value: "2min", label: "Setup time" },
        { value: "All", label: "EV models" }
      ],
      features: [
        "Auto rate detection",
        "Secure encryption",
        "Multi-user support",
        "API integrations"
      ]
    },
    {
      title: "Intelligent Home Electric Vehicle Charging",
      icon: Battery,
      description: "AI adapts to your schedule, energy prices, and grid demands. Includes emergency charge override.",
      stats: [
        { value: "32%", label: "Avg savings" },
        { value: "24/7", label: "Monitoring" }
      ],
      features: [
        "Routine learning",
        "Grid-aware charging",
        "Battery protection",
        "Vacation mode"
      ]
    },
    {
      title: "Advanced Home EV Charging Analytics",
      icon: Clock,
      description: "Comprehensive dashboard with cost breakdowns, CO2 savings, and predictive analytics for future usage.",
      stats: [
        { value: "$325", label: "Yearly savings" },
        { value: "Real-time", label: "Updates" }
      ],
      features: [
        "Custom reports",
        "Trend analysis",
        "Export options",
        "Benchmarking"
      ]
    }
  ];

  // Components for Ace Charger
  const aceComponents = [
    { 
      num: "01", 
      title: "Ace System Overview", 
      shortDesc: "The complete automated charging solution",
      icon: Home
    },
    { 
      num: "02", 
      title: "Ace Traverse", 
      shortDesc: "The driver module that glides across garage rails",
      icon: Zap
    },
    { 
      num: "03", 
      title: "Ace Grip", 
      shortDesc: "Secure holder for the charging plug",
      icon: Battery
    },
    { 
      num: "04", 
      title: "Ace Coil", 
      shortDesc: "Spool holder for the steel wire system",
      icon: Settings
    }
  ];

  const aceContent = [
    {
      title: "Ace System Overview",
      description: "Ampereon's Ace is the world's first fully automated home EV charging system, combining AI intelligence with mechanical precision to deliver hands-free charging anywhere in your garage.",
      image: "https://images.ampereonenergy.com/WholeRender.png",
      features: [
        "Full garage coverage",
        "AI-powered automation",
        "Universal EV compatibility",
        "Easy DIY installation"
      ]
    },
    {
      title: "Ace Traverse",
      description: "The dynamic driver module that moves smoothly across the rails at the top of your garage, automatically positioning the charger exactly where your EV is parked for seamless connection.",
      image: "https://images.ampereonenergy.com/Traverse.PNG",
      features: [
        "Smooth rail-gliding mechanism",
        "AI-powered positioning",
        "Durable all-weather construction",
        "Quick and silent operation"
      ]
    },
    {
      title: "Ace Grip",
      description: "This innovative plug holder securely cradles your EV charging cable, ensuring stable connection during automated charging while protecting the plug from damage when not in use.",
      image: "https://images.ampereonenergy.com/Holder.PNG",
      features: [
        "Secure magnetic locking",
        "Universal plug compatibility",
        "Weather-resistant materials",
        "Easy release mechanism"
      ]
    },
    {
      title: "Ace Coil",
      description: "The robust spool holder manages the steel wire that spans across your garage, providing the backbone for the traverse system while maintaining optimal tension for reliable performance.",
      image: "https://images.ampereonenergy.com/Spoolholder.png",
      features: [
        "High-tension steel wire management",
        "Automatic tension adjustment",
        "Corrosion-resistant spool",
        "Simple wire replacement"
      ]
    }
  ];

  // Merged metrics with ownership advantages and comparison for deeper value
  const savingsMetrics = [
    { 
      value: 325, prefix: "$", suffix: "", label: "Annual Savings", 
      how: "32% reduction via off-peak optimization; vs traditional chargers ($0 savings) or premium ($200 avg). Eligible for $500+ tax credits.", 
      icon: <DollarSign className="w-5 h-5" />,
      advantages: ["Lower bills than manual charging", "No replacement costs", "Qualifies for incentives"]
    },
    { 
      value: 3, prefix: "", suffix: " years", label: "Battery Life Extension", 
      how: "40% less degradation than basic chargers; adds 3 years vs traditional overcharging risks.", 
      icon: <Battery className="w-5 h-5" />,
      advantages: ["AI health monitoring", "Overcharge prevention", "Longer warranty coverage"]
    },
    { 
      value: 30, prefix: "", suffix: " hours", label: "Time Saved Yearly", 
      how: "Automation vs manual plugging; outperforms premium chargers with full hands-free operation.", 
      icon: <Clock className="w-5 h-5" />,
      advantages: ["App notifications", "Remote management", "Adaptive routines"]
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Kirit S",
      role: "Tesla Owner",
      quote: "This charger has revolutionized my daily routine. No more plugging in every night!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    },
    {
      name: "Andreas G",
      role: "Rivian Driver",
      quote: "The AI optimization saved me hundreds on my electricity bill. Highly recommended!",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    },
    {
      name: "Vivaan P",
      role: "Ford F-150 Lightning Owner",
      quote: "Easy installation and seamless integration. Battery life has noticeably improved.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    },
    {
      name: "Peter Z",
      role: "Chevy Bolt EV User",
      quote: "Hands-free charging is a game-changer. The app insights are incredibly useful.",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
  ];

  return (
    <div className="bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-visible"
        ref={heroRef}
      >
        <motion.div className="absolute inset-0 z-0 pointer-events-none opacity-30">
          <img
            src="https://demo.ampereonenergy.com/productDemo.mp4"
            alt="Smart Home EV Charger Demo - Automatic Electric Vehicle Charging"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1A1A1A]/20 to-[#1A1A1A]/40" />

        {/* Hero content with added value (savings preview) */}
        <motion.div
          className="relative z-10 px-6 max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-light leading-tight mb-8 text-white"
              style={{ fontSize: 'clamp(2.5rem,5.5vw,4rem)' }}>
            Tomorrow's charging innovation <br />
            <span className="font-bold text-[#D4AF37]">
              delivered today.
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            Automate EV charging, cut your electricity bill by 40%, extend your car's battery life by 3 years, all without touching your charger once.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 mb-12">
            <button
              className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium rounded-lg
                        hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300"
              onClick={openModal}
            >
              Reserve Now for $5
            </button>

            <a href="/product" className="hidden sm:block">
              <button
                className="px-8 py-4 border border-[#D4AF37]/30 text-white font-medium rounded-lg
                          hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-300 backdrop-blur-sm"
              >
                <span className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4" />
                  Learn More
                </span>
              </button>
            </a>
          </div>

          {/* Enhanced trust with specifics */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>30-Day Money-Back + Free Returns</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>2-Year Warranty + Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#D4AF37]" />
              <span>Free Shipping in Washington</span>
            </div>
          </div>
        </motion.div>

        {/* Static scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent mb-2" />
          <ChevronDown className="w-5 h-5 text-[#D4AF37]/70" />
        </div>
      </section>

      {/* Merged Features & Benefits - Added stats per feature for value */}
      <Suspense fallback={null}>
        <motion.section 
          className="py-20 px-6 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
        >
          <Suspense fallback={null}><SubtlePattern /></Suspense>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
                Core Benefits of Ampereon's <span className="font-semibold text-[#D4AF37]">Smart Home EV Charger</span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                AI automation for all EV models: save money, extend battery, enhance sustainability - seamless upgrade to your home charging station.
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
                        <p className="text-gray-300 leading-relaxed mb-4">{feature.desc}</p>
                        <div className="grid grid-cols-1 gap-2">
                          {feature.stats.map((stat, j) => (
                            <div key={j} className="bg-[#D4AF37]/10 rounded-lg p-3 text-center border border-[#D4AF37]/20">
                              <div className="text-lg font-bold text-[#D4AF37]">{stat.value}</div>
                              <div className="text-xs text-gray-300">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </Suspense>

      {/* Meet Ampereon's Charger Ace */}
      <Suspense fallback={null}>
        <motion.section 
          className="py-20 px-6 bg-[#0A0A0A]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
                Meet Ampereon's Charger: <span className="font-semibold text-[#D4AF37]">Ace</span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                Discover the key components that make Ace the smartest EV charger upgrade. Click through each part.
              </p>
            </motion.div>

            {/* Component selector */}
            <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              {aceComponents.map((component, index) => {
                const IconComponent = component.icon;
                
                return (
                  <motion.div 
                    key={index}
                    className={`cursor-pointer relative z-10 text-center bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-6 border ${
                      activeComponent === index ? 'border-[#D4AF37]/40 shadow-lg shadow-[#D4AF37]/20' : 'border-[#D4AF37]/20'
                    } hover:border-[#D4AF37]/40 transition-all duration-300`}
                    onClick={() => setActiveComponent(index)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUpVariants}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="relative mb-6">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto shadow-lg mb-4 transition-colors duration-300 ${
                        activeComponent === index ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B]' : 'bg-[#2A2A2A]'
                      }`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-sm font-medium text-[#D4AF37] mb-2">
                        COMPONENT {component.num}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 text-white">
                      {component.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{component.shortDesc}</p>
                  </motion.div>
                );
              })}
            </div>

            <div key={activeComponent} className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 border border-[#D4AF37]/20">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="md:w-1/2">
                  <h3 className="text-3xl font-light mb-4 text-white">{aceContent[activeComponent].title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">{aceContent[activeComponent].description}</p>
                  
                  <ul className="space-y-3">
                    {aceContent[activeComponent].features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-300">
                        <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                        <span className="text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:w-1/2">
                  <img 
                    src={aceContent[activeComponent].image} 
                    alt={aceContent[activeComponent].title}
                    className="w-full h-auto object-contain rounded-lg"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </Suspense>

      {/* How It Works - Added details and features for value */}
      <Suspense fallback={null}>
        <motion.section 
          className="py-20 px-6 bg-[#0A0A0A]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
                Simple Setup for <span className="font-semibold text-[#D4AF37]">Automated Home EV Charging</span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                From installation to daily use: transform your charging in 4 steps. Includes compatibility checker and professional support.
              </p>
            </motion.div>

            {/* Step selector with enhanced content */}
            <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="hidden lg:block absolute top-[40px] left-[calc(50%-2px)] w-[calc(100%-4rem)] h-0.5 bg-[#D4AF37]/20 transform -translate-x-1/2" style={{top: '40px'}} />

              {steps.map((step, index) => {
                const IconComponent = step.icon;
                
                return (
                  <motion.div 
                    key={index}
                    className={`cursor-pointer relative z-10 text-center bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-6 border ${
                      activeStep === index ? 'border-[#D4AF37]/40 shadow-lg shadow-[#D4AF37]/20' : 'border-[#D4AF37]/20'
                    } hover:border-[#D4AF37]/40 transition-all duration-300`}
                    onClick={() => setActiveStep(index)}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUpVariants}
                    transition={{ delay: index * 0.15 }}
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
                    <p className="text-gray-400 text-xs mt-2">{step.detail}</p>
                  </motion.div>
                );
              })}
            </div>

            <div key={activeStep} className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 border border-[#D4AF37]/20">
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

              <p className="text-gray-600 text-xs text-center mb-8">*Stats are based on user data</p>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stepContent[activeStep].features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>
      </Suspense>

      {/* Merged Savings & Comparison - Added advantages and comparisons for value */}
      <Suspense fallback={null}>
        <motion.section 
          className="py-20 px-6 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
        >
          <Suspense fallback={null}><SubtlePattern /></Suspense>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
                Proven Savings vs <span className="font-semibold text-[#D4AF37]">Traditional Chargers</span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                Real user outcomes: superior to basic and premium options with quantified ROI, advantages, and direct comparisons.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {savingsMetrics.map((metric, i) => {
                const { count, ref } = useCounter(metric.value, 2000);
                
                return (
                  <motion.div
                    key={metric.label}
                    ref={ref}
                    className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-6 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-300"
                    variants={fadeUpVariants}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="text-[#D4AF37]">
                        {metric.icon}
                      </div>
                    </div>
                    
                    <div className="text-3xl font-semibold text-white mb-2">
                      {metric.prefix}{metric.value}{metric.suffix}
                    </div>
                    
                    <h3 className="text-lg font-medium mb-4 text-white">{metric.label}</h3>
                    
                    <p className="text-gray-300 text-sm mb-4">{metric.how}</p>
                    
                    <ul className="space-y-2">
                      {metric.advantages.map((adv, j) => (
                        <li key={j} className="flex items-center gap-2 text-gray-300 text-sm">
                          <Check className="w-4 h-4 text-[#D4AF37]" />
                          {adv}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>
      </Suspense>

      {/* Testimonials Section */}
      <Suspense fallback={null}>
        <motion.section 
          className="py-20 px-6 bg-[#0A0A0A]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
        >
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
                What Our <span className="font-semibold text-[#D4AF37]">Customers Say</span>
              </h2>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
                Hear from EV owners who have transformed their charging experience with Ampereon.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-6 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-300"
                  variants={fadeUpVariants}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{testimonial.quote}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <a href="/support-us">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold rounded-lg 
                            hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Support The Mission
                </motion.button>
              </a>
            </div>
          </div>
        </motion.section>
      </Suspense>

      {/* CTA Section - Added limited spots for value */}
      <Suspense fallback={null}>
        <motion.section 
          className="py-20 px-6 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
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
              Secure Your <span className="font-semibold text-[#D4AF37]">Smart EV Charger</span> Today
            </motion.h2>
            
            <motion.p 
              className="text-xl mb-10 text-gray-300 max-w-3xl mx-auto font-light"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Limited production run: automate charging, save $325/year, join 1,000+ satisfied EV owners. Includes free setup consultation.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <a href="/reserve">
                <button 
                  className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold rounded-lg 
                          hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300"
                >
                  Reserve - $5 (Limited)
                </button>
              </a>
              
              <a href="/order">
                <button 
                  className="px-8 py-4 bg-white/5 border border-[#D4AF37]/30 text-white font-semibold rounded-lg 
                          hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-300 backdrop-blur-sm"
                >
                  Order - $99
                </button>
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
                <span>30-day guarantee + consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>Free shipping in Washington</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#D4AF37]" />
                <span>Expert EV support</span>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </Suspense>
      <OrderChoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default AmpereonLanding;