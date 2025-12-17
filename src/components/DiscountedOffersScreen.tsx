import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Percent } from 'lucide-react';
import OfferCard from './atoms/OfferCard';
import BottomNavigation from './atoms/BottomNavigation';

interface DiscountedOffersScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

const DiscountedOffersScreen: React.FC<DiscountedOffersScreenProps> = ({ onNavigate }) => {
  const discountedOffers = [
    { id: 1, title: "Domino's Pizza", category: 'Food', description: 'Family Combo Deal - 2 Large Pizzas + Sides', originalPrice: 899, discountedPrice: 449, discount: 50, distance: '0.8 km', address: 'Phoenix Mall, Food Court', rating: 4.2, image: 'https://images.unsplash.com/photo-1594398028856-f253a046f417?w=400', validity: 'Valid till 31 Dec 2024', offerType: 'discounted' },
    { id: 4, title: 'Lakme Beauty Salon', category: 'Beauty', description: 'Hair & Skin Care Package', originalPrice: 3500, discountedPrice: 2450, discount: 30, distance: '0.5 km', address: 'Central Mall', rating: 4.4, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', validity: 'Valid till 20 Jan 2024', offerType: 'discounted' },
    { id: 7, title: 'H&M Fashion', category: 'Fashion', description: 'Summer Sale - Up to 60% Off', originalPrice: 3999, discountedPrice: 1599, discount: 60, distance: '2.3 km', address: 'Mantri Square Mall', rating: 4.6, image: 'https://images.unsplash.com/photo-1623332670442-4b6873fb6f03?w=400', validity: 'Valid till 10 Jan 2024', offerType: 'discounted' },
    { id: 12, title: 'Levi\'s Store', category: 'Fashion', description: 'Denim Days - 50% Off', originalPrice: 3499, discountedPrice: 1749, discount: 50, distance: '1.9 km', address: 'Phoenix Marketcity', rating: 4.4, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', validity: 'Valid till 8 Jan 2024', offerType: 'discounted' },
    { id: 13, title: 'Westside Fashion', category: 'Fashion', description: 'Mega Sale - Up to 70% Off', originalPrice: 2999, discountedPrice: 899, discount: 70, distance: '1.5 km', address: 'Forum Mall', rating: 4.3, image: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=400', validity: 'Valid till 5 Jan 2024', offerType: 'discounted' },
    { id: 14, title: 'Pantaloons', category: 'Fashion', description: 'Flat 40% Off on All Items', originalPrice: 1999, discountedPrice: 1199, discount: 40, distance: '2.1 km', address: 'City Center', rating: 4.2, image: 'https://images.unsplash.com/photo-1617887672042-559e78d5ae21?w=400', validity: 'Valid till 12 Jan 2024', offerType: 'discounted' }
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
        className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <Percent className="w-6 h-6" />
            <h1 className="text-xl">Discounted Offers</h1>
          </div>
        </div>
        <p className="text-sm opacity-90 ml-14">
          {discountedOffers.length} amazing discounted offers near you
        </p>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 mb-16">
        <div className="grid grid-cols-2 gap-3">
          {discountedOffers.map((offer, index) => (
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

export default DiscountedOffersScreen;
