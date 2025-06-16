'use client';

// pages/index.js
import Head from 'next/head';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '../firebaseConfig.js';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc, getCountFromServer, getFirestore, orderBy, limit } from 'firebase/firestore';
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
      className="relative flex flex-col items-center text-gray-700"
      style={{opacity}}
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

// FAQ Item component with smooth animations and glassmorphism on active
function FAQItem({ question, answer, isActive, onClick, index }) {
  return (
    <motion.div
      initial={{ y: 10 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="mb-5 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
    >
      <button
        onClick={onClick}
        className="flex justify-between items-center w-full text-left px-6 py-4 focus:outline-none hover:bg-gray-50 transition-all"
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
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className={`px-6 pb-4 text-gray-600 ${isActive ? 'bg-white/10 backdrop-blur-md border-t border-white/20' : ''}`}>
          <p>{answer}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Numbers/stats component with counting animation and glassmorphism
function StatCard({ value, units, label, index }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useRef(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView.current) {
          isInView.current = true;
          let start = 0;
          const duration = 600;
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
      className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-md"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay: index * 0.2, duration: 0.4 }}
    >
      <div className="flex flex-col items-center">
        <div className="text-4xl md:text-5xl font-bold text-teal-500 mb-2">
          {units === "$" ? <span className="text-teal-500">{units}</span> : null}
          {count}
          {units !== "$" ? <span className="text-teal-500"> {units}</span> : null}
        </div>
        <div className="text-gray-600">{label}</div>
      </div>
    </motion.div>
  );
}

// Donor Carousel Component with glassmorphism
function DonorCarousel() {
  const [donorsWithAmounts, setDonorsWithAmounts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonorsAndAmounts = async () => {
      try {
        const donorsRef = collection(db, 'donors');
        const q = query(donorsRef, orderBy('createdAt', 'desc'), limit(10));
        const querySnapshot = await getDocs(q);
        const donorList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const donorsWithDonations = await Promise.all(
          donorList.map(async (donor) => {
            const donationsRef = collection(db, 'donations');
            const donationQuery = query(donationsRef, where('donorId', '==', donor.id));
            const donationSnapshot = await getDocs(donationQuery);
            
            let amount = 'N/A';
            if (!donationSnapshot.empty) {
              const donationDoc = donationSnapshot.docs[0];
              amount = donationDoc.data().amount.toFixed(2);
            }

            return { ...donor, amount };
          })
        );

        setDonorsWithAmounts(donorsWithDonations);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching donors and amounts:', err);
        setError('Failed to load donors. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchDonorsAndAmounts();
  }, []);

  useEffect(() => {
    if (donorsWithAmounts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % donorsWithAmounts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [donorsWithAmounts]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return <div className="text-center py-8"><p className="text-gray-600">Loading donors...</p></div>;
  }

  if (error) {
    return <div className="text-center py-8"><p className="text-red-600">{error}</p></div>;
  }

  if (donorsWithAmounts.length === 0) {
    return <div className="text-center py-8"><p className="text-gray-600">No donors yet. Be the first to support the mission!</p></div>;
  }

  return (
    <div className="relative max-w-3xl mx-auto py-8">
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-xl shadow-md p-6 text-center border border-white/20"
          >
            <div className="flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-teal-500 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900">
                {donorsWithAmounts[currentIndex].anonymous
                  ? 'Anonymous Donor'
                  : `${donorsWithAmounts[currentIndex].firstName} ${donorsWithAmounts[currentIndex].lastName}`}
              </h3>
            </div>
            <p className="text-teal-600 font-medium mb-2">Donated ${donorsWithAmounts[currentIndex].amount}</p>
            {donorsWithAmounts[currentIndex].dedicateTo && (
              <p className="text-gray-600 italic mb-2">Dedicated to: {donorsWithAmounts[currentIndex].dedicateTo}</p>
            )}
            <p className="text-gray-500">
              Joined on{' '}
              {donorsWithAmounts[currentIndex].createdAt?.toDate().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) || 'Unknown Date'}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center mt-4 space-x-2">
        {donorsWithAmounts.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index ? 'bg-teal-500 scale-125' : 'bg-gray-300 hover:bg-teal-300'
            }`}
            aria-label={`Go to donor ${index + 1}`}
          />
        ))}
      </div>
    </div>
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
  const [isOpen1, setisOpen1] = useState(false);
  const [isOpen2, setisOpen2] = useState(false);
  const [isOpen3, setisOpen3] = useState(false);
  const [isOpen4, setisOpen4] = useState(false);
  const [whichOpen, setWhichOpen] = useState([false, false, false, false]);
  const [totalPreOrders, setTotalPreOrders] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [donorsWithAmounts, setDonorsWithAmounts] = useState([]);
  const [filter, setFilter] = useState('recent');

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  const textY = useTransform(scrollYProgress, [0, 3], [0, -600]);
  const imageY = useTransform(scrollYProgress, [0, 5], [0, -600]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const TOTAL_DISCOUNT_SPOTS = 50;

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const faqItems = [
    {
      question: "How does it plug into my car?",
      answer: "The EVolve Charger navigates above your vehicle where it is securely attached to high-strength steel wire, ensuring absolutely no risk to your vehicles while being out of the way of items stored in your garage. A charge plug is lowered and magnetically snaps to your EV's charge port, beginning the charging process."
    },
    {
      question: "How long does installation take?",
      answer: "Typical installation takes 25 to 30 minutes by following our simple instructions, or you may choose to have professional installation requested at an additional cost. Installation time may be longer if a wall outlet needs to be installed."
    },
    {
      question: "Can I control when my vehicle charges?",
      answer: "Absolutely. Through our mobile app, you can set specific charging times, energy price thresholds, or let our smart system automatically optimize based on your electricity rates."
    },
    {
      question: "What happens if there's a power outage?",
      answer: "The EVolve Charger system will automatically resume its optimized charging schedule once power is restored. All your settings are securely stored in the cloud."
    },
  ];

  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const mailingListRef = collection(db, 'mailing-list');
      const emailQuery = query(mailingListRef, where("email", "==", email));
      const querySnapshot = await getDocs(emailQuery);
      
      if (querySnapshot.empty) {
        const userData = {
          email: email,
          joinDate: serverTimestamp(),
          isEligibleForDiscount: spotsLeft > 0
        };
        
        await addDoc(mailingListRef, userData);
        window.location.href = `/reserve?email=${encodeURIComponent(email)}`;
      } else {
        window.location.href = `/reserve?email=${encodeURIComponent(email)}`;
      }
      
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
        const ordersRef = collection(db, 'orders');
        const snapshot = await getCountFromServer(ordersRef);
        const count = snapshot.data().count;
        const remainingSpots = Math.max(0, TOTAL_DISCOUNT_SPOTS - count);
        setSpotsLeft(remainingSpots);
      } catch (error) {
        console.error('Error fetching reservation count:', error);
        setSpotsLeft(25);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservationCount();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      let preOrderSum = 0;
      ordersSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.paymentStatus === "Completed" && data.total) {
          preOrderSum += data.total;
        }
      });
      setTotalPreOrders(preOrderSum);

      const donationsSnapshot = await getDocs(collection(db, "donations"));
      let donationSum = 0;
      donationsSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.status === "Completed" && data.amount) {
          donationSum += data.amount;
        }
      });
      setTotalDonations(donationSum);

      const total = preOrderSum + donationSum;
      setTotalAmount(total);
      const progressPercentage = (total / 10000) * 100;
      setProgress(progressPercentage > 100 ? 100 : progressPercentage);
    };

    fetchData().catch(error => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    const fetchDonorsAndAmounts = async () => {
      try {
        setIsLoading(true);
        const donorsRef = collection(db, 'donors');
        const donorsSnapshot = await getDocs(query(donorsRef));
        const donorList = donorsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const donationsRef = collection(db, 'donations');
        const donationsQuery = query(donationsRef, where('status', '==', 'Completed'));
        const donationSnapshot = await getDocs(donationsQuery);
        const donations = donationSnapshot.docs.map(doc => doc.data());

        let processedDonors = [];
        const now = new Date('2025-05-27T16:10:00-07:00');
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        let filteredDonations = donations;
        if (filter === 'top-day') {
          filteredDonations = donations.filter(donation => {
            const donationDate = donation.donationDate?.toDate ? donation.donationDate.toDate() : new Date(donation.donationDate * 1000);
            return donationDate >= startOfDay && donationDate <= now;
          });
        } else if (filter === 'top-month') {
          filteredDonations = donations.filter(donation => {
            const donationDate = donation.donationDate?.toDate ? donation.donationDate.toDate() : new Date(donation.donationDate * 1000);
            return donationDate >= startOfMonth && donationDate <= now;
          });
        }

        if (filter === 'recent') {
          const donorsWithDonations = await Promise.all(
            donorList.map(async (donor) => {
              const donorDonations = donations.filter(d => d.donorId === donor.id);
              const amount = donorDonations.length > 0
                ? donorDonations.reduce((sum, d) => sum + d.amount, 0).toFixed(2)
                : '0.00';
              return { ...donor, amount };
            })
          );
          processedDonors = donorsWithDonations.sort((a, b) => {
            const dateA = a.createdAt?.toDate() || new Date(0);
            const dateB = b.createdAt?.toDate() || new Date(0);
            return dateB - dateA;
          });
        } else {
          const donorTotals = {};
          filteredDonations.forEach(donation => {
            const donorId = donation.donorId;
            if (!donorTotals[donorId]) {
              donorTotals[donorId] = { totalAmount: 0, donor: null };
            }
            donorTotals[donorId].totalAmount += donation.amount;
            const donor = donorList.find(d => d.id === donorId);
            if (donor) {
              donorTotals[donorId].donor = donor;
            }
          });

          processedDonors = Object.entries(donorTotals)
            .filter(([_, data]) => data.donor)
            .map(([_, data]) => ({
              ...data.donor,
              amount: data.totalAmount.toFixed(2),
            }))
            .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
        }

        setDonorsWithAmounts(processedDonors);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching donors and amounts:', err);
        setError('Failed to load donors. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchDonorsAndAmounts();
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.video
        className="z-0 fixed w-full h-full object-cover bg-black/20"
        muted
        poster="/images/poster.png"
        autoPlay
        loop
        preload="auto"
        title="How the EVolve Charger Works"
        controls={false}
        style={{ opacity, zIndex: 0 }}
      >
        <source src="/productDemo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </motion.video>
      <section className="relative h-screen pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden items-center justify-center">
        <div className="relative max-w-7xl mx-auto md:ml-24 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mx-auto px-6 md:px-0 md:py-0 py-10 flex flex-col items-center md:items-start"
            style={{ y: textY }}
          >
            <motion.div 
              variants={fadeIn}
              className="mx-auto md:mx-0 inline-flex items-center px-4 py-2 rounded-full bg-teal-800 bg-opacity-30 backdrop-blur-2xl border border-teal-500 text-teal-200 text-sm font-medium mb-6 self-start"
            >
              <span className="flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-300"></span>
              </span>
              Reservations Open Now! - Limited Spots
            </motion.div>
            
            <motion.h1 
              variants={fadeIn}
              className="text-4xl text-center md:text-left md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white"
            >
              <span className="block">The World's First</span>
              <span className="bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">Automatic EV Charger</span>
            </motion.h1>
            
            <motion.div 
              variants={fadeIn}
              className="flex flex-wrap gap-4 mt-2"
            >
              <Link href="order">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3 rounded-full bg-teal-500/30 backdrop-blur-md border border-teal-500/50 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Pre-order Yours Today
                </motion.button>
              </Link>
              <Link href="donate">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Support Us
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
      >
        <ScrollIndicator className="z-0"/>
      </motion.div>

      {/* Features Section */}
      <section id="features" className="py-10 md:py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
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
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
              title="Automatic Connection"
              description="No more manual plugging. Get back hours of your life every year."
            />
            <FeatureCard
              index={1}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              title="Off-Peak Charging"
              description="Intelligently charges your vehicle during non-peak hours to save you around ~$20 every single month."
            />
            <FeatureCard
              index={2}
              icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              title="Battery Health Monitoring"
              description="Intelligent charging patterns help preserve your EV's battery health."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative bg-gray-50">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-teal-50 to-transparent rounded-bl-full opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-cyan-50 to-transparent rounded-tr-full opacity-70"></div>
        
        <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl text-gray-900 md:text-4xl font-bold mt-4 mb-4"
            >
              Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">EVolve Charger</span>
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
                <Image
                  src={Render}
                  alt="The EVolve Charger Smart EV Charger"
                  layout="fill"
                  objectFit="cover"
                  className="z-0"
                  priority
                />
              </div>
              <div className="absolute inset-0 pointer-events-none"></div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
              className="space-y-6"
            >
              {[
                { number: "01", title: "Easy Installation", description: "We make installing your EVolve Charger a simple process so anyone can set it up with just a ladder, drill, and screwdriver." },
                { number: "02", title: "Connect to App", description: "Download our app and connect your EVolve Charger to set preferences and monitor charging." },
                { number: "03", title: "Automated Charging", description: "Park your vehicle, and the EVolve Charger automatically connects when needed based on your setting and then unplugs whenever you want to leave." },
                { number: "04", title: "Smart Monitoring", description: "Receive updates on charging status, battery health, and energy usage through the app and integrate it into the smart home system." }
              ].map((step, index) => {
                const stateVarName = `isOpen${index + 1}`;
                
                return (
                  <motion.div
                    key={step.number}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { delay: index * 0.2, duration: 1.5 } }
                    }}
                    className={`border ${whichOpen[index] ? 'border-teal-400 bg-white/10 backdrop-blur-md' : 'border-gray-200'} rounded-2xl shadow-sm overflow-hidden hover:bg-gray-100`}
                  >
                    <button 
                      onClick={() => {
                        eval(`set${stateVarName}(!${stateVarName})`);
                        eval(whichOpen[index] = !whichOpen[index]);
                      }}
                      className="w-full flex items-center justify-between p-4 focus:outline-none transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold shadow-md">
                            {step.number}
                          </div>
                        </div>
                        <h3 className="text-xl text-gray-900 font-bold">{step.title}</h3>
                      </div>
                      <svg 
                        className={`w-6 h-6 text-gray-500 transform transition-transform duration-300 ${eval(stateVarName) ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${eval(stateVarName) ? 'max-h-40 opacity-100 bg-white/10 backdrop-blur-md border-t border-white/20' : 'max-h-0 opacity-0'}`}
                      aria-expanded={eval(stateVarName)}
                    >
                      <div className="p-4 pt-0 ml-16">
                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Statistics Section */}
      <section id="statistics" className="relative pt-16 pb-8 md:pt-24 bg-white">
        <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-gradient-to-tl from-cyan-50 to-transparent rounded-tl-full opacity-70"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">EVolve Charger by the Numbers</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover the impact of our smart charging solution</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard value={250} units="$" label="dollars saved every year" index={0} />
            <StatCard value={15} units="years" label="added to your car's battery lifespan" index={1} />
            <StatCard value={9} units="hours" label="saved plugging in every year" index={2} />
          </div>
          <p className="text-center text-sm text-gray-500 mt-16">These figures represent estimated savings and benefits based on typical usage, and are not guaranteed results.</p>
        </div>
      </section>

      {/* Donors Section */}
      <section id="donors" className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
                className="text-center mb-12"
              >
                <motion.h2 variants={fadeIn} className="text-5xl font-extrabold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-400">Our Supporters</span>
                </motion.h2>
                <motion.p variants={fadeIn} className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Thank you to our amazing donors who are helping us drive the future of EV charging.
                </motion.p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
              >
                {[
                  { label: "Total Raised", value: `$${totalAmount.toFixed(2)}`, color: "text-teal-600" },
                  { label: "Goal", value: "$10,000", color: "text-gray-900" },
                  { label: "Progress", value: `${progress.toFixed(1)}%`, color: "text-teal-600" },
                ].map(({ label, value, color }) => (
                  <motion.div
                    key={label}
                    variants={fadeIn}
                    className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg text-center border border-white/20"
                  >
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
                    <p className={`mt-2 text-3xl font-bold ${color}`}>{value}</p>
                  </motion.div>
                ))}
              </motion.div>

              <div className="max-w-lg mx-auto">
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-teal-400 to-cyan-400"
                  />
                </div>
                <div className="mt-2 text-sm font-semibold text-gray-700 text-center">
                  {progress.toFixed(1)}% of our $10,000 goal
                </div>
              </div>
              <div className="flex justify-center mt-16">
                <Link href="donate">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-4 rounded-full bg-teal-500/30 backdrop-blur-md border border-teal-500/50 text-white font-semibold shadow-2xl hover:shadow-3xl transition-all"
                  >
                    Join Our Supporters
                  </motion.button>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-1 mt-12 lg:mt-0">
              <div className="bg-white rounded-xl shadow-lg p-6 max-h-[500px] flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { label: "Recent", value: "recent" },
                    { label: "Top (Day)", value: "top-day" },
                    { label: "Top (Month)", value: "top-month" },
                    { label: "Top (All Time)", value: "top-all" },
                  ].map(({ label, value }) => (
                    <button
                      key={value}
                      onClick={() => setFilter(value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        filter === value ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-teal-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Donors</h3>
                  {isLoading ? (
                    <p className="text-gray-600 text-center">Loading donors...</p>
                  ) : error ? (
                    <p className="text-red-600 text-center">{error}</p>
                  ) : donorsWithAmounts.length === 0 ? (
                    <p className="text-gray-600 text-center">No donors yet. Be the first to support the mission!</p>
                  ) : (
                    <div className="space-y-4">
                      {donorsWithAmounts.map((donor) => (
                        <motion.div
                          key={donor.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-b border-gray-100 pb-4 last:border-b-0"
                        >
                          <div className="flex items-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6 text-teal-500 mr-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                              />
                            </svg>
                            <div>
                              <p className="text-lg font-medium text-gray-900">
                                {donor.anonymous ? 'Anonymous Donor' : `${donor.firstName} ${donor.lastName}`}
                              </p>
                              <p className="text-teal-600 font-medium">Donated ${donor.amount}</p>
                              {donor.dedicateTo && (
                                <p className="text-gray-600 italic text-sm">Dedicated to: {donor.dedicateTo}</p>
                              )}
                              <p className="text-gray-500 text-sm">
                                Joined on{' '}
                                {donor.createdAt?.toDate().toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }) || 'Unknown Date'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
            className="bg-white/10 backdrop-blur-md rounded-3xl p-10 md:p-16 text-center shadow-xl border border-white/20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">Join the EVolution</h2>
            <p className="text-lg md:text-xl mb-4 max-w-2xl mx-auto text-teal-50">
              20% discount for the first 50 pre-orders alongside VIP treatment!
            </p>
            
            <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8 mt-8 text-teal-50 font-medium">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Priority-Shipping
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
                {spotsLeft > 0 ? '20% discount' : 'Future promotions'}
              </div>
            </div>
            {isLoading ? (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-8 max-w-lg mx-auto">
                <p className="text-white animate-pulse">Loading special offer details...</p>
              </div>
            ) : spotsLeft > 0 ? (
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.5 }}
                className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mt-8 max-w-lg mx-auto border-1 border-white/20"
              >
                <p className="text-white text-xl font-medium mt-1">
                  Only {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left!
                </p>
              </motion.div>
            ) : (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-8 max-w-lg mx-auto">
                <p className="text-white"><span className="line-through">Special Discount Pricing</span></p>
                <p className="text-yellow-300 font-bold">All discounted spots have been claimed!</p>
                <p className="text-white text-sm mt-1">Join now to get on our waitlist for future promotions.</p>
              </div>
            )}
            <div className="max-w-md mx-auto mt-8">
              <Link href="order">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3 rounded-full bg-teal-500/30 backdrop-blur-md border border-teal-500/50 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Pre-order Yours
                </motion.button>
              </Link>
              {submitError && <p className="mt-2 text-red-300 text-sm">{submitError}</p>}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      {/* <section id="faq" className="relative py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about The EVolve Charger.
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
      </section> */}
    </div>
  );
}