import React from 'react';
import { motion } from 'framer-motion';
import { ForecastDay } from '../../types';
import dayjs from 'dayjs';
import { Droplets, CloudRain, Wind, Thermometer } from 'lucide-react';

interface ForecastCardProps {
  day: ForecastDay;
  unit: 'metric' | 'imperial';
  index: number;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ day, unit, index }) => {
  const dayName = index === 0 ? 'Today' : dayjs(day.date).format('ddd, MMM D');
  const maxTemp = unit === 'metric' ? day.day.maxtemp_c : day.day.maxtemp_f;
  const minTemp = unit === 'metric' ? day.day.mintemp_c : day.day.mintemp_f;
  const windSpeed = unit === 'metric' ? day.day.maxwind_kph : day.day.maxwind_mph;
  const windUnit = unit === 'metric' ? 'km/h' : 'mph';
  
  return (
    <motion.div
      className="bg-black/30 backdrop-blur-sm rounded-xl p-6 text-white hover:bg-black/40 transition-colors h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <h3 className="text-center font-bold text-xl mb-4">{dayName}</h3>
      
      <div className="flex justify-center mb-4">
        <img 
          src={day.day.condition.icon} 
          alt={day.day.condition.text} 
          className="w-20 h-20"
        />
      </div>
      
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Thermometer size={20} className="text-red-400" />
          <span className="text-2xl font-bold">{Math.round(maxTemp)}°</span>
          <span className="text-gray-400 text-lg">/{Math.round(minTemp)}°</span>
        </div>
        <p className="text-gray-300">{day.day.condition.text}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="flex flex-col items-center gap-1">
          <Droplets size={16} className="text-blue-400" />
          <span className="text-gray-300">Humidity</span>
          <span className="font-semibold">{day.day.avghumidity}%</span>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <CloudRain size={16} className="text-indigo-400" />
          <span className="text-gray-300">Rain</span>
          <span className="font-semibold">{day.day.daily_chance_of_rain}%</span>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <Wind size={16} className="text-cyan-400" />
          <span className="text-gray-300">Wind</span>
          <span className="font-semibold">{Math.round(windSpeed)} {windUnit}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ForecastCard;