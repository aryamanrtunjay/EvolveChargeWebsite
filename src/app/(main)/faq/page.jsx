'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';
import Head from 'next/head';

// Professional animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
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
      transition={{ delay: index * 0.03, duration: 0.4 }}
      className="mb-3 bg-[#2A2A2A]/60 backdrop-blur-sm rounded-xl overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-300"
    >
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full text-left px-6 py-5 focus:outline-none hover:bg-[#2A2A2A]/80 transition-all"
      >
        <h3 className="text-lg font-semibold text-white pr-4">{question}</h3>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex-shrink-0 transform transition-transform duration-300 ${
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
        <div className={`px-6 pb-5 text-gray-300 leading-relaxed ${isActive ? 'bg-[#1A1A1A]/60' : ''}`}>
          <div className="pt-3 border-t border-[#D4AF37]/20">
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
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeCategory === category.id
              ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white shadow-lg'
              : 'bg-[#2A2A2A]/60 text-gray-300 border border-[#D4AF37]/20 hover:bg-[#2A2A2A]/80 hover:text-white'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
      transition={{ duration: 0.6, delay: 0.2 }}
      className="max-w-2xl mx-auto mb-12"
    >
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search frequently asked questions..."
          className="block text-white w-full pl-12 pr-4 py-4 border border-[#D4AF37]/20 rounded-xl bg-[#2A2A2A]/60 backdrop-blur-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all"
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
      className="bg-[#2A2A2A]/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 text-center border border-[#D4AF37]/20"
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#D4AF37]/20 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            Need Additional Support?
          </h3>
          <p className="text-lg text-gray-300 mb-8 leading-relaxed">
            Our support team is here to help with any questions about your Ampereon system.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#1A1A1A]/60 rounded-xl p-6 border border-[#D4AF37]/20">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 bg-[#D4AF37]/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-white mb-2">Email Support</h4>
            <p className="text-gray-400 text-sm mb-3">Get detailed answers via email</p>
            <a href="mailto:support@ampereonenergy.com" className="text-[#D4AF37] font-medium hover:text-white transition-colors">
              support@ampereonenergy.com
            </a>
          </div>
          
          <div className="bg-[#1A1A1A]/60 rounded-xl p-6 border border-[#D4AF37]/20">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 bg-[#D4AF37]/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-white mb-2">Documentation</h4>
            <p className="text-gray-400 text-sm mb-3">Comprehensive guides and manuals</p>
            <button className="text-[#D4AF37] font-medium hover:text-white transition-colors">
              View Resources
            </button>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium shadow-lg hover:shadow-xl transition-all"
        >
          Contact Support
        </motion.button>
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
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14-7l2 2-2 2m-2 6l2 2-2 2" /></svg>
    },
    {
      id: 'product',
      name: 'Product',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    {
      id: 'installation',
      name: 'Installation',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
    },
    {
      id: 'compatibility',
      name: 'Compatibility',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    {
      id: 'pricing',
      name: 'Pricing & Orders',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>
    },
    {
      id: 'support',
      name: 'Support',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    }
  ];

  const faqData = [
    // Product Features
    {
      category: 'product',
      question: "How does the automatic connection system work?",
      answer: (
        <div>
          <p className="mb-3">Ampereon uses a sophisticated magnetic connection system that automatically detects when your vehicle is in position. Here's how it works:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Our algorithm determines the optimal time to charge your vehicle</li>
            <li>The charger autonomously navigates to your vehicle's charge port</li>
            <li>The charging cable descends and aligns with the charging port</li>
            <li>Magnetic alignment ensures proper connection and charging begins</li>
            <li>The system safely disconnects when charging is complete</li>
          </ul>
        </div>
      )
    },
    {
      category: 'product',
      question: "What makes Ampereon intelligent?",
      answer: "Ampereon includes advanced algorithms that learn your driving patterns, monitor electricity rates in real-time, and optimize charging schedules to minimize costs. It integrates with home energy systems and provides detailed analytics through our mobile app."
    },
    {
      category: 'product',
      question: "How fast does Ampereon charge my vehicle?",
      answer: "Ampereon uses your existing charging cable and outlet, so the charging speed depends on your outlet's power capacity and your vehicle's acceptance rate. The system adds no overhead to the charging process."
    },
    {
      category: 'product',
      question: "Does the charger work in all weather conditions?",
      answer: "The current version of Ampereon is designed for garage use. We're developing a weather-resistant version for outdoor installation that will be available soon."
    },
    {
      category: 'product',
      question: "Can I control when my vehicle charges?",
      answer: "Yes. Through our mobile app, you can set charging schedules, maximum charge levels, take advantage of time-of-use electricity rates, and set preferences for upcoming trips."
    },

    // Installation
    {
      category: 'installation',
      question: "How long does installation take?",
      answer: "Installation typically takes 25-30 minutes with basic tools (ladder, drill, screwdriver). Professional installation is available and takes 10-15 minutes."
    },
    {
      category: 'installation',
      question: "Do I need an electrician to install Ampereon?",
      answer: "Not necessarily. If you have an existing garage outlet that you use for charging, Ampereon integrates with that system. You can install it yourself using our step-by-step guide. New electrical circuits require professional installation."
    },
    {
      category: 'installation',
      question: "Can Ampereon be installed in any garage?",
      answer: "Ampereon works in most residential garages with at least 10 feet of ceiling height and adequate electrical service. Our compatibility assessment tool can help determine if your garage is suitable."
    },
    {
      category: 'installation',
      question: "What if I rent my home?",
      answer: "Installation in rental properties requires landlord approval. Ampereon can be uninstalled and moved if needed. For apartments and condos, check with building management about installation permissions."
    },

    // Compatibility
    {
      category: 'compatibility',
      question: "Which electric vehicles are compatible?",
      answer: (
        <div>
          <p className="mb-3">Currently, Ampereon is compatible with:</p>
          <ul className="list-disc list-inside space-y-1 text-sm mb-3">
            <li>All Tesla vehicles</li>
            <li>All Hyundai EVs</li>
          </ul>
          <p>We're rapidly expanding compatibility with adapters for additional vehicle models.</p>
        </div>
      )
    },
    {
      category: 'compatibility',
      question: "Will Ampereon work with future EV models?",
      answer: "Yes. Ampereon uses the industry-standard NACS connector and supports over-the-air updates to add compatibility with new vehicle models as they become available."
    },
    {
      category: 'compatibility',
      question: "Can I use the charger with multiple vehicles?",
      answer: "Absolutely. Ampereon can store profiles for multiple vehicles with automatic detection and individual charging preferences for each vehicle."
    },

    // Pricing & Orders
    {
      category: 'pricing',
      question: "How much does Ampereon cost?",
      answer: "The Ampereon system costs $99. This includes the complete charger assembly. If you need a charging cable, the bundle costs $319.99."
    },
    {
      category: 'pricing',
      question: "Are there ongoing fees?",
      answer: "No. There are no monthly fees, subscription costs, or hidden charges. All features, mobile app access, and software updates are included with your purchase."
    },
    {
      category: 'pricing',
      question: "When will my order ship?",
      answer: "The first 55 orders in the Puget Sound region will be delivered by December 1, 2025. Other orders will receive their charger based on production schedule. You'll receive regular updates throughout the process."
    },
    {
      category: 'pricing',
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Google Pay. Business customers can also pay via bank transfer."
    },

    // Support & Warranty
    {
      category: 'support',
      question: "What warranty does Ampereon include?",
      answer: "We provide a 3-month warranty with the option to extend it to 2 years for $49.99."
    },
    {
      category: 'support',
      question: "What support is available?",
      answer: "We offer comprehensive support including email support, phone support during business hours, and this FAQ resource."
    },
    {
      category: 'support',
      question: "How do software updates work?",
      answer: "Ampereon receives automatic over-the-air software updates via WiFi. Updates include new features, performance improvements, and security patches that install when charging isn't scheduled."
    },
    {
      category: 'support',
      question: "What happens during a power outage?",
      answer: "Ampereon automatically resumes operation after power is restored. All settings and schedules are stored securely, so nothing is lost."
    },
    {
      category: 'support',
      question: "How do I troubleshoot issues?",
      answer: "Ampereon includes built-in diagnostics accessible through the mobile app. Common issues can often be resolved with the app's troubleshooting guide. Our support team can also provide remote assistance."
    },

    // Additional
    {
      category: 'product',
      question: "How much energy does Ampereon use when not charging?",
      answer: "Ampereon uses less than 3 watts in standby mode - about the same as a nightlight. The smart features have minimal impact on your electricity bill."
    },
    {
      category: 'installation',
      question: "Can the charger be used outdoors?",
      answer: "The current version is designed for garage use. We're developing a weather-resistant version for outdoor installation that will be available soon."
    },
    {
      category: 'compatibility',
      question: "What mobile apps are available?",
      answer: "The Ampereon app is available for both iOS and Android devices. The app provides full control over charging schedules, energy monitoring, notifications, and remote operation."
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
    <div className="min-h-screen bg-[#0A0A0A] text-white">
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
      <section className="relative pt-32 pb-16 overflow-hidden bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" className="text-[#D4AF37]">
            <defs>
              <pattern id="faqGrid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="0.5" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#faqGrid)" />
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div
              variants={fadeIn}
              className="inline-flex items-center px-4 py-2 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] text-sm font-medium mb-6 border border-[#D4AF37]/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Frequently Asked Questions
            </motion.div>
            
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-5xl font-light leading-tight mb-6 text-white"
            >
              <span className="block">Common Questions</span>
              <span className="font-semibold text-[#D4AF37]">
                About Ampereon
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Find answers to common questions about installation, compatibility, 
              pricing, and support for your Ampereon charging system.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F]">
        {/* Search and Filter Section */}
        <section className="py-16">
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
        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredFAQs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="bg-[#2A2A2A]/60 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">No questions found</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  We couldn't find any questions matching your search. Try adjusting your search terms or browse different categories.
                </p>
                <motion.button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('all');
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  View All Questions
                </motion.button>
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
      </div>

      {/* Contact CTA Section */}
      {/* <section className="py-20 bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactCTA />
        </div>
      </section> */}
    </div>
  );
}