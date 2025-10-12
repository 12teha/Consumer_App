import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, MessageCircle, Send, Instagram, Facebook } from 'lucide-react';

interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  offer: any;
}

export default function SharePopup({ isOpen, onClose, offer }: SharePopupProps) {
  const shareOptions = [
    { name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500', action: () => window.open(`https://wa.me/?text=Check out this amazing offer: ${offer?.title}`) },
    { name: 'Telegram', icon: Send, color: 'bg-blue-500', action: () => window.open(`https://t.me/share/url?url=${window.location.href}`) },
    { name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500', action: () => alert('Instagram sharing coming soon!') },
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600', action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`) }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl p-6 w-full max-w-sm relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <Share2 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <h3 className="text-lg font-semibold">Share this offer</h3>
              <p className="text-gray-600 text-sm">{offer?.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <motion.button
                    key={option.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={option.action}
                    className={`${option.color} text-white p-4 rounded-xl flex flex-col items-center space-y-2 hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-sm font-medium">{option.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}