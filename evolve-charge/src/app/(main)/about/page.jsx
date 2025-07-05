'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Zap, Clock, Target, Lightbulb, Users, Award, ChevronDown, ArrowRight, Star, Heart, Battery, Wifi, Globe, Shield, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { FaXTwitter } from "react-icons/fa6";
import OrderChoiceModal from '@/components/OrderChoiceModal';

// Enhanced animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

// Modern glassmorphism team member cards
function TeamMember({ name, role1, role2, bio, image, linkedin, x, delay = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
        visible: { 
          opacity: 1, 
          scale: 1,
          rotateY: 0,
          transition: { delay, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
        }
      }}
      className="group relative perspective-1000"
    >
      {/* Modern gradient card with glassmorphism */}
      <motion.div 
        className="relative bg-gradient-to-br from-[#2A2A2A]/90 via-[#1A1A1A]/80 to-[#2A2A2A]/70 backdrop-blur-xl 
                   rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden
                   hover:shadow-[#D4AF37]/20 hover:shadow-3xl transition-all duration-700"
        whileHover={{ rotateY: 5, z: 50 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Animated background gradient */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-[#B8860B]/5"
          animate={{ rotate: isHovered ? 180 : 0 }}
          transition={{ duration: 0.8 }}
        />
        
        {/* Modern mesh pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" className="text-[#D4AF37]">
            <defs>
              <pattern id="mesh" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mesh)" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Hexagonal image container */}
          <div className="relative mb-8 flex justify-center">
            <motion.div 
              className="relative w-32 h-32"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-full h-full rounded-3xl bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 
                            shadow-2xl border-2 border-[#D4AF37]/30 overflow-hidden backdrop-blur-sm">
                {image ? (
                  <img 
                    src={image.src} 
                    alt={image.alt || name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] 
                                flex items-center justify-center text-white text-2xl font-light">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                )}
              </div>
              
              {/* Floating ring animation */}
              <motion.div
                className="absolute inset-0 rounded-3xl border-2 border-[#D4AF37]/40"
                animate={{ 
                  scale: isHovered ? [1, 1.2, 1] : 1,
                  opacity: isHovered ? [0.4, 0.8, 0.4] : 0
                }}
                transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
              />
            </motion.div>
          </div>
          
          {/* Content with modern typography */}
          <div className="text-center space-y-4">
            <motion.h3 
              className="text-2xl font-semibold text-white tracking-tight"
              whileHover={{ scale: 1.05 }}
            >
              {name}
            </motion.h3>
            
            <div className="space-y-1">
              <p className="text-[#D4AF37] font-medium text-sm uppercase tracking-wider">{role1}</p>
              {role2 && <p className="text-[#D4AF37] font-medium text-sm uppercase tracking-wider">{role2}</p>}
            </div>
            
            <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent my-6" />
            
            <p className="text-gray-300 leading-relaxed text-base">{bio}</p>
            
            {/* Modern social links */}
            <div className="flex justify-center gap-4 pt-6">
              {linkedin && (
                <motion.a 
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 
                           text-[#D4AF37] rounded-2xl flex items-center justify-center 
                           hover:from-[#D4AF37]/30 hover:to-[#B8860B]/30 transition-all duration-300 
                           backdrop-blur-sm border border-[#D4AF37]/20"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </motion.a>
              )}
              {x && (
                <motion.a 
                  href={x}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 
                           text-[#D4AF37] rounded-2xl flex items-center justify-center 
                           hover:from-[#D4AF37]/30 hover:to-[#B8860B]/30 transition-all duration-300 
                           backdrop-blur-sm border border-[#D4AF37]/20"
                >
                  <FaXTwitter className="w-6 h-6" />
                </motion.a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Minimalist value cards with unique layouts
function ValueCard({ icon, title, description, index }) {
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0, x: isEven ? -50 : 50 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { delay: index * 0.2, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
        }
      }}
      className="group relative"
    >
      {/* Asymmetric card design */}
      <div className={`relative ${isEven ? 'ml-8' : 'mr-8'} p-12 
                      bg-gradient-to-${isEven ? 'br' : 'bl'} from-[#2A2A2A] to-[#1A1A1A] 
                      ${isEven ? 'rounded-tl-3xl rounded-br-3xl rounded-tr-lg rounded-bl-lg' : 'rounded-tr-3xl rounded-bl-3xl rounded-tl-lg rounded-br-lg'}
                      border-l-4 border-[#D4AF37] shadow-xl hover:shadow-2xl
                      transition-all duration-500 overflow-hidden`}>
        
        {/* Diagonal accent line */}
        <div className={`absolute ${isEven ? 'top-0 right-0' : 'top-0 left-0'} w-24 h-24 
                        bg-gradient-to-${isEven ? 'bl' : 'br'} from-[#D4AF37]/10 to-transparent 
                        ${isEven ? 'rounded-bl-full' : 'rounded-br-full'}`} />
        
        <div className="relative z-10">
          {/* Icon with modern treatment */}
          <motion.div 
            className={`inline-flex items-center justify-center w-16 h-16 mb-8
                       bg-gradient-to-br from-[#D4AF37] to-[#B8860B] 
                       ${isEven ? 'rounded-tr-2xl rounded-bl-2xl' : 'rounded-tl-2xl rounded-br-2xl'}
                       shadow-lg text-white`}
            whileHover={{ rotate: isEven ? 15 : -15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {icon}
          </motion.div>
          
          <h3 className="text-2xl font-bold text-white mb-6 tracking-tight">{title}</h3>
          <p className="text-gray-300 leading-relaxed text-lg font-light">{description}</p>
          
          {/* Modern accent element */}
          <div className={`mt-8 w-16 h-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] 
                          ${isEven ? 'rounded-r-full' : 'rounded-l-full ml-auto'}`} />
        </div>
      </div>
    </motion.div>
  );
}

// Advanced story section with split-screen design
const StorySection = () => {
  const [activeStoryPoint, setActiveStoryPoint] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStoryPoint((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const storyPoints = [
    {
      icon: Clock,
      title: "The Problem",
      description: "Ampereon was born from a simple frustration: why should charging your electric vehicle be any more complicated than parking in your garage? Our founders, both EV owners and engineers, experienced the daily hassle of manually plugging and unplugging their vehicles.",
      number: "01"
    },
    {
      icon: Target,
      title: "The Vision", 
      description: "After researching the market, we discovered that while EVs had advanced tremendously, charging infrastructure remained stuck in the past. We envisioned a world where your vehicle charges automatically, intelligently, and cost-effectively without any manual intervention.",
      number: "02"
    },
    {
      icon: Zap,
      title: "The Solution",
      description: "What started as a weekend project in a garage has grown into a dedicated team of engineers, designers, and EV enthusiasts working to make this vision a reality. Today, we're proud to introduce the world's first truly automatic EV charger.",
      number: "03"
    }
  ];

  return (
    <section className="py-32 px-6 bg-[#1A1A1A] text-white relative overflow-hidden">
      {/* Futuristic grid background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] via-[#1A1A1A] to-[#0A0A0A]" />
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#D4AF37" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Floating orbs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
        >
          <h2 className="text-6xl md:text-8xl font-extralight mb-8 tracking-tighter text-white">
            Our <span className="font-medium text-[#D4AF37] italic">Story</span>
          </h2>
          
          <div className="flex justify-center mb-8">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          </div>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            From a simple frustration to a revolutionary solution
          </p>
        </motion.div>

        {/* Split screen layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch min-h-[600px]">
          {/* Left: Interactive timeline */}
          <div className="space-y-6">
            {storyPoints.map((point, index) => {
              const IconComponent = point.icon;
              const isActive = activeStoryPoint === index;
              
              return (
                <motion.div 
                  key={index}
                  className={`relative cursor-pointer transition-all duration-700 ${
                    isActive ? 'scale-105' : 'hover:scale-102'
                  }`}
                  onMouseEnter={() => setActiveStoryPoint(index)}
                  onClick={() => setActiveStoryPoint(index)}
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
                  {/* Modern timeline item */}
                  <div className={`relative p-8 rounded-2xl border transition-all duration-500
                                 ${isActive 
                                   ? 'bg-gradient-to-r from-[#D4AF37]/10 to-[#B8860B]/5 border-[#D4AF37]/40 shadow-2xl shadow-[#D4AF37]/20' 
                                   : 'bg-white/5 border-white/10 hover:border-[#D4AF37]/20 backdrop-blur-sm'
                                 }`}>
                    
                    <div className="flex items-center gap-6">
                      {/* Modern step indicator */}
                      <div className={`relative flex items-center justify-center w-16 h-16 rounded-xl
                                     transition-all duration-500 ${
                                       isActive 
                                         ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] shadow-lg shadow-[#D4AF37]/30' 
                                         : 'bg-white/10 border border-white/20'
                                     }`}>
                        <IconComponent className={`w-8 h-8 ${isActive ? 'text-white' : 'text-[#D4AF37]'}`} />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`text-2xl font-semibold mb-2 transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-gray-300'
                        }`}>
                          {point.title}
                        </h3>
                        <div className="text-[#D4AF37] font-medium text-sm tracking-wider">
                          STEP {point.number}
                        </div>
                      </div>

                      {/* Active indicator */}
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

          {/* Right: Content display with modern styling */}
          <div className="relative">
            <div className="sticky top-8">
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl 
                            border border-white/20 rounded-3xl p-12 min-h-[500px] 
                            shadow-2xl overflow-hidden">
                
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStoryPoint}
                      initial={{ opacity: 0, y: 30, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -30, scale: 0.95 }}
                      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      {/* Modern icon container */}
                      <motion.div 
                        className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] 
                                  rounded-2xl flex items-center justify-center mb-8 shadow-xl"
                        whileHover={{ rotate: 5, scale: 1.05 }}
                      >
                        {React.createElement(storyPoints[activeStoryPoint].icon, { 
                          className: "w-10 h-10 text-white" 
                        })}
                      </motion.div>

                      <h3 className="text-4xl font-bold text-white mb-6 tracking-tight">
                        {storyPoints[activeStoryPoint].title}
                      </h3>
                      
                      <p className="text-xl leading-relaxed text-gray-300 mb-8 font-light">
                        {storyPoints[activeStoryPoint].description}
                      </p>

                      {/*Modern step indicator */}
                      <div className="flex items-center gap-4">
                        <div className="px-6 py-3 bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/20 
                                      text-[#D4AF37] font-bold rounded-full border border-[#D4AF37]/30
                                      backdrop-blur-sm text-sm tracking-wider">
                          STEP {storyPoints[activeStoryPoint].number}
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
            {storyPoints.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setActiveStoryPoint(index)}
                className={`relative h-3 rounded-full transition-all duration-500 overflow-hidden ${
                  activeStoryPoint === index ? 'w-16' : 'w-3 hover:w-6'
                }`}
                whileHover={{ scale: 1.1 }}
              >
                <div className={`h-full transition-all duration-500 ${
                  activeStoryPoint === index 
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B]' 
                    : 'bg-gray-600 hover:bg-[#D4AF37]/50'
                }`} />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function AboutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 500], [0, 20]);

  const teamMembers = [
    {
      name: "Aryaman Rtunjay",
      role1: "Co-Chief Executive Officer",
      role2: "Co-Founder",
      bio: "Aryaman shapes Ampereon's vision and strategy, leading with unparalleled expertise in end-to-end engineering. He designs and implements the core technology behind the company's innovative chargers, driving transformative impact.",
      linkedin: "https://linkedin.com/in/aryaman-rtunjay",
      x: "https://x.com/aryamanrtunjay",
      image: { src: "/images/aryaman.jpeg", alt: "AR" }
    },
    {
      name: "Bhanu Atmakuri",
      role1: "Co-Chief Executive Officer",
      role2: "Co-Founder",
      bio: "Bhanu fuels Ampereon's innovation, leading product development with expertise in Python, JavaScript, C, and PCB design. He is instrumental in bringing the company's patent-pending smart chargers from concept to reality.",
      linkedin: "https://www.linkedin.com/in/bhanu-atmakuri-9499752b3/",
      image: { src: "/images/bhanu.jpeg", alt: "BA" }
    },
    {
      name: "Shruthika Balasubramanian",
      role1: "Chief Marketing Officer",
      role2: "Co-Founder",
      bio: "Shruthika spearheads Ampereon's marketing strategy, leveraging her passion for computer science and sustainability. As CMO, she designs targeted campaigns and compelling brand stories that highlight the company's eco-friendly mission.",
      linkedin: "https://www.linkedin.com/in/shruthika-balasubramanian-233634369/",
      image: { src: "/images/shruthika.jpeg", alt: "SB" }
    }
  ];

  const values = [
    {
      icon: <Lightbulb className="w-10 h-10" />,
      title: "Innovation First",
      description: "We believe in pushing boundaries and challenging the status quo. Every product we create represents a leap forward in EV charging technology, built with cutting-edge AI and sustainable practices."
    },
    {
      icon: <Heart className="w-10 h-10" />,
      title: "Customer Obsession",
      description: "Our customers drive everything we do. We listen, iterate, and continuously improve based on real user feedback and experiences, ensuring every interaction exceeds expectations."
    },
    {
      icon: <Battery className="w-10 h-10" />,
      title: "Sustainability",
      description: "We're committed to accelerating the world's transition to sustainable transportation through intelligent, efficient charging solutions that reduce environmental impact."
    }
  ];

  return (
    <div className="bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* Hero Section - Cinematic with floating elements */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Sophisticated layered background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-[#1A1A1A]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/5 via-transparent to-transparent" />
        </div>
        
        {/* Animated orbs */}
        <motion.div 
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-[#D4AF37]/5 to-transparent rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        />
        
        <motion.div
          className="relative z-10 px-6 text-center"
          style={{ y: heroParallax }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Modern glassmorphism hero card */}
          <div className="backdrop-blur-2xl bg-[#0A0A0A]/70 border border-white/10 rounded-[2rem] p-16 max-w-6xl mx-auto 
                        shadow-[0_8px_32px_rgba(0,0,0,0.1)] relative overflow-hidden">
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative z-10"
            >
              {/* Modern badge */}
              <div className="inline-flex items-center gap-3 text-sm font-medium text-[#D4AF37] 
                           bg-gradient-to-r from-[#D4AF37]/20 to-[#B8860B]/20 backdrop-blur-sm 
                           px-8 py-4 rounded-full mb-8 border border-[#D4AF37]/20">
                <Users className="w-4 h-4" />
                <span className="tracking-wide">About Ampereon</span>
              </div>
              
              {/* Modern typography treatment */}
              <h1 className="font-extralight tracking-tighter leading-[0.9] mb-8 text-white"
                  style={{ fontSize: 'clamp(3.5rem,7vw,5.5rem)' }}>
                Pioneering the{' '}
                <span className="font-bold bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent">
                  Future
                </span>
                <br />
                of EV Charging
              </h1>

              <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
                We're building intelligent automation that makes electric vehicle ownership effortless, 
                accessible, and truly sustainable for everyone.
              </p>

              {/* Modern CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.button
                  className="group px-12 py-5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold rounded-2xl
                            shadow-xl hover:shadow-2xl hover:shadow-[#D4AF37]/30 transition-all duration-300
                            focus:ring-2 focus:ring-[#D4AF37]/40 relative overflow-hidden"
                  onClick={() => setIsModalOpen(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Join Our Mission
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  
                  {/* Button shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Story Section */}
      <StorySection />

      {/* Mission & Values Section - Asymmetric design */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-[#1A1A1A] relative overflow-hidden">
        {/* Geometric background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rotate-45 -translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37]/3 rounded-full translate-x-48 translate-y-48" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
          >
            {/* Modern section header */}
            <motion.div
              className="inline-block text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase mb-6"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "auto", opacity: 1 }}
              transition={{ duration: 1 }}
            >
              Our Foundation
            </motion.div>
            
            <h2 className="text-6xl md:text-7xl font-extralight mb-8 tracking-tighter text-white">
              Our <span className="font-bold text-[#D4AF37] italic">Mission</span> & Values
            </h2>
            
            <div className="flex justify-center mb-8">
              <motion.div 
                className="h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "8rem" }}
                transition={{ duration: 1.5 }}
              />
            </div>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              Driven by the belief that technology should simplify life, not complicate it. 
              Our mission is to accelerate EV adoption by removing barriers and creating seamless experiences.
            </p>
          </motion.div>

          {/* Asymmetric value cards layout */}
          <div className="space-y-16">
            {values.map((value, i) => (
              <ValueCard
                key={i}
                index={i}
                icon={value.icon}
                title={value.title}
                description={value.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section - Modern card grid */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-[#1A1A1A] relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="hexagons" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <polygon points="30,5 50,20 50,40 30,55 10,40 10,20" fill="none" stroke="#D4AF37" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
          >
            <motion.div
              className="inline-block text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Leadership Team
            </motion.div>
            
            <h2 className="text-6xl md:text-7xl font-extralight mb-8 tracking-tighter text-white">
              Meet Our <span className="font-bold text-[#D4AF37] italic">Founding</span> Team
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
              Our founding team of engineers, designers, and innovators share a passion for 
              creating technology that makes a real difference in people's lives.
            </p>
          </motion.div>

          {/* Modern team grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role1={member.role1}
                role2={member.role2}
                bio={member.bio}
                image={member.image}
                linkedin={member.linkedin}
                x={member.x}
                delay={index * 0.15}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Futuristic design */}
      <section className="py-32 px-6 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#2A2A2A] text-white relative overflow-hidden">
        {/* Advanced background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-[#D4AF37]/10 via-transparent to-transparent" />
          <div className="absolute inset-0">
            <motion.div
              className="w-full h-full"
              style={{
                backgroundImage: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, #D4AF37 90deg, transparent 180deg, #B8860B 270deg, transparent 360deg)`,
                opacity: 0.05
              }}
            />
          </div>
        </div>
        
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
            <Zap className="w-4 h-4" />
            <span className="tracking-wide text-[#D4AF37]">Join the EVolution</span>
          </motion.div>
          
          <motion.h2 
            className="text-6xl md:text-8xl font-extralight mb-8 tracking-tighter text-white leading-tight relative z-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Ready to Experience the{' '}
            <span className="font-bold text-[#D4AF37] italic">Future</span>?
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl mb-12 text-gray-300 max-w-5xl mx-auto font-light leading-relaxed relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Join thousands of forward-thinking individuals who are already part of the EV charging revolution. 
            Together, we're building a more sustainable tomorrow.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-8 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.button 
              className="group relative px-12 py-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-bold text-xl rounded-2xl 
                         shadow-2xl hover:shadow-[#D4AF37]/40 transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]
                         overflow-hidden"
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              
              {/* Animated background shine */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />
            </motion.button>
            
            <div className="flex items-center gap-4 text-gray-400">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-gray-600" />
              <span className="text-sm font-light">or</span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-gray-600" />
            </div>
          </motion.div>
          
          <motion.p 
            className="mt-12 text-sm text-gray-500 font-light tracking-wide relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Thousands of EV owners are already making the switch
          </motion.p>
        </div>
      </section>

      {/* Modal */}
      <OrderChoiceModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} />
    </div>
  );
}