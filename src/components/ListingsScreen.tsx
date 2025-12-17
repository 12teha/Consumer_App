import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import BottomNavigation from "./atoms/BottomNavigation";
import { apiService } from "../services/api";
import { CategoryListSkeleton } from "./atoms/CategorySkeleton";


interface ListingsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

const ListingsScreen: React.FC<ListingsScreenProps> = ({ onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getAllCategories();
      const fetched = response.categories || [];

      if (fetched.length === 0) throw new Error("No categories found");

      const allCategory = {
        name: "All",
        image:
          "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200",
      };

      const processed = fetched.map((cat: any) => {
        let iconUrl =
          cat.categoryIconUrl ||
          cat.categoryIcon ||
          cat.image ||
          cat.icon ||
          cat.icon_url;

        if (iconUrl) iconUrl = iconUrl.replace(/\+/g, "%20");

        return {
          name: cat.categoryName || cat.name || "Unknown",
          image:
            iconUrl ||
            "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200",
        };
      });

      setCategories([allCategory, ...processed]);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setError("Failed to load categories");
      setCategories([
        {
          name: "All",
          image:
            "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200",
        },
      ]);
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName: string) => {
    onNavigate('businessList', { category: categoryName });
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white px-4 py-4 shadow-sm"
      >
        <div className="flex items-center space-x-3">
          
          <button
            onClick={() => onNavigate('home')}  
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">All Categories</h1>
            <p className="text-sm text-gray-500">
              Browse businesses by category
            </p>
          </div>
        </div>
      </motion.div>

      {/* Category List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <CategoryListSkeleton />
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-3">{error}</p>
            <button
              onClick={loadCategories}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(category.name)}
                className="w-full bg-white rounded-xl shadow-sm p-4 flex items-center space-x-4 hover:shadow-md transition-shadow"
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Text */}
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    View all {category.name.toLowerCase()} businesses
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeScreen="storeListing" onNavigate={onNavigate} />
    </div>
  );
};

export default ListingsScreen;