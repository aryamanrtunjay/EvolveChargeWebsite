'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { db } from '../../../firebaseConfig.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
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

export default function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState('expenses');
  const [expenses, setExpenses] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newExpense, setNewExpense] = useState({ amount: '', category: '', date: '', description: '' });
  const [newCampaign, setNewCampaign] = useState({ name: '', startDate: '', endDate: '', budget: '', clicks: 0, impressions: 0, conversions: 0 });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }

    // Real-time listeners
    const unsubscribeExpenses = onSnapshot(collection(db, 'marketing', 'expenses', 'records'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExpenses(data);
      setLoading(false);
    });

    const unsubscribeCampaigns = onSnapshot(collection(db, 'marketing', 'campaigns', 'records'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCampaigns(data);
    });

    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    });

    return () => {
      unsubscribeExpenses();
      unsubscribeCampaigns();
      unsubscribeOrders();
    };
  }, [router]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle form submissions
  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const expenseData = {
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: new Date(newExpense.date).toISOString(),
        description: newExpense.description,
      };
      if (editingId) {
        await updateDoc(doc(db, 'marketing', 'expenses', 'records', editingId), expenseData);
        setEditingId(null);
        showNotification('Expense updated successfully');
      } else {
        await addDoc(collection(db, 'marketing', 'expenses', 'records'), expenseData);
        showNotification('Expense added successfully');
      }
      setNewExpense({ amount: '', category: '', date: '', description: '' });
    } catch (error) {
      console.error('Error saving expense:', error);
      showNotification('Failed to save expense', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const campaignData = {
        name: newCampaign.name,
        startDate: new Date(newCampaign.startDate).toISOString(),
        endDate: new Date(newCampaign.endDate).toISOString(),
        budget: parseFloat(newCampaign.budget),
        clicks: parseInt(newCampaign.clicks) || 0,
        impressions: parseInt(newCampaign.impressions) || 0,
        conversions: parseInt(newCampaign.conversions) || 0,
      };
      if (editingId) {
        await updateDoc(doc(db, 'marketing', 'campaigns', 'records', editingId), campaignData);
        setEditingId(null);
        showNotification('Campaign updated successfully');
      } else {
        await addDoc(collection(db, 'marketing', 'campaigns', 'records'), campaignData);
        showNotification('Campaign added successfully');
      }
      setNewCampaign({ name: '', startDate: '', endDate: '', budget: '', clicks: 0, impressions: 0, conversions: 0 });
    } catch (error) {
      console.error('Error saving campaign:', error);
      showNotification('Failed to save campaign', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit/delete
  const handleEdit = (item, type) => {
    setEditingId(item.id);
    if (type === 'expense') {
      setNewExpense({
        amount: item.amount.toString(),
        category: item.category,
        date: new Date(item.date).toISOString().split('T')[0],
        description: item.description,
      });
    } else {
      setNewCampaign({
        name: item.name,
        startDate: new Date(item.startDate).toISOString().split('T')[0],
        endDate: new Date(item.endDate).toISOString().split('T')[0],
        budget: item.budget.toString(),
        clicks: item.clicks,
        impressions: item.impressions,
        conversions: item.conversions,
      });
    }
  };

  const handleDelete = async (id, collectionName) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, 'marketing', collectionName, 'records', id));
        showNotification('Item deleted successfully');
      } catch (error) {
        console.error('Error deleting item:', error);
        showNotification('Failed to delete item', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  // Calculate metrics
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalPreOrders = orders.length;
  const cac = totalPreOrders ? totalExpenses / totalPreOrders : 0;
  const campaignROI = campaigns.reduce((sum, campaign) => {
    const revenue = campaign.conversions * 124.99; // Charger price
    return sum + ((revenue - campaign.budget) / campaign.budget) * 100;
  }, 0) / (campaigns.length || 1);

  // Chart data
  const expenseChartData = {
    labels: expenses.map(exp => new Date(exp.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Marketing Expenses ($)',
        data: expenses.map(exp => exp.amount),
        borderColor: 'rgb(45, 212, 191)',
        backgroundColor: 'rgba(45, 212, 191, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const campaignChartData = {
    labels: campaigns.map(camp => camp.name),
    datasets: [
      {
        label: 'Conversions',
        data: campaigns.map(camp => camp.conversions),
        backgroundColor: 'rgb(45, 212, 191)',
      },
      {
        label: 'Budget ($)',
        data: campaigns.map(camp => camp.budget),
        backgroundColor: 'rgb(234, 179, 8)',
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-700">Loading marketing data...</p>
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
            Marketing Dashboard
          </motion.h1>
        </div>

        <div className="mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-1"
            >
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Marketing Summary</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Expenses</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Total Expenses:</span>
                          <span className="font-medium text-gray-700">${totalExpenses.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Acquisition Cost</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">CAC:</span>
                          <span className="font-medium text-gray-700">${cac.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Campaign Performance</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Average ROI:</span>
                          <span className="font-medium text-gray-700">{campaignROI.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Total Conversions:</span>
                          <span className="font-medium text-gray-700">{campaigns.reduce((sum, camp) => sum + camp.conversions, 0)}</span>
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
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    <button
                      onClick={() => setActiveTab('expenses')}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                        activeTab === 'expenses'
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Expenses ({expenses.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('campaigns')}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                        activeTab === 'campaigns'
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Campaigns ({campaigns.length})
                    </button>
                  </nav>
                </div>

                <div className="p-4">
                  {/* Expenses Tab */}
                  {activeTab === 'expenses' && (
                    <div>
                      {/* Form */}
                      <form onSubmit={handleExpenseSubmit} className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={newExpense.amount}
                              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                              className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                              value={newExpense.category}
                              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                              className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                              required
                            >
                              <option value="">Select Category</option>
                              <option value="Ads">Ads</option>
                              <option value="Influencer">Influencer</option>
                              <option value="Content">Content</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                              type="date"
                              value={newExpense.date}
                              onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                              className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <input
                              type="text"
                              value={newExpense.description}
                              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                              className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                        >
                          {editingId ? 'Update Expense' : 'Add Expense'}
                        </button>
                      </form>

                      {/* Chart */}
                      <div className="mb-6">
                        <h3 className="text-md font-medium text-gray-900 mb-2">Expenses Over Time</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <Line
                            data={expenseChartData}
                            options={{
                              responsive: true,
                              plugins: {
                                legend: { position: 'top' },
                                title: { display: true, text: 'Marketing Expenses Over Time' },
                              },
                              scales: {
                                y: { title: { display: true, text: 'Amount ($)' } },
                              },
                            }}
                          />
                        </div>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {expenses.map((expense) => (
                              <tr key={expense.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${expense.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(expense.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.description || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => handleEdit(expense, 'expense')}
                                    className="text-teal-600 hover:text-teal-900 mr-4"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(expense.id, 'expenses')}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {expenses.length === 0 && (
                              <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                  No expenses found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Campaigns Tab */}
                  {activeTab === 'campaigns' && (
                    <div>
                      {/* Form */}
                      <form onSubmit={handleCampaignSubmit} className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Campaign Name</label>
                            <input
                              type="text"
                              value={newCampaign.name}
                              onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                              className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                              type="date"
                              value={newCampaign.startDate}
                              onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                              className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                              type="date"
                              value={newCampaign.endDate}
                              onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                              className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Budget ($)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={newCampaign.budget}
                              onChange={(e) => setNewCampaign({ ...newCampaign, budget: e.target.value })}
                              className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Clicks</label>
                            <input
                              type="number"
                              value={newCampaign.clicks}
                              onChange={(e) => setNewCampaign({ ...newCampaign, clicks: parseInt(e.target.value) || 0 })}
                              className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Impressions</label>
                            <input
                              type="number"
                              value={newCampaign.impressions}
                              onChange={(e) => setNewCampaign({ ...newCampaign, impressions: parseInt(e.target.value) || 0 })}
                              className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Conversions</label>
                            <input
                              type="number"
                              value={newCampaign.conversions}
                              onChange={(e) => setNewCampaign({ ...newCampaign, conversions: parseInt(e.target.value) || 0 })}
                              className="mt-1 text-gray-700 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                        >
                          {editingId ? 'Update Campaign' : 'Add Campaign'}
                        </button>
                      </form>

                      {/* Chart */}
                      <div className="mb-6">
                        <h3 className="text-md font-medium text-gray-900 mb-2">Campaign Performance</h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <Bar
                            data={campaignChartData}
                            options={{
                              responsive: true,
                              plugins: {
                                legend: { position: 'top' },
                                title: { display: true, text: 'Campaign Conversions vs. Budget' },
                              },
                              scales: {
                                y: { title: { display: true, text: 'Value' } },
                              },
                            }}
                          />
                        </div>
                      </div>

                      {/* Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversions</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {campaigns.map((campaign) => (
                              <tr key={campaign.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${campaign.budget.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.clicks}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.impressions}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.conversions}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => handleEdit(campaign, 'campaign')}
                                    className="text-teal-600 hover:text-teal-900 mr-4"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(campaign.id, 'campaigns')}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                            {campaigns.length === 0 && (
                              <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                  No campaigns found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}