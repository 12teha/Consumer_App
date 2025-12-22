import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import OfferCard from './atoms/OfferCard';
import BottomNavigation from './atoms/BottomNavigation';
import { apiService } from '../services/api';

interface ExchangeOffersScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  offers?: any[];
}

const ExchangeOffersScreen: React.FC<ExchangeOffersScreenProps> = ({ onNavigate, offers: propsOffers }) => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propsOffers && propsOffers.length > 0) {
      setOffers(propsOffers);
      setLoading(false);
    } else {
      loadOffers();
    }
  }, [propsOffers]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOffers({
        radius: 25,
        limit: 100
      });

      const apiOffers = response.offers || [];

      const mappedOffers = apiOffers
        .filter((offer: any) => offer.calculationType === "EXCHANGE_DISCOUNT")
        .map((offer: any) => {
          let distance = "N/A";
          const currentLocation = JSON.parse(localStorage.getItem('userLocation') || '{}');

          if (offer.business?.latitude && offer.business?.longitude && currentLocation?.latitude) {
            const lat1 = parseFloat(currentLocation.latitude);
            const lon1 = parseFloat(currentLocation.longitude);
            const lat2 = parseFloat(offer.business.latitude);
            const lon2 = parseFloat(offer.business.longitude);

            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const d = R * c;
            distance = `${d.toFixed(1)} km`;
          }

          return {
            id: offer.id,
            title: offer.title || offer.business?.business_name || "Offer",
            category: offer.business?.businessCategory?.[0]?.categoryName || "General",
            description: offer.description || offer.toc || "",
            originalPrice: parseFloat(offer.originalPrice || "0"),
            discountedPrice: parseFloat(offer.discountedPrice || "0"),
            discount: parseInt(offer.discountPercentage || "0"),
            distance: distance,
            address: offer.business?.address || "Location not available",
            rating: 4.0,
            image: offer.imagesUrl?.[0] || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400",
            validity: offer.endDateTime ? `Valid till ${new Date(offer.endDateTime).toLocaleDateString()}` : "Limited time",
            offerType: 'exchange',
            apiData: offer
          };
        });

      setOffers(mappedOffers);
      setLoading(false);
    } catch (error) {
      console.error("Error loading exchange offers:", error);
      setOffers([]);
      setLoading(false);
    }
  };

  const exchangeOffers = useMemo(() => {
    return offers.filter(o => o.offerType === 'exchange');
  }, [offers]);

  const handleGetDirections = (offer: any) => {
    const address = encodeURIComponent(`${offer.address}, Bangalore`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-6 h-6" />
            <h1 className="text-xl">Exchange Offers</h1>
          </div>
        </div>
        <p className="text-sm opacity-90 ml-14">
          {loading ? 'Loading...' : `${exchangeOffers.length} exchange offers with best value`}
        </p>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 mb-16">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        ) : exchangeOffers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <RefreshCw className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Exchange Offers</h3>
            <p className="text-gray-500">Check back later for amazing deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {exchangeOffers.map((offer, index) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <OfferCard
                  offer={offer}
                  onLike={() => {}}
                  onGetDirections={() => handleGetDirections(offer)}
                  onClick={() => onNavigate('offerDetails', { offer: offer.apiData || offer })}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeScreen="home" onNavigate={onNavigate} />
    </div>
  );
};

export default ExchangeOffersScreen;