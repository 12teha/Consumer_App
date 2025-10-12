import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Heart, Share2, Navigation, Star, Clock, 
  MessageCircle, Send, MapPin, Phone, Globe, ChevronLeft, ChevronRight
} from 'lucide-react';
import BackButton from './atoms/BackButton';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import DirectionsMap from './DirectionsMap';

interface OfferDetailsScreenProps {
  offer: any;
  onBack: () => void;
}

export default function OfferDetailsScreen({ offer, onBack }: OfferDetailsScreenProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showDirections, setShowDirections] = useState(false);

  const offerImages = [
    offer.image,
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc1Nzc0ODA4M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMGV4cGVyaWVuY2V8ZW58MXx8fHwxNzU3NzQ4MDgzfDA&ixlib=rb-4.1.0&q=80&w=1080'
  ];

  const reviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      comment: 'Amazing deals! Got 50% off on my favorite pizza. Staff was very friendly.',
      date: '2 days ago',
      avatar: '👩'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      rating: 4,
      comment: 'Good offer but had to wait a bit longer. Overall satisfied with the service.',
      date: '1 week ago',
      avatar: '👨'
    },
    {
      id: 3,
      name: 'Anita Patel',
      rating: 5,
      comment: 'Excellent! Used this offer 3 times already. Great value for money.',
      date: '2 weeks ago',
      avatar: '👩‍💼'
    }
  ];

  const relatedOffers = [
    {
      id: 10,
      title: 'Pizza Hut',
      discount: 40,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGh1dHxlbnwxfHx8fDE3NTc3NDgwODN8MA&ixlib=rb-4.1.0&q=80&w=400',
      distance: '1.2 km'
    },
    {
      id: 11,
      title: 'KFC',
      discount: 35,
      image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrZmMlMjBmb29kfGVufDF8fHx8MTc1Nzc0ODA4M3ww&ixlib=rb-4.1.0&q=80&w=400',
      distance: '0.7 km'
    }
  ];

  const handleSubmitReview = () => {
    if (userRating > 0 && comment.trim()) {
      // Add review logic here
      setUserRating(0);
      setComment('');
    }
  };

  const handleGetDirections = () => {
    // Check if we have coordinates
    if (offer.latitude && offer.longitude) {
      setShowDirections(true);
    } else {
      // Fallback to Google Maps with address
      const query = encodeURIComponent(offer.address || offer.businessName || offer.title);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
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
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Offer Details</h1>
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsWishlisted(!isWishlisted)}>
            <Heart className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
          </button>
          <button>
            <Share2 className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Image Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-64 bg-gray-200"
        >
          <ImageWithFallback
            src={offerImages[currentImageIndex]}
            alt={offer.title}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Arrows */}
          {offerImages.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImageIndex((prev) => 
                  prev === 0 ? offerImages.length - 1 : prev - 1
                )}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentImageIndex((prev) => 
                  prev === offerImages.length - 1 ? 0 : prev + 1
                )}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {offerImages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Discount Badge */}
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full">
            {offer.discount}% OFF
          </div>
        </motion.div>

        {/* Offer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 border-b border-gray-100"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{offer.title || offer.businessName}</h2>
              {offer.category && (
                <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  {offer.category}
                </span>
              )}
              <p className="text-gray-600 mt-2">{offer.description}</p>
            </div>
            {offer.rating && (
              <div className="flex items-center space-x-1 ml-3">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-semibold text-gray-900">{offer.rating}</span>
              </div>
            )}
          </div>

          {/* Price Information */}
          {(offer.discountedPrice || offer.originalPrice) && (
            <div className="flex items-center justify-between mb-4 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {offer.discountedPrice && (
                  <span className="text-2xl font-bold text-green-600">₹{offer.discountedPrice}</span>
                )}
                {offer.originalPrice && offer.originalPrice !== offer.discountedPrice && (
                  <span className="text-lg text-gray-400 line-through">₹{offer.originalPrice}</span>
                )}
              </div>
              {offer.originalPrice && offer.discountedPrice && (
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    Save ₹{offer.originalPrice - offer.discountedPrice}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Offer Details Grid */}
          <div className="space-y-3 mb-4">
            {offer.distance && (
              <div className="flex items-start space-x-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-700">Location</p>
                  <p className="text-gray-600">{offer.address || 'N/A'}</p>
                  <p className="text-gray-500 text-xs mt-1">{offer.distance} away</p>
                </div>
              </div>
            )}

            {offer.validity && (
              <div className="flex items-start space-x-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-700">Validity</p>
                  <p className="text-gray-600">{offer.validity}</p>
                  {offer.expiryDate && (
                    <p className="text-gray-500 text-xs mt-1">Expires: {new Date(offer.expiryDate).toLocaleDateString()}</p>
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
                        alert('Code copied!');
                      }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            )}

            {offer.businessPhone && (
              <div className="flex items-start space-x-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-gray-700">Contact</p>
                  <a href={`tel:${offer.businessPhone}`} className="text-blue-600 hover:underline">
                    {offer.businessPhone}
                  </a>
                </div>
              </div>
            )}

            {offer.businessEmail && (
              <div className="flex items-start space-x-2 text-sm">
                <span className="text-gray-400 mt-0.5">📧</span>
                <div className="flex-1">
                  <p className="font-medium text-gray-700">Email</p>
                  <a href={`mailto:${offer.businessEmail}`} className="text-blue-600 hover:underline">
                    {offer.businessEmail}
                  </a>
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
                    href={offer.website.startsWith('http') ? offer.website : `https://${offer.website}`}
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

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              onClick={handleGetDirections}
              className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </Button>
            {offer.businessPhone && (
              <Button
                onClick={() => window.open(`tel:${offer.businessPhone}`)}
                className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </Button>
            )}
          </div>
        </motion.div>

        {/* Detailed Information */}
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
              Enjoy our specially crafted {offer.category?.toLowerCase() || 'exclusive'} offer with premium quality and exceptional service.
            </p>
          )}

          {/* Terms and Conditions */}
          {offer.termsAndConditions && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-gray-900 text-sm mb-2">Terms & Conditions</h4>
              <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                {offer.termsAndConditions}
              </p>
            </div>
          )}

          {/* Additional Details */}
          {(offer.maxUsagePerUser || offer.minPurchaseAmount || offer.maxDiscountAmount) && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium text-gray-900 text-sm">Offer Limits</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {offer.maxUsagePerUser && (
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-500">Usage Limit</p>
                    <p className="font-medium text-gray-900">{offer.maxUsagePerUser} times per user</p>
                  </div>
                )}
                {offer.minPurchaseAmount && (
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-500">Min. Purchase</p>
                    <p className="font-medium text-gray-900">₹{offer.minPurchaseAmount}</p>
                  </div>
                )}
                {offer.maxDiscountAmount && (
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-500">Max. Discount</p>
                    <p className="font-medium text-gray-900">₹{offer.maxDiscountAmount}</p>
                  </div>
                )}
                {offer.totalRedemptions !== undefined && (
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-gray-500">Total Redeemed</p>
                    <p className="font-medium text-gray-900">{offer.totalRedemptions} times</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Business Information */}
          {(offer.businessName || offer.businessType) && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-900 text-sm mb-2">Business Information</h4>
              {offer.businessName && (
                <p className="text-sm text-gray-700"><span className="font-medium">Name:</span> {offer.businessName}</p>
              )}
              {offer.businessType && (
                <p className="text-sm text-gray-700 mt-1"><span className="font-medium">Type:</span> {offer.businessType}</p>
              )}
              {offer.businessDescription && (
                <p className="text-xs text-gray-600 mt-2">{offer.businessDescription}</p>
              )}
            </div>
          )}
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 border-b border-gray-100"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Customer Reviews</h3>
          
          {/* Add Review */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-3">Rate this offer</h4>
            <div className="flex items-center space-x-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setUserRating(star)}
                  className={`w-8 h-8 rounded-full ${
                    star <= userRating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="mb-3"
              rows={3}
            />
            <Button 
              onClick={handleSubmitReview}
              disabled={!userRating || !comment.trim()}
              size="sm"
              className="flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Review</span>
            </Button>
          </div>

          {/* Existing Reviews */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span>{review.avatar}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{review.name}</p>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Related Offers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4"
        >
          <h3 className="font-semibold text-gray-900 mb-4">Similar Offers Nearby</h3>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {relatedOffers.map((relatedOffer) => (
              <div
                key={relatedOffer.id}
                className="bg-gray-50 rounded-lg overflow-hidden min-w-[140px] cursor-pointer"
              >
                <ImageWithFallback
                  src={relatedOffer.image}
                  alt={relatedOffer.title}
                  className="w-full h-20 object-cover"
                />
                <div className="p-2">
                  <h4 className="font-medium text-sm text-gray-900 truncate">{relatedOffer.title}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-semibold text-green-600">{relatedOffer.discount}% OFF</span>
                    <span className="text-xs text-gray-500">{relatedOffer.distance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Directions Map Modal */}
      {showDirections && offer.latitude && offer.longitude && (
        <DirectionsMap
          isOpen={showDirections}
          onClose={() => setShowDirections(false)}
          destination={{
            latitude: offer.latitude,
            longitude: offer.longitude,
            name: offer.title || offer.businessName || 'Business Location',
            address: offer.address || 'Address not available'
          }}
        />
      )}
    </div>
  );
}