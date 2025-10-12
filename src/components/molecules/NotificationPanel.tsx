import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gift, Clock, Star, MapPin } from 'lucide-react';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const notifications = [
    {
      id: 1,
      type: 'offer',
      icon: Gift,
      title: 'New Offer Available!',
      message: 'Domino\'s Pizza has a new 50% off deal near you',
      time: '2 min ago',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 2,
      type: 'expiring',
      icon: Clock,
      title: 'Offer Ending Soon',
      message: 'Your saved Zara offer expires in 2 hours',
      time: '15 min ago',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 3,
      type: 'review',
      icon: Star,
      title: 'Rate Your Experience',
      message: 'How was your visit to Lakme Salon?',
      time: '1 hour ago',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 4,
      type: 'location',
      icon: MapPin,
      title: 'New Store Nearby',
      message: 'Samsung Galaxy Store opened in your area',
      time: '3 hours ago',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 5,
      type: 'offer',
      icon: Gift,
      title: 'Weekend Special',
      message: 'Extra 20% off on all fashion items',
      time: '1 day ago',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-4 w-80 max-h-[70vh] bg-white rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {/* Notifications List */}
            <div className="overflow-y-auto max-h-96">
              {notifications.map((notification, index) => {
                const Icon = notification.icon;
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex space-x-3">
                      <div className={`w-10 h-10 ${notification.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${notification.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button className="w-full text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors">
                View All Notifications
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}