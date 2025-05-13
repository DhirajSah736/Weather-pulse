import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Location } from '../../types';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import { icon } from 'leaflet';

// Fix Leaflet default icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface WeatherMapProps {
  location: Location;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ location }) => {
  const [mounted, setMounted] = useState(false);
  
  // Set up the custom icon to fix the missing marker issue
  const customIcon = icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return null;
  }
  
  return (
    <motion.div
      className="bg-black/40 backdrop-blur-md rounded-2xl p-6 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold text-white mb-4">Location Map</h2>
      
      <div className="h-96 rounded-xl overflow-hidden">
        <MapContainer 
          center={[location.lat, location.lon]} 
          zoom={10} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[location.lat, location.lon]} icon={customIcon}>
            <Popup>
              {location.name}, {location.country}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </motion.div>
  );
};

export default WeatherMap;