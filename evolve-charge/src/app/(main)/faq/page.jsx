'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Script from 'next/script';
import Head from 'next/head';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
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
      className="mb-4 bg-white/70 backdrop-blur-md rounded-xl overflow-hidden border border-black/10 shadow-sm hover:shadow-md transition-all"
    >
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full text-left px-6 py-5 focus:outline-none hover:bg-white/80 transition-all"
      >
        <h3 className="text-lg font-semibold text-[#111111] pr-4 tracking-wide">{question}</h3>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-[#C9A86A]/10 text-[#C9A86A] flex-shrink-0 transform transition-transform duration-300 ${
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
        <div className={`px-6 pb-5 text-[#6F6F6F] leading-relaxed ${isActive ? 'bg-white/50' : ''}`}>
          <div className="pt-2 border-t border-black/10">
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
      className="flex flex-wrap justify-center gap-2 mb-12"
    >
      {categories.map((category) => (
        <motion.button
          key={category.id}
          variants={fadeIn}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-3 rounded-full font-medium transition-all ${
            activeCategory === category.id
              ? 'bg-[#C9A86A] text-[#111111] shadow-lg'
              : 'bg-white/70 backdrop-blur-md text-[#111111]/70 border border-black/10 shadow-sm hover:bg-[#F5F6F7] hover:text-[#111111]'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="flex items-center">
            {category.icon}
            <span className="ml-2 tracking-wide">{category.name}</span>
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
          <svg className="h-5 w-5 text-[#6F6F6F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search frequently asked questions..."
          className="block text-[#111111] w-full pl-12 pr-4 py-4 border border-black/10 rounded-xl leading-5 bg-white/70 backdrop-blur-md placeholder-[#6F6F6F] focus:outline-none focus:ring-2 focus:ring-[#C9A86A]/50 focus:border-transparent shadow-sm"
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
      className="bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 text-center border border-black/10 shadow-lg"
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C9A86A]/10 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#C9A86A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-[#111111] mb-4 tracking-tight">
            Still Have Questions?
          </h3>
          <p className="text-lg text-[#6F6F6F] mb-8 leading-relaxed">
            Our expert support team is here to help you with any questions about Ampereon.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-black/10">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 bg-[#C9A86A]/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#C9A86A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-[#111111] mb-2 tracking-wide">Email Support</h4>
            <p className="text-[#6F6F6F] text-sm mb-3">Get detailed answers via email</p>
            <a href="mailto:support@evolvecharger.com" className="text-[#C9A86A] font-medium hover:text-[#B48F55]">
              support@evolvecharger.com
            </a>
          </div>
          
          <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-black/10">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 bg-[#C9A86A]/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#C9A86A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h4 className="font-semibold text-[#111111] mb-2 tracking-wide">Phone Support</h4>
            <p className="text-[#6F6F6F] text-sm mb-3">Speak with our experts directly</p>
            <a href="tel:+1-555-EVOLVE" className="text-[#C9A86A] font-medium hover:text-[#B48F55]">
              1-555-EVOLVE
            </a>
          </div>
          
          <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 border border-black/10">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 bg-[#C9A86A]/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#C9A86A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="font-semibold text-[#111111] mb-2 tracking-wide">Live Chat</h4>
            <p className="text-[#6F6F6F] text-sm mb-3">Chat with us in real-time</p>
            <button className="text-[#C9A86A] font-medium hover:text-[#B48F55]">
              Start Chat
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: '#D1B47A' }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full bg-[#C9A86A] text-[#111111] font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Contact Support
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full bg-white/70 backdrop-blur-md border border-black/10 text-[#111111]/70 font-medium shadow-lg hover:bg-[#F5F6F7] transition-all"
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
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14-7l2 2-2 2m-2 6l2 2-2 2" /></svg>
    },
    {
      id: 'product',
      name: 'Product Features',
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
      name: 'Support & Warranty',
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
          <p className="mb-3">Ampereon uses a magnetic connection system that automatically detects when your vehicle is in position. Here's how it works:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Our patent-pending algorithm determines the best time to plug in your vehicle.</li>
            <li>The charger autonomously navigates above your vehicle's charge port.</li>
            <li>The charging cable descends until it's aligned with the charging cable.</li>
            <li>The charger aligns via magnets to the vehicle's charge port and snaps to it.</li>
            <li>The plug is pushed in automatically and charging begins.</li>
            <li>The system disconnects safely when charging is complete or you're ready to leave</li>
          </ul>
        </div>
      )
    },
    {
      category: 'product',
      question: "What makes Ampereon 'smart'?",
      answer: "Ampereon includes advanced AI algorithms that learn your driving patterns, monitor electricity rates in real-time, and optimize charging schedules to minimize costs. It can integrate with your home energy management system, respond to voice commands, and provide detailed analytics through our mobile app."
    },
    {
      category: 'product',
      question: "How fast does Ampereon charge my vehicle?",
      answer: "Ampereon uses the charging cable that comes with your vehicle, no additional overhead required. So however much power your outlet can deliver and your vehicle can accept, that's the speed of charging."
    },
    {
      category: 'product',
      question: "Does the charger work in all weather conditions?",
      answer: "The current version of Ampereon is designed for use inside the garage, we plan on releasing a version that can charge vehicles parked outside the garage soon!"
    },
    {
      category: 'product',
      question: "Can I control when my vehicle charges?",
      answer: "Absolutely! Through our mobile app, you can set specific charging schedules, set maximum charge levels, take advantage of time-of-use electricity rates, and even tell us if you have trips coming up that need more battery!"
    },

    // Installation
    {
      category: 'installation',
      question: "How long does installation take?",
      answer: "Installation takes 25-30 minutes with basic tools (ladder, drill, screwdriver). Professional installation is available if you do not have these tools and will take 10-15 minutes at a low cost. Installation time may be longer if electrical upgrades are required."
    },
    {
      category: 'installation',
      question: "Do I need an electrician to install Ampereon?",
      answer: "Not necessarily. If you have an outlet in your garage that you already use to charge your car, Ampereon integrates seamlessly into that system. You can easily install Ampereon yourself using our step-by-step guide. If you need a new electrical circuit or outlet installed, we will provide an electrician though rates for this service depend on the complexity of the job."
    },
    {
      category: 'installation',
      question: "Can Ampereon be installed in any garage?",
      answer: "Ampereon can be installed in most residential garages with at least 10 feet of ceiling height and adequate electrical service. Our pre-installation assessment tool can help determine if your garage is compatible, and our support team can provide guidance for unique situations."
    },
    {
      category: 'installation',
      question: "What if I rent my home or live in an apartment?",
      answer: "Installation in rental properties requires landlord approval. Ampereon can be uninstalled and moved to a new location if needed. For apartments and condos, check with your building management about electrical access and installation permissions."
    },

    // Compatibility
    {
      category: 'compatibility',
      question: "Which electric vehicles are compatible with Ampereon?",
      answer: (
        <div>
          <p className="mb-3">At this current point in time, Ampereon is compatible with:</p>
          <ul className="list-disc list-inside space-y-1 text-sm mb-3">
            <li>All Tesla Vehicles</li>
            <li>All Hyundai EVs</li>
          </ul>
          <p>We will be expanding our compatibility rapidly as we develop adapters to interact with each vehicle!</p>
        </div>
      )
    },
    {
      category: 'compatibility',
      question: "Will Ampereon work with future EV models?",
      answer: "Yes! Ampereon uses the industry-standard NACS connector and is designed to be future-compatible. The charger is capable of Over-The-Air (OTA) updates so upgrades will be regularly sent to existing chargers and to any new charger to support new vehicle models and features as they become available."
    },
    {
      category: 'compatibility',
      question: "Can I use the charger with multiple vehicles?",
      answer: "Absolutely! Ampereon can navigate to and store profiles for as many vehicles as you can fit in your garage and charging cable can reach with automatic detection of which vehicle requires charging. Each vehicle can have its own charging preferences, schedules, and settings."
    },

    // Pricing & Orders
    {
      category: 'pricing',
      question: "How much does Ampereon cost?",
      answer: "The charger has a fixed cost of $124.99, this includes the entire charger assembly. If you do not have a charging cable or your vehicle did not come with one then it costs $319.99 to also purchase the charging cable."
    },
    {
      category: 'pricing',
      question: "Are there any ongoing fees or subscription costs?",
      answer: "No! There are no monthly fees, subscription costs, or hidden charges. All smart features, mobile app access, and software updates are included with your one-time purchase."
    },
    {
      category: 'pricing',
      question: "When will my Ampereon ship?",
      answer: "The first 55 orders within the Puget Sound region of Washington state will be delivered at latest by December 1, 2025. Orders outside this region and outside the first 55 will receive their charger once their turn in line has arrived. You'll receive email updates throughout the manufacturing process, including shipping notifications with tracking information."
    },
    {
      category: 'pricing',
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Google Pay, and financing options through Klarna. Business customers can also pay via bank transfer or purchase order."
    },

    // Support & Warranty
    {
      category: 'support',
      question: "What warranty does Ampereon come with?",
      answer: "We provide a 3 month warranty with the option to add an additional 2 years to that for just $49.99"
    },
    {
      category: 'support',
      question: "What kind of customer support is available?",
      answer: "We offer comprehensive support including email support and phone support during business hours, alongside this FAQ page."
    },
    {
      category: 'support',
      question: "How do software updates work?",
      answer: "Ampereon receives automatic over-the-air software updates via WiFi. Updates include new features, performance improvements, and security patches. The updates will automatically install when there are no charges scheduled."
    },
    {
      category: 'support',
      question: "What happens if there's a power outage?",
      answer: "Ampereon automatically resumes operation after power is restored. All your settings and schedules are stored securely in the cloud, so nothing is lost."
    },
    {
      category: 'support',
      question: "How do I troubleshoot common issues?",
      answer: "Ampereon includes built-in diagnostics accessible through the mobile app. Common issues can often be resolved with the app's troubleshooting guide. For more complex problems, our support team can remotely diagnose and often resolve issues without a service visit."
    },

    // General/Miscellaneous
    {
      category: 'product',
      question: "How much energy does Ampereon use when not charging?",
      answer: "Ampereon uses less than 3 watts in standby mode - about the same as a nightlight. The smart features and WiFi connectivity have minimal impact on your electricity bill."
    },
    {
      category: 'installation',
      question: "Can the charger be used outdoors?",
      answer: "The current version of Ampereon is designed for use inside the garage, we plan on releasing a version that can charge vehicles parked outside the garage soon!"
    },
    {
      category: 'compatibility',
      question: "What smartphone apps are available?",
      answer: "Ampereon app is available for both iOS and Android devices. The app provides full control over charging schedules, monitors energy usage, sends notifications, and allows remote operation of all charger functions."
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
              className="inline-flex items-center px-4 py-2 rounded-full bg-[#C9A86A]/10 text-[#C9A86A] text-sm font-medium mb-6 tracking-wide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Frequently Asked Questions
            </motion.div>
            
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-[#111111] tracking-tight"
            >
              <span className="block">Everything You Need</span>
              <span className="text-[#C9A86A]">
                to Know
              </span>
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-xl text-[#6F6F6F] mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Find answers to common questions about Ampereon, from installation 
              and compatibility to pricing and support.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-16 bg-[#F5F6F7]">
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
              <div className="bg-[#F5F6F7] rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#6F6F6F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#111111] mb-4 tracking-wide">No questions found</h3>
              <p className="text-[#6F6F6F] mb-6 leading-relaxed">
                We couldn't find any questions matching your search. Try adjusting your search terms or browse different categories.
              </p>
              <motion.button
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('all');
                }}
                whileHover={{ scale: 1.05, backgroundColor: '#D1B47A' }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-full bg-[#C9A86A] text-[#111111] font-medium shadow-lg hover:shadow-xl transition-all"
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

      {/* Contact CTA Section */}
      {/* <section className="py-20 bg-[#F5F6F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactCTA />
        </div>
      </section> */}

      {/* Quick Links Section */}
      {/* <section className="py-16 bg-white border-t border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeIn} className="text-3xl font-bold text-[#111111] mb-4 tracking-tight">
              Helpful Resources
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-[#6F6F6F] max-w-2xl mx-auto leading-relaxed">
              Explore additional resources to help you get the most out of your Ampereon.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Installation Guide",
                description: "Step-by-step installation instructions with videos",
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
                link: "/installation-guide"
              },
              {
                title: "User Manual",
                description: "Complete guide to using your Ampereon",
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                link: "/user-manual"
              },
              {
                title: "Mobile App",
                description: "Download Ampereon app for iOS and Android",
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
                link: "/mobile-app"
              },
              {
                title: "Warranty Registration",
                description: "Register your product for warranty coverage",
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                link: "/warranty-registration"
              }
            ].map((resource, index) => (
              <motion.a
                key={index}
                href={resource.link}
                variants={fadeIn}
                className="group bg-white/70 backdrop-blur-md rounded-xl p-6 border border-black/10 shadow-sm hover:shadow-md hover:border-[#C9A86A]/30 transition-all"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#C9A86A]/10 transition-colors bg-[#F5F6F7]">
                  <div className="text-[#C9A86A]">
                    {resource.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-[#111111] mb-2 group-hover:text-[#C9A86A] transition-colors tracking-wide">
                  {resource.title}
                </h3>
                <p className="text-[#6F6F6F] text-sm leading-relaxed">
                  {resource.description}
                </p>
                <div className="mt-4 flex items-center text-[#C9A86A] text-sm font-medium">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
}