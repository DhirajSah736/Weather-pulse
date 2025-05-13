import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useWeather } from '../../context/WeatherContext';
import { searchCities } from '../../utils/api';

const Header: React.FC = () => {
  const { state, fetchWeather, fetchWeatherByLocation } = useWeather();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const searchRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      await fetchWeather(searchTerm);
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = async (city: string) => {
    await fetchWeather(city);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleLocationClick = () => {
    fetchWeatherByLocation();
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        if (latest > lastScrollY.current && latest > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        lastScrollY.current = latest;
        ticking.current = false;
      });
      ticking.current = true;
    }
  });

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length > 2) {
        try {
          const data = await searchCities(searchTerm);
          setSuggestions(data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <motion.header 
      className="fixed w-full py-4 px-6 bg-black/80 backdrop-blur-sm z-50 transform will-change-transform"
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : '-100%' }}
      transition={{ 
        duration: 0.3,
        ease: "easeInOut",
        type: "tween"
      }}
      style={{
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        boxShadow: isVisible ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <motion.h1 
          className="text-3xl font-bold mb-4 md:mb-0 text-amber-400 font-rajdhani"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Weather Pulse
        </motion.h1>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative w-full md:w-64" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search city..."
                className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button 
                type="submit"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <Search size={18} />
              </button>
            </form>
            
            {showSuggestions && suggestions.length > 0 && (
              <motion.div 
                className="absolute w-full mt-2 py-2 bg-gray-800 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {suggestions.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white"
                    onClick={() => handleSuggestionClick(`${item.name}, ${item.country}`)}
                  >
                    {item.name}, {item.country}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
          
          <button
            onClick={handleLocationClick}
            className="p-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
            aria-label="Get current location"
          >
            <MapPin size={20} />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;