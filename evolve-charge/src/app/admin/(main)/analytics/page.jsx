'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { db } from '../../../firebaseConfig.js';
import { collection, getDocs } from 'firebase/firestore';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function KPIDashboard() {
  const [orders, setOrders] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const router = useRouter();

  // Mock data (replace with actual Firebase Analytics or custom collection)
  const mockWebsiteVisitors = 1000; // Placeholder for total website visitors
  const mockMarketingExpenses = 500; // Placeholder for total marketing expenses

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch orders
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);

      // Fetch donations (assuming a 'donations' collection)
      const donationsSnapshot = await getDocs(collection(db, 'donations'));
      const donationsData = donationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDonations(donationsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Calculate KPIs
  const totalPreOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalRaised = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
  const numberOfDonors = donations.length;
  const fundraisingGoal = 10000;
  const fundraisingProgress = (totalRaised / fundraisingGoal) * 100;

  // Order Growth Rate (Weekly)
  const getWeeklyPreOrderGrowth = () => {
    const today = new Date();
    const weeks = {};
    orders.forEach(order => {
      const orderDate = order.orderDate?.seconds
        ? new Date(order.orderDate.seconds * 1000)
        : new Date(order.orderDate);
      const weekNumber = Math.floor((today - orderDate) / (7 * 24 * 60 * 60 * 1000));
      if (weekNumber >= 0 && weekNumber < 4) { // Last 4 weeks
        weeks[weekNumber] = (weeks[weekNumber] || 0) + 1;
      }
    });

    const sortedWeeks = Array(4).fill(0).map((_, i) => weeks[i] || 0).reverse();
    const growthRates = sortedWeeks.map((count, i) => {
      if (i === 0) return 0;
      const prevCount = sortedWeeks[i - 1];
      return prevCount ? ((count - prevCount) / prevCount) * 100 : 0;
    }).slice(1);

    return {
      labels: ['3 Weeks Ago', '2 Weeks Ago', 'Last Week'],
      data: growthRates,
    };
  };

  const conversionRate = mockWebsiteVisitors
    ? (totalPreOrders / mockWebsiteVisitors) * 100
    : 0;

  const cac = totalPreOrders
    ? mockMarketingExpenses / totalPreOrders
    : 0;

  // Chart Data
  const preOrderGrowthChartData = {
    labels: getWeeklyPreOrderGrowth().labels,
    datasets: [
      {
        label: 'Weekly Order Growth Rate (%)',
        data: getWeeklyPreOrderGrowth().data,
        borderColor: 'rgb(45, 212, 191)',
        backgroundColor: 'rgba(45, 212, 191, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const fundraisingChartData = {
    labels: ['Raised', 'Remaining'],
    datasets: [
      {
        label: 'Fundraising Progress',
        data: [totalRaised, fundraisingGoal - totalRaised],
        backgroundColor: ['rgb(45, 212, 191)', 'rgb(229, 231, 235)'],
        borderColor: ['rgb(45, 212, 191)', 'rgb(229, 231, 235)'],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-700">Loading KPI data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {notification && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-md z-50 ${
            notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="py-6">
        <div className="mx-auto px-4 sm:px-6 md:px-8">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="text-2xl font-semibold text-gray-900"
          >
            KPI Dashboard
          </motion.h1>
        </div>

        <div className="mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* KPI Sidebar */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-1"
            >
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">KPI Summary</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Order Growth</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Total Orders:</span>
                          <span className="font-medium text-gray-700">{totalPreOrders}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Latest Weekly Growth:</span>
                          <span className="font-medium text-gray-700">
                            {getWeeklyPreOrderGrowth().data.slice(-1)[0]?.toFixed(1) || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Conversion Rate</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Rate:</span>
                          <span className="font-medium text-gray-700">{conversionRate.toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Visitors:</span>
                          <span className="font-medium text-gray-700">{mockWebsiteVisitors}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Fundraising Progress</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Total Raised:</span>
                          <span className="font-medium text-gray-700">${totalRaised.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Progress:</span>
                          <span className="font-medium text-gray-700">{fundraisingProgress.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Donors:</span>
                          <span className="font-medium text-gray-700">{numberOfDonors}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Customer Acquisition Cost</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">CAC:</span>
                          <span className="font-medium text-gray-700">${cac.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Marketing Expenses:</span>
                          <span className="font-medium text-gray-700">${mockMarketingExpenses.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-3"
            >
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">KPI Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Growth Chart */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Order Growth Rate</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <Line
                          data={preOrderGrowthChartData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: { position: 'top' },
                              title: { display: true, text: 'Weekly Order Growth Rate' },
                            },
                            scales: {
                              y: { title: { display: true, text: 'Growth Rate (%)' } },
                            },
                          }}
                        />
                      </div>
                    </div>
                    {/* Fundraising Progress Chart */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Fundraising Progress</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <Bar
                          data={fundraisingChartData}
                          options={{
                            responsive: true,
                            plugins: {
                              legend: { display: false },
                              title: { display: true, text: 'Fundraising Progress ($)' },
                            },
                            scales: {
                              y: { title: { display: true, text: 'Amount ($)' } },
                            },
                          }}
                        />
                      </div>
                    </div>
                    {/* Conversion Rate Note */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Conversion Rate</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">
                          Current Conversion Rate: <span className="font-bold">{conversionRate.toFixed(2)}%</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Note: Visitor data is a placeholder. Integrate with Firebase Analytics for accurate tracking.
                        </p>
                      </div>
                    </div>
                    {/* CAC Note */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Customer Acquisition Cost</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">
                          Current CAC: <span className="font-bold">${cac.toFixed(2)}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Note: Marketing expenses are a placeholder. Update with actual data for precise calculations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}