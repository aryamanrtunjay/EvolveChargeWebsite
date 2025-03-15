'use client';

import { useState } from 'react';
import { db } from '../firebaseConfig.js';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { motion } from 'framer-motion';


const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Query Firestore for admin user with matching email
      const adminRef = collection(db, 'admins');
      const q = query(adminRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const adminDoc = querySnapshot.docs[0];
      const adminData = adminDoc.data();

      // In a real app, you should never store plain passwords
      // This is just for demonstration - you should use proper authentication
      if (adminData.password !== password) {
        throw new Error('Invalid credentials');
      }

      // Set admin session
      sessionStorage.setItem('adminLoggedIn', 'true');
      sessionStorage.setItem('adminEmail', email);
      sessionStorage.setItem('adminId', adminDoc.id);

      // Redirect to admin home
      router.push('/admin/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Head>
        <title>EVolve Charge | Admin Login</title>
        <meta name="description" content="Admin login for EVolve Charge" />
      </Head>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-teal-600 hover:text-teal-800">
            Return to Website
          </a>
        </div>
      </motion.div>
    </div>
  );
}