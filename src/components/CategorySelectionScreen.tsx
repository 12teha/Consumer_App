import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, Utensils, Shirt, Smartphone, Dumbbell, Coffee, Heart, Car } from 'lucide-react';
import { Button } from './ui/button';
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
    'food&dining': Utensils,
    fooddining: Utensils,
    fashion: Shirt,
    fashoin: Shirt,
    clothing: Shirt,
    electronics: Smartphone,
    grocery: ShoppingBag,
    fitness: Dumbbell,
    cafe: Coffee,
    beauty: Heart,
    automotive: Car,
    'home&lifestyle': Heart,
    homelifestyle: Heart,
    'small-scalemanufacturing': Dumbbell,
    smallscalemanufacturing: Dumbbell,
    'wholesale&distribution': ShoppingBag,
    wholesaledistribution: ShoppingBag,
    default: ShoppingBag
  };

  const colorMap: { [key: string]: string } = {
    food: 'from-orange-400 to-red-500',
    'food&dining': 'from-orange-400 to-red-500',
    fooddining: 'from-orange-400 to-red-500',
    fashion: 'from-pink-400 to-purple-500',
    fashoin: 'from-pink-400 to-purple-500',
    clothing: 'from-pink-400 to-purple-500',
    electronics: 'from-blue-400 to-indigo-500',
    grocery: 'from-green-400 to-teal-500',
    fitness: 'from-red-400 to-pink-500',
    cafe: 'from-amber-400 to-orange-500',
    beauty: 'from-rose-400 to-pink-500',
    automotive: 'from-gray-400 to-slate-500',
    'home&lifestyle': 'from-purple-400 to-indigo-500',
    homelifestyle: 'from-purple-400 to-indigo-500',
    'small-scalemanufacturing': 'from-teal-400 to-cyan-500',
    smallscalemanufacturing: 'from-teal-400 to-cyan-500',
    'wholesale&distribution': 'from-green-400 to-emerald-500',
    wholesaledistribution: 'from-green-400 to-emerald-500',
    default: 'from-purple-400 to-blue-500'
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('🔍 CategorySelectionScreen: Fetching categories...');
        const response = await apiService.getAllCategories();
        console.log('📦 CategorySelectionScreen: Full API response:', response);

        // Handle different response structures
        let fetchedCategories = [];

        if (response.categories && Array.isArray(response.categories)) {
          fetchedCategories = response.categories;
        } else if (response.data && Array.isArray(response.data)) {
          fetchedCategories = response.data;
        } else if (Array.isArray(response)) {
          fetchedCategories = response;
        } else {
          console.error('❌ Unexpected response structure:', response);
          throw new Error('Invalid response format');
        }

        console.log('📋 CategorySelectionScreen: Fetched categories:', fetchedCategories);

        if (fetchedCategories.length === 0) {
          console.warn('⚠️ No categories returned from API, using fallback');
          throw new Error('No categories returned');
        }

        const formattedCategories = fetchedCategories.map((category: any) => {
          // Handle different field names: name, categoryName, category_name
          const categoryName = category.name || category.categoryName || category.category_name || 'Unknown';
          const categoryId = category.id || category._id || categoryName.toLowerCase().replace(/\s+/g, '');
          const normalizedName = categoryName.toLowerCase().replace(/\s+/g, '');

          console.log('✨ Formatting category:', { categoryName, categoryId, normalizedName });

          return {
            id: categoryId,
            name: categoryName,
            icon: iconMap[normalizedName] || iconMap.default,
            color: colorMap[normalizedName] || colorMap.default
          };
        });

        console.log('✅ CategorySelectionScreen: Formatted categories:', formattedCategories);
        setCategories(formattedCategories);
      } catch (error) {
        console.error('❌ Error fetching categories:', error);
        console.log('⚠️ Using fallback categories');
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

  const handleCategoryClick = (categoryName: string) => {
    // Immediately navigate to home with selected category
    onComplete([categoryName]);
  };

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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8 pt-4"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Discover Amazing Offers</h1>
        <p className="text-white/80">Choose a category to explore the best deals near you</p>
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
                onClick={() => handleCategoryClick(category.name)}
                className="relative cursor-pointer rounded-2xl p-6 transition-all duration-300 bg-white/20 backdrop-blur-sm hover:bg-white/30"
              >
                {/* Icon */}
                <motion.div
                  className="w-12 h-12 rounded-xl mb-3 mx-auto flex items-center justify-center bg-white/30"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-6 h-6 text-white/80" />
                </motion.div>

                {/* Label */}
                <h3 className="text-center font-semibold text-sm text-white">
                  {category.name}
                </h3>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Helper Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <p className="text-white/80 text-center text-sm mb-6">
          Click on any category to start exploring offers
        </p>
      </motion.div>
    </div>
  );
}