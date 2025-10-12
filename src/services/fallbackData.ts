export const fallbackOffers = [
  {
    id: 'fallback-1',
    title: "McDonald's",
    category: 'Food',
    description: 'Buy 1 Get 1 Free on all burgers',
    originalPrice: 299,
    discountedPrice: 149,
    discount: 50,
    distance: '0.5 km',
    address: 'Commercial Street, Bangalore',
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1594398028856-f253a046f417?w=400',
    validity: 'Valid today',
    isEndingSoon: true,
    isFallback: true
  },
  {
    id: 'fallback-2',
    title: 'Pizza Hut',
    category: 'Food',
    description: 'Extra Large Pizza @ Just ₹399',
    originalPrice: 699,
    discountedPrice: 399,
    discount: 43,
    distance: '0.8 km',
    address: 'Commercial Street, Bangalore',
    rating: 4.1,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    validity: 'Valid today',
    isEndingSoon: false,
    isFallback: true
  },
  {
    id: 'fallback-3',
    title: 'Big Bazaar',
    category: 'Grocery',
    description: 'Flat 30% off on groceries',
    originalPrice: 1000,
    discountedPrice: 700,
    discount: 30,
    distance: '1.2 km',
    address: 'Commercial Street, Bangalore',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400',
    validity: 'Valid today',
    isEndingSoon: false,
    isFallback: true
  },
  {
    id: 'fallback-4',
    title: 'Reliance Digital',
    category: 'Electronics',
    description: 'Smartphones starting at ₹9,999',
    originalPrice: 15999,
    discountedPrice: 9999,
    discount: 38,
    distance: '1.5 km',
    address: 'Commercial Street, Bangalore',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1723910168805-e783bc5c15c0?w=400',
    validity: 'Valid today',
    isEndingSoon: true,
    isFallback: true
  },
  {
    id: 'fallback-5',
    title: 'Lifestyle',
    category: 'Fashion',
    description: 'Upto 60% off on clothing',
    originalPrice: 2499,
    discountedPrice: 999,
    discount: 60,
    distance: '2.0 km',
    address: 'Commercial Street, Bangalore',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1575111507952-2d4f371374f5?w=400',
    validity: 'Valid today',
    isEndingSoon: false,
    isFallback: true
  },
  {
    id: 'fallback-6',
    title: 'Cafe Coffee Day',
    category: 'Food',
    description: 'Buy 2 Get 1 Free on all beverages',
    originalPrice: 450,
    discountedPrice: 300,
    discount: 33,
    distance: '0.3 km',
    address: 'Commercial Street, Bangalore',
    rating: 4.0,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    validity: 'Valid today',
    isEndingSoon: false,
    isFallback: true
  }
];

export const fallbackCategories = [
  { id: 'all', name: 'All' },
  { id: 'food', name: 'Food' },
  { id: 'grocery', name: 'Grocery' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'fitness', name: 'Fitness' }
];

export const getFallbackOffers = (category: string = 'All') => {
  if (category === 'All') {
    return fallbackOffers;
  }
  return fallbackOffers.filter(offer => offer.category === category);
};