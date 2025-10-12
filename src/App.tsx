import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import AppNavigator from './components/AppNavigator';
import ErrorBoundary from './components/ErrorBoundary';
import { LikedOffersProvider } from './components/atoms/LikedOffersManager';
import { authService } from './utils/auth';

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

export default function App() {
  // Check authentication on mount
  const checkAuth = () => {
    if (authService.isSessionValid()) {
      const userData = authService.getUserData();
      if (userData) {
        return {
          screen: 'home' as Screen,
          phoneNumber: userData.phoneNumber,
          username: userData.username,
          email: userData.email || '',
        };
      }
    }
    return {
      screen: 'welcome' as Screen,
      phoneNumber: '',
      username: '',
      email: '',
    };
  };

  const initialAuth = checkAuth();

  const [currentScreen, setCurrentScreen] = useState<Screen>(initialAuth.screen);
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>([initialAuth.screen]);
  const [phoneNumber, setPhoneNumber] = useState(initialAuth.phoneNumber);
  const [username, setUsername] = useState(initialAuth.username);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [likedOffersCount, setLikedOffersCount] = useState<number>(0);
  const [email, setEmail] = useState<string>(initialAuth.email);
  const [screenData, setScreenData] = useState<any>(null);

  const handleLikeCountChange = useCallback((count: number) => {
    setLikedOffersCount(count);
  }, []);

  const navigateToScreen = useCallback((screen: Screen, data?: any) => {
    // Prevent navigation to the same screen
    if (screen === currentScreen) {
      return;
    }

    // Special handling for bottom navigation location
    const targetScreen = screen === 'location' ? 'nearbyAreas' : screen;
    
    // Update navigation history
    setNavigationHistory(prev => {
      const newHistory = prev[prev.length - 1] === targetScreen 
        ? prev 
        : [...prev, targetScreen];
      return newHistory;
    });
    
    // Update current screen
    setCurrentScreen(targetScreen);
    
    // Handle data updates
    if (data?.offer) setSelectedOffer(data.offer);
    if (data?.category) setSelectedCategory(data.category);
    if (data) setScreenData(data);
  }, [currentScreen]);

  const navigateBack = useCallback(() => {
    setNavigationHistory(prev => {
      if (prev.length > 1) {
        const newHistory = prev.slice(0, -1);
        const previousScreen = newHistory[newHistory.length - 1];
        setCurrentScreen(previousScreen);
        return newHistory;
      }
      return prev;
    });
  }, []);

  const handlePhoneComplete = useCallback((phone: string) => {
    setPhoneNumber(phone);
    navigateToScreen('otp');
  }, [navigateToScreen]);

  const handleUsernameComplete = useCallback((name: string) => {
    setUsername(name);
    navigateToScreen('categorySelection');
  }, [navigateToScreen]);

  const handleCategoriesComplete = useCallback((categories: string[]) => {
    setSelectedCategories(categories);
    navigateToScreen('locationSetup');
  }, [navigateToScreen]);

  const handleSaveProfile = useCallback((data: any) => {
    setUsername(data.username);
    setEmail(data.email);
    // Update auth data
    authService.updateUserData({ username: data.username, email: data.email });
    navigateToScreen('profile');
  }, [navigateToScreen]);

  return (
    <ErrorBoundary>
      <LikedOffersProvider onLikeCountChange={handleLikeCountChange}>
        <div className="h-screen w-full overflow-hidden bg-background">
          <AnimatePresence mode="wait" initial={false}>
            <AppNavigator
              currentScreen={currentScreen}
              phoneNumber={phoneNumber}
              username={username}
              selectedOffer={selectedOffer}
              likedOffersCount={likedOffersCount}
              email={email}
              screenData={screenData}
              pageTransition={{
                initial: { opacity: 0, x: 20 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -20 },
                transition: { duration: 0.15, ease: "easeOut" }
              }}
              onNavigate={navigateToScreen}
              onPhoneComplete={handlePhoneComplete}
              onUsernameComplete={handleUsernameComplete}
              onCategoriesComplete={handleCategoriesComplete}
              onLikeCountChange={handleLikeCountChange}
              onSaveProfile={handleSaveProfile}
              onNavigateBack={navigateBack}
            />
          </AnimatePresence>
        </div>
      </LikedOffersProvider>
    </ErrorBoundary>
  );
}