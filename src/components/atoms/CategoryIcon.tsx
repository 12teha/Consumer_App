import React from 'react';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface CategoryIconProps {
  name: string;
  image: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function CategoryIcon({ name, image, isActive = false, onClick, className = "" }: CategoryIconProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={`relative flex flex-col items-center space-y-2 p-2 rounded-xl transition-all min-w-[70px] ${
        isActive
          ? 'bg-purple-100 border-2 border-purple-500'
          : 'bg-white hover:bg-gray-50'
      } ${className}`}
    >
      <motion.div
        className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center"
        animate={{
          rotate: isActive ? [0, 5, -5, 0] : 0
        }}
        transition={{ duration: 0.5 }}
      >
        <ImageWithFallback
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 bg-purple-500/20 flex items-center justify-center"
          >
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
          </motion.div>
        )}
      </motion.div>
      <span className={`text-[10px] font-semibold text-center max-w-[70px] truncate ${
        isActive ? 'text-purple-700' : 'text-gray-800'
      }`}>
        {name}
      </span>
    </motion.button>
  );
}