import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Navigation, Share2, Heart } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import LikeButton from './LikeButton';
import UserProfileIcons from './UserProfileIcons';
import ReviewSection from './ReviewSection';
import { useLikedOffers } from './LikedOffersManager';

interface OfferCardProps {
  offer: {
    id: number;
    title: string;
    category: string;
    description: string;
    originalPrice: number;
    discountedPrice: number;
    discount: number;
    distance: string;
    address: string;
    rating: number;
    image: string;
    validity?: string;
  };
  layout?: 'vertical' | 'horizontal';
  showTimer?: boolean;
  onLike?: (offerId: number, liked: boolean) => void;
  onShare?: () => void;
  onGetDirections?: () => void;
  onClick?: () => void;
  className?: string;
}

const OfferCard = React.memo(function OfferCard({ 
  offer, 
  layout = 'vertical', 
  showTimer = false, 
  onLike, 
  onShare,
  onGetDirections,
  onClick, 
  className = "" 
}: OfferCardProps) {
  const [showUserProfiles, setShowUserProfiles] = useState(false);
  const [showReviewSection, setShowReviewSection] = useState(false);
  const { addLikedOffer, removeLikedOffer, isOfferLiked } = useLikedOffers();
  const isLiked = isOfferLiked(offer.id);

  const handleLike = (liked: boolean) => {
    if (liked) {
      addLikedOffer(offer);
    } else {
      removeLikedOffer(offer.id);
    }
    onLike?.(offer.id, liked);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.();
  };

  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    onGetDirections?.();
  };

  const handleReviewClick = () => {
    setShowUserProfiles(false);
    setShowReviewSection(true);
  };

  if (layout === 'horizontal') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer ${className}`}
      >
        <div className="flex">
          <div className="relative w-32 h-32 bg-gray-50 flex-shrink-0">
            <ImageWithFallback
              src={offer.image}
              alt={offer.title}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
              {offer.discount}% OFF
            </div>
          </div>
          
          <div className="flex-1 p-3">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-semibold text-sm text-gray-900 truncate flex-1">{offer.title}</h3>
              <LikeButton isLiked={isLiked} onLike={handleLike} className="ml-2 -mt-1" />
            </div>
            
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{offer.description}</p>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-green-600">₹{offer.discountedPrice}</span>
                <span className="text-xs text-gray-400 line-through">₹{offer.originalPrice}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-600">{offer.rating}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={handleGetDirections}
                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <Navigation className="w-3 h-3" />
                <span>Directions</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-700"
              >
                <Share2 className="w-3 h-3" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer min-w-[200px] ${className}`}
    >
      <div className="relative bg-gray-50">
        <ImageWithFallback
          src={offer.image}
          alt={offer.title}
          className="w-full h-40 object-contain"
        />
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          {offer.discount}% OFF
        </div>
        <div className="absolute top-2 right-2">
          <LikeButton isLiked={isLiked} onLike={handleLike} className="bg-white/80 hover:bg-white" />
        </div>
        {showTimer && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            23h 45m left
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">{offer.title}</h3>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{offer.description}</p>
        
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-sm font-bold text-green-600">₹{offer.discountedPrice}</span>
            <span className="text-xs text-gray-400 line-through ml-1">₹{offer.originalPrice}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600">{offer.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
          <span>{offer.distance}</span>
          <span>{offer.category}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            onClick={handleGetDirections}
            className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700"
          >
            <Navigation className="w-3 h-3" />
            <span>Directions</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-700"
          >
            <Share2 className="w-3 h-3" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* User Profiles Popup */}
      <UserProfileIcons 
        isOpen={showUserProfiles}
        onClose={() => setShowUserProfiles(false)}
        onReviewClick={handleReviewClick}
      />

      {/* Review Section */}
      <ReviewSection 
        isOpen={showReviewSection}
        onClose={() => setShowReviewSection(false)}
        offer={offer}
      />
    </motion.div>
  );
});

export default OfferCard;