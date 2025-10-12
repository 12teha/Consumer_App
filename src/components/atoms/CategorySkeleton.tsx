import React from 'react';
import { motion } from 'motion/react';

export default function CategorySkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-shrink-0 w-16 text-center"
    >
      {/* Icon Skeleton */}
      <div className="w-12 h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full mx-auto mb-1 animate-pulse"></div>

      {/* Label Skeleton */}
      <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse w-10 mx-auto"></div>
    </motion.div>
  );
}

export function CategoryListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="flex space-x-4 px-4 py-2">
      {Array.from({ length: count }, (_, i) => (
        <CategorySkeleton key={i} />
      ))}
    </div>
  );
}