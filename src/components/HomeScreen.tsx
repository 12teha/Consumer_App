// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'motion/react';
// import {
//   Bell, Clock, Star, Grid3X3, Home, Heart, MapPin, Zap, Store, Navigation, Loader, Search, Filter
// } from 'lucide-react';
// import { Button } from './ui/button';
// import { ImageWithFallback } from './figma/ImageWithFallback';
// import CategoryIcon from './atoms/CategoryIcon';
// import OfferCard from './atoms/OfferCard';
// import Banner from './atoms/Banner';
// import Footer from './atoms/Footer';
// import AdVideoPopup, { shouldShowAdVideo } from './atoms/AdVideoPopup';
// import LocationButton from './atoms/LocationButton';
// import NotificationPanel from './molecules/NotificationPanel';
// import BackButton from './atoms/BackButton';
// import SharePopup from './atoms/SharePopup';
// import DirectionPopup from './atoms/DirectionPopup';
// import AutoSlider from './atoms/AutoSlider';
// import BottomNavigation from './atoms/BottomNavigation';
// import { apiService } from '../services/api';
// import LocationManager from './LocationManager';
// import MapLocationPicker from './MapLocationPicker';
// import { OfferListSkeleton } from './atoms/OfferCardSkeleton';
// import { CategoryListSkeleton } from './atoms/CategorySkeleton';
// import { formatAddress, isCoordinateString } from '../utils/addressFormatter';

// interface HomeScreenProps {
//   username: string;
//   selectedCategory: string;
//   onNavigate: (screen: any, data?: any) => void;
//   onLikeCountChange?: (count: number) => void;
// }

// // Filter options interface
// interface FilterOptions {
//   distance: number;
// }

// const HomeScreen = React.memo(function HomeScreen({ username, selectedCategory, onNavigate, onLikeCountChange }: HomeScreenProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeCategory, setActiveCategory] = useState(selectedCategory || 'All');
//   const [showAdVideo, setShowAdVideo] = useState(false);
//   const [adVideoSide, setAdVideoSide] = useState<'left' | 'right'>('left');
//   const [searchResults, setSearchResults] = useState<any[]>([]);
//   const [showSearchResults, setShowSearchResults] = useState(false);
//   const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [selectedOffer, setSelectedOffer] = useState<any>(null);
//   const [showSharePopup, setShowSharePopup] = useState(false);
//   const [showDirectionPopup, setShowDirectionPopup] = useState(false);
//   const [directionData, setDirectionData] = useState<any>(null);
//   const [userInactive, setUserInactive] = useState(false);
//   const [locationQuery, setLocationQuery] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [offers, setOffers] = useState<any[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [categoryData, setCategoryData] = useState<any[]>([]);
//   const [currentLocation, setCurrentLocation] = useState<any>(null);
//   const [showLocationManager, setShowLocationManager] = useState(false);
//   const [showMapPicker, setShowMapPicker] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loadingOffers, setLoadingOffers] = useState(false);
//   const [loadingCategories, setLoadingCategories] = useState(false);
//   const [offersError, setOffersError] = useState<string | null>(null);
//   const [banners, setBanners] = useState<Array<{
//     image: string;
//     link: string;
//     description?: string;
//     vendor?: string;
//     id?: number;
//     startDate?: string;
//     endDate?: string;
//     status?: string;
//   }>>([]);
//   const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
//   const [loadingBanners, setLoadingBanners] = useState(false);
//   const [showFilterPanel, setShowFilterPanel] = useState(false);
//   const [filterOptions, setFilterOptions] = useState<FilterOptions>({
//     distance: 25 // Only distance filter
//   });
//   const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
//   const contentRef = useRef<HTMLDivElement>(null);

//   // Load initial data
//   useEffect(() => {
//     loadInitialData();
//     loadBanners();
//   }, []);

//   // Update activeCategory when selectedCategory prop changes
//   useEffect(() => {
//     if (selectedCategory && selectedCategory !== activeCategory) {
//       console.log('📍 Setting active category from prop:', selectedCategory);
//       setActiveCategory(selectedCategory);
//     }
//   }, [selectedCategory]);

//   // Load offers when category or location changes
//   useEffect(() => {
//     if (currentLocation) {
//       loadOffers(1, activeCategory);
//     }
//   }, [activeCategory, currentLocation]);

//   const loadInitialData = async () => {
//     try {
//       // Load categories in background
//       setLoadingCategories(true);
//       console.log('Loading categories...');
//       const categoriesResponse = await apiService.getAllCategories();
//       console.log('Categories response:', categoriesResponse);
//       console.log('Full categories data:', JSON.stringify(categoriesResponse, null, 2));
//       const fetchedCategories = categoriesResponse.categories || [];
//       console.log('Fetched categories count:', fetchedCategories.length);
//       console.log('First category structure:', fetchedCategories[0]);

//       // Store full category data with images
//       const allCategory = {
//         name: 'All',
//         image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200'
//       };

//       // Map categories with proper image fallbacks based on category name
//       const categoriesWithImages = fetchedCategories.map((cat: any) => {
//         const categoryName = cat.categoryName || cat.name || 'Unknown';

//         // Extract icon URL from API response - check multiple possible field names
//         // Priority order: categoryIconUrl > categoryIcon > icon > image > iconUrl > icon_url
//         let iconUrl = cat.categoryIconUrl || cat.categoryIcon || cat.icon || cat.image || cat.iconUrl || cat.icon_url;

//         // Decode URL-encoded characters (replace + with space and decode URI component)
//         if (iconUrl && typeof iconUrl === 'string') {
//           try {
//             // Replace + with %20 for proper URL encoding
//             iconUrl = iconUrl.replace(/\+/g, '%20');
//             console.log('Processed icon URL:', iconUrl);
//           } catch (e) {
//             console.error('Error processing icon URL:', e);
//           }
//         }

//         // Provide category-specific placeholder images as fallback
//         const categoryImages: { [key: string]: string } = {
//           'Clothing': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
//           'Fashion': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
//           'fashion': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
//           'Home & Life Style': 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=200',
//           'Small-Scale Manufacturing': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200',
//           'Wholesale & Distribution': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200',
//           'Fashoin': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
//           'Automotive and Industrial': 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200',
//         };

//         console.log('Category:', categoryName, 'Raw cat object:', cat);
//         console.log('Category:', categoryName, 'Final Icon URL:', iconUrl);

//         return {
//           name: categoryName,
//           image: iconUrl || categoryImages[categoryName] || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200'
//         };
//       });

//       setCategoryData([allCategory, ...categoriesWithImages]);
//       setCategories(['All', ...categoriesWithImages.map((cat: any) => cat.name)]);
//       setLoadingCategories(false);

//       // Check for saved location in localStorage first (for persistence across refreshes)
//       const savedLocation = localStorage.getItem('userLocation');
//       if (savedLocation) {
//         try {
//           const parsedLocation = JSON.parse(savedLocation);
//           console.log('Found saved location in localStorage:', parsedLocation);
//           setCurrentLocation(parsedLocation);
//           loadOffers(1, activeCategory);
//           return;
//         } catch (e) {
//           console.error('Error parsing saved location:', e);
//           localStorage.removeItem('userLocation');
//         }
//       }

//       // Check for saved location from API
//       console.log('Checking for saved location from API...');
//       const locationResponse = await apiService.getUserLocation();
//       console.log('Location response:', locationResponse);

//       if (locationResponse && locationResponse.latitude && locationResponse.longitude) {
//         // Save to localStorage for persistence
//         localStorage.setItem('userLocation', JSON.stringify(locationResponse));
//         setCurrentLocation(locationResponse);
//         console.log('Location found, loading offers...');
//         loadOffers(1, activeCategory);
//       } else {
//         // Show location manager but keep fallback offers visible
//         console.log('No location found, showing location manager');
//         setShowLocationManager(true);
//       }
//     } catch (error) {
//       console.error('Error loading initial data:', error);
//       setLoadingCategories(false);

//       // Try to use localStorage location as fallback
//       const savedLocation = localStorage.getItem('userLocation');
//       if (savedLocation) {
//         try {
//           const parsedLocation = JSON.parse(savedLocation);
//           setCurrentLocation(parsedLocation);
//           loadOffers(1, activeCategory);
//         } catch (e) {
//           setShowLocationManager(true);
//         }
//       } else {
//         setShowLocationManager(true);
//       }
//     }
//   };

//   const loadOffers = async (pageNum: number = 1, category: string = 'All') => {
//     if (!currentLocation) {
//       console.log('No location set, cannot load offers');
//       setOffers([]);
//       setOffersError('Please set your location to view offers');
//       return;
//     }

//     try {
//       setLoadingOffers(true);
//       setOffersError(null);
//       console.log(`Fetching offers - Page: ${pageNum}, Category: ${category}, Location:`, currentLocation);

//       const response = await apiService.getOffers({
//         radius: filterOptions.distance, // Use user-selected distance filter
//         page: pageNum,
//         limit: 100, // Increased limit to load more offers at once
//         category: category
//       });

//       console.log('API Response:', response);
//       console.log('Response type:', typeof response);
//       console.log('Response keys:', response ? Object.keys(response) : 'null');

//       // Handle different response structures more robustly
//       let offersArray = [];
//       if (Array.isArray(response)) {
//         offersArray = response;
//       } else if (response && Array.isArray(response.offers)) {
//         offersArray = response.offers;
//       } else if (response && Array.isArray(response.data)) {
//         offersArray = response.data;
//       } else if (response && response.data && Array.isArray(response.data.offers)) {
//         offersArray = response.data.offers;
//       }

//       console.log('Extracted offers array length:', offersArray.length);

//       const newOffers = (offersArray || []).map((offer: any) => {
//         // Get the image URL from various possible field names
//         let imageUrl = offer.imagesUrl || offer.offerImage || offer.offer_image || offer.image || '';

//         // If imageUrl is an array, take the first element
//         if (Array.isArray(imageUrl)) {
//           imageUrl = imageUrl[0] || '';
//         }

//         // If the image URL contains comma-separated URLs, take only the first one
//         if (imageUrl && typeof imageUrl === 'string' && imageUrl.includes(',')) {
//           imageUrl = imageUrl.split(',')[0].trim();
//         }

//         // Fix placeholder.com URLs - replace with CloudFront domain
//         if (imageUrl && typeof imageUrl === 'string' && imageUrl.includes('placeholder.com')) {
//           imageUrl = imageUrl.replace('https://placeholder.com/', 'https://d24rozqnh2m4pk.cloudfront.net/');
//         }

//         // Calculate discount percentage if not provided
//         const originalPrice = offer.originalPrice || offer.original_price || 0;
//         const discountedPrice = offer.discountedPrice || offer.discounted_price || 0;
//         let discount = offer.discount || offer.discountPercentage || 0;

//         // If discount not provided, calculate it from prices
//         if (!discount && originalPrice > 0 && discountedPrice > 0 && originalPrice > discountedPrice) {
//           discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
//         }

//         // Extract category from different possible field names
//         // Handle businessCategory as array (from API) or single object
//         let category = offer.category || offer.categoryName || 'Uncategorized';

//         // Check if businessCategory is an array
//         if (offer.business?.businessCategory && Array.isArray(offer.business.businessCategory) && offer.business.businessCategory.length > 0) {
//           category = offer.business.businessCategory[0].categoryName || category;
//         } else if (offer.business?.businessCategory?.categoryName) {
//           // Fallback for single object structure
//           category = offer.business.businessCategory.categoryName;
//         } else if (offer.businessCategory && Array.isArray(offer.businessCategory) && offer.businessCategory.length > 0) {
//           category = offer.businessCategory[0].categoryName || category;
//         } else if (offer.businessCategory?.categoryName) {
//           // Fallback for single object structure
//           category = offer.businessCategory.categoryName;
//         }

//         return {
//           ...offer,
//           image: imageUrl,
//           discount: discount,
//           category: category
//         };
//       });
//       console.log(`Received ${newOffers.length} offers from API`);

//       if (newOffers.length > 0) {
//         if (pageNum === 1) {
//           setOffers(newOffers);
//         } else {
//           setOffers(prev => [...prev, ...newOffers]);
//         }
//         console.log('Offers loaded successfully');
//       } else if (pageNum === 1) {
//         setOffers([]);
//         setOffersError('No offers available in your area');
//       }

//       // Check if there are more offers to load (if we got exactly 100, there might be more)
//       setHasMore(newOffers.length === 100);
//       setPage(pageNum);
//     } catch (error) {
//       console.error('Error loading offers:', error);
//       console.error('Error details:', error instanceof Error ? error.message : String(error));

//       if (pageNum === 1) {
//         setOffers([]);

//         // Provide more specific error messages
//         let errorMessage = 'Failed to load offers. Please try again.';
//         if (error instanceof Error) {
//           if (error.message.includes('Authentication failed')) {
//             errorMessage = 'Please log in again to view offers.';
//           } else if (error.message.includes('Network')) {
//             errorMessage = 'Network error. Please check your connection.';
//           } else if (error.message.includes('401')) {
//             errorMessage = 'Session expired. Please log in again.';
//           }
//         }

//         setOffersError(errorMessage);
//       }
//     } finally {
//       setLoadingOffers(false);
//     }
//   };

//   const loadBanners = async () => {
//     try {
//       setLoadingBanners(true);
//       console.log('🎯 Loading live banners from API...');
//       const response = await apiService.getBanners();
//       console.log('🎯 Live Banners API Response:', response);
//       console.log('🎯 Response type:', typeof response);
//       console.log('🎯 Is array:', Array.isArray(response));
//       console.log('🎯 Response length:', response?.length);

//       // API service now returns transformed array: [{ image, link, description, vendor, ... }]
//       if (Array.isArray(response) && response.length > 0) {
//         console.log('✅ Setting banners state with:', response);
//         console.log('✅ First banner:', response[0]);
//         setBanners(response);
//         console.log('✅ Banners state updated! Total banners:', response.length);
//       } else {
//         console.warn('⚠️ No live banners available - response:', response);
//         setBanners([]);
//       }
//     } catch (error) {
//       console.error('❌ Error loading live banners:', error);
//       setBanners([]);
//     } finally {
//       setLoadingBanners(false);
//       console.log('🎯 loadingBanners set to false');
//     }
//   };

//   const handleLocationSet = (location: any) => {
//     // Save location to localStorage for persistence across refreshes
//     localStorage.setItem('userLocation', JSON.stringify(location));
//     setCurrentLocation(location);
//     setShowLocationManager(false);
//     // Clear offers cache when location changes
//     apiService.clearOffersCache();
//     loadOffers(1, activeCategory);
//   };

//   const handleLocationClick = () => {
//     // Open embedded map picker
//     setShowMapPicker(true);
//   };

//   const handleMapLocationSelect = async (location: { latitude: number; longitude: number; address: string }) => {
//     // Update current location with selected map location
//     const newLocation = {
//       latitude: location.latitude,
//       longitude: location.longitude,
//       address: location.address
//     };

//     // Save location to localStorage for persistence across refreshes
//     localStorage.setItem('userLocation', JSON.stringify(newLocation));

//     // Save location to API
//     try {
//       await apiService.setUserLocation(location.latitude, location.longitude, location.address);
//       setCurrentLocation(newLocation);
//       setShowMapPicker(false);
//       // Reload offers with new location
//       apiService.clearOffersCache();
//       loadOffers(1, activeCategory);
//     } catch (error) {
//       console.error('Error saving location:', error);
//       // Still update UI even if API call fails (localStorage already saved)
//       setCurrentLocation(newLocation);
//       setShowMapPicker(false);
//     }
//   };

//   // Show ad videos only first 2 times - optimized
//   useEffect(() => {
//     if (!shouldShowAdVideo()) return;

//     const timer = setTimeout(() => {
//       setAdVideoSide(Math.random() > 0.5 ? 'left' : 'right');
//       setShowAdVideo(true);

//       const hideTimer = setTimeout(() => setShowAdVideo(false), 5000);
//       return () => clearTimeout(hideTimer);
//     }, 25000); // Increased delay to reduce initial load impact

//     return () => clearTimeout(timer);
//   }, []); // Simplified dependency array

//   // Auto-scroll banners every 3 seconds
//   useEffect(() => {
//     if (banners.length === 0) return;

//     const interval = setInterval(() => {
//       setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
//     }, 3000); // Auto scroll every 3 seconds

//     return () => clearInterval(interval);
//   }, [banners.length]);

//   // Real-time search suggestions
//   const handleSearchInput = React.useCallback((query: string) => {
//     setSearchQuery(query);

//     if (query.trim()) {
//       const suggestions = offers.filter(offer =>
//         offer.title?.toLowerCase().includes(query.toLowerCase()) ||
//         offer.description?.toLowerCase().includes(query.toLowerCase()) ||
//         offer.category?.toLowerCase().includes(query.toLowerCase()) ||
//         (offer.business?.business_name || offer.businessName)?.toLowerCase().includes(query.toLowerCase())
//       ).slice(0, 5); // Limit to 5 suggestions

//       setSearchSuggestions(suggestions);
//       setShowSuggestions(true);
//     } else {
//       setSearchSuggestions([]);
//       setShowSuggestions(false);
//     }
//   }, [offers]);

//   const handleSearch = React.useCallback((query: string) => {
//     try {
//       setIsLoading(true);
//       setShowSuggestions(false); // Hide suggestions when performing full search

//       if (query.trim()) {
//         const results = offers.filter(offer =>
//           offer.title?.toLowerCase().includes(query.toLowerCase()) ||
//           offer.description?.toLowerCase().includes(query.toLowerCase()) ||
//           offer.category?.toLowerCase().includes(query.toLowerCase())
//         );
//         setSearchResults(results);
//         setShowSearchResults(true);
//       } else {
//         setShowSearchResults(false);
//         setSearchResults([]);
//       }
//     } catch (error) {
//       console.error('Search error:', error);
//       setSearchResults([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [offers]);

//   const handleSuggestionClick = (offer: any) => {
//     setShowSuggestions(false);
//     setSearchQuery('');
//     onNavigate('offerDetails', { offer });
//   };

//   const handleClearSearch = () => {
//     setSearchQuery('');
//     setLocationQuery('');
//     setShowSearchResults(false);
//     setSearchResults([]);
//     setShowSuggestions(false);
//     setSearchSuggestions([]);
//   };

//   const handleLikeOffer = (offerId: number, liked: boolean) => {
//     // This function is now handled by the LikedOffersManager context
//     // The OfferCard component will handle the like functionality directly
//   };

//   const handleCategorySelect = (category: string) => {
//     setActiveCategory(category);
//     setShowSearchResults(false);
//     setSearchQuery('');
//     setLocationQuery('');
//     setSearchResults([]);

//     // Always load offers (either real or fallback)
//     loadOffers(1, category);
//   };

//   const handleShare = (offer: any) => {
//     setSelectedOffer(offer);
//     setShowSharePopup(true);
//   };

//   const handleGetDirections = (offer: any) => {
//     setDirectionData({
//       storeName: offer.title,
//       storeAddress: offer.address,
//       distance: offer.distance,
//       estimatedTime: `${Math.ceil(parseFloat(offer.distance) * 4)} min`
//     });
//     setShowDirectionPopup(true);
//   };

//   // Filter functions - Only distance filter
//   const applyFilters = (offersToFilter: any[]) => {
//     let filtered = [...offersToFilter];

//     // Apply distance filter - only show offers within selected distance (up to 25km)
//     if (filterOptions.distance < 25) {
//       filtered = filtered.filter(offer => {
//         const offerDistance = parseFloat(offer.distance) || 0;
//         return offerDistance <= filterOptions.distance;
//       });
//     }

//     return filtered;
//   };

//   const handleFilterApply = () => {
//     setShowFilterPanel(false);
//     // Reload offers with new distance filter
//     setOffers([]);
//     setPage(1);
//     setHasMore(true);
//     loadOffers(1, activeCategory);
//   };

//   const handleFilterReset = () => {
//     setFilterOptions({
//       distance: 25 // Reset to 25km
//     });
//     // Reload offers with reset filter
//     setOffers([]);
//     setPage(1);
//     setHasMore(true);
//     loadOffers(1, activeCategory);
//   };

//   const filteredOffers = React.useMemo(() => {
//     const baseOffers = activeCategory === 'All' ? offers : offers.filter(offer => offer.category === activeCategory);
//     return applyFilters(baseOffers);
//   }, [offers, activeCategory, filterOptions]);

//   const endingSoonOffers = React.useMemo(() => {
//     const baseOffers = activeCategory === 'All' ? offers : offers.filter(offer => offer.category === activeCategory);
//     return applyFilters(baseOffers.filter(offer => offer.isEndingSoon));
//   }, [offers, activeCategory, filterOptions]);

//   const latestOffers = React.useMemo(() => {
//     const baseOffers = activeCategory === 'All' ? offers : offers.filter(offer => offer.category === activeCategory);
//     return applyFilters(baseOffers); // Show all offers - no limit
//   }, [offers, activeCategory, filterOptions]);

//   // Remove loading screen - show content immediately with fallback data

//   // Show location manager if no location is set
//   if (showLocationManager) {
//     return (
//       <LocationManager
//         onLocationSet={handleLocationSet}
//         onSkip={() => setShowLocationManager(false)}
//         showSkip={true}
//       />
//     );
//   }

//   return (
//     <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
//       {/* Fixed Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white px-4 py-3 shadow-sm flex-shrink-0"
//       >
//         {/* Logo at top center */}
//         <div className="flex justify-center mb-3">
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ type: "spring", damping: 15 }}
//             className="flex items-center justify-center"
//           >
//             <img
//               src="/512pxlogo-1[1].png"
//               alt="OfferBeez Logo"
//               className="h-16 w-auto object-contain"
//             />
//           </motion.div>
//         </div>

//         <div className="flex items-center justify-between mb-3 cursor-pointer">
//           <LocationButton
//             address={formatAddress(currentLocation?.address) || "Tap to set your location"}
//             city=""
//             onClick={handleLocationClick}
//           />

//           <div className="flex items-center space-x-3">
//             <button onClick={() => onNavigate('profile')}>
//               <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer">
//                 <span className="text-white text-sm font-semibold">
//                   {username.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Location Notice */}
//         {!currentLocation && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-orange-50 border border-orange-200 rounded-lg p-2 mx-4 mb-2"
//           >
//             <p className="text-orange-700 text-xs text-center">
//               📍 Please set your location to view nearby offers
//             </p>
//           </motion.div>
//         )}
//         {currentLocation?.address && isCoordinateString(currentLocation.address) && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-blue-50 border border-blue-200 rounded-lg p-2 mx-4 mb-2"
//           >
//             <p className="text-blue-700 text-xs text-center">
//               📍 Tap location to set a readable address for better experience
//             </p>
//           </motion.div>
//         )}

//         {/* Search Bar with Filter Icon */}
//         <div className="flex items-center space-x-2">
//           <div className="flex-1 relative">
//             <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
//               <Search className="w-5 h-5 text-gray-400 mr-2" />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => handleSearchInput(e.target.value)}
//                 placeholder="Search for offers, stores..."
//                 className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500 cursor-pointer"
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter') {
//                     handleSearch(searchQuery);
//                   }
//                 }}
//               />
//               {searchQuery && (
//                 <button
//                   onClick={handleClearSearch}
//                   className="ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
//                 >
//                   ×
//                 </button>
//               )}
//             </div>

//             {/* Search Suggestions Dropdown */}
//             {showSuggestions && searchSuggestions.length > 0 && (
//               <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50 cursor-pointer">
//                 {searchSuggestions.map((offer, index) => (
//                   <div
//                     key={offer.id || index}
//                     onClick={() => handleSuggestionClick(offer)}
//                     className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                   >
//                     {/* Offer Image */}
//                     <div className="w-12 h-12 flex-shrink-0">
//                       <ImageWithFallback
//                         src={offer.imagesUrl?.[0] || offer.image || offer.photos?.[0]}
//                         alt={offer.title}
//                         className="w-full h-full object-cover rounded"
//                       />
//                     </div>

//                     {/* Offer Details */}
//                     <div className="flex-1 min-w-0">
//                       <h4 className="text-sm font-semibold text-gray-800 truncate">
//                         {offer.title}
//                       </h4>
//                       <p className="text-xs text-gray-500 truncate">
//                         {offer.business?.business_name || offer.businessName || 'Business'}
//                       </p>
//                       {offer.discountPercentage && (
//                         <span className="inline-block mt-1 text-xs font-semibold text-green-600">
//                           {offer.discountPercentage}% OFF
//                         </span>
//                       )}
//                     </div>

//                     {/* Price */}
//                     {offer.discountedPrice && (
//                       <div className="text-right">
//                         <p className="text-sm font-bold text-gray-800">
//                           ₹{offer.discountedPrice}
//                         </p>
//                         {offer.originalPrice && (
//                           <p className="text-xs text-gray-400 line-through">
//                             ₹{offer.originalPrice}
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Filter Button */}
//           <button
//             onClick={() => setShowFilterPanel(true)}
//             className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
//           >
//             <Filter className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         {/* Category Icons - Moved below search bar */}
//         {!showSearchResults && (
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="mt-3"
//           >
//             {loadingCategories ? (
//               <CategoryListSkeleton />
//             ) : (
//               <div className="flex space-x-3 overflow-x-auto pb-2">
//                 {categoryData.map((category) => (
//                   <CategoryIcon
//                     key={category.name}
//                     name={category.name}
//                     image={category.image || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200'}
//                     isActive={activeCategory === category.name}
//                     onClick={() => handleCategorySelect(category.name)}
//                   />
//                 ))}
//               </div>
//             )}
//           </motion.div>
//         )}

//         {/* Browse All Stores Button */}
//         {!showSearchResults && (
//           <motion.button
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             onClick={() => onNavigate('allBusinesses', {
//               radius: filterOptions.distance,
//               userLocation: currentLocation
//             })}
//             className="w-full mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-4 flex items-center justify-between hover:shadow-lg transition-all duration-200 active:scale-98 cursor-pointer"
//           >
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
//                 <span className="text-2xl">🏪</span>
//               </div>
//               <div className="text-left">
//                 <p className="font-bold text-base">Browse All Stores</p>
//                 <p className="text-xs text-white/80">Explore all stores near you</p>
//               </div>
//             </div>
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           </motion.button>
//         )}
//       </motion.div>

//       {/* Scrollable Content Area */}
//       <div
//         ref={contentRef}
//         className="flex-1 overflow-y-auto"
//       >
//         {/* Search Results */}
//         <AnimatePresence>
//           {showSearchResults && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="bg-white px-4 py-3 border-b border-gray-100"
//             >
//               <p className="text-sm text-gray-600 mb-3">
//                 {searchResults.length} results found
//               </p>
//               <div className="space-y-3">
//                 {searchResults && searchResults.slice(0, 3).map((offer) => (
//                   <OfferCard
//                     key={`search-${offer.id}`}
//                     offer={offer}
//                     layout="horizontal"
//                     onLike={handleLikeOffer}
//                     onShare={() => handleShare(offer)}
//                     onGetDirections={() => handleGetDirections(offer)}
//                     onClick={() => onNavigate('offerDetails', { offer })}
//                   />
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Main Content - Flipkart Style */}
//         <div className="pb-4 bg-gray-50">
//           {/* Hero Banners Section - Full Width Horizontal Scrolling */}
//           {!showSearchResults && (
//             <div className="bg-white mb-2">
//               {loadingBanners ? (
//                 <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
//               ) : banners.length > 0 ? (
//                 <div className="relative w-full overflow-hidden" style={{ height: '250px' }}>
//                   {/* Banner Images */}
//                   {banners.map((banner, index) => (
//                     <div
//                       key={`banner-${index}`}
//                       className="absolute top-0 left-0 w-full h-full bg-gray-100"
//                       style={{
//                         opacity: currentBannerIndex === index ? 1 : 0,
//                         zIndex: currentBannerIndex === index ? 10 : 0,
//                         transition: 'opacity 0.5s ease-in-out',
//                         pointerEvents: currentBannerIndex === index ? 'auto' : 'none'
//                       }}
//                       onClick={() => {
//                         if (banner.link && banner.link.trim() !== '') {
//                           window.open(banner.link, '_blank', 'noopener,noreferrer');
//                         }
//                       }}
//                     >
//                       <img
//                         src={banner.image}
//                         alt={`Banner ${index + 1}`}
//                         className="w-full h-full object-cover"
//                         loading="eager"
//                       />
//                     </div>
//                   ))}

//                   {/* Banner Indicators */}
//                   {banners.length > 1 && (
//                     <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5" style={{ zIndex: 20 }}>
//                       {banners.map((_, index) => (
//                         <button
//                           key={`indicator-${index}`}
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setCurrentBannerIndex(index);
//                           }}
//                           className={`rounded-full transition-all ${
//                             currentBannerIndex === index ? 'bg-white w-5 h-1.5' : 'bg-white/50 w-1.5 h-1.5'
//                           }`}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="w-full h-48 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center">
//                   <p className="text-white text-xl font-bold">Welcome to OfferBeez!</p>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Best Deals Section - Horizontal Scrolling */}
//           {!showSearchResults && filteredOffers.length > 0 && (
//             <div className="bg-white mb-2 py-4">
//               <div className="flex items-center justify-between px-4 mb-3">
//                 <h2 className="text-lg font-bold text-gray-900">
//                   {activeCategory === 'All' ? 'Best Deals for You' : `Best ${activeCategory} Deals`}
//                 </h2>
//                 <button
//                   onClick={() => onNavigate('allOffers', { title: 'Best Deals', offers: filteredOffers })}
//                   className="text-blue-600 text-sm font-semibold"
//                 >
//                   View All
//                 </button>
//               </div>

//               {loadingOffers && <OfferListSkeleton count={3} />}

//               {!loadingOffers && offersError && (
//                 <div className="text-center py-8 px-4">
//                   <p className="text-gray-600">{offersError}</p>
//                   <button
//                     onClick={() => loadOffers(1, activeCategory)}
//                     className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                   >
//                     Retry
//                   </button>
//                 </div>
//               )}

//               {!loadingOffers && !offersError && (
//                 <div className="overflow-x-auto px-4 scrollbar-hide">
//                   <div className="flex space-x-4 pb-2">
//                     {filteredOffers.slice(0, 10).map((offer) => (
//                       <div
//                         key={`deal-${offer.id}`}
//                         className="flex-shrink-0 w-44 bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
//                         onClick={() => onNavigate('offerDetails', { offer })}
//                       >
//                         {/* Offer Image */}
//                         <div className="relative w-full h-40 bg-white flex items-center justify-center">
//                           <ImageWithFallback
//                             src={offer.image}
//                             alt={offer.title}
//                             className="w-full h-full object-contain"
//                             fallbackSrc="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200"
//                           />
//                           {offer.discount > 0 && (
//                             <div className="absolute top-2 left-2 bg-green-500 text-black px-2 py-0.5 rounded text-xs font-bold z-10">
//                               {offer.discount}% OFF
//                             </div>
//                           )}
//                         </div>

//                         {/* Offer Details */}
//                         <div className="p-2">
//                           <h3 className="font-medium text-xs text-gray-900 line-clamp-2 mb-1">
//                             {offer.title}
//                           </h3>

//                           <div className="flex items-center space-x-1 mb-1">
//                             {offer.originalPrice > offer.discountedPrice ? (
//                               <>
//                                 <span className="text-sm font-bold text-gray-900">
//                                   ₹{offer.discountedPrice}
//                                 </span>
//                                 <span className="text-xs text-gray-500 line-through">
//                                   ₹{offer.originalPrice}
//                                 </span>
//                               </>
//                             ) : (
//                               <span className="text-sm font-bold text-gray-900">
//                                 ₹{offer.discountedPrice || offer.originalPrice}
//                               </span>
//                             )}
//                           </div>

//                           {offer.distance && (
//                             <p className="text-xs text-gray-500">
//                               {parseFloat(offer.distance).toFixed(1)}km away
//                             </p>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Ending Soon Deals - Horizontal Scrolling */}
//           {!showSearchResults && endingSoonOffers.length > 0 && (
//             <div className="bg-white mb-2 py-4">
//               <div className="flex items-center justify-between px-4 mb-3">
//                 <h2 className="text-lg font-bold text-gray-900 flex items-center">
//                   <Clock className="w-5 h-5 text-red-500 mr-2" />
//                   Ending Soon
//                 </h2>
//                 <button
//                   onClick={() => onNavigate('allOffers', { title: 'Ending Soon', offers: endingSoonOffers })}
//                   className="text-blue-600 text-sm font-semibold"
//                 >
//                   View All
//                 </button>
//               </div>

//               <div className="overflow-x-auto px-4 scrollbar-hide">
//                 <div className="flex space-x-4 pb-2">
//                   {endingSoonOffers.slice(0, 10).map((offer) => (
//                     <div
//                       key={`ending-${offer.id}`}
//                       className="flex-shrink-0 w-44 bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
//                       onClick={() => onNavigate('offerDetails', { offer })}
//                     >
//                       <div className="relative w-full h-40 bg-white flex items-center justify-center">
//                         <ImageWithFallback
//                           src={offer.image}
//                           alt={offer.title}
//                           className="w-full h-full object-contain"
//                           fallbackSrc="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200"
//                         />
//                         {offer.discount > 0 && (
//                           <div className="absolute top-2 left-2 bg-orange-500 text-black px-2 py-0.5 rounded text-xs font-bold z-10">
//                             {offer.discount}% OFF
//                           </div>
//                         )}
//                       </div>

//                       <div className="p-2">
//                         <h3 className="font-medium text-xs text-gray-900 line-clamp-2 mb-1">
//                           {offer.title}
//                         </h3>

//                         <div className="flex items-center space-x-1 mb-1">
//                           {offer.originalPrice > offer.discountedPrice ? (
//                             <>
//                               <span className="text-sm font-bold text-gray-900">
//                                 ₹{offer.discountedPrice}
//                               </span>
//                               <span className="text-xs text-gray-500 line-through">
//                                 ₹{offer.originalPrice}
//                               </span>
//                             </>
//                           ) : (
//                             <span className="text-sm font-bold text-gray-900">
//                               ₹{offer.discountedPrice || offer.originalPrice}
//                             </span>
//                           )}
//                         </div>

//                         {offer.distance && (
//                           <p className="text-xs text-gray-500">
//                             {parseFloat(offer.distance).toFixed(1)}km away
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* All Offers Section - Grid Layout (3 per row) */}
//           {!showSearchResults && latestOffers.length > 0 && (
//             <div className="bg-white mb-2 py-4">
//               <div className="flex items-center justify-between px-4 mb-3">
//                 <h2 className="text-lg font-bold text-gray-900 flex items-center">
//                   <Star className="w-5 h-5 text-yellow-500 mr-2" />
//                   Top Offers
//                 </h2>
//                 <button
//                   onClick={() => onNavigate('allOffers', { title: 'All Offers', offers: latestOffers })}
//                   className="text-blue-600 text-sm font-semibold cursor-pointer"
//                 >
//                   View All
//                 </button>
//               </div>

//               <div className="px-4">
//                 <div className="grid grid-cols-3 gap-4">
//                   {latestOffers.slice(0, 21).map((offer) => (
//                     <div
//                       key={`top-${offer.id}`}
//                       className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
//                       onClick={() => onNavigate('offerDetails', { offer })}
//                     >
//                       <div className="relative w-full h-52 bg-white flex items-center justify-center">
//                         <ImageWithFallback
//                           src={offer.image}
//                           alt={offer.title}
//                           className="w-full h-full object-contain"
//                           fallbackSrc="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200"
//                         />
//                         {offer.discount > 0 && (
//                           <div className="absolute top-2 left-2 bg-green-500 text-black px-2 py-0.5 rounded text-xs font-bold z-10">
//                             {offer.discount}% OFF
//                           </div>
//                         )}
//                       </div>

//                       <div className="p-2">
//                         <h3 className="font-medium text-xs text-gray-900 line-clamp-2 mb-1 min-h-[2rem]">
//                           {offer.title}
//                         </h3>

//                         <div className="flex items-center space-x-1 mb-1">
//                           {offer.originalPrice > offer.discountedPrice ? (
//                             <>
//                               <span className="text-sm font-bold text-gray-900">
//                                 ₹{offer.discountedPrice}
//                               </span>
//                               <span className="text-xs text-gray-500 line-through">
//                                 ₹{offer.originalPrice}
//                               </span>
//                             </>
//                           ) : (
//                             <span className="text-sm font-bold text-gray-900">
//                               ₹{offer.discountedPrice || offer.originalPrice}
//                             </span>
//                           )}
//                         </div>

//                         {offer.distance && (
//                           <p className="text-xs text-gray-500">
//                             {parseFloat(offer.distance).toFixed(1)}km away
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Load More Section */}
//               {hasMore && !loadingOffers && latestOffers.length >= 9 && (
//                 <div className="flex justify-center mt-4 px-4">
//                   <button
//                     onClick={() => loadOffers(page + 1, activeCategory)}
//                     className="px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm text-sm"
//                   >
//                     Load More Offers
//                   </button>
//                 </div>
//               )}

//               {loadingOffers && page > 1 && (
//                 <div className="flex justify-center py-4">
//                   <div className="w-6 h-6 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
//                 </div>
//               )}
//             </div>
//           )}

//           {/* No Offers Message */}
//           {!showSearchResults && !loadingOffers && !offersError && filteredOffers.length === 0 && (
//             <div className="bg-white text-center py-12 px-4 mx-2 rounded-lg">
//               <p className="text-gray-600">No offers available within {filterOptions.distance}km</p>
//               <button
//                 onClick={() => setShowFilterPanel(true)}
//                 className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Adjust Distance Filter
//               </button>
//             </div>
//           )}
//         </div>

//         {/* About OfferBeez Section */}
//         <div className="bg-white px-4 py-6 mb-2 ">
//           <div className="max-w-7xl mx-auto  ">
//             <h2 className="text-xl font-bold text-gray-600 mb-4">About OfferBeez – Find the Best offers Near you!</h2>

//             <p className="text-sm text-gray-600 leading-relaxed mb-3">
//               OfferBeez is your ultimate local deal finder that helps you explore exclusive offers, discounts, and promotions from nearby stores — all within a 1 km to 10 km range! Whether it's fashion, electronics, food, beauty, or daily essentials, OfferBeez connects you directly to the best stores around you offering amazing deals.
//             </p>

//             <p className="text-sm text-gray-600 leading-relaxed mb-4">
//               Find exciting offers shared by registered business owners and verified sales partners on the OfferBeez platform, updated in real time — so you never miss out on a great bargain again!
//             </p>

//             <div className="space-y-4">
//               <div>
//                   <h3 className="text-base font-semibold text-gray-400 mb-2">🚶‍♂️ Visit & Save Instantly</h3>
//                 <p className="text-sm text-gray-600 leading-relaxed">
//                   Skip online shopping — with OfferBeez, all offers are in-store only! Simply visit the store, explore the available offers, and purchase directly before the deal or stock ends. Experience the product firsthand for complete satisfaction and trust before you buy.
//                 </p>
//               </div>

//               <div>
//                 <h3 className="text-base font-semibold text-gray-400 mb-2">🧵 Discover Hidden Local Gems</h3>
//                 <p className="text-sm text-gray-600 leading-relaxed">
//                   OfferBeez helps you uncover more than just big-brand offers — explore small-scale businesses, handmade products, and even home services in your local area. You might find amazing items or services you never knew existed right around the corner!
//                 </p>
//               </div>

//               <div>
//                 <h3 className="text-base font-semibold text-gray-400 mb-2">📍 Smart Location-Based Offers</h3>
//                 <p className="text-sm text-gray-600 leading-relaxed">
//                   OfferBeez automatically detects your location and displays the most relevant offers nearby. You can find store details, addresses, and navigate directly using the built-in map feature to reach your chosen shop quickly and conveniently.
//                 </p>
//               </div>

//               <div>
//                 <h3 className="text-base font-semibold text-gray-400 mb-2">🛍️ Why Choose OfferBeez?</h3>
//                 <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
//                   <li>Discover exclusive nearby deals from trusted local stores.</li>
//                   <li>Explore offers within a 1–10 km range based on your location.</li>
//                   <li>Find unique handmade products and small businesses.</li>
//                   <li>Navigate easily with the integrated map and store details.</li>
//                   <li>Get real-time updates on new offers around you.</li>
//                   <li>Support local businesses while saving more.</li>
//                 </ul>
//               </div>

//               <div>
//                 <h3 className="text-base font-semibold text-gray-400 mb-2">💡 How OfferBeez Works:</h3>
//                 <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
//                   <li>Set your location – Allow the app to detect your area automatically.</li>
//                   <li>Browse offers – View deals and discounts available within your range.</li>
//                   <li>Visit the store – Use the map to reach the location easily.</li>
//                   <li>Purchase directly – Enjoy the best prices and quality while stocks last!</li>
//                 </ul>
//               </div>

//               <div>
//                 <h3 className="text-base font-semibold text-gray-400 mb-2">✨ Why Users Love OfferBeez:</h3>
//                 <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
//                   <li>Simple, smooth, and user-friendly experience.</li>
//                   <li>Personalized offers based on your area.</li>
//                   <li>Promotes local and small-scale businesses.</li>
//                   <li>Helps you explore unique, authentic, and handmade products.</li>
//                 </ul>
//               </div>

//               <div className="text-center mt-6">
//                     <p className="text-base font-semibold text-gray-600 mb-1">
//                   Start exploring today and never miss a great local deal again — only with OfferBeez!
//                 </p>
//                 <p className="text-sm font-medium text-gray-600">
//                   Discover. Visit. Experience. Save.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <Footer onNavigate={onNavigate} />
//       </div>

//       {/* Filter Panel - Simplified with only distance filter */}
//       <AnimatePresence>
//         {showFilterPanel && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center"
//             onClick={() => setShowFilterPanel(false)}
//           >
//             <motion.div
//               initial={{ y: '100%' }}
//               animate={{ y: 0 }}
//               exit={{ y: '100%' }}
//               transition={{ type: 'spring', damping: 25 }}
//               className="bg-white rounded-t-2xl w-full max-w-lg mx-4 mb-4 max-h-[80vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-6">
//                 {/* Header */}
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-xl font-bold text-gray-900">Filter by Distance</h2>
//                   <button
//                     onClick={() => setShowFilterPanel(false)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     ×
//                   </button>
//                 </div>

//                 {/* Maximum Distance - Only filter */}
//                 <div className="mb-6">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                     Maximum Distance: {filterOptions.distance} km
//                   </h3>
//                   <input
//                     type="range"
//                     min="1"
//                     max="25"
//                     step="1"
//                     value={filterOptions.distance}
//                     onChange={(e) => setFilterOptions(prev => ({
//                       ...prev,
//                       distance: parseInt(e.target.value)
//                     }))}
//                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//                   />
//                   <div className="flex justify-between text-sm text-gray-600">
//                     <span>1 km</span>
//                     <span>25 km</span>
//                   </div>
//                   <p className="text-sm text-gray-500 mt-2">
//                     Show offers within {filterOptions.distance} km of your location
//                   </p>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex space-x-3">
//                   <button
//                     onClick={handleFilterReset}
//                     className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//                   >
//                     Reset
//                   </button>
//                   <button
//                     onClick={handleFilterApply}
//                     className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
//                   >
//                     Apply Filter
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Direction Popup */}
//       {showDirectionPopup && directionData && (
//         <DirectionPopup
//           storeName={directionData.storeName}
//           storeAddress={directionData.storeAddress}
//           distance={directionData.distance}
//           estimatedTime={directionData.estimatedTime}
//         />
//       )}

//       {/* Ad Videos */}
//       <AnimatePresence>
//         {showAdVideo && (
//           <AdVideoPopup
//             title="Fashion Sale"
//             discount="50% OFF"
//             image="https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc2FsZXxlbnwxfHx8fDE3NTc3NDgwODN8MA&ixlib=rb-4.1.0&q=80&w=200"
//             side={adVideoSide}
//             onClose={() => setShowAdVideo(false)}
//             onClick={() => {
//               setShowAdVideo(false);
//               onNavigate('offerDetails', { offer: offers[1] });
//             }}
//           />
//         )}
//       </AnimatePresence>

//       {/* Share Popup */}
//       <SharePopup
//         isOpen={showSharePopup}
//         onClose={() => setShowSharePopup(false)}
//         offer={selectedOffer}
//       />

//       {/* Notification Panel */}
//       <NotificationPanel
//         isOpen={showNotifications}
//         onClose={() => setShowNotifications(false)}
//       />

//       {/* Fixed Bottom Navigation with Home tab active */}
//       <div className="flex-shrink-0">
//         <BottomNavigation
//           activeScreen="home"
//           onNavigate={onNavigate}
//         />
//       </div>

//       {/* Map Location Picker */}
//       <MapLocationPicker
//         isOpen={showMapPicker}
//         onClose={() => setShowMapPicker(false)}
//         onLocationSelect={handleMapLocationSelect}
//         currentLocation={currentLocation}
//       />
//     </div>
//   );
// });

// export default HomeScreen;

/////////////


import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, ChevronDown, Filter, Search, X, ArrowRight } from "lucide-react";
import CategoryIcon from "./atoms/CategoryIcon";
import OfferCard from "./atoms/OfferCard";
import AdVideoPopup, { shouldShowAdVideo } from "./atoms/AdVideoPopup";
import DirectionPopup from "./atoms/DirectionPopup";
import AutoSlider from "./atoms/AutoSlider";
import BottomNavigation from "./atoms/BottomNavigation";
import OfferTypeFilter from "./atoms/OfferTypeFilter";
import ContactAdvertisement from "./atoms/ContactAdvertisement";
import { apiService } from "../services/api";
import LocationManager from "./LocationManager";
import MapLocationPicker from "./MapLocationPicker";
import { CategoryListSkeleton } from "./atoms/CategorySkeleton";
import { formatAddress, isCoordinateString } from "../utils/addressFormatter";
import Footer from "./atoms/Footer";

interface HomeScreenProps {
  username: string;
  selectedCategory: string;
  onNavigate: (screen: string, data?: any) => void;
  onLikeCountChange?: (count: number) => void;
}

const HomeScreen = React.memo(function HomeScreen({
  username,
  selectedCategory,
  onNavigate,
  onLikeCountChange,
}: HomeScreenProps) {
  const [apiBanners, setApiBanners] = useState<any[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(false);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Load banners from API
  const loadBanners = async () => {
    try {
      setLoadingBanners(true);

      const response = await apiService.getBanners();
      console.log("🎯 API BANNERS:", response);

      if (Array.isArray(response) && response.length > 0) {
        setApiBanners(response);
      } else {
        console.warn("⚠️ No banners returned");
        setApiBanners([]);
      }
    } catch (error) {
      console.error("❌ Banner API failed:", error);
      setApiBanners([]);
    } finally {
      setLoadingBanners(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  // Auto rotation
  useEffect(() => {
    if (apiBanners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % apiBanners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [apiBanners.length]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(
    selectedCategory || "All"
  );
  const [showAdVideo, setShowAdVideo] = useState(false);
  const [adVideoSide, setAdVideoSide] = useState<"left" | "right">("left");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterDistance, setFilterDistance] = useState(5);
  const [selectedDistance, setSelectedDistance] = useState(5);
  const [userInactive, setUserInactive] = useState(false);
  const [selectedOfferType, setSelectedOfferType] = useState<string | null>(
    null
  );
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Category states
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Location states
  const [showLocationManager, setShowLocationManager] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  /* ------------------ LOAD INITIAL DATA ------------------ */
  useEffect(() => {
    loadInitialData();
  }, []);

  // Update activeCategory when selectedCategory prop changes
  useEffect(() => {
    if (selectedCategory && selectedCategory !== activeCategory) {
      console.log("📍 Setting active category from prop:", selectedCategory);
      setActiveCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const loadInitialData = async () => {
    try {
      // Load categories in background
      setLoadingCategories(true);
      console.log("Loading categories...");
      const categoriesResponse = await apiService.getAllCategories();
      console.log("Categories response:", categoriesResponse);
      console.log(
        "Full categories data:",
        JSON.stringify(categoriesResponse, null, 2)
      );

      const fetchedCategories = categoriesResponse.categories || [];
      console.log("Fetched categories count:", fetchedCategories.length);

      if (fetchedCategories.length === 0) {
        throw new Error("No categories returned from API");
      }

      console.log("First category structure:", fetchedCategories[0]);

      // Store full category data with images
      const allCategory = {
        name: "All",
        image:
          "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200",
      };

      // Map categories with proper image fallbacks based on category name
      const categoriesWithImages = fetchedCategories.map((cat: any) => {
        const categoryName = cat.categoryName || cat.name || "Unknown";

        // Extract icon URL from API response
        let iconUrl =
          cat.categoryIconUrl ||
          cat.categoryIcon ||
          cat.icon ||
          cat.image ||
          cat.iconUrl ||
          cat.icon_url;

        // Decode URL-encoded characters (replace + with space and decode URI component)
        if (iconUrl && typeof iconUrl === "string") {
          try {
            // Replace + with %20 for proper URL encoding
            iconUrl = iconUrl.replace(/\+/g, "%20");
            console.log("Processed icon URL:", iconUrl);
          } catch (e) {
            console.error("Error processing icon URL:", e);
          }
        }

        // Provide category-specific placeholder images as fallback
        const categoryImages: { [key: string]: string } = {
          Clothing:
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
          Fashion:
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
          fashion:
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
          "Home & Life Style":
            "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=200",
          "Small-Scale Manufacturing":
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200",
          "Wholesale & Distribution":
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200",
          Fashoin:
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
          "Automotive and Industrial":
            "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200",
        };

        console.log("Category:", categoryName, "Raw cat object:", cat);
        console.log("Category:", categoryName, "Final Icon URL:", iconUrl);

        return {
          name: categoryName,
          image:
            iconUrl ||
            categoryImages[categoryName] ||
            "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200",
        };
      });

      setCategoryData([allCategory, ...categoriesWithImages]);
      setCategories([
        "All",
        ...categoriesWithImages.map((cat: any) => cat.name),
      ]);
      setLoadingCategories(false);

      // Check for saved location in localStorage first (for persistence across refreshes)
      const savedLocation = localStorage.getItem("userLocation");
      if (savedLocation) {
        try {
          const parsedLocation = JSON.parse(savedLocation);
          console.log("Found saved location in localStorage:", parsedLocation);
          setCurrentLocation(parsedLocation);
          setIsLoadingLocation(false);
          return;
        } catch (e) {
          console.error("Error parsing saved location:", e);
          localStorage.removeItem("userLocation");
        }
      }

      // Check for saved location from API
      console.log("Checking for saved location from API...");
      const locationResponse = await apiService.getUserLocation();
      console.log("Location response:", locationResponse);

      if (locationResponse && locationResponse.latitude && locationResponse.longitude) {
        // Save to localStorage for persistence
        localStorage.setItem("userLocation", JSON.stringify(locationResponse));
        setCurrentLocation(locationResponse);
        setIsLoadingLocation(false);
        console.log("Location found and set");
      } else {
        // Show location manager but keep fallback offers visible
        console.log("No location found, showing location manager");
        setIsLoadingLocation(false);
        setShowLocationManager(true);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      setLoadingCategories(false);
      setIsLoadingLocation(false);

      // Set empty categories with only "All"
      const allCategory = {
        name: "All",
        image:
          "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200",
      };
      setCategoryData([allCategory]);
      setCategories(["All"]);

      // Try to use localStorage location as fallback
      const savedLocation = localStorage.getItem("userLocation");
      if (savedLocation) {
        try {
          const parsedLocation = JSON.parse(savedLocation);
          setCurrentLocation(parsedLocation);
        } catch (e) {
          setShowLocationManager(true);
        }
      } else {
        setShowLocationManager(true);
      }
    }
  };

  const handleLocationSet = (location: any) => {
    // Save location to localStorage for persistence across refreshes
    localStorage.setItem("userLocation", JSON.stringify(location));
    setCurrentLocation(location);
    setShowLocationManager(false);
    // Clear offers cache when location changes
    apiService.clearOffersCache();
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
    localStorage.setItem("userLocation", JSON.stringify(newLocation));

    // Save location to API
    try {
      await apiService.setUserLocation(location.latitude, location.longitude, location.address);
      setCurrentLocation(newLocation);
      setShowMapPicker(false);
      // Reload offers with new location
      apiService.clearOffersCache();
    } catch (error) {
      console.error("Error saving location:", error);
      // Still update UI even if API call fails (localStorage already saved)
      setCurrentLocation(newLocation);
      setShowMapPicker(false);
    }
  };

  /* ------------------ LOAD CATEGORIES ------------------ */
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      setCategoryError(null);
      console.log("Loading categories...");

      const categoriesResponse = await apiService.getAllCategories();
      console.log("Categories response:", categoriesResponse);

      const fetchedCategories = categoriesResponse.categories || [];
      console.log("Fetched categories count:", fetchedCategories.length);

      if (fetchedCategories.length === 0) {
        throw new Error("No categories returned from API");
      }

      console.log("First category structure:", fetchedCategories[0]);

      // Store full category data with images
      const allCategory = {
        name: "All",
        image:
          "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200",
      };

      // Map categories with proper image fallbacks based on category name
      const categoriesWithImages = fetchedCategories.map((cat: any) => {
        const categoryName = cat.categoryName || cat.name || "Unknown";

        // Extract icon URL from API response
        let iconUrl =
          cat.categoryIconUrl ||
          cat.categoryIcon ||
          cat.icon ||
          cat.image ||
          cat.iconUrl ||
          cat.icon_url;

        // Decode URL-encoded characters (replace + with space and decode URI component)
        if (iconUrl && typeof iconUrl === "string") {
          try {
            // Replace + with %20 for proper URL encoding
            iconUrl = iconUrl.replace(/\+/g, "%20");
            console.log("Processed icon URL:", iconUrl);
          } catch (e) {
            console.error("Error processing icon URL:", e);
          }
        }

        // Provide category-specific placeholder images as fallback
        const categoryImages: { [key: string]: string } = {
          Clothing:
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
          Fashion:
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
          fashion:
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
          "Home & Life Style":
            "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=200",
          "Small-Scale Manufacturing":
            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200",
          "Wholesale & Distribution":
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200",
          Fashoin:
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200",
          "Automotive and Industrial":
            "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200",
        };

        console.log("Category:", categoryName, "Raw cat object:", cat);
        console.log("Category:", categoryName, "Final Icon URL:", iconUrl);

        return {
          name: categoryName,
          image:
            iconUrl ||
            categoryImages[categoryName] ||
            "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200",
        };
      });

      setCategoryData([allCategory, ...categoriesWithImages]);
      setCategories([
        "All",
        ...categoriesWithImages.map((cat: any) => cat.name),
      ]);
      setLoadingCategories(false);
    } catch (error) {
      console.error("Error loading categories:", error);
      setLoadingCategories(false);
      setCategoryError("Failed to load categories. Please try again later.");

      // Set empty categories with only "All"
      const allCategory = {
        name: "All",
        image:
          "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200",
      };

      setCategoryData([allCategory]);
      setCategories(["All"]);
    }
  };

  /* ------------------ OFFERS DATA ------------------ */
  const offers = React.useMemo(
    () => [
      {
        id: 1,
        title: "Domino's Pizza",
        category: "Food",
        description: "Family Combo Deal - 2 Large Pizzas + Sides",
        originalPrice: 899,
        discountedPrice: 449,
        discount: 50,
        distance: "0.8 km",
        address: "Phoenix Mall, Food Court",
        rating: 4.2,
        image:
          "https://images.unsplash.com/photo-1594398028856-f253a046f417?w=400",
        validity: "Valid till 31 Dec 2024",
        offerType: "discounted",
      },
      {
        id: 2,
        title: "Zara Fashion Store",
        category: "Fashion",
        description: "Winter Collection - Jackets & Coats",
        originalPrice: 2999,
        discountedPrice: 1799,
        discount: 40,
        distance: "1.2 km",
        address: "City Center Mall",
        rating: 4.5,
        image:
          "https://images.unsplash.com/photo-1575111507952-2d4f371374f5?w=400",
        validity: "Valid till 15 Jan 2024",
        offerType: "flat",
      },
      {
        id: 3,
        title: "Samsung Galaxy Store",
        category: "Electronics",
        description: "Galaxy S24 with ₹15K off + Exchange",
        originalPrice: 74999,
        discountedPrice: 59999,
        discount: 20,
        distance: "2.1 km",
        address: "Tech Plaza",
        rating: 4.3,
        image:
          "https://images.unsplash.com/photo-1723910168805-e783bc5c15c0?w=400",
        validity: "Valid till 28 Dec 2024",
        offerType: "exchange",
      },
      {
        id: 4,
        title: "Lakme Beauty Salon",
        category: "Beauty",
        description: "Hair & Skin Care Package",
        originalPrice: 3500,
        discountedPrice: 2450,
        discount: 30,
        distance: "0.5 km",
        address: "Central Mall",
        rating: 4.4,
        image:
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
        validity: "Valid till 20 Jan 2024",
        offerType: "discounted",
      },
      {
        id: 5,
        title: "Nike Sports Store",
        category: "Fitness",
        description: "Athletic Wear & Shoes",
        originalPrice: 4999,
        discountedPrice: 3999,
        discount: 20,
        distance: "1.8 km",
        address: "Forum Mall",
        rating: 4.1,
        image:
          "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=400",
        validity: "Valid till 25 Dec 2024",
        offerType: "flat",
      },
      {
        id: 6,
        title: "Big Bazaar Grocery",
        category: "Grocery",
        description: "Weekly Grocery Package",
        originalPrice: 1299,
        discountedPrice: 999,
        discount: 23,
        distance: "0.3 km",
        address: "Metro Cash & Carry",
        rating: 3.9,
        image:
          "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400",
        validity: "Valid till 30 Dec 2024",
        offerType: "exchange",
      },
      {
        id: 7,
        title: "H&M Fashion",
        category: "Fashion",
        description: "Summer Sale - Up to 60% Off",
        originalPrice: 3999,
        discountedPrice: 1599,
        discount: 60,
        distance: "2.3 km",
        address: "Mantri Square Mall",
        rating: 4.6,
        image:
          "https://images.unsplash.com/photo-1623332670442-4b6873fb6f03?w=400",
        validity: "Valid till 10 Jan 2024",
        offerType: "discounted",
      },
      {
        id: 8,
        title: "Apple Store",
        category: "Electronics",
        description: "iPhone 15 with Trade-in",
        originalPrice: 79999,
        discountedPrice: 64999,
        discount: 19,
        distance: "3.5 km",
        address: "UB City Mall",
        rating: 4.7,
        image:
          "https://images.unsplash.com/photo-1611079167993-e57e6300c9b8?w=400",
        validity: "Valid till 5 Jan 2024",
        offerType: "exchange",
      },
      {
        id: 9,
        title: "Burger King",
        category: "Food",
        description: "Whopper Meal Combo",
        originalPrice: 299,
        discountedPrice: 199,
        discount: 33,
        distance: "1.1 km",
        address: "Brigade Road",
        rating: 4.0,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
        validity: "Valid till 31 Dec 2024",
        offerType: "flat",
      },
      {
        id: 10,
        title: "Lifestyle Fashion",
        category: "Fashion",
        description: "Flat ₹1000 Off on Purchase",
        originalPrice: 4999,
        discountedPrice: 3999,
        discount: 20,
        distance: "1.5 km",
        address: "Garuda Mall",
        rating: 4.2,
        image:
          "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400",
        validity: "Valid till 15 Jan 2024",
        offerType: "flat",
      },
      {
        id: 11,
        title: "Decathlon",
        category: "Fitness",
        description: "Sports Equipment Exchange",
        originalPrice: 5999,
        discountedPrice: 4299,
        discount: 28,
        distance: "2.8 km",
        address: "Sarjapur Road",
        rating: 4.3,
        image:
          "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
        validity: "Valid till 20 Jan 2024",
        offerType: "exchange",
      },
      {
        id: 12,
        title: "Levi's Store",
        category: "Fashion",
        description: "Denim Days - 50% Off",
        originalPrice: 3499,
        discountedPrice: 1749,
        discount: 50,
        distance: "1.9 km",
        address: "Phoenix Marketcity",
        rating: 4.4,
        image:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        validity: "Valid till 8 Jan 2024",
        offerType: "discounted",
      },
    ],
    []
  );

  /* ------------------ BANNERS ------------------ */
  const banners = React.useMemo(
    () => [
      {
        id: 1,
        title: "New Year Mega Sale",
        subtitle: "Up to 70% off on everything",
        images: [
          "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600",
          "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600",
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600",
        ],
        color: "from-red-500 to-pink-600",
        offer: offers[0],
      },
      {
        id: 2,
        title: "Flash Weekend Deal",
        subtitle: "Limited time offers",
        images: [
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600",
          "https://images.unsplash.com/photo-1594398028856-f253a046f417?w=600",
          "https://images.unsplash.com/photo-1575111507952-2d4f371374f5?w=600",
        ],
        color: "from-blue-500 to-purple-600",
        offer: offers[1],
      },
      {
        id: 3,
        title: "Special Discounts",
        subtitle: "Exclusive member offers",
        images: [
          "https://images.unsplash.com/photo-1571019613914-85f342c6a11e?w=600",
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
        ],
        color: "from-green-500 to-teal-600",
        offer: offers[2],
      },
    ],
    [offers]
  );

  /* ------------------ AUTO BANNER ROTATION ------------------ */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  /* ------------------ USER INACTIVITY (AUTO SLIDER) ------------------ */
  useEffect(() => {
    let inactivityTimeout: NodeJS.Timeout;

    const resetTimer = () => {
      setUserInactive(false);
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        setUserInactive(true);
      }, 20000);
    };

    const handleActivity = () => resetTimer();

    document.addEventListener("touchstart", handleActivity, { passive: true });
    document.addEventListener("click", handleActivity, { passive: true });

    resetTimer();

    return () => {
      document.removeEventListener("touchstart", handleActivity);
      document.removeEventListener("click", handleActivity);
      clearTimeout(inactivityTimeout);
    };
  }, []);

  /* ------------------ AD VIDEO POPUP ------------------ */
  useEffect(() => {
    if (!shouldShowAdVideo()) return;

    const timer = setTimeout(() => {
      setAdVideoSide(Math.random() > 0.5 ? "left" : "right");
      setShowAdVideo(true);

      const hideTimer = setTimeout(() => setShowAdVideo(false), 5000);
      return () => clearTimeout(hideTimer);
    }, 25000); // Increased delay to reduce initial load impact

    return () => clearTimeout(timer);
  }, []);

  /* ------------------ SEARCH HANDLER ------------------ */
  const handleSearch = React.useCallback(
    (query: string) => {
      if (query.trim()) {
        const results = offers.filter(
          (offer) =>
            offer.title.toLowerCase().includes(query.toLowerCase()) ||
            offer.description.toLowerCase().includes(query.toLowerCase()) ||
            offer.category.toLowerCase().includes(query.toLowerCase()) ||
            offer.address.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    },
    [offers]
  );

  /* ------------------ CATEGORY SELECT HANDLER ------------------ */
  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    // Clear search results when category changes
    setSelectedOfferType(null);
    setSearchResults([]);
    setSearchQuery("");

    console.log(`Selected category: ${category}`);
  };

  /* ------------------ NAVIGATE TO GOOGLE MAPS ------------------ */
  const handleGetDirections = (offer: any) => {
    const address = encodeURIComponent(`${offer.address}, Bangalore`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${address}`,
      "_blank"
    );
  };

  /* ------------------ NAVIGATE TO SPECIALIZED SCREENS ------------------ */
  const handleNavigateToSpecializedScreen = (screen: string) => {
    console.log("Navigating to:", screen);
    onNavigate(screen);
  };

  /* ------------------ FILTERED OFFERS ------------------ */
  const filteredOffers = React.useMemo(() => {
    let filtered =
      activeCategory === "All"
        ? offers
        : offers.filter((offer) => offer.category === activeCategory);

    if (selectedOfferType) {
      filtered = filtered.filter(
        (offer) => offer.offerType === selectedOfferType
      );
    }

    // Filter by distance
    filtered = filtered.filter((offer) => {
      const distance = parseFloat(offer.distance.split(" ")[0]);
      return distance <= selectedDistance;
    });

    return filtered;
  }, [offers, activeCategory, selectedOfferType, selectedDistance]);

  /* ------------------ GROUP OFFERS ------------------ */
  const offersByType = React.useMemo(
    () => ({
      exchange: filteredOffers
        .filter((o) => o.offerType === "exchange")
        .slice(0, 3),
      flat: filteredOffers.filter((o) => o.offerType === "flat").slice(0, 3),
      discounted: filteredOffers
        .filter((o) => o.offerType === "discounted")
        .slice(0, 3),
    }),
    [filteredOffers]
  );

  /* ------------------ ALL OFFERS FOR VIEW ALL ------------------ */
  const allOffersForViewAll = React.useMemo(() => {
    let allOffers = filteredOffers;
    
    // If a specific offer type is selected, filter by that type
    if (selectedOfferType) {
      allOffers = allOffers.filter(offer => offer.offerType === selectedOfferType);
    }
    
    return allOffers;
  }, [filteredOffers, selectedOfferType]);

  /* ------------------ OFFER TYPE FILTER HANDLER ------------------ */
  const handleOfferTypeSelect = (type: string | null) => {
    if (type === selectedOfferType) {
      // If clicking the same type, deselect it
      setSelectedOfferType(null);
    } else {
      setSelectedOfferType(type);
    }
  };

  /* ------------------ OFFER TYPE FILTER CLICK HANDLER ------------------ */
  const handleOfferTypeClick = (type: string | null) => {
    if (type === selectedOfferType) {
      // If clicking the same type, deselect it
      setSelectedOfferType(null);
    } else {
      setSelectedOfferType(type);
    }
  };

  /* ------------------ VIEW ALL HANDLER ------------------ */
  const handleViewAll = () => {
    // Navigate to allOffers screen with the filtered offers
    onNavigate("allOffers", {
      title: selectedOfferType 
        ? `All ${selectedOfferType.charAt(0).toUpperCase() + selectedOfferType.slice(1)} Offers` 
        : activeCategory === "All" 
        ? "All Offers" 
        : `All ${activeCategory} Offers`,
      offers: allOffersForViewAll,
      category: activeCategory !== "All" ? activeCategory : null,
      offerType: selectedOfferType
    });
  };

  /* ------------------ RELOAD CATEGORIES ------------------ */
  const handleReloadCategories = () => {
    loadCategories();
  };

  /* ------------------ LOCATION DISPLAY TEXT ------------------ */
  const getLocationDisplayText = () => {
    if (!currentLocation) {
      return "Set Location";
    }
    
    const formattedAddress = formatAddress(currentLocation?.address);
    
    if (formattedAddress && !isCoordinateString(formattedAddress)) {
      // Show readable address
      return formattedAddress.split(',')[0] || formattedAddress;
    } else {
      // Show city name or generic text
      return currentLocation.city || "Location Set";
    }
  };

  /* ------------------ SHOW LOCATION MANAGER ------------------ */
  if (showLocationManager) {
    return (
      <LocationManager
        onLocationSet={handleLocationSet}
        onSkip={() => setShowLocationManager(false)}
        showSkip={true}
      />
    );
  }

  /* ------------------ RETURN UI START ------------------ */
  return (
    <div className="h-screen flex flex-col relative">
      {/* Gradient BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-400 -z-10" />
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-400/40 via-transparent to-blue-500/40 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-pink-400/50 via-transparent to-transparent -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_var(--tw-gradient-stops))] from-blue-400/50 via-transparent to-transparent -z-10" />

      {/* FIXED HEADER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-md px-4 py-3 shadow-sm relative border-b border-purple-100/50 flex-shrink-0"
      >
        <div className="flex items-center justify-between mb-3">
          {/* LOCATION DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => handleLocationClick()}
              className="flex items-center space-x-1 bg-purple-50 px-2 py-1.5 rounded-lg min-w-[140px]"
            >
              <MapPin className="w-3.5 h-3.5 text-purple-600" />
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs text-gray-600 truncate">
                  {isLoadingLocation ? "Loading..." : getLocationDisplayText()}
                </p>
                <p className="text-[10px] text-gray-500 truncate">
                  {currentLocation?.city || "Bangalore"}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-600 flex-shrink-0" />
            </button>
          </div>

          {/* LOGO */}
          <div className="w-24">
            <img
              src="/512pxlogo-1[1].png"
              alt="OfferBeez"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* SEARCH + FILTER + ADS BUTTON */}
        <div className="flex items-center space-x-2">
          {/* Search Bar WITH Filter Inside */}
          <div className="flex-1 relative">
            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
              {/* Search Icon */}
              <Search className="w-5 h-5 text-gray-400 mr-2" />

              {/* Input Field */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim()) {
                    handleSearch(e.target.value);
                  } else {
                    setSearchResults([]);
                  }
                }}
                placeholder="Search for offers, stores..."
                className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(searchQuery);
                  }
                }}
              />

              {/* Clear Button */}
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="mr-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Filter ICON inside search bar */}
              <button
                onClick={() => setShowFilterPanel(true)}
                className="w-8 h-8 bg-white rounded-md flex items-center justify-center border border-gray-200 shadow-sm ml-2"
              >
                <Filter className="w-4 h-4 text-gray-700" />
              </button>
            </div>

            {/* Search Suggestions */}
            {searchQuery.trim() && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                {searchResults.slice(0, 5).map((offer, index) => (
                  <div
                    key={`search-${offer.id}-${index}`}
                    onClick={() => {
                      onNavigate("offerDetails", { offer });
                      setSearchQuery("");
                      setSearchResults([]);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="w-12 h-12 flex-shrink-0 rounded overflow-hidden">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 truncate">
                        {offer.title}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {offer.category} • {offer.distance}
                      </p>
                      {offer.discount > 0 && (
                        <span className="inline-block mt-1 text-xs font-semibold text-green-600">
                          {offer.discount}% OFF
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800">
                        ₹{offer.discountedPrice}
                      </p>
                      {offer.originalPrice > offer.discountedPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ₹{offer.originalPrice}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ads Button */}
          <div className="w-48 flex-none">
            <ContactAdvertisement />
          </div>
        </div>
      </motion.div>

      {/* SCROLLABLE CONTENT SECTION - Everything below the header scrolls together */}
      <div 
        ref={mainContentRef} 
        className="flex-1 overflow-y-auto"
        style={{
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
          scrollBehavior: 'smooth',
          overscrollBehavior: 'contain' // Prevent bounce effects
        }}
      >
        {/* CATEGORY ICONS */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="py-3 bg-white border-b border-gray-100"
        >
          {loadingCategories ? (
            <CategoryListSkeleton />
          ) : categoryError ? (
            <div className="px-4 py-6 text-center">
              <div className="text-red-500 mb-3">
                <svg
                  className="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">{categoryError}</p>
              <button
                onClick={handleReloadCategories}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Retry Loading Categories
              </button>
            </div>
          ) : (
            <div
              ref={categoryScrollRef}
              className="overflow-x-auto px-4 scrollbar-hide"
            >
              <div className="flex space-x-3 pb-2">
                {categoryData.map((category) => (
                  <motion.div
                    key={category.name}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0"
                  >
                    <CategoryIcon
                      name={category.name}
                      image={category.image}
                      isActive={activeCategory === category.name}
                      onClick={() => handleCategorySelect(category.name)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ACTIVE CATEGORY INDICATOR */}
        {activeCategory !== "All" && (
          <div className="bg-blue-50 border-b border-blue-100 px-4 py-2">
            <p className="text-sm text-blue-700 font-medium">
              Showing {filteredOffers.length} offers in{" "}
              <span className="font-bold">{activeCategory}</span> category
            </p>
          </div>
        )}

        {/* BANNERS */}
        <div className="bg-white mb-2 mt-3">
          {loadingBanners ? (
            <div className="w-full h-48 bg-gray-200 animate-pulse"></div>
          ) : apiBanners.length > 0 ? (
            <div className="relative w-full overflow-hidden" style={{ height: "220px" }}>
              {apiBanners.map((banner, index) => (
                <div
                  key={index}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    opacity: currentBannerIndex === index ? 1 : 0,
                    zIndex: currentBannerIndex === index ? 10 : 0,
                    transition: "opacity 0.5s ease-in-out",
                  }}
                  onClick={() => {
                    if (banner.link) window.open(banner.link, "_blank");
                  }}
                >
                  <img
                    src={banner.image}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}

              {/* Indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                {apiBanners.map((_, index) => (
                  <div
                    key={index}
                    className={`rounded-full ${
                      currentBannerIndex === index
                        ? "bg-white w-4 h-1.5"
                        : "bg-white/50 w-1.5 h-1.5"
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
              <p>No banners available</p>
            </div>
          )}
        </div>
        
        {/* OFFER TYPE FILTER */}
        <div className="mb-4">
          <OfferTypeFilter
            selectedType={selectedOfferType}
            onTypeSelect={handleOfferTypeClick}
            onNavigate={handleNavigateToSpecializedScreen}
          />
        </div>

        {/* ALL OFFERS SECTION */}
        {filteredOffers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">
                {selectedOfferType
                  ? `All ${
                      selectedOfferType.charAt(0).toUpperCase() +
                      selectedOfferType.slice(1)
                    } Offers`
                  : activeCategory === "All"
                  ? "All Offers"
                  : `All ${activeCategory} Offers`}
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({allOffersForViewAll.length} results)
                </span>
              </h2>
              <button
                onClick={handleViewAll}
                className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 active:scale-95 transition-transform z-10 relative"
                style={{ position: "relative", zIndex: 10 }}
              >
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            <AutoSlider autoSlide={userInactive} slideInterval={2000} disableDrag={true}>
              {allOffersForViewAll.slice(0, 6).map((offer) => (
                <OfferCard
                  key={`all-${offer.id}`}
                  offer={offer}
                  onLike={() => {}}
                  onGetDirections={() => handleGetDirections(offer)}
                  onClick={() => onNavigate("offerDetails", { offer })}
                  hideActions={true}
                />
              ))}
            </AutoSlider>
          </motion.div>
        )}

        {/* NO OFFERS MESSAGE */}
        {filteredOffers.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No offers found
            </h3>
            <p className="text-gray-500 mb-4">
              {activeCategory !== "All"
                ? `No ${activeCategory.toLowerCase()} offers within ${selectedDistance}km`
                : `No offers within ${selectedDistance}km`}
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSelectedDistance(25);
                setSelectedOfferType(null);
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* LATEST OFFERS (EXCHANGE / FLAT / DISCOUNTED) */}
        {filteredOffers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 mb-20 relative"
            style={{ zIndex: 5, position: "relative" }}
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Latest Offers
            </h2>

            {/* Exchange Offers */}
            {offersByType.exchange.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold text-gray-800 flex items-center">
                    Exchange Offers
                    <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      {offersByType.exchange.length}
                    </span>
                  </h3>
                  <button
                    onClick={() => onNavigate("exchangeOffers")}
                    className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 active:scale-95 transition-transform z-10 relative"
                    style={{ position: "relative", zIndex: 10 }}
                  >
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {offersByType.exchange.map((offer) => (
                    <OfferCard
                      key={`exchange-${offer.id}`}
                      offer={offer}
                      onLike={() => {}}
                      onGetDirections={() => handleGetDirections(offer)}
                      onClick={() => onNavigate("offerDetails", { offer })}
                      hideActions={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Flat Offers */}
            {offersByType.flat.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold text-gray-800 flex items-center">
                    Flat Offers
                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      {offersByType.flat.length}
                    </span>
                  </h3>
                  <button
                    onClick={() => onNavigate("flatOffers")}
                    className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 active:scale-95 transition-transform z-10 relative"
                    style={{ position: "relative", zIndex: 10 }}
                  >
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {offersByType.flat.map((offer) => (
                    <OfferCard
                      key={`flat-${offer.id}`}
                      offer={offer}
                      onLike={() => {}}
                      onGetDirections={() => handleGetDirections(offer)}
                      onClick={() => onNavigate("offerDetails", { offer })}
                      hideActions={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Discounted Offers */}
            {offersByType.discounted.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold text-gray-800 flex items-center">
                    Discounted Offers
                    <span className="ml-2 text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                      {offersByType.discounted.length}
                    </span>
                  </h3>
                  <button
                    onClick={() => onNavigate("discountedOffers")}
                    className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 active:scale-95 transition-transform z-10 relative"
                    style={{ position: "relative", zIndex: 10 }}
                  >
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {offersByType.discounted.map((offer) => (
                    <OfferCard
                      key={`discounted-${offer.id}`}
                      offer={offer}
                      onLike={() => {}}
                      onGetDirections={() => handleGetDirections(offer)}
                      onClick={() => onNavigate("offerDetails", { offer })}
                      hideActions={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ABOUT OFFERBEEZ SECTION */}
        <div className="bg-white px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-gray-600 mb-4">About OfferBeez – Find the Best offers Near you!</h2>

            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              OfferBeez is your ultimate local deal finder that helps you explore exclusive offers, discounts, and promotions from nearby stores — all within a 1 km to 10 km range! Whether it's fashion, electronics, food, beauty, or daily essentials, OfferBeez connects you directly to the best stores around you offering amazing deals.
            </p>

            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Find exciting offers shared by registered business owners and verified sales partners on the OfferBeez platform, updated in real time — so you never miss out on a great bargain again!
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-semibold text-gray-400 mb-2">🚶‍♂️ Visit & Save Instantly</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Skip online shopping — with OfferBeez, all offers are in-store only! Simply visit the store, explore the available offers, and purchase directly before the deal or stock ends. Experience the product firsthand for complete satisfaction and trust before you buy.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-400 mb-2">🧵 Discover Hidden Local Gems</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  OfferBeez helps you uncover more than just big-brand offers — explore small-scale businesses, handmade products, and even home services in your local area. You might find amazing items or services you never knew existed right around the corner!
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-400 mb-2">📍 Smart Location-Based Offers</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  OfferBeez automatically detects your location and displays the most relevant offers nearby. You can find store details, addresses, and navigate directly using the built-in map feature to reach your chosen shop quickly and conveniently.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-400 mb-2">🛍️ Why Choose OfferBeez?</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Discover exclusive nearby deals from trusted local stores.</li>
                  <li>Explore offers within a 1–10 km range based on your location.</li>
                  <li>Find unique handmade products and small businesses.</li>
                  <li>Navigate easily with the integrated map and store details.</li>
                  <li>Get real-time updates on new offers around you.</li>
                  <li>Support local businesses while saving more.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-400 mb-2">💡 How OfferBeez Works:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Set your location – Allow the app to detect your area automatically.</li>
                  <li>Browse offers – View deals and discounts available within your range.</li>
                  <li>Visit the store – Use the map to reach the location easily.</li>
                  <li>Purchase directly – Enjoy the best prices and quality while stocks last!</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-400 mb-2">✨ Why Users Love OfferBeez:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Simple, smooth, and user-friendly experience.</li>
                  <li>Personalized offers based on your area.</li>
                  <li>Promotes local and small-scale businesses.</li>
                  <li>Helps you explore unique, authentic, and handmade products.</li>
                </ul>
              </div>

              <div className="text-center mt-6">
                <p className="text-base font-semibold text-gray-600 mb-1">
                  Start exploring today and never miss a great local deal again — only with OfferBeez!
                </p>
                <p className="text-sm font-medium text-gray-600">
                  Discover. Visit. Experience. Save.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER - Now included in the scrollable content */}
        <Footer onNavigate={onNavigate} />
      </div>

      {/* FIXED BOTTOM NAVIGATION */}
      <div className="flex-shrink-0" style={{ position: "relative", zIndex: 20 }}>
        <BottomNavigation activeScreen="home" onNavigate={onNavigate} />
      </div>

      {/* FILTER PANEL */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end"
            onClick={() => setShowFilterPanel(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-t-2xl w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filter by Distance</h2>
                <button
                  className="text-gray-500"
                  onClick={() => setShowFilterPanel(false)}
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-2">Maximum Distance</p>
              <h3 className="text-xl font-bold mb-4">{filterDistance} km</h3>

              <input
                type="range"
                min={1}
                max={25}
                value={filterDistance}
                onChange={(e) => setFilterDistance(parseInt(e.target.value))}
                className="w-full"
              />

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setFilterDistance(25);
                    setSelectedDistance(25);
                    setShowFilterPanel(false);
                  }}
                  className="w-1/2 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold"
                >
                  Reset
                </button>

                <button
                  onClick={() => {
                    setSelectedDistance(filterDistance);
                    setShowFilterPanel(false);
                  }}
                  className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AD VIDEO POPUP */}
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
              onNavigate("offerDetails", { offer: offers[1] });
            }}
          />
        )}
      </AnimatePresence>

      {/* MAP LOCATION PICKER */}
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