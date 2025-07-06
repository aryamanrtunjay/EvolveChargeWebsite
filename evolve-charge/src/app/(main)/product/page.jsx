'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Script from 'next/script';
import Logo from "../../../images/Logo.png"
import Image from 'next/image';

// Video file mapping with full URLs
const videos = {
  1: { to: 'https://demo.ampereonenergy.com/ToCharger.mp4', from: 'https://demo.ampereonenergy.com/FromCharger.mp4' },
  2: { to: 'https://demo.ampereonenergy.com/ToHolder.mp4', from: 'https://demo.ampereonenergy.com/FromHolder.mp4' },
  3: { to: 'https://demo.ampereonenergy.com/ToHook.mp4', from: 'https://demo.ampereonenergy.com/FromHook.mp4' },
  demo: { to: 'https://demo.ampereonenergy.com/productPageDemo.mp4', from: 'https://demo.ampereonenergy.com/reverseDemo.mp4' },
};

// Interactive points configuration
const interactivePoints = {
  1: { x: '56%', y: '35%', label: 'Charging Module' },
  2: { x: '90%', y: '40%', label: 'Wire Holder' },
  3: { x: '6%', y: '50%', label: 'Hook Assembly' },
};

// Professional descriptions for each component
const descriptions = {
  1: {
    title: 'Automatic Charging Module',
    content: 'The core of the Ampereon system. This intelligent module travels along guide wires to connect with your vehicle automatically. Featuring advanced positioning technology and optimized charging algorithms, it ensures reliable, efficient charging every time.'
  },
  2: {
    title: 'Wire Management System',
    content: 'Engineered for reliability and ease of installation. The wire holder maintains optimal tension and includes a secure locking mechanism. Mounts easily to any garage wall with the included hardware kit.'
  },
  3: {
    title: 'Anchor Point',
    content: 'The secure mounting point that completes the wire system. Designed for maximum stability and longevity, this component requires only two mounting screws and provides the foundation for reliable automated charging.'
  },
};

export default function VideoViewer() {
  const [currentState, setCurrentState] = useState('loading'); // 'loading', 'start', 'playingTo', 'atPOI', 'playingFrom', 'playingDemo', 'playingDemoReverse'
  const [currentPOI, setCurrentPOI] = useState(null);
  const [loadedVideos, setLoadedVideos] = useState({});
  const [loadedCount, setLoadedCount] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [error, setError] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [showPoster, setShowPoster] = useState(false);
  const [fakeProgress, setFakeProgress] = useState(0);
  const [loadingDuration, setLoadingDuration] = useState(null);
  const [loadingStartTime, setLoadingStartTime] = useState(null);
  const videoRef = useRef(null);

  // List of all video keys to check loading status
  const allVideos = [
    ...Object.keys(videos).filter(key => key !== 'demo').map(key => `to-${key}`),
    ...Object.keys(videos).filter(key => key !== 'demo').map(key => `from-${key}`),
    'to-demo',
    'from-demo',
  ];

  // Professional loading messages
  const loadingMessages = [
    { progress: 0, message: "Loading Interactive Experience..." },
    { progress: 50, message: "Preparing Components..." },
    { progress: 90, message: "Ready" }
  ];

  const totalVideos = allVideos.length;
  const isLoaded = allVideos.every(key => loadedVideos[key]);

  // Initialize loading on component mount
  useEffect(() => {
    if (currentState === 'loading' && loadingDuration === null) {
      const duration = 2500 + Math.random() * 1500;
      setLoadingDuration(duration);
      setLoadingStartTime(Date.now());
    }
  }, [currentState, loadingDuration]);

  // Progress animation
  useEffect(() => {
    if (currentState === 'loading' && loadingStartTime && loadingDuration) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - loadingStartTime;
        const progress = Math.min((elapsed / loadingDuration) * 100, 100);
        setFakeProgress(progress);

        const currentMsg = loadingMessages
          .slice()
          .reverse()
          .find(msg => progress >= msg.progress) || loadingMessages[0];
        
        if (progress >= 100 && isLoaded) {
          setCurrentState('start');
          setShowPoster(true);
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [currentState, loadingStartTime, loadingDuration, isLoaded]);

  // Preload videos with Promise.all
  useEffect(() => {
    const loadVideos = async () => {
      const promises = allVideos.map(async (key) => {
        const [type, num] = key.split('-');
        const videoUrl = num === 'demo' ? videos.demo[type === 'to' ? 'to' : 'from'] : videos[num][type === 'to' ? 'to' : 'from'];
        try {
          const response = await fetch(videoUrl, { 
            method: 'GET', 
            headers: { Range: 'bytes=0-1' },
            mode: 'cors'
          });
          if (!response.ok) throw new Error(`Video not found: ${videoUrl} (Status: ${response.status})`);

          return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.src = videoUrl;
            video.onloadeddata = () => {
              resolve(key);
            };
            video.onerror = () => {
              resolve(key);
            };
            document.body.appendChild(video);
            setTimeout(() => document.body.removeChild(video), 0);
          });
        } catch (err) {
          return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.src = videoUrl;
            video.onloadeddata = () => {
              resolve(key);
            };
            video.onerror = () => {
              resolve(key);
            };
            document.body.appendChild(video);
            setTimeout(() => document.body.removeChild(video), 0);
          });
        }
      });

      const results = await Promise.all(promises);
      results.forEach(key => handleVideoLoaded(key));
    };

    loadVideos().catch(err => {
      setError('Unable to load interactive content. Please refresh to try again.');
    });
  }, []);

  // Handle video preload completion
  const handleVideoLoaded = (key) => {
    setLoadedVideos(prev => {
      if (!prev[key]) {
        setLoadedCount(prevCount => Math.min(prevCount + 1, totalVideos));
        return { ...prev, [key]: true };
      }
      return prev;
    });
  };

  // Set video src when currentVideo changes
  useEffect(() => {
    if (videoRef.current && currentVideo) {
      videoRef.current.src = currentVideo;
      videoRef.current.load();
    }
  }, [currentVideo]);

  // Control video playback based on currentState
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (['playingTo', 'playingFrom', 'playingDemo', 'playingDemoReverse'].includes(currentState)) {
        setShowPoster(false);
        video.play().catch(err => console.error('Autoplay failed:', err));
      } else if (currentState === 'atPOI') {
        setShowPoster(false);
        video.pause();
        const setToLastFrame = () => {
          if (video.duration && video.duration > 0) {
            video.currentTime = video.duration - 0.01;
          }
        };
        if (video.readyState >= 2) {
          setToLastFrame();
        } else {
          const handleLoadedData = () => {
            setToLastFrame();
            video.removeEventListener('loadeddata', handleLoadedData);
          };
          video.addEventListener('loadeddata', handleLoadedData);
          return () => video.removeEventListener('loadeddata', handleLoadedData);
        }
      } else if (currentState === 'start') {
        setShowPoster(true);
        video.pause();
      }
    }
  }, [currentState, currentVideo]);

  // Handle video ending
  const handleVideoEnded = () => {
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = videoRef.current.duration - 0.01;
      videoRef.current.pause();
    }
    
    setTimeout(() => {
      if (currentState === 'playingTo') {
        setCurrentState('atPOI');
        setShowDescription(true);
      } else if (currentState === 'playingFrom') {
        setShowPoster(true);
        setCurrentState('start');
        setShowDescription(false);
      } else if (currentState === 'playingDemo') {
        setCurrentVideo(videos.demo.from);
        setCurrentState('playingDemoReverse');
        setShowDescription(false);
      } else if (currentState === 'playingDemoReverse') {
        setShowPoster(true);
        setCurrentState('start');
        setShowDescription(false);
      }
    }, 100);
  };

  // Handle interactive point clicks
  const handlePointClick = (poi) => {
    setCurrentPOI(poi);
    setCurrentVideo(videos[poi].to);
    setCurrentState('playingTo');
    setShowDescription(false);
    setShowPoster(false);
  };

  // Handle back button click
  const handleBackClick = () => {
    setCurrentVideo(videos[currentPOI].from);
    setCurrentState('playingFrom');
    setShowDescription(false);
  };

  // Handle demo button click
  const handleDemoClick = () => {
    setCurrentVideo(videos.demo.to);
    setCurrentState('playingDemo');
    setShowDescription(false);
    setShowPoster(false);
  };

  // Close description panel
  const handleCloseDescription = () => {
    setShowDescription(false);
  };

  // Professional loading screen
  if (currentState === 'loading') {
    const currentMsg = loadingMessages
      .slice()
      .reverse()
      .find(msg => fakeProgress >= msg.progress) || loadingMessages[0];

    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0A0A] text-white overflow-hidden">
        <motion.div
          className="relative w-full max-w-md p-8 bg-[#1A1A1A]/90 backdrop-blur-lg border border-[#D4AF37]/20 rounded-2xl shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Image 
              src={Logo}
              alt="Ampereon Logo" 
              className="h-8 w-auto mx-auto"
            />
            <p className="text-gray-400 text-sm">Interactive Product Tour</p>
          </motion.div>

          <motion.div
            className="text-center mb-6"
            key={currentMsg.message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-300 text-sm">{currentMsg.message}</p>
          </motion.div>

          <motion.div
            className="relative w-full h-1 bg-[#2A2A2A] rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-full"
              style={{ width: `${fakeProgress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-red-400 text-sm text-center">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
            },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
            a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
            twq('config','q1blv');
          `,
        }}
      />
      {/* Main video player */}
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${showPoster ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onEnded={handleVideoEnded}
        controls={false}
        playsInline
      />

      {/* Product Poster */}
      <div className={`absolute inset-0 ${showPoster ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 pointer-events-none`}>
        <img 
          src="https://demo.ampereonenergy.com/productPoster.png" 
          alt="Ampereon"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Failed to load poster image');
            setShowPoster(false);
          }}
        />
      </div>

      {/* Interactive Points Overlay */}
      <AnimatePresence>
        {currentState === 'start' && (
          <div className="absolute inset-0 pointer-events-none">
            {Object.entries(interactivePoints).map(([poi, point]) => (
              <motion.div
                key={poi}
                className="absolute pointer-events-auto"
                style={{ left: point.x, top: point.y, transform: 'translate(-50%, -50%)' }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.4, delay: parseInt(poi) * 0.1 }}
              >
                <motion.button
                  onClick={() => handlePointClick(parseInt(poi))}
                  className="relative group"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#B8860B] rounded-full border-2 border-white/20 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                    {poi}
                  </div>
                  <motion.div
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-[#1A1A1A]/90 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-[#D4AF37]/20"
                    initial={{ y: 5 }}
                    whileHover={{ y: 0 }}
                  >
                    {point.label}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1A1A1A]/90"></div>
                  </motion.div>
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* View Demo Button */}
      <AnimatePresence>
        {currentState === 'start' && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDemoClick}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View Full Demo
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back Button for POI */}
      <AnimatePresence>
        {currentState === 'atPOI' && !showDescription && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBackClick}
              className="bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#D4AF37]/30 rounded-lg px-6 py-3 shadow-lg hover:bg-[#1A1A1A]/90 transition-all text-white font-medium"
            >
              ← Return to Overview
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Description Panel */}
      <AnimatePresence>
        {showDescription && currentPOI && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-full max-w-lg bg-[#1A1A1A]/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-xl p-8 text-white"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  {descriptions[currentPOI].title}
                </h2>
                <button
                  onClick={handleCloseDescription}
                  className="text-gray-400 hover:text-white transition-colors duration-200 text-xl p-1"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-8 text-base">
                {descriptions[currentPOI].content}
              </p>
              
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBackClick}
                  className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
                >
                  Return to Overview
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCloseDescription}
                  className="bg-[#2A2A2A]/80 border border-[#D4AF37]/30 text-gray-300 font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:bg-[#2A2A2A]"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}