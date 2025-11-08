import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import CategoryIcon from './atoms/CategoryIcon';
import { apiService } from '../services/api';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface BrowseCategoriesScreenProps {
  onBack: () => void;
  onCategorySelect: (category: string) => void;
}

// Default icon mapping for common categories
const getCategoryIcon = (categoryName: string): string => {
  const name = categoryName.toLowerCase();
  if (name.includes('food') || name.includes('dining') || name.includes('restaurant')) return '🍽️';
  if (name.includes('fashion') || name.includes('apparel') || name.includes('clothing')) return '👔';
  if (name.includes('electronics') || name.includes('gadget')) return '📱';
  if (name.includes('beauty') || name.includes('spa') || name.includes('salon')) return '💄';
  if (name.includes('grocery') || name.includes('supermarket')) return '🛒';
  if (name.includes('fitness') || name.includes('sports') || name.includes('gym')) return '💪';
  if (name.includes('home') || name.includes('furniture')) return '🛋️';
  if (name.includes('health') || name.includes('pharmacy') || name.includes('medical')) return '💊';
  if (name.includes('book') || name.includes('stationery')) return '📚';
  if (name.includes('automotive') || name.includes('car')) return '🚗';
  if (name.includes('travel') || name.includes('hotel')) return '✈️';
  if (name.includes('entertainment') || name.includes('movie')) return '🎬';
  if (name.includes('jewelry') || name.includes('accessories')) return '💍';
  if (name.includes('kids') || name.includes('toys')) return '🧸';
  if (name.includes('pets') || name.includes('animal')) return '🐾';
  if (name.includes('service')) return '🔧';
  if (name.includes('education') || name.includes('school')) return '🎓';
  if (name.includes('real estate') || name.includes('property')) return '🏠';
  return '🏪'; // Default store icon
};

// Color palette for categories
const categoryColors = [
  'bg-amber-100', 'bg-pink-100', 'bg-blue-100', 'bg-purple-100',
  'bg-green-100', 'bg-orange-100', 'bg-yellow-100', 'bg-cyan-100',
  'bg-indigo-100', 'bg-gray-100', 'bg-sky-100', 'bg-rose-100',
  'bg-lime-100', 'bg-violet-100', 'bg-emerald-100', 'bg-fuchsia-100',
];

export default function BrowseCategoriesScreen({ onBack, onCategorySelect }: BrowseCategoriesScreenProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📂 Fetching categories from API...');
      const response = await apiService.getAllCategories();

      console.log('✅ Categories response:', response);

      // Handle different response formats
      let categoryList: any[] = [];

      if (response.success && response.data) {
        categoryList = response.data;
      } else if (Array.isArray(response)) {
        categoryList = response;
      } else if (response.categories) {
        categoryList = response.categories;
      }

      console.log('📋 Category list:', categoryList);

      // Transform backend categories to UI format
      const formattedCategories: Category[] = categoryList.map((category: any, index: number) => {
        // Handle both object {id, categoryName} and string formats
        const categoryName = typeof category === 'string' ? category : (category.categoryName || category.name);
        const categoryId = typeof category === 'string' ? category.toLowerCase().replace(/\s+/g, '-') : category.id;

        return {
          id: categoryId,
          name: categoryName,
          icon: getCategoryIcon(categoryName),
          color: categoryColors[index % categoryColors.length],
        };
      });

      console.log('✅ Formatted categories:', formattedCategories);
      setCategories(formattedCategories);
    } catch (err) {
      console.error('❌ Failed to load categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center p-4">
          <button
            onClick={onBack}
            className="mr-3 p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Browse by Category</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-800">{error}</p>
            <button
              onClick={loadCategories}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 mb-2">No categories available</p>
            <p className="text-sm text-gray-500">Please try again later</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                onClick={() => onCategorySelect(category.name)}
                className={`${category.color} rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-md transition-all duration-200 active:scale-95`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-800 leading-tight">
                    {category.name}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 mt-2" />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
