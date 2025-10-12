import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Store, Navigation, Clock, Star, MapPin } from 'lucide-react';
import OfferCard from './atoms/OfferCard';
import BackButton from './atoms/BackButton';
import SharePopup from './atoms/SharePopup';
import DirectionPopup from './atoms/DirectionPopup';
import BottomNavigation from './atoms/BottomNavigation';

interface NearbyStoresScreenProps {
  onBack: () => void;
  onOfferClick: (offer: any) => void;
  onLikeCountChange?: (count: number) => void;
  onNavigate?: (screen: string, data?: any) => void;
}

interface StoreData {
  id: string;
  name: string;
  category: string;
  distance: string;
  rating: number;
  address: string;
  image: string;
  offers: any[];
}

export default function NearbyStoresScreen({ 
  onBack, 
  onOfferClick,
  onLikeCountChange,
  onNavigate
}: NearbyStoresScreenProps) {
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [likedOffers, setLikedOffers] = useState<number[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showDirectionPopup, setShowDirectionPopup] = useState(false);
  const [directionData, setDirectionData] = useState<any>(null);

  const nearbyStores: StoreData[] = [
    {
      id: 'dominos_koramangala',
      name: "Domino's Pizza",
      category: 'Food',
      distance: '0.5 km',
      rating: 4.2,
      address: 'Koramangala 4th Block, Near BDA Complex',
      image: 'https://images.unsplash.com/photo-1594398028856-f253a046f417?w=400',
      offers: [
        { id: 31, title: "Family Combo Deal", description: '2 Large Pizzas + Sides + Drinks', originalPrice: 899, discountedPrice: 449, discount: 50, distance: '0.5 km', address: 'Koramangala 4th Block', rating: 4.2, image: 'https://images.unsplash.com/photo-1594398028856-f253a046f417?w=400', category: 'Food' },
        { id: 32, title: "Tuesday Special", description: 'Buy 1 Get 1 Free on Medium Pizzas', originalPrice: 599, discountedPrice: 299, discount: 50, distance: '0.5 km', address: 'Koramangala 4th Block', rating: 4.2, image: 'https://images.unsplash.com/photo-1594398028856-f253a046f417?w=400', category: 'Food' }
      ]
    },
    {
      id: 'zara_forum',
      name: "Zara",
      category: 'Fashion',
      distance: '0.7 km',
      rating: 4.5,
      address: 'Forum Mall, Koramangala',
      image: 'https://images.unsplash.com/photo-1575111507952-2d4f371374f5?w=400',
      offers: [
        { id: 33, title: "Winter Collection Sale", description: 'Up to 60% off on jackets and coats', originalPrice: 2999, discountedPrice: 1199, discount: 60, distance: '0.7 km', address: 'Forum Mall Koramangala', rating: 4.5, image: 'https://images.unsplash.com/photo-1575111507952-2d4f371374f5?w=400', category: 'Fashion' },
        { id: 34, title: "New Arrivals", description: 'Latest fashion trends at special prices', originalPrice: 1999, discountedPrice: 1599, discount: 20, distance: '0.7 km', address: 'Forum Mall Koramangala', rating: 4.5, image: 'https://images.unsplash.com/photo-1575111507952-2d4f371374f5?w=400', category: 'Fashion' }
      ]
    },
    {
      id: 'samsung_store',
      name: "Samsung Brand Store",
      category: 'Electronics',
      distance: '1.2 km',
      rating: 4.3,
      address: 'Phoenix Mall, Food Court Level',
      image: 'https://images.unsplash.com/photo-1723910168805-e783bc5c15c0?w=400',
      offers: [
        { id: 35, title: "Galaxy S24 Launch Offer", description: '₹15K off + Exchange bonus', originalPrice: 74999, discountedPrice: 59999, discount: 20, distance: '1.2 km', address: 'Phoenix Mall', rating: 4.3, image: 'https://images.unsplash.com/photo-1723910168805-e783bc5c15c0?w=400', category: 'Electronics' },
        { id: 36, title: "Smart TV Festival", description: '40% off on all smart TVs', originalPrice: 45999, discountedPrice: 27599, discount: 40, distance: '1.2 km', address: 'Phoenix Mall', rating: 4.3, image: 'https://images.unsplash.com/photo-1723910168805-e783bc5c15c0?w=400', category: 'Electronics' }
      ]
    },
    {
      id: 'starbucks_indiranagar',
      name: "Starbucks Coffee",
      category: 'Food',
      distance: '2.1 km',
      rating: 4.4,
      address: '100 Feet Road, Indiranagar',
      image: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?w=400',
      offers: [
        { id: 37, title: "Happy Hours", description: 'Buy 2 Get 1 Free on all beverages', originalPrice: 600, discountedPrice: 400, discount: 33, distance: '2.1 km', address: '100 Feet Road', rating: 4.4, image: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?w=400', category: 'Food' },
        { id: 38, title: "Coffee + Snack Combo", description: 'Special combo deals all day', originalPrice: 450, discountedPrice: 299, discount: 34, distance: '2.1 km', address: '100 Feet Road', rating: 4.4, image: 'https://images.unsplash.com/photo-1459755486867-b55449bb39ff?w=400', category: 'Food' }
      ]
    }
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

  const handleStoreDirections = (store: StoreData) => {
    setDirectionData({
      storeName: store.name,
      storeAddress: store.address,
      distance: store.distance,
      estimatedTime: `${Math.ceil(parseFloat(store.distance) * 4)} min`
    });
    setShowDirectionPopup(true);
  };

  const handleStoreClick = (storeId: string) => {
    setSelectedStore(storeId);
  };

  const handleBackToStores = () => {
    setSelectedStore(null);
  };

  const currentStore = nearbyStores.find(store => store.id === selectedStore);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white px-4 py-3 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <BackButton onClick={selectedStore ? handleBackToStores : onBack} />
          <h1 className="text-lg font-bold text-gray-900">
            {selectedStore ? currentStore?.name : 'Nearby Stores'}
          </h1>
          <div className="w-8" />
        </div>
      </motion.div>

      {!selectedStore ? (
        /* Stores List */
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {nearbyStores.map((store) => (
            <motion.div
              key={store.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="flex">
                <div 
                  className="relative w-24 h-24 cursor-pointer"
                  onClick={() => handleStoreClick(store.id)}
                >
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 right-1 bg-white/90 px-1 py-0.5 rounded text-xs font-semibold text-gray-800">
                    {store.offers.length}
                  </div>
                </div>
                
                <div className="flex-1 p-3">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex-1" onClick={() => handleStoreClick(store.id)}>
                      <h3 className="font-semibold text-sm text-gray-900">{store.name}</h3>
                      <p className="text-xs text-gray-600">{store.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{store.rating}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600">{store.distance}</span>
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-2 line-clamp-1">{store.address}</p>
                  
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleStoreClick(store.id)}
                      className="flex items-center space-x-1 text-xs text-purple-600 hover:text-purple-700"
                    >
                      <Store className="w-3 h-3" />
                      <span>View Offers ({store.offers.length})</span>
                    </button>
                    <button
                      onClick={() => handleStoreDirections(store)}
                      className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Directions</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Store Offers */
        <div className="flex-1 overflow-y-auto">
          {/* Store Info */}
          <div className="bg-white px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3 mb-2">
              <img
                src={currentStore?.image}
                alt={currentStore?.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">{currentStore?.name}</h2>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span>{currentStore?.rating}</span>
                  <span>•</span>
                  <span>{currentStore?.category}</span>
                </div>
              </div>
              <button
                onClick={() => currentStore && handleStoreDirections(currentStore)}
                className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 px-3 py-1 border border-blue-200 rounded-lg"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>{currentStore?.address}</span>
              <span>•</span>
              <span>{currentStore?.distance} away</span>
            </div>
          </div>

          {/* Store Offers */}
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">
              Available Offers ({currentStore?.offers.length})
            </h3>
            
            {currentStore?.offers.map((offer) => (
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
          </div>
        </div>
      )}

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