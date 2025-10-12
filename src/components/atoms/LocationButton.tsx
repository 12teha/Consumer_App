import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin } from 'lucide-react';

interface LocationButtonProps {
  address: string;
  city: string;
  onClick?: () => void;
  className?: string;
}

export default function LocationButton({ address, city, onClick, className = "" }: LocationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(address);

  // Update currentAddress when address prop changes
  useEffect(() => {
    setCurrentAddress(address);
  }, [address]);

  const bangaloreAddresses = [
    'Koramangala 4th Block, Bangalore',
    'HSR Layout, Bangalore',
    'BTM Layout, Bangalore',
    'Indiranagar, Bangalore',
    'MG Road, Bangalore',
    'Whitefield, Bangalore',
    'Electronic City, Bangalore'
  ];

  const handleClick = () => {
    setIsLoading(true);
    
    // Simulate fetching location
    setTimeout(() => {
      const randomAddress = bangaloreAddresses[Math.floor(Math.random() * bangaloreAddresses.length)];
      setCurrentAddress(randomAddress);
      setIsLoading(false);
    }, 2000);
    
    onClick?.();
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`flex items-center space-x-2 flex-1 max-w-[60%] ${className}`}
    >
      <motion.div
        animate={isLoading ? { rotate: 360 } : {}}
        transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
      >
        <MapPin className="w-5 h-5 text-red-500" />
      </motion.div>
      <div className="text-left">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-sm font-semibold text-gray-900">Detecting location...</p>
              <motion.div 
                className="h-1 bg-gray-200 rounded-full mt-1 overflow-hidden"
                initial={{ width: 0 }}
              >
                <motion.div
                  className="h-full bg-red-500 rounded-full"
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="address"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 min-w-0"
            >
              <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{currentAddress}</p>
              {city && <p className="text-xs text-gray-500 truncate">{city}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}