import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Camera, HardDrive, MapPin, Check, X } from 'lucide-react';
import { Button } from './ui/button';

interface PermissionPopupProps {
  onComplete: () => void;
}

export default function PermissionPopup({ onComplete }: PermissionPopupProps) {
  const [permissions, setPermissions] = useState({
    camera: false,
    storage: false,
    location: false,
  });

  const permissionItems = [
    {
      id: 'camera',
      icon: Camera,
      title: 'Camera Access',
      description: 'Take photos and scan QR codes for offers',
      color: 'text-blue-500',
    },
    {
      id: 'storage',
      icon: HardDrive,
      title: 'Storage Access',
      description: 'Save offer images and store app data',
      color: 'text-green-500',
    },
    {
      id: 'location',
      icon: MapPin,
      title: 'Location Access',
      description: 'Find nearby stores and location-based offers',
      color: 'text-red-500',
    },
  ];

  const handlePermissionToggle = (permissionId: string) => {
    setPermissions(prev => ({
      ...prev,
      [permissionId]: !prev[permissionId as keyof typeof prev],
    }));
  };

  const allPermissionsGranted = Object.values(permissions).every(Boolean);

  return (
    <div className="h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-end">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full bg-white rounded-t-3xl p-6 pb-8 max-h-[80vh] overflow-y-auto"
      >
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to OfferBeez</h2>
          <p className="text-gray-600">We need a few permissions to provide you the best experience</p>
        </div>

        <div className="space-y-4 mb-8">
          {permissionItems.map((item) => {
            const Icon = item.icon;
            const isGranted = permissions[item.id as keyof typeof permissions];
            
            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  isGranted 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
                onClick={() => handlePermissionToggle(item.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full bg-white ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isGranted 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300'
                  }`}>
                    {isGranted && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onComplete}
          >
            Skip for now
          </Button>
          <Button
            className={`flex-1 ${allPermissionsGranted ? 'bg-green-500 hover:bg-green-600' : ''}`}
            onClick={onComplete}
            disabled={!allPermissionsGranted}
          >
            {allPermissionsGranted ? 'Continue' : 'Grant All Permissions'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}