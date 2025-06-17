"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

// Product Gallery Component
function ProductGallery() {
  const [activeImage, setActiveImage] = useState(0);
  
  const images = [
    { id: 1, src: "/api/placeholder/600/400", alt: "EVolve Charger Main View", label: "Main View" },
    { id: 2, src: "/api/placeholder/600/400", alt: "EVolve Charger Installation", label: "Installation" },
    { id: 3, src: "/api/placeholder/600/400", alt: "EVolve Charger App Interface", label: "App Control" },
    { id: 4, src: "/api/placeholder/600/400", alt: "EVolve Charger In Action", label: "In Action" },
  ];

  return (
    <div className="space-y-4">
      <motion.div 
        className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-xl"
        layoutId="main-image"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={images[activeImage].src}
            alt={images[activeImage].alt}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </motion.div>
      
      <div className="grid grid-cols-4 gap-3">
        {images.map((image, index) => (
          <motion.button
            key={image.id}
            onClick={() => setActiveImage(index)}
            className={`relative aspect-video rounded-lg overflow-hidden transition-all ${
              activeImage === index 
                ? 'ring-2 ring-teal-500 shadow-lg' 
                : 'hover:ring-2 hover:ring-teal-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-1 left-1 text-xs text-white font-medium bg-black/50 px-2 py-1 rounded">
              {image.label}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Specifications Component
function SpecificationCard({ icon, title, specs }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeIn}
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20"
    >
      <div className="flex items-center mb-4">
        <div className="bg-teal-50 p-3 rounded-xl text-teal-500 mr-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-2">
        {specs.map((spec, index) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-600">{spec.label}</span>
            <span className="font-medium text-gray-900">{spec.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Feature Highlight Component
function FeatureHighlight({ title, description, icon, reverse = false }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:grid-flow-col-dense' : ''}`}
    >
      <motion.div 
        variants={slideIn}
        className={`${reverse ? 'lg:col-start-2' : ''}`}
      >
        <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
          {icon}
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-lg text-gray-600 leading-relaxed">{description}</p>
      </motion.div>
      
      <motion.div 
        variants={fadeIn}
        className={`${reverse ? 'lg:col-start-1' : ''}`}
      >
        <div className="bg-gray-100 rounded-2xl aspect-video flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg"></div>
            <p>Feature Demonstration</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Pricing Component
function PricingCard({ title, price, originalPrice, features, isPopular = false, spotsleft = null }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeIn}
      className={`relative bg-white rounded-2xl shadow-xl p-8 ${
        isPopular ? 'ring-2 ring-teal-500 transform scale-105' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">${price}</span>
          {originalPrice && (
            <span className="text-lg text-gray-500 line-through ml-2">${originalPrice}</span>
          )}
        </div>
        {spotsleft && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-700 font-medium">Only {spotsleft} spots left!</p>
          </div>
        )}
      </div>
      
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className="w-5 h-5 text-teal-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 px-6 rounded-full font-medium transition-all ${
          isPopular
            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {spotsleft ? 'Reserve Now' : 'Join Waitlist'}
      </motion.button>
    </motion.div>
  );
}

// Comparison Table Component
function ComparisonTable() {
  const features = [
    { name: "Automatic Connection", evolve: true, traditional: false },
    { name: "Smart Scheduling", evolve: true, traditional: false },
    { name: "Battery Health Monitoring", evolve: true, traditional: false },
    { name: "Mobile App Control", evolve: true, traditional: "Limited" },
    { name: "Weather Resistance", evolve: "IP65", traditional: "IP54" },
    { name: "Installation Time", evolve: "30 minutes", traditional: "2-4 hours" },
    { name: "Professional Installation Required", evolve: false, traditional: true },
    { name: "Energy Cost Optimization", evolve: true, traditional: false },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeIn}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-6">
        <h3 className="text-2xl font-bold text-white text-center">
          EVolve Charger vs Traditional Chargers
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Feature</th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">EVolve Charger</th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">Traditional Chargers</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {features.map((feature, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{feature.name}</td>
                <td className="px-6 py-4 text-center">
                  {typeof feature.evolve === 'boolean' ? (
                    feature.evolve ? (
                      <svg className="w-5 h-5 text-teal-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )
                  ) : (
                    <span className="text-sm text-teal-600 font-medium">{feature.evolve}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {typeof feature.traditional === 'boolean' ? (
                    feature.traditional ? (
                      <svg className="w-5 h-5 text-teal-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )
                  ) : (
                    <span className="text-sm text-gray-600">{feature.traditional}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default function ProductPage() {
  const [selectedVariant, setSelectedVariant] = useState('standard');
  const [quantity, setQuantity] = useState(1);
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const specifications = [
    {
      title: "Power & Performance",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      specs: [
        { label: "Max Output", value: "48A / 11.5kW" },
        { label: "Input Voltage", value: "240V AC" },
        { label: "Charging Speed", value: "35 miles/hour" },
        { label: "Connector Type", value: "J1772 Standard" }
      ]
    },
    {
      title: "Smart Features",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      specs: [
        { label: "WiFi Connectivity", value: "2.4GHz & 5GHz" },
        { label: "Mobile App", value: "iOS & Android" },
        { label: "Smart Scheduling", value: "Time & Price Based" },
        { label: "Voice Control", value: "Alexa & Google" }
      ]
    },
    {
      title: "Build Quality",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      specs: [
        { label: "Weather Rating", value: "IP65 Certified" },
        { label: "Operating Temp", value: "-40°F to 122°F" },
        { label: "Cable Length", value: "25 feet" },
        { label: "Warranty", value: "3 Years Full" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Product Hero Section */}
      <section ref={heroRef} className="relative pt-20 pb-16 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-teal-100 to-transparent rounded-bl-full opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-cyan-100 to-transparent rounded-tr-full opacity-70"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              style={{ y: textY, opacity }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-4">
                  <span className="flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                  Now Available for Pre-Order
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-gray-900">
                  EVolve Charger
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">
                    Smart EV Charging
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Experience the future of electric vehicle charging with our revolutionary automatic connection system, intelligent scheduling, and advanced battery care technology.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Pre-Order Now - $99.99
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-4 rounded-full bg-white/20 backdrop-blur-md border border-gray-300 text-gray-700 font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Watch Demo
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ProductGallery />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Revolutionary Features
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what makes the EVolve Charger the most advanced EV charging solution available.
            </motion.p>
          </motion.div>

          <div className="space-y-24">
            <FeatureHighlight
              title="Automatic Connection Technology"
              description="Our patented magnetic connection system automatically detects your vehicle and initiates charging without any manual intervention. The precision-engineered mechanism ensures perfect alignment every time, while weather-sealed components guarantee reliable operation in all conditions."
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            />
            
            <FeatureHighlight
              title="Intelligent Energy Management"
              description="Advanced algorithms monitor electricity rates in real-time and automatically schedule charging during off-peak hours. The system learns your driving patterns and ensures your vehicle is always ready when you need it, while minimizing energy costs by up to 40%."
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
              reverse={true}
            />
            
            <FeatureHighlight
              title="Battery Health Optimization"
              description="Proprietary charging algorithms monitor your battery's condition and adjust charging patterns to maximize lifespan. Temperature compensation, charge curve optimization, and predictive maintenance alerts help extend your EV battery life by up to 30%."
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>}
            />
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Technical Specifications
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Engineered for performance, built for reliability.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specifications.map((spec, index) => (
              <SpecificationCard
                key={index}
                icon={spec.icon}
                title={spec.title}
                specs={spec.specs}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Why Choose EVolve?
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how the EVolve Charger compares to traditional charging solutions.
            </motion.p>
          </motion.div>

          <ComparisonTable />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Choose Your EVolve Package
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect package for your needs with special pre-order pricing.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PricingCard
              title="EVolve Standard"
              price="1,199"
              originalPrice="1,499"
              features={[
                "Automatic connection system",
                "Basic smart scheduling",
                "Mobile app control",
                "3-year warranty",
                "Email support"
              ]}
              spotsleft={25}
            />
            
            <PricingCard
              title="EVolve Pro"
              price="1,599"
              originalPrice="1,999"
              features={[
                "All Standard features",
                "Advanced energy optimization",
                "Battery health monitoring",
                "Professional installation",
                "Priority support",
                "Extended 5-year warranty"
              ]}
              isPopular={true}
              spotsleft={15}
            />
            
            <PricingCard
              title="EVolve Enterprise"
              price="2,299"
              originalPrice="2,799"
              features={[
                "All Pro features",
                "Fleet management dashboard",
                "Custom integrations",
                "24/7 dedicated support",
                "On-site training",
                "Lifetime warranty"
              ]}
              spotsleft={8}
            />
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
            className="text-center mt-12"
          >
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-teal-900 mb-2">Limited Time Pre-Order Pricing</h3>
              <p className="text-teal-700">
                Save up to $600 with early bird pricing. All pre-orders include free shipping and installation guide.
                Expected delivery: Q2 2025.
              </p>
            </div>
          </motion.div>
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
              Ready to Revolutionize Your EV Charging?
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-teal-50 leading-relaxed">
              Join thousands of early adopters who are already experiencing the future of electric vehicle charging. 
              Pre-order your EVolve Charger today and save up to $600 with our limited-time pricing.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <h3 className="text-lg font-semibold text-white mb-2">30-Day Money Back</h3>
                <p className="text-teal-100 text-sm">Not satisfied? Get a full refund within 30 days of delivery.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="text-lg font-semibold text-white mb-2">Free Shipping</h3>
                <p className="text-teal-100 text-sm">Complimentary shipping and handling to your doorstep.</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-white mb-2">Expert Support</h3>
                <p className="text-teal-100 text-sm">Get help from our dedicated customer success team.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 px-8 py-4 rounded-full bg-white text-teal-600 font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Pre-Order Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 px-8 py-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Schedule Demo
              </motion.button>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-teal-100 text-sm">
                Questions? Contact our sales team at{" "}
                <a href="mailto:sales@evolvecharger.com" className="text-white underline hover:no-underline">
                  sales@evolvecharger.com
                </a>{" "}
                or call{" "}
                <a href="tel:+1-555-EVOLVE" className="text-white underline hover:no-underline">
                  1-555-EVOLVE
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}