import React from 'react';
import { motion } from 'framer-motion';
import { AirQuality as AirQualityType } from '../../types';
import { getAirQualityLabel, getAirQualityColor } from '../../utils/theme';
import { Wind } from 'lucide-react';

interface AirQualityProps {
  airQuality?: AirQualityType;
}

const AirQuality: React.FC<AirQualityProps> = ({ airQuality }) => {
  if (!airQuality) {
    return null;
  }
  
  const aqiValue = airQuality['us-epa-index'];
  const label = getAirQualityLabel(aqiValue);
  const color = getAirQualityColor(aqiValue);
  
  // Calculate percentage for each pollutant (relative to a max value)
  const calculatePercentage = (value: number, max: number) => {
    return Math.min(100, (value / max) * 100);
  };
  
  const pollutants = [
    { name: 'PM2.5', value: airQuality.pm2_5, max: 75, unit: 'μg/m³' },
    { name: 'PM10', value: airQuality.pm10, max: 150, unit: 'μg/m³' },
    { name: 'O₃', value: airQuality.o3, max: 240, unit: 'μg/m³' },
    { name: 'NO₂', value: airQuality.no2, max: 200, unit: 'μg/m³' },
    { name: 'SO₂', value: airQuality.so2, max: 350, unit: 'μg/m³' },
    { name: 'CO', value: airQuality.co, max: 15000, unit: 'μg/m³' },
  ];
  
  return (
    <motion.div
      className="bg-black/40 backdrop-blur-md rounded-2xl p-6 text-white h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center mb-6">
        <Wind className="text-amber-400 mr-2" size={20} />
        <h2 className="text-xl font-bold">Air Quality</h2>
      </div>
      
      <div className="flex items-center mb-4">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mr-4 text-2xl font-bold"
          style={{ backgroundColor: color, color: aqiValue <= 2 ? '#000' : '#fff' }}
        >
          {aqiValue}
        </div>
        <div>
          <p className="text-xl font-bold">{label}</p>
          <p className="text-sm text-gray-300">US EPA Index</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        {pollutants.map((pollutant) => (
          <div key={pollutant.name} className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>{pollutant.name}</span>
              <span>
                {Math.round(pollutant.value)} {pollutant.unit}
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ 
                  width: `${calculatePercentage(pollutant.value, pollutant.max)}%`,
                  backgroundColor: color
                }}
                initial={{ width: 0 }}
                animate={{ width: `${calculatePercentage(pollutant.value, pollutant.max)}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default AirQuality;