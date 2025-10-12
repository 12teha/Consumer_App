import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Send, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface ReviewSectionProps {
  isOpen: boolean;
  onClose: () => void;
  offer: {
    id: number;
    title: string;
    image: string;
  };
}

interface Review {
  id: number;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
}

export default function ReviewSection({ isOpen, onClose, offer }: ReviewSectionProps) {
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  // Sample reviews data
  const reviews: Review[] = [
    {
      id: 1,
      user: 'Priya Sharma',
      avatar: 'PS',
      rating: 5,
      comment: 'Amazing deal! The food was delicious and delivery was super fast. Highly recommended!',
      date: '2 days ago',
      likes: 12
    },
    {
      id: 2,
      user: 'Rahul Gupta',
      avatar: 'RG',
      rating: 4,
      comment: 'Good value for money. Quality was excellent, will definitely order again.',
      date: '1 week ago',
      likes: 8
    },
    {
      id: 3,
      user: 'Sneha Reddy',
      avatar: 'SR',
      rating: 5,
      comment: 'Outstanding service! The discount made it such a great deal. Very satisfied.',
      date: '2 weeks ago',
      likes: 15
    }
  ];

  const handleSubmitReview = () => {
    if (newReview.trim() && newRating > 0) {
      // Here you would typically submit the review to your backend
      console.log('Submitting review:', { rating: newRating, comment: newReview, offerId: offer.id });
      setNewReview('');
      setNewRating(0);
      onClose();
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = interactive 
        ? starNumber <= (hoveredStar || newRating)
        : starNumber <= rating;

      return (
        <motion.button
          key={index}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && setNewRating(starNumber)}
          onMouseEnter={() => interactive && setHoveredStar(starNumber)}
          onMouseLeave={() => interactive && setHoveredStar(0)}
          whileHover={interactive ? { scale: 1.1 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            className={`w-4 h-4 ${
              isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        </motion.button>
      );
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 500 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-xl w-full max-w-md max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{offer.title}</h3>
                  <p className="text-sm text-gray-600">Reviews & Ratings</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Write Review Section */}
              <div className="p-4 border-b border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3">Write a Review</h4>
                
                {/* Rating Input */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Your Rating</p>
                  <div className="flex space-x-1">
                    {renderStars(0, true)}
                  </div>
                </div>

                {/* Comment Input */}
                <div className="mb-3">
                  <Textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Share your experience..."
                    className="resize-none"
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleSubmitReview}
                  disabled={!newReview.trim() || newRating === 0}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Review
                </Button>
              </div>

              {/* Reviews List */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Customer Reviews ({reviews.length})
                </h4>
                
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b border-gray-100 pb-4 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {review.avatar}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-semibold text-sm text-gray-900">
                              {review.user}
                            </h5>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1 mb-2">
                            {renderStars(review.rating)}
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <button className="flex items-center space-x-1 hover:text-purple-600">
                              <span>👍</span>
                              <span>{review.likes}</span>
                            </button>
                            <button className="hover:text-purple-600">Reply</button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {reviews.length === 0 && (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No reviews yet</p>
                    <p className="text-sm text-gray-400">Be the first to share your experience!</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}