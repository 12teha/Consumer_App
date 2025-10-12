import React, { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import PermissionPopup from './PermissionPopup';
import WelcomeScreen from './WelcomeScreen';
import PhoneEntryScreen from './PhoneEntryScreen';
import OTPVerificationScreen from './OTPVerificationScreen';
import AlmostDoneScreen from './AlmostDoneScreen';
import LocationManager from './LocationManager';
import CategorySelectionScreen from './CategorySelectionScreen';
import HomeScreen from './HomeScreen';
import OfferDetailsScreen from './OfferDetailsScreen';
import ProfileScreen from './ProfileScreen';
import LocationScreen from './LocationScreen';
import LikedOffersScreen from './LikedOffersScreen';
import ProfileDetailsForm from './molecules/ProfileDetailsForm';
import AllOffersScreen from './AllOffersScreen';
import NearbyAreasScreen from './NearbyAreasScreen';

type Screen =
  | 'permission'
  | 'welcome'
  | 'phone'
  | 'otp'
  | 'almostDone'
  | 'locationSetup'
  | 'categorySelection'
  | 'home'
  | 'offerDetails'
  | 'profile'
  | 'profileDetails'
  | 'location'
  | 'likedOffers'
  | 'allOffers'
  | 'nearbyAreas';

interface AppNavigatorProps {
  currentScreen: Screen;
  phoneNumber: string;
  username: string;
  selectedOffer: any;
  likedOffersCount: number;
  email: string;
  screenData: any;
  pageTransition: any;
  onNavigate: (screen: Screen, data?: any) => void;
  onPhoneComplete: (phone: string) => void;
  onUsernameComplete: (name: string) => void;
  onCategoriesComplete: (categories: string[]) => void;
  onLikeCountChange: (count: number) => void;
  onSaveProfile: (data: any) => void;
  onNavigateBack: () => void;
}

const AppNavigator = memo(function AppNavigator({
  currentScreen,
  phoneNumber,
  username,
  selectedOffer,
  likedOffersCount,
  email,
  screenData,
  pageTransition,
  onNavigate,
  onPhoneComplete,
  onUsernameComplete,
  onCategoriesComplete,
  onLikeCountChange,
  onSaveProfile,
  onNavigateBack
}: AppNavigatorProps) {
  
  // Memoize the screen component to prevent unnecessary re-creation
  const screenComponent = useMemo(() => {
    try {
      switch (currentScreen) {
        case 'permission':
          return <PermissionPopup onComplete={() => onNavigate('welcome')} />;
        
        case 'welcome':
          return <WelcomeScreen onComplete={() => onNavigate('phone')} />;
        
        case 'phone':
          return <PhoneEntryScreen onComplete={onPhoneComplete} />;
        
        case 'otp':
          return <OTPVerificationScreen phoneNumber={phoneNumber} onComplete={() => onNavigate('almostDone')} />;
        
        case 'almostDone':
          return <AlmostDoneScreen onComplete={onUsernameComplete} />;

        case 'locationSetup':
          return (
            <LocationManager
              onLocationSet={() => onNavigate('home')}
              onSkip={() => onNavigate('home')}
              showSkip={true}
            />
          );

        case 'categorySelection':
          return <CategorySelectionScreen onComplete={onCategoriesComplete} onBack={onNavigateBack} onNavigate={onNavigate} />;
        
        case 'home':
          return (
            <HomeScreen 
              username={username}
              selectedCategory="All"
              onNavigate={onNavigate}
              onLikeCountChange={onLikeCountChange}
            />
          );
        
        case 'offerDetails':
          return <OfferDetailsScreen offer={selectedOffer} onBack={onNavigateBack} />;
        
        case 'profile':
          return (
            <ProfileScreen 
              username={username}
              likedOffersCount={likedOffersCount}
              onBack={onNavigateBack}
              onNavigate={onNavigate}
            />
          );
        
        case 'profileDetails':
          return (
            <ProfileDetailsForm 
              initialData={{
                username,
                email: email || `${username.toLowerCase().replace(' ', '.')}@example.com`,
                phone: phoneNumber
              }}
              onBack={onNavigateBack}
              onSave={onSaveProfile}
            />
          );
        
        case 'location':
          return <LocationScreen onBack={onNavigateBack} onNavigate={onNavigate} />;
        
        case 'likedOffers':
          return (
            <LikedOffersScreen
              onBack={onNavigateBack}
              onViewDetails={(offer) => onNavigate('offerDetails', { offer })}
              onNavigate={onNavigate}
            />
          );
        
        case 'allOffers':
          return (
            <AllOffersScreen 
              title={screenData?.title || 'All Offers'}
              offers={screenData?.offers || []}
              onBack={onNavigateBack}
              onOfferClick={(offer) => onNavigate('offerDetails', { offer })}
              onLikeCountChange={onLikeCountChange}
              onNavigate={onNavigate}
            />
          );
        
        case 'nearbyAreas':
          return (
            <NearbyAreasScreen
              onBack={onNavigateBack}
              onOfferClick={(offer) => onNavigate('offerDetails', { offer })}
              onLikeCountChange={onLikeCountChange}
              onNavigate={onNavigate}
            />
          );
        
        default:
          return <PermissionPopup onComplete={() => onNavigate('welcome')} />;
      }
    } catch (error) {
      console.error('Error rendering screen:', error);
      return (
        <div className="h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <p className="text-foreground mb-4">Error loading screen</p>
            <button 
              onClick={() => onNavigate('home')}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }
  }, [
    currentScreen,
    phoneNumber,
    username,
    selectedOffer,
    likedOffersCount,
    email,
    screenData,
    onNavigate,
    onPhoneComplete,
    onUsernameComplete,
    onCategoriesComplete,
    onLikeCountChange,
    onSaveProfile,
    onNavigateBack
  ]);

  return (
    <motion.div {...pageTransition}>
      {screenComponent}
    </motion.div>
  );
});

export default AppNavigator;