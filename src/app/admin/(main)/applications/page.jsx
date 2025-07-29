'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { db } from '../../../firebaseConfig.js';
import { collection, getDocs } from 'firebase/firestore';

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function InternshipApplicationsDashboard() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
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
      const applicationsSnapshot = await getDocs(collection(db, 'internshipApplications'));
      const applicationsData = applicationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApplications(applicationsData);
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

  const handleSelectApplication = (app) => {
    setSelectedApplication(app);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-700">Loading applications...</p>
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
            Internship Applications Dashboard
          </motion.h1>
        </div>

        <div className="mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Applications List Sidebar */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-1"
            >
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Applications List</h2>
                  <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {applications.map(app => (
                      <div
                        key={app.id}
                        onClick={() => handleSelectApplication(app)}
                        className={`cursor-pointer p-3 rounded-lg hover:bg-gray-50 ${
                          selectedApplication?.id === app.id ? 'bg-gray-100' : ''
                        }`}
                      >
                        <h3 className="text-md font-medium text-gray-900">
                          {app.basics?.school || 'Unknown Applicant'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Location: {app.basics?.location || 'N/A'}
                        </p>
                      </div>
                    ))}
                    {applications.length === 0 && (
                      <p className="text-gray-500">No applications found.</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Content: Application Details */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-3"
            >
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Application Details</h2>
                  {selectedApplication ? (
                    <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                      {/* Basics */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">Basics</h3>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                          <p className="font-medium text-gray-600"><span className="font-medium text-gray-400">Location & Timezone:</span> {selectedApplication.basics?.location}</p>
                          <p className="font-medium text-gray-600"><span className="font-medium text-gray-400">School/Major & Grad Year:</span> {selectedApplication.basics?.school}</p>
                          <p className="font-medium text-gray-600"><span className="font-medium text-gray-400">Weekly Availability & Start Date:</span> {selectedApplication.basics?.availability}</p>
                          <p className="font-medium text-gray-600"><span className="font-medium text-gray-400">Internship Length:</span> {selectedApplication.basics?.length}</p>
                          <p className="font-medium text-gray-600"><span className="font-medium text-gray-400">Looking For:</span> {selectedApplication.basics?.lookingFor}</p>
                        </div>
                      </div>

                      {/* Skills Snapshot */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">Skills Snapshot</h3>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                          {Object.entries(selectedApplication.skills || {}).map(([key, value]) => (
                            <p  className="font-medium text-gray-600" key={key}>
                              <span className="font-medium text-gray-400 capitalize">{key}:</span> {value.rating}/5, Tools: {value.tools}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* What Excites You */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">What Excites You</h3>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedApplication.excites?.map((item, index) => (
                              <li className="font-medium text-gray-600" key={index}>{item}</li>
                            ))}
                          </ul>
                          {selectedApplication.excites?.length === 0 && <p>None selected.</p>}
                        </div>
                      </div>

                      {/* Show and Tell */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">Show and Tell</h3>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                          <p className="font-medium text-gray-600"><span className="font-medium text-gray-400">Project 1:</span> {selectedApplication.showAndTell?.project1}</p>
                          <p className="font-medium text-gray-600"><span className="font-medium text-gray-400">Project 2:</span> {selectedApplication.showAndTell?.project2}</p>
                          <p className="font-medium text-gray-600"><span className="font-medium text-gray-400">Project 3:</span> {selectedApplication.showAndTell?.project3}</p>
                          <p className="font-medium text-gray-600"><span className="font-medium text-gray-400">Tools/Space:</span> {selectedApplication.showAndTell?.tools}</p>
                        </div>
                      </div>

                      {/* Logistics */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">Logistics</h3>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                          <p className="font-medium text-gray-600"><span className="font-medium text-gray-400">Time Constraints:</span> {selectedApplication.logistics?.constraints}</p>
                          <p className="font-medium text-gray-600"><span className="font-medium text-gray-400">NDA Comfort:</span> {selectedApplication.logistics?.nda}</p>
                          <p className="font-medium text-gray-600"><span className="font-medium text-gray-400">Hardware Limitations:</span> {selectedApplication.logistics?.limitations}</p>
                          <p className="font-medium text-gray-600"><span className="font-medium text-gray-400">Reference:</span> {selectedApplication.logistics?.reference}</p>
                        </div>
                      </div>

                      {/* Your Why */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">Your Why</h3>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium text-gray-600">{selectedApplication.why}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Select an application from the list to view details.</p>
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