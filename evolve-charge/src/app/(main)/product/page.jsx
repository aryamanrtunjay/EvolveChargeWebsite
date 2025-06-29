'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import Script from 'next/script';

// Video file mapping with full URLs
const videos = {
  1: { to: 'https://demo.evolve-charge.com/ToCharger.mp4', from: 'https://demo.evolve-charge.com/FromCharger.mp4' },
  2: { to: 'https://demo.evolve-charge.com/ToHolder.mp4', from: 'https://demo.evolve-charge.com/FromHolder.mp4' },
  3: { to: 'https://demo.evolve-charge.com/ToHook.mp4', from: 'https://demo.evolve-charge.com/FromHook.mp4' },
  demo: { to: 'https://demo.evolve-charge.com/productPageDemo.mp4', from: 'https://demo.evolve-charge.com/reverseDemo.mp4' }, // Demo video with from
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
    content: 'The heart and soul of the EVolve Charger. A compact, efficient, lightweight, and stylish module that is hooked safely onto the guide wires of the EVolve system and traverses to any car inside your garage automatically at the optimal time to charge.'
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
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState('');
  const videoRef = useRef(null);


  // List of all video keys to check loading status
  const allVideos = [
    ...Object.keys(videos).filter(key => key !== 'demo').map(key => `to-${key}`),
    ...Object.keys(videos).filter(key => key !== 'demo').map(key => `from-${key}`),
    'to-demo',
    'from-demo',
  ];
  // Cool loading messages for different progress stages
  const loadingMessages = [
    { progress: 0, message: "Initializing Virtual Garage Environment...", detail: "Setting up 3D rendering engine" },
    { progress: 8, message: "Calibrating Interactive Systems...", detail: "Configuring touch points and animations" },
    { progress: 18, message: "Loading EVolve Charger Assets...", detail: "Importing high-resolution 3D models" },
    { progress: 28, message: "Optimizing Video Streams...", detail: "Preparing seamless transitions" },
    { progress: 40, message: "Building Interactive Hotspots...", detail: "Creating responsive UI elements" },
    { progress: 52, message: "Synchronizing Audio Systems...", detail: "Testing multimedia compatibility" },
    { progress: 65, message: "Applying Advanced Lighting...", detail: "Enhancing visual realism" },
    { progress: 75, message: "Finalizing User Experience...", detail: "Optimizing performance metrics" },
    { progress: 85, message: "Running Quality Assurance...", detail: "Validating interactive components" },
    { progress: 92, message: "Preparing Launch Sequence...", detail: "Warming up the garage doors" },
    { progress: 98, message: "Welcome to Your Virtual Garage!", detail: "Experience is ready" }
  ];

  const totalVideos = allVideos.length;
  const isLoaded = allVideos.every(key => loadedVideos[key]);

  // Initialize fake loading on component mount
  useEffect(() => {
    if (currentState === 'loading' && loadingDuration === null) {
      // Random duration between 3-5 seconds
      const duration = 3000 + Math.random() * 2000;
      setLoadingDuration(duration);
      setLoadingStartTime(Date.now());
      console.log(`Fake loading will take ${duration}ms`);
    }
  }, [currentState, loadingDuration]);

  // Fake progress animation
  useEffect(() => {
    if (currentState === 'loading' && loadingStartTime && loadingDuration) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - loadingStartTime;
        const progress = Math.min((elapsed / loadingDuration) * 100, 100);
        setFakeProgress(progress);

        // Update loading message based on progress
        const currentMsg = loadingMessages
          .slice()
          .reverse()
          .find(msg => progress >= msg.progress);
        
        if (currentMsg && currentMsg.message !== currentLoadingMessage) {
          setCurrentLoadingMessage(currentMsg.message);
        }

        // Complete loading when both fake progress is done AND videos are loaded
        if (progress >= 100 && isLoaded) {
          setCurrentState('start');
          setShowPoster(true);
          clearInterval(interval);
        }
      }, 50); // Update every 50ms for smooth animation

      return () => clearInterval(interval);
    }
  }, [currentState, loadingStartTime, loadingDuration, isLoaded, currentLoadingMessage, loadingMessages]);

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
          console.log(`GET request successful for ${videoUrl}, status: ${response.status}`);

          return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.src = videoUrl;
            video.onloadeddata = () => {
              console.log(`Loaded: ${videoUrl}`);
              resolve(key);
            };
            video.onerror = () => {
              console.error(`Failed to load: ${videoUrl}`);
              resolve(key);
            };
            document.body.appendChild(video);
            setTimeout(() => document.body.removeChild(video), 0);
          });
        } catch (err) {
          console.error(`Fetch error for ${videoUrl}:`, err);
          return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.src = videoUrl;
            video.onloadeddata = () => {
              console.log(`Fallback loaded: ${videoUrl}`);
              resolve(key);
            };
            video.onerror = () => {
              console.error(`Fallback failed for ${videoUrl}`);
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
      console.error('Error preloading virtual garage:', err);
      setError('Failed to preload some videos. Check console for details.');
    });
  }, []);

  // Handle video preload completion
  const handleVideoLoaded = (key) => {
    setLoadedVideos(prev => {
      if (!prev[key]) {
        setLoadedCount(prevCount => {
          const newCount = Math.min(prevCount + 1, totalVideos);
          console.log(`Loaded count updated to: ${newCount}/${totalVideos}`);
          return newCount;
        });
        return { ...prev, [key]: true };
      }
      return prev;
    });
  };

  // Set initial video when all videos are loaded (but don't exit loading yet)
  useEffect(() => {
    if (isLoaded && currentState === 'loading') {
      console.log('All videos loaded, waiting for fake progress to complete');
      // Don't change state here - let the fake progress timer handle it
    }
  }, [isLoaded, currentState]);

  // Set video src when currentVideo changes
  useEffect(() => {
    if (videoRef.current && currentVideo) {
      console.log('Setting video src to:', currentVideo);
      videoRef.current.src = currentVideo;
      videoRef.current.load();
    }
  }, [currentVideo]);

  // Control video playback based on currentState
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (currentState === 'playingTo' || currentState === 'playingFrom' || currentState === 'playingDemo' || currentState === 'playingDemoReverse') {
        console.log('Playing video for state:', currentState);
        setShowPoster(false); // Hide poster when playing video
        video.play().catch(err => console.error('Autoplay failed:', err));
      } else if (currentState === 'atPOI') {
        console.log('Pausing video for state:', currentState);
        setShowPoster(false); // Show video last frame, not poster
        video.pause();
        // Set to last frame to ensure it shows the end state
        const setToLastFrame = () => {
          if (video.duration && video.duration > 0) {
            console.log('Setting to last frame');
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
        console.log('Showing poster for start state');
        setShowPoster(true); // Show poster on start screen
        video.pause();
      }
    }
  }, [currentState, currentVideo]);

  // Handle video ending
  const handleVideoEnded = () => {
    console.log('Video ended, current state:', currentState);
    
    // Ensure we stay on the last frame
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = videoRef.current.duration - 0.01;
      videoRef.current.pause();
    }
    
    setTimeout(() => {
      if (currentState === 'playingTo') {
        setCurrentState('atPOI');
        setShowDescription(true);
      } else if (currentState === 'playingFrom') {
        // After "from" video ends, show poster and return to start
        setShowPoster(true);
        setCurrentState('start');
        setShowDescription(false);
      } else if (currentState === 'playingDemo') {
        // Automatically play the reverse demo video
        console.log('Demo "to" ended, playing reverse video');
        setCurrentVideo(videos.demo.from);
        setCurrentState('playingDemoReverse');
        setShowDescription(false);
      } else if (currentState === 'playingDemoReverse') {
        // After demo reverse ends, show poster and return to start
        console.log('Demo "from" ended, returning to start with poster');
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
    setShowPoster(false); // Hide poster when starting video
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
    setShowPoster(false); // Hide poster when starting demo
  };

  // Close description panel
  const handleCloseDescription = () => {
    setShowDescription(false);
  };

  // Enhanced loading screen with fake progress and cool messages
  if (currentState === 'loading') {
    const currentMsg = loadingMessages
      .slice()
      .reverse()
      .find(msg => fakeProgress >= msg.progress) || loadingMessages[0];

    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900 text-white overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-teal-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -150, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.2, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <motion.div
          className="relative w-full max-w-2xl p-10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Logo and Brand */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl"
              animate={{
                rotateY: [0, 180, 360],
                scale: [1, 1.15, 1],
                boxShadow: [
                  "0 10px 30px rgba(20, 184, 166, 0.3)",
                  "0 20px 60px rgba(34, 211, 238, 0.4)",
                  "0 10px 30px rgba(20, 184, 166, 0.3)"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-10 h-10 bg-white rounded-xl opacity-95" />
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              EVolve Charger
            </h1>
            <p className="text-white/70 text-xl">Virtual Garage Experience</p>
          </motion.div>

          {/* Main Loading Message */}
          <motion.div
            className="text-center mb-8"
            key={currentMsg.message}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-semibold mb-3 text-white">
              {currentMsg.message}
            </h2>
            <p className="text-teal-300 text-lg">
              {currentMsg.detail}
            </p>
          </motion.div>

          {/* Enhanced Progress Bar */}
          <motion.div
            className="relative mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {/* Progress percentage display */}
            <motion.div
              className="text-center mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-4xl font-bold text-transparent bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text">
                {Math.round(fakeProgress)}%
              </span>
            </motion.div>
          </motion.div>

          {/* Advanced loading animation */}
          <motion.div
            className="flex justify-center space-x-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full shadow-lg"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 1, 0.4],
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>

          {/* System status */}
          <motion.div
            className="text-center text-white/60 text-sm space-y-1"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex justify-center items-center space-x-2">
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span>System Status: Online</span>
            </div>
            <div className="flex justify-center items-center space-x-2">
              <motion.div
                className="w-2 h-2 bg-blue-400 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
              />
              <span>Connection: Secure</span>
            </div>
            <div className="flex justify-center items-center space-x-2">
              <motion.div
                className="w-2 h-2 bg-teal-400 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
              />
              <span>Ready for Launch</span>
            </div>
          </motion.div>

          {/* Error display (if any) */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="mt-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <p className="text-red-300 text-sm text-center">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
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
          src="https://demo.evolve-charge.com/productPoster.png" 
          alt="EVolve Charger Product"
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Failed to load poster image');
            // Fallback: hide poster and show video if image fails to load
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
                  {/* Pulsing outer ring */}
                  <motion.div
                    className="absolute inset-0 bg-teal-400/30 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 0.2, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ width: '60px', height: '60px', left: '-15px', top: '-15px' }}
                  />
                  
                  {/* Main orb */}
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full shadow-lg border-2 border-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-sm">
                    {poi}
                  </div>
                  
                  {/* Hover label */}
                  <motion.div
                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    initial={{ y: 10 }}
                    whileHover={{ y: 0 }}
                  >
                    {point.label}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
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
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDemoClick}
              className="px-6 py-2 rounded-full font-semibold transition-transform transform hover:scale-105 bg-white text-teal-600 border-2 border-teal-600 shadow-lg drop-shadow-lg"
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
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackClick}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 shadow-lg hover:bg-teal-500/20 transition-all text-white font-medium"
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
              className="w-full max-w-lg bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 text-white"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                  {descriptions[currentPOI].title}
                </h2>
                <button
                  onClick={handleCloseDescription}
                  className="text-white/60 hover:text-white transition-colors duration-200 text-xl"
                >
                  ✕
                </button>
              </div>
              
              <p className="text-white/90 leading-relaxed mb-6">
                {descriptions[currentPOI].content}
              </p>
              
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBackClick}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
                >
                  Return to Overview
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseDescription}
                  className="bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 border border-white/20"
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