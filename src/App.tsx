import { useState } from 'react';
import { WeatherProvider } from './context/WeatherContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header/Header';
import CurrentWeather from './components/CurrentWeather/CurrentWeather';
import Forecast from './components/Forecast/Forecast';
import SunTracker from './components/SunTracker/SunTracker';
import AirQuality from './components/AirQuality/AirQuality';
import WeatherMap from './components/Map/WeatherMap';
import { useWeather } from './context/WeatherContext';
import { useTheme } from './context/ThemeContext';
import BackgroundEffects from './components/UI/BackgroundEffects';
import LoadingScreen from './components/UI/LoadingScreen';
import ErrorMessage from './components/UI/ErrorMessage';

const AppContent = () => {
  const { state } = useWeather();
  const { theme } = useTheme();
  const [showMap, setShowMap] = useState(false);

  // Generate dynamic classes based on theme
  const getBgClass = () => {
    const modeClasses = {
      'day': 'from-blue-900 to-blue-700',
      'night': 'from-gray-900 to-blue-950',
      'sunrise': 'from-indigo-900 via-orange-700 to-amber-500',
      'sunset': 'from-blue-900 via-purple-800 to-orange-600'
    };

    return `min-h-screen bg-gradient-to-b ${modeClasses[theme.mode]} transition-colors duration-1000`;
  };

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  if (state.error) {
    return <ErrorMessage message={state.error} />;
  }

  return (
    <div className={getBgClass()}>
      <BackgroundEffects theme={theme} />
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 pb-8 pt-24">
        {state.data && (
          <>
            <CurrentWeather data={state.data} unit={state.unit} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
              <SunTracker data={state.data} />
              <AirQuality airQuality={state.data.current.air_quality} />
            </div>
            
            <Forecast forecastData={state.data.forecast?.forecastday || []} unit={state.unit} />
            
            <div className="mt-10">
              <button 
                className="px-5 py-2 bg-amber-500 text-white rounded-lg shadow-lg hover:bg-amber-600 transition-colors mb-4"
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>
              
              {showMap && <WeatherMap location={state.data.location} />}
            </div>
          </>
        )}
      </main>

      <footer className="bg-black/40 backdrop-blur-sm py-4 text-center text-gray-400">
        <p className="text-sm">
          © 2025 Weather Pulse. All rights reserved | Designed & Developed by{' '}
          <span className="text-amber-400">Dhiraj Sah</span>
        </p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <WeatherProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </WeatherProvider>
  );
}

export default App;