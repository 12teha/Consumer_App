import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onBack: () => void;
  className?: string;
}

export default function BackButton({ onBack, className = "" }: BackButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onBack}
      className={`fixed top-4 left-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors ${className}`}
    >
      <ArrowLeft className="w-5 h-5 text-gray-700" />
    </motion.button>
  );
}