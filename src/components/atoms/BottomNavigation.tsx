import React, { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import { Grid3X3, Home } from 'lucide-react';

interface BottomNavigationProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

const BottomNavigation = memo(function BottomNavigation({ activeScreen, onNavigate }: BottomNavigationProps) {
  const navigationItems = useMemo(() => [
    {
      id: 'categorySelection',
      icon: Grid3X3,
      label: 'Category',
      activeColor: 'text-purple-600',
      inactiveColor: 'text-gray-400'
    },
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      activeColor: 'text-purple-600',
      inactiveColor: 'text-gray-400'
    }
  ], []);

  const getIsActive = useMemo(() => (itemId: string) => {
    return activeScreen === itemId ||
      (itemId === 'home' && ['home', 'offerDetails', 'allOffers', 'curatedOffers'].includes(activeScreen));
  }, [activeScreen]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-t border-gray-200 px-4 py-2 safe-area-pb"
    >
      <div className="flex justify-around items-center">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = getIsActive(item.id);
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center space-y-1 py-2 min-w-0 flex-1"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Icon className={`w-5 h-5 ${isActive ? item.activeColor : item.inactiveColor}`} />
              </motion.div>
              
              <span className={`text-xs ${
                isActive 
                  ? `${item.activeColor} font-semibold` 
                  : `${item.inactiveColor}`
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
});

export default BottomNavigation;



