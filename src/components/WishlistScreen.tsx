import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Heart, Share2, Navigation, Star, Trash2, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import BottomNavigation from './atoms/BottomNavigation';

interface WishlistScreenProps {
  onBack: () => void;
  onViewDetails?: (offer: any) => void;
  onNavigate?: (screen: string, data?: any) => void;
}

export default function WishlistScreen({ onBack, onViewDetails, onNavigate }: WishlistScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      title: "Domino's Pizza",
      category: 'Food',
      description: 'Family Combo Deal - 2 Large Pizzas + Sides',
      originalPrice: 899,
      discountedPrice: 449,
      discount: 50,
      distance: '0.8 km',
      address: 'Phoenix Mall, Food Court',
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1594398028856-f253a046f417?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHJlc3RhdXJhbnQlMjBmb29kJTIwb2ZmZXJzfGVufDF8fHx8MTc1Nzc0ODA4MHww&ixlib=rb-4.1.0&q=80&w=1080',
      validity: 'Valid till 31 Dec 2024',
      addedDate: '2 days ago'
    },
    {
      id: 2,
      title: 'Zara Fashion Store',
      category: 'Fashion',
      description: 'Winter Collection - Jackets & Coats',
      originalPrice: 2999,
      discountedPrice: 1799,
      discount: 40,
      distance: '1.2 km',
      address: 'City Center Mall, Level 2',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1575111507952-2d4f371374f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBzdG9yZSUyMGRlYWxzfGVufDF8fHx8MTc1Nzc0ODA4MHww&ixlib=rb-4.1.0&q=80&w=1080',
      validity: 'Valid till 15 Jan 2024',
      addedDate: '1 week ago'
    },
    {
      id: 3,
      title: 'Lakme Salon',
      category: 'Beauty',
      description: 'Premium Facial Package + Hair Spa',
      originalPrice: 3500,
      discountedPrice: 1750,
      discount: 50,
      distance: '0.9 km',
      address: 'Beauty Boulevard, 1st Floor',
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1752504704326-1c24e2814b14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dHklMjBzYWxvbiUyMHNwYSUyMHNlcnZpY2VzfGVufDF8fHx8MTc1Nzc0ODA4MXww&ixlib=rb-4.1.0&q=80&w=1080',
      validity: 'Valid till 5 Jan 2024',
      addedDate: '3 days ago'
    },
    {
      id: 4,
      title: 'Gold\'s Gym',
      category: 'Fitness',
      description: '3 Month Premium Membership',
      originalPrice: 15000,
      discountedPrice: 9999,
      discount: 33,
      distance: '1.5 km',
      address: 'Fitness Plaza, 2nd Floor',
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1716348300558-c81409ed958a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBmaXRuZXNzJTIwY2VudGVyJTIwbWVtYmVyc2hpcHxlbnwxfHx8fDE3NTc3NDgwODJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      validity: 'Valid till 20 Jan 2024',
      addedDate: '5 days ago'
    }
  ]);

  const categories = ['All', 'Food', 'Fashion', 'Beauty', 'Fitness', 'Electronics'];

  const removeFromWishlist = (itemId: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const filteredItems = wishlistItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
          <h1 className="text-lg font-semibold text-gray-900">My Wishlist</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{wishlistItems.length} items</span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search wishlist..."
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
                  ? 'bg-purple-500 text-white shadow-lg'
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
              {searchQuery || filterCategory !== 'All' ? 'No results found' : 'Your wishlist is empty'}
            </h3>
            <p className="text-gray-500 text-center mb-6">
              {searchQuery || filterCategory !== 'All' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start adding offers to your wishlist to see them here'
              }
            </p>
            <Button onClick={onBack} className="bg-purple-600 hover:bg-purple-700">
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
                          
                          <div className="text-xs text-gray-400">
                            Added {item.addedDate}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex flex-col space-y-2 ml-3">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removeFromWishlist(item.id)}
                            className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
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
                          className="flex-1 bg-purple-600 hover:bg-purple-700"
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
              <p className="text-xs text-gray-400">in your wishlist</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeScreen="wishlist"
        onNavigate={onNavigate || (() => {})}
      />
    </div>
  );
}