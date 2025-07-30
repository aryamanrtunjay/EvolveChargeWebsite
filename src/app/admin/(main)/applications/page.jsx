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
      <div className="min-h-screen bg-white flex items-center justify-center">
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
                          {app.personal?.firstName || 'Unknown Applicant'} {app.personal?.lastName || ''}
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
                      {/* Personal Info */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">Personal Info</h3>
                        <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden">
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2 px-4 font-medium text-gray-600">Full Name</td>
                              <td className="py-2 px-4 text-gray-700">{selectedApplication.personal?.firstName || 'N/A'} {selectedApplication.personal?.lastName || 'N/A'}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 px-4 font-medium text-gray-600">Age</td>
                              <td className="py-2 px-4 text-gray-700">{selectedApplication.personal?.age || 'N/A'}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 px-4 font-medium text-gray-600">Email</td>
                              <td className="py-2 px-4 text-gray-700">{selectedApplication.personal?.email || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4 font-medium text-gray-600">Phone</td>
                              <td className="py-2 px-4 text-gray-700">{selectedApplication.personal?.phone || 'N/A'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Basics */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">Basics</h3>
                        <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden">
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2 px-4 font-medium text-gray-600">Current Location</td>
                              <td className="py-2 px-4 text-gray-700">{selectedApplication.basics?.location || 'N/A'}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 px-4 font-medium text-gray-600">School/Major & Grad Year</td>
                              <td className="py-2 px-4 text-gray-700">{selectedApplication.basics?.school || 'N/A'}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 px-4 font-medium text-gray-600">Weekly Availability & Start Date</td>
                              <td className="py-2 px-4 text-gray-700">{selectedApplication.basics?.availability || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4 font-medium text-gray-600">Internship Length</td>
                              <td className="py-2 px-4 text-gray-700">{selectedApplication.basics?.length || 'N/A'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Skills Snapshot */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">Skills Snapshot</h3>
                        <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden">
                          <thead>
                            <tr>
                              <th className="py-2 px-4 text-left font-medium text-gray-600">Area</th>
                              <th className="py-2 px-4 text-left font-medium text-gray-600">Rating</th>
                              <th className="py-2 px-4 text-left font-medium text-gray-600">Tools</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(selectedApplication.skills || {}).map(([key, value]) => (
                              <tr key={key} className="border-t">
                                <td className="py-2 px-4 capitalize text-gray-700">{key}</td>
                                <td className="py-2 px-4 text-gray-700">{value.rating || 'N/A'}/5</td>
                                <td className="py-2 px-4 text-gray-700">{value.tools || 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* What Excites You */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">What Excites You</h3>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            {selectedApplication.excites?.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                          {selectedApplication.excites?.length === 0 && <p className="text-gray-500">None selected.</p>}
                        </div>
                      </div>

                      {/* Show and Tell */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">Show and Tell</h3>
                        <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden">
                          <thead>
                            <tr>
                              <th className="py-2 px-4 text-left font-medium text-gray-600">Project</th>
                              <th className="py-2 px-4 text-left font-medium text-gray-600">Date</th>
                              <th className="py-2 px-4 text-left font-medium text-gray-600">Description</th>
                              <th className="py-2 px-4 text-left font-medium text-gray-600">Tools</th>
                            </tr>
                          </thead>
                          <tbody>
                            {['project1', 'project2', 'project3'].map((projectKey, index) => (
                              <tr key={projectKey} className="border-t">
                                <td className="py-2 px-4 text-gray-700">Project {index + 1}</td>
                                <td className="py-2 px-4 text-gray-700">{selectedApplication.showAndTell?.[projectKey]?.date || 'N/A'}</td>
                                <td className="py-2 px-4 text-gray-700">{selectedApplication.showAndTell?.[projectKey]?.description || 'N/A'}</td>
                                <td className="py-2 px-4 text-gray-700">{selectedApplication.showAndTell?.[projectKey]?.tools || 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="mt-4 bg-gray-50 rounded-lg p-3">
                          <p><span className="font-medium text-gray-600">Personal Tools/Space:</span> {selectedApplication.showAndTell?.personalTools || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Logistics */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">Logistics</h3>
                        <table className="min-w-full bg-gray-50 rounded-lg overflow-hidden">
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2 px-4 font-medium text-gray-600">Time Constraints</td>
                              <td className="py-2 px-4 text-gray-700">{selectedApplication.logistics?.constraints || 'N/A'}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 px-4 font-medium text-gray-600">NDA Comfort</td>
                              <td className="py-2 px-4 text-gray-700">{selectedApplication.logistics?.nda || 'N/A'}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 px-4 font-medium text-gray-600">Hardware Limitations</td>
                              <td className="py-2 px-4 text-gray-700">{selectedApplication.logistics?.limitations || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4 font-medium text-gray-600">Reference</td>
                              <td className="py-2 px-4 text-gray-700">{selectedApplication.logistics?.reference || 'N/A'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Your Why */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">Your Why</h3>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-700">{selectedApplication.why || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Resume */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mb-2">Resume</h3>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p><span className="font-medium text-gray-600">Resume URL:</span> {selectedApplication.resumeUrl ? <a href={selectedApplication.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-teal-500 underline">View Resume</a> : 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-6">Select an application from the list to view details.</p>
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