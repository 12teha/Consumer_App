import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Clock, X } from 'lucide-react';

interface DirectionPopupProps {
  storeName: string;
  storeAddress: string;
  distance: string;
  estimatedTime: string;
}

export default function DirectionPopup({ storeName, storeAddress, distance, estimatedTime }: DirectionPopupProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleGetDirections = () => {
    const query = encodeURIComponent(storeAddress);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 z-50"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-4 mx-auto max-w-sm border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Navigate to Store</h3>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <p className="font-medium text-gray-900">{storeName}</p>
              <p className="text-sm text-gray-600">{storeAddress}</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{distance}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{estimatedTime}</span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGetDirections}
              className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Navigation className="w-5 h-5" />
              <span className="font-medium">Get Directions</span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}