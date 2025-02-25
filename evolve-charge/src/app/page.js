'use client';

// pages/index.js
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useState } from 'react';

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

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>EVolve Charge | Smart EV Charging Solutions</title>
        <meta name="description" content="Automatic EV charging solutions that optimize battery health and energy usage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <main>
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="flex flex-col space-y-6"
              >
                <motion.h1 
                  variants={fadeIn}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                >
                  <span className="block text-gray-700">Smart Charging for</span>
                  <span className="bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">Electric Vehicles</span>
                </motion.h1>
                
                <motion.p 
                  variants={fadeIn}
                  className="text-lg md:text-xl text-gray-700 max-w-md"
                >
                  Automatic charging that optimizes battery health, saves energy, and simplifies your EV ownership experience.
                </motion.p>
                
                <motion.div 
                  variants={fadeIn}
                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 text-white font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Get Started
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                  >
                    Watch Demo
                  </motion.button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative"
              >
                <div className="relative w-full h-80 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-teal-100 to-cyan-100 shadow-xl">
                  {/* This would be an image in a real implementation */}
                  <div className="absolute inset-0 flex items-center justify-center text-teal-500 opacity-20">
                    <span className="text-2xl">EV Charger Image</span>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-gradient-to-r from-teal-400 to-cyan-300 blur-xl opacity-50"
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-r from-cyan-300 to-teal-200 blur-xl opacity-40"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-gray-100">
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
                className="text-3xl text-gray-700 md:text-4xl font-bold mb-4"
              >
                Intelligent Charging Features
              </motion.h2>
              <motion.p 
                variants={fadeIn}
                className="text-lg text-gray-700 max-w-2xl mx-auto"
              >
                Our smart charging technology adapts to your vehicle needs and energy patterns to provide the best charging experience possible.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Automatic Connection",
                  description: "Charging arm automatically connects and disconnects from your vehicle, no manual plugging required.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                },
                {
                  title: "Off-Peak Charging",
                  description: "Intelligently charges your vehicle during non-peak hours to save energy costs and reduce grid load.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Battery Health Monitoring",
                  description: "Tracks and reports your EV's battery health, providing insights to maximize battery lifespan.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
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
                      {feature.icon}
                    </div>
                    <h3 className="text-xl text-gray-900 font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-700">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 md:py-24">
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
                className="text-3xl text-gray-700 md:text-4xl font-bold mb-4"
              >
                How EVolve Charge Works
              </motion.h2>
              <motion.p 
                variants={fadeIn}
                className="text-lg text-gray-700 max-w-2xl mx-auto"
              >
                A seamless charging experience from installation to everyday use.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8 }}
                className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-teal-100 to-cyan-100 shadow-xl aspect-video"
              >
                {/* This would be an image or video in a real implementation */}
                <div className="absolute inset-0 flex items-center justify-center text-teal-500 opacity-20">
                  <span className="text-2xl">How It Works Video</span>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
              >
                {[
                  {
                    number: "01",
                    title: "Easy Installation",
                    description: "Our professional team installs the EVolve charger in your garage or parking area."
                  },
                  {
                    number: "02",
                    title: "Connect to App",
                    description: "Download our app and connect your charger to set preferences and monitor charging."
                  },
                  {
                    number: "03",
                    title: "Automated Charging",
                    description: "Park your vehicle, and the charger automatically connects when needed based on your settings."
                  },
                  {
                    number: "04",
                    title: "Smart Monitoring",
                    description: "Receive updates on charging status, battery health, and energy usage through the app."
                  }
                ].map((step, index) => (
                  <motion.div
                    key={step.number}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: index * 0.2, duration: 0.6 }
                      }
                    }}
                    className="flex mb-8 last:mb-0"
                  >
                    <div className="mr-6">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 text-white font-bold">
                        {step.number}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl text-gray-900 font-bold mb-2">{step.title}</h3>
                      <p className="text-gray-700">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Evolve Your EV Charging?</h2>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Join our community of EV owners who are experiencing the future of charging today.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-white text-teal-600 font-medium shadow-md hover:shadow-lg transition-all"
              >
                Pre-Order Now
              </motion.button>
              <p className="mt-4 text-sm opacity-80">Limited early-bird pricing available.</p>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
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
                className="text-3xl text-gray-700 md:text-4xl font-bold mb-4"
              >
                What Our Early Users Say
              </motion.h2>
              <motion.p 
                variants={fadeIn}
                className="text-lg text-gray-700 max-w-2xl mx-auto"
              >
                Hear from EV owners who've been using our charging technology.
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah J.",
                  title: "Tesla Model 3 Owner",
                  quote: "The automatic connection feature is game-changing. I no longer have to remember to plug in my car at night."
                },
                {
                  name: "Michael T.",
                  title: "Hyundai Ioniq 5 Owner",
                  quote: "I've saved roughly 30% on my charging costs since the EVolve charger optimizes for off-peak rates in my area."
                },
                {
                  name: "Elena R.",
                  title: "Ford Mustang Mach-E Owner",
                  quote: "The battery health insights have helped me adjust my charging habits for longer battery life. Definitely worth the investment."
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
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
                  className="bg-white text-gray-900 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-4 text-teal-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.999v10h-9.999z"/>
                      </svg>
                    </div>
                    <p className="text-gray-700 mb-6 flex-grow">{testimonial.quote}</p>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.title}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-24">
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
                className="text-3xl text-gray-900 md:text-4xl font-bold mb-4"
              >
                Frequently Asked Questions
              </motion.h2>
              <motion.p 
                variants={fadeIn}
                className="text-lg text-gray-700 max-w-2xl mx-auto"
              >
                Get answers to common questions about EVolve Charge.
              </motion.p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              {[
                {
                  question: "Is EVolve Charge compatible with all electric vehicles?",
                  answer: "Yes, our charger is designed to work with all major EV models using standard charging ports including Tesla, Ford, Hyundai, Kia, Chevrolet, Nissan, BMW, and more."
                },
                {
                  question: "How long does installation take?",
                  answer: "Typical installation takes 2-3 hours depending on your electrical setup. Our certified technicians handle everything from mounting the unit to connecting it to your home's electrical system."
                },
                {
                  question: "Can I control when my vehicle charges?",
                  answer: "Absolutely. Through our mobile app, you can set specific charging times, energy price thresholds, or let our smart system automatically optimize based on your local utility's rates."
                },
                {
                  question: "What happens if there's a power outage?",
                  answer: "The EVolve Charge system will automatically resume its optimized charging schedule once power is restored. All your settings are securely stored in the cloud."
                },
                {
                  question: "Is there a warranty?",
                  answer: "Yes, our standard warranty covers all hardware for 3 years. We also offer extended warranty options that provide coverage for up to 5 years."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.1, duration: 0.5 }
                    }
                  }}
                  className="mb-6 text-gray-900 last:mb-0"
                >
                  <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}