"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import pricingData from '../../data/pricingData.json'; // Import the JSON file

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

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [activeFAQ, setActiveFAQ] = useState(null);
  
  // Toggle FAQ accordion
  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  // Use the imported pricing plans
  const pricingPlans = pricingData.plans;

  // FAQ data (unchanged)
  const faqItems = [
    {
      question: "How does the pricing structure work?",
      answer: "We have three pricing options. First, a one time charge which covers purchase of equipment and installation if requested. For our software services, such as smart home intergrations, battery monitoring and optimization, and charging at off-peak hours, we charge a small monthly or per kWh fee."
    },
    {
      question: "What does the per kWh rate mean?",
      answer: "The per kWh rate is an alternative to our monthly plan. We ask for a 0.1 to 0.3 cents per kWh you charge your car in lieu of a monthly charge, so if you charge less often you pay for how much you charge, while still benefitting from a start charging experience."
    },
    {
      question: "What does installation include?",
      answer: "Installation includes mounting your EVolve Charge unit, connecting it to your electrical system, configuring the network connection, and testing the system to ensure proper functionality."
    },
    {
      question: "Can I upgrade my plan later?",
      answer: "Yes, you can upgrade your plan at any time. Upgrading may involve a one-time fee to cover hardware differences between models, plus the new monthly/annual service fee or kWh rate. Downgrades are possible after your initial 12-month commitment period."
    },
    {
      question: "Is there a contract or commitment period?",
      answer: "We require a 12-month initial commitment for the service fee portion, which helps us provide consistent service and updates. After the initial period, you can continue on a month-to-month basis. The one-time hardware purchase is yours to keep regardless. However, you may return the product and receive a full refund if you are not satisfied with your experience anytime before 30 days."
    },
    {
      question: "What happens if NeoGen needs repair?",
      answer: "If your NeoGen needs repair, our support team will first attempt remote diagnostics. If the issue can't be resolved remotely, we'll send a technician to repair or replace your unit at no additional cost, provided the issue is covered under warranty and not caused by misuse or damage."
    }
  ];

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
              Simple, Transparent Pricing
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-lg md:text-xl mb-10 opacity-90"
            >
              Invest in smart charging technology with a pricing model that works for you.
            </motion.p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white rounded-t-[50%] scale-x-125"></div>
      </section>

      {/* How Our Pricing Works
      <section className="py-12 md:py-16">
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
              How Our Pricing Works
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-700 max-w-2xl mx-auto"
            >
              A transparent pricing model designed for long-term value and performance.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "One-Time Purchase",
                description: "Pay once for our premium hardware. Our chargers are built to last with high-quality components and durable construction."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Monthly/Annual Fee",
                description: "A subscription fee covering access to the charger, software updates, and cloud connectivity, to keep your charging experience optimal."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Per kWh Cost",
                description: "An alternative to our monthly/annual fee if you charge less often, but still want access to the software side of the next generation of charging."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl p-8 shadow-md text-center"
              >
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Billing Toggle
      <section className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Monthly Service Fee
              </span>
              <label className="relative inline-block w-14 h-7 cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={billingCycle === 'yearly'}
                  onChange={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                />
                <div className="w-14 h-7 bg-gray-200 rounded-full transition-colors peer-checked:bg-teal-500">
                  <div className={`absolute w-5 h-5 bg-white rounded-full transition-all top-1 ${
                    billingCycle === 'yearly' ? 'left-8' : 'left-1'
                  }`} />
                </div>
              </label>
              <span className={`text-sm font-medium flex items-center ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                Annual Service Fee
                <span className="ml-2 px-2 py-1 text-xs font-medium leading-none bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-full">
                  Save 20%
                </span>
              </span>
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* Pricing Cards */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`bg-white rounded-xl overflow-hidden shadow-lg border ${
                  plan.mostPopular ? 'border-teal-500 shadow-teal-100' : 'border-gray-200'
                }`}
              >
                {plan.mostPopular && (
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-1 text-center text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <div className="flex justify-center mb-4">
                    <div dangerouslySetInnerHTML={{ __html: plan.icon }} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">{plan.name}</h3>
                  <p className="text-gray-700 mb-6 text-center">{plan.description}</p>

                  <div className="mb-6 border-t border-b border-gray-100 py-6">
                    <div className="flex flex-col items-center">
                      <div className="flex items-end">
                        <span className="text-4xl font-extrabold text-gray-900">
                          ${plan.oneTimePrice}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700 mt-1">Deposit</span>
                    </div>

                    {(plan.monthlyPrice || plan.yearlyPrice || plan.kwhRate) && (
                      <div className="flex justify-between items-center mt-6">
                        {plan.monthlyPrice && plan.yearlyPrice && (
                          <div className="flex flex-col items-start">
                            <div className="flex items-baseline">
                              <span className="text-xl font-bold text-gray-900">
                                ${billingCycle === 'monthly' ? plan.monthlyPrice.toFixed(2) : plan.yearlyPrice.toFixed(2)}
                              </span>
                              <span className="ml-1 text-sm text-gray-700">
                                {billingCycle === 'monthly' ? '/mo' : '/yr'}
                              </span>
                            </div>
                            <span className="text-xs text-gray-700">Service fee (after delivery)</span>
                          </div>
                        )}
                        {plan.kwhRate && (
                          <>
                            {(plan.monthlyPrice || plan.yearlyPrice) && (
                              <div className="w-px h-10 bg-gray-200 mx-2"></div>
                            )}
                            <div className="flex flex-col items-end">
                              <div className="text-xl font-bold text-gray-900">
                                {plan.kwhRate}
                              </div>
                              <span className="text-xs text-gray-700">Energy rate (after delivery)</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 mb-8">{plan.details}</p>

                  <a href="reserve">
                    <button
                      className={`w-full py-3 px-6 rounded-full font-medium text-center transition-all transform hover:scale-105 focus:outline-none ${
                        plan.mostPopular
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Reserve Now
                    </button>
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Energy Cost Visualization
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
              Understand Your Energy Costs
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-700 max-w-2xl mx-auto"
            >
              See how our per kWh pricing compares to standard rates and the value it provides.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-xl shadow-md p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-gray-900">How Our kWh Premium Works</h3>
                <p className="text-gray-700 mb-6">
                  Our per kWh cost is added to your standard electricity rate when charging through your EVolve Charge system. This model allows us to:
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Offer lower upfront hardware costs",
                    "Provide long-term savings by charging at the cheapest times",
                    "Provide ongoing optimization to maximize your car battery's lifespan",
                    "Deliver continuous software improvements and new features",
                    "Maintain network infrastructure for reliable service",
                    "Cover warranty service and technical support",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-teal-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                  <p className="text-gray-700 italic">
                    While increasing costs for the month, the smart charging features can save around $240 last year by shifting your charging to off-peak hours. You also gain access to our suite of smart charging features.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="w-full max-w-md">
                  <h4 className="text-lg font-bold mb-4 text-gray-900 text-center">Monthly Charging Cost Comparison</h4>
                  <p className="text-sm text-gray-700 mb-6 text-center">Based on 300 kWh/month for EV charging</p>
                  
                  <div className="space-y-6">
                    {[
                      { 
                        label: "Tesla Supercharger", 
                        baseCost: 75, 
                        premiumCost: 0, 
                        totalCost: 75,
                        color: "bg-gray-200",
                        tooltip: "12¢/kWh average utility rate"
                      },
                      { 
                        label: "Non-Intelligent Home Charging", 
                        baseCost: 36, 
                        premiumCost: 0, 
                        totalCost: 36,
                        color: "bg-gray-200",
                        tooltip: "12¢/kWh average utility rate"
                      },
                      { 
                        label: "EVolve Essential Plan", 
                        baseCost: 36, 
                        premiumCost: 3, 
                        totalCost: 39,
                        color: "bg-teal-500",
                        tooltip: "12¢/kWh + 3¢/kWh premium"
                      },
                      { 
                        label: "EVolve Pro Plan", 
                        baseCost: 36, 
                        premiumCost: 6, 
                        totalCost: 42,
                        color: "bg-teal-500",
                        tooltip: "12¢/kWh + 2¢/kWh premium"
                      },
                      { 
                        label: "EVolve Ultimate Plan", 
                        baseCost: 36, 
                        premiumCost: 9, 
                        totalCost: 45,
                        color: "bg-teal-500",
                        tooltip: "12¢/kWh + 1¢/kWh premium"
                      }
                    ].map((item, index) => (
                      <div key={index} className="relative">
                        <div className="mb-1 flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900">{item.label}</span>
                          <span className="text-sm font-bold text-gray-900">${item.totalCost}/mo</span>
                        </div>
                        <div className="w-full h-8 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full flex">
                            <div 
                              className="h-full bg-gray-300" 
                              style={{ width: `${(item.baseCost / 80) * 100}%` }}
                            ></div>
                            <div 
                              className={`h-full ${item.color}`}
                              style={{ width: `${(item.premiumCost / 80) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mt-6 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-300 mr-2 rounded"></div>
                      <span className="text-gray-700">Base Utility Cost</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-teal-500 mr-2 rounded"></div>
                      <span className="text-gray-700">EVolve Premium</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* Compare Plans Detailed Table
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
              Compare Plan Features
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-700 max-w-2xl mx-auto"
            >
              See exactly what's included in each plan to find the perfect fit for your needs.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="overflow-x-auto bg-white rounded-xl shadow-md"
          >
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-left text-lg font-semibold text-gray-900 border-b border-gray-200">Feature</th>
                  {pricingPlans.map((plan) => (
                    <th key={plan.name} className="py-4 px-6 text-center text-lg font-semibold text-gray-900 border-b border-gray-200">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Hardware Cost",
                    essential: "$1,499",
                    pro: "$1,899",
                    ultimate: "$2,499"
                  },
                  {
                    feature: "Monthly Service Fee",
                    essential: "$9.99",
                    pro: "$14.99",
                    ultimate: "$19.99"
                  },
                  {
                    feature: "Annual Service Fee",
                    essential: "$99.99",
                    pro: "$149.99",
                    ultimate: "$199.99"
                  },
                  {
                    feature: "kWh Cost",
                    essential: "$0.03/kWh",
                    pro: "$0.02/kWh",
                    ultimate: "$0.01/kWh"
                  },
                  {
                    feature: "Charging Connection",
                    essential: "Automatic",
                    pro: "Automatic",
                    ultimate: "Automatic"
                  },
                  {
                    feature: "Charging Scheduling",
                    essential: "Basic",
                    pro: "Advanced",
                    ultimate: "Advanced"
                  },
                  {
                    feature: "Smart Home Integration",
                    essential: "—",
                    pro: "—",
                    ultimate: "✓"
                  },
                  {
                    feature: "Battery Health Monitoring",
                    essential: "—",
                    pro: "✓",
                    ultimate: "✓"
                  },
                  {
                    feature: "Battery Health Optimization",
                    essential: "—",
                    pro: "—",
                    ultimate: "✓"
                  },
                  {
                    feature: "Energy Optimization",
                    essential: "Basic",
                    pro: "Advanced",
                    ultimate: "Advanced"
                  },
                  {
                    feature: "Usage Analytics",
                    essential: "Basic",
                    pro: "Advanced",
                    ultimate: "Advanced"
                  },
                  {
                    feature: "Solar Integration",
                    essential: "—",
                    pro: "—",
                    ultimate: "✓"
                  },
                  {
                    feature: "Power Outage Protection",
                    essential: "—",
                    pro: "—",
                    ultimate: "✓"
                  },
                  {
                    feature: "Hardware Warranty",
                    essential: "3 Years",
                    pro: "5 Years",
                    ultimate: "Lifetime"
                  },
                  {
                    feature: "Customer Support",
                    essential: "24/7",
                    pro: "24/7 Priority",
                    ultimate: "24/7 Priority"
                  }
                ].map((row, index) => (
                  <tr key={row.feature} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-4 px-6 border-b border-gray-200 text-gray-900 font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-center border-b border-gray-200 text-gray-700">{row.essential}</td>
                    <td className="py-4 px-6 text-center border-b border-gray-200 text-gray-700">{row.pro}</td>
                    <td className="py-4 px-6 text-center border-b border-gray-200 text-gray-700">{row.ultimate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section> */}

      {/* FAQ Section
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
      </section> */}

      {/* Money Back Guarantee */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-8 md:p-12 flex items-center text-center">
              <div>
                <div className="inline-block p-3 rounded-full bg-teal-100 text-teal-500 mb-6">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">100% Satisfaction Guarantee</h3>
                <p className="text-gray-700 mb-6">
                  Your deposit is 100% refundable, no questions asked. Upon receiving, try NeoGen risk-free for 30 days. If you're not completely satisfied with your charging experience, we'll remove the system, refund your hardware purchase, and ask for nothing from you other than a short survey to know how we can improve the future of charging.
                </p>
                <a href="reserve">
                  <button className="px-6 py-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105">
                    Get Started Today
                  </button>
                </a>
              </div>
            </div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your EV Charging Experience?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of satisfied EV owners who have made the switch to smarter, automated charging.
            </p>
            <a href="reserve">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-white text-teal-500 font-medium shadow-md hover:shadow-lg transition-all"
              >
                Choose Your Plan
              </motion.button>
            </a>
            <p className="mt-4 text-sm opacity-80">Professional installation throughout the US and Canada.</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}