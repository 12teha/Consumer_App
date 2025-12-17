import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import OfferCard from './atoms/OfferCard';
import BottomNavigation from './atoms/BottomNavigation';

interface ExchangeOffersScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

const ExchangeOffersScreen: React.FC<ExchangeOffersScreenProps> = ({ onNavigate }) => {
  const exchangeOffers = [
    { id: 3, title: 'Samsung Galaxy Store', category: 'Electronics', description: 'Galaxy S24 with ₹15K off + Exchange', originalPrice: 74999, discountedPrice: 59999, discount: 20, distance: '2.1 km', address: 'Tech Plaza', rating: 4.3, image: 'https://images.unsplash.com/photo-1723910168805-e783bc5c15c0?w=400', validity: 'Valid till 28 Dec 2024', offerType: 'exchange' },
    { id: 6, title: 'Big Bazaar Grocery', category: 'Grocery', description: 'Weekly Grocery Package', originalPrice: 1299, discountedPrice: 999, discount: 23, distance: '0.3 km', address: 'Metro Cash & Carry', rating: 3.9, image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400', validity: 'Valid till 30 Dec 2024', offerType: 'exchange' },
    { id: 8, title: 'Apple Store', category: 'Electronics', description: 'iPhone 15 with Trade-in', originalPrice: 79999, discountedPrice: 64999, discount: 19, distance: '3.5 km', address: 'UB City Mall', rating: 4.7, image: 'https://images.unsplash.com/photo-1611079167993-e57e6300c9b8?w=400', validity: 'Valid till 5 Jan 2024', offerType: 'exchange' },
    { id: 11, title: 'Decathlon', category: 'Fitness', description: 'Sports Equipment Exchange', originalPrice: 5999, discountedPrice: 4299, discount: 28, distance: '2.8 km', address: 'Sarjapur Road', rating: 4.3, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400', validity: 'Valid till 20 Jan 2024', offerType: 'exchange' },
    { id: 17, title: 'OnePlus Store', category: 'Electronics', description: 'OnePlus 12 with Exchange Bonus', originalPrice: 64999, discountedPrice: 54999, discount: 15, distance: '2.5 km', address: 'Brigade Road', rating: 4.5, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', validity: 'Valid till 15 Jan 2024', offerType: 'exchange' },
    { id: 18, title: 'Croma Electronics', category: 'Electronics', description: 'TV Exchange Offer - Up to ₹20K Off', originalPrice: 54999, discountedPrice: 34999, discount: 36, distance: '1.7 km', address: 'Indiranagar', rating: 4.2, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', validity: 'Valid till 25 Dec 2024', offerType: 'exchange' }
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
          {exchangeOffers.length} exchange offers with best value
        </p>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 mb-16">
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

export default ExchangeOffersScreen;
