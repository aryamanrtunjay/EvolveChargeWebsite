'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { db } from '../../firebaseConfig.js';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminLayout({ children }) {
  const [adminEmail, setAdminEmail] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isFullAdmin, setIsFullAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const email = sessionStorage.getItem('adminEmail');
    const adminId = sessionStorage.getItem('adminId');

    if (!isLoggedIn || !adminId) {
      router.push('/admin');
      return;
    }

    setAdminEmail(email || '');

    // Fetch admin role from Firestore 'admins' collection
    const fetchAdminRole = async () => {
      try {
        const adminDocRef = doc(db, 'admins', adminId);
        const adminDoc = await getDoc(adminDocRef);
        if (adminDoc.exists()) {
          const role = adminDoc.data().role;
          setIsFullAdmin(role === 'full-admin');
        } else {
          console.error('Admin document not found for ID:', adminId);
          setIsFullAdmin(false);
        }
      } catch (error) {
        console.error('Error fetching admin role:', error);
        setIsFullAdmin(false);
      }
    };

    fetchAdminRole();
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminEmail');
    sessionStorage.removeItem('adminId');
    router.push('/admin');
  };

  const toggleToolsDropdown = () => {
    setIsToolsDropdownOpen(!isToolsDropdownOpen);
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin/home',
      icon: (
        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Database',
      href: '/admin/database',
      icon: (
        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
    },
    {
      name: 'Newsletter',
      href: '/admin/newsletter',
      icon: (
        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: (
        <svg
          className="mr-3 h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h4v10H3V10zM8 6h4v14H8V6zM13 12h4v8h-4v-8z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 6l3 3-3 3-3-3 3-3z"
          />
        </svg>
      ),
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: (
        <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const adminToolsItems = [
    {
      name: 'Marketing',
      href: '/admin/marketing',
      icon: (
        <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v9a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0l-5.5-5.5" />
        </svg>
      ),
    },
    {
      name: 'Engineering',
      href: '/admin/engineering',
      icon: (
        <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      name: 'Prototype',
      href: '/admin/prototype',
      icon: (
        <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white shadow-sm py-2 px-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-medium text-gray-900">EVolve Admin</h1>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-teal-700 transition duration-300 lg:translate-x-0 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-screen flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-center h-16 bg-teal-800">
              <h2 className="text-xl font-bold text-white">EVolve Admin</h2>
            </div>
            <div className="py-4 px-3">
              <div className="mb-8 px-4 py-3 bg-teal-800 bg-opacity-50 rounded-lg">
                <p className="text-sm text-teal-200">Logged in as</p>
                <p className="text-sm font-semibold text-white truncate">{adminEmail}</p>
              </div>
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} onClick={() => { setIsMenuOpen(false); setIsToolsDropdownOpen(false); }}>
                      <div
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                          pathname === item.href
                            ? 'bg-teal-800 text-white'
                            : 'text-teal-100 hover:bg-teal-600 hover:text-white'
                        }`}
                        aria-current={pathname === item.href ? 'page' : undefined}
                      >
                        {item.icon}
                        {item.name}
                      </div>
                    </Link>
                  </li>
                ))}
                {isFullAdmin && (
                  <li>
                    <button
                      onClick={() => { toggleToolsDropdown(); setIsMenuOpen(true); }}
                      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-md text-teal-100 hover:bg-teal-600 hover:text-white ${
                        pathname.startsWith('/admin/marketing') || pathname.startsWith('/admin/engineering')
                          ? 'bg-teal-800 text-white'
                          : ''
                      }`}
                      aria-expanded={isToolsDropdownOpen}
                      aria-controls="admin-tools-dropdown"
                    >
                      <svg className="mr-3 h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2m-5.66 0a2 2 0 005.66 0m0 0c.413-1.165 1.524-2 2.83-2" />
                      </svg>
                      Admin Tools
                    </button>
                    {isToolsDropdownOpen && (
                      <ul id="admin-tools-dropdown" className="pl-8 space-y-1 mt-1" role="menu">
                        {adminToolsItems.map((tool) => (
                          <li key={tool.name} role="menuitem">
                            <Link href={tool.href} onClick={() => { setIsMenuOpen(false); setIsToolsDropdownOpen(false); }}>
                              <div
                                className={`flex items-center px-4 py-2 text-sm rounded-md ${
                                  pathname === tool.href
                                    ? 'bg-teal-800 text-white'
                                    : 'text-teal-100 hover:bg-teal-600 hover:text-white'
                                }`}
                                aria-current={pathname === tool.href ? 'page' : undefined}
                              >
                                {tool.icon}
                                {tool.name}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm font-medium rounded-md text-teal-100 hover:bg-teal-600 hover:text-white"
            >
              <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Dark overlay for mobile */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-20 bg-black lg:hidden"
          onClick={() => { setIsMenuOpen(false); setIsToolsDropdownOpen(false); }}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="pt-10 lg:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}