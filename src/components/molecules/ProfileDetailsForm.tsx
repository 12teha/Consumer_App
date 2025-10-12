import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, User, Mail, Phone } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ProfileDetailsFormProps {
  initialData: {
    username: string;
    email: string;
    phone: string;
  };
  onBack: () => void;
  onSave: (data: any) => void;
}

export default function ProfileDetailsForm({ initialData, onBack, onSave }: ProfileDetailsFormProps) {
  const [formData, setFormData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSave(formData);
    setIsLoading(false);
  };

  const isFormValid = formData.username.trim().length >= 2 && 
                     formData.email.includes('@') && 
                     formData.phone.length === 10;

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white px-4 py-3 shadow-sm flex items-center justify-between"
      >
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Profile Details</h1>
        <div className="w-8" /> {/* Spacer */}
      </motion.div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 space-y-6"
        >
          {/* Avatar Section */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">
                {formData.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <button className="text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors">
              Change Avatar
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter your full name"
                className="w-full"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email address"
                className="w-full"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                  <span className="text-lg">🇮🇳</span>
                  <span className="font-medium text-gray-700">+91</span>
                </div>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, phone: value });
                  }}
                  placeholder="Phone number"
                  className="flex-1"
                  maxLength={10}
                  readOnly
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Phone number cannot be changed. Contact support if needed.
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Account Information</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• Member since: December 2024</p>
              <p>• Verification status: Verified</p>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={!isFormValid || isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>

          {/* Form Validation */}
          {!isFormValid && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-sm text-red-600 space-y-1"
            >
              {formData.username.trim().length < 2 && <p>• Name must be at least 2 characters</p>}
              {!formData.email.includes('@') && <p>• Please enter a valid email address</p>}
              {formData.phone.length !== 10 && <p>• Phone number must be 10 digits</p>}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}