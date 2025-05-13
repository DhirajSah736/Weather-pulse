import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Cloud, Sun } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black flex flex-col items-center justify-center px-4 text-white">
      <motion.div
        className="flex items-center justify-center gap-4 mb-8"
        animate={{ y: [0, -10, 0] }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sun size={32} className="text-amber-400" />
        <Cloud size={40} className="text-white/80" />
        <CloudRain size={36} className="text-blue-400" />
      </motion.div>
      
      <motion.h1 
        className="text-4xl font-bold mb-4 text-amber-400 font-rajdhani"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Weather Pulse
      </motion.h1>
      
      <p className="text-lg text-center text-gray-300 max-w-md">
        Loading weather data. Please wait...
      </p>
      
      <motion.div 
        className="w-64 h-1 bg-gray-700 rounded-full mt-8 overflow-hidden"
      >
        <motion.div 
          className="h-full bg-amber-500"
          animate={{ width: ['0%', '100%', '0%'] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
};

export default LoadingScreen;