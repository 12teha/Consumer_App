import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, MessageSquare, X } from 'lucide-react';

interface UserProfileIconsProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewClick: () => void;
}

export default function UserProfileIcons({ isOpen, onClose, onReviewClick }: UserProfileIconsProps) {
  const userProfiles = [
    { id: 1, name: 'Rahul K', avatar: 'RK', color: 'bg-blue-500' },
    { id: 2, name: 'Priya S', avatar: 'PS', color: 'bg-pink-500' },
    { id: 3, name: 'Amit M', avatar: 'AM', color: 'bg-green-500' },
    { id: 4, name: 'Sneha R', avatar: 'SR', color: 'bg-purple-500' },
    { id: 5, name: 'Vikram B', avatar: 'VB', color: 'bg-yellow-500' },
    { id: 6, name: 'Kavya N', avatar: 'KN', color: 'bg-red-500' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Who Liked This</h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {userProfiles.map((user) => (
                <motion.div
                  key={user.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center space-y-2 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className={`w-12 h-12 ${user.color} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-semibold text-sm">{user.avatar}</span>
                  </div>
                  <span className="text-xs text-gray-600 text-center">{user.name}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onReviewClick}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Submit Review</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}