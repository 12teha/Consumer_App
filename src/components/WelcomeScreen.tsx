import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Zap, Gift, MapPin, Star } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      icon: Gift,
      title: "Discover Amazing Offers",
      subtitle: "Find the best deals near you",
      color: "from-orange-400 to-red-500",
      iconColor: "text-orange-500"
    },
    {
      icon: MapPin,
      title: "Location-Based Deals",
      subtitle: "Get offers from your neighborhood",
      color: "from-blue-400 to-purple-500",
      iconColor: "text-blue-500"
    },
    {
      icon: Star,
      title: "Exclusive Rewards",
      subtitle: "Unlock special member benefits",
      color: "from-green-400 to-teal-500",
      iconColor: "text-green-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500" />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-20 bg-white/10 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
            <Zap className="w-12 h-12 text-yellow-500" />
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl font-bold text-white mb-2 text-center"
        >
          OfferBeez
        </motion.h1>

        {/* Namma Bengaluru App */}
        <motion.h2
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 1, type: "spring", stiffness: 100 }}
          className="text-2xl font-bold text-yellow-300 mb-4 text-center"
        >
          <motion.span
            animate={{ 
              textShadow: [
                "0 0 0px #ffd700",
                "0 0 10px #ffd700", 
                "0 0 0px #ffd700"
              ]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            Namma Bengaluru App
          </motion.span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-white/80 text-center mb-12"
        >
          Your neighborhood deals companion
        </motion.p>

        {/* Sliding Content */}
        <div className="w-full max-w-sm relative h-32">
          {slides.map((slide, index) => {
            const Icon = slide.icon;
            return (
              <motion.div
                key={index}
                className="absolute inset-0 flex flex-col items-center text-center"
                initial={{ opacity: 0, x: 100 }}
                animate={{ 
                  opacity: currentSlide === index ? 1 : 0,
                  x: currentSlide === index ? 0 : currentSlide > index ? -100 : 100
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Icon className={`w-8 h-8 ${slide.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{slide.title}</h3>
                <p className="text-white/70">{slide.subtitle}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Indicators */}
        <div className="flex space-x-2 mt-8">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full ${
                currentSlide === index ? 'bg-white' : 'bg-white/40'
              }`}
              animate={{ scale: currentSlide === index ? 1.2 : 1 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Skip Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={onComplete}
          className="absolute bottom-8 text-white/70 hover:text-white transition-colors"
        >
          Tap to continue
        </motion.button>
      </div>
    </div>
  );
}