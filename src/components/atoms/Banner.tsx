import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Button } from '../ui/button';

interface BannerProps {
  title: string;
  subtitle: string;
  image?: string;
  images?: string[];
  color?: string;
  onClick?: () => void;
  className?: string;
  size?: 'large' | 'small';
  autoSlide?: boolean;
  slideInterval?: number;
}

export default function Banner({ 
  title, 
  subtitle, 
  image, 
  images,
  color = 'from-purple-500 to-pink-500', 
  onClick, 
  className = "",
  size = 'large',
  autoSlide = true,
  slideInterval = 3000
}: BannerProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const height = size === 'large' ? 'h-40' : 'h-24';

  // Auto-slide functionality for multiple images
  useEffect(() => {
    if (!images || images.length <= 1 || !autoSlide) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, slideInterval);

    return () => clearInterval(interval);
  }, [images, autoSlide, slideInterval]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative ${height} rounded-xl overflow-hidden cursor-pointer ${className}`}
    >
      {images && images.length > 0 ? (
        <div className="relative w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <ImageWithFallback
                src={images[currentImageIndex]}
                alt={`${title} ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            </motion.div>
          </AnimatePresence>
          
          {/* Image indicators */}
          {images.length > 1 && size === 'large' && (
            <div className="absolute bottom-2 right-2 flex space-x-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : image ? (
        <div className="relative w-full h-full">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>
      ) : (
        <div className={`w-full h-full bg-gradient-to-r ${color}`} />
      )}
      
      <div className="absolute inset-0 p-4 flex flex-col justify-center text-white">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`font-bold mb-1 ${size === 'large' ? 'text-xl' : 'text-base'}`}
        >
          {title}
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`opacity-90 ${size === 'large' ? 'text-sm mb-3' : 'text-xs'}`}
        >
          {subtitle}
        </motion.p>
        {size === 'large' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button className="bg-white/20 text-white border-white/30 hover:bg-white/30 w-fit">
              Shop Now
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}