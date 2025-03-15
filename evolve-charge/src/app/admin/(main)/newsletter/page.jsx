'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { db } from '../../../firebaseConfig.js';
import { collection, getDocs } from 'firebase/firestore';

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

export default function AdminNewsletter() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [mailingList, setMailingList] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notification, setNotification] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      router.push('/admin');
      return;
    }

    fetchMailingList();
  }, [router]);

  const fetchMailingList = async () => {
    try {
      const mailingListSnapshot = await getDocs(collection(db, 'mailing-list'));
      const mailingListData = mailingListSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMailingList(mailingListData);
    } catch (error) {
      console.error("Error fetching mailing list:", error);
      showNotification('Error loading mailing list data', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showNotification('Please upload a PDF file', 'error');
        e.target.value = null;
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showNotification('File size exceeds 10MB limit', 'error');
        e.target.value = null;
        return;
      }

      setPdfFile(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim()) {
      showNotification('Please enter a subject for your newsletter', 'error');
      return;
    }

    if (!content.trim()) {
      showNotification('Please enter content for your newsletter', 'error');
      return;
    }

    const confirm = window.confirm(`Are you sure you want to send this newsletter to ${mailingList.length} recipients?`);
    if (!confirm) return;

    setIsSending(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('content', content);
      
      if (pdfFile) {
        formData.append('attachment', pdfFile);
      }

      const response = await fetch('/api/send-newsletter-email', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send newsletter');
      }

      const data = await response.json();
      
      setSubject('');
      setContent('');
      setPdfFile(null);
      setFileName('');
      
      showNotification(`Newsletter sent successfully to ${data.successCount} recipients! ${data.failureCount ? `Failed to send to ${data.failureCount} recipients.` : ''}`);
    } catch (error) {
      console.error("Error sending newsletter:", error);
      showNotification(`Error sending newsletter: ${error.message}`, 'error');
    } finally {
      setIsSending(false);
      setProgress(100);
      // Reset progress after 2 seconds
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

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
            Newsletter
          </motion.h1>
        </div>
        
        <div className="mx-auto px-4 sm:px-6 md:px-8 mt-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-white shadow rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Mailing List Info */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Mailing List</h2>
                    <div className="mb-4">
                      <div className="flex justify-between py-1">
                        <span className="text-gray-600">Total Subscribers:</span>
                        <span className="font-medium text-gray-700">{mailingList.length}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-md font-medium text-gray-700 mb-2">Newsletter Tips</h3>
                    <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                      <li>Keep subject lines short and engaging</li>
                      <li>Use clear, concise language</li>
                      <li>Include a clear call-to-action</li>
                      <li>Test your email before sending to all subscribers</li>
                      <li>PDF attachments should be under 10MB</li>
                      <li>Make sure image alt tags are descriptive</li>
                    </ul>
                  </div>
                </div>
                
                {/* Newsletter Form */}
                <div className="lg:col-span-2">
                  {isSending ? (
                    <div className="flex flex-col items-center justify-center p-8">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div 
                          className="bg-teal-600 h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-gray-700">Sending newsletter to {mailingList.length} recipients...</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-end mb-4">
                        <button
                          type="button"
                          onClick={togglePreview}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                          {previewMode ? 'Edit Newsletter' : 'Preview Newsletter'}
                        </button>
                      </div>

                      {previewMode ? (
                        <div className="border border-gray-200 rounded-lg p-6">
                          <h2 className="text-xl font-bold mb-4 text-gray-700">{subject || 'Newsletter Subject'}</h2>
                          <div className="prose max-w-none text-gray-700">
                            {content ? (
                              <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
                            ) : (
                              <p className="text-gray-700 italic">No content added yet.</p>
                            )}
                          </div>
                          {fileName && (
                            <div className="mt-4 flex items-center text-sm text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              Attachment: {fileName}
                            </div>
                          )}
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit}>
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                              <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                placeholder="Enter newsletter subject"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                              <textarea
                                id="content"
                                name="content"
                                rows={12}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 text-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                                placeholder="Enter newsletter content. Plain text is supported. Use line breaks for paragraphs."
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">PDF Attachment (Optional)</label>
                              <div className="mt-1 flex items-center">
                                <input
                                  type="file"
                                  id="attachment"
                                  name="attachment"
                                  accept=".pdf"
                                  onChange={handleFileChange}
                                  className="sr-only"
                                />
                                <label
                                  htmlFor="attachment"
                                  className="relative cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
                                >
                                  <span>Upload PDF</span>
                                </label>
                                {fileName && (
                                  <span className="ml-3 text-sm text-gray-500">{fileName}</span>
                                )}
                              </div>
                              <p className="mt-1 text-sm text-gray-500">PDF file only, max 10MB</p>
                            </div>
                            
                            <div className="flex justify-end pt-4">
                              <button
                                type="submit"
                                disabled={mailingList.length === 0}
                                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${
                                  mailingList.length === 0 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-teal-600 hover:bg-teal-700'
                                }`}
                              >
                                Send Newsletter
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}