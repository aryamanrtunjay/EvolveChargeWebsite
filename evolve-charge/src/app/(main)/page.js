'use client';

// pages/index.js
import Head from 'next/head';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { db } from '../firebaseConfig.js';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc, getCountFromServer } from 'firebase/firestore';
import Render from '@/images/Render.png';

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

const slideInRight = {
  hidden: { opacity: 0, x: 30 },
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

// Customized scroll indicator with animation
function ScrollIndicator() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 150], [1, 0]);

  const arrowVariants = {
    initial: { y: 0 },
    animate: {
      y: [0, 10, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      style={{ opacity }}
      className="flex flex-col items-center text-gray-700"
    >
      <motion.div
        variants={arrowVariants}
        initial="initial"
        animate="animate"
        className="bg-white p-3 rounded-full shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 md:w-6 md:h-6 text-teal-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// Feature card component with hover effects
function FeatureCard({ icon, title, description, index }) {
  return (
    <motion.div
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
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-6 bg-teal-50 p-4 rounded-2xl text-teal-500">
          {icon}
        </div>
        <h3 className="text-xl text-gray-900 font-bold mb-3">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
}

// FAQ Item component with smooth animations
function FAQItem({ question, answer, isActive, onClick, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="mb-5 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
    >
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full text-left px-6 py-4 focus:outline-none"
      >
        <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
        <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-teal-50 text-teal-500 transform transition-transform ${
          isActive ? 'rotate-180' : ''
        }`}>
          <svg
            className="h-4 w-4"
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
          opacity: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-4 text-gray-600">
          <p>{answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Numbers/stats component with counting animation
function StatCard({ value, label, index }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useRef(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView.current) {
          isInView.current = true;
          let start = 0;
          const duration = 1500;
          const startTime = Date.now();
          
          const timer = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const currentCount = Math.floor(progress * value);
            
            setCount(currentCount);
            
            if (progress === 1) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    
    if (ref.current) observer.observe(ref.current);
    
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [value]);
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay: index * 0.2, duration: 0.4 }}
      className="flex flex-col items-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
        {count}+
      </div>
      <div className="text-gray-600">{label}</div>
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [spotsLeft, setSpotsLeft] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const TOTAL_DISCOUNT_SPOTS = 150;

  // Toggle FAQ accordion
  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  // FAQ data
  const faqItems = [
    {
      question: "Is NeoGen compatible with all electric vehicles?",
      answer: "Yes, NeoGen is designed to work with all major EV models using standard charging ports including Tesla, Ford, Hyundai, Kia, Chevrolet, Nissan, BMW, and more."
    },
    {
      question: "How does it plug into my car?",
      answer: "NeoGen navigates above your vehicle where it is securely attached to high-strength steel wire, ensuring absolutely no risk to your vehicles while being out of the way of items stored in your garage. A charge plug is lowered and magnetically snaps to your EV's charge port, beginning the charging process."
    },
    {
      question: "How long does installation take?",
      answer: "Typical installation takes 25 to 30 minutes by following our simple instructions, or you may choose to have professional installation requested at an additional cost. Installation time may be longer if a wall outlet needs to be installed."
    },
    {
      question: "Can I control when my vehicle charges?",
      answer: "Absolutely. Through our mobile app, you can set specific charging times, energy price thresholds, or let our smart system automatically optimize based on your local utility's rates."
    },
    {
      question: "What happens if there's a power outage?",
      answer: "The NeoGen system will automatically resume its optimized charging schedule once power is restored. All your settings are securely stored in the cloud."
    },
    {
      question: "Is there a warranty?",
      answer: "Yes, our standard warranty covers all hardware for 3 years. We also offer extended warranty options that provide coverage for up to 5 years."
    }
  ];

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Check if email already exists
      const mailingListRef = collection(db, 'mailing-list');
      const emailQuery = query(mailingListRef, where("email", "==", email));
      const querySnapshot = await getDocs(emailQuery);
      
      if (querySnapshot.empty) {
        // Email doesn't exist, create a new document
        const userData = {
          email: email,
          joinDate: serverTimestamp(),
          isEligibleForDiscount: spotsLeft > 0 // Track discount eligibility
        };
        
        await addDoc(mailingListRef, userData);
        
        // Redirect to the reservation page with the email as a parameter
        window.location.href = `/reserve?email=${encodeURIComponent(email)}`;
      } else {
        // Email already exists, redirect to reservation page
        window.location.href = `/reserve?email=${encodeURIComponent(email)}`;
      }
      
      // Update the count after successful submission
      if (spotsLeft > 0) {
        setSpotsLeft(prevSpotsLeft => prevSpotsLeft - 1);
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      setSubmitError('There was an error joining the waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchReservationCount = async () => {
      try {
        setIsLoading(true);
        const mailingListRef = collection(db, 'mailing-list');
        const snapshot = await getCountFromServer(mailingListRef);
        const count = snapshot.data().count;
        
        const remainingSpots = Math.max(0, TOTAL_DISCOUNT_SPOTS - count);
        setSpotsLeft(remainingSpots);
      } catch (error) {
        console.error('Error fetching reservation count:', error);
        // Set a fallback number to avoid showing null
        setSpotsLeft(25); // Fallback to create urgency if count fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservationCount();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="md:col-span-6 flex flex-col"
            >
              <motion.div 
                variants={fadeIn}
                className="inline-flex items-center px-4 py-2 rounded-full bg-teal-800 bg-opacity-50 backdrop-blur-sm text-teal-200 text-sm font-medium mb-6 self-start"
              >
                <span className="flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-300"></span>
                </span>
                Now Available for Reservations
              </motion.div>
              
              <motion.h1 
                variants={fadeIn}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white"
              >
                <span className="block">The World's First</span>
                <span className="bg-gradient-to-r from-teal-200 to-cyan-200 bg-clip-text text-transparent">Automatic EV Charger</span>
              </motion.h1>
              
              <motion.p 
                variants={fadeIn}
                className="text-lg md:text-xl text-teal-100 mb-6 leading-relaxed max-w-md"
              >
                Experience the future of EV charging with NeoGen's revolutionary automatic plug-in system. No more manual connections, just effortless charging.
              </motion.p>
              
              <motion.div 
                variants={fadeIn}
                className="flex flex-wrap gap-4 mt-2"
              >
                <a href="reserve">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Reserve Your NeoGen
                  </motion.button>
                </a>
                
                <a href="#how-it-works">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-3 rounded-full border border-teal-400 text-teal-200 font-medium hover:bg-teal-800 hover:bg-opacity-50 transition-all"
                  >
                    Watch Demo
                  </motion.button>
                </a>
              </motion.div>
              
              <motion.div
                variants={fadeIn}
                className="mt-8 bg-teal-800/40 rounded-lg p-3 inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-teal-100 text-sm">Limited spots available for early access</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="md:col-span-6 relative"
            >
              <div className="relative w-full h-80 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl transform">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 z-10 mix-blend-overlay"></div>
                <Image
                  src={Render}
                  alt="NeoGen Smart EV Charger"
                  layout="fill"
                  objectFit="cover"
                  className="z-0"
                  priority
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 md:w-32 md:h-32 bg-cyan-500 rounded-full opacity-30 blur-xl"></div>
              <div className="absolute -top-4 -right-4 w-24 h-24 md:w-40 md:h-40 bg-teal-500 rounded-full opacity-30 blur-xl"></div>
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-0 right-0 flex justify-center"
        >
          <ScrollIndicator />
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 relative">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-teal-50 to-transparent rounded-bl-full opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-cyan-50 to-transparent rounded-tr-full opacity-70"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeIn} className="inline-block">
            </motion.div>
            <motion.h2 
              variants={fadeIn}
              className="text-3xl text-gray-900 md:text-4xl font-bold mt-4 mb-4"
            >
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">NeoGen</span>
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Our intelligent system revolutionizes the way you charge your electric vehicle
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="aspect-video">
                <video
                  className="w-full h-full object-cover"
                  controls
                  preload="metadata"
                  title="How NeoGen Works"
                >
                  <source src="/demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              className="space-y-8"
            >
              {[
                {
                  number: "01",
                  title: "Easy Installation",
                  description: "We make installing NeoGen a simple process so anyone can set it up with just a ladder, drill, and screwdriver."
                },
                {
                  number: "02",
                  title: "Connect to App",
                  description: "Download our app and connect NeoGen to set preferences and monitor charging."
                },
                {
                  number: "03",
                  title: "Automated Charging",
                  description: "Park your vehicle, and NeoGen automatically connects when needed based on your setting and then unplugs whenever you want to leave."
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
                  className="flex"
                >
                  <div className="mr-6 flex-shrink-0">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl text-gray-900 font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-50 rounded-full opacity-70"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-50 rounded-full opacity-70"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.div variants={fadeIn} className="inline-block">
            </motion.div>
            <motion.h2 
              variants={fadeIn}
              className="text-3xl text-gray-900 md:text-4xl font-bold mt-4 mb-4"
            >
              Intelligent Charging Features
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Our smart charging technology adapts to your vehicle needs and energy patterns to provide the best charging experience possible.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              index={0}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Automatic Connection"
              description="No more manual plugging. Get back hours of your life every month."
            />
            
            <FeatureCard
              index={1}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Off-Peak Charging"
              description="Intelligently charges your vehicle during non-peak hours to save energy costs and reduce grid load."
            />
            
            <FeatureCard
              index={2}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="Battery Health Monitoring"
              description="Intelligent charging patterns help preserve your EV's battery health."
            />
          </div>
          
          {/* <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="mt-20 bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-10 md:p-12 flex flex-col justify-center">
                <div className="inline-block mb-4">
                  <span className="bg-teal-50 text-teal-600 text-xs font-medium px-3 py-1 rounded-full">Coming Soon</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Smart Home Integration</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Connect NeoGen with your smart home system to optimize energy usage across your entire home. Integrate with solar panels, home batteries, and other smart devices.
                </p>
                <ul className="space-y-3">
                  {['Works with Alexa, Google Home, and HomeKit', 'Optimize charging with solar production', 'Voice command support', 'Energy usage dashboard'].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="h-5 w-5 text-teal-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-teal-500 to-cyan-600 p-10 flex items-center justify-center">
                <div className="relative w-full h-64 md:h-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-white opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-dots-pattern opacity-10"></div>
                </div>
              </div>
            </div>
          </motion.div> */}
        </div>
      </section>

      {/* Join Waitlist Section
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeIn} className="inline-block">
              <span className="bg-teal-50 text-teal-600 text-sm font-medium px-4 py-1 rounded-full">Early Access</span>
            </motion.div>
            <motion.h2 
              variants={fadeIn}
              className="text-3xl text-gray-900 md:text-4xl font-bold mt-4 mb-4"
            >
              Join Our Waitlist
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Be the first to experience NeoGen when we launch. Sign up for our mailing list to receive exclusive updates and early-bird offers.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto bg-white rounded-xl p-8 shadow-lg border border-gray-100"
          >
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              />
            </div>
            
            <div className="mb-6 text-gray-700">
              <label htmlFor="ev-model" className="block text-sm font-medium text-gray-700 mb-1">EV Model (Optional)</label>
              <select
                id="ev-model"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              >
                <option value="">Select your EV model</option>
                <option value="tesla">Tesla</option>
                <option value="ford">Ford</option>
                <option value="hyundai">Hyundai</option>
                <option value="kia">Kia</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <button 
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-md hover:shadow-lg transition-all"
            >
              Join the Waitlist
            </button>
            
            <p className="mt-4 text-xs text-gray-500 text-center">
              By signing up, you agree to receive updates about NeoGen. We'll never share your information with third parties.
            </p>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm text-gray-600">Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm text-gray-600">No spam, unsubscribe anytime</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-20 bg-white opacity-10"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-200 rounded-full opacity-20"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 rounded-3xl p-10 md:p-16 text-center shadow-xl border border-white/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Transform Your EV Charging?</h2>
            <p className="text-lg md:text-xl mb-4 max-w-2xl mx-auto text-teal-50">
              Join our community of EV owners who are experiencing the future of charging today.
            </p>
            
            {/* Email Form */}
            <div className="max-w-md mx-auto mb-8">
              <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-grow px-4 py-3 rounded-full border-2 border-white/30 bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-full bg-white text-teal-600 font-medium shadow-md hover:shadow-xl transition-all disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Reserving...
                    </div>
                  ) : (
                    'Reserve NeoGen'
                  )}
                </button>
              </form>
              {submitError && (
                <p className="mt-2 text-red-300 text-sm">{submitError}</p>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8 mt-8 text-teal-50 font-medium">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Early access to pre-orders
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Exclusive updates & news
              </div>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {spotsLeft > 0 ? 'Special launch pricing' : 'Future promotions'}
              </div>
            </div>
            {/* Discount Countdown Banner */}
            {isLoading ? (
              <div className="bg-white/20 rounded-lg p-4 mt-8 max-w-lg mx-auto">
                <p className="text-white animate-pulse">Loading special offer details...</p>
              </div>
            ) : spotsLeft > 0 ? (
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                className="bg-white/20 rounded-lg p-4 mt-8 max-w-lg mx-auto border-1 border-white/20"
              >
                <p className="text-white font-medium">
                Lock in Exclusive Discount Pricing for the First 150 Spots!
                </p>
                <p className="text-white text-xl font-medium mt-1">
                  Only {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left!
                </p>
              </motion.div>
            ) : (
              <div className="bg-white/20 rounded-lg p-4 mb-8 max-w-lg mx-auto">
                <p className="text-white">
                  <span className="line-through">Special Discount Pricing</span>
                </p>
                <p className="text-yellow-300 font-bold">
                  All discounted spots have been claimed!
                </p>
                <p className="text-white text-sm mt-1">
                  Join now to get on our waitlist for future promotions.
                </p>
              </div>
            )}
          </motion.div>
        </div>
        
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeIn} className="inline-block">
            </motion.div>
            <motion.h2
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mt-4 mb-4 text-gray-900"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              variants={fadeIn}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Get answers to common questions about NeoGen.
            </motion.p>
          </motion.div>
  
          <div className="max-w-3xl mx-auto space-y-5">
            {faqItems.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isActive={activeFAQ === index}
                onClick={() => toggleFAQ(index)}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}