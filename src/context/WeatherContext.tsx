import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, WeatherData } from '../types';
import { fetchWeatherByCity, fetchWeatherByCoords } from '../utils/api';

type WeatherAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'SET_WEATHER_DATA'; payload: WeatherData }
  | { type: 'TOGGLE_UNIT' };

const initialState: AppState = {
  unit: 'metric',
  location: '',
  isLoading: true,
  error: null,
  data: null,
};

const WeatherContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<WeatherAction>;
  fetchWeather: (city: string) => Promise<void>;
  fetchWeatherByLocation: () => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  fetchWeather: async () => undefined,
  fetchWeatherByLocation: async () => undefined,
});

const weatherReducer = (state: AppState, action: WeatherAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_WEATHER_DATA':
      return { ...state, data: action.payload, isLoading: false, error: null };
    case 'TOGGLE_UNIT':
      return { ...state, unit: state.unit === 'metric' ? 'imperial' : 'metric' };
    default:
      return state;
  }
};

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  const fetchWeather = async (city: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_LOCATION', payload: city });
      const data = await fetchWeatherByCity(city);
      dispatch({ type: 'SET_WEATHER_DATA', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch weather data. Please try again.' });
    }
  };

  const fetchWeatherByLocation = async () => {
    if (navigator.geolocation) {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        
        const { latitude: lat, longitude: lon } = position.coords;
        const data = await fetchWeatherByCoords(lat, lon);
        
        dispatch({ type: 'SET_LOCATION', payload: data.location.name });
        dispatch({ type: 'SET_WEATHER_DATA', payload: data });
      } catch (error) {
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Could not get your location. Please allow location access or search manually.' 
        });
      }
    } else {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Geolocation is not supported by your browser. Please search manually.' 
      });
    }
  };

  useEffect(() => {
    fetchWeatherByLocation();
  }, []);

  return (
    <WeatherContext.Provider value={{ state, dispatch, fetchWeather, fetchWeatherByLocation }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);