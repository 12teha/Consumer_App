import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Plus, Search, Star, Home, Briefcase, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import BackButton from './atoms/BackButton';
import BottomNavigation from './atoms/BottomNavigation';

interface LocationScreenProps {
  onBack: () => void;
  onNavigate?: (screen: string, data?: any) => void;
}

export default function LocationScreen({ onBack, onNavigate }: LocationScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('current');

  const savedLocations = [
    {
      id: 'current',
      type: 'current',
      name: 'Current Location',
      address: 'Koramangala 4th Block, Bangalore',
      icon: Navigation,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'home',
      type: 'home',
      name: 'Home',
      address: 'Jayanagar 3rd Block, Bangalore',
      icon: Home,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'work',
      type: 'work',
      name: 'Work',
      address: 'Whitefield, ITPL Main Road, Bangalore',
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const nearbyAreas = [
    {
      name: 'HSR Layout',
      distance: '2.1 km',
      offers: 45,
      popular: true
    },
    {
      name: 'BTM Layout',
      distance: '3.5 km',
      offers: 32,
      popular: false
    },
    {
      name: 'Electronic City',
      distance: '8.2 km',
      offers: 28,
      popular: false
    },
    {
      name: 'Indiranagar',
      distance: '4.7 km',
      offers: 56,
      popular: true
    },
    {
      name: 'MG Road',
      distance: '6.1 km',
      offers: 67,
      popular: true
    }
  ];

  const handleAreaClick = (area: any) => {
    // Navigate to area offers view
    if (onNavigate) {
      onNavigate('areaOffers', { area });
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <BackButton onBack={onBack} />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white px-4 py-3 shadow-sm flex items-center justify-between"
      >
        <h1 className="text-lg font-semibold text-gray-900">Location</h1>
        <button>
          <Plus className="w-6 h-6 text-gray-400" />
        </button>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-white border-b border-gray-100"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for area, landmark..."
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Saved Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white mt-4 mx-4 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Saved Locations</h3>
          </div>
          
          <div className="space-y-0">
            {savedLocations.map((location, index) => {
              const Icon = location.icon;
              return (
                <motion.button
                  key={location.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => setSelectedLocation(location.id)}
                  className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                    selectedLocation === location.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 ${location.bgColor} rounded-full flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${location.color}`} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">{location.name}</h3>
                      <p className="text-sm text-gray-500">{location.address}</p>
                    </div>
                  </div>
                  {selectedLocation === location.id && (
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="p-4 border-t border-gray-100">
            <Button variant="outline" className="w-full flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add New Location</span>
            </Button>
          </div>
        </motion.div>

        {/* Nearby Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white mt-4 mx-4 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Nearby Areas</h3>
            <p className="text-sm text-gray-500 mt-1">Explore offers in nearby locations</p>
          </div>
          
          <div className="space-y-0">
            {nearbyAreas.map((area, index) => (
              <motion.button
                key={area.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => handleAreaClick(area)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{area.name}</h3>
                      {area.popular && (
                        <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3 text-yellow-600 fill-current" />
                          <span className="text-xs text-yellow-700">Popular</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{area.distance} away</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{area.offers} offers</p>
                  <p className="text-xs text-gray-500">available</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Location Permissions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 mx-4 mt-4 rounded-xl p-4 border border-blue-200"
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900 mb-1">Enable Location Services</h3>
              <p className="text-sm text-blue-700 mb-3">
                Allow location access to get personalized offers and accurate distances to stores.
              </p>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Enable Location
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Map Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mt-4 mb-20 h-40 bg-gray-200 rounded-xl overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 font-medium">Interactive Map</p>
              <p className="text-sm text-gray-500">Tap to view on full map</p>
            </div>
          </div>
          
          {/* Mock location pins */}
          <div className="absolute top-4 left-8 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <div className="absolute bottom-8 right-12 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <div className="absolute top-12 right-6 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeScreen="location"
        onNavigate={onNavigate || (() => {})}
      />
    </div>
  );
}