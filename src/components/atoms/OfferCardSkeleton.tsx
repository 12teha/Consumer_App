import React from 'react';
import { motion } from 'motion/react';

export default function OfferCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Image Skeleton */}
      <div className="h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      </div>

      {/* Content Skeleton */}
      <div className="p-3 space-y-2">
        {/* Title */}
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-3/4"></div>

        {/* Description */}
        <div className="space-y-1">
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-full"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-2/3"></div>
        </div>

        {/* Price and Distance */}
        <div className="flex justify-between items-center pt-1">
          <div className="space-y-1">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-16"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-12"></div>
          </div>
          <div className="h-6 w-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    </motion.div>
  );
}

export function OfferListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: count }, (_, i) => (
        <OfferCardSkeleton key={i} />
      ))}
    </div>
  );
}