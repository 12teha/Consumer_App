import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Mic, X } from 'lucide-react';
import { Input } from '../ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  showResults?: boolean;
  onClear?: () => void;
  className?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "Search for offers, stores...", 
  showResults = false,
  onClear,
  className = "" 
}: SearchBarProps) {
  const [showWrongIcon, setShowWrongIcon] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Auto-search after 3 words
    const wordCount = newValue.trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount >= 3) {
      onSearch?.(newValue);
    }
  };

  const handleClear = () => {
    onChange('');
    setShowWrongIcon(true);
    onClear?.();
    setTimeout(() => setShowWrongIcon(false), 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch?.(value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          value={value}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <AnimatePresence mode="wait">
            {value.length > 0 ? (
              <motion.button
                key="clear"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={handleClear}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                {showWrongIcon ? (
                  <X className="w-4 h-4 text-red-500" />
                ) : (
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                )}
              </motion.button>
            ) : (
              <motion.div
                key="mic"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Mic className="w-4 h-4 text-gray-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}