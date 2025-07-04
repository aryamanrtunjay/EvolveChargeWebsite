'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Zap, Clock, Target, Lightbulb, Users, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaXTwitter } from "react-icons/fa6";
import Script from 'next/script';
import Head from 'next/head';
import OrderChoiceModal from '@/components/OrderChoiceModal';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const slideIn = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
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
      className="bg-white/70 backdrop-blur-md rounded-2xl p-8 border border-black/10 shadow-lg hover:shadow-xl transition-all"
    >
      <div className="text-center">
        <div className="relative mb-6">
          <div className="w-32 h-32 mx-auto rounded-full bg-[#F5F6F7] flex items-center justify-center border border-black/10">
            {image ? (
              <img 
                src={image.src} 
                alt={image.alt || name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-[#EFBF04]/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-[#EFBF04]">
                  {name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-[#111111] mb-2 tracking-wide">{name}</h3>
        <p className="text-[#6F6F6F] font-medium">{role1}</p>
        {role2 && <p className="text-[#6F6F6F] font-medium">{role2}</p>}
        <p className="text-[#6F6F6F] text-sm leading-relaxed mt-4 mb-6">{bio}</p>
        
        <div className="flex justify-center space-x-3">
          {linkedin && (
            <a 
              href={linkedin}
              className="w-10 h-10 bg-[#F5F6F7] text-[#111111]/70 rounded-full flex items-center justify-center hover:bg-[#EFBF04]/20 hover:text-[#EFBF04] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          )}
          {x && (
            <a 
              href={x}
              className="w-10 h-10 bg-[#F5F6F7] text-[#111111]/70 rounded-full flex items-center justify-center hover:bg-[#EFBF04]/20 hover:text-[#EFBF04] transition-colors"
            >
              <FaXTwitter className="w-5 h-5" />
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
      className="bg-white/70 backdrop-blur-md rounded-xl p-8 border border-black/10 shadow-lg hover:shadow-xl transition-all text-center"
    >
      <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-[#EFBF04]/10">
        <div className="text-[#EFBF04]">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-[#111111] mb-4 tracking-wide">{title}</h3>
      <p className="text-[#6F6F6F] leading-relaxed">{description}</p>
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
        <div className="w-16 h-16 bg-[#EFBF04]/20 rounded-full flex items-center justify-center border border-[#EFBF04]/30 shadow-sm">
          <span className="text-[#EFBF04] font-semibold text-sm">{year}</span>
        </div>
      </div>
      <div className="flex-1 bg-white/70 backdrop-blur-md rounded-xl p-6 border border-black/10 shadow-sm">
        <h3 className="text-lg font-semibold text-[#111111] mb-2 tracking-wide">{title}</h3>
        <p className="text-[#6F6F6F]">{description}</p>
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
      description: "Ampereon was born from a simple frustration: why should charging your electric vehicle be any more complicated than parking in your garage? Our founders, both EV owners and engineers, experienced the daily hassle of manually plugging and unplugging their vehicles.",
      color: "#EFBF04",
      bgColor: "bg-[#EFBF04]/10",
      borderColor: "border-[#EFBF04]/30",
      glowColor: "shadow-[#EFBF04]/20"
    },
    {
      icon: Target,
      title: "The Vision", 
      description: "After researching the market, we discovered that while EVs had advanced tremendously, charging infrastructure remained stuck in the past. We envisioned a world where your vehicle charges automatically, intelligently, and cost-effectively without any manual intervention.",
      color: "#EFBF04",
      bgColor: "bg-[#EFBF04]/10",
      borderColor: "border-[#EFBF04]/30",
      glowColor: "shadow-[#EFBF04]/20"
    },
    {
      icon: Zap,
      title: "The Solution",
      description: "What started as a weekend project in a garage has grown into a dedicated team of engineers, designers, and EV enthusiasts working to make this vision a reality. Today, we're proud to introduce the world's first truly automatic EV charger.",
      color: "#EFBF04",
      bgColor: "bg-[#EFBF04]/10",
      borderColor: "border-[#EFBF04]/30",
      glowColor: "shadow-[#EFBF04]/20"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#F5F6F7]"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {storyPoints.map((point, index) => {
              const IconComponent = point.icon;
              const isActive = activeStoryPoint === index;
              
              return (
                <div 
                  key={index}
                  className={`group cursor-pointer transition-all duration-300 ease-out transform ${
                    isActive ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                  onMouseEnter={() => setActiveStoryPoint(index)}
                  onClick={() => setActiveStoryPoint(index)}
                >
                  <div className={`
                    relative bg-white/70 backdrop-blur-md border border-black/10 rounded-2xl p-6
                    shadow-lg transition-all duration-300
                    ${isActive ? `${point.glowColor} shadow-xl` : 'hover:shadow-xl'}
                  `}>
                    {isActive && (
                      <div className={`absolute inset-0 ${point.bgColor} rounded-2xl opacity-60 transition-opacity duration-300`}></div>
                    )}
                    
                    <div className="relative z-10 flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className={`
                          w-16 h-16 bg-[#EFBF04]/20 rounded-xl 
                          flex items-center justify-center transform transition-all duration-300
                          shadow-sm backdrop-blur-sm
                          ${isActive ? 'rotate-3 scale-110 shadow-md' : 'group-hover:rotate-1 group-hover:scale-105'}
                        `}>
                          <IconComponent className="w-8 h-8 text-[#EFBF04]" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className={`
                          text-xl font-semibold transition-colors duration-300 mb-2 tracking-wide text-[#111111]
                          ${isActive ? 'text-[#111111]' : 'text-[#111111]/80'}
                        `}>
                          {point.title}
                        </h3>
                      </div>

                      <div className="flex-shrink-0">
                        <div className={`
                          w-1 h-8 rounded-full transition-all duration-300
                          ${isActive ? `bg-[#EFBF04] opacity-100` : 'bg-[#6F6F6F]/50 opacity-50'}
                        `}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:pl-8">
            <div className="relative backdrop-blur-md bg-white/70 border border-black/10 rounded-3xl p-8 shadow-lg min-h-[400px] flex flex-col justify-center">
              <div className={`absolute inset-0 ${storyPoints[activeStoryPoint].bgColor} rounded-3xl opacity-40 transition-all duration-300`}></div>
              
              <div className="relative z-10">
                <div className={`
                  w-20 h-20 bg-[#EFBF04]/20 rounded-2xl 
                  flex items-center justify-center mb-6 shadow-sm transform transition-all duration-300
                  ${isVisible ? 'rotate-3 scale-110' : ''}
                `}>
                  {React.createElement(storyPoints[activeStoryPoint].icon, { 
                    className: "w-10 h-10 text-[#EFBF04]" 
                  })}
                </div>

                <h3 className="text-3xl font-semibold text-[#111111] mb-6 tracking-wide transition-all duration-300">
                  {storyPoints[activeStoryPoint].title}
                </h3>
                
                <p className="text-lg leading-relaxed text-[#6F6F6F] transition-all duration-300">
                  {storyPoints[activeStoryPoint].description}
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <div className={`
                    px-4 py-2 rounded-full bg-[#EFBF04]/20 
                    text-[#EFBF04] font-semibold text-sm shadow-sm
                  `}>
                    {String(activeStoryPoint + 1).padStart(2, '0')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-12 lg:hidden">
          <div className="flex gap-3">
            {storyPoints.map((point, index) => (
              <button
                key={index}
                onClick={() => setActiveStoryPoint(index)}
                className={`
                  w-4 h-4 rounded-full transition-all duration-300
                  ${activeStoryPoint === index 
                    ? `bg-[#EFBF04] scale-125` 
                    : 'bg-[#6F6F6F]/50 hover:bg-[#6F6F6F]'
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const teamMembers = [
    {
      name: "Aryaman Rtunjay",
      role1: "Co-Chief Executive Officer",
      role2: "Co-Founder",
      bio: "Aryaman shapes Ampereon’s vision and strategy, leading with unparalleled expertise in end-to-end engineering. He designs and implements the core technology behind the company’s innovative chargers, driving transformative impact. He also develops and builds liquid-fueled sub-orbital rockets and develops AI tools for environmental policy in developing nations and early detection of Parkinson's Disease",
      linkedin: "https://linkedin.com/in/aryaman-rtunjay",
      x: "https://x.com/aryamanrtunjay",
      img: { src: "/images/aryaman.jpeg", alt: "AR" }
    },
    {
      name: "Bhanu Atmakuri",
      role1: "Co-Chief Executive Officer",
      role2: "Co-Founder",
      bio: "Bhanu fuels Ampereon’s innovation, leading product development with expertise in Python, JavaScript, C, and PCB design. He is instrumental in bringing the company’s patent-pending smart chargers from concept to reality, ensuring technical excellence. Through his hackathon, Hackabyte, Bhanu inspires young coders, blending cutting-edge technology with community impact.",
      linkedin: "https://www.linkedin.com/in/bhanu-atmakuri-9499752b3/",
      img: { src: "/images/bhanu.jpeg", alt: "BA" }
    },
    {
      name: "Shruthika Balasubramanian",
      role1: "Chief Marketing Officer",
      role2: "Co-Founder",
      bio: "Shruthika spearheads Ampereon’s marketing strategy, leveraging her passion for computer science and sustainability. As CMO, she designs targeted campaigns and compelling brand stories that highlight the company’s eco-friendly mission. Her data-driven approach to customer engagement and advocacy for environmental justice amplify EVolve’s impact in the EV charging space.",
      linkedin: "https://www.linkedin.com/in/shruthika-balasubramanian-233634369/",
      img: { src: "/images/shruthika.jpeg", alt: "SB" }
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
      description: "Launched Ampereon with orders exceeding expectations. Preparing for mass production and nationwide rollout."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('config','q1blv');
          `,
        }}
      />
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F6F7] to-white"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div
              variants={fadeIn}
              className="inline-flex items-center px-4 py-2 rounded-full bg-[#EFBF04]/10 text-[#EFBF04] text-sm font-medium mb-6 tracking-wide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              About Ampereon
            </motion.div>
            
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-[#111111] tracking-tight"
            >
              <span className="block">Revolutionizing</span>
              <span className="text-[#EFBF04]">
                Electric Vehicle Charging
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-xl text-[#6F6F6F] mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              We're building the future of EV charging through intelligent automation, 
              making electric vehicle ownership effortless and accessible for everyone.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <StorySection />

      {/* Mission & Values Section */}
      <section className="py-20 bg-[#F5F6F7] relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-6 text-[#111111] tracking-tight">
              Our Mission & Values
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-[#6F6F6F] max-w-2xl mx-auto mb-12 leading-relaxed">
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

      {/* Order Choice Modal */}
      <OrderChoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

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
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4 text-[#111111] tracking-tight">
              Our Journey
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-[#6F6F6F] max-w-2xl mx-auto leading-relaxed">
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
      <section className="py-20 bg-[#F5F6F7]">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4 text-[#111111] tracking-tight">
              Meet Our Team
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-[#6F6F6F] max-w-2xl mx-auto leading-relaxed">
              Our founding team of engineers, designers, and innovators share a passion for 
              creating technology that makes a real difference in people's lives.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-40 gap-4">
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
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="bg-white/70 backdrop-blur-md rounded-3xl p-10 md:p-16 text-center border border-black/10 shadow-lg"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#111111] tracking-tight">
              Join the EV Revolution
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-[#6F6F6F] leading-relaxed">
              Ready to experience the future of EV charging? Join the customers who have already 
              made the switch to intelligent, automatic charging with EVolve.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.05, backgroundColor: '#D1B47A' }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-[#EFBF04] text-[#111111] font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Order Yours
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full border border-[#111111]/20 text-[#111111]/70 font-medium hover:bg-[#F5F6F7] transition-all flex items-center justify-center gap-2"
              >
                Learn More <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}