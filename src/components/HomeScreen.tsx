import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, ChevronDown, Filter, Search, X, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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

    // Reset index if it's out of bounds
    if (currentBannerIndex >= apiBanners.length) {
      setCurrentBannerIndex(0);
    }

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % apiBanners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [apiBanners.length, currentBannerIndex]);

  // Navigate to previous banner
  const handlePreviousBanner = () => {
    setCurrentBannerIndex((prev) =>
      prev === 0 ? apiBanners.length - 1 : prev - 1
    );
  };

  // Navigate to next banner
  const handleNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % apiBanners.length);
  };
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(
    selectedCategory || "All"
  );
  const [showAdVideo, setShowAdVideo] = useState(false);
  const [adVideoSide, setAdVideoSide] = useState<"left" | "right">("left");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterDistance, setFilterDistance] = useState(25);
  const [selectedDistance, setSelectedDistance] = useState(25);
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

  // Offers states
  const [offers, setOffers] = useState<any[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [offersError, setOffersError] = useState<string | null>(null);

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
          "https://obz-icons.s3.ap-south-1.amazonaws.com/ALL-icons_.jpg",
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
          "https://obz-icons.s3.ap-south-1.amazonaws.com/ALL-icons_.jpg",
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
    // Load offers with new location
    loadOffers();
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
      loadOffers(); // Fetch offers with new location
    } catch (error) {
      console.error("Error saving location:", error);
      // Still update UI even if API call fails (localStorage already saved)
      setCurrentLocation(newLocation);
      setShowMapPicker(false);
      loadOffers(); // Still try to load offers
    }
  };

  /* ------------------ LOAD OFFERS ------------------ */
  const loadOffers = async () => {
    try {
      setLoadingOffers(true);
      setOffersError(null);
      console.log("Loading offers from API...");

      // Fetch offers from API
      const response = await apiService.getOffers({
        radius: selectedDistance,
        limit: 100
      });

      console.log("Offers API response:", response);

      // Extract and map offers from response to match UI format
      const apiOffers = response.offers || [];
      console.log("Fetched offers count:", apiOffers.length);

      // Map API offer format to UI format
      const mappedOffers = apiOffers.map((offer: any) => {
        // Calculate distance if business location is available
        let distance = "N/A";
        if (offer.business?.latitude && offer.business?.longitude && currentLocation) {
          const lat1 = parseFloat(currentLocation.latitude);
          const lon1 = parseFloat(currentLocation.longitude);
          const lat2 = parseFloat(offer.business.latitude);
          const lon2 = parseFloat(offer.business.longitude);

          // Haversine formula to calculate distance
          const R = 6371; // Earth's radius in km
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const d = R * c;
          distance = `${d.toFixed(1)} km`;
        }

        return {
          id: offer.id,
          title: offer.title || offer.business?.business_name || "Offer",
          category: offer.business?.businessCategory?.[0]?.categoryName || "General",
          description: offer.description || offer.toc || "",
          originalPrice: parseFloat(offer.originalPrice || "0"),
          discountedPrice: parseFloat(offer.discountedPrice || "0"),
          discount: parseInt(offer.discountPercentage || "0"),
          distance: distance,
          address: offer.business?.address || "Location not available",
          rating: 4.0, // Default rating since API doesn't provide it
          image: offer.imagesUrl?.[0] || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400",
          validity: offer.endDateTime ? `Valid till ${new Date(offer.endDateTime).toLocaleDateString()}` : "Limited time",
          offerType: offer.calculationType === "ORIGINAL_SELLING_PERCENTAGE" ? "discounted" :
                     offer.calculationType === "FLAT_PERCENTAGE" ? "flat" :
                     offer.calculationType === "EXCHANGE_DISCOUNT" ? "exchange" :
                     offer.calculationType === "PERCENTAGE_RANGE" ? "upto50" : "discounted",
          // Store original API data for details page
          apiData: offer
        };
      });

      setOffers(mappedOffers);
      setLoadingOffers(false);
    } catch (error) {
      console.error("Error loading offers:", error);
      setOffersError("Failed to load offers. Please try again later.");
      setOffers([]);
      setLoadingOffers(false);
    }
  };

  // Load offers when location changes or distance filter changes
  useEffect(() => {
    if (currentLocation && !isLoadingLocation) {
      loadOffers();
    }
  }, [currentLocation, selectedDistance]);

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
          "https://obz-icons.s3.ap-south-1.amazonaws.com/ALL-icons_.jpg",
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
          "https://obz-icons.s3.ap-south-1.amazonaws.com/ALL-icons_.jpg",
      };

      setCategoryData([allCategory]);
      setCategories(["All"]);
    }
  };

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
        .slice(0, 6),
      flat: filteredOffers.filter((o) => o.offerType === "flat").slice(0, 6),
      discounted: filteredOffers
        .filter((o) => o.offerType === "discounted")
        .slice(0, 6),
      upto50: filteredOffers
        .filter((o) => o.offerType === "upto50")
        .slice(0, 6),
    }),
    [filteredOffers]
  );

  /* ------------------ TOTAL COUNTS FOR EACH OFFER TYPE ------------------ */
  const offerCounts = React.useMemo(
    () => ({
      exchange: filteredOffers.filter((o) => o.offerType === "exchange").length,
      flat: filteredOffers.filter((o) => o.offerType === "flat").length,
      discounted: filteredOffers.filter((o) => o.offerType === "discounted").length,
      upto50: filteredOffers.filter((o) => o.offerType === "upto50").length,
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
    <div className="h-screen w-screen flex flex-col fixed inset-0">
      {/* Gradient BG */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-400 -z-10" />
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-400/40 via-transparent to-blue-500/40 -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-pink-400/50 via-transparent to-transparent -z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_var(--tw-gradient-stops))] from-blue-400/50 via-transparent to-transparent -z-10" />

      {/* HEADER SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 bg-white/90 backdrop-blur-md px-4 py-3 shadow-sm z-10 border-b border-purple-100/50"
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

      {/* SCROLLABLE CONTENT SECTION */}
      <div
        ref={mainContentRef}
        className="flex-1 overflow-y-auto overflow-x-hidden w-full"
        style={{
          paddingBottom: '140px',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y',
          scrollBehavior: 'smooth'
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
        {loadingBanners ? (
          <div className="w-full h-48 bg-gray-200 animate-pulse mb-2 mt-3"></div>
        ) : apiBanners.length > 0 && (
          <div className="mb-2 mt-3">
            <div className="relative w-full overflow-hidden group bg-white" style={{ height: "220px" }}>
              {apiBanners.map((banner, index) => (
                <div
                  key={index}
                  className="absolute top-0 left-0 w-full h-full bg-white flex items-center justify-center"
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
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}

              {/* Left Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreviousBanner();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 active:scale-95"
                aria-label="Previous banner"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>

              {/* Right Arrow */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextBanner();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-70 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 active:scale-95"
                aria-label="Next banner"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>

              {/* Indicators */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
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
          </div>
        )}
        
        {/* OFFER TYPE FILTER */}
        <div className="mb-4">
          <OfferTypeFilter
            selectedType={selectedOfferType}
            onTypeSelect={handleOfferTypeClick}
            onNavigate={handleNavigateToSpecializedScreen}
          />
        </div>

        {/* LOADING OFFERS */}
        {loadingOffers && (
          <div className="px-4 mb-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">Loading offers...</p>
            </div>
          </div>
        )}

        {/* OFFERS ERROR */}
        {offersError && !loadingOffers && (
          <div className="px-4 mb-6">
            <div className="text-center py-12 px-4">
              <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-12 h-12 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Failed to load offers
              </h3>
              <p className="text-gray-500 mb-4">{offersError}</p>
              <button
                onClick={loadOffers}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* ALL OFFERS SECTION */}
        {!loadingOffers && !offersError && filteredOffers.length > 0 && (
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
                  onClick={() => onNavigate("offerDetails", { offer: offer.apiData || offer })}
                  hideActions={true}
                />
              ))}
            </AutoSlider>
          </motion.div>
        )}

        {/* NO OFFERS MESSAGE */}
        {!loadingOffers && !offersError && filteredOffers.length === 0 && (
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

        {/* ALL OFFER TYPES (EXCHANGE / FLAT / DISCOUNTED / UPTO 50%) */}
        {!loadingOffers && !offersError && filteredOffers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 mb-20 relative"
            style={{ zIndex: 5, position: "relative" }}
          >
            {/* Discounted Offers */}
            {offersByType.discounted.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold text-gray-800 flex items-center">
                    <div className="w-8 h-8 mr-2 flex-shrink-0 flex items-center justify-center bg-pink-50 rounded">
                      <img
                        src="https://obz-icons.s3.ap-south-1.amazonaws.com/Discount+icons_.jpg"
                        alt="Discounted"
                        className="w-full h-full object-contain rounded"
                        style={{ display: 'block' }}
                        onLoad={() => console.log('Discount icon loaded successfully')}
                        onError={(e) => {
                          console.error('Failed to load discount icon from S3');
                        }}
                      />
                    </div>
                    Discounted Offers
                    <span className="ml-2 text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                      {offerCounts.discounted}
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
                      onClick={() => onNavigate("offerDetails", { offer: offer.apiData || offer })}
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
                      {offerCounts.flat}
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
                      onClick={() => onNavigate("offerDetails", { offer: offer.apiData || offer })}
                      hideActions={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Exchange Offers */}
            {offersByType.exchange.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold text-gray-800 flex items-center">
                    Exchange Offers
                    <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      {offerCounts.exchange}
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
                      onClick={() => onNavigate("offerDetails", { offer: offer.apiData || offer })}
                      hideActions={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Up to 50% Off Offers */}
            {offersByType.upto50.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-md font-semibold text-gray-800 flex items-center">
                    Up to 50% Off
                    <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                      {offerCounts.upto50}
                    </span>
                  </h3>
                  <button
                    onClick={() => onNavigate("upTo50Offers")}
                    className="flex items-center text-sm font-medium text-purple-600 hover:text-purple-700 active:scale-95 transition-transform z-10 relative"
                    style={{ position: "relative", zIndex: 10 }}
                  >
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {offersByType.upto50.map((offer) => (
                    <OfferCard
                      key={`upto50-${offer.id}`}
                      offer={offer}
                      onLike={() => {}}
                      onGetDirections={() => handleGetDirections(offer)}
                      onClick={() => onNavigate("offerDetails", { offer: offer.apiData || offer })}
                      hideActions={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ABOUT OFFERBEEZ SECTION */}
        <div className="bg-white px-4 py-6 relative z-0">
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
        <div className="mt-8 mb-4">
          <Footer onNavigate={onNavigate} />
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="flex-shrink-0 z-10">
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