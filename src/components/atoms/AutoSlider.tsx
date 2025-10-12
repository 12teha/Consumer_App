import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface AutoSliderProps {
  children: React.ReactNode[];
  autoSlide?: boolean;
  slideInterval?: number;
  className?: string;
}

export default function AutoSlider({ 
  children, 
  autoSlide = false, 
  slideInterval = 3000,
  className = ""
}: AutoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const childrenLength = React.useMemo(() => children.length, [children]);

  useEffect(() => {
    if (!autoSlide || childrenLength <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % childrenLength);
    }, slideInterval);

    return () => clearInterval(timer);
  }, [autoSlide, childrenLength, slideInterval]);

  if (childrenLength === 0) return null;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="flex transition-transform duration-500 ease-in-out"
        animate={{ x: `-${currentIndex * 100}%` }}
      >
        {children.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </motion.div>
      
      {childrenLength > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {children.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex === index ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}