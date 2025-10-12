import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft, Edit2, MapPin, Heart, LogOut, HelpCircle,
  FileText, Phone, Mail, ChevronRight, User, Building2, MessageSquare
} from 'lucide-react';
import { Button } from './ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { authService } from '../utils/auth';

interface ProfileScreenProps {
  username: string;
  likedOffersCount: number;
  onBack: () => void;
  onNavigate: (screen: any) => void;
}

export default function ProfileScreen({ username, likedOffersCount, onBack, onNavigate }: ProfileScreenProps) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const profileStats = [
    { label: 'Liked Offers', value: likedOffersCount.toString(), color: 'text-red-600', action: () => onNavigate('likedOffers') },
    { label: 'Wishlist Items', value: '8', color: 'text-purple-600', action: () => onNavigate('wishlist') },
  ];

  const menuItems = [
    {
      id: 'profile',
      icon: User,
      title: 'Profile Details',
      subtitle: 'Edit your personal information',
      action: () => onNavigate('profileDetails')
    },
    {
      id: 'location',
      icon: MapPin,
      title: 'Location',
      subtitle: 'Manage your saved locations',
      action: () => onNavigate('location')
    },
    {
      id: 'wishlist',
      icon: Heart,
      title: 'Wishlist',
      subtitle: 'View your saved offers',
      action: () => onNavigate('wishlist')
    },
    {
      id: 'faq',
      icon: HelpCircle,
      title: 'FAQ',
      subtitle: 'Frequently asked questions',
      action: () => onNavigate('faq')
    },
    {
      id: 'terms',
      icon: FileText,
      title: 'Terms & Conditions',
      subtitle: 'Read our terms of service',
      action: () => onNavigate('terms')
    },
    {
      id: 'business',
      icon: Building2,
      title: 'Become a Business Partner',
      subtitle: 'Join our business portal',
      action: () => onNavigate('business')
    },
    {
      id: 'feedback',
      icon: MessageSquare,
      title: 'Feedback',
      subtitle: 'Share your experience with us',
      action: () => onNavigate('feedback')
    },
  ];

  const supportInfo = [
    {
      type: 'email',
      label: 'Email Support',
      value: 'support@offerbeez.in',
      icon: Mail,
      action: () => window.open('mailto:support@offerbeez.in')
    },
    {
      type: 'phone',
      label: 'Phone Support',
      value: '+91 8748990815',
      icon: Phone,
      action: () => window.open('tel:+918748990815')
    }
  ];

  const handleLogout = () => {
    setShowLogoutDialog(false);
    // Clear authentication session
    authService.clearAuth();
    // Navigate to welcome screen
    onNavigate('welcome');
  };

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
        <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
        <div className="w-6" /> {/* Spacer */}
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl font-bold text-white">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{username}</h2>
              <p className="text-white/80">OfferBeez Member</p>
              <button className="flex items-center space-x-1 mt-1 text-white/90 hover:text-white">
                <Edit2 className="w-4 h-4" />
                <span className="text-sm">Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {profileStats.map((stat, index) => (
              <motion.button
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={stat.action}
                className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/30 transition-colors"
              >
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-white/80">{stat.label}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white mt-4 mx-4 rounded-xl shadow-sm overflow-hidden"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white mt-4 mx-4 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Support</h3>
          </div>
          
          {supportInfo.map((support, index) => {
            const Icon = support.icon;
            return (
              <motion.button
                key={support.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={support.action}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">{support.label}</h3>
                    <p className="text-sm text-blue-600">{support.value}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Logout Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 mx-4 mb-6"
        >
          <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to logout from your OfferBeez account?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>No, Stay Logged In</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                  Yes, Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>

        {/* App Version */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-400 text-sm pb-6"
        >
          OfferBeez v1.0.0
        </motion.div>
      </div>
    </div>
  );
}