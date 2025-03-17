'use client';

// app/admin/home/page.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { db } from '../../../firebaseConfig.js';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import Link from 'next/link';

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

export default function AdminHome() {
  const [adminEmail, setAdminEmail] = useState('');
  const [adminName, setAdminName] = useState('');
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState('day');
  const [stats, setStats] = useState({
    users: { total: 0, new: 0 },
    orders: { total: 0, new: 0 },
    mailingList: { total: 0, new: 0 }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const email = sessionStorage.getItem('adminEmail');

    if (!isLoggedIn || !email) {
      router.push('/admin');
      return;
    }

    setAdminEmail(email);
    fetchAdminInfo(email);
    fetchAnalytics(timePeriod);
  }, [router, timePeriod]);
  
  const fetchAdminInfo = async (email) => {
    try {
      // Query the admins collection to find the admin with this email
      const adminQuery = query(collection(db, "admins"), where("email", "==", email));
      const adminSnapshot = await getDocs(adminQuery);
      
      if (!adminSnapshot.empty) {
        const adminData = adminSnapshot.docs[0].data();
        setAdminName(adminData.name || email); // Use name from the document, fallback to email
      } else {
        // If no matching admin document found, use email as fallback
        setAdminName(email);
      }
    } catch (error) {
      console.error("Error fetching admin info:", error);
      setAdminName(email); // Use email as fallback in case of error
    }
  };

  const getStartDate = (period) => {
    const now = new Date();
    const startDate = new Date(now);
    
    switch(period) {
      case 'day':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setHours(0, 0, 0, 0);
    }
    
    return startDate;
  };

  const getPeriodLabel = (period) => {
    switch(period) {
      case 'day': return 'today';
      case 'week': return 'this week';
      case 'month': return 'this month';
      case 'year': return 'this year';
      default: return 'today';
    }
  };

  const fetchAnalytics = async (period) => {
    try {
      setLoading(true);
      
      // Get start date based on selected period
      const startDate = getStartDate(period);
      const startTimestamp = Timestamp.fromDate(startDate);
      
      // Fetch users statistics
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersTotal = usersSnapshot.size;
      
      // Filter users by registerDate field
      let usersNew = 0;
      usersSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.registerDate && 
            ((data.registerDate instanceof Timestamp && data.registerDate.toDate() >= startDate) || 
             (typeof data.registerDate === 'number' && data.registerDate >= startDate.getTime()))) {
          usersNew++;
        }
      });

      // Fetch orders statistics
      const ordersCollection = collection(db, "orders");
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersTotal = ordersSnapshot.size;
      
      // Filter orders by orderDate field
      let ordersNew = 0;
      ordersSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.orderDate && 
            ((data.orderDate instanceof Timestamp && data.orderDate.toDate() >= startDate) || 
             (typeof data.orderDate === 'number' && data.orderDate >= startDate.getTime()))) {
          ordersNew++;
        }
      });

      // Fetch mailing list statistics
      const mailingListCollection = collection(db, "mailing-list");
      const mailingListSnapshot = await getDocs(mailingListCollection);
      const mailingListTotal = mailingListSnapshot.size;
      
      // Filter mailing list by subscriptionDate field
      let mailingListNew = 0;
      mailingListSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.subscriptionDate && 
            ((data.subscriptionDate instanceof Timestamp && data.subscriptionDate.toDate() >= startDate) || 
             (typeof data.subscriptionDate === 'number' && data.subscriptionDate >= startDate.getTime()))) {
          mailingListNew++;
        }
      });

      setStats({
        users: { total: usersTotal, new: usersNew },
        orders: { total: ordersTotal, new: ordersNew },
        mailingList: { total: mailingListTotal, new: mailingListNew }
      });

      // Fetch recent activity (combines users, orders, and mailing list sign ups)
      const recentUsers = await getDocs(query(usersCollection, orderBy("registerDate", "desc"), limit(5)));
      const recentOrders = await getDocs(query(ordersCollection, orderBy("orderDate", "desc"), limit(5)));
      const recentSubscriptions = await getDocs(query(mailingListCollection, orderBy("signupDate", "desc"), limit(5)));

      const activity = [
        ...recentUsers.docs.map(doc => {
          const data = doc.data();
          return {
            type: 'New user',
            email: data.email,
            time: data.registerDate instanceof Timestamp ? 
              data.registerDate.toDate().getTime() : 
              data.registerDate,
            details: `${data.firstName || ''} ${data.lastName || ''}`.trim()
          };
        }),
        ...recentOrders.docs.map(doc => {
          const data = doc.data();
          return {
            type: 'New order',
            email: data.customerEmail,
            time: data.orderDate instanceof Timestamp ? 
              data.orderDate.toDate().getTime() : 
              data.orderDate,
            details: `Order #${doc.id.substring(0, 8)} - $${data.total?.toFixed(2) || '0.00'}`
          };
        }),
        ...recentSubscriptions.docs.map(doc => {
          const data = doc.data();
          return {
            type: 'Newsletter sign-up',
            email: data.email,
            time: data.subscriptionDate instanceof Timestamp ? 
              data.subscriptionDate.toDate().getTime() : 
              data.subscriptionDate,
            details: ''
          };
        })
      ];

      // Sort by time descending and take the most recent 10
      activity.sort((a, b) => b.time - a.time);
      setRecentActivity(activity.slice(0, 10));
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-700">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mx-auto px-4 sm:px-6 md:px-8 flex justify-between items-center">
        <motion.h1 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-2xl font-semibold text-gray-900"
        >
          Dashboard
        </motion.h1>
        
        <div className="flex space-x-4">
          <Link href="/admin/database">
            <motion.button
              initial="hidden"
              animate="visible"
              variants={fadeIn} 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              Database
            </motion.button>
          </Link>
          
          <Link href="/admin/newsletter">
            <motion.button
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              New Post
            </motion.button>
          </Link>
        </div>
      </div>
      
      <div className="mx-auto px-4 sm:px-6 md:px-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="py-4"
        >
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Welcome, {adminEmail}</h2>
                
                <div className="relative inline-block text-left">
                  <select
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                  >
                    <option value="day">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {/* Analytics cards */}
                <div className="bg-gradient-to-br from-teal-500 to-teal-600 overflow-hidden rounded-lg shadow">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-white bg-opacity-30 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-white text-opacity-80 truncate">
                            Users
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {stats.users.total}
                            </div>
                            <div className="ml-2 flex items-baseline text-sm font-semibold text-green-100">
                              <span className="bg-white bg-opacity-30 px-1.5 py-0.5 rounded-md">
                                +{stats.users.new} {getPeriodLabel(timePeriod)}
                              </span>
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 overflow-hidden rounded-lg shadow">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-white bg-opacity-30 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-white text-opacity-80 truncate">
                            Orders
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {stats.orders.total}
                            </div>
                            <div className="ml-2 flex items-baseline text-sm font-semibold text-green-100">
                              <span className="bg-white bg-opacity-30 px-1.5 py-0.5 rounded-md">
                                +{stats.orders.new} {getPeriodLabel(timePeriod)}
                              </span>
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 overflow-hidden rounded-lg shadow">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-white bg-opacity-30 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-white text-opacity-80 truncate">
                            Newsletter Subscribers
                          </dt>
                          <dd className="flex items-baseline">
                            <div className="text-2xl font-semibold text-white">
                              {stats.mailingList.total}
                            </div>
                            <div className="ml-2 flex items-baseline text-sm font-semibold text-green-100">
                              <span className="bg-white bg-opacity-30 px-1.5 py-0.5 rounded-md">
                                +{stats.mailingList.new} {getPeriodLabel(timePeriod)}
                              </span>
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Type
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Details
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {recentActivity.map((item, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {item.type}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.details}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(item.time)}
                        </td>
                      </tr>
                    ))}
                    {recentActivity.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-4 text-center text-sm text-gray-500">
                          No recent activity
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}