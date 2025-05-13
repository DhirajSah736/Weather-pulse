import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeState } from '../types';
import { useWeather } from './WeatherContext';
import { getThemeState } from '../utils/theme';

const initialThemeState: ThemeState = {
  mode: 'day',
  condition: 'clear',
};

interface ThemeContextType {
  theme: ThemeState;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: initialThemeState,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeState>(initialThemeState);
  const { state } = useWeather();

  useEffect(() => {
    if (state.data && state.data.current && state.data.forecast?.forecastday[0]) {
      const forecastDay = state.data.forecast.forecastday[0];
      const newTheme = getThemeState(
        state.data.current,
        forecastDay.astro.sunrise,
        forecastDay.astro.sunset,
        state.data.location.localtime
      );
      setTheme(newTheme);
    }
  }, [state.data]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);