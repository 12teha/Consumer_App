import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LikedOffer {
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
  likedAt: string;
}

interface LikedOffersContextType {
  likedOffers: LikedOffer[];
  addLikedOffer: (offer: any) => void;
  removeLikedOffer: (offerId: number) => void;
  isOfferLiked: (offerId: number) => boolean;
  getLikedOffersCount: () => number;
}

const LikedOffersContext = createContext<LikedOffersContextType | undefined>(undefined);

export const useLikedOffers = () => {
  const context = useContext(LikedOffersContext);
  if (!context) {
    throw new Error('useLikedOffers must be used within a LikedOffersProvider');
  }
  return context;
};

interface LikedOffersProviderProps {
  children: ReactNode;
  onLikeCountChange?: (count: number) => void;
}

export const LikedOffersProvider: React.FC<LikedOffersProviderProps> = ({ 
  children, 
  onLikeCountChange 
}) => {
  const [likedOffers, setLikedOffers] = useState<LikedOffer[]>([]);

  const addLikedOffer = (offer: any) => {
    const likedOffer: LikedOffer = {
      ...offer,
      likedAt: new Date().toISOString()
    };
    
    setLikedOffers(prev => {
      const newOffers = [...prev, likedOffer];
      onLikeCountChange?.(newOffers.length);
      return newOffers;
    });
  };

  const removeLikedOffer = (offerId: number) => {
    setLikedOffers(prev => {
      const newOffers = prev.filter(offer => offer.id !== offerId);
      onLikeCountChange?.(newOffers.length);
      return newOffers;
    });
  };

  const isOfferLiked = (offerId: number) => {
    return likedOffers.some(offer => offer.id === offerId);
  };

  const getLikedOffersCount = () => {
    return likedOffers.length;
  };

  const value: LikedOffersContextType = {
    likedOffers,
    addLikedOffer,
    removeLikedOffer,
    isOfferLiked,
    getLikedOffersCount
  };

  return (
    <LikedOffersContext.Provider value={value}>
      {children}
    </LikedOffersContext.Provider>
  );
};