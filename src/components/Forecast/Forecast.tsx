import React from 'react';
import { motion } from 'framer-motion';
import { ForecastDay } from '../../types';
import dayjs from 'dayjs';
import ForecastCard from './ForecastCard';

interface ForecastProps {
  forecastData: ForecastDay[];
  unit: 'metric' | 'imperial';
}

const Forecast: React.FC<ForecastProps> = ({ forecastData, unit }) => {
  if (!forecastData || forecastData.length === 0) {
    return null;
  }

  // Only take the first 3 days of forecast data
  const threeDayForecast = forecastData.slice(0, 3);

  return (
    <motion.div
      className="mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-2xl font-bold text-white mb-6">3-Day Forecast</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {threeDayForecast.map((day, index) => (
          <ForecastCard
            key={day.date}
            day={day}
            unit={unit}
            index={index}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Forecast;