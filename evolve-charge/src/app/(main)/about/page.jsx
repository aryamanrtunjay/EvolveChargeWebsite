"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Zap, Clock, Target, Lightbulb, Users, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaXTwitter } from "react-icons/fa6";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6 }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Team Member Component
function TeamMember({ name, role1, role2, bio, image, linkedin, x, delay = 0 }) {
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
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100"
    >
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
            {image ? (
              <img 
                src={image.src} 
                alt={image.alt || name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-teal-600 font-medium">{role1}</p>
        {role2 && <p className="text-teal-600 font-medium">{role2}</p>}
        <p className="text-gray-600 text-sm leading-relaxed mt-4 mb-6">{bio}</p>
        
        <div className="flex justify-center space-x-3">
          {linkedin && (
            <a 
              href={linkedin}
              className="w-10 h-10 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center hover:bg-teal-100 hover:text-teal-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          )}
          {x && (
            <a 
              href={x}
              className="w-10 h-10 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center hover:bg-teal-100 hover:text-teal-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Value Card Component
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
          transition: { delay: index * 0.2, duration: 0.6 }
        }
      }}
      className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg border border-white/20 text-center"
    >
      <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        <div className="text-teal-500">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

// Milestone Component
function Milestone({ year, title, description, index }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0, x: index % 2 === 0 ? -20 : 20 },
        visible: { 
          opacity: 1, 
          x: 0,
          transition: { delay: index * 0.2, duration: 0.6 }
        }
      }}
      className="flex items-center space-x-6"
    >
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">{year}</span>
        </div>
      </div>
      <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
}

const StorySection = () => {
  const [activeStoryPoint, setActiveStoryPoint] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveStoryPoint((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const storyPoints = [
    {
      icon: Clock,
      title: "The Problem",
      description: "EVolve Charge was born from a simple frustration: why should charging your electric vehicle be any more complicated than parking in your garage? Our founders, both EV owners and engineers, experienced the daily hassle of manually plugging and unplugging their vehicles.",
      color: "from-emerald-400 to-teal-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-200/30",
      glowColor: "shadow-emerald-500/20"
    },
    {
      icon: Target,
      title: "The Vision", 
      description: "After researching the market, we discovered that while EVs had advanced tremendously, charging infrastructure remained stuck in the past. We envisioned a world where your vehicle charges automatically, intelligently, and cost-effectively without any manual intervention.",
      color: "from-blue-400 to-indigo-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-200/30",
      glowColor: "shadow-blue-500/20"
    },
    {
      icon: Zap,
      title: "The Solution",
      description: "What started as weekend project in a garage has grown into a dedicated team of engineers, designers, and EV enthusiasts working to make this vision a reality. Today, we're proud to introduce the world's first truly automatic EV charger.",
      color: "from-teal-400 to-cyan-500",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-200/30",
      glowColor: "shadow-teal-500/20"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
      
      {/* Floating orbs for ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-300/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-300/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-teal-300/15 to-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        {/* <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why We Started 
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"> EVolve Charge</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our journey from frustration to innovation
          </p>
        </div> */}

        {/* Story Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Story Navigation */}
          <div className="space-y-6">
            {storyPoints.map((point, index) => {
              const IconComponent = point.icon;
              const isActive = activeStoryPoint === index;
              
              return (
                <div 
                  key={index}
                  className={`group cursor-pointer transition-all duration-700 ease-out transform ${
                    isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                  onMouseEnter={() => setActiveStoryPoint(index)}
                  onClick={() => setActiveStoryPoint(index)}
                >
                  {/* Glassmorphism Card */}
                  <div className={`
                    relative bg-white/70 border border-white/30 rounded-2xl p-6
                    shadow-xl transition-all duration-700
                    ${isActive ? `${point.glowColor} shadow-2xl ring-1 ring-white/40` : 'shadow-lg hover:shadow-xl'}
                  `}>
                    
                    {/* Gradient overlay for active state */}
                    {isActive && (
                      <div className={`absolute inset-0 ${point.bgColor} rounded-2xl opacity-60 transition-opacity duration-700`}></div>
                    )}
                    
                    <div className="relative z-10 flex items-center gap-6">
                      {/* Icon Section */}
                      <div className="flex-shrink-0">
                        <div className={`
                          w-16 h-16 bg-gradient-to-r ${point.color} rounded-xl 
                          flex items-center justify-center transform transition-all duration-500
                          shadow-lg backdrop-blur-sm
                          ${isActive ? 'rotate-3 scale-110 shadow-xl' : 'group-hover:rotate-1 group-hover:scale-105'}
                        `}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1">
                        <h3 className={`
                          text-xl md:text-2xl font-bold transition-colors duration-500 mb-2
                          ${isActive ? 'text-gray-900' : 'text-gray-800'}
                        `}>
                          {point.title}
                        </h3>
                      </div>

                      {/* Arrow indicator */}
                      <div className="flex-shrink-0">
                        <div className={`
                          w-1 h-8 rounded-full transition-all duration-500
                          ${isActive ? `bg-gradient-to-b ${point.color} opacity-100` : 'bg-gray-300 opacity-50'}
                        `}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side - Story Content */}
          <div className="lg:pl-8">
            <div className="relative backdrop-blur-xl bg-white/60 border border-white/20 rounded-3xl p-8 shadow-2xl min-h-[400px] flex flex-col justify-center">
              
              {/* Active story gradient overlay */}
              <div className={`absolute inset-0 ${storyPoints[activeStoryPoint].bgColor} rounded-3xl opacity-40 transition-all duration-700`}></div>
              
              <div className="relative z-10">
                {/* Large Icon */}
                <div className={`
                  w-20 h-20 bg-gradient-to-r ${storyPoints[activeStoryPoint].color} rounded-2xl 
                  flex items-center justify-center mb-6 shadow-lg transform transition-all duration-700
                  ${isVisible ? 'rotate-3 scale-110' : ''}
                `}>
                  {React.createElement(storyPoints[activeStoryPoint].icon, { 
                    className: "w-10 h-10 text-white" 
                  })}
                </div>

                {/* Story Content */}
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 transition-all duration-500">
                  {storyPoints[activeStoryPoint].title}
                </h3>
                
                <p className="text-lg leading-relaxed text-gray-700 transition-all duration-500">
                  {storyPoints[activeStoryPoint].description}
                </p>

                {/* Story Number */}
                <div className="mt-8 flex items-center gap-4">
                  <div className={`
                    px-4 py-2 rounded-full bg-gradient-to-r ${storyPoints[activeStoryPoint].color} 
                    text-white font-bold text-sm shadow-lg
                  `}>
                    {String(activeStoryPoint + 1).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation dots for mobile */}
        <div className="flex justify-center mt-12 lg:hidden">
          <div className="flex gap-3">
            {storyPoints.map((point, index) => (
              <button
                key={index}
                onClick={() => setActiveStoryPoint(index)}
                className={`
                  w-4 h-4 rounded-full transition-all duration-500
                  ${activeStoryPoint === index 
                    ? `bg-gradient-to-r ${point.color} scale-125` 
                    : 'bg-gray-300 hover:bg-gray-400'
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Aryaman Rtunjay",
      role1: "Co-Chief Executive Officer",
      role2: "Co-Founder",
      bio: "Aryaman shapes EVolve Charge’s vision and strategy, leading with unparalleled expertise in end-to-end engineering. He designs and implements the core technology behind the company’s innovative chargers, driving transformative impact. He also develops and builds liquid-fueled sub-orbital rockets and develops AI tools for environmental policy in developing nations and early detection of Parkinson's Disease",
      linkedin: "https://linkedin.com/in/aryaman-rtunjay",
      x: "https://x.com/aryamanrtunjay",
      img: { src: "/images/aryaman.jpeg", alt: "AR" }
    },
    {
      name: "Bhanu Atmakuri",
      role1: "Co-Chief Executive Officer",
      role2: "Co-Founder",
      bio: "Bhanu fuels EVolve Charge’s innovation, leading product development with expertise in Python, JavaScript, C, and PCB design. He is instrumental in bringing the company’s patent-pending smart chargers from concept to reality, ensuring technical excellence. Through his hackathon, Hackabyte, Bhanu inspires young coders, blending cutting-edge technology with community impact.",
      linkedin: "https://www.linkedin.com/in/bhanu-atmakuri-9499752b3/",
      img: { src: "/images/bhanu.jpeg", alt: "BA" }
    },
    {
      name: "Shruthika Balasubramanian",
      role1: "Chief Marketing Officer",
      role2: "Co-Founder",
      bio: "Shruthika spearheads EVolve Charge’s marketing strategy, leveraging her passion for computer science and sustainability. As CMO, she designs targeted campaigns and compelling brand stories that highlight the company’s eco-friendly mission. Her data-driven approach to customer engagement and advocacy for environmental justice amplify EVolve’s impact in the EV charging space.",
      linkedin: "https://www.linkedin.com/in/shruthika-balasubramanian-233634369/",
      img: { src: "/images/shruthika.jpeg", alt: "SB" }
    },
    {
      name: "Aadesh Kumar",
      role1: "Principal Firmware Engineer",
      bio: "Aadesh leads EVolve Charge’s firmware development with a deep expertise in robotics and autonomous systems. As Principal Firmware Engineer, he crafts reliable, efficient firmware to ensure seamless charger performance and automation. Drawing from his research in quantum computing and sustainable aviation, Aadesh drives EVolve’s mission for cutting-edge, eco-friendly technology.",
      linkedin: "https://www.linkedin.com/in/aadesh-kumar-9104a3215/",
      img: { src: "/images/aadesh.jpeg", alt: "AK" },
    }
  ];

  const milestones = [
    {
      year: "2022",
      title: "Company Founded",
      description: "Started with a vision to eliminate the hassle of manual EV charging and make electric vehicle ownership seamless."
    },
    {
      year: "2023",
      title: "Prototype Development",
      description: "Completed first working prototype of automatic charging system. Filed 12 patents for magnetic connection technology."
    },
    {
      year: "2024",
      title: "Funding & Team Growth",
      description: "Raised $15M Series A funding. Grew team to 25 engineers and began pilot testing with early customers."
    },
    {
      year: "2025",
      title: "Product Launch",
      description: "Launched EVolve Charger with orders exceeding expectations. Preparing for mass production and nationwide rollout."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-teal-100 to-transparent rounded-bl-full opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-cyan-100 to-transparent rounded-tr-full opacity-70"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div
              variants={fadeIn}
              className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              About EVolve Charger
            </motion.div>
            
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900"
            >
              <span className="block">Revolutionizing</span>
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Electric Vehicle Charging
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              We're building the future of EV charging through intelligent automation, 
              making electric vehicle ownership effortless and accessible for everyone.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <StorySection />

      {/* Mission & Values Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-cyan-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100 rounded-full opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Our Mission & Values
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
              We're driven by the belief that technology should simplify life, not complicate it. 
              Our mission is to accelerate EV adoption by removing barriers and creating seamless experiences.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard
              index={0}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
              title="Innovation First"
              description="We believe in pushing boundaries and challenging the status quo. Every product we create represents a leap forward in EV charging technology."
            />
            <ValueCard
              index={1}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
              title="Customer Obsession"
              description="Our customers drive everything we do. We listen, iterate, and continuously improve based on real user feedback and experiences."
            />
            <ValueCard
              index={2}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" /></svg>}
              title="Sustainability"
              description="We're committed to accelerating the world's transition to sustainable transportation through intelligent, efficient charging solutions."
            />
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      {/* <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Our Journey
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600 max-w-2xl mx-auto">
              From a simple idea to revolutionizing EV charging - here are the key milestones in our journey.
            </motion.p>
          </motion.div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <Milestone
                key={index}
                year={milestone.year}
                title={milestone.title}
                description={milestone.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section> */}

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Meet Our Team
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our founding team of engineers, designers, and innovators share a passion for 
              creating technology that makes a real difference in people's lives.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role1={member.role1}
                role2={member.role2}
                bio={member.bio}
                image={member.img}
                linkedin={member.linkedin}
                x={member.x}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200 rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-10 md:p-16 text-center shadow-xl border border-white/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Join the EV Revolution
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-teal-50 leading-relaxed">
              Ready to experience the future of EV charging? Join thousands of customers who have already 
              made the switch to intelligent, automatic charging with EVolve.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 px-8 py-4 rounded-full bg-white text-teal-600 font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Order Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 px-8 py-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Contact Us
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}