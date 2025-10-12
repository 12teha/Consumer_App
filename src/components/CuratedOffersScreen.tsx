import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, TrendingUp, Clock } from 'lucide-react';
import OfferCard from './atoms/OfferCard';
import BackButton from './atoms/BackButton';
import SharePopup from './atoms/SharePopup';
import DirectionPopup from './atoms/DirectionPopup';

interface CuratedOffersScreenProps {
  onBack: () => void;
  onOfferClick: (offer: any) => void;
  onLikeCountChange?: (count: number) => void;
}

export default function CuratedOffersScreen({ 
  onBack, 
  onOfferClick,
  onLikeCountChange 
}: CuratedOffersScreenProps) {
  const [selectedTab, setSelectedTab] = useState('trending');
  const [likedOffers, setLikedOffers] = useState<number[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showDirectionPopup, setShowDirectionPopup] = useState(false);
  const [directionData, setDirectionData] = useState<any>(null);

  // Sample curated offers
  const curatedOffers = {
    trending: [
      { id: 11, title: "Trending: Starbucks Coffee", category: 'Food', description: 'Buy 2 Get 1 Free on all beverages', originalPrice: 600, discountedPrice: 400, discount: 33, distance: '0.5 km', address: 'UB City Mall', rating: 4.5, image: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?w=400', validity: 'Valid till 31 Dec 2024' },
      { id: 12, title: "Popular: Uniqlo Fashion", category: 'Fashion', description: 'Winter Collection Sale - Up to 60% off', originalPrice: 2500, discountedPrice: 1000, discount: 60, distance: '1.1 km', address: 'Phoenix Mall', rating: 4.3, image: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=400', validity: 'Valid till 15 Jan 2024' },
      { id: 13, title: "Hot Deal: OnePlus Store", category: 'Electronics', description: 'OnePlus 12 with exclusive offers', originalPrice: 64999, discountedPrice: 54999, discount: 15, distance: '2.3 km', address: 'Forum Mall', rating: 4.4, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', validity: 'Valid till 30 Dec 2024' }
    ],
    recent: [
      { id: 14, title: "New: Taco Bell", category: 'Food', description: 'Newly opened! 50% off on first order', originalPrice: 400, discountedPrice: 200, discount: 50, distance: '0.8 km', address: 'Brigade Road', rating: 4.1, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400', validity: 'Valid till 31 Jan 2024' },
      { id: 15, title: "Fresh Launch: Nykaa Beauty", category: 'Beauty', description: 'Grand opening offers - Up to 40% off', originalPrice: 1500, discountedPrice: 900, discount: 40, distance: '1.5 km', address: 'Indiranagar', rating: 4.6, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', validity: 'Valid till 28 Feb 2024' }
    ],
    personalized: [
      { id: 16, title: "For You: Cult.fit Gym", category: 'Fitness', description: 'Based on your interests - 3 months free', originalPrice: 3000, discountedPrice: 1500, discount: 50, distance: '0.6 km', address: 'Koramangala', rating: 4.2, image: 'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=400', validity: 'Valid till 31 Mar 2024' },
      { id: 17, title: "Recommended: Bookworm Cafe", category: 'Food', description: 'Perfect for book lovers - 25% off', originalPrice: 800, discountedPrice: 600, discount: 25, distance: '1.2 km', address: 'Whitefield', rating: 4.0, image: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=400', validity: 'Valid till 15 Jan 2024' }
    ]
  };

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'recent', label: 'Recently Added', icon: Clock },
    { id: 'personalized', label: 'For You', icon: Sparkles }
  ];

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

  const currentOffers = curatedOffers[selectedTab as keyof typeof curatedOffers] || [];

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white px-4 py-3 shadow-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <BackButton onClick={onBack} />
          <h1 className="text-lg font-bold text-gray-900">Curated for You</h1>
          <div className="w-8" />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-md text-xs transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Tab Description */}
      <div className="bg-white px-4 py-2 border-b border-gray-100">
        <p className="text-sm text-gray-600">
          {selectedTab === 'trending' && "Most popular offers in your area"}
          {selectedTab === 'recent' && "Fresh offers added in the last 7 days"}
          {selectedTab === 'personalized' && "Handpicked offers based on your preferences"}
        </p>
      </div>

      {/* Offers */}
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {currentOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <OfferCard
                offer={offer}
                layout="horizontal"
                onLike={handleLikeOffer}
                onShare={() => handleShare(offer)}
                onGetDirections={() => handleGetDirections(offer)}
                onClick={() => onOfferClick(offer)}
                className="w-full"
              />
            </motion.div>
          ))}
        </motion.div>

        {currentOffers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No curated offers yet</h3>
            <p className="text-gray-600">Check back soon for personalized recommendations</p>
          </div>
        )}
      </div>

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
    </div>
  );
}