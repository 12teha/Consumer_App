// import React, { useState } from "react";
// import { motion } from "motion/react";
// import {
//   ArrowLeft,
//   Heart,
//   Share2,
//   Navigation,
//   Star,
//   Clock,
//   MapPin,
//   Phone,
//   Globe,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { Button } from "./ui/button";
// import { ImageWithFallback } from "./figma/ImageWithFallback";
// import DirectionsMap from "./DirectionsMap";

// interface OfferDetailsScreenProps {
//   offer: any;
//   onBack: () => void;
// }

// export default function OfferDetailsScreen({
//   offer,
//   onBack,
// }: OfferDetailsScreenProps) {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isWishlisted, setIsWishlisted] = useState(false);
//   const [showDirections, setShowDirections] = useState(false);
//   const [showImageModal, setShowImageModal] = useState(false);
//   const [calculatedDistance, setCalculatedDistance] = useState<string | null>(
//     null
//   );

//   // Extract business data from nested structure
//   const business = offer.business || {};
//   const businessName = business.business_name || offer.businessName;
//   const businessAddress = business.address || offer.address;
//   const businessLatitude = business.latitude || offer.latitude;
//   const businessLongitude = business.longitude || offer.longitude;

//   // Extract category name from array (businessCategory is an array with categoryName)
//   const businessCategory = React.useMemo(() => {
//     // Check if businessCategory is an array with categoryName
//     if (business.businessCategory && Array.isArray(business.businessCategory) && business.businessCategory.length > 0) {
//       return business.businessCategory[0].categoryName || 'Uncategorized';
//     }
//     // Fallback to single object
//     if (business.businessCategory?.categoryName) {
//       return business.businessCategory.categoryName;
//     }
//     // Fallback to offer.category
//     return offer.category || 'Uncategorized';
//   }, [business.businessCategory, offer.category]);

//   // Use all uploaded images from the offer
//   // API returns 'imagesUrl' array (new format) or 'photos'/'image' (old format)
//   const offerImages = React.useMemo(() => {
//     if (
//       offer.imagesUrl &&
//       Array.isArray(offer.imagesUrl) &&
//       offer.imagesUrl.length > 0
//     ) {
//       // Use the imagesUrl array if available (latest API format)
//       return offer.imagesUrl;
//     } else if (
//       offer.photos &&
//       Array.isArray(offer.photos) &&
//       offer.photos.length > 0
//     ) {
//       // Use the photos array if available (older format)
//       return offer.photos;
//     } else if (offer.image) {
//       // Fallback to single image if no array available
//       return [offer.image];
//     } else {
//       // Fallback to empty array if no images at all
//       return [];
//     }
//   }, [offer.imagesUrl, offer.photos, offer.image]);

//   // Debug: Log offer data to see what fields are available
//   React.useEffect(() => {
//     console.log("📊 Offer Data:", offer);
//     console.log("📊 Business Data:", business);
//     console.log(
//       "📍 Location:",
//       businessAddress,
//       businessLatitude,
//       businessLongitude
//     );
//     console.log("🖼️ Offer Images Array:", offerImages);
//     console.log("🖼️ Number of images:", offerImages.length);
//   }, [offer, offerImages]);

//   // Calculate distance from user's current location to business
//   React.useEffect(() => {
//     if (businessLatitude && businessLongitude && navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const userLat = position.coords.latitude;
//           const userLon = position.coords.longitude;
//           const businessLat = parseFloat(businessLatitude);
//           const businessLon = parseFloat(businessLongitude);

//           // Calculate distance using Haversine formula
//           const R = 6371; // Earth's radius in km
//           const dLat = (businessLat - userLat) * (Math.PI / 180);
//           const dLon = (businessLon - userLon) * (Math.PI / 180);
//           const a =
//             Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//             Math.cos(userLat * (Math.PI / 180)) *
//               Math.cos(businessLat * (Math.PI / 180)) *
//               Math.sin(dLon / 2) *
//               Math.sin(dLon / 2);
//           const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//           const distance = R * c;

//           // Format distance
//           if (distance < 1) {
//             setCalculatedDistance(`${Math.round(distance * 1000)} m`);
//           } else {
//             setCalculatedDistance(`${distance.toFixed(1)} km`);
//           }
//         },
//         (error) => {
//           console.log("Could not get user location:", error);
//           // Fallback to offer.distance if available
//           setCalculatedDistance(offer.distance || null);
//         }
//       );
//     } else {
//       // Use offer.distance from API if geolocation not available
//       setCalculatedDistance(offer.distance || null);
//     }
//   }, [businessLatitude, businessLongitude, offer.distance]);

//   const handleGetDirections = () => {
//     // Check if we have coordinates
//     if (businessLatitude && businessLongitude) {
//       setShowDirections(true);
//     } else {
//       // Fallback to Google Maps with address
//       const query = encodeURIComponent(
//         businessAddress || businessName || offer.title
//       );
//       window.open(
//         `https://www.google.com/maps/search/?api=1&query=${query}`,
//         "_blank"
//       );
//     }
//   };

//   return (
//     <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white px-4 py-3 shadow-sm flex items-center justify-between"
//       >
//         <button
//           onClick={onBack}
//           className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
//         >
//           <ArrowLeft className="w-6 h-6 text-gray-600" />
//         </button>
//         <h1 className="text-lg font-semibold text-gray-900">Offer Details</h1>
//         <div className="flex items-center space-x-3">
//           {/* <button
//             onClick={() => setIsWishlisted(!isWishlisted)}
//             className="p-1 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <Heart
//               className={`w-6 h-6 ${
//                 isWishlisted ? "text-red-500 fill-current" : "text-gray-400"
//               }`}
//             />
//           </button> */}
//           {/* <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
//             <Share2 className="w-6 h-6 text-gray-400" />
//           </button> */}
//         </div>
//       </motion.div>

//       {/* Content */}
//       <div className="flex-1 overflow-y-auto">
//         {/* Image Carousel */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="relative w-full h-80 sm:h-96 md:h-[28rem] bg-gray-900 cursor-pointer"
//           onClick={() => offerImages.length > 0 && setShowImageModal(true)}
//         >
//           {offerImages.length > 0 ? (
//             <>
//               <div className="flex justify-center items-center">
//                 <ImageWithFallback
//                   src={offerImages[currentImageIndex]}
//                   alt={offer.title || "Offer image"}
//                   className="w-28 h-28 object-contain rounded-xl bg-gray-900"
//                 />
//               </div>

//               {/* Zoom indicator */}
//               <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
//                 🔍 Click to zoom
//               </div>
//             </>
//           ) : (
//             <div className="w-full h-full flex items-center justify-center bg-gray-800">
//               <p className="text-gray-400 text-lg">No image available</p>
//             </div>
//           )}

//           {/* Navigation Arrows */}
//           {offerImages.length > 1 && (
//             <>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setCurrentImageIndex((prev) =>
//                     prev === 0 ? offerImages.length - 1 : prev - 1
//                   );
//                 }}
//                 className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setCurrentImageIndex((prev) =>
//                     prev === offerImages.length - 1 ? 0 : prev + 1
//                   );
//                 }}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </>
//           )}

//           {/* Image Indicators */}
//           {offerImages.length > 1 && (
//             <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
//               {offerImages.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentImageIndex(index)}
//                   className={`w-2 h-2 rounded-full transition-all ${
//                     currentImageIndex === index ? "bg-white w-6" : "bg-white/50"
//                   }`}
//                 />
//               ))}
//             </div>
//           )}

//           {/* Discount Badge - Use discountPercentage from API */}
//           {offer.discountPercentage && (
//             <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold shadow-lg">
//               {offer.discountPercentage}% OFF
//             </div>
//           )}
//         </motion.div>

//         {/* Offer Info */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white p-4 border-b border-gray-100"
//         >
//           <div className="flex items-start justify-between mb-3">
//             <div className="flex-1">
//               <h2 className="text-xl font-bold text-gray-900">
//                 {offer.title || businessName}
//               </h2>
//               {businessCategory && (
//                 <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
//                   {businessCategory}
//                 </span>
//               )}
//               <p className="text-gray-600 mt-2">{offer.description}</p>

//               {/* Business Information - Always visible */}
//               {businessName && (
//                 <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
//                   <p className="text-sm font-semibold text-gray-900 mb-1">
//                     🏢 {businessName}
//                   </p>
//                   {businessCategory && (
//                     <p className="text-xs text-blue-600 mb-1">
//                       📂 {businessCategory}
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>
//             {offer.rating && (
//               <div className="flex items-center space-x-1 ml-3">
//                 <Star className="w-4 h-4 text-yellow-400 fill-current" />
//                 <span className="font-semibold text-gray-900">
//                   {offer.rating}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Price Information - Always show if available */}
//           {(offer.discountedPrice || offer.originalPrice) && (
//             <div className="flex items-center justify-between mb-4 p-3 bg-green-50 rounded-lg">
//               <div className="flex items-center space-x-3">
//                 {offer.discountedPrice && (
//                   <span className="text-2xl font-bold text-green-600">
//                     ₹{offer.discountedPrice}
//                   </span>
//                 )}
//                 {offer.originalPrice && (
//                   <span className="text-lg text-gray-400 line-through">
//                     ₹{offer.originalPrice}
//                   </span>
//                 )}
//               </div>
//               {offer.originalPrice &&
//                 offer.discountedPrice &&
//                 offer.originalPrice > offer.discountedPrice && (
//                   <div className="text-right">
//                     <p className="text-sm font-medium text-green-600">
//                       Save ₹
//                       {parseFloat(offer.originalPrice) -
//                         parseFloat(offer.discountedPrice)}
//                     </p>
//                   </div>
//                 )}
//             </div>
//           )}

//           {/* Offer Details Grid - Always show available information */}
//           <div className="space-y-3 mb-4">
//             {/* Location - Always visible */}
//             <div className="flex items-start space-x-2 text-sm">
//               <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
//               <div className="flex-1">
//                 <p className="font-medium text-gray-900">📍 Location</p>
//                 <p className="text-gray-600 text-xs mt-1">
//                   {businessAddress || "Location not specified"}
//                 </p>
//                 {calculatedDistance && (
//                   <p className="text-blue-600 text-xs mt-1 font-semibold">
//                     🚶 {calculatedDistance} away from you
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Validity - Show offer dates */}
//             {(offer.startDateTime || offer.endDateTime) && (
//               <div className="flex items-start space-x-2 text-sm">
//                 <Clock className="w-4 h-4 text-orange-600 mt-0.5" />
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-900">
//                     ⏰ Validity Period
//                   </p>
//                   {offer.startDateTime && (
//                     <p className="text-gray-600 text-xs mt-1">
//                       Starts:{" "}
//                       {new Date(offer.startDateTime).toLocaleDateString(
//                         "en-GB",
//                         {
//                           timeZone: "UTC" ,
//                           day: "numeric",
//                           month: "short",
//                           year: "numeric",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         }
//                       )}
//                     </p>
//                   )}
//                   {offer.endDateTime && (
//                     <p className="text-orange-600 text-xs mt-1 font-medium">
//                       Expires:{" "}
//                       {new Date(offer.endDateTime).toLocaleDateString("en-GB", {
//                         timeZone: "UTC" ,
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )}

//             {offer.offerCode && (
//               <div className="flex items-start space-x-2 text-sm">
//                 <span className="text-gray-400 mt-0.5">🎫</span>
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-700">Offer Code</p>
//                   <div className="flex items-center space-x-2 mt-1">
//                     <code className="px-3 py-1 bg-gray-100 border border-dashed border-gray-300 rounded text-purple-600 font-mono">
//                       {offer.offerCode}
//                     </code>
//                     <button
//                       onClick={() => {
//                         navigator.clipboard.writeText(offer.offerCode);
//                         alert("Code copied!");
//                       }}
//                       className="text-xs text-blue-600 hover:underline"
//                     >
//                       Copy
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Contact - Show if phone or email available */}
//             {(offer.businessPhone || offer.businessEmail) && (
//               <div className="flex items-start space-x-2 text-sm">
//                 <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-700">Contact</p>
//                   {offer.businessPhone && (
//                     <a
//                       href={`tel:${offer.businessPhone}`}
//                       className="text-blue-600 hover:underline block"
//                     >
//                       📞 {offer.businessPhone}
//                     </a>
//                   )}
//                   {offer.businessEmail && (
//                     <a
//                       href={`mailto:${offer.businessEmail}`}
//                       className="text-blue-600 hover:underline block mt-1"
//                     >
//                       📧 {offer.businessEmail}
//                     </a>
//                   )}
//                 </div>
//               </div>
//             )}

//             {offer.openingHours && (
//               <div className="flex items-start space-x-2 text-sm">
//                 <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-700">Opening Hours</p>
//                   <p className="text-gray-600">{offer.openingHours}</p>
//                 </div>
//               </div>
//             )}

//             {offer.website && (
//               <div className="flex items-start space-x-2 text-sm">
//                 <Globe className="w-4 h-4 text-gray-400 mt-0.5" />
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-700">Website</p>
//                   <a
//                     href={
//                       offer.website.startsWith("http")
//                         ? offer.website
//                         : `https://${offer.website}`
//                     }
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:underline"
//                   >
//                     Visit Website
//                   </a>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex space-x-3">
//             <Button
//               onClick={handleGetDirections}
//               className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-2"
//             >
//               <Navigation className="w-4 h-4" />
//               <span>Get Directions</span>
//             </Button>
//             {offer.businessPhone && (
//               <Button
//                 onClick={() => window.open(`tel:${offer.businessPhone}`)}
//                 className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center space-x-2"
//               >
//                 <Phone className="w-4 h-4" />
//                 <span>Call Now</span>
//               </Button>
//             )}
//           </div>
//         </motion.div>

//         {/* Detailed Information */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white p-4 border-b border-gray-100"
//         >
//           <h3 className="font-semibold text-gray-900 mb-3">About This Offer</h3>

//           {offer.longDescription ? (
//             <p className="text-gray-600 text-sm leading-relaxed mb-3">
//               {offer.longDescription}
//             </p>
//           ) : offer.description ? (
//             <p className="text-gray-600 text-sm leading-relaxed mb-3">
//               {offer.description}
//             </p>
//           ) : (
//             <p className="text-gray-600 text-sm leading-relaxed mb-3">
//               Enjoy our specially crafted{" "}
//               {offer.category?.toLowerCase() || "exclusive"} offer with premium
//               quality and exceptional service.
//             </p>
//           )}

//           {/* Terms and Conditions - Use 'toc' field from API */}
//           {offer.toc && (
//             <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//               <h4 className="font-medium text-gray-900 text-sm mb-2">
//                 ⚠️ Terms & Conditions
//               </h4>
//               <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
//                 {offer.toc}
//               </p>
//             </div>
//           )}

//           {/* Additional Details */}
//           {(offer.maxUsagePerUser ||
//             offer.minPurchaseAmount ||
//             offer.maxDiscountAmount) && (
//             <div className="mt-4 space-y-2">
//               <h4 className="font-medium text-gray-900 text-sm">
//                 Offer Limits
//               </h4>
//               <div className="grid grid-cols-2 gap-2 text-xs">
//                 {offer.maxUsagePerUser && (
//                   <div className="p-2 bg-gray-50 rounded">
//                     <p className="text-gray-500">Usage Limit</p>
//                     <p className="font-medium text-gray-900">
//                       {offer.maxUsagePerUser} times per user
//                     </p>
//                   </div>
//                 )}
//                 {offer.minPurchaseAmount && (
//                   <div className="p-2 bg-gray-50 rounded">
//                     <p className="text-gray-500">Min. Purchase</p>
//                     <p className="font-medium text-gray-900">
//                       ₹{offer.minPurchaseAmount}
//                     </p>
//                   </div>
//                 )}
//                 {offer.maxDiscountAmount && (
//                   <div className="p-2 bg-gray-50 rounded">
//                     <p className="text-gray-500">Max. Discount</p>
//                     <p className="font-medium text-gray-900">
//                       ₹{offer.maxDiscountAmount}
//                     </p>
//                   </div>
//                 )}
//                 {offer.totalRedemptions !== undefined && (
//                   <div className="p-2 bg-gray-50 rounded">
//                     <p className="text-gray-500">Total Redeemed</p>
//                     <p className="font-medium text-gray-900">
//                       {offer.totalRedemptions} times
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </motion.div>
//       </div>

//       {/* Directions Map Modal */}
//       {showDirections && businessLatitude && businessLongitude && (
//         <DirectionsMap
//           isOpen={showDirections}
//           onClose={() => setShowDirections(false)}
//           destination={{
//             latitude: businessLatitude,
//             longitude: businessLongitude,
//             name: offer.title || businessName || "Business Location",
//             address: businessAddress || "Address not available",
//           }}
//         />
//       )}

//       {/* Full Screen Image Modal */}
//       {showImageModal && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 bg-black flex items-center justify-center"
//           onClick={() => setShowImageModal(false)}
//         >
//           <button
//             onClick={() => setShowImageModal(false)}
//             className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
//           >
//             ✕
//           </button>

//           {/* Image with swipe navigation */}
//           <div className="relative w-full h-full flex items-center justify-center p-4">
//             <ImageWithFallback
//               src={offerImages[currentImageIndex]}
//               alt={offer.title || "Offer image"}
//               className="max-w-full max-h-full object-contain"
//               onClick={(e) => e.stopPropagation()}
//             />

//             {/* Navigation Arrows in Modal */}
//             {offerImages.length > 1 && (
//               <>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setCurrentImageIndex((prev) =>
//                       prev === 0 ? offerImages.length - 1 : prev - 1
//                     );
//                   }}
//                   className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full backdrop-blur-sm transition-colors"
//                 >
//                   <ChevronLeft className="w-6 h-6" />
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setCurrentImageIndex((prev) =>
//                       prev === offerImages.length - 1 ? 0 : prev + 1
//                     );
//                   }}
//                   className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full backdrop-blur-sm transition-colors"
//                 >
//                   <ChevronRight className="w-6 h-6" />
//                 </button>
//               </>
//             )}

//             {/* Image counter */}
//             {offerImages.length > 1 && (
//               <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
//                 {currentImageIndex + 1} / {offerImages.length}
//               </div>
//             )}
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// }

/////////////////

import React, { useState, useEffect } from "react";
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
  AlertTriangle,
} from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import DirectionsMap from "./DirectionsMap";

interface OfferDetailsScreenProps {
  offer: any;
  onBack: () => void;
  onOfferExpired?: () => void; // New callback for expired offers
}

export default function OfferDetailsScreen({
  offer,
  onBack,
  onOfferExpired,
}: OfferDetailsScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [calculatedDistance, setCalculatedDistance] = useState<string | null>(
    null
  );
  const [isExpired, setIsExpired] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  // Extract business data from nested structure
  const business = offer.business || {};
  const businessName = business.business_name || offer.businessName;
  const businessAddress = business.address || offer.address;
  const businessLatitude = business.latitude || offer.latitude;
  const businessLongitude = business.longitude || offer.longitude;

  // Extract category name from array (businessCategory is an array with categoryName)
  const businessCategory = React.useMemo(() => {
    // Check if businessCategory is an array with categoryName
    if (business.businessCategory && Array.isArray(business.businessCategory) && business.businessCategory.length > 0) {
      return business.businessCategory[0].categoryName || 'Uncategorized';
    }
    // Fallback to single object
    if (business.businessCategory?.categoryName) {
      return business.businessCategory.categoryName;
    }
    // Fallback to offer.category
    return offer.category || 'Uncategorized';
  }, [business.businessCategory, offer.category]);

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

  // Check if offer is expired and calculate time remaining
  useEffect(() => {
    const checkOfferValidity = () => {
      const now = new Date();
      
      // Check if offer has end date/time
      if (offer.endDateTime) {
        const endDate = new Date(offer.endDateTime);
        
        if (now > endDate) {
          // Offer is expired
          setIsExpired(true);
          setTimeRemaining("Expired");
          if (onOfferExpired) {
            onOfferExpired();
          }
          return;
        } else {
          // Calculate time remaining
          const timeDiff = endDate.getTime() - now.getTime();
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          
          if (days > 0) {
            setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
          } else if (hours > 0) {
            setTimeRemaining(`${hours}h ${minutes}m`);
          } else {
            setTimeRemaining(`${minutes}m`);
          }
          
          setIsExpired(false);
        }
      } else if (offer.startDateTime) {
        // Check if offer hasn't started yet
        const startDate = new Date(offer.startDateTime);
        if (now < startDate) {
          const timeDiff = startDate.getTime() - now.getTime();
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          
          if (days > 0) {
            setTimeRemaining(`Starts in ${days}d ${hours}h`);
          } else {
            setTimeRemaining(`Starts in ${hours}h`);
          }
        } else {
          // Offer has started but no end date - consider it active
          setTimeRemaining("Active");
        }
      } else {
        // No date information - consider it active
        setTimeRemaining("Active");
      }
    };

    // Check immediately
    checkOfferValidity();

    // Set up interval to check every minute
    const interval = setInterval(checkOfferValidity, 60000);

    return () => clearInterval(interval);
  }, [offer.endDateTime, offer.startDateTime, onOfferExpired]);

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
    console.log("⏰ Offer Expiry Status:", isExpired);
  }, [offer, offerImages, isExpired]);

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

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        timeZone: "UTC",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
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
      <div className="flex-1 overflow-y-auto">
        {/* Expired Offer Banner */}
        {isExpired && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-b border-red-200 p-4"
          >
            <div className="flex items-center space-x-2 text-red-800">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <p className="font-semibold">This offer has expired</p>
                <p className="text-sm text-red-600">
                  This offer is no longer available as it has passed its validity period.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Image Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative w-full h-80 sm:h-96 md:h-[28rem] bg-gray-900 cursor-pointer"
          onClick={() => offerImages.length > 0 && setShowImageModal(true)}
        >
          {offerImages.length > 0 ? (
            <>
              <div className="flex justify-center items-center">
                <ImageWithFallback
                  src={offerImages[currentImageIndex]}
                  alt={offer.title || "Offer image"}
                  className="w-28 h-28 object-contain rounded-xl bg-gray-900"
                />
              </div>

              {/* Zoom indicator */}
              <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                🔍 Click to zoom
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <p className="text-gray-400 text-lg">No image available</p>
            </div>
          )}

          {/* Navigation Arrows */}
          {offerImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? offerImages.length - 1 : prev - 1
                  );
                }}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) =>
                    prev === offerImages.length - 1 ? 0 : prev + 1
                  );
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          {offerImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {offerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImageIndex === index ? "bg-white w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Discount Badge - Use discountPercentage from API */}
          {offer.discountPercentage && !isExpired && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold shadow-lg">
              {offer.discountPercentage}% OFF
            </div>
          )}

          {/* Expired Badge */}
          {isExpired && (
            <div className="absolute top-4 left-4 bg-gray-500 text-white px-3 py-1 rounded-full font-bold shadow-lg">
              EXPIRED
            </div>
          )}
        </motion.div>

        {/* Offer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 border-b border-gray-100"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {offer.title || businessName}
              </h2>
              {businessCategory && (
                <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  {businessCategory}
                </span>
              )}
              <p className="text-gray-600 mt-2">{offer.description}</p>

              {/* Business Information - Always visible */}
              {businessName && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    🏢 {businessName}
                  </p>
                  {businessCategory && (
                    <p className="text-xs text-blue-600 mb-1">
                      📂 {businessCategory}
                    </p>
                  )}
                </div>
              )}
            </div>
            {offer.rating && (
              <div className="flex items-center space-x-1 ml-3">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold text-gray-900">
                  {offer.rating}
                </span>
              </div>
            )}
          </div>

          {/* Price Information - Only show if not expired */}
          {!isExpired && (offer.discountedPrice || offer.originalPrice) && (
            <div className="flex items-center justify-between mb-4 p-3 bg-green-50 rounded-lg">
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

          {/* Expired Price Information */}
          {isExpired && (offer.discountedPrice || offer.originalPrice) && (
            <div className="flex items-center justify-between mb-4 p-3 bg-gray-100 rounded-lg">
              <div className="flex items-center space-x-3">
                {offer.discountedPrice && (
                  <span className="text-2xl font-bold text-gray-400 line-through">
                    ₹{offer.discountedPrice}
                  </span>
                )}
                {offer.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{offer.originalPrice}
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-500">
                  Offer Expired
                </p>
              </div>
            </div>
          )}

          {/* Offer Details Grid - Always show available information */}
          <div className="space-y-3 mb-4">
            {/* Validity - Show offer dates with time remaining */}
            {(offer.startDateTime || offer.endDateTime) && (
              <div className="flex items-start space-x-2 text-sm">
                <Clock className={`w-4 h-4 mt-0.5 ${
                  isExpired ? "text-red-600" : 
                  timeRemaining?.includes("Starts") ? "text-blue-600" : "text-orange-600"
                }`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {isExpired ? "⏰ Expired Offer" : "⏰ Validity Period"}
                  </p>
                  
                  {offer.startDateTime && (
                    <p className="text-gray-600 text-xs mt-1">
                      Starts: {formatDate(offer.startDateTime)}
                    </p>
                  )}
                  
                  {offer.endDateTime && (
                    <p className={`text-xs mt-1 font-medium ${
                      isExpired ? "text-red-600" : "text-orange-600"
                    }`}>
                      {isExpired ? "Expired: " : "Expires: "}
                      {formatDate(offer.endDateTime)}
                    </p>
                  )}
                  
                  {/* Time Remaining Indicator */}
                  {timeRemaining && !isExpired && (
                    <p className={`text-xs mt-1 font-semibold ${
                      timeRemaining.includes("Starts") ? "text-blue-600" : "text-green-600"
                    }`}>
                      {timeRemaining.includes("Starts") ? "⏳ " : "⏰ "}
                      {timeRemaining}
                    </p>
                  )}
                </div>
              </div>
            )}

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

            {offer.offerCode && !isExpired && (
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

            {/* Expired Offer Code */}
            {offer.offerCode && isExpired && (
              <div className="flex items-start space-x-2 text-sm">
                <span className="text-gray-400 mt-0.5">🎫</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-500">Offer Code (Expired)</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <code className="px-3 py-1 bg-gray-100 border border-dashed border-gray-300 rounded text-gray-400 font-mono line-through">
                      {offer.offerCode}
                    </code>
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

          {/* Action Buttons - Disabled for expired offers */}
          <div className="flex space-x-3">
            <Button
              onClick={handleGetDirections}
              disabled={isExpired}
              className={`flex-1 flex items-center justify-center space-x-2 ${
                isExpired 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>{isExpired ? "Expired Offer" : "Get Directions"}</span>
            </Button>
            {offer.businessPhone && (
              <Button
                onClick={() => window.open(`tel:${offer.businessPhone}`)}
                disabled={isExpired}
                className={`flex-1 flex items-center justify-center space-x-2 ${
                  isExpired 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>{isExpired ? "Expired" : "Call Now"}</span>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Detailed Information */}
        {!isExpired && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 border-b border-gray-100"
          >
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
          </motion.div>
        )}

        {/* Expired Offer Message */}
        {isExpired && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 border-b border-gray-100"
          >
            <div className="text-center py-6">
              <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                This Offer Has Expired
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                This offer is no longer available as it has passed its validity period. 
                Please check back for new offers!
              </p>
              <Button
                onClick={onBack}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Browse Other Offers
              </Button>
            </div>
          </motion.div>
        )}
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
              alt={offer.title || "Offer image"}
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