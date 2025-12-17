// import React, { memo, useMemo } from "react";
// import { motion } from "motion/react";
// import PermissionPopup from "./PermissionPopup";
// import WelcomeScreen from "./WelcomeScreen";
// import PhoneEntryScreen from "./PhoneEntryScreen";
// import OTPVerificationScreen from "./OTPVerificationScreen";
// import AlmostDoneScreen from "./AlmostDoneScreen";
// import LocationManager from "./LocationManager";
// import CategorySelectionScreen from "./CategorySelectionScreen";
// import HomeScreen from "./HomeScreen";
// import OfferDetailsScreen from "./OfferDetailsScreen";
// import ProfileScreen from "./ProfileScreen";
// import LocationScreen from "./LocationScreen";
// import LikedOffersScreen from "./LikedOffersScreen";
// import ProfileDetailsForm from "./molecules/ProfileDetailsForm";
// import AllOffersScreen from "./AllOffersScreen";
// import NearbyAreasScreen from "./NearbyAreasScreen";
// import FAQScreen from "./FAQScreen";
// import TermsConditionsScreen from "./TermsConditionsScreen";
// import BrowseCategoriesScreen from "./BrowseCategoriesScreen";
// import BusinessListScreen from "./BusinessListScreen";

// type Screen =
//   | "permission"
//   | "welcome"
//   | "phone"
//   | "otp"
//   | "almostDone"
//   | "locationSetup"
//   | "categorySelection"
//   | "home"
//   | "offerDetails"
//   | "profile"
//   | "profileDetails"
//   | "location"
//   | "likedOffers"
//   | "allOffers"
//   | "faq"
//   | "terms"
//   | "nearbyAreas"
//   | "browseCategories"
//   | "businessList"
//   | "allBusinesses";

// interface AppNavigatorProps {
//   currentScreen: Screen;
//   phoneNumber: string;
//   username: string;
//   selectedOffer: any;
//   likedOffersCount: number;
//   email: string;
//   screenData: any;
//   pageTransition: any;
//   onNavigate: (screen: Screen, data?: any) => void;
//   onPhoneComplete: (phone: string) => void;
//   onUsernameComplete: (name: string) => void;
//   onCategoriesComplete: (categories: string[]) => void;
//   onLikeCountChange: (count: number) => void;
//   onSaveProfile: (data: any) => void;
//   onNavigateBack: () => void;
// }

// const AppNavigator = memo(function AppNavigator({
//   currentScreen,
//   phoneNumber,
//   username,
//   selectedOffer,
//   likedOffersCount,
//   email,
//   screenData,
//   pageTransition,
//   onNavigate,
//   onPhoneComplete,
//   onUsernameComplete,
//   onCategoriesComplete,
//   onLikeCountChange,
//   onSaveProfile,
//   onNavigateBack,
// }: AppNavigatorProps) {
//   // Handle back navigation specifically for offer details to always go to home
//   const handleOfferDetailsBack = () => {
//     onNavigate("home");
//   };

//   // Handle back navigation for AllOffersScreen to always go to home
//   const handleAllOffersBack = () => {
//     onNavigate("home");
//   };

//   // Memoize the screen component to prevent unnecessary re-creation
//   const screenComponent = useMemo(() => {
//     try {
//       switch (currentScreen) {
//         case "permission":
//           return <PermissionPopup onComplete={() => onNavigate("welcome")} />;

//         case "welcome":
//           return <WelcomeScreen onComplete={() => onNavigate("phone")} />;

//         case "phone":
//           return <PhoneEntryScreen onComplete={onPhoneComplete} />;

//         case "otp":
//           return (
//             <OTPVerificationScreen
//               phoneNumber={phoneNumber}
//               onComplete={() => onNavigate("almostDone")}
//             />
//           );

//         case "almostDone":
//           return <AlmostDoneScreen onComplete={onUsernameComplete} />;

//         case "faq":
//           return <FAQScreen onBack={onNavigateBack} />;

//         case "terms":
//           return <TermsConditionsScreen onBack={onNavigateBack} initialSection={screenData?.initialSection} />;

//         case "locationSetup":
//           return (
//             <LocationManager
//               onLocationSet={() => onNavigate("home")}
//               onSkip={() => onNavigate("home")}
//               showSkip={true}
//             />
//           );

//         case "categorySelection":
//           return (
//             <CategorySelectionScreen
//               onComplete={onCategoriesComplete}
//               onBack={onNavigateBack}
//               onNavigate={onNavigate}
//             />
//           );

//         case "home":
//           return (
//             <HomeScreen
//               username={username}
//               selectedCategory={screenData?.category || "All"}
//               onNavigate={onNavigate}
//               onLikeCountChange={onLikeCountChange}
//             />
//           );

//         case "offerDetails":
//           return (
//             <OfferDetailsScreen
//               offer={selectedOffer}
//               onBack={handleOfferDetailsBack}
//             />
//           );

//         case "profile":
//           return (
//             <ProfileScreen
//               username={username}
//               likedOffersCount={likedOffersCount}
//               onBack={onNavigateBack}
//               onNavigate={onNavigate}
//             />
//           );

//         case "profileDetails":
//           return (
//             <ProfileDetailsForm
//               initialData={{
//                 username,
//                 email:
//                   email ||
//                   `${username.toLowerCase().replace(" ", ".")}@example.com`,
//                 phone: phoneNumber,
//               }}
//               onBack={onNavigateBack}
//               onSave={onSaveProfile}
//             />
//           );

//         case "location":
//           return (
//             <LocationScreen onBack={onNavigateBack} onNavigate={onNavigate} />
//           );

//         case "likedOffers":
//           return (
//             <LikedOffersScreen
//               onBack={onNavigateBack}
//               onViewDetails={(offer) => onNavigate("offerDetails", { offer })}
//               onNavigate={onNavigate}
//             />
//           );

//         case "allOffers":
//           return (
//             <AllOffersScreen
//               title={screenData?.title || "All Offers"}
//               offers={screenData?.offers || []}
//               onBack={handleAllOffersBack}
//               onOfferClick={(offer) => onNavigate("offerDetails", { offer })}
//               onLikeCountChange={onLikeCountChange}
//               onNavigate={onNavigate}
//             />
//           );

//         case "nearbyAreas":
//           return (
//             <NearbyAreasScreen
//               onBack={onNavigateBack}
//               onOfferClick={(offer) => onNavigate("offerDetails", { offer })}
//               onLikeCountChange={onLikeCountChange}
//               onNavigate={onNavigate}
//             />
//           );

//         case "browseCategories":
//           return (
//             <BrowseCategoriesScreen
//               onBack={onNavigateBack}
//               onCategorySelect={(category) => onNavigate("businessList", {
//                 category,
//                 radius: screenData?.radius || 10,
//                 userLocation: screenData?.userLocation
//               })}
//             />
//           );

//         case "businessList":
//           return (
//             <BusinessListScreen
//               category={screenData?.category || "All"}
//               radius={screenData?.radius || 10}
//               userLocation={screenData?.userLocation}
//               onBack={onNavigateBack}
//               onBusinessSelect={(businessId) => {
//                 // Navigate to business details or offers
//                 console.log("Business selected:", businessId);
//                 // TODO: Add business details screen navigation
//               }}
//             />
//           );

//         case "allBusinesses":
//           return (
//             <BusinessListScreen
//               category="All"
//               radius={screenData?.radius || 10}
//               userLocation={screenData?.userLocation}
//               onBack={onNavigateBack}
//               onBusinessSelect={(businessId) => {
//                 // Navigate to business details or offers
//                 console.log("Business selected:", businessId);
//                 // TODO: Add business details screen navigation
//               }}
//             />
//           );

//         default:
//           return <PermissionPopup onComplete={() => onNavigate("welcome")} />;
//       }
//     } catch (error) {
//       console.error("Error rendering screen:", error);
//       return (
//         <div className="h-screen flex items-center justify-center bg-background">
//           <div className="text-center">
//             <p className="text-foreground mb-4">Error loading screen</p>
//             <button
//               onClick={() => onNavigate("home")}
//               className="px-4 py-2 bg-purple-600 text-white rounded-lg"
//             >
//               Go to Home
//             </button>
//           </div>
//         </div>
//       );
//     }
//   }, [
//     currentScreen,
//     phoneNumber,
//     username,
//     selectedOffer,
//     likedOffersCount,
//     email,
//     screenData,
//     onNavigate,
//     onPhoneComplete,
//     onUsernameComplete,
//     onCategoriesComplete,
//     onLikeCountChange,
//     onSaveProfile,
//     onNavigateBack,
//   ]);

//   return <motion.div {...pageTransition}>{screenComponent}</motion.div>;
// });

// export default AppNavigator;

/////////////

"use client";

import React, { memo, useMemo } from "react";
import { motion } from "motion/react";

import PermissionPopup from "./PermissionPopup";
import WelcomeScreen from "./WelcomeScreen";
import PhoneEntryScreen from "./PhoneEntryScreen";
import OTPVerificationScreen from "./OTPVerificationScreen";
import AlmostDoneScreen from "./AlmostDoneScreen";
import LocationManager from "./LocationManager";
import CategorySelectionScreen from "./CategorySelectionScreen";
import HomeScreen from "./HomeScreen";
import OfferDetailsScreen from "./OfferDetailsScreen";
import ProfileScreen from "./ProfileScreen";
import LocationScreen from "./LocationScreen";
import LikedOffersScreen from "./LikedOffersScreen";
import ProfileDetailsForm from "./molecules/ProfileDetailsForm";
import AllOffersScreen from "./AllOffersScreen";
import NearbyAreasScreen from "./NearbyAreasScreen";
import FAQScreen from "./FAQScreen";
import TermsConditionsScreen from "./TermsConditionsScreen";
import BrowseCategoriesScreen from "./BrowseCategoriesScreen";
import BusinessListScreen from "./BusinessListScreen";
import DiscountedOffersScreen from "./DiscountedOffersScreen";
import FlatOffersScreen from "./FlatOffersScreen";
import ExchangeOffersScreen from "./ExchangeOffersScreen";
import UpTo50OffersScreen from "./UpTo50OffersScreen";
import ListingsScreen from "./ListingsScreen";
import OffersListScreen from "./OfferlistScreen";

type Screen =
  | "permission"
  | "welcome"
  | "phone"
  | "otp"
  | "almostDone"
  | "locationSetup"
  | "categorySelection"
  | "home"
  | "offerDetails"
  | "profile"
  | "profileDetails"
  | "location"
  | "likedOffers"
  | "allOffers"
  | "faq"
  | "terms"
  | "nearbyAreas"
  | "browseCategories"
  | "businessList"
  | "allBusinesses"
  | "discountedOffers"
  | "flatOffers"
  | "exchangeOffers"
  | "upTo50Offers"
  | "storeListing"
  | "offersList";

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
  onNavigateBack,
}: AppNavigatorProps) {
  const handleOfferDetailsBack = () => onNavigate("home");
  const handleAllOffersBack = () => onNavigate("home");
  const handleOTPBack = () => onNavigate("phone");
  const handleAlmostDoneBack = () => onNavigate("otp");
  const handleCategorySelectionBack = () => onNavigate("locationSetup");

  // Handlers for specialized offer screens back navigation
  const handleDiscountedOffersBack = () => onNavigate("home");
  const handleFlatOffersBack = () => onNavigate("home");
  const handleExchangeOffersBack = () => onNavigate("home");
  const handleUpTo50OffersBack = () => onNavigate("home");

  const screenComponent = useMemo(() => {
    try {
      switch (currentScreen) {
        case "permission":
          return <PermissionPopup onComplete={() => onNavigate("welcome")} />;

        case "welcome":
          return (
            <WelcomeScreen
              onComplete={() => onNavigate("phone")}
              onBack={onNavigateBack}
            />
          );

        case "phone":
          return (
            <PhoneEntryScreen
              onComplete={onPhoneComplete}
              onBack={onNavigateBack}
            />
          );

        case "otp":
          return (
            <OTPVerificationScreen
              phoneNumber={phoneNumber}
              onComplete={() => onNavigate("almostDone")}
              onBack={handleOTPBack}
            />
          );

        case "almostDone":
          return (
            <AlmostDoneScreen
              onComplete={onUsernameComplete}
              onBack={handleAlmostDoneBack}
            />
          );

        case "faq":
          return <FAQScreen onBack={onNavigateBack} />;

        case "terms":
          return (
            <TermsConditionsScreen
              onBack={onNavigateBack}
              initialSection={screenData?.initialSection}
            />
          );

        case "locationSetup":
          return (
            <LocationManager
              onLocationSet={() => onNavigate("categorySelection")}
              onSkip={() => onNavigate("categorySelection")}
              showSkip={true}
              onBack={onNavigateBack}
            />
          );

        case "categorySelection":
          return (
            <CategorySelectionScreen
              onComplete={onCategoriesComplete}
              onBack={handleCategorySelectionBack}
              onNavigate={onNavigate}
            />
          );

        case "home":
          return (
            <HomeScreen
              username={username}
              selectedCategory={screenData?.category || "All"}
              onNavigate={onNavigate}
              onLikeCountChange={onLikeCountChange}
            />
          );

        case "offerDetails":
          return (
            <OfferDetailsScreen
              offer={selectedOffer}
              onBack={handleOfferDetailsBack}
            />
          );

        case "profile":
          return (
            <ProfileScreen
              username={username}
              likedOffersCount={likedOffersCount}
              onBack={onNavigateBack}
              onNavigate={onNavigate}
            />
          );

        case "profileDetails":
          return (
            <ProfileDetailsForm
              initialData={{
                username,
                email:
                  email ||
                  `${username.toLowerCase().replace(" ", ".")}@example.com`,
                phone: phoneNumber,
              }}
              onBack={onNavigateBack}
              onSave={onSaveProfile}
            />
          );

        case "location":
          return (
            <LocationScreen onBack={onNavigateBack} onNavigate={onNavigate} />
          );

        case "likedOffers":
          return (
            <LikedOffersScreen
              onBack={onNavigateBack}
              onViewDetails={(offer) => onNavigate("offerDetails", { offer })}
              onNavigate={onNavigate}
            />
          );

        case "allOffers":
          return (
            <AllOffersScreen
              title={screenData?.title || "All Offers"}
              offers={screenData?.offers || []}
              onBack={handleAllOffersBack}
              onOfferClick={(offer) => onNavigate("offerDetails", { offer })}
              onLikeCountChange={onLikeCountChange}
              onNavigate={onNavigate}
            />
          );

        case "nearbyAreas":
          return (
            <NearbyAreasScreen
              onBack={onNavigateBack}
              onOfferClick={(offer) => onNavigate("offerDetails", { offer })}
              onLikeCountChange={onLikeCountChange}
              onNavigate={onNavigate}
            />
          );

        case "browseCategories":
          return (
            <BrowseCategoriesScreen
              onBack={onNavigateBack}
              onCategorySelect={(category) =>
                onNavigate("businessList", {
                  category,
                  radius: screenData?.radius || 10,
                  userLocation: screenData?.userLocation,
                })
              }
            />
          );

        case "businessList":
          return (
            <BusinessListScreen
              category={screenData?.category || "All"}
              radius={screenData?.radius || 10}
              userLocation={screenData?.userLocation}
              onBack={onNavigateBack}
              onBusinessSelect={(id) => console.log("Business selected:", id)}
            />
          );

        case "allBusinesses":
          return (
            <BusinessListScreen
              category="All"
              radius={screenData?.radius || 10}
              userLocation={screenData?.userLocation}
              onBack={onNavigateBack}
              onBusinessSelect={(id) => console.log("Business:", id)}
            />
          );

        case "discountedOffers":
          return (
            <DiscountedOffersScreen
              onNavigate={onNavigate}
              onBack={handleDiscountedOffersBack}
              username={username}
            />
          );

        case "flatOffers":
          return (
            <FlatOffersScreen
              onNavigate={onNavigate}
              onBack={handleFlatOffersBack}
              username={username}
            />
          );

        case "exchangeOffers":
          return (
            <ExchangeOffersScreen
              onNavigate={onNavigate}
              onBack={handleExchangeOffersBack}
              username={username}
            />
          );

        case "upTo50Offers":
          return (
            <UpTo50OffersScreen
              onNavigate={onNavigate}
              onBack={handleUpTo50OffersBack}
              username={username}
            />
          );

        case "storeListing":
          return <ListingsScreen onNavigate={onNavigate} />;

        case "offersList":
          return (
            <OffersListScreen
              title={screenData?.title || "All Offers"}
              offerType={screenData?.offerType || null}
              category={screenData?.category || null}
              onBack={() => onNavigate("home")}
              onOfferClick={(offer) => onNavigate("offerDetails", { offer })}
            />
          );

        default:
          return <PermissionPopup onComplete={() => onNavigate("welcome")} />;
      }
    } catch (error) {
      console.error("Screen error:", error);
      return (
        <div className="h-screen flex items-center justify-center">
          <p>Error loading screen</p>
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
    onNavigateBack,
  ]);

  return <motion.div {...pageTransition}>{screenComponent}</motion.div>;
});

export default AppNavigator;
