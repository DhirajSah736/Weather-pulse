import { ThemeState, WeatherCondition, CurrentWeather } from '../types';
import dayjs from 'dayjs';

export const getWeatherCondition = (condition: string): WeatherCondition => {
  const lowerCondition = condition.toLowerCase();
  if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
    return 'rain';
  } else if (lowerCondition.includes('snow') || lowerCondition.includes('sleet') || lowerCondition.includes('ice')) {
    return 'snow';
  } else if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) {
    return 'thunderstorm';
  } else if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) {
    return 'mist';
  } else if (lowerCondition.includes('cloud') && !lowerCondition.includes('partly')) {
    return 'cloudy';
  } else if (lowerCondition.includes('partly') || lowerCondition.includes('partly cloudy')) {
    return 'partly-cloudy';
  } else {
    return 'clear';
  }
};

export const getSunPosition = (
  current: CurrentWeather,
  sunrise: string,
  sunset: string,
  localTime: string
): number => {
  // Convert strings to dayjs objects for time calculations
  const now = dayjs(localTime);
  
  // Parse sunrise and sunset times and add today's date
  const todayDate = now.format('YYYY-MM-DD');
  
  // WeatherAPI returns times in format like "06:30 AM"
  const sunriseTime = dayjs(`${todayDate} ${sunrise}`);
  const sunsetTime = dayjs(`${todayDate} ${sunset}`);
  
  // Handle edge case where sunset is next day
  const adjustedSunsetTime = sunsetTime.isBefore(sunriseTime) 
    ? sunsetTime.add(1, 'day') 
    : sunsetTime;
  
  // Calculate total day length and current position
  const dayLength = adjustedSunsetTime.diff(sunriseTime, 'minute');
  const minutesSinceSunrise = now.diff(sunriseTime, 'minute');
  
  // Calculate position as percentage (0 to 1)
  if (now.isBefore(sunriseTime)) {
    return 0; // Before sunrise
  } else if (now.isAfter(adjustedSunsetTime)) {
    return 1; // After sunset
  } else {
    return Math.min(Math.max(minutesSinceSunrise / dayLength, 0), 1);
  }
};

export const getDayMode = (
  localTime: string,
  sunrise: string,
  sunset: string,
  isDay: number
): ThemeState['mode'] => {
  if (isDay === 1) {
    const now = dayjs(localTime);
    const todayDate = now.format('YYYY-MM-DD');
    const sunriseTime = dayjs(`${todayDate} ${sunrise}`);
    const sunsetTime = dayjs(`${todayDate} ${sunset}`);
    
    // If within 1 hour after sunrise, it's sunrise time
    if (now.isAfter(sunriseTime) && now.isBefore(sunriseTime.add(1, 'hour'))) {
      return 'sunrise';
    }
    
    // If within 1 hour before sunset, it's sunset time
    if (now.isAfter(sunsetTime.subtract(1, 'hour')) && now.isBefore(sunsetTime)) {
      return 'sunset';
    }
    
    return 'day';
  } else {
    return 'night';
  }
};

export const getThemeState = (
  current: CurrentWeather,
  sunrise: string,
  sunset: string,
  localTime: string
): ThemeState => {
  const condition = getWeatherCondition(current.condition.text);
  const mode = getDayMode(localTime, sunrise, sunset, current.is_day);
  
  return {
    mode,
    condition,
  };
};

export const getAirQualityLabel = (aqiValue: number): string => {
  // US EPA Air Quality Index
  switch (aqiValue) {
    case 1:
      return 'Good';
    case 2:
      return 'Moderate';
    case 3:
      return 'Unhealthy for Sensitive Groups';
    case 4:
      return 'Unhealthy';
    case 5:
      return 'Very Unhealthy';
    case 6:
      return 'Hazardous';
    default:
      return 'Unknown';
  }
};

export const getAirQualityColor = (aqiValue: number): string => {
  // US EPA Air Quality Index colors
  switch (aqiValue) {
    case 1:
      return '#4CAF50'; // Green
    case 2:
      return '#FFEB3B'; // Yellow
    case 3:
      return '#FF9800'; // Orange
    case 4:
      return '#F44336'; // Red
    case 5:
      return '#9C27B0'; // Purple
    case 6:
      return '#7D0303'; // Maroon
    default:
      return '#9E9E9E'; // Grey for unknown
  }
};