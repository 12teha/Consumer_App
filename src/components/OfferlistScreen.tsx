import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import OfferCard from "./atoms/OfferCard";
import { apiService } from "../services/api";

interface OffersListScreenProps {
  title: string;
  offerType?: string | null;
  category?: string | null;
  onBack: () => void;
  onOfferClick: (offer: any) => void;
}

const OffersListScreen: React.FC<OffersListScreenProps> = ({
  title,
  offerType,
  category,
  onBack,
  onOfferClick,
}) => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, [offerType, category]);

  const loadOffers = async () => {
    try {
      setLoading(true);

      // Fetch offers from API
      const allOffers = await apiService.getAllOffers();

      // Filter by category
      let filtered = category
        ? allOffers.filter((o: any) => o.category === category)
        : allOffers;

      // Filter by offer type
      if (offerType) {
        filtered = filtered.filter((o: any) => o.offerType === offerType);
      }

      setOffers(filtered);
    } catch (error) {
      console.error("Error loading offers:", error);
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white px-4 py-4 shadow-sm flex items-center gap-3 flex-shrink-0"
      >
        <button
          onClick={onBack}
          className="p-1 rounded-lg hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {!loading && (
            <span className="text-sm text-gray-600">({offers.length} results)</span>
          )}
        </div>
      </motion.div>

      {/* OFFER GRID */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="text-center mt-16 text-gray-500 text-lg">
            Loading...
          </div>
        ) : offers.length === 0 ? (
          <div className="text-center mt-16 text-gray-500 text-lg">
            No offers available
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {offers.map((offer) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <OfferCard
                  offer={offer}
                  hideActions={true}
                  onGetDirections={() => {}}
                  onLike={() => {}}
                  onClick={() => onOfferClick(offer)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersListScreen;
