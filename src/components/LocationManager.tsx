// import React, { useState, useEffect } from 'react';
// import { motion } from 'motion/react';
// import { MapPin, Navigation, Search, Loader } from 'lucide-react';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { apiService } from '../services/api';
// import { config } from '../config/config';

// interface LocationManagerProps {
//   onLocationSet: (location: { latitude: number; longitude: number; address: string }) => void;
//   onSkip?: () => void;
//   showSkip?: boolean;
// }

// interface UserLocation {
//   latitude: number;
//   longitude: number;
//   address: string;
// }

// export default function LocationManager({ onLocationSet, onSkip, showSkip = false }: LocationManagerProps) {
//   const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null);
//   const [isLoadingLocation, setIsLoadingLocation] = useState(false);
//   const [searchAddress, setSearchAddress] = useState('');
//   const [isSearching, setIsSearching] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     fetchUserLocation();
//   }, []);

//   const fetchUserLocation = async () => {
//     try {
//       const location = await apiService.getUserLocation();
//       if (location && location.latitude && location.longitude) {
//         setCurrentLocation(location);
//       }
//     } catch (error) {
//       console.log('No saved location found');
//     }
//   };

//   const getCurrentPosition = () => {
//     setIsLoadingLocation(true);
//     setError(null);

//     if (!navigator.geolocation) {
//       setError('Geolocation is not supported by this browser');
//       setIsLoadingLocation(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;

//         try {
//           console.log('Got current position:', { latitude, longitude });
//           const address = await reverseGeocode(latitude, longitude);
//           console.log('Reverse geocoded address:', address);

//           const locationData = { latitude, longitude, address };

//           console.log('Attempting to save location to API...');
//           await apiService.addUserLocation(latitude, longitude, address);
//           console.log('Location saved successfully!');

//           setCurrentLocation(locationData);
//           onLocationSet(locationData);
//         } catch (error) {
//           console.error('Error saving location:', error);
//           const errorMessage = error instanceof Error ? error.message : 'Unknown error';

//           if (errorMessage.includes('Authentication') || errorMessage.includes('Unauthorized')) {
//             setError('Please login first to save your location.');
//           } else {
//             setError('Failed to save location. Please try again.');
//           }
//         } finally {
//           setIsLoadingLocation(false);
//         }
//       },
//       (error) => {
//         setIsLoadingLocation(false);
//         switch (error.code) {
//           case error.PERMISSION_DENIED:
//             setError('Location access denied. Please enable location permissions.');
//             break;
//           case error.POSITION_UNAVAILABLE:
//             setError('Location information is unavailable.');
//             break;
//           case error.TIMEOUT:
//             setError('Location request timed out.');
//             break;
//           default:
//             setError('An unknown error occurred while retrieving location.');
//             break;
//         }
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 60000
//       }
//     );
//   };

//   const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
//     try {
//       // Using Google Maps Geocoding API
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${config.GOOGLE_MAPS_API_KEY}`
//       );
//       const data = await response.json();

//       console.log('Google Maps Geocoding response:', data);

//       if (data.status === 'OK' && data.results && data.results.length > 0) {
//         const result = data.results[0];

//         // Try to get a formatted short address
//         const addressComponents = result.address_components;
//         const addressParts = [];

//         // Extract specific components
//         const getComponent = (type: string) => {
//           const component = addressComponents.find((comp: any) => comp.types.includes(type));
//           return component ? component.long_name : null;
//         };

//         // Build address: Road, Area, City
//         const road = getComponent('route') || getComponent('premise');
//         const area = getComponent('sublocality_level_2') || getComponent('sublocality_level_1') || getComponent('locality');
//         const city = getComponent('locality') || getComponent('administrative_area_level_2');

//         if (road) addressParts.push(road);
//         if (area && area !== city) addressParts.push(area);
//         if (city) addressParts.push(city);

//         if (addressParts.length > 0) {
//           return addressParts.join(', ');
//         }

//         // Fallback to formatted_address but limit length
//         const formattedAddress = result.formatted_address;
//         const parts = formattedAddress.split(', ');
//         return parts.slice(0, Math.min(3, parts.length)).join(', ');
//       }

//       return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
//     } catch (error) {
//       console.error('Geocoding error:', error);
//       return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
//     }
//   };

//   const searchLocation = async () => {
//     if (!searchAddress.trim()) return;

//     setIsSearching(true);
//     setError(null);

//     try {
//       // Using Google Maps Geocoding API for search
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchAddress)}&components=country:IN&key=${config.GOOGLE_MAPS_API_KEY}`
//       );
//       const data = await response.json();

//       console.log('Google Maps Search response:', data);

//       if (data.status === 'OK' && data.results && data.results.length > 0) {
//         const result = data.results[0];
//         const location = result.geometry.location;
//         const lat = location.lat;
//         const lng = location.lng;

//         // Get a properly formatted address
//         const formattedAddress = await reverseGeocode(lat, lng);

//         const locationData = {
//           latitude: lat,
//           longitude: lng,
//           address: formattedAddress
//         };

//         console.log('Attempting to save searched location to API...');
//         await apiService.addUserLocation(locationData.latitude, locationData.longitude, locationData.address);
//         console.log('Searched location saved successfully!');

//         setCurrentLocation(locationData);
//         onLocationSet(locationData);
//       } else {
//         setError('Location not found. Please try a different search term.');
//       }
//     } catch (error) {
//       console.error('Error searching location:', error);
//       const errorMessage = error instanceof Error ? error.message : 'Unknown error';

//       if (errorMessage.includes('Authentication') || errorMessage.includes('Unauthorized')) {
//         setError('Please login first to save your location.');
//       } else {
//         setError('Failed to search location. Please try again.');
//       }
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   const useCurrentLocation = () => {
//     if (currentLocation) {
//       onLocationSet(currentLocation);
//     }
//   };

//   return (
//     <div className="h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 p-8 flex flex-col justify-center">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-md mx-auto w-full"
//       >
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="text-center mb-8"
//         >
//           <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//             <MapPin className="w-8 h-8 text-white" />
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Your Location</h2>
//           <p className="text-gray-600">
//             Find the best offers within 10km of your location
//           </p>
//         </motion.div>

//         {/* Current Location Display */}
//         {currentLocation && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
//           >
//             <div className="flex items-start space-x-3">
//               <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
//               <div className="flex-1">
//                 <p className="text-sm font-medium text-green-800">Current Location</p>
//                 <p className="text-sm text-green-600">{currentLocation.address}</p>
//               </div>
//             </div>
//             <Button
//               onClick={useCurrentLocation}
//               className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white"
//             >
//               Use This Location
//             </Button>
//           </motion.div>
//         )}

//         {/* Get Current Location */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="space-y-4"
//         >
//           <Button
//             onClick={getCurrentPosition}
//             disabled={isLoadingLocation}
//             className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2"
//           >
//             {isLoadingLocation ? (
//               <Loader className="w-5 h-5 animate-spin" />
//             ) : (
//               <Navigation className="w-5 h-5" />
//             )}
//             <span>{isLoadingLocation ? 'Getting Location...' : 'Use Current Location'}</span>
//           </Button>

//           {/* Divider */}
//           <div className="flex items-center space-x-4">
//             <div className="flex-1 h-px bg-gray-300"></div>
//             <span className="text-gray-500 text-sm">or</span>
//             <div className="flex-1 h-px bg-gray-300"></div>
//           </div>

//           {/* Search Location */}
//           <div className="space-y-3">
//             <div className="flex space-x-2">
//               <Input
//                 type="text"
//                 value={searchAddress}
//                 onChange={(e) => setSearchAddress(e.target.value)}
//                 placeholder="Search for your location"
//                 className="flex-1"
//                 onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
//               />
//               <Button
//                 onClick={searchLocation}
//                 disabled={isSearching || !searchAddress.trim()}
//                 className="px-4 bg-gray-600 hover:bg-gray-700 text-white"
//               >
//                 {isSearching ? (
//                   <Loader className="w-4 h-4 animate-spin" />
//                 ) : (
//                   <Search className="w-4 h-4" />
//                 )}
//               </Button>
//             </div>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               className="bg-red-50 border border-red-200 rounded-lg p-3"
//             >
//               <p className="text-red-600 text-sm">{error}</p>
//             </motion.div>
//           )}

//           {/* Skip Option */}
//           {showSkip && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.8 }}
//               className="text-center pt-4"
//             >
//               <button
//                 onClick={onSkip}
//                 className="text-gray-500 hover:text-gray-700 text-sm underline"
//               >
//                 Skip for now
//               </button>
//             </motion.div>
//           )}
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }



////////////////////


import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Loader } from 'lucide-react';
import { apiService } from '../services/api';
import { config } from '../config/config';

interface LocationManagerProps {
  onLocationSet: (location: { latitude: number; longitude: number; address: string }) => void;
  onSkip?: () => void;
  showSkip?: boolean;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export default function LocationManager({ onLocationSet, onSkip, showSkip = false }: LocationManagerProps) {
  const [currentLocation, setCurrentLocation] = useState<UserLocation | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      // First try to get saved location from API
      const savedLocation = await apiService.getUserLocation();
      if (savedLocation && savedLocation.latitude && savedLocation.longitude) {
        console.log('Using saved location:', savedLocation);
        setCurrentLocation(savedLocation);
        onLocationSet(savedLocation);
        setIsLoadingLocation(false);
        return;
      }

      // If no saved location, try to get current position
      await getCurrentPosition();
    } catch (error) {
      console.error('Error initializing location:', error);
      // If all fails, use default location or skip
      if (onSkip) {
        onSkip();
      } else {
        setError('Unable to determine location');
        setIsLoadingLocation(false);
      }
    }
  };

  const getCurrentPosition = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by this browser');
        setIsLoadingLocation(false);
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            console.log('Got current position:', { latitude, longitude });
            const address = await reverseGeocode(latitude, longitude);
            console.log('Reverse geocoded address:', address);

            const locationData = { latitude, longitude, address };

            console.log('Attempting to save location to API...');
            await apiService.addUserLocation(latitude, longitude, address);
            console.log('Location saved successfully!');

            setCurrentLocation(locationData);
            onLocationSet(locationData);
            setIsLoadingLocation(false);
            resolve();
          } catch (error) {
            console.error('Error saving location:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            if (errorMessage.includes('Authentication') || errorMessage.includes('Unauthorized')) {
              setError('Please login first to save your location.');
            } else {
              setError('Failed to save location. Please try again.');
            }
            setIsLoadingLocation(false);
            reject(error);
          }
        },
        (error) => {
          setIsLoadingLocation(false);
          let errorMsg = 'An unknown error occurred while retrieving location.';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = 'Location access denied. Please enable location permissions.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMsg = 'Location request timed out.';
              break;
          }
          
          setError(errorMsg);
          reject(new Error(errorMsg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    });
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using Google Maps Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${config.GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();

      console.log('Google Maps Geocoding response:', data);

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const result = data.results[0];

        // Try to get a formatted short address
        const addressComponents = result.address_components;
        const addressParts = [];

        // Extract specific components
        const getComponent = (type: string) => {
          const component = addressComponents.find((comp: any) => comp.types.includes(type));
          return component ? component.long_name : null;
        };

        // Build address: Road, Area, City
        const road = getComponent('route') || getComponent('premise');
        const area = getComponent('sublocality_level_2') || getComponent('sublocality_level_1') || getComponent('locality');
        const city = getComponent('locality') || getComponent('administrative_area_level_2');

        if (road) addressParts.push(road);
        if (area && area !== city) addressParts.push(area);
        if (city) addressParts.push(city);

        if (addressParts.length > 0) {
          return addressParts.join(', ');
        }

        // Fallback to formatted_address but limit length
        const formattedAddress = result.formatted_address;
        const parts = formattedAddress.split(', ');
        return parts.slice(0, Math.min(3, parts.length)).join(', ');
      }

      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.error('Geocoding error:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const retryLocation = () => {
    setError(null);
    setIsLoadingLocation(true);
    getCurrentPosition().catch(() => {
      setIsLoadingLocation(false);
    });
  };

  // Show loading state
  if (isLoadingLocation) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Getting Your Location</h3>
          <p className="text-gray-600">Please wait while we determine your location...</p>
        </motion.div>
      </div>
    );
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Location Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="space-y-3">
            <button
              onClick={retryLocation}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-medium"
            >
              Try Again
            </button>
            
            {showSkip && onSkip && (
              <button
                onClick={onSkip}
                className="w-full text-gray-600 hover:text-gray-800 py-3 rounded-lg font-medium border border-gray-300 hover:border-gray-400"
              >
                Continue Without Location
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }
  
  return null;
}
