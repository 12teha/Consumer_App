import React, { useEffect, memo } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface AdVideoPopupProps {
  title: string;
  discount: string;
  image: string;
  side: 'left' | 'right';
  onClose: () => void;
  onClick?: () => void;
}

// Local storage key for tracking ad video shows
const AD_SHOW_COUNT_KEY = 'offerbeez_ad_show_count';

const AdVideoPopup = memo(function AdVideoPopup({ 
  title, 
  discount, 
  image, 
  side, 
  onClose, 
  onClick 
}: AdVideoPopupProps) {
  // Track when popup is shown
  useEffect(() => {
    try {
      const currentCount = parseInt(localStorage.getItem(AD_SHOW_COUNT_KEY) || '0');
      localStorage.setItem(AD_SHOW_COUNT_KEY, (currentCount + 1).toString());
    } catch (error) {
      console.warn('Could not update ad show count:', error);
    }
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <motion.div
      initial={{ x: side === 'left' ? -300 : 300, opacity: 0 }}
      animate={{ x: side === 'left' ? 20 : -20, opacity: 1 }}
      exit={{ x: side === 'left' ? -300 : 300, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-1/2 transform -translate-y-1/2 z-50 ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
      onClick={onClick}
    >
      <div className="relative w-24 h-32 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-xl overflow-hidden cursor-pointer">
        <button
          onClick={handleClose}
          className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center z-10"
        >
          <X className="w-3 h-3 text-white" />
        </button>
        
        <div className="p-2 text-white text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-bold mb-1"
          >
            {discount}
          </motion.div>
          <div className="text-[10px] mb-2">{title}</div>
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-2 left-1 right-1"
        >
          <ImageWithFallback 
            src={image}
            alt={title}
            className="w-full h-16 object-cover rounded"
          />
        </motion.div>
        
        {/* Simplified animated border */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg"
        />
      </div>
    </motion.div>
  );
});

// Utility function to check if ad should be shown
export const shouldShowAdVideo = (): boolean => {
  try {
    const showCount = parseInt(localStorage.getItem(AD_SHOW_COUNT_KEY) || '0');
    return showCount < 2;
  } catch (error) {
    console.warn('Could not read ad show count:', error);
    return false; // Don't show ads if localStorage access fails
  }
};

export default AdVideoPopup;