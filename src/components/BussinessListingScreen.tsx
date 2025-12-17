import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Navigation, Phone, MapPin } from "lucide-react";
import BackButton from "./atoms/BackButton";
import { Button } from "./ui/button";
import { apiService } from "../services/api";

interface BusinessListingScreenProps {
  category: string;
  onBack: () => void;
  onNavigate: (screen: string, data?: any) => void;
}

const BusinessListingScreen: React.FC<BusinessListingScreenProps> = ({
  category,
  onBack,
  onNavigate,
}) => {
  const [categoryData, setCategoryData] = useState<any | null>(null);

  /** ------------------ BUSINESS DEMO DATA ------------------ **/
  const demoBusinesses = [
    {
      id: 1,
      name: "Domino's Pizza",
      logo: "https://images.unsplash.com/photo-1594398028856-f253a046f417?w=200",
      phone: "+91 9876543210",
      description:
        "Best pizzas in town with 30-minute delivery guarantee. Fresh ingredients and variety of toppings.",
      address: "Phoenix Mall, Food Court, Bangalore",
      rating: 4.2,
      category: "Food",
    },
    {
      id: 2,
      name: "Burger King",
      logo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200",
      phone: "+91 9876543211",
      description: "Flame-grilled burgers and fresh ingredients.",
      address: "Brigade Road, Bangalore",
      rating: 4.0,
      category: "Food",
    },
    {
      id: 3,
      name: "KFC",
      logo: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200",
      phone: "+91 9876543212",
      description: "Original recipe fried chicken.",
      address: "MG Road, Bangalore",
      rating: 4.3,
      category: "Food",
    },
    {
      id: 4,
      name: "Zara",
      logo: "https://images.unsplash.com/photo-1575111507952-2d4f371374f5?w=200",
      phone: "+91 9876543213",
      description: "Premium fashion clothing for men & women.",
      address: "City Center Mall, Bangalore",
      rating: 4.5,
      category: "Fashion",
    },
    {
      id: 5,
      name: "H&M",
      logo: "https://images.unsplash.com/photo-1623332670442-4b6873fb6f03?w=200",
      phone: "+91 9876543214",
      description: "Affordable trendy fashion for all.",
      address: "Mantri Square Mall, Bangalore",
      rating: 4.6,
      category: "Fashion",
    },
    {
      id: 6,
      name: "Levi's",
      logo: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200",
      phone: "+91 9876543215",
      description: "Authentic denim wear.",
      address: "Phoenix Marketcity",
      rating: 4.4,
      category: "Fashion",
    },
    {
      id: 7,
      name: "Samsung Galaxy Store",
      logo: "https://images.unsplash.com/photo-1723910168805-e783bc5c15c0?w=200",
      phone: "+91 9876543216",
      description: "Official Samsung smartphones & accessories.",
      address: "Tech Plaza, Bangalore",
      rating: 4.3,
      category: "Electronics",
    },
    {
      id: 8,
      name: "Apple Store",
      logo: "https://images.unsplash.com/photo-1611079167993-e57e6300c9b8?w=200",
      phone: "+91 9876543217",
      description: "Premium Apple iPhones, iPads, Macs.",
      address: "UB City Mall",
      rating: 4.7,
      category: "Electronics",
    },
    {
      id: 9,
      name: "Croma",
      logo: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200",
      phone: "+91 9876543218",
      description: "Multi-brand electronics retailer.",
      address: "Jayanagar, Bangalore",
      rating: 4.1,
      category: "Electronics",
    },
  ];

  /** ------------------ Load Category Icon (Backend) ------------------ **/
  useEffect(() => {
    const load = async () => {
      try {
        const response = await apiService.getAllCategories();
        const list = response?.categories || [];

        const matched = list.find(
          (cat: any) =>
            cat.categoryName?.toLowerCase() === category?.toLowerCase()
        );

        setCategoryData(matched || null);
      } catch (err) {
        console.error("Category load failed", err);
      }
    };

    load();
  }, [category]);

  /** ------------------ Filter Businesses by Category ------------------ **/
  const businesses = demoBusinesses.filter(
    (b) => b.category.toLowerCase() === category.toLowerCase()
  );

  const handleGetDirections = (business: any) => {
    const address = encodeURIComponent(business.address);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${address}`,
      "_blank"
    );
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white px-4 py-4 shadow-sm"
      >
        <div className="flex items-center space-x-3 mb-2">
          <BackButton onClick={onBack} />

          <div className="flex items-center space-x-2">
            {categoryData?.categoryIconUrl && (
              <img
                src={categoryData.categoryIconUrl.replace(/\+/g, "%20")}
                alt={category}
                className="w-8 h-8 rounded-md object-cover"
              />
            )}

            <div>
              <h1 className="text-xl font-bold text-gray-900">{category}</h1>
              <p className="text-sm text-gray-500">
                {businesses.length} businesses found
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Business List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {businesses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No businesses found in this category
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {businesses.map((business, index) => (
              <motion.div
                key={business.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex space-x-4">
                  {/* Logo */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <img
                      src={business.logo}
                      alt={business.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {business.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {business.description}
                    </p>

                    <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{business.phone}</span>
                    </div>

                    <div className="flex items-center space-x-1 text-xs text-gray-500 mb-3">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">
                        {business.address}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleGetDirections(business)}
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 h-8"
                      >
                        <Navigation className="w-3.5 h-3.5 mr-1" />
                        Directions
                      </Button>

                      <Button
                        onClick={() => handleCall(business.phone)}
                        size="sm"
                        variant="outline"
                        className="flex-1 h-8"
                      >
                        <Phone className="w-3.5 h-3.5 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessListingScreen;
