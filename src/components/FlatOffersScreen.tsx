import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Tag } from 'lucide-react';
import OfferCard from './atoms/OfferCard';
import BottomNavigation from './atoms/BottomNavigation';

interface FlatOffersScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

const FlatOffersScreen: React.FC<FlatOffersScreenProps> = ({ onNavigate }) => {
  const flatOffers = [
    { id: 2, title: 'Zara Fashion Store', category: 'Fashion', description: 'Winter Collection - Jackets & Coats', originalPrice: 2999, discountedPrice: 1799, discount: 40, distance: '1.2 km', address: 'City Center Mall', rating: 4.5, image: 'https://images.unsplash.com/photo-1575111507952-2d4f371374f5?w=400', validity: 'Valid till 15 Jan 2024', offerType: 'flat' },
    { id: 5, title: 'Nike Sports Store', category: 'Fitness', description: 'Athletic Wear & Shoes', originalPrice: 4999, discountedPrice: 3999, discount: 20, distance: '1.8 km', address: 'Forum Mall', rating: 4.1, image: 'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=400', validity: 'Valid till 25 Dec 2024', offerType: 'flat' },
    { id: 9, title: 'Burger King', category: 'Food', description: 'Whopper Meal Combo', originalPrice: 299, discountedPrice: 199, discount: 33, distance: '1.1 km', address: 'Brigade Road', rating: 4.0, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', validity: 'Valid till 31 Dec 2024', offerType: 'flat' },
    { id: 10, title: 'Lifestyle Fashion', category: 'Fashion', description: 'Flat ₹1000 Off on Purchase', originalPrice: 4999, discountedPrice: 3999, discount: 20, distance: '1.5 km', address: 'Garuda Mall', rating: 4.2, image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400', validity: 'Valid till 15 Jan 2024', offerType: 'flat' },
    { id: 15, title: 'KFC', category: 'Food', description: 'Flat ₹100 Off on Orders Above ₹400', originalPrice: 499, discountedPrice: 399, discount: 20, distance: '0.9 km', address: 'MG Road', rating: 4.1, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400', validity: 'Valid till 28 Dec 2024', offerType: 'flat' },
    { id: 16, title: 'Adidas Store', category: 'Fitness', description: 'Flat ₹500 Off on Sports Shoes', originalPrice: 3999, discountedPrice: 3499, discount: 13, distance: '2.0 km', address: 'Phoenix Marketcity', rating: 4.4, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', validity: 'Valid till 10 Jan 2024', offerType: 'flat' }
  ];

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
        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Tag className="w-6 h-6" />
            <h1 className="text-xl">Flat Offers</h1>
          </div>
        </div>
        <p className="text-sm opacity-90 ml-14">
          {flatOffers.length} flat discount offers available
        </p>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 mb-16">
        <div className="grid grid-cols-2 gap-3">
          {flatOffers.map((offer, index) => (
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
                onClick={() => onNavigate('offerDetails', { offer })}
                hideActions={true}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeScreen="home" onNavigate={onNavigate} />
    </div>
  );
};

export default FlatOffersScreen;
