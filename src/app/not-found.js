"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Zap, Battery, Wifi, Search, MapPin, Clock } from 'lucide-react';

// Simplified pattern overlay from the original design
const SubtlePattern = ({ opacity = 0.03 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
    <svg width="100%" height="100%" className="text-[#D4AF37]">
      <defs>
        <pattern id="subtleGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#subtleGrid)" />
    </svg>
  </div>
);

// Animated charging icon
const AnimatedChargingIcon = () => {
  const [charge, setCharge] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCharge(prev => (prev >= 100 ? 0 : prev + 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-24 h-32 mx-auto mb-8">
      <Battery className="w-24 h-32 text-[#D4AF37]" />
      <div 
        className="absolute bottom-2 left-2 right-2 bg-gradient-to-t from-[#D4AF37] to-[#B8860B] rounded-sm transition-all duration-100"
        style={{ height: `${(charge / 100) * 80}%` }}
      />
      <motion.div
        className="absolute -top-2 -right-2"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Zap className="w-8 h-8 text-[#D4AF37] fill-current" />
      </motion.div>
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 text-[#D4AF37] text-sm font-medium">
        {charge}%
      </div>
    </div>
  );
};

const Ampereon404 = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const suggestedPages = [
    { 
      title: "Smart EV Charging Technology", 
      path: "/product", 
      icon: <Zap className="w-4 h-4" />,
      description: "Learn about our intelligent charging system"
    },
    { 
      title: "Reserve Your Charger", 
      path: "/reserve", 
      icon: <Battery className="w-4 h-4" />,
      description: "Pre-order Ampereon for just $5"
    },
    { 
      title: "Installation Guide", 
      path: "/installation", 
      icon: <Wifi className="w-4 h-4" />,
      description: "Easy setup in 30 minutes"
    },
    { 
      title: "Support Community", 
      path: "/support-us", 
      icon: <MapPin className="w-4 h-4" />,
      description: "Join our EV charging community"
    }
  ];

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center relative overflow-hidden">
      <SubtlePattern />
      
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-[#D4AF37]/5 via-transparent to-transparent" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
      
        {/* 404 Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-8xl md:text-9xl font-light text-[#D4AF37] mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            Page Not <span className="font-semibold text-[#D4AF37]">Charged</span>
          </h2>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-light leading-relaxed"
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          Looks like this page needs a charge! The URL you're looking for might have been unplugged, moved, or doesn't exist. Let's get you back on the right path to smart EV charging.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] 
                     text-white font-medium rounded-lg hover:shadow-lg hover:shadow-[#D4AF37]/20 
                     transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </motion.button>

          <motion.a
            href="/"
            className="flex items-center gap-2 px-6 py-3 border border-[#D4AF37]/30 text-white 
                     font-medium rounded-lg hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 
                     transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.02 }}
          >
            <Home className="w-4 h-4" />
            Back to Home
          </motion.a>
        </motion.div>

        {/* Suggested pages */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.0 }}
        >
          <h3 className="text-xl font-medium mb-6 text-gray-300">
            Or explore these popular pages:
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {suggestedPages.map((page, index) => (
              <motion.a
                key={index}
                href={page.path}
                className="group bg-[#2A2A2A]/60 backdrop-blur-sm rounded-lg p-4 border border-[#D4AF37]/20 
                         hover:border-[#D4AF37]/40 hover:bg-[#2A2A2A]/80 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br 
                                from-[#D4AF37]/20 to-[#B8860B]/20 rounded-lg border border-[#D4AF37]/30 
                                text-[#D4AF37] flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    {page.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-white mb-1">{page.title}</h4>
                    <p className="text-sm text-gray-400">{page.description}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Help text */}
        <motion.div
          className="mt-12 pt-8 border-t border-[#D4AF37]/20"
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.4 }}
        >
          <p className="text-gray-400 mb-4">
            Still having trouble? Our EV charging experts are here to help.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a 
              href="/faq" 
              className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors duration-200"
            >
              <Clock className="w-4 h-4" />
              View FAQ
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Ampereon404;