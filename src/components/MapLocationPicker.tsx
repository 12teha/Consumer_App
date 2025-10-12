import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Navigation, Loader, Search } from 'lucide-react';
import { Button } from './ui/button';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icon for current location (blue)
const currentLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="8" fill="#2563eb" stroke="white" stroke-width="3"/>
      <circle cx="16" cy="16" r="12" fill="none" stroke="#2563eb" stroke-width="2" opacity="0.3"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

// Custom icon for selected location (red)
const selectedLocationIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapLocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: { latitude: number; longitude: number; address: string }) => void;
  currentLocation?: { latitude: number; longitude: number };
}

// Component to handle map clicks
function LocationMarker({
  position,
  onLocationChange
}: {
  position: [number, number] | null;
  onLocationChange: (lat: number, lng: number) => void
}) {
  const map = useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? <Marker position={position} icon={selectedLocationIcon} /> : null;
}

// Component to show current user location
function CurrentLocationMarker({ position }: { position: [number, number] | null }) {
  if (!position) return null;

  return (
    <Marker position={position} icon={currentLocationIcon}>
      <div className="text-xs font-medium">Your current location</div>
    </Marker>
  );
}

// Component to recenter map
function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapLocationPicker({
  isOpen,
  onClose,
  onLocationSelect,
  currentLocation
}: MapLocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    currentLocation ? { lat: currentLocation.latitude, lng: currentLocation.longitude } : null
  );
  const [address, setAddress] = useState<string>('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    currentLocation
      ? [currentLocation.latitude, currentLocation.longitude]
      : [12.9716, 77.5946] // Default to Bangalore
  );
  const [mapKey, setMapKey] = useState(0);
  const [userCurrentLocation, setUserCurrentLocation] = useState<[number, number] | null>(
    currentLocation ? [currentLocation.latitude, currentLocation.longitude] : null
  );

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCurrentLocation([lat, lng]);
          setSelectedLocation({ lat, lng });
          setMapCenter([lat, lng]);
          fetchAddress(lat, lng);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please select manually on the map.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Fetch address from coordinates
  const fetchAddress = async (lat: number, lng: number) => {
    setIsLoadingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'OfferbeezApp/1.0'
          }
        }
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      } else {
        setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    fetchAddress(lat, lng);
  };

  // Search location
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'OfferbeezApp/1.0'
          }
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setSelectedLocation({ lat, lng });
        setMapCenter([lat, lng]);
        setAddress(data[0].display_name);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      alert('Error searching location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseLocation = () => {
    if (selectedLocation) {
      onLocationSelect({
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        address: address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
      });
      onClose();
    }
  };

  // Auto-select current location on mount and force map re-render
  useEffect(() => {
    if (isOpen) {
      setMapKey(prev => prev + 1);
      if (currentLocation) {
        // Set the saved location as both current and selected
        const loc: [number, number] = [currentLocation.latitude, currentLocation.longitude];
        setUserCurrentLocation(loc);
        setSelectedLocation({ lat: currentLocation.latitude, lng: currentLocation.longitude });
        setMapCenter(loc);
        // Fetch address for the saved location if not already set
        if (!address) {
          fetchAddress(currentLocation.latitude, currentLocation.longitude);
        }
      } else {
        getCurrentLocation();
      }
    }
  }, [isOpen, currentLocation]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3">
              <MapPin className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Select Location</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for a location (e.g., Indiranagar, Bangalore)"
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSearching ? <Loader className="w-4 h-4 animate-spin" /> : 'Search'}
              </Button>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative flex-1 overflow-hidden bg-gray-100" style={{ minHeight: '500px' }}>
            <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
              <MapContainer
                key={mapKey}
                center={mapCenter}
                zoom={13}
                style={{ height: '100%', width: '100%', zIndex: 0 }}
                scrollWheelZoom={true}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maxZoom={19}
                />
                <CurrentLocationMarker position={userCurrentLocation} />
                <LocationMarker
                  position={selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : null}
                  onLocationChange={handleMapClick}
                />
                <RecenterMap center={mapCenter} />
              </MapContainer>

              {/* Map Overlay Instructions */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-3 rounded-lg shadow-lg z-[1000] pointer-events-none">
                <p className="text-sm text-gray-700 font-medium mb-2">
                  📍 Click anywhere on the map to select a location
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white"></div>
                    <span>Your location</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-3 bg-red-600"></div>
                    <span>Selected location</span>
                  </div>
                </div>
              </div>

              {/* Current Location Button */}
              <button
                onClick={getCurrentLocation}
                className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors z-[1000]"
                title="Use my current location"
              >
                <Navigation className="w-5 h-5 text-purple-600" />
              </button>
            </div>
          </div>

          {/* Selected Location Info */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Selected Location:
              </label>
              {isLoadingAddress ? (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading address...</span>
                </div>
              ) : selectedLocation ? (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-900 font-medium">
                    {address || 'Click on the map to select a location'}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Click on the map to select a location</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUseLocation}
                disabled={!selectedLocation}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Use This Location
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
