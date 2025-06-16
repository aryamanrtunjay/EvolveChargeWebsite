"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
      staggerChildren: 0.1
    }
  }
};

// FAQ Item Component
function FAQItem({ question, answer, isActive, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="mb-4 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full text-left px-6 py-5 focus:outline-none hover:bg-gray-50 transition-all"
      >
        <h3 className="text-lg font-semibold text-gray-900 pr-4">{question}</h3>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-500 flex-shrink-0 transform transition-transform duration-300 ${
          isActive ? 'rotate-180' : ''
        }`}>
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isActive ? 'auto' : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className={`px-6 pb-5 text-gray-600 leading-relaxed ${isActive ? 'bg-gray-50/50' : ''}`}>
          <div className="pt-2 border-t border-gray-100">
            {typeof answer === 'string' ? (
              <p>{answer}</p>
            ) : (
              answer
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Category Filter Component
function CategoryFilter({ categories, activeCategory, onCategoryChange }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={staggerContainer}
      className="flex flex-wrap justify-center gap-3 mb-12"
    >
      {categories.map((category) => (
        <motion.button
          key={category.id}
          variants={fadeIn}
          onClick={() => onCategoryChange(category.id)}
          className={`px-6 py-3 rounded-full font-medium transition-all ${
            activeCategory === category.id
              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-teal-50 hover:text-teal-600 shadow-sm border border-gray-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex items-center">
            {category.icon}
            <span className="ml-2">{category.name}</span>
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}

// Search Component
function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="max-w-2xl mx-auto mb-12"
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search frequently asked questions..."
          className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
        />
      </div>
    </motion.div>
  );
}

// Contact CTA Component
function ContactCTA() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeIn}
      className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8 md:p-12 text-center border border-teal-100"
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Our expert support team is here to help you with any questions about the EVolve Charger.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
            <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Email Support</h4>
            <p className="text-gray-600 text-sm mb-3">Get detailed answers via email</p>
            <a href="mailto:support@evolvecharger.com" className="text-teal-600 font-medium hover:text-teal-700">
              support@evolvecharger.com
            </a>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
            <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Phone Support</h4>
            <p className="text-gray-600 text-sm mb-3">Speak with our experts directly</p>
            <a href="tel:+1-555-EVOLVE" className="text-teal-600 font-medium hover:text-teal-700">
              1-555-EVOLVE
            </a>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/50">
            <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Live Chat</h4>
            <p className="text-gray-600 text-sm mb-3">Chat with us in real-time</p>
            <button className="text-teal-600 font-medium hover:text-teal-700">
              Start Chat
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Contact Support
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 rounded-full bg-white/70 backdrop-blur-sm border border-teal-200 text-teal-700 font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Schedule a Call
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFAQ, setActiveFAQ] = useState(null);

  const categories = [
    {
      id: 'all',
      name: 'All Questions',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7l2 2-2 2m-2 6l2 2-2 2" /></svg>
    },
    {
      id: 'product',
      name: 'Product Features',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    {
      id: 'installation',
      name: 'Installation',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
    },
    {
      id: 'compatibility',
      name: 'Compatibility',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    {
      id: 'pricing',
      name: 'Pricing & Orders',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
    },
    {
      id: 'support',
      name: 'Support & Warranty',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    }
  ];

  const faqData = [
    // Product Features
    {
      category: 'product',
      question: "How does the automatic connection system work?",
      answer: (
        <div>
          <p className="mb-3">The EVolve Charger uses a patented magnetic connection system that automatically detects when your vehicle is in position. Here's how it works:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Vehicle detection sensors identify your EV's presence</li>
            <li>The charging arm extends and aligns with your vehicle's charge port</li>
            <li>Magnetic connectors ensure a secure, weatherproof connection</li>
            <li>Charging begins automatically based on your preset preferences</li>
            <li>The system disconnects safely when charging is complete or you're ready to leave</li>
          </ul>
        </div>
      )
    },
    {
      category: 'product',
      question: "What makes the EVolve Charger 'smart'?",
      answer: "The EVolve Charger includes advanced AI algorithms that learn your driving patterns, monitor electricity rates in real-time, and optimize charging schedules to minimize costs. It can integrate with your home energy management system, respond to voice commands, and provide detailed analytics through our mobile app."
    },
    {
      category: 'product',
      question: "How fast does the EVolve Charger charge my vehicle?",
      answer: "The EVolve Charger provides up to 48A / 11.5kW of power, delivering approximately 35-40 miles of range per hour of charging for most electric vehicles. Actual charging speed depends on your vehicle's onboard charger capacity and battery conditions."
    },
    {
      category: 'product',
      question: "Does the charger work in all weather conditions?",
      answer: "Yes! The EVolve Charger is rated IP65 for weather resistance and operates reliably in temperatures from -40°F to 122°F (-40°C to 50°C). All connections are weathersealed, and the system includes built-in protection against rain, snow, ice, and extreme temperatures."
    },
    {
      category: 'product',
      question: "Can I control when my vehicle charges?",
      answer: "Absolutely! Through our mobile app, you can set specific charging schedules, set maximum charge levels, take advantage of time-of-use electricity rates, and even integrate with solar panel systems. The charger can also respond to utility demand response programs to help reduce energy costs."
    },

    // Installation
    {
      category: 'installation',
      question: "How long does installation take?",
      answer: "Most installations take 25-30 minutes for DIY setup with basic tools (ladder, drill, screwdriver). Professional installation is available and typically takes 1-2 hours, including electrical work if needed. Installation time may be longer if electrical upgrades are required."
    },
    {
      category: 'installation',
      question: "Do I need an electrician to install the EVolve Charger?",
      answer: "Not necessarily. If you have an existing 240V outlet (like a NEMA 14-50 used for electric dryers), you can install the EVolve Charger yourself using our step-by-step guide. If you need a new electrical circuit or outlet installed, you'll need a licensed electrician."
    },
    {
      category: 'installation',
      question: "What electrical requirements does the charger have?",
      answer: (
        <div>
          <p className="mb-3">The EVolve Charger requires:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>240V AC electrical supply</li>
            <li>50-amp circuit breaker (recommended)</li>
            <li>NEMA 14-50 outlet or hardwired installation</li>
            <li>WiFi connection for smart features</li>
            <li>Adequate clearance (10 feet minimum ceiling height)</li>
          </ul>
        </div>
      )
    },
    {
      category: 'installation',
      question: "Can the EVolve Charger be installed in any garage?",
      answer: "The EVolve Charger can be installed in most residential garages with at least 10 feet of ceiling height and adequate electrical service. Our pre-installation assessment tool can help determine if your garage is compatible, and our support team can provide guidance for unique situations."
    },
    {
      category: 'installation',
      question: "What if I rent my home or live in an apartment?",
      answer: "Installation in rental properties requires landlord approval. The EVolve Charger can be uninstalled and moved to a new location if needed. For apartments and condos, check with your building management about electrical access and installation permissions."
    },

    // Compatibility
    {
      category: 'compatibility',
      question: "Which electric vehicles are compatible with the EVolve Charger?",
      answer: (
        <div>
          <p className="mb-3">The EVolve Charger is compatible with all electric vehicles that use the J1772 standard connector, including:</p>
          <ul className="list-disc list-inside space-y-1 text-sm mb-3">
            <li>Tesla vehicles (with included adapter)</li>
            <li>Nissan Leaf</li>
            <li>Chevrolet Bolt EV/EUV</li>
            <li>Ford Mustang Mach-E, F-150 Lightning</li>
            <li>BMW i3, i4, iX</li>
            <li>Volkswagen ID.4</li>
            <li>Hyundai Ioniq 5, Kona Electric</li>
            <li>And virtually all other EVs sold in North America</li>
          </ul>
          <p className="text-sm">Note: Tesla vehicles require the included J1772 adapter for compatibility.</p>
        </div>
      )
    },
    {
      category: 'compatibility',
      question: "Will the EVolve Charger work with future EV models?",
      answer: "Yes! The EVolve Charger uses the industry-standard J1772 connector and is designed to be future-compatible. Our software receives regular updates to support new vehicle models and features as they become available."
    },
    {
      category: 'compatibility',
      question: "Can I use the charger with multiple vehicles?",
      answer: "Absolutely! The EVolve Charger can store profiles for multiple vehicles and automatically detect which vehicle is connected. Each vehicle can have its own charging preferences, schedules, and settings."
    },
    {
      category: 'compatibility',
      question: "Does the charger work with plug-in hybrids (PHEVs)?",
      answer: "Yes, the EVolve Charger works perfectly with plug-in hybrid electric vehicles (PHEVs) like the Toyota Prius Prime, Honda Clarity, and BMW 330e. The intelligent charging system adapts to the smaller battery capacity of PHEVs."
    },

    // Pricing & Orders
    {
      category: 'pricing',
      question: "How much does the EVolve Charger cost?",
      answer: (
        <div>
          <p className="mb-3">EVolve Charger pricing:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>EVolve Standard:</strong> $1,199 (Pre-order: $1,199, Regular: $1,499)</li>
            <li><strong>EVolve Pro:</strong> $1,599 (Pre-order: $1,599, Regular: $1,999)</li>
            <li><strong>EVolve Enterprise:</strong> $2,299 (Pre-order: $2,299, Regular: $2,799)</li>
          </ul>
          <p className="text-sm mt-3">Pre-order pricing includes free shipping and a 30-day money-back guarantee.</p>
        </div>
      )
    },
    {
      category: 'pricing',
      question: "Are there any ongoing fees or subscription costs?",
      answer: "No! There are no monthly fees, subscription costs, or hidden charges. All smart features, mobile app access, and software updates are included with your one-time purchase. Optional premium support plans are available but not required."
    },
    {
      category: 'pricing',
      question: "When will my EVolve Charger ship?",
      answer: "Pre-orders are expected to ship in Q2 2025. You'll receive email updates throughout the manufacturing process, including shipping notifications with tracking information. Pre-order customers receive priority shipping."
    },
    {
      category: 'pricing',
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and financing options through Affirm. Business customers can also pay via bank transfer or purchase order."
    },
    {
      category: 'pricing',
      question: "Can I cancel or modify my pre-order?",
      answer: "Yes, you can cancel or modify your pre-order at any time before shipping with no penalty. Simply contact our customer service team or log into your account to make changes."
    },

    // Support & Warranty
    {
      category: 'support',
      question: "What warranty does the EVolve Charger come with?",
      answer: (
        <div>
          <p className="mb-3">Warranty coverage varies by model:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>EVolve Standard:</strong> 3-year full warranty</li>
            <li><strong>EVolve Pro:</strong> 5-year full warranty</li>
            <li><strong>EVolve Enterprise:</strong> Lifetime warranty</li>
          </ul>
          <p className="text-sm mt-3">All warranties cover parts, labor, and software support. Extended warranty options are available for Standard and Pro models.</p>
        </div>
      )
    },
    {
      category: 'support',
      question: "What kind of customer support is available?",
      answer: "We offer comprehensive support including email support, phone support during business hours, live chat, and an extensive online knowledge base. Pro and Enterprise customers receive priority support with faster response times."
    },
    {
      category: 'support',
      question: "How do software updates work?",
      answer: "The EVolve Charger receives automatic over-the-air software updates via WiFi. Updates include new features, performance improvements, and security patches. You can choose to install updates immediately or schedule them for convenient times."
    },
    {
      category: 'support',
      question: "What happens if there's a power outage?",
      answer: "The EVolve Charger automatically resumes operation after power is restored. All your settings and schedules are stored in the cloud, so nothing is lost. The system includes surge protection to prevent damage from power fluctuations."
    },
    {
      category: 'support',
      question: "How do I troubleshoot common issues?",
      answer: "The EVolve Charger includes built-in diagnostics accessible through the mobile app. Common issues can often be resolved with the app's troubleshooting guide. For more complex problems, our support team can remotely diagnose and often resolve issues without a service visit."
    },

    // General/Miscellaneous
    {
      category: 'product',
      question: "How much energy does the EVolve Charger use when not charging?",
      answer: "The EVolve Charger uses less than 3 watts in standby mode - about the same as a nightlight. The smart features and WiFi connectivity have minimal impact on your electricity bill."
    },
    {
      category: 'installation',
      question: "Can the charger be used outdoors?",
      answer: "While the EVolve Charger is weather-resistant (IP65 rated), it's designed primarily for covered installation in garages. Outdoor installation requires additional weatherproofing and may void the warranty unless specifically approved."
    },
    {
      category: 'compatibility',
      question: "What smartphone apps are available?",
      answer: "The EVolve Charger app is available for both iOS and Android devices. The app provides full control over charging schedules, monitors energy usage, sends notifications, and allows remote operation of all charger functions."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  // Filter FAQs based on category and search term
  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50">
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Frequently Asked Questions
            </motion.div>
            
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900"
            >
              <span className="block">Everything You Need</span>
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                to Know
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Find answers to common questions about the EVolve Charger, from installation 
              and compatibility to pricing and support.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
          
          <CategoryFilter 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No questions found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any questions matching your search. Try adjusting your search terms or browse different categories.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-lg hover:shadow-xl transition-all"
              >
                View All Questions
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-2"
            >
              {filteredFAQs.map((faq, index) => (
                <FAQItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isActive={activeFAQ === index}
                  onClick={() => toggleFAQ(index)}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactCTA />
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeIn} className="text-3xl font-bold text-gray-900 mb-4">
              Helpful Resources
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore additional resources to help you get the most out of your EVolve Charger.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Installation Guide",
                description: "Step-by-step installation instructions with videos",
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
                link: "/installation-guide"
              },
              {
                title: "User Manual",
                description: "Complete guide to using your EVolve Charger",
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                link: "/user-manual"
              },
              {
                title: "Mobile App",
                description: "Download the EVolve Charger app for iOS and Android",
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
                link: "/mobile-app"
              },
              {
                title: "Warranty Registration",
                description: "Register your product for warranty coverage",
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                link: "/warranty-registration"
              }
            ].map((resource, index) => (
              <motion.a
                key={index}
                href={resource.link}
                variants={fadeIn}
                className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-teal-200 transition-all"
              >
                <div className="bg-teal-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-100 transition-colors">
                  <div className="text-teal-600">
                    {resource.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {resource.description}
                </p>
                <div className="mt-4 flex items-center text-teal-600 text-sm font-medium">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                EVolve Charger
              </h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Revolutionizing electric vehicle charging with intelligent automation, 
                smart energy management, and advanced battery care technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Specifications</a></li>
                <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Installation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Warranty</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">Live Chat</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 EVolve Charger. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}