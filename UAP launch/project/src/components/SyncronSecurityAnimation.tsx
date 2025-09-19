import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, AlertTriangle, Users, Server, Coffee, Rocket, Eye, EyeOff } from 'lucide-react';

interface AnalyticsHook {
  (event: string, data?: any): void;
}

interface SyncronSecurityAnimationProps {
  onAnalytics?: AnalyticsHook;
}

const SyncronSecurityAnimation: React.FC<SyncronSecurityAnimationProps> = ({ onAnalytics }) => {
  const [scene, setScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenes = [
    'defense', // 0-5s
    'phishing', // 5-10s  
    'breach', // 10-15s
    'cta' // 15-20s
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const timeouts = [
      setTimeout(() => {
        setScene(1);
        onAnalytics?.('ciso:phish_incoming');
      }, 5000),
      setTimeout(() => {
        setScene(2);
        onAnalytics?.('ciso:phish_clicked');
      }, 10000),
      setTimeout(() => {
        setScene(3);
        onAnalytics?.('ciso:breach');
      }, 15000),
      setTimeout(() => {
        onAnalytics?.('ciso:cta_shown');
      }, 15100),
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [isPlaying, onAnalytics]);

  const startAnimation = () => {
    setIsPlaying(true);
    setScene(0);
    onAnalytics?.('ciso:defense');
  };

  const handleCtaClick = () => {
    onAnalytics?.('ciso:cta_clicked');
    window.open('https://syncron.atlassian.net/wiki/spaces/Security/pages/1724842067', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1">
            <img 
              src="/syncron-logo.png" 
              alt="Syncron Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Syncron Security Awareness Month 2025
          </h1>
        </div>
      </div>

      {/* Animation Stage */}
      <div className="relative h-96 bg-gradient-to-b from-blue-100 to-blue-200 overflow-hidden">
        <div 
          className="absolute inset-0" 
          role="img" 
          aria-live="polite"
          aria-label={`Security awareness animation, currently showing: ${scenes[scene]}`}
        >
          <AnimatePresence mode="wait">
            {/* Scene 0: Defense (0-5s) */}
            {scene === 0 && (
              <motion.div
                key="defense"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Background Servers */}
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          boxShadow: ['0 0 20px #3b82f6', '0 0 30px #06b6d4', '0 0 20px #3b82f6'],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        className="w-16 h-20 bg-gradient-to-b from-blue-400 to-blue-600 rounded-lg flex items-center justify-center"
                      >
                        <Server className="text-white w-6 h-6" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CISO Character */}
                <motion.div
                  initial={{ x: -200, rotate: -10 }}
                  animate={{ x: 0, rotate: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute left-20 bottom-20 z-10"
                >
                  <div className="relative">
                    {/* Cape */}
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, 0, -5, 0],
                        scaleY: [1, 1.1, 1, 1.1, 1]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -top-2 -left-2 w-16 h-20 bg-gradient-to-b from-orange-500 to-orange-600 rounded-t-full transform -rotate-12"
                    />
                    
                    {/* Character Body */}
                    <div className="relative w-12 h-16 bg-gradient-to-b from-blue-600 to-blue-800 rounded-t-full">
                      {/* Face */}
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="flex items-center gap-1"
                        >
                          <div className="w-1 h-1 bg-black rounded-full"></div>
                          <div className="w-1 h-1 bg-black rounded-full"></div>
                        </motion.div>
                        <motion.div
                          animate={{ scaleX: [1, 0.8, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="absolute bottom-1 w-3 h-1 bg-black rounded-full"
                        />
                      </div>
                      
                      {/* Shield */}
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -right-4 top-4 w-8 h-8 bg-gradient-to-b from-blue-300 to-blue-500 rounded-lg flex items-center justify-center p-1"
                      >
                        <img 
                          src="/syncron-logo.png" 
                          alt="Syncron Shield" 
                          className="w-4 h-4 object-contain"
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Security Team */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="absolute right-20 bottom-20 flex gap-2"
                >
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      className="w-8 h-10 bg-gradient-to-b from-green-400 to-green-600 rounded-t-full flex flex-col items-center justify-center"
                    >
                      <div className="w-4 h-4 bg-yellow-100 rounded-full mb-1 flex items-center justify-center">
                        <div className="flex gap-0.5">
                          <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                          <div className="w-0.5 h-0.5 bg-black rounded-full"></div>
                        </div>
                      </div>
                      <Zap className="w-3 h-3 text-white" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Happy Customers */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute top-10 left-10 flex gap-2"
                >
                  {['😊', '👏', '💼'].map((emoji, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -3, 0], rotate: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      className="text-2xl"
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Bouncing Threats */}
                <motion.div
                  initial={{ x: -100 }}
                  animate={{ x: 50 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  className="absolute top-1/3 left-4"
                >
                  <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center"
                  >
                    🎣
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Scene 1: Phishing Email (5-10s) */}
            {scene === 1 && (
              <motion.div
                key="phishing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Employee Character */}
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-16 h-20 bg-gradient-to-b from-gray-400 to-gray-600 rounded-t-full relative">
                    {/* Face with surprised expression */}
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-yellow-100 rounded-full flex flex-col items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="flex items-center gap-1 mb-1"
                      >
                        <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="w-2 h-3 bg-black rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Phishing Email */}
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
                  className="absolute left-1/3 top-1/4 bg-white rounded-lg shadow-lg p-4 w-64 border-2 border-yellow-400"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Coffee className="w-4 h-4 text-orange-500" />
                    <span className="font-bold text-sm text-gray-800">⭐ URGENT: Free Coffee for Life!</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    🎉 You've won unlimited coffee! Click below to claim your prize!
                  </p>
                  
                  <motion.button
                    animate={{ 
                      boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0)', '0 0 0 10px rgba(239, 68, 68, 0.1)', '0 0 0 0 rgba(239, 68, 68, 0)'],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-full bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 px-4 rounded cursor-pointer"
                  >
                    🚨 CLAIM NOW! 🚨
                  </motion.button>
                </motion.div>

                {/* Clicking Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 0] }}
                  transition={{ delay: 2, duration: 0.5, repeat: 3, repeatDelay: 0.3 }}
                  className="absolute left-1/2 top-1/2 w-4 h-4 bg-yellow-400 rounded-full pointer-events-none"
                />

                {/* CISO in background looking worried */}
                <motion.div
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute left-10 bottom-10"
                >
                  <div className="w-8 h-10 bg-gradient-to-b from-blue-600 to-blue-800 rounded-t-full">
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-yellow-100 rounded-full flex flex-col items-center justify-center">
                      <div className="flex items-center gap-0.5">
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                        <div className="w-1 h-1 bg-black rounded-full"></div>
                      </div>
                      <div className="w-1 h-2 bg-black rounded-full mt-0.5"></div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Scene 2: Breach (10-15s) */}
            {scene === 2 && (
              <motion.div
                key="breach"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* Red Alert Wave */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 3, opacity: [0, 0.7, 0] }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="absolute inset-0 bg-red-500 rounded-full"
                />

                {/* Servers Flickering */}
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          backgroundColor: ['#dc2626', '#f97316', '#dc2626'],
                          scale: [1, 0.9, 1.1, 0.95, 1],
                          rotate: [0, -2, 2, -1, 0]
                        }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-16 h-20 rounded-lg flex flex-col items-center justify-center"
                      >
                        <Server className="text-white w-6 h-6 mb-1" />
                        <motion.div
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 0.2, repeat: Infinity }}
                          className="text-white text-xs"
                        >
                          🔥
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CISO Fighting */}
                <motion.div
                  animate={{ 
                    x: [0, -10, 10, 0],
                    rotate: [0, -5, 5, 0],
                    scale: [1, 1.1, 0.9, 1]
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="absolute left-20 bottom-20 z-10"
                >
                  <div className="w-12 h-16 bg-gradient-to-b from-blue-600 to-blue-800 rounded-t-full relative">
                    {/* Determined face */}
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-yellow-100 rounded-full flex flex-col items-center justify-center">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                      </div>
                      <div className="w-4 h-1 bg-black rounded-full mt-1"></div>
                    </div>
                    
                    <motion.div
                      animate={{ rotate: [0, 45, -45, 0], scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.3, repeat: Infinity }}
                      className="absolute -right-4 top-4 w-8 h-8 bg-gradient-to-b from-blue-300 to-blue-500 rounded-lg flex items-center justify-center p-1"
                    >
                      <img 
                        src="/syncron-logo.png" 
                        alt="Syncron Shield" 
                        className="w-4 h-4 object-contain"
                      />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Team Scrambling */}
                <motion.div
                  animate={{ y: [0, -10, 0], x: [0, -5, 5, 0] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                  className="absolute right-20 bottom-20 flex gap-2"
                >
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.1 }}
                      className="w-8 h-10 bg-gradient-to-b from-green-400 to-green-600 rounded-t-full flex flex-col items-center justify-center"
                    >
                      <div className="w-4 h-4 bg-yellow-100 rounded-full mb-1 flex flex-col items-center justify-center">
                        <div className="flex gap-0.5">
                          <div className="w-0.5 h-0.5 bg-red-600 rounded-full"></div>
                          <div className="w-0.5 h-0.5 bg-red-600 rounded-full"></div>
                        </div>
                        <div className="w-2 h-0.5 bg-black rounded-full"></div>
                      </div>
                      <AlertTriangle className="w-3 h-3 text-white" />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Customers Gasping */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="absolute top-10 left-10 flex gap-2"
                >
                  {['😱', '😰', '😨'].map((emoji, i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                      className="text-2xl"
                    >
                      {emoji}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Scene 3: CTA (15-20s) */}
            {scene === 3 && (
              <motion.div
                key="cta"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-blue-100"
              >
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md mx-4 border-2 border-orange-200"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mb-4 flex items-center justify-center"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center p-2">
                      <img 
                        src="/syncron-logo.png" 
                        alt="Syncron Security Shield" 
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  </motion.div>
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Oops! One Click Can Impact Syncron
                  </h2>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Don't worry — this is exactly why we're launching<br />
                    <strong className="text-orange-600">Security Awareness Month!</strong>
                    <br />
                    Let's learn together and make Syncron stronger. 💪
                  </p>
                  
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(249, 115, 22, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCtaClick}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300 flex items-center gap-2 mx-auto"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleCtaClick()}
                  >
                    <Rocket className="w-5 h-5" />
                    Start the Security Journey
                  </motion.button>
                  
                  <p className="text-xs text-gray-500 mt-4">
                    🎯 Interactive training • 🏆 Team challenges • 📚 Best practices
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Play Button (when not playing) */}
      {!isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={startAnimation}
            className="bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-full shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </motion.button>
        </motion.div>
      )}

      {/* Progress Bar */}
      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 20, ease: "linear" }}
            className="h-full bg-gradient-to-r from-orange-500 to-orange-600"
          />
        </div>
      )}

      {/* Replay Button */}
      {isPlaying && scene === 3 && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          onClick={() => {
            setIsPlaying(false);
            setScene(0);
          }}
          className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full backdrop-blur-sm transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default SyncronSecurityAnimation;