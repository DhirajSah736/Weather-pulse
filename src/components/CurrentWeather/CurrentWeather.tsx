import React from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '../../types';
import { CloudRain, Droplets, Wind, Eye, Thermometer } from 'lucide-react';
import dayjs from 'dayjs';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: 'metric' | 'imperial';
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit }) => {
  const { current, location } = data;
  
  const temperature = unit === 'metric' ? current.temp_c : current.temp_f;
  const feelsLike = unit === 'metric' ? current.feelslike_c : current.feelslike_f;
  const windSpeed = unit === 'metric' ? current.wind_kph : current.wind_mph;
  const windUnit = unit === 'metric' ? 'km/h' : 'mph';
  const visibility = unit === 'metric' ? current.vis_km : current.vis_miles;
  const visUnit = unit === 'metric' ? 'km' : 'mi';
  
  const localTime = dayjs(location.localtime).format('ddd, MMM D • h:mm A');

  return (
    <motion.div 
      className="bg-black/40 backdrop-blur-md rounded-2xl p-6 text-white shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex flex-col">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-1">
              {location.name}
            </h2>
            <p className="text-amber-400 text-lg mb-4">
              {location.region}, {location.country}
            </p>
            <p className="text-gray-300 mb-6">{localTime}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <img 
              src={current.condition.icon} 
              alt={current.condition.text}
              className="w-24 h-24"
            />
            <div>
              <div className="text-5xl md:text-6xl font-bold">
                {Math.round(temperature)}°
                <span className="text-2xl">{unit === 'metric' ? 'C' : 'F'}</span>
              </div>
              <p className="text-lg text-gray-300">{current.condition.text}</p>
            </div>
          </div>
          
          <div className="mt-4 text-lg">
            Feels like <span className="text-amber-400 font-bold">{Math.round(feelsLike)}°</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
            <Droplets className="text-blue-400 mb-2" size={24} />
            <p className="text-sm text-gray-300">Humidity</p>
            <p className="text-xl font-bold">{current.humidity}%</p>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
            <Wind className="text-cyan-400 mb-2" size={24} />
            <p className="text-sm text-gray-300">Wind</p>
            <p className="text-xl font-bold">{windSpeed} {windUnit}</p>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
            <CloudRain className="text-indigo-400 mb-2" size={24} />
            <p className="text-sm text-gray-300">Precipitation</p>
            <p className="text-xl font-bold">{current.precip_mm} mm</p>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
            <Eye className="text-purple-400 mb-2" size={24} />
            <p className="text-sm text-gray-300">Visibility</p>
            <p className="text-xl font-bold">{visibility} {visUnit}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentWeather;