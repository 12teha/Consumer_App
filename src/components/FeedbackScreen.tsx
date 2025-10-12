import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Star, Send, CheckCircle } from 'lucide-react';
import BackButton from './atoms/BackButton';

interface FeedbackScreenProps {
  onBack: () => void;
}

export default function FeedbackScreen({ onBack }: FeedbackScreenProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: 'general', label: 'General Feedback' },
    { id: 'bug', label: 'Bug Report' },
    { id: 'feature', label: 'Feature Request' },
    { id: 'performance', label: 'Performance' },
    { id: 'ui', label: 'User Interface' }
  ];

  const handleSubmit = () => {
    if (rating > 0 && feedback.trim()) {
      // Simulate API call
      setTimeout(() => {
        setSubmitted(true);
      }, 500);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <BackButton onBack={onBack} />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="text-center p-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", damping: 10 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-4"
          >
            Thank You!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8"
          >
            Your feedback has been submitted successfully. We appreciate your input!
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Back to Profile
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <BackButton onBack={onBack} />
      
      <div className="pt-16 pb-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <MessageSquare className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-2xl font-bold mb-2">Share Your Feedback</h1>
            <p className="text-gray-600">Help us improve OfferBeez for you</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border space-y-6"
          >
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-3">
                How would you rate your experience?
              </label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    className={`p-2 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-3">Feedback Category</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-lg border text-sm transition-colors ${
                      category === cat.id
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {cat.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Feedback Text */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Tell us more about your experience
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts, suggestions, or report any issues..."
                className="w-full p-4 border rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={rating === 0 || !feedback.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-medium flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              <span>Submit Feedback</span>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-6 text-sm text-gray-500"
          >
            Your feedback helps us make OfferBeez better for everyone
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}