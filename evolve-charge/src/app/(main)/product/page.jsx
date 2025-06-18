"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Video file mapping
const videos = {
  1: { to: '/videos/ToCharger.mp4', from: '/videos/FromCharger.mp4' },
  2: { to: '/videos/ToHolder.mp4', from: '/videos/FromHolder.mp4' },
  3: { to: '/videos/ToHook.mp4', from: '/videos/FromHook.mp4' },
  4: { to: '/videos/ToPlug.mp4', from: '/videos/FromPlug.mp4' },
};

// Interactive points configuration - easily repositionable
const interactivePoints = {
  1: { x: '59%', y: '15%', label: 'Charger' },
  2: { x: '42%', y: '25%', label: 'Holder' },
  3: { x: '96%', y: '50%', label: 'Hook' },
  4: { x: '50%', y: '80%', label: 'Plug' },
};

// Descriptions for each POI
const descriptions = {
  1: {
    title: 'The Charger',
    content: 'The heart and soul of the EVolve Charger. A compact, efficient, lightweight, and stylish module that is hooked safely onto the guide wires of the EVolve system and traverses to any car inside your garage automatically at the optimal time to charge.'
  },
  2: {
    title: 'Wire Holder',
    content: 'The component that contains the wire securely wrapped around it. It is designed to keep the wire as tight as possible to prevent the charger from sagging and has simple controls, just a knob to tighten the wires and a push-to-lock mecahnism to make sure that once tightened, the wires never become loose. Just 4 easy screws to mount it onto your garage, all provided inside the package.'
  },
  3: {
    title: 'Hook',
    content: 'This hook holds the other end of the wires and is mounted securely with just 2 screws on the other side of your garage. All you need to do is hook the wires from the holder here and the "hard" part of the setup is done!'
  },
  4: {
    title: 'Charge Plug',
    content: 'The plug holder securely grabs onto the charging cable and has a simple actuator that pushes in and removes the charger when needed. This piece is lowered done or raised up by the main charger body above it.'
  },
};

export default function VideoViewer() {
  const [currentState, setCurrentState] = useState('loading'); // 'loading', 'start', 'playingTo', 'atPOI', 'playingFrom'
  const [currentPOI, setCurrentPOI] = useState(null);
  const [loadedVideos, setLoadedVideos] = useState({});
  const [loadedCount, setLoadedCount] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [error, setError] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const videoRef = useRef(null);

  // List of all video keys to check loading status
  const allVideos = [
    ...Object.keys(videos).map(key => `to-${key}`),
    ...Object.keys(videos).map(key => `from-${key}`),
  ];
  const totalVideos = allVideos.length;
  const isLoaded = allVideos.every(key => loadedVideos[key]);

  // Preload videos with Promise.all
  useEffect(() => {
    const loadVideos = async () => {
      const promises = allVideos.map(async (key) => {
        const [type, num] = key.split('-');
        const videoUrl = videos[num][type === 'to' ? 'to' : 'from'];
        try {
          const response = await fetch(videoUrl, { method: 'HEAD' });
          if (!response.ok) throw new Error(`Video not found: ${videoUrl}`);
          
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
          return key;
        }
      });

      const results = await Promise.all(promises);
      results.forEach(key => handleVideoLoaded(key));
    };

    loadVideos().catch(err => {
      console.error('Error preloading videos:', err);
      setError('Failed to preload some videos. Check console for details.');
    });
  }, []);

  // Handle video preload completion
  const handleVideoLoaded = (key) => {
    setLoadedVideos(prev => {
      if (!prev[key]) {
        setLoadedCount(prevCount => {
          const newCount = prevCount + 1;
          console.log(`Loaded count updated to: ${newCount}/${totalVideos}`);
          return newCount;
        });
        return { ...prev, [key]: true };
      }
      return prev;
    });
  };

  // Set initial video when all videos are loaded
  useEffect(() => {
    if (isLoaded && currentState === 'loading') {
      setCurrentVideo(videos[1].from);
      setCurrentState('start');
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
      if (currentState === 'playingTo' || currentState === 'playingFrom') {
        console.log('Playing video for state:', currentState);
        video.play().catch(() => {});
      } else if (currentState === 'atPOI' || currentState === 'start') {
        console.log('Pausing video for state:', currentState);
        video.pause();
        const setToLastFrame = () => {
          if (video.duration) {
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
      }
    }
  }, [currentState]);

  // Handle video ending
  const handleVideoEnded = () => {
    console.log('Video ended');
    if (videoRef.current) {
      videoRef.current.pause();
      if (videoRef.current.duration) {
        videoRef.current.currentTime = videoRef.current.duration - 0.01;
      }
    }
    if (currentState === 'playingTo') {
      setCurrentState('atPOI');
      setShowDescription(true);
    } else if (currentState === 'playingFrom') {
      setCurrentState('start');
      setShowDescription(false);
    }
  };

  // Handle interactive point clicks
  const handlePointClick = (poi) => {
    setCurrentPOI(poi);
    setCurrentVideo(videos[poi].to);
    setCurrentState('playingTo');
    setShowDescription(false);
  };

  // Handle back button click
  const handleBackClick = () => {
    setCurrentVideo(videos[currentPOI].from);
    setCurrentState('playingFrom');
    setShowDescription(false);
  };

  // Close description panel
  const handleCloseDescription = () => {
    setShowDescription(false);
  };

  // Loading screen with progress bar
  if (currentState === 'loading') {
    const progress = (loadedCount / totalVideos) * 100;

    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <motion.div
          className="w-full max-w-md p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-center text-lg mb-4">Loading Videos...</p>
          {error && <p className="text-center text-red-400 text-sm mb-2">{error}</p>}
          <motion.div
            className="h-4 bg-white/5 rounded-full overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div
              className="h-full bg-gradient-to-r from-teal-400 to-cyan-400"
              style={{ width: `${progress}%` }}
            />
          </motion.div>
          <p className="text-center text-sm mt-2">{Math.round(progress)}% Loaded</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gradient-to-b from-gray-900 to-gray-800 overflow-hidden">
      {/* Main video player */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onEnded={handleVideoEnded}
        controls={false}
      />

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

      {/* Back Button */}
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