'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Zap, Clock, Target, Lightbulb, Users, Award, ChevronDown, ArrowRight, Star, Heart, Battery, Wifi, Globe, Shield, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { FaXTwitter } from "react-icons/fa6";
import OrderChoiceModal from '@/components/OrderChoiceModal';

// Simplified pattern overlay
const SubtlePattern = ({ opacity = 0.02 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <svg width="100%" height="100%" className="text-[#D4AF37]">
      <defs>
        <pattern id="aboutGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="20" cy="20" r="0.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#aboutGrid)" />
    </svg>
  </div>
);

// Professional animation variants
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
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
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Interactive team member cards
function TeamMember({ name, role1, role2, bio, image, linkedin, x, delay = 0 }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { delay, duration: 0.6 }
        }
      }}
      className="group"
    >
      <div 
        className="relative bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl overflow-hidden border border-[#D4AF37]/20 
                  hover:border-[#D4AF37]/40 transition-all duration-300 cursor-pointer h-80"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          {image ? (
            <img 
              src={image.src} 
              alt={image.alt || name}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isHovered ? 'blur-md scale-105' : 'blur-none scale-100'
              }`}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] 
                          flex items-center justify-center text-white font-medium text-4xl
                          transition-all duration-500 ${
                            isHovered ? 'blur-md scale-105' : 'blur-none scale-100'
                          }`}>
              {name.split(' ').map(n => n[0]).join('')}
            </div>
          )}
          
          {/* Enhanced dark overlay for better text readability */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            isHovered 
              ? 'bg-gradient-to-t from-black/95 via-black/85 to-black/70' 
              : 'bg-gradient-to-t from-black/80 via-black/50 to-black/30'
          }`} />
        </div>
        
        {/* Content overlay */}
        <div className="relative z-10 p-6 h-full flex flex-col">
          {/* Initial state - Name and role at bottom */}
          <div className={`mt-auto transition-all duration-500 ${
            isHovered ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            <h3 className="text-2xl font-semibold text-white mb-2 drop-shadow-lg">{name}</h3>
            <div className="text-[#D4AF37] text-sm font-medium drop-shadow-md">{role1}</div>
            {role2 && <div className="text-[#D4AF37] text-sm font-medium drop-shadow-md">{role2}</div>}
          </div>
          
          {/* Hover state - Full content */}
          <div className={`absolute inset-6 flex flex-col justify-center transition-all duration-500 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="text-center bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-lg">{name}</h3>
              <div className="text-[#D4AF37] text-sm font-medium mb-1 drop-shadow-md">{role1}</div>
              {role2 && <div className="text-[#D4AF37] text-sm font-medium mb-4 drop-shadow-md">{role2}</div>}
              
              <p className="text-gray-200 text-sm leading-relaxed mb-6 drop-shadow-md">{bio}</p>
              
              {/* Professional social links */}
              <div className="flex justify-center gap-3">
                {linkedin && (
                  <a 
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#D4AF37]/30 text-[#D4AF37] rounded-lg 
                             flex items-center justify-center hover:bg-[#D4AF37]/50 
                             transition-colors duration-200 border border-[#D4AF37]/40
                             backdrop-blur-sm shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
                {x && (
                  <a 
                    href={x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-[#D4AF37]/30 text-[#D4AF37] rounded-lg 
                             flex items-center justify-center hover:bg-[#D4AF37]/50 
                             transition-colors duration-200 border border-[#D4AF37]/40
                             backdrop-blur-sm shadow-lg"
                  >
                    <FaXTwitter className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Clean value cards
function ValueCard({ icon, title, description, index }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { delay: index * 0.1, duration: 0.6 }
        }
      }}
      className="group"
    >
      <div className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl p-8 h-full border border-[#D4AF37]/20 
                    hover:border-[#D4AF37]/40 hover:bg-[#2A2A2A]/80 transition-all duration-300">
        
        <div className="flex items-start gap-6">
          <div className="flex items-center justify-center w-12 h-12
                        bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 rounded-lg 
                        border border-[#D4AF37]/30 text-[#D4AF37] flex-shrink-0">
            {icon}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
            <p className="text-gray-300 leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Professional story section
const StorySection = () => {
  const [activeStoryPoint, setActiveStoryPoint] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStoryPoint((prev) => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const storyPoints = [
    {
      icon: Clock,
      title: "The Challenge",
      description: "Our founders, experienced EV owners and engineers, recognized a fundamental problem: while electric vehicles had evolved dramatically, charging remained unnecessarily complicated and time-consuming.",
      number: "01"
    },
    {
      icon: Target,
      title: "The Solution", 
      description: "We envisioned intelligent charging systems that work automatically—where your vehicle charges optimally without daily intervention, saving time, money, and extending battery life.",
      number: "02"
    },
    {
      icon: Zap,
      title: "The Innovation",
      description: "Today, Ampereon represents the culmination of months of engineering and design work: the first truly automatic EV charging system that learns your routine and optimizes every charge.",
      number: "03"
    }
  ];

  return (
    <section className="py-20 px-6 bg-[#1A1A1A] text-white relative">
      <SubtlePattern />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariants}
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
            Our <span className="font-semibold text-[#D4AF37]">Story</span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
            From identifying a real problem to engineering an elegant solution
          </p>
        </motion.div>

        {/* Clean timeline layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Timeline */}
          <div className="space-y-6">
            {storyPoints.map((point, index) => {
              const IconComponent = point.icon;
              const isActive = activeStoryPoint === index;
              
              return (
                <motion.div 
                  key={index}
                  className={`cursor-pointer transition-all duration-300 ${
                    isActive ? 'scale-102' : ''
                  }`}
                  onMouseEnter={() => setActiveStoryPoint(index)}
                  onClick={() => setActiveStoryPoint(index)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: index * 0.15, duration: 0.5 }
                    }
                  }}
                >
                  <div className={`p-6 rounded-xl border transition-all duration-300
                                 ${isActive 
                                   ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40' 
                                   : 'bg-[#2A2A2A]/60 border-[#D4AF37]/20 hover:border-[#D4AF37]/30'
                                 }`}>
                    
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-lg
                                     transition-all duration-300 ${
                                       isActive 
                                         ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B]' 
                                         : 'bg-[#D4AF37]/20 border border-[#D4AF37]/30'
                                     }`}>
                        <IconComponent className={`w-6 h-6 ${isActive ? 'text-white' : 'text-[#D4AF37]'}`} />
                      </div>
                      
                      <div>
                        <h3 className={`text-lg font-semibold mb-1 ${
                          isActive ? 'text-white' : 'text-gray-300'
                        }`}>
                          {point.title}
                        </h3>
                        <div className="text-[#D4AF37] text-sm font-medium">
                          STEP {point.number}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Content */}
          <div className="sticky top-8">
            <div className="bg-[#2A2A2A]/60 backdrop-blur-sm border border-[#D4AF37]/20 
                          rounded-xl p-8 min-h-[400px]">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStoryPoint}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] 
                                rounded-lg flex items-center justify-center mb-6">
                    {React.createElement(storyPoints[activeStoryPoint].icon, { 
                      className: "w-6 h-6 text-white" 
                    })}
                  </div>

                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {storyPoints[activeStoryPoint].title}
                  </h3>
                  
                  <p className="text-lg leading-relaxed text-gray-300 mb-6">
                    {storyPoints[activeStoryPoint].description}
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-[#D4AF37]/20 text-[#D4AF37] font-medium 
                                  rounded-full border border-[#D4AF37]/30 text-sm">
                      STEP {storyPoints[activeStoryPoint].number}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Simple progress indicator */}
        <div className="flex justify-center mt-12">
          <div className="flex gap-3">
            {storyPoints.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveStoryPoint(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeStoryPoint === index ? 'w-12 bg-[#D4AF37]' : 'w-2 bg-gray-600 hover:bg-[#D4AF37]/50'
                }`}
              />
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
  const heroParallax = useTransform(scrollY, [0, 500], [0, 10]);

  const scrollToStory = () => {
    const storySection = document.getElementById('story-section');
    if (storySection) {
      storySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const teamMembers = [
    {
      name: "Aryaman Rtunjay",
      role1: "Chief Executive Officer",
      bio: "Aryaman drives Ampereon's overall vision and strategy, drawing on his engineering background to pioneer AI-powered EV charging systems that automate connections and optimize energy use for maximum efficiency.",
      linkedin: "https://linkedin.com/in/aryaman-rtunjay",
      x: "https://x.com/aryamanrtunjay",
      image: { src: "/images/aryaman.jpeg", alt: "AR" }
    },
    {
      name: "Bhanu Atmakuri",
      role1: "Chief Operating Officer",
      bio: "Bhanu manages day-to-day operations and product development, applying his expertise in software programming and hardware design to create reliable, scalable smart charging solutions that integrate seamlessly with existing EV infrastructure.",
      linkedin: "https://www.linkedin.com/in/bhanu-atmakuri-9499752b3/",
      image: { src: "/images/bhanu.jpeg", alt: "BA" }
    },
    {
      name: "Shruthika Balasubramanian",
      role1: "Chief Marketing Officer",
      bio: "Shruthika leads Ampereon's marketing and communication strategies, focusing on sustainable innovation to build brand awareness and connect our advanced charging technology with environmentally conscious EV owners worldwide.",
      linkedin: "https://www.linkedin.com/in/shruthika-balasubramanian-233634369/",
      image: { src: "/images/shruthika.jpeg", alt: "SB" }
    }
  ];

  const values = [
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Innovation",
      description: "We pioneer intelligent EV charging solutions that automate the process, reduce costs, and extend battery life through AI-driven optimization."
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Customer Focus",
      description: "Our designs prioritize seamless integration with existing home charging systems, ensuring effortless adoption for EV owners seeking convenience and efficiency."
    },
    {
      icon: <Battery className="w-6 h-6" />,
      title: "Sustainability",
      description: "By optimizing charging during off-peak hours and integrating renewable energy sources, we help reduce grid strain and promote cleaner transportation."
    }
  ];

  return (
    <div className="bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* Hero Section - Clean and professional */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
        <SubtlePattern />
        
        <motion.div
          className="relative z-10 px-6 text-center max-w-6xl mx-auto"
          style={{ y: heroParallax }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#D4AF37] 
                       bg-[#D4AF37]/10 px-4 py-2 rounded-full mb-8 border border-[#D4AF37]/20"
          >
            <Users className="w-4 h-4" />
            <span>About Ampereon</span>
          </motion.div>
          
          <h1 className="font-light leading-tight mb-8 text-white"
              style={{ fontSize: 'clamp(2.5rem,5.5vw,4rem)' }}>
            Engineering the Future of
            <br />
            <span className="font-semibold text-[#D4AF37]">
              EV Charging
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed font-light">
            We're building intelligent automation that makes electric vehicle ownership 
            effortless, accessible, and truly sustainable for everyone.
          </p>
        </motion.div>
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent mb-2" />
          <ChevronDown className="w-5 h-5 text-[#D4AF37]/70" />
        </motion.div>
      </section>

      {/* Story Section */}
      <StorySection />

      {/* Mission & Values Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] relative">
        <SubtlePattern />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
              Our <span className="font-semibold text-[#D4AF37]">Values</span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
              The principles that guide our work and define our approach to innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* Team Section */}
      <section className="py-20 px-6 bg-[#1A1A1A] relative">
        <SubtlePattern />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
          >
            <h2 className="text-4xl md:text-5xl font-light mb-6 text-white">
              Our <span className="font-semibold text-[#D4AF37]">Team</span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
              Engineers, designers, and innovators working together to solve real problems 
              in electric vehicle charging
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] text-white relative">
        <SubtlePattern />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2 
            className="text-4xl md:text-5xl font-light mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Ready to Experience{' '}
            <span className="font-semibold text-[#D4AF37]">Effortless Charging?</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl mb-10 text-gray-300 max-w-3xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Join the EV owners who've already made the switch to automatic charging. 
            Reserve your Ampereon system today.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.button 
              className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-semibold rounded-lg 
                       hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300"
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Reserve Now
            </motion.button>
            
            <a 
              href="/product"
              className="px-8 py-4 border border-[#D4AF37]/30 text-[#D4AF37] rounded-lg font-semibold
                       hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-all duration-300"
            >
              Learn More
            </a>
          </motion.div>
          
          <motion.div 
            className="mt-10 flex items-center justify-center gap-6 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              <span>30-day money-back guarantee</span>
            </div>
            {/* <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <span>500+ customers</span>
            </div> */}
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <OrderChoiceModal isOpen={isModalOpen} onClose={()=>setIsModalOpen(false)} />
    </div>
  );
}