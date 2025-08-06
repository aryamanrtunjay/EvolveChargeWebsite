'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { 
  ChevronDown, Zap, Wifi, DollarSign, Battery, Clock, ChevronRight, Check, 
  Home, Settings, Users, Heart, Star, ArrowRight, Play, Shield,
  TrendingUp, Award, Phone, Mail, Circle, Triangle, Square
} from 'lucide-react';

const AmpereonLanding = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '200%']);

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
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  // Enhanced features with more dynamic presentation
  const features = [
    { 
      icon: <Zap className="w-10 h-10" />, 
      title: "Neural Charging", 
      desc: "AI learns your routine and charges automatically. Zero intervention required.",
      metric: "100%",
      metricLabel: "Automated",
      gradient: "from-[#D4AF37] to-[#B8860B]"
    },
    { 
      icon: <TrendingUp className="w-10 h-10" />, 
      title: "Cost Optimization", 
      desc: "Machine learning maximizes off-peak rates for maximum savings.",
      metric: "40%",
      metricLabel: "Cost Reduction",
      gradient: "from-[#D4AF37] to-[#B8860B]"
    },
    { 
      icon: <Shield className="w-10 h-10" />, 
      title: "Battery Protection", 
      desc: "Advanced algorithms prevent degradation and extend lifespan.",
      metric: "+3yrs",
      metricLabel: "Extended Life",
      gradient: "from-[#D4AF37] to-[#B8860B]"
    },
    { 
      icon: <Wifi className="w-10 h-10" />, 
      title: "Universal Sync", 
      desc: "Seamlessly integrates with any EV and existing charging infrastructure.",
      metric: "All",
      metricLabel: "EV Models",
      gradient: "from-[#D4AF37] to-[#B8860B]"
    }
  ];

  // Testimonials with enhanced presentation
  const testimonials = [
    {
      name: "Marcus Chen",
      role: "Tesla Model S Plaid Owner",
      quote: "This is the future of EV ownership. My car charges itself perfectly every night.",
      rating: 5,
      savings: "$420",
      avatar: "MC"
    },
    {
      name: "Sofia Rodriguez", 
      role: "Lucid Air Dream Owner",
      quote: "The AI optimization is incredible. My electricity bill dropped 45% instantly.",
      rating: 5,
      savings: "$380",
      avatar: "SR"
    },
    {
      name: "David Kim",
      role: "Rivian R1T Driver",
      quote: "Installation was effortless. Now I never think about charging - it just works.",
      rating: 5,
      savings: "$350",
      avatar: "DK"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Navigation items
  const navItems = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#features" },
    { label: "Savings", href: "#savings" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Reserve", href: "#reserve" }
  ];

  return (
    <div className="bg-black text-white overflow-x-hidden relative font-['Inter','Helvetica Neue',sans-serif]">
      {/* Animated background particles like stars */}
      <div className="fixed inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#D4AF37] rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-[#D4AF37]/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-[#D4AF37]">Ampereon</div>
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-[#D4AF37] transition-colors duration-300 font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full font-medium text-sm hover:shadow-[#D4AF37]/30 hover:shadow-md transition-all duration-300"
            whileHover={{ scale: 1.05 }}
          >
            Pre-Order
          </motion.button>
        </div>
      </nav>

      {/* Hero Section with Advanced Effects */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" ref={heroRef}>
        {/* Dynamic video background with parallax */}
        <motion.div 
          className="absolute inset-0 z-10"
          style={{ y: backgroundY }}
        >
          <video
            className="w-full h-[120%] object-cover opacity-30"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://demo.ampereonenergy.com/productDemo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        </motion.div>

        {/* Floating geometric shapes with subtle animation */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 border border-[#D4AF37]/20 rotate-45"
            animate={{ rotate: [45, 225, 45] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-3/4 right-1/4 w-24 h-24 border border-[#D4AF37]/10 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 right-1/3 w-16 h-16 bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-full"
            animate={{ x: [0, 50, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Hero content with refined typography */}
        <motion.div
          className="relative z-30 px-6 max-w-7xl mx-auto text-center"
          style={{ y: textY }}
        >
          {/* Glowing badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/20 backdrop-blur-xl rounded-full px-6 py-2 border border-[#D4AF37]/30 mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Circle className="w-2 h-2 fill-[#D4AF37] text-[#D4AF37] animate-pulse" />
            <span className="text-[#D4AF37] text-sm font-medium tracking-wider uppercase">World's First AI EV Charger</span>
            <Circle className="w-2 h-2 fill-[#D4AF37] text-[#D4AF37] animate-pulse" />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-snug mb-6 tracking-wide"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
          >
            <span className="block">Autonomous</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#D4AF37] animate-gradient-x bg-[length:200%_auto]">
              Charging
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            Experience the future of EV charging. Seamless automation with 
            <span className="text-[#D4AF37] font-medium italic"> AI precision.</span>
          </motion.p>

          {/* Enhanced CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="group relative px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full font-semibold text-lg tracking-wide overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Reserve Now</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#F4D03F] to-[#D4AF37]"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
            
            <motion.button
              className="group px-8 py-3 border-2 border-[#D4AF37]/50 rounded-full font-semibold text-lg hover:bg-[#D4AF37]/10 transition-all duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </span>
            </motion.button>
          </motion.div>

          {/* Floating stats with fun animation */}
          <motion.div
            className="grid grid-cols-3 gap-6 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            {[
              { value: "$325", label: "Saved/Year" },
              { value: "30hrs", label: "Time Saved" },
              { value: "100%", label: "Automated" }
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                className="text-center"
                whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-2xl md:text-3xl font-semibold text-[#D4AF37] mb-1">{stat.value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator with glow */}
        <motion.div 
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-[#D4AF37]/50 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-[#D4AF37] rounded-full mt-2"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section - Tesla-style Cards */}
      <section id="features" className="py-24 px-6 relative">
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-[#B8860B]/5" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 tracking-wide">
              Beyond
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">
                Intelligent
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
              Four cutting-edge technologies crafted for seamless performance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 backdrop-blur-xl border border-zinc-700/50 hover:border-[#D4AF37]/50 transition-all duration-500"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUpVariants}
                transition={{ delay: i * 0.2 }}
                whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                <div className="relative p-8">
                  {/* Icon with glow effect */}
                  <div className="mb-6">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} bg-opacity-20 border border-current text-[#D4AF37] group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-[#D4AF37] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-300 text-base leading-relaxed mb-6">
                    {feature.desc}
                  </p>

                  {/* Metric display */}
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-semibold text-[#D4AF37] mb-1">{feature.metric}</div>
                      <div className="text-xs text-gray-400 uppercase tracking-wider">{feature.metricLabel}</div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-[#D4AF37] group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Savings Section - Futuristic Design with interactive counters */}
      <section id="savings" className="py-24 px-6 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-zinc-900 to-black" />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-24 bg-gradient-to-b from-transparent via-[#D4AF37]/20 to-transparent"
              style={{
                left: `${(i + 1) * 5}%`,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
              animate={{
                scaleY: [1, 1.5, 1],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 tracking-wide">
              Quantified
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">
                Impact
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Annual Savings", value: 325, prefix: "$", suffix: "", desc: "Smart scheduling optimization" },
              { title: "Time Recovered", value: 30, prefix: "", suffix: "hrs", desc: "Complete automation" },
              { title: "Battery Extension", value: 3, prefix: "+", suffix: "yrs", desc: "AI health protection" }
            ].map((stat, i) => {
              const { count, ref } = useCounter(stat.value, 3000);
              
              return (
                <motion.div
                  key={i}
                  ref={ref}
                  className="relative group"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUpVariants}
                  transition={{ delay: i * 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-[#B8860B]/10 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                  
                  <div className="relative bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-8 border border-zinc-700/50 hover:border-[#D4AF37]/50 transition-all duration-500">
                    <div className="text-center">
                      <div className="text-4xl font-semibold text-[#D4AF37] mb-3">
                        {stat.prefix}{count}{stat.suffix}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-white">{stat.title}</h3>
                      <p className="text-gray-400 text-base">{stat.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials - Holographic Style with slide animation */}
      <section id="testimonials" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 tracking-wide">
              Owner
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">
                Validation
              </span>
            </h2>
          </motion.div>

          {/* Enhanced testimonial carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  className={`${i === currentTestimonial ? 'block' : 'hidden'}`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: i === currentTestimonial ? 1 : 0, x: i === currentTestimonial ? 0 : 100 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/50 backdrop-blur-xl rounded-2xl p-10 border border-zinc-700/50">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-lg font-semibold text-black">
                          {testimonial.avatar}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-center lg:text-left">
                        <div className="flex justify-center lg:justify-start mb-4">
                          {[...Array(5)].map((_, starI) => (
                            <Star key={starI} className="w-5 h-5 text-[#D4AF37] fill-current" />
                          ))}
                        </div>
                        
                        <blockquote className="text-lg md:text-xl italic mb-4 leading-relaxed text-gray-100">
                          "{testimonial.quote}"
                        </blockquote>
                        
                        <div className="flex flex-col lg:flex-row items-center gap-4">
                          <div>
                            <div className="font-semibold text-base text-white">{testimonial.name}</div>
                            <div className="text-gray-400 text-sm">{testimonial.role}</div>
                          </div>
                          <div className="px-3 py-1 bg-[#D4AF37]/20 rounded-full border border-[#D4AF37]/30">
                            <span className="text-[#D4AF37] text-sm font-semibold">Saved {testimonial.savings}/year</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`w-10 h-2 rounded-full transition-all duration-300 ${
                    i === currentTestimonial 
                      ? 'bg-[#D4AF37] scale-110' 
                      : 'bg-zinc-600 hover:bg-zinc-500'
                  }`}
                  onClick={() => setCurrentTestimonial(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Dramatic with urgency */}
      <section id="reserve" className="py-24 px-6 relative overflow-hidden">
        {/* Dynamic background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-black to-[#B8860B]/10" />
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_70%)]"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
          >
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 tracking-wide">
              Secure Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">
                Future
              </span>
            </h2>
            
            <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed">
              Limited production run. Reserve your autonomous charging system today and join the revolution.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button 
                onClick={() => setIsModalOpen(true)}
                className="group relative px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full font-semibold text-lg tracking-wide overflow-hidden"
                whileHover={{ scale: 1.05, rotate: [0, 5, -5, 0] }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Reserve Now - $5</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#F4D03F] to-[#D4AF37]"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              
              <div className="text-gray-400 text-base">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>30-day guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>Free installation support</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Modal */}
      {isModalOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-8 max-w-md w-full border border-[#D4AF37]/30 relative overflow-hidden"
            initial={{ scale: 0.8, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 to-[#B8860B]/10 blur-xl" />
            
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-4 text-center">Reserve Your Ampereon</h3>
              <p className="text-gray-300 mb-6 text-center text-base">
                Secure your spot in the first production run for just $5.
              </p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border-2 border-zinc-600 text-white rounded-lg hover:bg-zinc-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button className="flex-1 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/25 transition-all duration-200 font-semibold">
                  Reserve Now
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Custom CSS for animations and typography */}
      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        html {
          font-family: 'Inter', 'Helvetica Neue', sans-serif;
        }
        a[href] {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default AmpereonLanding;