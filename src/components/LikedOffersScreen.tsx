import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Heart, Share2, Navigation, Star, Trash2, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import BottomNavigation from './atoms/BottomNavigation';
import { useLikedOffers } from './atoms/LikedOffersManager';

interface LikedOffersScreenProps {
  onBack: () => void;
  onViewDetails?: (offer: any) => void;
  onNavigate?: (screen: string, data?: any) => void;
}

export default function LikedOffersScreen({ onBack, onViewDetails, onNavigate }: LikedOffersScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const { likedOffers, removeLikedOffer } = useLikedOffers();

  const categories = ['All', 'Food', 'Fashion', 'Beauty', 'Fitness', 'Electronics'];

  const removeFromLiked = (offerId: number) => {
    removeLikedOffer(offerId);
  };

  const filteredItems = likedOffers.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatLikedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white px-4 py-3 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Liked Offers</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{likedOffers.length} items</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search liked offers..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm" className="px-3">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-4 py-3 bg-white border-b border-gray-100"
      >
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                filterCategory === category
                  ? 'bg-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8"
          >
            <Heart className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || filterCategory !== 'All' ? 'No results found' : 'No liked offers yet'}
            </h3>
            <p className="text-gray-500 text-center mb-6">
              {searchQuery || filterCategory !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start liking offers to see them here'
              }
            </p>
            <Button onClick={onBack} className="bg-red-500 hover:bg-red-600">
              Explore Offers
            </Button>
          </motion.div>
        ) : (
          <div className="p-4 space-y-4">
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <div className="flex">
                    {/* Image */}
                    <div className="relative w-24 h-24">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                        {item.discount}% OFF
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                          
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-green-600">₹{item.discountedPrice}</span>
                              <span className="text-xs text-gray-400 line-through">₹{item.originalPrice}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-current" />
                              <span className="text-xs text-gray-600">{item.rating}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <span>{item.distance} • {item.address}</span>
                          </div>
                          
                          <div className="text-xs text-red-400">
                            Liked {formatLikedDate(item.likedAt)}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col space-y-2 ml-3">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removeFromLiked(item.id)}
                            className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                          >
                            <Heart className="w-4 h-4 text-red-500 fill-current" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                          >
                            <Share2 className="w-4 h-4 text-blue-500" />
                          </motion.button>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-red-500 hover:bg-red-600"
                          onClick={() => onViewDetails?.(item)}
                        >
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center space-x-1">
                          <Navigation className="w-3 h-3" />
                          <span>Directions</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {filteredItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-t border-gray-200 p-4 pb-20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Total Potential Savings
              </p>
              <p className="text-lg font-bold text-green-600">
                ₹{filteredItems.reduce((sum, item) => sum + (item.originalPrice - item.discountedPrice), 0)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">{filteredItems.length} offers</p>
              <p className="text-xs text-gray-400">liked by you</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeScreen="profile"
        onNavigate={onNavigate || (() => {})}
      />
    </div>
  );
}