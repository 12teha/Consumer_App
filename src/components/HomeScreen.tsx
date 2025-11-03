import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, Clock, Star, Grid3X3, Home, Heart, MapPin, Zap, Store, Navigation, Loader, Search, Filter
} from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
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

// Filter options interface
interface FilterOptions {
  distance: number;
}

const HomeScreen = React.memo(function HomeScreen({ username, selectedCategory, onNavigate, onLikeCountChange }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(selectedCategory || 'All');
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
  const [banners, setBanners] = useState<Array<{ image: string; link: string }>>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [loadingBanners, setLoadingBanners] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    distance: 10 // Only distance filter
  });
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load initial data
  useEffect(() => {
    loadInitialData();
    loadBanners();
  }, []);

  // Update activeCategory when selectedCategory prop changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== activeCategory) {
      console.log('📍 Setting active category from prop:', selectedCategory);
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

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
        radius: 10, // API call with 10km radius
        page: pageNum,
        limit: 100, // Increased limit to load more offers at once
        category: category
      });

      console.log('API Response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', response ? Object.keys(response) : 'null');

      // Handle different response structures more robustly
      let offersArray = [];
      if (Array.isArray(response)) {
        offersArray = response;
      } else if (response && Array.isArray(response.offers)) {
        offersArray = response.offers;
      } else if (response && Array.isArray(response.data)) {
        offersArray = response.data;
      } else if (response && response.data && Array.isArray(response.data.offers)) {
        offersArray = response.data.offers;
      }

      console.log('Extracted offers array length:', offersArray.length);

      const newOffers = (offersArray || []).map((offer: any) => {
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

        // Extract category from different possible field names
        const category = offer.category ||
                        offer.business?.businessCategory?.categoryName ||
                        offer.businessCategory?.categoryName ||
                        offer.categoryName ||
                        'Uncategorized';

        return {
          ...offer,
          image: imageUrl,
          discount: discount,
          category: category
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

      // Check if there are more offers to load (if we got exactly 100, there might be more)
      setHasMore(newOffers.length === 100);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading offers:', error);
      console.error('Error details:', error instanceof Error ? error.message : String(error));

      if (pageNum === 1) {
        setOffers([]);

        // Provide more specific error messages
        let errorMessage = 'Failed to load offers. Please try again.';
        if (error instanceof Error) {
          if (error.message.includes('Authentication failed')) {
            errorMessage = 'Please log in again to view offers.';
          } else if (error.message.includes('Network')) {
            errorMessage = 'Network error. Please check your connection.';
          } else if (error.message.includes('401')) {
            errorMessage = 'Session expired. Please log in again.';
          }
        }

        setOffersError(errorMessage);
      }
    } finally {
      setLoadingOffers(false);
    }
  };

  const loadBanners = async () => {
    try {
      setLoadingBanners(true);
      console.log('🎯 Loading banners from API...');
      const response = await apiService.getBanners();
      console.log('🎯 Banners API Response:', response);

      // API returns array like: [{ image: "url", link: "url" }, ...]
      const bannerData: Array<{ image: string; link: string }> = [];

      if (Array.isArray(response)) {
        response.forEach((item: any) => {
          // New format: { image: "url", link: "url" }
          if (item.image) {
            bannerData.push({
              image: item.image,
              link: item.link || ''
            });
          }
        });
      }

      console.log('🎯 Extracted banner data:', bannerData);
      console.log('🎯 Number of banners:', bannerData.length);

      if (bannerData.length > 0) {
        console.log('✅ Setting banners state with:', bannerData);
        setBanners(bannerData);
        console.log('✅ Banners state updated!');
      } else {
        console.warn('⚠️ No banners from API - empty array');
        setBanners([]);
      }
    } catch (error) {
      console.error('❌ Error loading banners:', error);
      setBanners([]);
    } finally {
      setLoadingBanners(false);
      console.log('🎯 loadingBanners set to false');
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

  // Auto-scroll banners every 3 seconds
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 3000); // Auto scroll every 3 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

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

  // Filter functions - Only distance filter
  const applyFilters = (offersToFilter: any[]) => {
    let filtered = [...offersToFilter];

    // Apply distance filter - only show offers within selected distance (up to 10km)
    if (filterOptions.distance < 10) {
      filtered = filtered.filter(offer => {
        const offerDistance = parseFloat(offer.distance) || 0;
        return offerDistance <= filterOptions.distance;
      });
    }

    return filtered;
  };

  const handleFilterApply = () => {
    setShowFilterPanel(false);
    // Filters are applied in the filteredOffers memo
  };

  const handleFilterReset = () => {
    setFilterOptions({
      distance: 10 // Reset to 10km
    });
  };

  const filteredOffers = React.useMemo(() => {
    const baseOffers = activeCategory === 'All' ? offers : offers.filter(offer => offer.category === activeCategory);
    return applyFilters(baseOffers);
  }, [offers, activeCategory, filterOptions]);

  const endingSoonOffers = React.useMemo(() => 
    applyFilters(offers.filter(offer => offer.isEndingSoon)),
    [offers, filterOptions]
  );
  
  const latestOffers = React.useMemo(() =>
    applyFilters(offers), // Show all offers - no limit
    [offers, filterOptions]
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
      {/* Fixed Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white px-4 py-3 shadow-sm flex-shrink-0"
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
              src="/512pxlogo-1[1].png"
              alt="OfferBeez Logo"
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

        {/* Search Bar with Filter Icon */}
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for offers, stores..."
                className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(searchQuery);
                  }
                }}
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>
          
          {/* Filter Button */}
          <button
            onClick={() => setShowFilterPanel(true)}
            className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Category Icons - Moved below search bar */}
        {!showSearchResults && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-3"
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
      </motion.div>

      {/* Scrollable Content Area */}
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto"
      >
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
        <div className="pb-4">
          {/* Auto-Scrollable Banners Section - At the top */}
          {!showSearchResults && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 bg-white"
            >
              {loadingBanners ? (
                <div className="w-full h-48 rounded-xl bg-gray-200 animate-pulse"></div>
              ) : banners.length > 0 ? (
                <div className="relative w-full rounded-xl overflow-hidden shadow-lg cursor-pointer" style={{ height: '180px', minHeight: '180px', maxHeight: '180px' }}>
                  {/* Banner Images */}
                  {banners.map((banner, index) => (
                    <div
                      key={`banner-${index}`}
                      className="absolute top-0 left-0 w-full h-full bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
                      style={{
                        opacity: currentBannerIndex === index ? 1 : 0,
                        zIndex: currentBannerIndex === index ? 10 : 0,
                        transition: 'opacity 0.7s ease-in-out',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        console.log(`🖱️ Banner ${index + 1} clicked`);
                        console.log(`🔗 Banner link:`, banner.link);

                        // If banner has a link, open it in new tab
                        if (banner.link && banner.link.trim() !== '') {
                          window.open(banner.link, '_blank', 'noopener,noreferrer');
                        } else {
                          // Fallback: Show all offers when banner is clicked
                          if (offers.length > 0) {
                            onNavigate('allOffers', { title: 'Featured Offers', offers: offers });
                          }
                        }
                      }}
                    >
                      <ImageWithFallback
                        src={banner.image}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-full object-fit"
                        onError={() => {
                          console.error('❌ Failed to load banner:', banner.image);
                        }}
                        onLoad={() => {
                          console.log(`✅ Banner ${index + 1} loaded successfully`);
                        }}
                      />
                    </div>
                  ))}

                  {/* Banner Indicators */}
                  {banners.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2" style={{ zIndex: 20 }}>
                      {banners.map((_, index) => (
                        <button
                          key={`indicator-${index}`}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent banner click when clicking indicator
                            setCurrentBannerIndex(index);
                          }}
                          className={`rounded-full transition-all ${
                            currentBannerIndex === index ? 'bg-white w-6 h-2' : 'bg-white/50 w-2 h-2'
                          }`}
                          aria-label={`Go to banner ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-48 rounded-xl bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center shadow-lg">
                  <p className="text-white text-xl font-bold">Welcome to OfferBeez!</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Auto-Sliding Offers Section - Disabled auto-sliding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">
                {activeCategory === 'All' ? 'All Category Offers' : `${activeCategory} Offers`}
              </h2>
              {filteredOffers.length > 0 && (
                <button
                  onClick={() => onNavigate('allOffers', { title: activeCategory === 'All' ? 'All Category Offers' : `${activeCategory} Offers`, offers: filteredOffers })}
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
              <div className="space-y-3">
                {filteredOffers.slice(0, 5).map((offer) => (
                  <OfferCard
                    key={`category-${offer.id}`}
                    offer={offer}
                    onLike={handleLikeOffer}
                    onGetDirections={() => handleGetDirections(offer)}
                    onClick={() => onNavigate('offerDetails', { offer })}
                    showShare={false} // Remove share button
                  />
                ))}
              </div>
            )}

            {!loadingOffers && !offersError && filteredOffers.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600">No offers available within {filterOptions.distance}km</p>
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

          {/* Latest Offers Section - With Load More */}
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                {latestOffers.map((offer) => (
                  <OfferCard
                    key={`latest-${offer.id}`}
                    offer={offer}
                    onLike={handleLikeOffer}
                    onGetDirections={() => handleGetDirections(offer)}
                    onClick={() => onNavigate('offerDetails', { offer })}
                    className="w-full"
                    showShare={false} // Remove share button
                  />
                ))}
              </div>

              {/* Load More Button for Latest Offers */}
              {hasMore && !loadingOffers && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => loadOffers(page + 1, activeCategory)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md"
                  >
                    Load More Offers
                  </button>
                </div>
              )}

              {/* Loading more indicator */}
              {loadingOffers && page > 1 && (
                <div className="flex justify-center py-4">
                  <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Filter Panel - Simplified with only distance filter */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center"
            onClick={() => setShowFilterPanel(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-t-2xl w-full max-w-lg mx-4 mb-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Filter by Distance</h2>
                  <button
                    onClick={() => setShowFilterPanel(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>

                {/* Maximum Distance - Only filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Maximum Distance: {filterOptions.distance} km
                  </h3>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={filterOptions.distance}
                    onChange={(e) => setFilterOptions(prev => ({
                      ...prev,
                      distance: parseInt(e.target.value)
                    }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>1 km</span>
                    <span>10 km</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Show offers within {filterOptions.distance} km of your location
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleFilterReset}
                    className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleFilterApply}
                    className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Fixed Bottom Navigation with Home tab active */}
      <div className="flex-shrink-0">
        <BottomNavigation
          activeScreen="home"
          onNavigate={onNavigate}
        />
      </div>

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