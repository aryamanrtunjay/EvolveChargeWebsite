// app/technology/page.js
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
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

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6 }
  }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6 }
  }
};

export default function Technology() {
  const [activeTechSection, setActiveTechSection] = useState('robotics');

  const techSections = {
    robotics: {
      title: "Advanced Robotics",
      subtitle: "Precision Engineering for Seamless Connection",
      description: "Our proprietary robotics system uses multiple sensors and precision motors to achieve reliable automatic connection with your vehicle, even in challenging conditions.",
      features: [
        "Multi-axis articulation for perfect alignment",
        "Soft-touch connection system prevents damage to vehicle port",
        "Self-calibrating system adapts to different vehicle heights",
        "Weatherproof design functions reliably in all conditions"
      ],
      stats: [
        { value: "99.8%", label: "Connection Success Rate" },
        { value: "<10s", label: "Average Connection Time" },
        { value: "15ft", label: "Maximum Reach" },
        { value: "5yr", label: "Hardware Warranty" }
      ]
    },
    ai: {
      title: "AI-Powered Optimization",
      subtitle: "Smart Learning for Maximum Efficiency",
      description: "Our AI algorithms continuously learn from your charging patterns, electricity rates, and vehicle needs to optimize charging for cost savings and battery health.",
      features: [
        "Predictive charging based on your schedule and habits",
        "Electricity rate monitoring to charge during lowest-cost periods",
        "Battery health analytics with customized charging profiles",
        "Smart integration with home energy systems and solar production"
      ],
      stats: [
        { value: "31%", label: "Average Cost Savings" },
        { value: "18%", label: "Extended Battery Life" },
        { value: "24/7", label: "Real-time Monitoring" },
        { value: "100%", label: "Renewable Energy Compatible" }
      ]
    },
    connectivity: {
      title: "Seamless Connectivity",
      subtitle: "Always Connected, Always Informed",
      description: "Our multi-layered connectivity solutions ensure your charging system is always online, providing real-time data and updates while maintaining the highest security standards.",
      features: [
        "Triple connectivity: Wi-Fi, Cellular, and Bluetooth fallback",
        "End-to-end encryption for all data transmission",
        "Over-the-air updates for continuous improvement",
        "Open API for integration with smart home systems"
      ],
      stats: [
        { value: "99.9%", label: "Uptime Reliability" },
        { value: "128-bit", label: "AES Encryption" },
        { value: "Monthly", label: "Software Updates" },
        { value: "NIST", label: "Security Compliance" }
      ]
    },
    materials: {
      title: "Sustainable Materials",
      subtitle: "Environmentally Conscious Design",
      description: "We've carefully selected materials that minimize environmental impact while ensuring durability and performance in all weather conditions.",
      features: [
        "Recycled and recyclable aluminum housing",
        "Weather-resistant coatings free of harmful chemicals",
        "Energy-efficient components reduce standby power consumption",
        "Modular design allows for easy repairs and upgrades"
      ],
      stats: [
        { value: "75%", label: "Recyclable Components" },
        { value: "-40°F to +120°F", label: "Operating Temperature" },
        { value: "IP66", label: "Weather Protection Rating" },
        { value: "10yr+", label: "Expected Lifespan" }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900 mb-6"
            >
              The <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">Technology</span> Behind Ampereon
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-lg md:text-xl text-gray-700 mb-10"
            >
              Explore the cutting-edge innovations that make automated EV charging possible, reliable, and intelligent.
            </motion.p>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-200 to-teal-200 rounded-full blur-3xl opacity-20 -z-10"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full blur-3xl opacity-10 -z-10"></div>
      </section>

      {/* Technology Navigation */}
      <section className="py-4 border-b border-gray-200 sticky top-20 bg-white z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-2 space-x-8 scrollbar-hide">
            {Object.keys(techSections).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTechSection(key)}
                className={`whitespace-nowrap px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTechSection === key
                    ? 'border-teal-500 text-teal-500'
                    : 'border-transparent text-gray-700 hover:text-teal-500 hover:border-gray-300'
                }`}
              >
                {techSections[key].title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Details */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {Object.keys(techSections).map((key) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: activeTechSection === key ? 1 : 0,
                y: activeTechSection === key ? 0 : 20,
                display: activeTechSection === key ? 'block' : 'none'
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  <motion.h2 variants={fadeInLeft} className="text-3xl font-bold mb-2 text-gray-900">
                    {techSections[key].title}
                  </motion.h2>
                  <motion.p variants={fadeInLeft} className="text-xl text-teal-500 font-medium mb-6">
                    {techSections[key].subtitle}
                  </motion.p>
                  <motion.p variants={fadeInLeft} className="text-gray-700 mb-8">
                    {techSections[key].description}
                  </motion.p>
                  
                  <motion.div variants={fadeInLeft} className="grid grid-cols-2 gap-4 mb-8">
                    {techSections[key].stats.map((stat, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-teal-500">{stat.value}</div>
                        <div className="text-sm text-gray-700">{stat.label}</div>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
                
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInRight}
                  className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-teal-100 to-cyan-100 shadow-xl aspect-square"
                >
                  {/* This would be an image in a real implementation */}
                  <div className="absolute inset-0 flex items-center justify-center text-teal-500 opacity-20">
                    <span className="text-2xl">{techSections[key].title} Image</span>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-gradient-to-r from-teal-500 to-cyan-300 blur-xl opacity-50" />
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-300 to-teal-200 blur-xl opacity-40" />
                </motion.div>
              </div>
              
              <div className="border-t border-gray-100 pt-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {techSections[key].features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 flex items-center justify-center text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <p className="text-gray-700">{feature}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Research and Development */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            >
              Our Research & Development
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-700 max-w-2xl mx-auto"
            >
              We're constantly innovating to improve the EV charging experience through rigorous testing and development.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Silicon Valley Innovation Lab",
                description: "Our primary R&D facility where our engineers work on next-generation robotics and AI systems for charging technology.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                )
              },
              {
                title: "All-Weather Testing Facility",
                description: "Located in Minnesota, this facility tests our systems in extreme temperatures from -40°F to 120°F to ensure reliability.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                )
              },
              {
                title: "Global Collaboration Network",
                description: "We partner with leading universities and research institutions to stay at the forefront of battery technology and energy systems.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              }
            ].map((facility, index) => (
              <motion.div
                key={facility.title}
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
                className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    {facility.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{facility.title}</h3>
                  <p className="text-gray-700">{facility.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Patents and Technology Timeline */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            >
              Our Innovation Timeline
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-700 max-w-2xl mx-auto"
            >
              A journey of technological breakthroughs that led to the most advanced EV charging system available today.
            </motion.p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-teal-300 to-cyan-500 rounded-full"></div>
            
            {[
              {
                year: "2019",
                title: "Company Founded",
                description: "Ampereon was founded with the mission to revolutionize how electric vehicles charge."
              },
              {
                year: "2020",
                title: "First Robotics Patent",
                description: "Secured our first patent for the multi-axis robotic charging arm capable of autonomous connection."
              },
              {
                year: "2021",
                title: "AI Optimization System",
                description: "Developed our proprietary AI system for charge scheduling and battery health optimization."
              },
              {
                year: "2022",
                title: "Weatherproof Technology",
                description: "Breakthrough in all-weather charging technology, enabling reliable operation in extreme conditions."
              },
              {
                year: "2023",
                title: "Smart Home Integration",
                description: "Launched comprehensive API and integrations with major smart home platforms."
              },
              {
                year: "2024",
                title: "Commercial Launch",
                description: "Officially launched Ampereon to the consumer market after extensive beta testing."
              },
            ].map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className={`relative mb-12 ${
                  index % 2 === 0 ? 'left-timeline' : 'right-timeline'
                }`}
              >
                <div className={`flex items-center ${
                  index % 2 === 0 
                    ? 'flex-row' 
                    : 'flex-row-reverse'
                }`}>
                  <div className={`w-1/2 ${
                    index % 2 === 0 
                      ? 'pr-12 text-right' 
                      : 'pl-12 text-left'
                  }`}>
                    <div className="text-teal-500 font-bold text-lg mb-1">{event.year}</div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{event.title}</h3>
                    <p className="text-gray-700">{event.description}</p>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 border-4 border-white"></div>
                  </div>
                  
                  <div className="w-1/2"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Partners */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            >
              Our Technology Partners
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-700 max-w-2xl mx-auto"
            >
              We collaborate with industry leaders to bring the best charging experience to EV owners worldwide.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((partner) => (
              <motion.div
                key={partner}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: partner * 0.05, duration: 0.4 }}
                className="bg-white rounded-lg p-6 shadow-sm w-full h-24 flex items-center justify-center"
              >
                <div className="text-gray-400">Partner Logo {partner}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience the Technology Yourself</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join our community of forward-thinking EV owners who are already charging smarter with Ampereon.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-white text-teal-500 font-medium shadow-md hover:shadow-lg transition-all"
            >
              Schedule a Demo
            </motion.button>
            <p className="mt-4 text-sm opacity-80">See our technology in action at a showroom near you.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}