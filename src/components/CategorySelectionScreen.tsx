import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, Utensils, Shirt, Smartphone, Dumbbell, Coffee, Heart, Car } from 'lucide-react';
import { Button } from './ui/button';
import BackButton from './atoms/BackButton';
import BottomNavigation from './atoms/BottomNavigation';
import { apiService } from '../services/api';

interface CategorySelectionScreenProps {
  onComplete: (categories: string[]) => void;
  onBack?: () => void;
  onNavigate?: (screen: string, data?: any) => void;
}

export default function CategorySelectionScreen({ onComplete, onBack, onNavigate }: CategorySelectionScreenProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const iconMap: { [key: string]: any } = {
    food: Utensils,
    fashion: Shirt,
    electronics: Smartphone,
    grocery: ShoppingBag,
    fitness: Dumbbell,
    cafe: Coffee,
    beauty: Heart,
    automotive: Car,
    default: ShoppingBag
  };

  const colorMap: { [key: string]: string } = {
    food: 'from-orange-400 to-red-500',
    fashion: 'from-pink-400 to-purple-500',
    electronics: 'from-blue-400 to-indigo-500',
    grocery: 'from-green-400 to-teal-500',
    fitness: 'from-red-400 to-pink-500',
    cafe: 'from-amber-400 to-orange-500',
    beauty: 'from-rose-400 to-pink-500',
    automotive: 'from-gray-400 to-slate-500',
    default: 'from-purple-400 to-blue-500'
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getAllCategories();
        const fetchedCategories = response.categories || [];

        const formattedCategories = fetchedCategories.map((category: any) => ({
          id: category.id || category.name.toLowerCase().replace(/\s+/g, ''),
          name: category.name,
          icon: iconMap[category.name.toLowerCase().replace(/\s+/g, '')] || iconMap.default,
          color: colorMap[category.name.toLowerCase().replace(/\s+/g, '')] || colorMap.default
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([
          { id: 'food', name: 'Food & Dining', icon: Utensils, color: 'from-orange-400 to-red-500' },
          { id: 'fashion', name: 'Fashion', icon: Shirt, color: 'from-pink-400 to-purple-500' },
          { id: 'electronics', name: 'Electronics', icon: Smartphone, color: 'from-blue-400 to-indigo-500' },
          { id: 'grocery', name: 'Grocery', icon: ShoppingBag, color: 'from-green-400 to-teal-500' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleContinue = () => {
    if (selectedCategories.length >= 2) {
      onComplete(selectedCategories);
    }
  };

  const canContinue = selectedCategories.length >= 2;

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-8 flex flex-col">
      {/* Back Button */}
      {onBack && <BackButton onBack={onBack} />}
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 pt-4"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Choose Your Interests</h1>
        <p className="text-white/80">Select at least 2 categories to personalize your offers</p>
        <div className="mt-4 flex justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white">
              {selectedCategories.length}/2 minimum
            </span>
          </div>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <div className="flex-1 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-2 gap-4 max-w-md mx-auto"
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            const isSelected = selectedCategories.includes(category.id);
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  delay: 0.1 * index,
                  duration: 0.5,
                  type: "spring",
                  damping: 15
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleCategory(category.id)}
                className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 ${
                  isSelected 
                    ? 'bg-white shadow-2xl transform scale-105' 
                    : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
                }`}
              >
                {/* Selection Ring Animation */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 rounded-2xl border-4 border-white shadow-lg"
                  />
                )}

                {/* Icon */}
                <motion.div
                  className={`w-12 h-12 rounded-xl mb-3 mx-auto flex items-center justify-center ${
                    isSelected 
                      ? `bg-gradient-to-r ${category.color}` 
                      : 'bg-white/30'
                  }`}
                  animate={{ 
                    rotateY: isSelected ? [0, 360] : 0 
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon 
                    className={`w-6 h-6 ${
                      isSelected ? 'text-white' : 'text-white/80'
                    }`} 
                  />
                </motion.div>

                {/* Label */}
                <h3 className={`text-center font-semibold text-sm ${
                  isSelected ? 'text-gray-900' : 'text-white'
                }`}>
                  {category.name}
                </h3>

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-white text-sm"
                    >
                      ✓
                    </motion.span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full py-4 rounded-2xl text-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
            canContinue
              ? 'bg-white text-purple-600 hover:bg-gray-50 shadow-lg'
              : 'bg-white/30 text-white/50 cursor-not-allowed'
          }`}
        >
          <span>
            {canContinue ? 'Start Exploring!' : `Select ${2 - selectedCategories.length} more`}
          </span>
          {canContinue && <ArrowRight className="w-5 h-5" />}
        </Button>

        {/* Helper Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-white/60 text-center text-sm mt-3 mb-6"
        >
          You can always change these later in settings
        </motion.p>
      </motion.div>
    </div>
  );
}