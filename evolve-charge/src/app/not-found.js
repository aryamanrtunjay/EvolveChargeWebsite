"use client";

import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Home, Search, Zap, Battery, ArrowRight, RotateCcw, ShoppingCart, WifiOff } from 'lucide-react';

export default function NotFoundPage() {
  const [isCharging, setIsCharging] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(15);
  const [glitchText, setGlitchText] = useState('404');
  const [searchQuery, setSearchQuery] = useState('');
  const [sparkles, setSparkles] = useState([]);
  
  const controls = useAnimation();

  // Glitch effect for 404 text
  const glitchChars = ['4', '0', '4', '♦', '◆', '▲', '●', '■'];
  
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomText = Array.from({length: 3}, () => 
          glitchChars[Math.floor(Math.random() * glitchChars.length)]
        ).join('');
        setGlitchText(randomText);
        
        setTimeout(() => setGlitchText('404'), 150);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Battery charging animation
  useEffect(() => {
    if (isCharging) {
      const chargingInterval = setInterval(() => {
        setBatteryLevel(prev => {
          if (prev >= 100) {
            setIsCharging(false);
            return 100;
          }
          return prev + 5;
        });
      }, 200);

      return () => clearInterval(chargingInterval);
    }
  }, [isCharging]);

  // Sparkle effect
  useEffect(() => {
    const createSparkle = () => {
      const newSparkle = {
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 6 + 2,
        duration: Math.random() * 3 + 2
      };
      
      setSparkles(prev => [...prev.slice(-10), newSparkle]);
      
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
      }, newSparkle.duration * 1000);
    };

    const sparkleInterval = setInterval(createSparkle, 800);
    return () => clearInterval(sparkleInterval);
  }, []);

  const handleCharge = () => {
    setIsCharging(true);
    setBatteryLevel(15);
    controls.start({
      rotate: 360,
      transition: { duration: 1, ease: "easeInOut" }
    });
  };

  const popularPages = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Support Us', path: '/support', icon: Zap },
    { name: 'About', path: '/about', icon: Battery },
    { name: 'Order', path: '/order', icon: ShoppingCart }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating sparkles */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0, 1, 0],
            rotate: 360 
          }}
          transition={{ 
            duration: sparkle.duration,
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
        </motion.div>
      ))}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Main 404 Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Glitch 404 Text */}
          <motion.h1 
            className="text-8xl md:text-9xl font-black mb-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent relative"
            style={{
              fontFamily: 'monospace',
              textShadow: '0 0 30px rgba(20, 184, 166, 0.5)'
            }}
          >
            {glitchText}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent opacity-30"
              animate={{
                x: [0, 2, -2, 0],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 0.2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {glitchText}
            </motion.div>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Connection Lost
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              It looks like we couldn't find this page... Don't worry, we can get you back on track 
              faster than our automatic charger plugs in!
            </p>
          </motion.div>

          {/* Interactive Battery Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mb-12"
          >
            <div className="bg-gray-50/80 backdrop-blur-md rounded-2xl p-8 border border-gray-200 max-w-md mx-auto shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-900 font-medium">Page Battery</span>
                <span className="text-cyan-600 font-bold">{batteryLevel}%</span>
              </div>
              
              {/* Battery Icon */}
              <div className="relative mb-6">
                <div className="w-24 h-12 border-3 border-gray-300 rounded-lg mx-auto relative overflow-hidden bg-gray-100">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-sm"
                    initial={{ width: '15%' }}
                    animate={{ width: `${batteryLevel}%` }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-4 bg-gray-300 rounded-r"></div>
                </div>
                
                {isCharging && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Zap className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </div>

              <motion.button
                onClick={handleCharge}
                disabled={isCharging}
                animate={controls}
                className="w-full py-3 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCharging ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Charging...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Recharge Page
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="w-full max-w-4xl mx-auto"
        >
          {/* Popular Pages */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Destinations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularPages.map((page, index) => {
                const Icon = page.icon;
                return (
                  <motion.a
                    key={page.path}
                    href={page.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    className="group bg-gray-50/80 backdrop-blur-md rounded-xl p-6 border border-gray-200 hover:bg-gray-100/80 transition-all duration-300 hover:scale-105 shadow-lg"
                    whileHover={{ y: -5 }}
                  >
                    <Icon className="w-8 h-8 text-cyan-500 mx-auto mb-3 group-hover:text-cyan-600 transition-colors" />
                    <span className="text-gray-900 font-medium">{page.name}</span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 text-sm mb-4">
            Lost? Don't worry, even Tesla's autopilot gets confused sometimes.
          </p>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <WifiOff className="w-4 h-4" />
            <span className="text-xs">Connection Status: 404</span>
          </div>
        </motion.div>

        {/* Floating Action Elements */}
        <motion.div
          className="fixed bottom-8 right-8"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.6 }}
        >
          <motion.a
            href="/support-us"
            className="group w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Zap className="w-8 h-8 text-white group-hover:animate-pulse" />
          </motion.a>
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Support Our Mission
          </div>
        </motion.div>
      </div>
    </div>
  );
}