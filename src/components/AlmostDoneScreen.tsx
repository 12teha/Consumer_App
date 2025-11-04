import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, User, Star, Gift, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { authService } from '../utils/auth';

interface AlmostDoneScreenProps {
  onComplete: (username: string) => void;
}

export default function AlmostDoneScreen({ onComplete }: AlmostDoneScreenProps) {
  const [username, setUsername] = useState('');
  const [currentBg, setCurrentBg] = useState(0);
  const [motivationIndex, setMotivationIndex] = useState(0);
  const [error, setError] = useState('');

  const backgrounds = [
    { gradient: 'from-purple-400 via-pink-500 to-red-500', icon: Star },
    { gradient: 'from-blue-400 via-purple-500 to-indigo-600', icon: Gift },
    { gradient: 'from-green-400 via-blue-500 to-purple-600', icon: Trophy },
  ];

  const motivationalMessages = [
    {
      title: "You're Almost There!",
      message: "Just one more step to unlock amazing deals",
      emoji: "🎉"
    },
    {
      title: "Get Ready to Save!",
      message: "Discover exclusive offers tailored for you",
      emoji: "💝"
    },
    {
      title: "Welcome to Savings!",
      message: "Your journey to great deals starts now",
      emoji: "🚀"
    }
  ];

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 2500);

    const msgInterval = setInterval(() => {
      setMotivationIndex((prev) => (prev + 1) % motivationalMessages.length);
    }, 2000);

    return () => {
      clearInterval(bgInterval);
      clearInterval(msgInterval);
    };
  }, []);

  // Function to validate and format username
  const handleUsernameChange = (value: string) => {
    // Remove any non-alphabetic characters (only allow letters and spaces)
    const cleanedValue = value.replace(/[^a-zA-Z\s]/g, '');
    
    // Limit to 100 characters
    const formattedValue = cleanedValue.slice(0, 100);
    
    setUsername(formattedValue);
    
    // Validate and set error message
    const trimmedValue = formattedValue.trim();
    
    if (trimmedValue.length === 0 && formattedValue.length > 0) {
      setError('Please enter at least 1 character');
    } else if (trimmedValue.length < 1 && formattedValue.length > 0) {
      setError('Please enter at least 1 character');
    } else if (trimmedValue.length === 0) {
      setError('');
    } else {
      setError('');
    }
  };

  const handleSubmit = () => {
    const trimmedUsername = username.trim();
    
    if (trimmedUsername.length >= 1 && trimmedUsername.length <= 100) {
      // Update auth data with username
      authService.updateUserData({ username: trimmedUsername });
      onComplete(trimmedUsername);
    } else if (trimmedUsername.length < 1) {
      setError('Please enter at least 1 character');
    } else {
      setError('Name cannot exceed 100 characters');
    }
  };

  const isValidUsername = username.trim().length >= 1 && username.trim().length <= 100;

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Morphing Background Animation */}
      <div className="absolute inset-0">
        {backgrounds.map((bg, index) => {
          const Icon = bg.icon;
          return (
            <motion.div
              key={index}
              className={`absolute inset-0 bg-gradient-to-br ${bg.gradient}`}
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ 
                opacity: currentBg === index ? 1 : 0,
                scale: currentBg === index ? 1 : 1.2
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              {/* Floating Icons */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={`${index}-${i}`}
                    className="absolute text-white/10"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [-20, -100, -20],
                      rotate: [0, 360, 0],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 8 + Math.random() * 4,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  >
                    <Icon className="w-8 h-8" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-lg rounded-3xl p-8 shadow-2xl mx-auto w-full max-w-sm"
        >
          {/* Motivational Header */}
          <motion.div
            key={motivationIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 15 }}
              className="text-6xl mb-4"
            >
              {motivationalMessages[motivationIndex].emoji}
            </motion.div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {motivationalMessages[motivationIndex].title}
            </h2>
            <p className="text-gray-600">
              {motivationalMessages[motivationIndex].message}
            </p>
          </motion.div>

          {/* Username Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="Enter your name"
                className="pl-10 text-lg py-3"
                maxLength={100}
              />
            </div>

            {/* Validation Messages */}
            {username.length > 0 && (
              <div className="space-y-1">
                {/* Character count */}
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={`text-sm ${
                    isValidUsername 
                      ? 'text-green-600' 
                      : username.trim().length < 1 
                        ? 'text-red-500' 
                        : 'text-gray-500'
                  }`}
                >
                  {isValidUsername 
                    ? '✓ Looks good!' 
                    : username.trim().length < 1 
                      ? 'Please enter at least 1 character' 
                      : `${username.trim().length}/100 characters`}
                </motion.p>
                
                {/* Error message */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-red-500 text-sm"
                  >
                    {error}
                  </motion.p>
                )}
                
                {/* Alpha characters only hint */}
                {username.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-gray-400"
                  >
                    Only letters and spaces allowed
                  </motion.p>
                )}
              </div>
            )}

            {/* Character counter */}
            {username.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`text-xs text-right ${
                  username.trim().length > 100 ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                {username.trim().length}/100 characters
              </motion.p>
            )}

            {/* Continue Button */}
            <Button
              onClick={handleSubmit}
              disabled={!isValidUsername}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Let's Get Started!</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Excitement Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-gray-500 text-center mt-4"
          >
            🎯 Getting personalized offers ready for you...
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}