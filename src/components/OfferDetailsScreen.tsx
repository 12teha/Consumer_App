import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Heart,
  Share2,
  Navigation,
  Star,
  Clock,
  MapPin,
  Phone,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import DirectionsMap from "./DirectionsMap";

interface OfferDetailsScreenProps {
  offer: any;
  onBack: () => void;
}

export default function OfferDetailsScreen({
  offer,
  onBack,
}: OfferDetailsScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [calculatedDistance, setCalculatedDistance] = useState<string | null>(
    null
  );

  // Extract business data from nested structure
  const business = offer.business || {};
  const businessName = business.business_name || offer.businessName;
  const businessAddress = business.address || offer.address;
  const businessLatitude = business.latitude || offer.latitude;
  const businessLongitude = business.longitude || offer.longitude;
  const businessCategory =
    business.businessCategory?.categoryName || offer.category;

  // Use all uploaded images from the offer
  // API returns 'imagesUrl' array (new format) or 'photos'/'image' (old format)
  const offerImages = React.useMemo(() => {
    if (
      offer.imagesUrl &&
      Array.isArray(offer.imagesUrl) &&
      offer.imagesUrl.length > 0
    ) {
      // Use the imagesUrl array if available (latest API format)
      return offer.imagesUrl;
    } else if (
      offer.photos &&
      Array.isArray(offer.photos) &&
      offer.photos.length > 0
    ) {
      // Use the photos array if available (older format)
      return offer.photos;
    } else if (offer.image) {
      // Fallback to single image if no array available
      return [offer.image];
    } else {
      // Fallback to empty array if no images at all
      return [];
    }
  }, [offer.imagesUrl, offer.photos, offer.image]);

  // Debug: Log offer data to see what fields are available
  React.useEffect(() => {
    console.log("📊 Offer Data:", offer);
    console.log("📊 Business Data:", business);
    console.log(
      "📍 Location:",
      businessAddress,
      businessLatitude,
      businessLongitude
    );
    console.log("🖼️ Offer Images Array:", offerImages);
    console.log("🖼️ Number of images:", offerImages.length);
  }, [offer, offerImages]);

  // Calculate distance from user's current location to business
  React.useEffect(() => {
    if (businessLatitude && businessLongitude && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLon = position.coords.longitude;
          const businessLat = parseFloat(businessLatitude);
          const businessLon = parseFloat(businessLongitude);

          // Calculate distance using Haversine formula
          const R = 6371; // Earth's radius in km
          const dLat = (businessLat - userLat) * (Math.PI / 180);
          const dLon = (businessLon - userLon) * (Math.PI / 180);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(userLat * (Math.PI / 180)) *
              Math.cos(businessLat * (Math.PI / 180)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c;

          // Format distance
          if (distance < 1) {
            setCalculatedDistance(`${Math.round(distance * 1000)} m`);
          } else {
            setCalculatedDistance(`${distance.toFixed(1)} km`);
          }
        },
        (error) => {
          console.log("Could not get user location:", error);
          // Fallback to offer.distance if available
          setCalculatedDistance(offer.distance || null);
        }
      );
    } else {
      // Use offer.distance from API if geolocation not available
      setCalculatedDistance(offer.distance || null);
    }
  }, [businessLatitude, businessLongitude, offer.distance]);

  const handleGetDirections = () => {
    // Check if we have coordinates
    if (businessLatitude && businessLongitude) {
      setShowDirections(true);
    } else {
      // Fallback to Google Maps with address
      const query = encodeURIComponent(
        businessAddress || businessName || offer.title
      );
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${query}`,
        "_blank"
      );
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white px-4 py-3 shadow-sm flex items-center justify-between"
      >
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Offer Details</h1>
        <div className="flex items-center space-x-3">
          {/* <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Heart
              className={`w-6 h-6 ${
                isWishlisted ? "text-red-500 fill-current" : "text-gray-400"
              }`}
            />
          </button> */}
          {/* <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <Share2 className="w-6 h-6 text-gray-400" />
          </button> */}
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Flipkart-style Layout */}
          <div className="bg-white lg:flex lg:gap-0">
            {/* Image Section - Left side with thumbnails and main image */}
            <div className="lg:w-[45%] p-6 flex gap-4">
              {/* Vertical Thumbnails */}
              {offerImages.length > 1 && (
                <div className="hidden lg:flex flex-col gap-3 w-16">
                  {offerImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-16 border-2 rounded overflow-hidden flex-shrink-0 ${
                        currentImageIndex === index ? "border-blue-600" : "border-gray-300"
                      }`}
                    >
                      <ImageWithFallback
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="flex-1 flex flex-col">
                <div
                  className="relative w-full bg-white cursor-pointer flex items-center justify-center"
                  style={{ minHeight: '450px' }}
                  onClick={() => offerImages.length > 0 && setShowImageModal(true)}
                >
                  {offerImages.length > 0 ? (
                    <>
                      <ImageWithFallback
                        src={offerImages[currentImageIndex]}
                        alt={offer.title || 'Offer image'}
                        className="max-w-full max-h-[450px] object-contain"
                      />
                      {/* Discount Badge */}
                      {offer.discountPercentage && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded font-bold text-sm shadow-lg">
                          {offer.discountPercentage}% OFF
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <p className="text-gray-400 text-lg">No image available</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons below image */}
                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={handleGetDirections}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md font-semibold"
                  >
                    <Navigation className="w-5 h-5 mr-2 inline" />
                    Get Directions
                  </Button>
                  {offer.businessPhone && (
                    <Button
                      onClick={() => window.open(`tel:${offer.businessPhone}`)}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-md font-semibold"
                    >
                      <Phone className="w-5 h-5 mr-2 inline" />
                      Call Now
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Offer Details */}
            <div className="lg:w-[55%] p-6 border-l border-gray-200">
              {/* Title */}
              <h1 className="text-xl font-normal text-gray-800 mb-3">
                {offer.title || businessName}
              </h1>

              {/* Rating and Category */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
                {offer.rating && (
                  <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
                    <span>{offer.rating}</span>
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                )}
                {businessCategory && (
                  <span className="text-gray-600 text-sm">
                    {businessCategory}
                  </span>
                )}
              </div>

              {/* Price Section */}
              {(offer.discountedPrice || offer.originalPrice) && (
                <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {offer.discountedPrice && (
                  <span className="text-2xl font-bold text-green-600">
                    ₹{offer.discountedPrice}
                  </span>
                )}
                {offer.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{offer.originalPrice}
                  </span>
                )}
              </div>
              {offer.originalPrice &&
                offer.discountedPrice &&
                offer.originalPrice > offer.discountedPrice && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      Save ₹
                      {parseFloat(offer.originalPrice) -
                        parseFloat(offer.discountedPrice)}
                    </p>
                  </div>
                )}
                </div>
              )}

              {/* Description */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-gray-700 text-sm leading-relaxed">{offer.description}</p>
              </div>

              {/* Offer Details */}
              <div className="space-y-4 mb-4">
            {/* Location - Always visible */}
            <div className="flex items-start space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">📍 Location</p>
                <p className="text-gray-600 text-xs mt-1">
                  {businessAddress || "Location not specified"}
                </p>
                {calculatedDistance && (
                  <p className="text-blue-600 text-xs mt-1 font-semibold">
                    🚶 {calculatedDistance} away from you
                  </p>
                )}
              </div>
            </div>

            {/* Validity - Show offer dates */}
            {(offer.startDateTime || offer.endDateTime) && (
              <div className="flex items-start space-x-2 text-sm">
                <Clock className="w-4 h-4 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    ⏰ Validity Period
                  </p>
                  {offer.startDateTime && (
                    <p className="text-gray-600 text-xs mt-1">
                      Starts:{" "}
                      {new Date(offer.startDateTime).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  )}
                  {offer.endDateTime && (
                    <p className="text-orange-600 text-xs mt-1 font-medium">
                      Expires:{" "}
                      {new Date(offer.endDateTime).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            )}

            {offer.offerCode && (
              <div className="flex items-start space-x-2 text-sm">
                <span className="text-gray-400 mt-0.5">🎫</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-700">Offer Code</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="px-3 py-1 bg-gray-100 border border-dashed border-gray-300 rounded text-purple-600 font-mono">
                      {offer.offerCode}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(offer.offerCode);
                        alert("Code copied!");
                      }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Contact - Show if phone or email available */}
            {(offer.businessPhone || offer.businessEmail) && (
              <div className="flex items-start space-x-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-700">Contact</p>
                  {offer.businessPhone && (
                    <a
                      href={`tel:${offer.businessPhone}`}
                      className="text-blue-600 hover:underline block"
                    >
                      📞 {offer.businessPhone}
                    </a>
                  )}
                  {offer.businessEmail && (
                    <a
                      href={`mailto:${offer.businessEmail}`}
                      className="text-blue-600 hover:underline block mt-1"
                    >
                      📧 {offer.businessEmail}
                    </a>
                  )}
                </div>
              </div>
            )}

            {offer.openingHours && (
              <div className="flex items-start space-x-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-700">Opening Hours</p>
                  <p className="text-gray-600">{offer.openingHours}</p>
                </div>
              </div>
            )}

            {offer.website && (
              <div className="flex items-start space-x-2 text-sm">
                <Globe className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-700">Website</p>
                  <a
                    href={
                      offer.website.startsWith("http")
                        ? offer.website
                        : `https://${offer.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            )}
              </div>

              {/* Business Info */}
              {businessName && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <span>🏢</span>
                    <span>{businessName}</span>
                  </p>
                </div>
              )}

              {/* About This Offer */}
              <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">About This Offer</h3>

          {offer.longDescription ? (
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              {offer.longDescription}
            </p>
          ) : offer.description ? (
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              {offer.description}
            </p>
          ) : (
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Enjoy our specially crafted{" "}
              {offer.category?.toLowerCase() || "exclusive"} offer with premium
              quality and exceptional service.
            </p>
          )}

          {/* Terms and Conditions - Use 'toc' field from API */}
          {offer.toc && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-gray-900 text-sm mb-2">
                ⚠️ Terms & Conditions
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                {offer.toc}
              </p>
            </div>
          )}

          {/* Additional Details */}
          {(offer.maxUsagePerUser ||
            offer.minPurchaseAmount ||
            offer.maxDiscountAmount) && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-gray-900 text-sm">
                Offer Limits
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {offer.maxUsagePerUser && (
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-500">Usage Limit</p>
                    <p className="font-medium text-gray-900">
                      {offer.maxUsagePerUser} times per user
                    </p>
                  </div>
                )}
                {offer.minPurchaseAmount && (
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-500">Min. Purchase</p>
                    <p className="font-medium text-gray-900">
                      ₹{offer.minPurchaseAmount}
                    </p>
                  </div>
                )}
                {offer.maxDiscountAmount && (
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-500">Max. Discount</p>
                    <p className="font-medium text-gray-900">
                      ₹{offer.maxDiscountAmount}
                    </p>
                  </div>
                )}
                {offer.totalRedemptions !== undefined && (
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-500">Total Redeemed</p>
                    <p className="font-medium text-gray-900">
                      {offer.totalRedemptions} times
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Directions Map Modal */}
      {showDirections && businessLatitude && businessLongitude && (
        <DirectionsMap
          isOpen={showDirections}
          onClose={() => setShowDirections(false)}
          destination={{
            latitude: businessLatitude,
            longitude: businessLongitude,
            name: offer.title || businessName || "Business Location",
            address: businessAddress || "Address not available",
          }}
        />
      )}

      {/* Full Screen Image Modal */}
      {showImageModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setShowImageModal(false)}
        >
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
          >
            ✕
          </button>

          {/* Image with swipe navigation */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <ImageWithFallback
              src={offerImages[currentImageIndex]}
              alt={offer.title || 'Offer image'}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Navigation Arrows in Modal */}
            {offerImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? offerImages.length - 1 : prev - 1
                    );
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) =>
                      prev === offerImages.length - 1 ? 0 : prev + 1
                    );
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full backdrop-blur-sm transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image counter */}
            {offerImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                {currentImageIndex + 1} / {offerImages.length}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
