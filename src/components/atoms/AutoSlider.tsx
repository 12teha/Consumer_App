import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface AutoSliderProps {
  children: React.ReactNode[];
  autoSlide?: boolean;
  slideInterval?: number;
  className?: string;
  disableDrag?: boolean; // <-- NEW PROP
}

export default function AutoSlider({
  children,
  autoSlide = false,
  slideInterval = 3000,
  className = "",
  disableDrag = true, // default: drag disabled to fix scroll issue
}: AutoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const childrenLength = children.length;

  useEffect(() => {
    if (!autoSlide || childrenLength <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % childrenLength);
    }, slideInterval);

    return () => clearInterval(timer);
  }, [autoSlide, childrenLength, slideInterval]);

  if (childrenLength === 0) return null;

  return (
    <div
      className={`relative overflow-hidden touch-pan-y ${className}`} 
      // touch-pan-y allows vertical scrolling inside slider area
    >
      <motion.div
        className="flex transition-transform duration-500 ease-in-out"
        animate={{ x: `-${currentIndex * 100}%` }}
        drag={!disableDrag ? "x" : false}  // <---- Drag disabled by default
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.05}
      >
        {children.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0 pointer-events-none">
            {/* pointer-events-none ensures children don't block scroll */}
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
                currentIndex === index ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
