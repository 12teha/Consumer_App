import React from 'react';
import { X, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ContactUsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactUsPopup: React.FC<ContactUsPopupProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl z-50 p-6"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Us</h2>
              <p className="text-gray-600 mb-6">
                We'd love to hear from you! Reach out anytime.
              </p>

              {/* Email */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-gray-900">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <a
                    href="mailto:support@offerbeez.in"
                    className="text-lg font-medium hover:text-purple-600 transition-colors"
                  >
                    support@offerbeez.in
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-gray-900 mb-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  <a
                    href="tel:+919008522366"
                    className="text-lg font-medium hover:text-green-600 transition-colors"
                  >
                    +91 9008522366
                  </a>
                </div>
                <p className="text-xs text-gray-500">
                  Monday to Sunday – 9:00 AM to 7:00 PM (GMT)
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactUsPopup;
