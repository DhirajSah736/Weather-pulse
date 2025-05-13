import React from 'react';
import { motion } from 'framer-motion';
import { ThemeState } from '../../types';

interface BackgroundEffectsProps {
  theme: ThemeState;
}

const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ theme }) => {
  // Rain effect
  if (theme.condition === 'rain') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div 
            key={i}
            className="absolute w-0.5 bg-sky-300/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: -20,
              height: `${Math.random() * 30 + 20}px`
            }}
            animate={{
              y: ['0vh', '100vh'],
              opacity: [0.7, 0]
            }}
            transition={{
              duration: Math.random() * 1 + 0.5,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear'
            }}
          />
        ))}
      </div>
    );
  }
  
  // Snow effect
  if (theme.condition === 'snow') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div 
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-80"
            style={{
              left: `${Math.random() * 100}%`,
              top: -10
            }}
            animate={{
              y: ['0vh', '100vh'],
              x: [0, Math.random() > 0.5 ? 50 : -50]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'linear'
            }}
          />
        ))}
      </div>
    );
  }
  
  // Clouds for partly cloudy
  if (theme.condition === 'partly-cloudy') {
    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div 
            key={i}
            className="absolute bg-white/10 backdrop-blur-sm rounded-full"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 100 + 50}px`,
              borderRadius: '50%',
              top: `${Math.random() * 40}%`,
              opacity: 0.6
            }}
            initial={{ left: -200 }}
            animate={{ left: ['0%', '120%'] }}
            transition={{
              duration: Math.random() * 100 + 80,
              repeat: Infinity,
              delay: Math.random() * 20,
              ease: 'linear'
            }}
          />
        ))}
      </div>
    );
  }
  
  // For other weather conditions, return an empty div
  return <div className="fixed inset-0 pointer-events-none" />;
};

export default BackgroundEffects;