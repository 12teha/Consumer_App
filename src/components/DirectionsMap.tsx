import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Navigation, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icon for destination (red pin)
const destinationIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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

// Component to fit map bounds
function FitBounds({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

interface DirectionsMapProps {
  isOpen: boolean;
  onClose: () => void;
  destination: {
    latitude: number;
    longitude: number;
    name: string;
    address: string;
  };
}

export default function DirectionsMap({ isOpen, onClose, destination }: DirectionsMapProps) {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [distance, setDistance] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Get current location
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(userLocation);
          fetchRoute(userLocation, { lat: destination.latitude, lng: destination.longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Set a default location if can't get current location
          setCurrentLocation({ lat: 12.9716, lng: 77.5946 });
        }
      );
    }
  }, [isOpen]);

  // Fetch route using OSRM (Open Source Routing Machine)
  const fetchRoute = async (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
    setIsLoadingRoute(true);
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`
      );
      const data = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
        setRouteCoordinates(coordinates);

        // Calculate distance and duration
        const distanceKm = (route.distance / 1000).toFixed(1);
        const durationMin = Math.round(route.duration / 60);
        setDistance(`${distanceKm} km`);
        setDuration(`${durationMin} min`);
      } else {
        // Fallback to straight line
        setRouteCoordinates([[from.lat, from.lng], [to.lat, to.lng]]);
        const dist = calculateDistance(from.lat, from.lng, to.lat, to.lng);
        setDistance(`${dist.toFixed(1)} km`);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
      // Fallback to straight line
      setRouteCoordinates([[from.lat, from.lng], [to.lat, to.lng]]);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Calculate straight-line distance (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  const bounds = currentLocation
    ? L.latLngBounds(
        [currentLocation.lat, currentLocation.lng],
        [destination.latitude, destination.longitude]
      )
    : undefined;

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
          className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-3 flex-1">
              <Navigation className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-xl font-bold text-white">Directions</h2>
                <p className="text-sm text-blue-100">{destination.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-black hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Route Info */}
          {currentLocation && (distance || duration) && (
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-4">
                {distance && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900">{distance}</span>
                  </div>
                )}
                {duration && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">⏱️</span>
                    <span className="font-semibold text-gray-900">{duration}</span>
                  </div>
                )}
              </div>
              <Button
                onClick={openInGoogleMaps}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Open in Google Maps
              </Button>
            </div>
          )}

          {/* Map Container */}
          <div className="relative flex-1 overflow-hidden bg-gray-100">
            {currentLocation ? (
              <MapContainer
                center={[currentLocation.lat, currentLocation.lng]}
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

                {/* Current Location Marker */}
                <Marker position={[currentLocation.lat, currentLocation.lng]} icon={currentLocationIcon} />

                {/* Destination Marker */}
                <Marker position={[destination.latitude, destination.longitude]} icon={destinationIcon} />

                {/* Route Line */}
                {routeCoordinates.length > 0 && (
                  <Polyline
                    positions={routeCoordinates}
                    color="#2563eb"
                    weight={4}
                    opacity={0.7}
                  />
                )}

                {/* Fit bounds to show both markers */}
                {bounds && <FitBounds bounds={bounds} />}
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Getting your location...</p>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="absolute top-4 left-4 bg-white px-4 py-3 rounded-lg shadow-lg z-[1000]">
              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white"></div>
                  <span className="text-gray-700 font-medium">Your Location</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-4 bg-red-600"></div>
                  <span className="text-gray-700 font-medium">Destination</span>
                </div>
              </div>
            </div>
          </div>

          {/* Destination Info */}
          <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{destination.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{destination.address}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
