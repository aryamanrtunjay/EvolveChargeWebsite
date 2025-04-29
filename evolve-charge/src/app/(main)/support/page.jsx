// app/support/page.js
"use client";

import { useState } from 'react';
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

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [activeAccordion, setActiveAccordion] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    // In a real implementation, this would query a knowledge base
    console.log(`Searching for: ${searchQuery}`);
  };

  // Toggle accordion items
  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // Support categories with articles
  const supportCategories = {
    'getting-started': {
      title: 'Getting Started',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      articles: [
        {
          title: 'Setting up your EVolve Charge for the first time',
          content: "This guide will walk you through the initial setup process after your EVolve Charger has been professionally installed. You'll learn how to connect the EVolve Charger to WiFi, set up your account, and configure basic charging preferences.",
          popular: true
        },
        {
          title: 'Downloading and using the mobile app',
          content: 'Learn how to download the EVolve Charge mobile app on iOS or Android, create an account, and connect it to your charging station. This guide covers all the basic features of the app and how to use them.'
        },
        {
          title: 'Understanding your charging dashboard',
          content: 'This article explains all the metrics and information displayed on your charging dashboard, including energy usage, cost savings, charging history, and battery health insights.'
        },
        {
          title: 'Configuring charging schedules',
          content: "Learn how to set up automatic charging schedules based on your utility's time-of-use rates, your vehicle needs, and your daily routine to maximize savings and convenience."
        }
      ]
    },
    'troubleshooting': {
      title: 'Troubleshooting',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      articles: [
        {
          title: 'Charging arm not connecting properly',
          content: 'If your charging arm is having trouble connecting to your vehicle, follow these troubleshooting steps to identify and resolve the issue. Includes guidance on checking for obstructions, ensuring proper parking alignment, and verifying power supply.',
          popular: true
        },
        {
          title: 'WiFi connection issues',
          content: 'This guide provides detailed steps to troubleshoot WiFi connectivity problems with your EVolve Charge station, including how to check signal strength, reset network settings, and connect to a different network if needed.'
        },
        {
          title: 'App not displaying charging status',
          content: "If your mobile app isn't showing current charging information, follow this troubleshooting guide to resolve synchronization issues between your charging station and the EVolve Charge cloud services."
        },
        {
          title: 'Charging starts but stops unexpectedly',
          content: 'This article addresses potential causes for interruptions during the charging process, including power fluctuations, vehicle-side limitations, safety cutoffs, and how to resolve each issue.'
        }
      ]
    },
    'maintenance': {
      title: 'Maintenance & Care',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      articles: [
        {
          title: 'Cleaning your EVolve Charge station',
          content: 'Learn the proper way to clean and maintain your charging station to ensure optimal performance and longevity. Includes recommended cleaning products and techniques for different components.'
        },
        {
          title: 'Seasonal maintenance recommendations',
          content: 'Get guidance on special maintenance considerations for different weather conditions, including winterizing tips for cold climates and protection measures for extreme heat or humidity.'
        },
        {
          title: 'Inspecting and maintaining the charging connector',
          content: 'This guide explains how to check your charging connector for wear and tear, how to clean contact points, and when to contact support for replacement parts.'
        },
        {
          title: 'Software updates and firmware management',
          content: 'Learn how to ensure your charging station always has the latest software updates, how to check current firmware version, and what to do if an update fails.',
          popular: true
        }
      ]
    },
    'billing': {
      title: 'Billing & Account',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      articles: [
        {
          title: 'Understanding your billing cycle',
          content: 'This article explains how billing works for your EVolve Charge subscription, including when charges are processed, how to view detailed billing history, and what happens if a payment fails.'
        },
        {
          title: 'Changing your payment method',
          content: 'Learn how to update credit card information, add new payment methods, or switch between payment options for your EVolve Charge subscription.'
        },
        {
          title: 'Upgrading or downgrading your plan',
          content: 'This guide walks you through the process of changing your subscription plan, including how billing is prorated, when changes take effect, and any associated hardware differences.',
          popular: true
        },
        {
          title: 'Managing multiple charging stations',
          content: 'Learn how to add additional EVolve Charge stations to your account, manage billing for multiple units, and set up different configurations for each location.'
        }
      ]
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitMessage('Message sent successfully!');
        e.target.reset(); // Clear the form
      } else {
        setSubmitMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
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
              How Can We Help You?
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-lg md:text-xl mb-10 opacity-90"
            >
              Find answers to common questions or contact our support team for assistance.
            </motion.p>

            {/* <motion.form 
              variants={fadeIn}
              onSubmit={handleSearch}
              className="relative max-w-2xl mx-auto"
            >
              <input
                type="text"
                placeholder="Search for help articles, topics, or questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-4 px-6 pr-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white p-2 rounded-full hover:bg-white/10"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </motion.form> */}
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white rounded-t-[50%] scale-x-125"></div>
      </section>

      {/* Quick Help Options */}
      <section className="py-12 md:py-16 -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-teal-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Live Chat Support</h3>
              <p className="text-gray-700 mb-6">
                Connect with a support agent instantly for real-time assistance with any issues or questions.
              </p>
              <button className="px-6 py-2 rounded-full bg-teal-500 text-white font-medium shadow-md hover:bg-teal-500 transition-colors">
                Start Chat
              </button>
              <p className="text-sm text-gray-500 mt-4">Available 24/7</p>
            </motion.div> */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-cyan-100 flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-cyan-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Phone Support</h3>
              <p className="text-gray-700 mb-6">
                Call our dedicated support team for personalized assistance with complex issues.
              </p>
              <a href="tel:+18005551234" className="px-6 py-2 rounded-full bg-cyan-500 text-white font-medium shadow-md hover:bg-cyan-600 transition-colors inline-block">
                1-425-324-4529
              </a>
              <p className="text-sm text-gray-500 mt-4">Call back within 24 hours</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Email Support</h3>
              <p className="text-gray-700 mb-6">
                Send us a detailed message and we'll respond to your inquiry within 24 hours.
              </p>
              <a href="mailto:support@evolvecharge.com" className="px-6 py-2 rounded-full bg-blue-500 text-white font-medium shadow-md hover:bg-blue-600 transition-colors inline-block">
                Send Email
              </a>
              <p className="text-sm text-gray-500 mt-4">Response within 24 hours</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Support Categories */}
      {/* <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            >
              Browse Support Categories
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-700 max-w-2xl mx-auto"
            >
              Find information on installation, troubleshooting, account management, and more.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {Object.keys(supportCategories).map((key) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`p-6 rounded-xl text-center transition-all ${
                  activeCategory === key
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className={`mx-auto mb-3 flex justify-center ${
                  activeCategory === key ? 'text-white' : 'text-teal-500'
                }`}>
                  {supportCategories[key].icon}
                </div>
                <span className="font-medium">{supportCategories[key].title}</span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">{supportCategories[activeCategory].title}</h3>
            
            {supportCategories[activeCategory].articles.map((article, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <button
                  onClick={() => toggleAccordion(index)}
                  className={`flex justify-between items-center w-full text-left p-4 rounded-lg transition-colors ${
                    activeAccordion === index 
                      ? 'bg-teal-50 text-teal-700' 
                      : 'hover:bg-gray-50 text-gray-900'
                  }`}
                >
                  <div className="flex items-center">
                    <h4 className="font-semibold pr-2">{article.title}</h4>
                    {article.popular && (
                      <span className="text-xs px-2 py-1 bg-teal-100 text-teal-800 rounded-full">Popular</span>
                    )}
                  </div>
                  <svg
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      activeAccordion === index ? 'rotate-180' : ''
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
                    height: activeAccordion === index ? 'auto' : 0,
                    opacity: activeAccordion === index ? 1 : 0,
                    margin: activeAccordion === index ? '12px 0 0 0' : '0'
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden px-4"
                >
                  <p className="text-gray-700">{article.content}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <button className="text-teal-500 font-medium hover:underline">Read full article</button>
                    <div className="flex items-center space-x-2 text-gray-500 text-sm">
                      <button className="hover:text-teal-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                      </button>
                      <span>Was this helpful?</span>
                      <button className="hover:text-teal-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13v-9m-7 10h2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Video Tutorials
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            >
              Video Tutorials
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-700 max-w-2xl mx-auto"
            >
              Watch step-by-step guides for setting up and using your EVolve Charge system.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Getting Started with EVolve Charge",
                duration: "4:32",
                thumbnail: "getting-started-thumbnail.jpg",
                views: "8.2K"
              },
              {
                title: "Understanding Charging Analytics",
                duration: "6:15",
                thumbnail: "analytics-thumbnail.jpg",
                views: "5.7K"
              },
              {
                title: "Troubleshooting Common Issues",
                duration: "8:44",
                thumbnail: "troubleshooting-thumbnail.jpg",
                views: "12.4K"
              }
            ].map((video, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
              >
                <div className="relative aspect-video bg-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <span>Video Thumbnail</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-500">{video.views} views</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button className="px-6 py-3 rounded-full border border-teal-500 text-teal-500 font-medium hover:bg-teal-50 transition-colors">
              View All Tutorials
            </button>
          </div>
        </div>
      </section> */}

      {/* Community & Forum
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            >
              Join Our Community
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-700 max-w-2xl mx-auto"
            >
              Connect with other EVolve Charge users, share experiences, and discover tips and tricks.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-8 shadow-md border border-gray-100"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-900">User Forum</h3>
              <div className="space-y-4 mb-6">
                {[
                  {
                    title: "How to optimize charging for battery longevity?",
                    author: "Michael T.",
                    replies: 24,
                    time: "2 hours ago"
                  },
                  {
                    title: "Feature request: Integration with Tesla app",
                    author: "Sarah J.",
                    replies: 37,
                    time: "1 day ago"
                  },
                  {
                    title: "Installation in outdoor carport - tips?",
                    author: "James L.",
                    replies: 18,
                    time: "3 days ago"
                  }
                ].map((post, index) => (
                  <div key={index} className="flex justify-between items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">{post.title}</h4>
                      <p className="text-sm text-gray-500">Posted by {post.author} · {post.time}</p>
                    </div>
                    <div className="text-sm bg-teal-100 text-teal-800 px-3 py-1 rounded-full">
                      {post.replies} replies
                    </div>
                  </div>
                ))}
              </div>
              <button className="px-6 py-2 rounded-full bg-teal-500 text-white font-medium hover:bg-teal-500 transition-colors w-full">
                Visit Forum
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl p-8 shadow-md border border-gray-100"
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-900">EV Owner Community</h3>
              <p className="text-gray-700 mb-6">
                Join our community of EV enthusiasts to share tips, discuss charging strategies, and connect with other owners.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-teal-500 mb-1">15,000+</div>
                  <div className="text-sm text-gray-700">Members</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-teal-500 mb-1">7,500+</div>
                  <div className="text-sm text-gray-700">Topics</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-teal-500 mb-1">120+</div>
                  <div className="text-sm text-gray-700">Events</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-teal-500 mb-1">Daily</div>
                  <div className="text-sm text-gray-700">Updates</div>
                </div>
              </div>
              <button className="px-6 py-2 rounded-full bg-teal-500 text-white font-medium hover:bg-teal-500 transition-colors w-full">
                Join Community
              </button>
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* Contact Form
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Still Need Help?</h2>
              <p className="text-gray-700 mb-8">
                If you couldn't find what you're looking for, send us a message and our support team will get back to you as soon as possible.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-xl mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Support Hours</h3>
                <div className="space-y-2">
                   <div className="flex justify-between">
                    <span className="text-gray-700">Chat Support:</span>
                    <span className="font-medium text-gray-900">24/7</span>
                  </div> 
                  <div className="flex justify-between">
                    <span className="text-gray-700">Phone Support:</span>
                    <span className="font-medium text-gray-900">Call back in 24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Email Response:</span>
                    <span className="font-medium text-gray-900">Within 24 hours</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Phone</h4>
                    <p className="text-gray-700">1-425-324-4529</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Email</h4>
                    <p className="text-gray-700">support@evolvecharge.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Headquarters</h4>
                    <p className="text-gray-700">Sammamish, WA 98074</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-gray-700"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-gray-700"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors text-gray-700"
                    required
                  >
                    <option value="">Select a topic</option>
                    <option>Technical Support</option>
                    <option>Billing Question</option>
                    <option>Product Information</option>
                    <option>Installation Help</option>
                    <option>Other</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none text-gray-700"
                    placeholder="Describe your issue or question in detail..."
                    required
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-teal-500 focus:ring-teal-500 border-gray-300 rounded"
                      required
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I agree to the <a href="#" className="text-teal-500 hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                
                {submitMessage && (
                  <p className={`mt-4 text-center ${submitMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {submitMessage}
                  </p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section> */}

      {/* Self-Service Tools
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            >
              Self-Service Tools
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-700 max-w-2xl mx-auto"
            >
              Access these tools to manage your account, check system status, or troubleshoot common issues.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Account Dashboard",
                description: "Manage your profile, billing information, and subscription details.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )
              },
              {
                title: "System Diagnostics",
                description: "Run automatic diagnostics on your charging system to identify issues.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              {
                title: "Software Updates",
                description: "Check for and install the latest firmware updates for your charger.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )
              },
              {
                title: "Service History",
                description: "View past service requests, installations, and maintenance records.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                )
              }
            ].map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="text-teal-500 mb-4">{tool.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{tool.title}</h3>
                <p className="text-gray-700 mb-4">{tool.description}</p>
                <button className="text-teal-500 font-medium hover:underline">Access Tool →</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Download Resources
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            >
              Downloadable Resources
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-700 max-w-2xl mx-auto"
            >
              Access manuals, guides, and other helpful documents for your EVolve Charge system.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "User Manual",
                description: "Complete guide to setup, operation, and maintenance",
                fileType: "PDF",
                fileSize: "2.4 MB"
              },
              {
                title: "Quick Start Guide",
                description: "Essential steps to get your charger up and running",
                fileType: "PDF",
                fileSize: "1.1 MB"
              },
              {
                title: "Mobile App Guide",
                description: "How to use all features of the EVolve Charge app",
                fileType: "PDF",
                fileSize: "3.2 MB"
              },
              {
                title: "Installation Specifications",
                description: "Technical details for professional installers",
                fileType: "PDF",
                fileSize: "4.7 MB"
              },
              {
                title: "Troubleshooting Guide",
                description: "Solutions for common issues and error codes",
                fileType: "PDF",
                fileSize: "2.8 MB"
              },
              {
                title: "Maintenance Checklist",
                description: "Recommended maintenance schedule and procedures",
                fileType: "PDF",
                fileSize: "1.5 MB"
              }
            ].map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 flex flex-col"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-red-500 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{resource.title}</h3>
                    <p className="text-sm text-gray-500">{resource.fileType} · {resource.fileSize}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 flex-grow">{resource.description}</p>
                <button className="px-4 py-2 rounded-lg border border-teal-500 text-teal-500 font-medium hover:bg-teal-50 transition-colors flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section
      <section className="py-16 md:py-24 bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Personalized Assistance?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Our team of EV charging experts is available to provide you with personalized guidance and support.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-white text-teal-500 font-medium shadow-md hover:shadow-lg transition-all"
              >
                Schedule a Consultation
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-transparent border border-white text-white font-medium hover:bg-white/10 transition-all"
              >
                Chat with Support
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section> */}
    </div>
  );
}