import React from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  isLiked?: boolean;
  onLike?: (liked: boolean) => void;
  className?: string;
}

export default function LikeButton({ isLiked = false, onLike, className = "" }: LikeButtonProps) {
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(!isLiked);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.8 }}
      onClick={handleLike}
      className={`p-2 rounded-full transition-colors ${className}`}
    >
      <motion.div
        animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart 
          className={`w-5 h-5 transition-colors ${
            isLiked 
              ? 'text-red-500 fill-current' 
              : 'text-gray-400 hover:text-red-400'
          }`} 
        />
      </motion.div>
    </motion.button>
  );
}