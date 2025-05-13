import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '../../types';
import { getSunPosition } from '../../utils/theme';
import { Sunrise, Sunset, Sun } from 'lucide-react';
import dayjs from 'dayjs';

interface SunTrackerProps {
  data: WeatherData;
}

const SunTracker: React.FC<SunTrackerProps> = ({ data }) => {
  const [sunPosition, setSunPosition] = useState(0);
  
  useEffect(() => {
    if (data?.current && data?.forecast?.forecastday[0]) {
      const { current, location } = data;
      const { sunrise, sunset } = data.forecast.forecastday[0].astro;
      
      const position = getSunPosition(
        current,
        sunrise,
        sunset,
        location.localtime
      );
      
      setSunPosition(position);
    }
  }, [data]);
  
  if (!data?.forecast?.forecastday[0]) {
    return null;
  }
  
  const { sunrise, sunset } = data.forecast.forecastday[0].astro;
  const sunriseTime = dayjs(`${data.forecast.forecastday[0].date} ${sunrise}`).format('h:mm A');
  const sunsetTime = dayjs(`${data.forecast.forecastday[0].date} ${sunset}`).format('h:mm A');
  
  // Calculate sun's position along the arc
  const sunX = 50 + (sunPosition - 0.5) * 100; // Convert 0-1 to path percentage
  const sunY = 95 - Math.sin(sunPosition * Math.PI) * 90; // Use sine to create arc
  
  return (
    <motion.div
      className="bg-black/40 backdrop-blur-md rounded-2xl p-6 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h2 className="text-xl font-bold mb-4">Sun Position</h2>
      
      <div className="relative h-48">
        {/* Sun path arc */}
        <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Dashed arc path */}
          <path
            d="M0,95 Q50,5 100,95"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          
          {/* Sun dot */}
          <circle
            cx={sunX}
            cy={sunY}
            r="3"
            fill="#FBBF24"
            filter="drop-shadow(0 0 8px rgba(251, 191, 36, 0.8))"
          />
        </svg>
        
        {/* Sunrise and sunset times */}
        <div className="absolute bottom-0 left-0 flex items-center text-sm">
          <Sunrise className="text-amber-400 mr-1" size={18} />
          <span>{sunriseTime}</span>
        </div>
        
        <div className="absolute bottom-0 right-0 flex items-center text-sm">
          <Sunset className="text-amber-400 mr-1" size={18} />
          <span>{sunsetTime}</span>
        </div>
        
        {/* Current sun status */}
        <div 
          className="absolute text-center" 
          style={{ 
            left: `${sunX}%`, 
            top: sunY > 50 ? `${sunY - 15}%` : `${sunY + 10}%`,
            transform: 'translateX(-50%)'
          }}
        >
          <Sun className="text-amber-400 mb-1 mx-auto" size={24} />
          <div className="text-sm font-medium bg-black/50 px-2 py-1 rounded-full">
            {data.current.is_day ? 'Day' : 'Night'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SunTracker;