'use client';

// app/admin/database/page.js
import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { db } from '../../../firebaseConfig.js';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

export default function AdminDatabase() {
  const [activeCollection, setActiveCollection] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [mailingList, setMailingList] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const router = useRouter();
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
      
      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);

      // Fetch orders
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Create a map of user IDs to user data for quick lookup
      const usersMap = usersData.reduce((map, user) => {
        map[user.id] = user;
        return map;
      }, {});

      // Enhance orders with customer names
      const ordersWithCustomerNames = ordersData.map(order => {
        const customer = usersMap[order.customerID];
        return {
          ...order,
          customerName: customer ? 
            `${customer.firstName || customer['first-name'] || ''} ${customer.lastName || customer['last-name'] || ''}`.trim() :
            'Unknown Customer',
          customerEmail: customer ? 
            customer.email || customer['email-address'] || 'N/A' :
            'N/A'
        };
      });

      setOrders(ordersWithCustomerNames);

      // Fetch mailing list
      const mailingListSnapshot = await getDocs(collection(db, 'mailing-list'));
      const mailingListData = mailingListSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMailingList(mailingListData);
    } catch (error) {
      console.error("Error fetching data:", error);
      showNotification('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = async (collectionName, id) => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        
        // Update local state
        if (collectionName === 'users') {
          setUsers(users.filter(user => user.id !== id));
        } else if (collectionName === 'orders') {
          setOrders(orders.filter(order => order.id !== id));
        } else if (collectionName === 'mailing-list') {
          setMailingList(mailingList.filter(item => item.id !== id));
        }
        
        showNotification('Item deleted successfully');
      } catch (error) {
        console.error("Error deleting document:", error);
        showNotification('Error deleting item', 'error');
      }
    }
  };

  const handleItemClick = (id) => {
    if (expandedItem === id) {
      setExpandedItem(null);
    } else {
      setExpandedItem(id);
    }
  };

  // Calculate Analytics
  const analytics = {
    users: {
      total: users.length,
      byVehicleMake: users.reduce((acc, user) => {
        const make = user['vehicle-make'] || user.vehicleMake || 'Unknown';
        acc[make] = (acc[make] || 0) + 1;
        return acc;
      }, {}),
      byVehicleModel: users.reduce((acc, user) => {
        const model = user['vehicle-model'] || user.vehicleModel || 'Unknown';
        acc[model] = (acc[model] || 0) + 1;
        return acc;
      }, {})
    },
    orders: {
      total: orders.length,
      revenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
      byPaymentMethod: orders.reduce((acc, order) => {
        const method = order.paymentMethod || 'Unknown';
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      }, {}),
      byPlan: orders.reduce((acc, order) => {
        const plan = order.plan || 'Unknown';
        acc[plan] = (acc[plan] || 0) + 1;
        return acc;
      }, {})
    },
    mailingList: {
      total: mailingList.length,
      byReferralSource: mailingList.reduce((acc, item) => {
        const source = item.referralSource || 'Unknown';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {})
    }
  };

  // Helper to render object as list items
  const renderObjectAsList = (obj) => {
    return Object.entries(obj).map(([key, value]) => (
      <div key={key} className="flex justify-between py-1">
        <span className="text-gray-600">{key}:</span>
        <span className="font-medium text-gray-700">{value}</span>
      </div>
    ));
  };

  // Format date from timestamp or string
  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    
    try {
      if (typeof dateValue === 'string') {
        return dateValue;
      }
      
      // Handle Firestore timestamps
      if (dateValue.seconds) {
        return new Date(dateValue.seconds * 1000).toLocaleString();
      }
      
      return new Date(dateValue).toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-700">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {notification && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-md z-50 ${
          notification.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
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
            Database Management
          </motion.h1>
        </div>
        
        <div className="mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Analytics Sidebar */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-1"
            >
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Analytics</h2>
                  
                  <div className="space-y-6">
                    {/* Users Analytics */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Users</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Total Users:</span>
                          <span className="font-medium text-gray-700">{analytics.users.total}</span>
                        </div>
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">By Vehicle Make</h4>
                          {renderObjectAsList(analytics.users.byVehicleMake)}
                        </div>
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">By Vehicle Model</h4>
                          {renderObjectAsList(analytics.users.byVehicleModel)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Orders Analytics */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Orders</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Total Orders:</span>
                          <span className="font-medium text-gray-700">{analytics.orders.total}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Revenue:</span>
                          <span className="font-medium text-gray-700">${analytics.orders.revenue.toFixed(2)}</span>
                        </div>
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">By Payment Method</h4>
                          {renderObjectAsList(analytics.orders.byPaymentMethod)}
                        </div>
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">By Plan</h4>
                          {renderObjectAsList(analytics.orders.byPlan)}
                        </div>
                      </div>
                    </div>
                    
                    {/* Mailing List Analytics */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-2">Mailing List</h3>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between py-1">
                          <span className="text-gray-600">Total Subscribers:</span>
                          <span className="font-medium text-gray-700">{analytics.mailingList.total}</span>
                        </div>
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">By Referral Source</h4>
                          {renderObjectAsList(analytics.mailingList.byReferralSource)}
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
                {/* Collection Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex -mb-px">
                    <button
                      onClick={() => setActiveCollection('users')}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                        activeCollection === 'users'
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Users ({users.length})
                    </button>
                    <button
                      onClick={() => setActiveCollection('orders')}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                        activeCollection === 'orders'
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Orders ({orders.length})
                    </button>
                    <button
                      onClick={() => setActiveCollection('mailing-list')}
                      className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                        activeCollection === 'mailing-list'
                          ? 'border-teal-500 text-teal-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Mailing List ({mailingList.length})
                    </button>
                  </nav>
                </div>

                {/* Collection Content */}
                <div className="p-4">
                  {/* Users Collection */}
                  {activeCollection === 'users' && (
                    <div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vehicle
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                              <Fragment key={user.id}>
                                <tr 
                                  className={`hover:bg-gray-50 cursor-pointer ${expandedItem === user.id ? 'bg-gray-50' : ''}`}
                                  onClick={() => handleItemClick(user.id)}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                      {(user.firstName || user['first-name'] || '') + ' ' + (user.lastName || user['last-name'] || '')}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{user.email || user['email-address'] || 'N/A'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                      {(user.vehicleMake || user['vehicle-make'] || '') + ' ' + (user.vehicleModel || user['vehicle-model'] || '')}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete('users', user.id);
                                      }}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                                {expandedItem === user.id && (
                                  <tr>
                                    <td colSpan="4" className="px-6 py-4 bg-gray-50">
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="font-medium text-gray-900 mb-2">User Details</h4>
                                          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                            <dt className="text-sm font-medium text-gray-500">First Name</dt>
                                            <dd className="text-sm text-gray-900">{user.firstName || user['first-name'] || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                                            <dd className="text-sm text-gray-900">{user.lastName || user['last-name'] || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="text-sm text-gray-900">{user.email || user['email-address'] || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                            <dd className="text-sm text-gray-900">{user.phone || user['phone-number'] || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Reference</dt>
                                            <dd className="text-sm text-gray-900">{user.reference || user.referralSource || 'N/A'}</dd>
                                          </dl>
                                        </div>
                                        
                                        <div>
                                          <h4 className="font-medium text-gray-900 mb-2">Vehicle & Address</h4>
                                          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                            <dt className="text-sm font-medium text-gray-500">Vehicle Make</dt>
                                            <dd className="text-sm text-gray-900">{user.vehicleMake || user['vehicle-make'] || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Vehicle Model</dt>
                                            <dd className="text-sm text-gray-900">{user.vehicleModel || user['vehicle-model'] || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Address</dt>
                                            <dd className="text-sm text-gray-900">{user.address1 || user.street || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">City</dt>
                                            <dd className="text-sm text-gray-900">{user.city || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">State</dt>
                                            <dd className="text-sm text-gray-900">{user.state || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">ZIP</dt>
                                            <dd className="text-sm text-gray-900">{user.zip || 'N/A'}</dd>
                                          </dl>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </Fragment>
                            ))}
                            {users.length === 0 && (
                              <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                  No users found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Orders Collection */}
                  {activeCollection === 'orders' && (
                    <div>
                      <div className="overflow-x-auto">                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pre-order ID
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer ID
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">                            {orders.map((order) => (
                              <Fragment key={order.id}>
                                <tr 
                                  className={`hover:bg-gray-50 cursor-pointer ${expandedItem === order.id ? 'bg-gray-50' : ''}`}
                                  onClick={() => handleItemClick(order.id)}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{order.id.substring(0, 8)}...</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{order.customerName || 'Unknown Customer'}</div>
                                    <div className="text-sm text-gray-500">{order.customerEmail || 'N/A'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{order.customerID || 'N/A'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{formatDate(order.orderDate)}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">${order.total || '0'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      order.status === 'Paid' || order.paymentStatus === 'Completed' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {order.status || order.paymentStatus || 'Pending'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete('orders', order.id);
                                      }}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>                                {expandedItem === order.id && (
                                  <tr>
                                    <td colSpan="7" className="px-6 py-4 bg-gray-50">
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="font-medium text-gray-900 mb-2">Pre-order Details</h4>
                                          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                            <dt className="text-sm font-medium text-gray-500">Pre-order ID</dt>
                                            <dd className="text-sm text-gray-900">{order.id}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Customer ID</dt>
                                            <dd className="text-sm text-gray-900">{order.customerID || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Pre-order Date</dt>
                                            <dd className="text-sm text-gray-900">{formatDate(order.orderDate)}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Payment Date</dt>
                                            <dd className="text-sm text-gray-900">{formatDate(order.paymentDate)}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                                            <dd className="text-sm text-gray-900">{order.status || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Plan</dt>
                                            <dd className="text-sm text-gray-900">{order.plan || 'N/A'}</dd>
                                          </dl>
                                        </div>
                                        
                                        <div>
                                          <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
                                          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                            <dt className="text-sm font-medium text-gray-500">Subtotal</dt>
                                            <dd className="text-sm text-gray-900">${order.subtotal || '0'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Tax</dt>
                                            <dd className="text-sm text-gray-900">${order.tax || '0'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Total</dt>
                                            <dd className="text-sm text-gray-900">${order.total || '0'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                                            <dd className="text-sm text-gray-900">{order.paymentMethod || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Payment Status</dt>
                                            <dd className="text-sm text-gray-900">{order.paymentStatus || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Payment Intent ID</dt>
                                            <dd className="text-sm text-gray-900 truncate">{order.paymentIntentId || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Billing Type</dt>
                                            <dd className="text-sm text-gray-900">{order.billing || 'N/A'}</dd>
                                          </dl>
                                        </div>
                                        
                                        {order.address && (
                                          <div className="col-span-1 sm:col-span-2">
                                            <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                                            <address className="text-sm text-gray-600 not-italic">
                                              {order.address.street || ''}<br />
                                              {order.address.city || ''}, {order.address.state || ''} {order.address.zip || ''}<br />
                                            </address>
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </Fragment>
                            ))}                            {orders.length === 0 && (
                              <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                  No orders found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Mailing List Collection */}
                  {activeCollection === 'mailing-list' && (
                    <div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Subscription Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vehicle
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {mailingList.map((item) => (
                              <Fragment key={item.id}>
                                <tr 
                                  className={`hover:bg-gray-50 cursor-pointer ${expandedItem === item.id ? 'bg-gray-50' : ''}`}
                                  onClick={() => handleItemClick(item.id)}
                                >
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                      {(item.firstName || item['first-name'] || '') + ' ' + (item.lastName || item['last-name'] || '')}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{item.email || item['email-address'] || 'N/A'}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{formatDate(item.subscriptionDate || item.timestamp)}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                      {(item.vehicleMake || item['vehicle-make'] || '') + ' ' + (item.vehicleModel || item['vehicle-model'] || '')}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete('mailing-list', item.id);
                                      }}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                                {expandedItem === item.id && (
                                  <tr>
                                    <td colSpan="5" className="px-6 py-4 bg-gray-50">
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                          <h4 className="font-medium text-gray-900 mb-2">Subscriber Details</h4>
                                          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                            <dt className="text-sm font-medium text-gray-500">First Name</dt>
                                            <dd className="text-sm text-gray-900">{item.firstName || item['first-name'] || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                                            <dd className="text-sm text-gray-900">{item.lastName || item['last-name'] || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Email</dt>
                                            <dd className="text-sm text-gray-900">{item.email || item['email-address'] || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                            <dd className="text-sm text-gray-900">{item.phone || item['phone-number'] || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Subscription Date</dt>
                                            <dd className="text-sm text-gray-900">{formatDate(item.subscriptionDate || item.timestamp)}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Referral Source</dt>
                                            <dd className="text-sm text-gray-900">{item.referralSource || 'N/A'}</dd>
                                          </dl>
                                        </div>
                                        
                                        <div>
                                          <h4 className="font-medium text-gray-900 mb-2">Vehicle Information</h4>
                                          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                                            <dt className="text-sm font-medium text-gray-500">Vehicle Make</dt>
                                            <dd className="text-sm text-gray-900">{item.vehicleMake || item['vehicle-make'] || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Vehicle Model</dt>
                                            <dd className="text-sm text-gray-900">{item.vehicleModel || item['vehicle-model'] || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Interested Plan</dt>
                                            <dd className="text-sm text-gray-900">{item.interestedPlan || item.plan || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">Address</dt>
                                            <dd className="text-sm text-gray-900">{item.address || item.street || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">City</dt>
                                            <dd className="text-sm text-gray-900">{item.city || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">State</dt>
                                            <dd className="text-sm text-gray-900">{item.state || 'N/A'}</dd>
                                            
                                            <dt className="text-sm font-medium text-gray-500">ZIP</dt>
                                            <dd className="text-sm text-gray-900">{item.zip || 'N/A'}</dd>
                                          </dl>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </Fragment>
                            ))}
                            {mailingList.length === 0 && (
                              <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                  No subscribers found
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