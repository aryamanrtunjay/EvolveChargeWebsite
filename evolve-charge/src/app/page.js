'use client';

// pages/index.js
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

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

// Modal animation variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);

  // Toggle FAQ accordion
  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  // Check URL hash on mount and when hash changes
  useEffect(() => {
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash === '#privacypolicy') {
        setShowPrivacyPolicy(true);
        setShowTermsOfService(false);
      } else if (hash === '#tos') {
        setShowTermsOfService(true);
        setShowPrivacyPolicy(false);
      }
    };

    // Check on mount
    checkHash();

    // Add event listener for hash changes
    window.addEventListener('hashchange', checkHash);

    // Clean up
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Close the modals and update URL
  const closePrivacyPolicy = () => {
    setShowPrivacyPolicy(false);
    window.history.pushState(null, '', window.location.pathname);
  };

  const closeTermsOfService = () => {
    setShowTermsOfService(false);
    window.history.pushState(null, '', window.location.pathname);
  };

  // FAQ data
  const faqItems = [
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
      answer: "The EVolve Charge system will automatically resume its optimized charging schedule once power is restored. All your settings are   ely stored in the cloud."
    },
    {
      question: "Is there a warranty?",
      answer: "Yes, our standard warranty covers all hardware for 3 years. We also offer extended warranty options that provide coverage for up to 5 years."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>EVolve Charge | Smart EV Charging Solutions</title>
        <meta name="description" content="Automatic EV charging solutions that optimize battery health and energy usage" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacyPolicy && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button 
                onClick={closePrivacyPolicy}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close privacy policy"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Policy</h2>
              <div className="prose prose-teal prose-sm max-w-none text-gray-700">
                <h3>1. Information We Collect</h3>
                <p>
                  We collect information about your EV charging habits, vehicle information, and app usage to provide you with the best charging experience. This includes charging times, energy usage, and preferences you set within the app.
                </p>
                
                <h3>2. How We Use Your Information</h3>
                <p>
                  We use your information to optimize your charging experience, provide insights about your energy usage, and improve our products and services. We may also use anonymized data for research and development purposes.
                </p>
                
                <h3>3. Information Sharing</h3>
                <p>
                  We do not sell your personal information to third parties. We may share anonymized, aggregated data with partners for research purposes. We may share your information with service providers who help us deliver our services.
                </p>
                
                <h3>4. Data Security</h3>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                
                <h3>5. Your Rights</h3>
                <p>
                  You have the right to access, correct, or delete your personal information. You can manage your privacy settings in the EVolve Charge app or contact our support team for assistance.
                </p>
                
                <h3>6. Changes to This Policy</h3>
                <p>
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the effective date.
                </p>
                
                <h3>7. Contact Us</h3>
                <p>
                  If you have any questions about this privacy policy, please contact us at privacy@evolvecharge.com.
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={closePrivacyPolicy}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terms of Service Modal */}
      <AnimatePresence>
        {showTermsOfService && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 relative"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <button 
                onClick={closeTermsOfService}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close terms of service"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl text-center font-bold text-gray-900">Terms of Service</h2>
              <h2 className="text-lg text-center text-gray-900">Last Updated: February 26, 2025</h2>
              <hr className="my-4 border-black mx-16"/>
              <div className="prose prose-teal prose-sm max-w-none text-gray-700">
                <p className="mb-4">These Terms of Service ("Terms") govern your access to and use of the website located at evolve-charge.com (the "Website") and any pre-order transactions conducted therein, operated by EVolve Charge Inc. ("EVolve Charge," "we," "us," or "our"), a corporation based in Washington State. By accessing the Website or placing a pre-order, you agree to be bound by these Terms. If you do not agree, please refrain from using the Website.</p>

                <h3 className="font-bold">1. Company Overview</h3>
                <p className="mb-3">EVolve Charge Inc. specializes in smart, automated charging solutions for electric vehicles (EVs). Our product features an automatic connection arm, off-peak charging scheduling, and battery health monitoring, all manageable via a proprietary mobile application. The charger is compatible with major EV models and includes professional installation services. Pre-orders are currently available with limited early-bird pricing.</p>

                <h3 className="font-bold">2. Use of the Website</h3>
                <p className="mb-3">The Website is provided for informational purposes regarding our products and services and to facilitate pre-orders of the EVolve Charge charger. You may use the Website solely for lawful purposes and in accordance with these Terms. Unauthorized use, including but not limited to attempts to interfere with the Website’s functionality, is strictly prohibited.</p>

                <h3 className="font-bold">3. Pre-Orders and Payment</h3>
                <p className="mb-3">Pre-orders for the EVolve Charge charger are subject to a one-time fee, payable at the time of order placement. No fees are charged for general Website access. Early-bird pricing is available on a limited basis. All payments are final upon processing, except in cases where EVolve Charge is unable to fulfill the order, in which event a refund may be issued at our discretion.</p>

                <h3 className="font-bold">4. User Conduct</h3>
                <p className="mb-3">You agree to comply with the following obligations when using the Website or placing a pre-order: (a) Provide accurate and truthful information during the pre-order process; (b) Refrain from uploading malicious code, viruses, or other harmful materials; (c) Do not attempt to gain unauthorized access to the Website or its systems; (d) Do not resell or transfer pre-order rights without prior written consent from EVolve Charge; (e) Refrain from engaging in harassing, abusive, or unlawful conduct toward EVolve Charge or its representatives. Violation of these obligations may result in termination of your pre-order or access to the Website, at our sole discretion.</p>

                <h3 className="font-bold">5. Intellectual Property</h3>
                <p className="mb-3">All content on the Website, including text, images, designs, and trademarks, is the exclusive property of EVolve Charge Inc. and is protected by United States copyright and intellectual property laws. You may not reproduce, distribute, or modify such content without our prior written permission.</p>

                <h3 className="font-bold">6. Limitation of Liability</h3>
                <p className="mb-3">To the fullest extent permitted by law, EVolve Charge shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of the Website or pre-order process, including but not limited to service interruptions, data loss, or delays in product delivery. Our total liability shall not exceed the amount paid by you for a pre-order. The Website and products are provided "as is," without warranties of any kind, express or implied, beyond those required by applicable law.</p>

                <h3 className="font-bold">7. Termination</h3>
                <p className="mb-3">EVolve Charge reserves the right to terminate or suspend your access to the Website or cancel your pre-order, without notice, if you breach these Terms or engage in conduct we deem detrimental to our operations or other users.</p>

                <h3 className="font-bold">8. Governing Law and Jurisdiction</h3>
                <p className="mb-3">These Terms shall be governed by and construed in accordance with the laws of the State of Washington, without regard to its conflict of law principles. Any disputes arising under these Terms shall be resolved exclusively in the state or federal courts located in Washington State, and you consent to the jurisdiction of such courts.</p>

                <h3 className="font-bold">9. Amendments</h3>
                <p className="mb-3">We may modify these Terms at our discretion. Updated Terms will be posted on the Website with the effective date indicated. Your continued use of the Website following such changes constitutes acceptance of the revised Terms.</p>

                <h3 className="font-bold">10. Contact Information</h3>
                <p className="mb-3">For inquiries regarding these Terms, please contact us at: support@evolve-charge.com.</p>
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={closeTermsOfService}
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-md"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">Electric Vehicles</span>
                </motion.h1>
                
                <motion.p 
                  variants={fadeIn}
                  className="text-lg md:text-xl text-gray-700 max-w-md"
                >
                  Evolving the scope of electric vehicle charging to automate and optimize your charging experience and simplify your EV ownership.
                </motion.p>
                
                <motion.div 
                  variants={fadeIn}
                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4"
                >
                  <a href="/order">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      Pre-Order Now
                    </motion.button>
                  </a>
                  
                  <a href="#how-it-works">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                    >
                      Watch Demo
                    </motion.button>
                  </a>
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
                  className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-gradient-to-r from-teal-500 to-cyan-300 blur-xl opacity-50"
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
                    description: "We make our charger a simple process so anyone can set it up with just a ladder, drill, and screwdriver."
                  },
                  {
                    number: "02",
                    title: "Connect to App",
                    description: "Download our app and connect your charger to set preferences and monitor charging."
                  },
                  {
                    number: "03",
                    title: "Automated Charging",
                    description: "Park your vehicle, and the charger automatically connects when needed based on your setting and then unplugs whenever you want to leave."
                  },
                  {
                    number: "04",
                    title: "Smart Monitoring",
                    description: "Receive updates on charging status, battery health, and energy usage through the app and integrate it into the smart home system."
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
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 text-white font-bold">
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
                className="px-8 py-3 rounded-full bg-white text-teal-500 font-medium shadow-md hover:shadow-lg transition-all"
              >
                Pre-Order Now
              </motion.button>
              <p className="mt-4 text-sm opacity-80">Limited early-bird pricing available.</p>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
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
                Frequently Asked Questions
              </motion.h2>
              <motion.p
                variants={fadeIn}
                className="text-lg text-gray-700 max-w-2xl mx-auto"
              >
                Get answers to common questions about our pricing and plans.
              </motion.p>
            </motion.div>
  
            <div className="max-w-3xl mx-auto">
              {faqItems.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="mb-4 border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex justify-between items-center w-full text-left px-4 py-3 focus:outline-none"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    <svg
                      className={`h-5 w-5 text-gray-500 transform transition-transform ${
                        activeFAQ === index ? 'rotate-180' : ''
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: activeFAQ === index ? 'auto' : 0,
                      opacity: activeFAQ === index ? 1 : 0,
                      marginTop: activeFAQ === index ? 8 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden px-4"
                  >
                    <p className="text-gray-700">{faq.answer}</p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}



{/* Testimonials
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
  </section> */}