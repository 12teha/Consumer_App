import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MapPin, Navigation, Clock } from 'lucide-react';
import OfferCard from './atoms/OfferCard';
import BackButton from './atoms/BackButton';
import SharePopup from './atoms/SharePopup';
import DirectionPopup from './atoms/DirectionPopup';
import BottomNavigation from './atoms/BottomNavigation';

interface NearbyAreasScreenProps {
  onBack: () => void;
  onOfferClick: (offer: any) => void;
  onLikeCountChange?: (count: number) => void;
  onNavigate?: (screen: string, data?: any) => void;
}

interface Area {
  id: string;
  name: string;
  distance: string;
  offersCount: number;
  popularStores: string[];
}

export default function NearbyAreasScreen({ 
  onBack, 
  onOfferClick,
  onLikeCountChange,
  onNavigate
}: NearbyAreasScreenProps) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [likedOffers, setLikedOffers] = useState<number[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showDirectionPopup, setShowDirectionPopup] = useState(false);
  const [directionData, setDirectionData] = useState<any>(null);

  const nearbyAreas: Area[] = [
    {
      id: 'koramangala',
      name: 'Koramangala',
      distance: '0.5 km',
      offersCount: 45,
      popularStores: ['Domino\'s', 'Zara', 'Samsung Store']
    },
    {
      id: 'indiranagar',
      name: 'Indiranagar',
      distance: '2.1 km',
      offersCount: 38,
      popularStores: ['Starbucks', 'H&M', 'Apple Store']
    },
    {
      id: 'whitefield',
      name: 'Whitefield',
      distance: '8.5 km',
      offersCount: 52,
      popularStores: ['McDonald\'s', 'Nike', 'LG Store']
    },
    {
      id: 'jayanagar',
      name: 'Jayanagar',
      distance: '4.2 km',
      offersCount: 29,
      popularStores: ['Cafe Coffee Day', 'Puma', 'Lakme Salon']
    },
    {
      id: 'btm',
      name: 'BTM Layout',
      distance: '3.8 km',
      offersCount: 33,
      popularStores: ['Pizza Hut', 'Adidas', 'Samsung']
    },
    {
      id: 'malleshwaram',
      name: 'Malleshwaram',
      distance: '6.1 km',
      offersCount: 26,
      popularStores: ['Taco Bell', 'Uniqlo', 'OnePlus Store']
    }
  ];

  const areaOffers: { [key: string]: any[] } = {
    koramangala: [
      { id: 21, title: "Domino's Pizza Koramangala", category: 'Food', description: 'Family Combo Deal - 2 Large Pizzas', originalPrice: 899, discountedPrice: 449, discount: 50, distance: '0.5 km', address: 'Koramangala 4th Block', rating: 4.2, image: 'https://images.unsplash.com/photo-1594398028856-f253a046f417?w=400' },
      { id: 22, title: "Zara Koramangala Store", category: 'Fashion', description: 'Winter Collection Sale', originalPrice: 2999, discountedPrice: 1799, discount: 40, distance: '0.7 km', address: 'Forum Mall Koramangala', rating: 4.5, image: 'https://images.unsplash.com/photo-1575111507952-2d4f371374f5?w=400' },
    ],
    indiranagar: [
      { id: 23, title: "Starbucks Indiranagar", category: 'Food', description: 'Buy 2 Get 1 Free on beverages', originalPrice: 600, discountedPrice: 400, discount: 33, distance: '2.1 km', address: '100 Feet Road', rating: 4.4, image: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?w=400' },
      { id: 24, title: "H&M Indiranagar", category: 'Fashion', description: 'Party Wear Collection', originalPrice: 1999, discountedPrice: 999, discount: 50, distance: '2.3 km', address: 'Garuda Mall', rating: 4.3, image: 'https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?w=400' },
    ],
    whitefield: [
      { id: 25, title: "McDonald's Whitefield", category: 'Food', description: 'McCombo Meals at special price', originalPrice: 350, discountedPrice: 199, discount: 43, distance: '8.5 km', address: 'Phoenix MarketCity', rating: 4.1, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400' },
      { id: 26, title: "Nike Store Whitefield", category: 'Fitness', description: 'Athletic Wear Sale', originalPrice: 4999, discountedPrice: 3999, discount: 20, distance: '8.7 km', address: 'VR Bengaluru', rating: 4.2, image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5a?w=400' },
    ]
  };

  const handleLikeOffer = (offerId: number, liked: boolean) => {
    setLikedOffers(prev => {
      const newLiked = liked 
        ? [...prev, offerId]
        : prev.filter(id => id !== offerId);
      
      setTimeout(() => {
        onLikeCountChange?.(newLiked.length);
        localStorage.setItem('wishlistOffers', JSON.stringify(newLiked));
      }, 0);
      
      return newLiked;
    });
  };

  const handleShare = (offer: any) => {
    setSelectedOffer(offer);
    setShowSharePopup(true);
  };

  const handleGetDirections = (offer: any) => {
    setDirectionData({
      storeName: offer.title,
      storeAddress: offer.address,
      distance: offer.distance,
      estimatedTime: `${Math.ceil(parseFloat(offer.distance) * 4)} min`
    });
    setShowDirectionPopup(true);
  };

  const handleAreaClick = (areaId: string) => {
    setSelectedArea(areaId);
  };

  const handleBackToAreas = () => {
    setSelectedArea(null);
  };

  const currentAreaOffers = selectedArea ? (areaOffers[selectedArea] || []) : [];
  const currentAreaData = nearbyAreas.find(area => area.id === selectedArea);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white px-4 py-3 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <BackButton onClick={selectedArea ? handleBackToAreas : onBack} />
          <h1 className="text-lg font-bold text-gray-900">
            {selectedArea ? currentAreaData?.name : 'Nearby Areas'}
          </h1>
          <div className="w-8" />
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {!selectedArea ? (
          /* Areas List */
          <motion.div
            key="areas"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-y-auto p-4 space-y-3"
          >
            {nearbyAreas.map((area) => (
              <motion.div
                key={area.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAreaClick(area.id)}
                className="bg-white rounded-xl p-4 shadow-sm cursor-pointer border border-gray-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold text-gray-900">{area.name}</h3>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Navigation className="w-4 h-4" />
                    <span>{area.distance}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-600 font-medium">
                    {area.offersCount} offers available
                  </span>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{Math.ceil(parseFloat(area.distance) * 4)} min</span>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-600">
                  Popular: {area.popularStores.join(', ')}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Area Offers */
          <motion.div
            key="offers"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 overflow-y-auto"
          >
            {/* Area Info */}
            <div className="bg-white px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    {currentAreaOffers.length} offers in {currentAreaData?.name}
                  </p>
                  <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                    <Navigation className="w-3 h-3" />
                    <span>{currentAreaData?.distance} away</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{Math.ceil(parseFloat(currentAreaData?.distance || '0') * 4)} min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Offers */}
            <div className="p-4 space-y-3">
              {currentAreaOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  layout="horizontal"
                  onLike={handleLikeOffer}
                  onShare={() => handleShare(offer)}
                  onGetDirections={() => handleGetDirections(offer)}
                  onClick={() => onOfferClick(offer)}
                  className="w-full"
                />
              ))}

              {currentAreaOffers.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No offers yet</h3>
                  <p className="text-gray-600">Check back soon for offers in {currentAreaData?.name}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Direction Popup */}
      {showDirectionPopup && directionData && (
        <DirectionPopup
          storeName={directionData.storeName}
          storeAddress={directionData.storeAddress}
          distance={directionData.distance}
          estimatedTime={directionData.estimatedTime}
        />
      )}

      {/* Share Popup */}
      <SharePopup
        isOpen={showSharePopup}
        onClose={() => setShowSharePopup(false)}
        offer={selectedOffer}
      />

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeScreen="location"
        onNavigate={onNavigate || (() => {})}
      />
    </div>
  );
}