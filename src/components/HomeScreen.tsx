import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, Clock, Star, Grid3X3, Home, Heart, MapPin, Zap, Store, Navigation, Loader
} from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import SearchBar from './atoms/SearchBar';
import CategoryIcon from './atoms/CategoryIcon';
import OfferCard from './atoms/OfferCard';
import Banner from './atoms/Banner';
import AdVideoPopup, { shouldShowAdVideo } from './atoms/AdVideoPopup';
import LocationButton from './atoms/LocationButton';
import NotificationPanel from './molecules/NotificationPanel';
import BackButton from './atoms/BackButton';
import SharePopup from './atoms/SharePopup';
import DirectionPopup from './atoms/DirectionPopup';
import AutoSlider from './atoms/AutoSlider';
import BottomNavigation from './atoms/BottomNavigation';
import { apiService } from '../services/api';
import LocationManager from './LocationManager';
import MapLocationPicker from './MapLocationPicker';
import { OfferListSkeleton } from './atoms/OfferCardSkeleton';
import { CategoryListSkeleton } from './atoms/CategorySkeleton';
import { formatAddress, isCoordinateString } from '../utils/addressFormatter';

interface HomeScreenProps {
  username: string;
  selectedCategory: string;
  onNavigate: (screen: any, data?: any) => void;
  onLikeCountChange?: (count: number) => void;
}

const HomeScreen = React.memo(function HomeScreen({ username, selectedCategory, onNavigate, onLikeCountChange }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAdVideo, setShowAdVideo] = useState(false);
  const [adVideoSide, setAdVideoSide] = useState<'left' | 'right'>('left');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showDirectionPopup, setShowDirectionPopup] = useState(false);
  const [directionData, setDirectionData] = useState<any>(null);
  const [userInactive, setUserInactive] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [showLocationManager, setShowLocationManager] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [offersError, setOffersError] = useState<string | null>(null);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load offers when category or location changes
  useEffect(() => {
    if (currentLocation) {
      loadOffers(1, activeCategory);
    }
  }, [activeCategory, currentLocation]);

  const loadInitialData = async () => {
    try {
      // Load categories in background
      setLoadingCategories(true);
      console.log('Loading categories...');
      const categoriesResponse = await apiService.getAllCategories();
      console.log('Categories response:', categoriesResponse);
      const fetchedCategories = categoriesResponse.categories || [];

      // Store full category data with images
      const allCategory = {
        name: 'All',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200'
      };

      // Map categories with proper image fallbacks based on category name
      const categoriesWithImages = fetchedCategories.map((cat: any) => {
        const categoryName = cat.categoryName || cat.name || 'Unknown';

        // Provide category-specific placeholder images
        const categoryImages: { [key: string]: string } = {
          'Clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
          'Fashion': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
          'fashion': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
          'Home & Life Style': 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=200',
          'Small-Scale Manufacturing': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200',
          'Wholesale & Distribution': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200',
          'Fashoin': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
        };

        return {
          name: categoryName,
          image: cat.image || categoryImages[categoryName] || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200'
        };
      });

      setCategoryData([allCategory, ...categoriesWithImages]);
      setCategories(['All', ...categoriesWithImages.map((cat: any) => cat.name)]);
      setLoadingCategories(false);

      // Check for saved location in localStorage first (for persistence across refreshes)
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        try {
          const parsedLocation = JSON.parse(savedLocation);
          console.log('Found saved location in localStorage:', parsedLocation);
          setCurrentLocation(parsedLocation);
          loadOffers(1, activeCategory);
          return;
        } catch (e) {
          console.error('Error parsing saved location:', e);
          localStorage.removeItem('userLocation');
        }
      }

      // Check for saved location from API
      console.log('Checking for saved location from API...');
      const locationResponse = await apiService.getUserLocation();
      console.log('Location response:', locationResponse);

      if (locationResponse && locationResponse.latitude && locationResponse.longitude) {
        // Save to localStorage for persistence
        localStorage.setItem('userLocation', JSON.stringify(locationResponse));
        setCurrentLocation(locationResponse);
        console.log('Location found, loading offers...');
        loadOffers(1, activeCategory);
      } else {
        // Show location manager but keep fallback offers visible
        console.log('No location found, showing location manager');
        setShowLocationManager(true);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      setLoadingCategories(false);

      // Try to use localStorage location as fallback
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        try {
          const parsedLocation = JSON.parse(savedLocation);
          setCurrentLocation(parsedLocation);
          loadOffers(1, activeCategory);
        } catch (e) {
          setShowLocationManager(true);
        }
      } else {
        setShowLocationManager(true);
      }
    }
  };

  const loadOffers = async (pageNum: number = 1, category: string = 'All') => {
    if (!currentLocation) {
      console.log('No location set, cannot load offers');
      setOffers([]);
      setOffersError('Please set your location to view offers');
      return;
    }

    try {
      setLoadingOffers(true);
      setOffersError(null);
      console.log(`Fetching offers - Page: ${pageNum}, Category: ${category}, Location:`, currentLocation);

      const response = await apiService.getOffers({
        radius: 10,
        page: pageNum,
        limit: 10,
        category: category
      });

      console.log('API Response:', response);
      const newOffers = (response.offers || []).map((offer: any) => {
        // Get the image URL from various possible field names
        let imageUrl = offer.imagesUrl || offer.offerImage || offer.offer_image || offer.image || '';

        // If imageUrl is an array, take the first element
        if (Array.isArray(imageUrl)) {
          imageUrl = imageUrl[0] || '';
        }

        // If the image URL contains comma-separated URLs, take only the first one
        if (imageUrl && typeof imageUrl === 'string' && imageUrl.includes(',')) {
          imageUrl = imageUrl.split(',')[0].trim();
        }

        // Fix placeholder.com URLs - replace with CloudFront domain
        if (imageUrl && typeof imageUrl === 'string' && imageUrl.includes('placeholder.com')) {
          imageUrl = imageUrl.replace('https://placeholder.com/', 'https://d24rozqnh2m4pk.cloudfront.net/');
        }

        // Calculate discount percentage if not provided
        const originalPrice = offer.originalPrice || offer.original_price || 0;
        const discountedPrice = offer.discountedPrice || offer.discounted_price || 0;
        let discount = offer.discount || offer.discountPercentage || 0;

        // If discount not provided, calculate it from prices
        if (!discount && originalPrice > 0 && discountedPrice > 0 && originalPrice > discountedPrice) {
          discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
        }

        return {
          ...offer,
          image: imageUrl,
          discount: discount
        };
      });
      console.log(`Received ${newOffers.length} offers from API`);

      if (newOffers.length > 0) {
        if (pageNum === 1) {
          setOffers(newOffers);
        } else {
          setOffers(prev => [...prev, ...newOffers]);
        }
        console.log('Offers loaded successfully');
      } else if (pageNum === 1) {
        setOffers([]);
        setOffersError('No offers available in your area');
      }

      setHasMore(newOffers.length === 10);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading offers:', error);
      if (pageNum === 1) {
        setOffers([]);
        setOffersError('Failed to load offers. Please try again.');
      }
    } finally {
      setLoadingOffers(false);
    }
  };

  const handleLocationSet = (location: any) => {
    // Save location to localStorage for persistence across refreshes
    localStorage.setItem('userLocation', JSON.stringify(location));
    setCurrentLocation(location);
    setShowLocationManager(false);
    // Clear offers cache when location changes
    apiService.clearOffersCache();
    loadOffers(1, activeCategory);
  };

  const handleLocationClick = () => {
    // Open embedded map picker
    setShowMapPicker(true);
  };

  const handleMapLocationSelect = async (location: { latitude: number; longitude: number; address: string }) => {
    // Update current location with selected map location
    const newLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address
    };

    // Save location to localStorage for persistence across refreshes
    localStorage.setItem('userLocation', JSON.stringify(newLocation));

    // Save location to API
    try {
      await apiService.setUserLocation(location.latitude, location.longitude, location.address);
      setCurrentLocation(newLocation);
      setShowMapPicker(false);
      // Reload offers with new location
      apiService.clearOffersCache();
      loadOffers(1, activeCategory);
    } catch (error) {
      console.error('Error saving location:', error);
      // Still update UI even if API call fails (localStorage already saved)
      setCurrentLocation(newLocation);
      setShowMapPicker(false);
    }
  };

  const banners = React.useMemo(() => [
    { 
      id: 1, 
      title: 'New Year Mega Sale', 
      subtitle: 'Up to 70% off on everything', 
      images: [
        'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600',
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600'
      ],
      color: 'from-red-500 to-pink-600', 
      offer: offers[0] 
    },
    { 
      id: 2, 
      title: 'Flash Weekend Deal', 
      subtitle: 'Limited time offers', 
      images: [
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600',
        'https://images.unsplash.com/photo-1594398028856-f253a046f417?w=600',
        'https://images.unsplash.com/photo-1575111507952-2d4f371374f5?w=600'
      ],
      color: 'from-blue-500 to-purple-600', 
      offer: offers[1] 
    },
    { 
      id: 3, 
      title: 'Special Discounts', 
      subtitle: 'Exclusive member offers', 
      images: [
        'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=600',
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600'
      ],
      color: 'from-green-500 to-teal-600', 
      offer: offers[2] 
    }
  ], [offers]);

  const adBanners = React.useMemo(() => [
    { id: 1, title: 'Fashion Week Special', subtitle: '60% off all brands', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200', color: 'from-pink-500 to-purple-600' },
    { id: 2, title: 'Electronics Bonanza', subtitle: 'Latest gadgets discounted', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200', color: 'from-blue-500 to-cyan-600' },
    { id: 3, title: 'Food Festival', subtitle: 'Order now, save big', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200', color: 'from-orange-500 to-red-600' }
  ], []);

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Increased interval to reduce frequency
    return () => clearInterval(interval);
  }, [banners.length]);

  // Show ad videos only first 2 times - optimized
  useEffect(() => {
    if (!shouldShowAdVideo()) return;
    
    const timer = setTimeout(() => {
      setAdVideoSide(Math.random() > 0.5 ? 'left' : 'right');
      setShowAdVideo(true);
      
      const hideTimer = setTimeout(() => setShowAdVideo(false), 5000);
      return () => clearTimeout(hideTimer);
    }, 25000); // Increased delay to reduce initial load impact
    
    return () => clearTimeout(timer);
  }, []); // Simplified dependency array

  // User inactivity detection for auto-sliding - optimized
  useEffect(() => {
    let inactivityTimeout: NodeJS.Timeout;
    
    const resetTimer = () => {
      setUserInactive(false);
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        setUserInactive(true);
      }, 20000); // Increased timeout
    };

    const handleActivity = () => resetTimer();
    
    // Use passive listeners for better performance
    document.addEventListener('touchstart', handleActivity, { passive: true });
    document.addEventListener('click', handleActivity, { passive: true });
    resetTimer();

    return () => {
      document.removeEventListener('touchstart', handleActivity);
      document.removeEventListener('click', handleActivity);
      clearTimeout(inactivityTimeout);
    };
  }, []); // Simplified dependency array

  const handleSearch = React.useCallback((query: string) => {
    try {
      setIsLoading(true);

      if (query.trim()) {
        const results = offers.filter(offer =>
          offer.title?.toLowerCase().includes(query.toLowerCase()) ||
          offer.description?.toLowerCase().includes(query.toLowerCase()) ||
          offer.category?.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
        setShowSearchResults(true);
      } else {
        setShowSearchResults(false);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [offers]);

  const handleLocationSearch = React.useCallback((location: string) => {
    try {
      setIsLoading(true);
      
      if (location.trim()) {
        // Simulate location-based offers with better performance
        const locationOffers = offers.slice(0, 6);
        setSearchResults(locationOffers);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error('Location search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [offers]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setLocationQuery('');
    setShowSearchResults(false);
    setSearchResults([]);
  };

  const handleLikeOffer = (offerId: number, liked: boolean) => {
    // This function is now handled by the LikedOffersManager context
    // The OfferCard component will handle the like functionality directly
  };

  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    setShowSearchResults(false);
    setSearchQuery('');
    setLocationQuery('');
    setSearchResults([]);

    // Always load offers (either real or fallback)
    loadOffers(1, category);
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

  const filteredOffers = React.useMemo(() => 
    activeCategory === 'All' 
      ? offers 
      : offers.filter(offer => offer.category === activeCategory),
    [offers, activeCategory]
  );

  const endingSoonOffers = React.useMemo(() => 
    offers.filter(offer => offer.isEndingSoon),
    [offers]
  );
  
  const latestOffers = React.useMemo(() => 
    offers.slice(0, 6), // Reduced to 6 for performance
    [offers]
  );

  // Remove loading screen - show content immediately with fallback data

  // Show location manager if no location is set
  if (showLocationManager) {
    return (
      <LocationManager
        onLocationSet={handleLocationSet}
        onSkip={() => setShowLocationManager(false)}
        showSkip={true}
      />
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header with OfferBeez Logo */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white px-4 py-3 shadow-sm"
      >
        {/* Logo at top center */}
        <div className="flex justify-center mb-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className="flex items-center justify-center"
          >
            <img
              src="/location logo- 2.png"
              alt="Logo"
              className="h-16 w-auto object-contain"
            />
          </motion.div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <LocationButton
            address={formatAddress(currentLocation?.address) || "Tap to set your location"}
            city=""
            onClick={handleLocationClick}
          />

          <div className="flex items-center space-x-3">
            <button
              className="relative"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            </button>
            <button onClick={() => onNavigate('profile')}>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Location Notice */}
        {!currentLocation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-50 border border-orange-200 rounded-lg p-2 mx-4 mb-2"
          >
            <p className="text-orange-700 text-xs text-center">
              📍 Please set your location to view nearby offers
            </p>
          </motion.div>
        )}
        {currentLocation?.address && isCoordinateString(currentLocation.address) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-2 mx-4 mb-2"
          >
            <p className="text-blue-700 text-xs text-center">
              📍 Tap location to set a readable address for better experience
            </p>
          </motion.div>
        )}

        {/* Enhanced Search Bar with Location Search */}
        <div className="space-y-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            onClear={handleClearSearch}
            showResults={showSearchResults}
          />
          
          <div className="relative">
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLocationSearch(locationQuery)}
              placeholder="Search by location (e.g., Indiranagar, Whitefield)"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <MapPin className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </motion.div>

      {/* Search Results */}
      <AnimatePresence>
        {showSearchResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white px-4 py-3 border-b border-gray-100"
          >
            <p className="text-sm text-gray-600 mb-3">
              {searchResults.length} results found
            </p>
            <div className="space-y-3">
              {searchResults && searchResults.slice(0, 3).map((offer) => (
                <OfferCard
                  key={`search-${offer.id}`}
                  offer={offer}
                  layout="horizontal"
                  onLike={handleLikeOffer}
                  onShare={() => handleShare(offer)}
                  onGetDirections={() => handleGetDirections(offer)}
                  onClick={() => onNavigate('offerDetails', { offer })}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Category Icons with All option */}
        {!showSearchResults && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="px-4 py-3 bg-white border-b border-gray-100"
          >
            {loadingCategories ? (
              <CategoryListSkeleton />
            ) : (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {categoryData.map((category) => (
                  <CategoryIcon
                    key={category.name}
                    name={category.name}
                    image={category.image || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200'}
                    isActive={activeCategory === category.name}
                    onClick={() => handleCategorySelect(category.name)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Sliding Banners */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-4 my-4"
        >
          <div className="relative h-40 rounded-xl overflow-hidden mb-4">
            {banners.map((banner, index) => (
              <Banner
                key={banner.id}
                title={banner.title}
                subtitle={banner.subtitle}
                images={banner.images}
                color={banner.color}
                onClick={() => onNavigate('offerDetails', { offer: banner.offer })}
                className={`absolute inset-0 ${
                  currentBannerIndex === index ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-500`}
                size="large"
              />
            ))}
            
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {banners.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    currentBannerIndex === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 2-3 Advertisement Banners - Hidden */}
          {/* <div className="grid grid-cols-3 gap-2 mb-4">
            {adBanners.map((banner) => (
              <Banner
                key={banner.id}
                title={banner.title}
                subtitle={banner.subtitle}
                image={banner.image}
                color={banner.color}
                onClick={() => onNavigate('offerDetails', { offer: offers[0] })}
                size="small"
              />
            ))}
          </div> */}

          {/* Enhanced Quick Action Buttons - Hidden */}
          {/* <div className="grid grid-cols-3 gap-2">
            <Banner
              title="Curated for you"
              subtitle="Personalized"
              color="from-purple-500 to-pink-500"
              onClick={() => onNavigate('curatedOffers')}
              size="small"
            />
            <Banner
              title="Ending Soon"
              subtitle="Limited Time"
              color="from-red-500 to-orange-500"
              onClick={() => setActiveCategory('Ending')}
              size="small"
            />
            <Banner
              title="Stores"
              subtitle="Find Nearby"
              color="from-blue-500 to-teal-500"
              onClick={() => onNavigate('nearbyStores')}
              size="small"
            />
          </div> */}
        </motion.div>

        {/* Auto-Sliding Offers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">All Category Offers</h2>
            {filteredOffers.length > 0 && (
              <button
                onClick={() => onNavigate('allOffers', { title: 'All Category Offers', offers: filteredOffers })}
                className="text-purple-600 text-sm font-semibold"
              >
                View All
              </button>
            )}
          </div>

          {loadingOffers && <OfferListSkeleton count={3} />}

          {!loadingOffers && offersError && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">{offersError}</p>
              <button
                onClick={() => loadOffers(1, activeCategory)}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Retry
              </button>
            </div>
          )}

          {!loadingOffers && !offersError && filteredOffers.length > 0 && (
            <AutoSlider autoSlide={userInactive} slideInterval={2000}>
              {filteredOffers.slice(0, 5).map((offer) => (
                <OfferCard
                  key={`category-${offer.id}`}
                  offer={offer}
                  onLike={handleLikeOffer}
                  onShare={() => handleShare(offer)}
                  onGetDirections={() => handleGetDirections(offer)}
                  onClick={() => onNavigate('offerDetails', { offer })}
                />
              ))}
            </AutoSlider>
          )}

          {!loadingOffers && !offersError && filteredOffers.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No offers available</p>
            </div>
          )}
        </motion.div>

        {/* Ending Soon Section */}
        {endingSoonOffers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Clock className="w-5 h-5 text-red-500 mr-2" />
                Ending Soon
              </h2>
              <button
                onClick={() => onNavigate('allOffers', { title: 'Ending Soon Offers', offers: endingSoonOffers })}
                className="text-purple-600 text-sm font-semibold"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {endingSoonOffers.slice(0, 4).map((offer) => (
                <OfferCard
                  key={`ending-${offer.id}`}
                  offer={offer}
                  layout="horizontal"
                  showTimer={true}
                  onLike={handleLikeOffer}
                  onShare={() => handleShare(offer)}
                  onGetDirections={() => handleGetDirections(offer)}
                  onClick={() => onNavigate('offerDetails', { offer })}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Latest Offers Section */}
        {latestOffers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Star className="w-5 h-5 text-yellow-500 mr-2" />
                Latest Offers
              </h2>
              <button
                onClick={() => onNavigate('allOffers', { title: 'Latest Offers', offers: latestOffers })}
                className="text-purple-600 text-sm font-semibold"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {latestOffers.map((offer) => (
                <OfferCard
                  key={`latest-${offer.id}`}
                  offer={offer}
                  onLike={handleLikeOffer}
                  onShare={() => handleShare(offer)}
                  onGetDirections={() => handleGetDirections(offer)}
                  onClick={() => onNavigate('offerDetails', { offer })}
                  className="w-full"
                />
              ))}
            </div>
          </motion.div>
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

      {/* Ad Videos */}
      <AnimatePresence>
        {showAdVideo && (
          <AdVideoPopup
            title="Fashion Sale"
            discount="50% OFF"
            image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc2FsZXxlbnwxfHx8fDE3NTc3NDgwODN8MA&ixlib=rb-4.1.0&q=80&w=200"
            side={adVideoSide}
            onClose={() => setShowAdVideo(false)}
            onClick={() => {
              setShowAdVideo(false);
              onNavigate('offerDetails', { offer: offers[1] });
            }}
          />
        )}
      </AnimatePresence>

      {/* Share Popup */}
      <SharePopup
        isOpen={showSharePopup}
        onClose={() => setShowSharePopup(false)}
        offer={selectedOffer}
      />

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Enhanced Bottom Navigation with 3D Location Icon */}
      <BottomNavigation
        activeScreen="home"
        onNavigate={onNavigate}
      />

      {/* Map Location Picker */}
      <MapLocationPicker
        isOpen={showMapPicker}
        onClose={() => setShowMapPicker(false)}
        onLocationSelect={handleMapLocationSelect}
        currentLocation={currentLocation}
      />
    </div>
  );
});

export default HomeScreen;