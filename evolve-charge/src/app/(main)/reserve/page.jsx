"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { db } from '../../firebaseConfig.js';
import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function ReservePage() {
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    vehicleMake: '',
    vehicleModel: '',
    installationType: 'residential',
    installationNotes: '',
    agreeTerms: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Get email from URL parameters on component mount
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setFormData(prev => ({
        ...prev,
        email: emailParam
      }));
    }
  }, [searchParams]);

  const vehicleMakes = [
    "Tesla", "Ford", "Chevrolet", "Nissan", "BMW", "Audi",
    "Volkswagen", "Hyundai", "Kia", "Porsche", "Rivian", "Lucid",
    "Toyota", "Mercedes-Benz", "Polestar", "Volvo", "Other"
  ];

  const stateOptions = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  const installationTypes = [
    { id: "residential", label: "Residential" },
    { id: "commercial", label: "Commercial" },
    { id: "multi-family", label: "Multi-Family Dwelling" }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const reservationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        vehicleMake: formData.vehicleMake || null,
        vehicleModel: formData.vehicleModel || null,
        lastUpdated: serverTimestamp()
      };

      // Check if the email already exists in the database
      const mailingListRef = collection(db, 'mailing-list');
      const emailQuery = query(mailingListRef, where("email", "==", formData.email));
      const querySnapshot = await getDocs(emailQuery);
      
      let actionTaken = "added";
      
      if (querySnapshot.empty) {
        // Email doesn't exist, create a new document
        reservationData.reservationDate = serverTimestamp(); // Add creation timestamp
        await addDoc(mailingListRef, reservationData);
      } else {
        // Email exists, update the existing document
        const docRef = doc(db, 'mailing-list', querySnapshot.docs[0].id);
        await updateDoc(docRef, reservationData);
        actionTaken = "updated";
      }
      
      // Optional: Send confirmation email via API
      fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          reservationId: new Date().getTime().toString(),
          isNewUser: actionTaken === "added"
        }),
      }).catch(error => console.error('Error sending confirmation email:', error));

      setSubmitStatus({ status: 'success', action: actionTaken });
      
      // Reset only certain fields after successful submission
      setFormData(prev => ({
        ...prev,
        address: '',
        city: '',
        state: '',
        zipCode: '',
        installationNotes: '',
        agreeTerms: false
      }));
    } catch (error) {
      console.error('Error submitting reservation:', error);
      setSubmitStatus({ status: 'error' });
    } finally {
      setIsSubmitting(false);
      
      // Auto-scroll to top to see success message
      window.scrollTo(0, 0);
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto">
          {/* Header Section */}
          <motion.div variants={fadeIn} className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Reserve Your EVolve Charger</h1>
            <p className="text-lg text-gray-700">
              You're one step closer to transforming your EV charging experience.
            </p>
          </motion.div>

          {/* Success/Error Message */}
          {submitStatus && (
            <motion.div 
              variants={fadeIn}
              className={`mb-8 p-4 rounded-lg ${
                submitStatus.status === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {submitStatus.status === 'success' ? (
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>
                    {submitStatus.action === "added" 
                      ? "Your reservation has been confirmed! Check your inbox for reservation details."
                      : "Your information has been updated successfully! Check your inbox for the latest details."}
                  </p>
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p>There was an error submitting your reservation. Please try again.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Main Form */}
          <motion.form variants={fadeIn} onSubmit={handleSubmit}>
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="(555) 555-5555"
                />
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Your EV</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="vehicleMake" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Make*</label>
                  <select
                    id="vehicleMake"
                    name="vehicleMake"
                    value={formData.vehicleMake}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  >
                    <option value="">Select Make</option>
                    {vehicleMakes.map((make) => (
                      <option key={make} value={make}>{make}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="vehicleModel" className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model*</label>
                  <input
                    type="text"
                    id="vehicleModel"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., Model 3, Mach-E, ID.4"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">             
              <div className="flex items-start mb-4">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    required
                    className="h-4 w-4 text-teal-500 border-gray-300 rounded focus:ring-teal-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                    I agree to the terms and conditions
                  </label>
                  <p className="text-gray-500">
                    By checking this box, you agree to our{' '}
                    <a href="#" className="text-teal-500 hover:underline">Terms of Service</a>,{' '}
                    <a href="#" className="text-teal-500 hover:underline">Privacy Policy</a>, and{' '}
                    <a href="#" className="text-teal-500 hover:underline">Installation Terms</a>.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!formData.agreeTerms || isSubmitting}
                className={`px-8 py-3 rounded-full font-medium transition-all ${
                  formData.agreeTerms && !isSubmitting
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                } min-w-[200px]`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Complete Reservation'
                )}
              </button>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}