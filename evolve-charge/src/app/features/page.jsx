// pages/features.js (or app/features/page.js for App Router)
"use client";

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

export default function Features() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('automatic');

  // Define feature categories and content
  const featureCategories = {
    automatic: {
      title: "Automatic Connection",
      description: "Our revolutionary smart arm connects and disconnects your EV automatically.",
      image: "/automatic-connection.jpg", // Placeholder - would be replaced with actual image path
      details: [
        {
          title: "Motion Detection Technology",
          description: "Advanced sensors detect your vehicle's position and align the charging arm perfectly every time."
        },
        {
          title: "Secure Connection",
          description: "Proprietary locking mechanism ensures a safe and secure connection that won't disconnect accidentally."
        },
        {
          title: "Weatherproof Design",
          description: "Works flawlessly in any temperature that you can, from -30°F to 120°F."
        },
        {
          title: "Visual Connection Feedback",
          description: "LED indicators show connection status and charging progress at a glance."
        }
      ]
    },
    optimization: {
      title: "Charging Optimization",
      description: "Smart algorithms optimize when and how your vehicle charges for maximum savings and battery health.",
      image: "/optimization.jpg", // Placeholder - would be replaced with actual image path
      details: [
        {
          title: "Off-Peak Charging",
          description: "Automatically charges during the lowest electricity rate periods, saving up to 40% on charging costs."
        },
        {
          title: "Demand Response Ready",
          description: "Compatible with utility demand response programs for additional savings and grid stability."
        },
        {
          title: "Renewable Energy Priority",
          description: "Can prioritize charging when renewable energy is abundant on the grid."
        },
        {
          title: "Smart Home Integration",
          description: "Works with your home energy management system to balance charging with other household energy needs."
        }
      ]
    },
    battery: {
      title: "Battery Health Monitoring",
      description: "Comprehensive monitoring and analysis to maximize your EV battery's lifespan.",
      image: "/battery-health.jpg", // Placeholder - would be replaced with actual image path
      details: [
        {
          title: "Degradation Prevention",
          description: "Adaptive charging profiles that prevent common causes of battery degradation."
        },
        {
          title: "Health Reports",
          description: "Detailed battery health reports with actionable insights to extend battery life."
        },
        {
          title: "Predictive Maintenance",
          description: "AI-powered algorithms identify potential battery issues before they become problems."
        },
        {
          title: "Custom Battery Profiles",
          description: "Vehicle-specific charging profiles optimized for your exact EV model and battery chemistry."
        }
      ]
    },
    app: {
      title: "Smart Control App",
      description: "Complete control and insights in the palm of your hand.",
      image: "/mobile-app.jpg", // Placeholder - would be replaced with actual image path
      details: [
        {
          title: "Remote Charging Control",
          description: "Start, stop, or schedule charging sessions from anywhere via smartphone."
        },
        {
          title: "Energy Usage Dashboard",
          description: "Track charging costs, energy usage, and carbon footprint with detailed analytics."
        },
        {
          title: "Smart Notifications",
          description: "Get alerts about charging status, electricity prices, or potential issues."
        },
        {
          title: "Voice Assistant Integration",
          description: "Works with Amazon Alexa, Google Assistant, and Apple Siri for voice control."
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>Features | EVolve Charge - Smart EV Charging Solutions</title>
        <meta name="description" content="Explore the advanced features of EVolve Charge's automatic EV charging solutions." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Advanced Features for the Future of EV Charging
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-lg md:text-xl mb-10 opacity-90"
            >
              Discover how EVolve Charge is revolutionizing electric vehicle charging with smart automation, optimization, and health monitoring.
            </motion.p>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white rounded-t-[50%] scale-x-125"></div>
      </section>

      {/* Feature Navigation Tabs */}
      <section className="py-4 border-b border-gray-200 sticky top-20 bg-white z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-2 space-x-8 scrollbar-hide">
            {Object.keys(featureCategories).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`whitespace-nowrap px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-teal-500 text-teal-500'
                    : 'border-transparent text-gray-700 hover:text-teal-500 hover:border-gray-300'
                }`}
              >
                {featureCategories[key].title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Details Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {Object.keys(featureCategories).map((key) => (
            <motion.div
              key={key}
              animate={{ 
                opacity: activeTab === key ? 1 : 0,
                y: activeTab === key ? 0 : 20,
                display: activeTab === key ? 'block' : 'none'
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid justify-center mb-2">
                <div className="order-2 md:order-1">
                  <h2 className="text-3xl font-bold mb-1 text-gray-900 text-center">{featureCategories[key].title}</h2>
                  <p className="text-xl text-gray-700 mb-6">{featureCategories[key].description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
                {featureCategories[key].details.map((detail, index) => (
                  <motion.div
                    key={detail.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                  >
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{detail.title}</h3>
                    <p className="text-gray-700">{detail.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technical Specifications */}
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
              Technical Specifications
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-700 max-w-2xl mx-auto"
            >
              Industry-leading technology designed for reliability and performance.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl overflow-hidden shadow-md"
            >
              <div className="p-6 bg-gradient-to-r from-teal-500 to-cyan-600">
                <h3 className="text-xl font-bold text-white">Charging Specifications</h3>
              </div>
              <div className="p-6">
                <table className="w-full">
                  <tbody>
                    {[
                      { label: "Charging Power", value: "Up to 19.2kW (80A at 240V)" },
                      { label: "Connector Type", value: "North American Charging Standard (NACS)"},
                      { label: "Number of cars", value: "As many as your garage fits" },
                      { label: "Vehicle Compatibility", value: "All major EV brands (adapter may be necessary)" },
                      { label: "Cable Reach", value: "Full length of garage" },
                      { label: "Connection Time", value: "<5 minutes" }
                    ].map((item) => (
                      <tr key={item.label} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 font-medium text-gray-900">{item.label}</td>
                        <td className="py-3 text-gray-700">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl overflow-hidden shadow-md"
            >
              <div className="p-6 bg-gradient-to-r from-teal-500 to-cyan-600">
                <h3 className="text-xl font-bold text-white">Connectivity & Software</h3>
              </div>
              <div className="p-6">
                <table className="w-full">
                  <tbody>
                    {[
                      { label: "Wireless Connection", value: "Wi-Fi" },
                      { label: "Remote Updates", value: "Over-the-air software updates" },
                      { label: "Smart Home Integration", value: "HomeKit, Alexa, Google Home" },
                      { label: "Mobile App", value: "iOS, Android" },
                      { label: "Data Security", value: "End-to-end encryption" },
                      { label: "API Access", value: "Yes, for developers" }
                    ].map((item) => (
                      <tr key={item.label} className="border-b border-gray-100 last:border-0">
                        <td className="py-3 font-medium text-gray-900">{item.label}</td>
                        <td className="py-3 text-gray-700">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
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
              How We Compare
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-700 max-w-2xl mx-auto"
            >
              See how EVolve Charge stacks up against traditional charging solutions.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="overflow-x-auto"
          >
            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-lg">
              <thead>
                <tr className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
                  <th className="py-4 px-6 text-left">Feature</th>
                  <th className="py-4 px-6 text-center">EVolve Charge</th>
                  <th className="py-4 px-6 text-center">Traditional Wall Chargers</th>
                  <th className="py-4 px-6 text-center">Public Charging</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { 
                    feature: "Automatic Connection", 
                    evolve: "Yes", 
                    traditional: "No", 
                    public: "No" 
                  },
                  { 
                    feature: "Off-Peak Charging Optimization", 
                    evolve: "Automatic", 
                    traditional: "Manual", 
                    public: "No" 
                  },
                  { 
                    feature: "Battery Health Monitoring", 
                    evolve: "Advanced", 
                    traditional: "Basic/None", 
                    public: "None" 
                  },
                  { 
                    feature: "Remote Control & Monitoring", 
                    evolve: "Full Features", 
                    traditional: "Limited", 
                    public: "Very Limited" 
                  },
                  { 
                    feature: "Smart Home Integration", 
                    evolve: "Comprehensive", 
                    traditional: "Limited", 
                    public: "None" 
                  },
                  { 
                    feature: "Cost Optimization", 
                    evolve: "Automatic", 
                    traditional: "Manual", 
                    public: "Fixed Rates" 
                  }
                ].map((row, index) => (
                  <tr key={row.feature} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 px-6 border-b border-gray-200 text-gray-900 font-medium">{row.feature}</td>
                    <td className="py-4 px-6 border-b border-gray-200 text-center text-teal-500 font-medium">{row.evolve}</td>
                    <td className="py-4 px-6 border-b border-gray-200 text-center text-gray-700">{row.traditional}</td>
                    <td className="py-4 px-6 border-b border-gray-200 text-center text-gray-700">{row.public}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Future of EV Charging?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join our growing community of EV owners who are enjoying the convenience and efficiency of EVolve Charge.
            </p>
            <a href="/order">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-white text-teal-500 font-medium shadow-md hover:shadow-lg transition-all"
              >
                Pre-Order Now
              </motion.button>
            </a>
            <p className="mt-4 text-sm opacity-80">Limited early-bird pricing available. Free installation included.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}