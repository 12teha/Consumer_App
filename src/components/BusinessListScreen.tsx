import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Star, Clock, ChevronRight, Loader2, Search,X, Navigation, Phone, User, Mail } from 'lucide-react';
import { apiService } from '../services/api';

interface Business {
  id: string;
  businessName: string;
  ownerName: string;
  phone: string;
  email: string;
  category: string;
  address: string;
  rating: number;
  distance: number;
  openingHours: string;
  offerCount: number;
  image: string;
  latitude: number;
  longitude: number;
}

interface BusinessListScreenProps {
  category: string;
  radius: number;
  userLocation: { lat: number; lng: number } | null;
  onBack: () => void;
  onBusinessSelect: (businessId: string) => void;
}

export default function BusinessListScreen({
  category,
  radius,
  userLocation,
  onBack,
  onBusinessSelect,
}: BusinessListScreenProps) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBusinesses();
  }, [category, radius, userLocation]);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📍 Loading businesses:', { category, radius, userLocation });

      // Call API to get businesses by category and radius
      const response = await apiService.getBusinessesByCategory({
        category,
        radius,
        lat: userLocation?.latitude || userLocation?.lat,
        lng: userLocation?.longitude || userLocation?.lng,
      });

      console.log('✅ Businesses loaded:', response);
      console.log('📊 Response structure:', {
        hasSuccess: !!response.success,
        hasData: !!response.data,
        dataIsArray: Array.isArray(response.data),
        dataLength: Array.isArray(response.data) ? response.data.length : 'not an array'
      });

      if (response.success && response.data) {
        console.log('✅ Setting businesses to:', response.data);
        setBusinesses(response.data);
      } else {
        console.log('❌ No data found, setting empty array');
        setBusinesses([]);
      }
    } catch (err) {
      console.error('❌ Failed to load businesses:', err);
      setError('Failed to load businesses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  // Open Google Maps with directions to the business
  const openGoogleMaps = (lat: number, lng: number, businessName: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encodeURIComponent(businessName)}`;
    window.open(url, '_blank');
  };

  // Filter businesses based on search query
  const filteredBusinesses = businesses.filter((business) =>
    business.businessName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-white shadow-sm">
        <div className="flex items-center p-4">
          <button
            onClick={onBack}
            className="mr-3 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{category === 'All' ? 'All Stores' : category}</h1>
            <p className="text-sm text-gray-500">
              {filteredBusinesses.length} store{filteredBusinesses.length !== 1 ? 's' : ''} {searchQuery ? 'found' : 'near you'}
            </p>
          </div>
        </div>

  


        {/* Search Bar */}
        <div className="px-4 pb-4">
  <div className="relative">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search stores..."
      className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />

    {searchQuery.length > 0 && (
      <button
        onClick={() => setSearchQuery("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 
                   text-gray-400 hover:text-gray-600"
      >
        <X className="w-5 h-5" />
      </button>
    )}
  </div>
</div>

      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800">{error}</p>
            <button
              onClick={loadBusinesses}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-2">
              {searchQuery ? 'No stores match your search' : 'No businesses found in this category'}
            </p>
            <p className="text-sm text-gray-500">
              {searchQuery ? 'Try a different search term' : 'Try increasing your search radius'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBusinesses.map((business, index) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="p-4">
                  {/* Business Name */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {business.businessName}
                    </h3>
                  </div>

                  {/* Owner Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{business.ownerName}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <a
                      href={`tel:${business.phone}`}
                      className="text-sm text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {business.phone}
                    </a>
                  </div>

                  {/* Email */}
                  {business.email && business.email !== 'N/A' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <a
                        href={`mailto:${business.email}`}
                        className="text-sm text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {business.email}
                      </a>
                    </div>
                  )}

                  {/* Address */}
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {business.address}
                    </p>
                  </div>

                  {/* Distance */}
                  <div className="flex items-center gap-2 mb-3">
                    <Navigation className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      {(() => {
                        // Calculate distance using user location and business coordinates
                        if (userLocation && business.latitude && business.longitude) {
                          const userLat = userLocation.latitude || userLocation.lat;
                          const userLng = userLocation.longitude || userLocation.lng;

                          if (userLat && userLng) {
                            const calculatedDistance = calculateDistance(
                              userLat,
                              userLng,
                              business.latitude,
                              business.longitude
                            );
                            return `${formatDistance(calculatedDistance)} away`;
                          }
                        }
                        // Default if no distance information available
                        return 'Distance N/A';
                      })()}
                    </span>
                  </div>

                  {/* Get Directions Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openGoogleMaps(business.latitude, business.longitude, business.businessName);
                    }}
                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                    Get Directions
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


