'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Script from 'next/script';

// Video file mapping with full URLs
const videos = {
  1: { to: 'https://demo.ampereonenergy.com/ToCharger.mp4', from: 'https://demo.ampereonenergy.com/FromCharger.mp4' },
  2: { to: 'https://demo.ampereonenergy.com/ToHolder.mp4', from: 'https://demo.ampereonenergy.com/FromHolder.mp4' },
  3: { to: 'https://demo.ampereonenergy.com/ToHook.mp4', from: 'https://demo.ampereonenergy.com/FromHook.mp4' },
  demo: { to: 'https://demo.ampereonenergy.com/productPageDemo.mp4', from: 'https://demo.ampereonenergy.com/reverseDemo.mp4' },
};

// Interactive points configuration
const interactivePoints = {
  1: { x: '56%', y: '35%', label: 'Charger' },
  2: { x: '90%', y: '40%', label: 'Holder' },
  3: { x: '6%', y: '50%', label: 'Hook' },
};

// Descriptions for each POI
const descriptions = {
  1: {
    title: 'The Charger',
    content: 'The heart and soul of Ampereon. A compact, efficient, lightweight, and stylish module that is hooked safely onto the guide wires of the Ampereon system and traverses to any car inside your garage automatically at the optimal time to charge.'
  },
  2: {
    title: 'Wire Holder',
    content: 'The component that contains the wire securely wrapped around it. It is designed to keep the wire as tight as possible to prevent the charger from sagging and has simple controls, just a knob to tighten the wires and a push-to-lock mechanism to make sure that once tightened, the wires never become loose. Just 4 easy screws to mount it onto your garage, all provided inside the package.'
  },
  3: {
    title: 'Hook',
    content: 'This hook holds the other end of the wires and is mounted securely with just 2 screws on the other side of your garage. All you need to do is hook the wires from the holder here and the "hard" part of the setup is done!'
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

  // Minimalistic loading messages
  const loadingMessages = [
    { progress: 0, message: "Preparing Your Virtual Garage..." },
    { progress: 50, message: "Optimizing Experience..." },
    { progress: 90, message: "Ready to Launch..." }
  ];

  const totalVideos = allVideos.length;
  const isLoaded = allVideos.every(key => loadedVideos[key]);

  // Initialize fake loading on component mount
  useEffect(() => {
    if (currentState === 'loading' && loadingDuration === null) {
      const duration = 3000 + Math.random() * 2000;
      setLoadingDuration(duration);
      setLoadingStartTime(Date.now());
    }
  }, [currentState, loadingDuration]);

  // Fake progress animation
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
      setError('Failed to preload some videos. Please try again later.');
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

  // Minimalistic loading screen
  if (currentState === 'loading') {
    const currentMsg = loadingMessages
      .slice()
      .reverse()
      .find(msg => fakeProgress >= msg.progress) || loadingMessages[0];

    return (
      <div className="flex items-center justify-center h-screen bg-white text-[#111111] overflow-hidden">
        <motion.div
          className="relative w-full max-w-md p-8 bg-white/70 backdrop-blur-md border border-black/10 rounded-2xl shadow-lg"
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
            <h1 className="text-3xl font-bold text-[#C9A86A] mb-2 tracking-tight">AMPEREON</h1>
            <p className="text-[#6F6F6F] text-lg leading-relaxed">Virtual Garage Experience</p>
          </motion.div>

          <motion.div
            className="text-center mb-6"
            key={currentMsg.message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[#6F6F6F] text-base">{currentMsg.message}</p>
          </motion.div>

          <motion.div
            className="relative w-full h-1 bg-[#F5F6F7] rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <motion.div
              className="absolute top-0 left-0 h-full bg-[#C9A86A] rounded-full"
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
                <p className="text-red-500 text-sm text-center">{error}</p>
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
                transition={{ duration: 0.5, delay: parseInt(poi) * 0.1 }}
              >
                <motion.button
                  onClick={() => handlePointClick(parseInt(poi))}
                  className="relative group"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-[#C9A86A]/30 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.2, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ width: '50px', height: '50px', left: '-10px', top: '-10px' }}
                  />
                  <div className="w-6 h-6 bg-[#C9A86A] rounded-full border border-white/20 flex items-center justify-center text-[#111111] font-medium text-xs">
                    {poi}
                  </div>
                  <motion.div
                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-[#111111]/80 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    {point.label}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#111111]/80"></div>
                  </motion.div>
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Play Demo Button */}
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
              whileHover={{ scale: 1.05, backgroundColor: '#D1B47A' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDemoClick}
              className="px-6 py-3 rounded-full bg-[#C9A86A] text-[#111111] font-medium shadow-lg hover:shadow-xl transition-all"
            >
              Play Demo
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackClick}
              className="bg-white/70 backdrop-blur-md border border-black/10 rounded-full px-6 py-3 shadow-lg hover:bg-white/80 transition-all text-[#111111] font-medium"
            >
              ← Back to Overview
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Description Panel */}
      <AnimatePresence>
        {showDescription && currentPOI && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-full max-w-lg bg-white/70 backdrop-blur-md border border-black/10 rounded-2xl shadow-lg p-6 text-[#111111]"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-[#111111] tracking-wide">
                  {descriptions[currentPOI].title}
                </h2>
                <button
                  onClick={handleCloseDescription}
                  className="text-[#6F6F6F] hover:text-[#111111] transition-colors duration-200 text-xl"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-[#6F6F6F] leading-relaxed mb-6">
                {descriptions[currentPOI].content}
              </p>
              
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#D1B47A' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBackClick}
                  className="flex-1 bg-[#C9A86A] text-[#111111] font-medium py-3 px-6 rounded-full transition-all duration-200 shadow-lg"
                >
                  Return to Overview
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseDescription}
                  className="bg-white/10 border border-[#111111]/20 text-[#111111]/70 font-medium py-3 px-6 rounded-full transition-all duration-200"
                >
                  Stay Here
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}