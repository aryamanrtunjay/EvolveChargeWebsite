'use client';

// app/admin/settings/page.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { db } from '../../../firebaseConfig.js';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [admin, setAdmin] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [notification, setNotification] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const adminId = sessionStorage.getItem('adminId');
    const adminEmail = sessionStorage.getItem('adminEmail');
    
    if (!isLoggedIn || !adminId) {
      router.push('/admin');
      return;
    }

    // Set email from session
    setAdmin(prev => ({ ...prev, email: adminEmail || '' }));
    
    fetchAdminData(adminId);
  }, [router]);

  const fetchAdminData = async (adminId) => {
    try {
      const adminRef = doc(db, 'admins', adminId);
      const adminSnap = await getDoc(adminRef);
      
      if (adminSnap.exists()) {
        const adminData = adminSnap.data();
        setAdmin({
          firstName: adminData.firstName || '',
          lastName: adminData.lastName || '',
          email: adminData.email || '',
          role: adminData.role || 'Admin'
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      showNotification("Error loading profile data", "error");
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const adminId = sessionStorage.getItem('adminId');
      
      if (!adminId) {
        throw new Error("Admin ID not found in session");
      }
      
      // Update admin document in Firestore
      const adminRef = doc(db, 'admins', adminId);
      
      await updateDoc(adminRef, {
        firstName: admin.firstName,
        lastName: admin.lastName,
        // Not updating email as it's usually the primary identifier
      });
      
      showNotification("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification("Error updating profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (password.new !== password.confirm) {
      showNotification("New passwords don't match", "error");
      return;
    }
    
    if (password.new.length < 8) {
      showNotification("Password must be at least 8 characters", "error");
      return;
    }
    
    setSaving(true);
    
    try {
      const adminId = sessionStorage.getItem('adminId');
      
      if (!adminId) {
        throw new Error("Admin ID not found in session");
      }
      
      // First verify the current password
      const adminRef = doc(db, 'admins', adminId);
      const adminSnap = await getDoc(adminRef);
      
      if (!adminSnap.exists()) {
        throw new Error("Admin not found");
      }
      
      const adminData = adminSnap.data();
      
      // In a real app, you would use a secure password comparison
      // This is just for demonstration purposes - never store plain text passwords
      if (adminData.password !== password.current) {
        showNotification("Current password is incorrect", "error");
        setSaving(false);
        return;
      }
      
      // Update the password
      await updateDoc(adminRef, {
        password: password.new
      });
      
      // Reset password fields
      setPassword({
        current: '',
        new: '',
        confirm: ''
      });
      
      showNotification("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      showNotification("Error updating password", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-700">Loading profile...</p>
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
            Account Settings
          </motion.h1>
        </div>
        
        <div className="mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Profile Information */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update your account information
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        id="firstName"
                        value={admin.firstName}
                        onChange={(e) => setAdmin({...admin, firstName: e.target.value})}
                        className="mt-1 py-2 px-4 text-gray-700 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-md sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value={admin.lastName}
                        onChange={(e) => setAdmin({...admin, lastName: e.target.value})}
                        className="mt-1 py-2 px-4 text-gray-700 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-md sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="col-span-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={admin.email}
                        disabled
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Email address cannot be changed
                      </p>
                    </div>
                    
                    <div className="col-span-6">
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <input
                        type="text"
                        name="role"
                        id="role"
                        value={admin.role}
                        disabled
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Password Update */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Update Password</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Ensure your account is using a secure password
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handlePasswordUpdate}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="current-password"
                        id="current-password"
                        value={password.current}
                        onChange={(e) => setPassword({...password, current: e.target.value})}
                        required
                        className="mt-1 py-2 px-4 text-gray-700 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-md sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="new-password"
                        id="new-password"
                        value={password.new}
                        onChange={(e) => setPassword({...password, new: e.target.value})}
                        required
                        minLength={8}
                        className="mt-1 py-2 px-4 text-gray-700 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-md sm:text-sm border-gray-300 rounded-md"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        At least 8 characters
                      </p>
                    </div>

                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirm-password"
                        id="confirm-password"
                        value={password.confirm}
                        onChange={(e) => setPassword({...password, confirm: e.target.value})}
                        required
                        className="mt-1 py-2 px-4 text-gray-700 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-md sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      {saving ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
            
            {/* Security Settings
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white shadow rounded-lg overflow-hidden lg:col-span-2"
            >
              <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Security Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your security preferences
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="two-factor"
                        name="two-factor"
                        type="checkbox"
                        className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="two-factor" className="font-medium text-gray-700">Two-factor authentication</label>
                      <p className="text-gray-500">Enable two-factor authentication for enhanced security</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="notify-login"
                        name="notify-login"
                        type="checkbox"
                        defaultChecked
                        className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="notify-login" className="font-medium text-gray-700">Login notifications</label>
                      <p className="text-gray-500">Receive notifications for new login attempts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="session-timeout"
                        name="session-timeout"
                        type="checkbox"
                        defaultChecked
                        className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="session-timeout" className="font-medium text-gray-700">Automatic session timeout</label>
                      <p className="text-gray-500">Automatically log out after 30 minutes of inactivity</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Save Security Settings
                  </button>
                </div>
              </div>
            </motion.div> */}
          </div>
        </div>
      </div>
    </div>
  );
}