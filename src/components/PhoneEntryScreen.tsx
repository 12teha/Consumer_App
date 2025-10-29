// import React, { useState, useEffect } from 'react';
// import { motion } from 'motion/react';
// import { ArrowRight, Phone } from 'lucide-react';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { ImageWithFallback } from './figma/ImageWithFallback';
// import { apiService } from '../services/api';
// // Using placeholder images for street shopping scenes

// interface PhoneEntryScreenProps {
//   onComplete: (phoneNumber: string) => void;
// }

// export default function PhoneEntryScreen({ onComplete }: PhoneEntryScreenProps) {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [backgroundIndex, setBackgroundIndex] = useState(0);

//   // Street shopping images with people walking to stores
//   const backgroundImages = [
//     'https://images.unsplash.com/photo-1673168551699-1f0fcbb98637?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBzaG9wcGluZyUyMHBlb3BsZSUyMHdhbGtpbmclMjBzdG9yZXN8ZW58MXx8fHwxNzU3Nzg1NDE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
//     'https://images.unsplash.com/photo-1661260178494-48ed9714c77c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2hvcHBpbmclMjBtYWxsJTIwcGVvcGxlfGVufDF8fHx8MTc1Nzc4NTQyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
//     'https://images.unsplash.com/photo-1564294911555-3ded7632b7de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBzaG9wcGluZyUyMGRpc3RyaWN0JTIwcGVkZXN0cmlhbnN8ZW58MXx8fHwxNzU3Nzg1NDI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
//     'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5ZWFyJTIwc2FsZSUyMGJhbm5lcnxlbnwxfHx8fDE3NTc3NDgwODJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setBackgroundIndex((prev) => (prev + 1) % backgroundImages.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleSubmit = async () => {
//     if (phoneNumber.length === 10) {
//       setIsLoading(true);
//       try {
//         await apiService.getOTP(phoneNumber);
//         onComplete(phoneNumber);
//       } catch (error) {
//         console.error('Error sending OTP:', error);
//         alert('Failed to send OTP. Please try again.');
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const isValidPhone = phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);

//   return (
//     <div className="h-screen relative overflow-hidden">
//       {/* Rotating Background Images */}
//       <div className="absolute inset-0">
//         {backgroundImages.map((image, index) => (
//           <motion.div
//             key={index}
//             className="absolute inset-0"
//             initial={{ opacity: 0, scale: 1.1 }}
//             animate={{ 
//               opacity: backgroundIndex === index ? 1 : 0,
//               scale: backgroundIndex === index ? 1 : 1.1
//             }}
//             transition={{ duration: 2, ease: "easeInOut" }}
//           >
//             <ImageWithFallback
//               src={image}
//               alt="Street shopping"
//               className="w-full h-full object-cover"
//             />
//           </motion.div>
//         ))}
        
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        
//         {/* Animated Shopping Icons */}
//         <div className="absolute inset-0 overflow-hidden">
//           {['🛍️', '🏪', '👥', '🚶‍♀️', '🚶‍♂️', '🛒'].map((icon, i) => (
//             <motion.div
//               key={i}
//               className="absolute text-4xl opacity-20"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//               }}
//               animate={{
//                 y: [-20, -100, -20],
//                 opacity: [0.1, 0.3, 0.1],
//                 rotate: [0, 10, -10, 0],
//               }}
//               transition={{
//                 duration: 8 + Math.random() * 4,
//                 repeat: Infinity,
//                 delay: Math.random() * 3,
//               }}
//             >
//               {icon}
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Content */}
//       <div className="relative z-10 h-full flex flex-col justify-center p-8">
//         <motion.div
//           initial={{ opacity: 0, y: 100 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mx-auto w-full max-w-sm"
//         >
//           {/* Icon */}
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ delay: 0.3, type: "spring", damping: 15 }}
//             className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
//           >
//             <Phone className="w-8 h-8 text-white" />
//           </motion.div>

//           {/* Title */}
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             className="text-2xl font-bold text-center text-gray-900 mb-2"
//           >
//             Enter Your Mobile Number
//           </motion.h2>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6 }}
//             className="text-gray-600 text-center mb-8"
//           >
//             We'll send you a verification code
//           </motion.p>

//           {/* Phone Input */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.7 }}
//             className="space-y-4"
//           >
//             <div className="flex items-center space-x-3">
//               <div className="flex items-center space-x-2 bg-gray-100 px-3 py-3 rounded-lg">
//                 <span className="text-lg">🇮🇳</span>
//                 <span className="font-medium text-gray-700">+91</span>
//               </div>
//               <Input
//                 type="tel"
//                 value={phoneNumber}
//                 onChange={(e) => {
//                   const value = e.target.value.replace(/\D/g, '').slice(0, 10);
//                   setPhoneNumber(value);
//                 }}
//                 placeholder="Enter mobile number"
//                 className="flex-1 text-lg"
//                 maxLength={10}
//               />
//             </div>

//             {/* Validation Message */}
//             {phoneNumber.length > 0 && !isValidPhone && (
//               <motion.p
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 className="text-red-500 text-sm"
//               >
//                 Please enter a valid 10-digit mobile number
//               </motion.p>
//             )}

//             {/* Continue Button */}
//             <Button
//               onClick={handleSubmit}
//               disabled={!isValidPhone || isLoading}
//               className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
//             >
//               {isLoading ? (
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                   className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
//                 />
//               ) : (
//                 <>
//                   <span>Continue</span>
//                   <ArrowRight className="w-5 h-5" />
//                 </>
//               )}
//             </Button>
//           </motion.div>

//           {/* Terms */}
//           {/* <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1 }}
//             className="text-xs text-gray-500 text-center mt-4"
//           >
//             By continuing, you agree to our Terms of Service and Privacy Policy
//           </motion.p>
//         </motion.div> */}

//               <motion.p
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 1 }}
//         className="text-xs text-gray-500 text-center mt-4"
//       >
//         By continuing, you agree to our{' '}
//         <a 
//           href="/terms" 
//           className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
//           onClick={(e) => e.stopPropagation()}
//         >
//           Terms of Service
//         </a>{''}
//         and{' '}
//         <a 
//           href="/privacy" 
//           className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
//           onClick={(e) => e.stopPropagation()}
//         >
//           Privacy Policy
//         </a>
//       </motion.p>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import { motion } from 'motion/react';
// import { ArrowRight, Phone } from 'lucide-react';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { ImageWithFallback } from './figma/ImageWithFallback';
// import { apiService } from '../services/api';

// interface PhoneEntryScreenProps {
//   onComplete: (phoneNumber: string) => void;
// }

// export default function PhoneEntryScreen({ onComplete }: PhoneEntryScreenProps) {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [backgroundIndex, setBackgroundIndex] = useState(0);

//   const backgroundImages = [
//     'https://images.unsplash.com/photo-1673168551699-1f0fcbb98637?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBzaG9wcGluZyUyMHBlb3BsZSUyMHdhbGtpbmclMjBzdG9yZXN8ZW58MXx8fHwxNzU3Nzg1NDE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
//     'https://images.unsplash.com/photo-1661260178494-48ed9714c77c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2hvcHBpbmclMjBtYWxsJTIwcGVvcGxlfGVufDF8fHx8MTc1Nzc4NTQyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
//     'https://images.unsplash.com/photo-1564294911555-3ded7632b7de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBzaG9wcGluZyUyMGRpc3RyaWN0JTIwcGVkZXN0cmlhbnN8ZW58MXx8fHwxNzU3Nzg1NDI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
//     'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5ZWFyJTIwc2FsZSUyMGJhbm5lcnxlbnwxfHx8fDE3NTc3NDgwODJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setBackgroundIndex((prev) => (prev + 1) % backgroundImages.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleSubmit = async () => {
//     if (phoneNumber.length === 10) {
//       setIsLoading(true);
//       try {
//         await apiService.getOTP(phoneNumber);
//         onComplete(phoneNumber);
//       } catch (error) {
//         console.error('Error sending OTP:', error);
//         alert('Failed to send OTP. Please try again.');
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const isValidPhone = phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);

//   return (
//     <div className="h-screen relative overflow-hidden">
//       {/* Rotating Background Images */}
//       <div className="absolute inset-0">
//         {backgroundImages.map((image, index) => (
//           <motion.div
//             key={index}
//             className="absolute inset-0"
//             initial={{ opacity: 0, scale: 1.1 }}
//             animate={{ 
//               opacity: backgroundIndex === index ? 1 : 0,
//               scale: backgroundIndex === index ? 1 : 1.1
//             }}
//             transition={{ duration: 2, ease: "easeInOut" }}
//           >
//             <ImageWithFallback
//               src={image}
//               alt="Street shopping"
//               className="w-full h-full object-cover"
//             />
//           </motion.div>
//         ))}
        
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        
//         {/* Animated Shopping Icons */}
//         <div className="absolute inset-0 overflow-hidden">
//           {['🛍️', '🏪', '👥', '🚶‍♀️', '🚶‍♂️', '🛒'].map((icon, i) => (
//             <motion.div
//               key={i}
//               className="absolute text-4xl opacity-20"
//               style={{
//                 left: `${Math.random() * 100}%`,
//                 top: `${Math.random() * 100}%`,
//               }}
//               animate={{
//                 y: [-20, -100, -20],
//                 opacity: [0.1, 0.3, 0.1],
//                 rotate: [0, 10, -10, 0],
//               }}
//               transition={{
//                 duration: 8 + Math.random() * 4,
//                 repeat: Infinity,
//                 delay: Math.random() * 3,
//               }}
//             >
//               {icon}
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* Content */}
//       <div className="relative z-10 h-full flex flex-col justify-center p-8">
//         <motion.div
//           initial={{ opacity: 0, y: 100 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mx-auto w-full max-w-sm"
//         >
//           {/* Icon */}
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ delay: 0.3, type: "spring", damping: 15 }}
//             className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
//           >
//             <Phone className="w-8 h-8 text-white" />
//           </motion.div>

//           {/* Title */}
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.5 }}
//             className="text-2xl font-bold text-center text-gray-900 mb-2"
//           >
//             Enter Your Mobile Number
//           </motion.h2>

//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6 }}
//             className="text-gray-600 text-center mb-8"
//           >
//             We'll send you a verification code
//           </motion.p>

//           {/* Phone Input */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.7 }}
//             className="space-y-4"
//           >
//             <div className="flex items-center space-x-3">
//               <div className="flex items-center space-x-2 bg-gray-100 px-3 py-3 rounded-lg">
//                 <span className="text-lg">🇮🇳</span>
//                 <span className="font-medium text-gray-700">+91</span>
//               </div>
//               <Input
//                 type="tel"
//                 value={phoneNumber}
//                 onChange={(e) => {
//                   const value = e.target.value.replace(/\D/g, '').slice(0, 10);
//                   setPhoneNumber(value);
//                 }}
//                 placeholder="Enter mobile number"
//                 className="flex-1 text-lg"
//                 maxLength={10}
//               />
//             </div>

//             {/* Validation Message */}
//             {phoneNumber.length > 0 && !isValidPhone && (
//               <motion.p
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 className="text-red-500 text-sm"
//               >
//                 Please enter a valid 10-digit mobile number
//               </motion.p>
//             )}

//             {/* Continue Button */}
//             <Button
//               onClick={handleSubmit}
//               disabled={!isValidPhone || isLoading}
//               className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
//             >
//               {isLoading ? (
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                   className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
//                 />
//               ) : (
//                 <>
//                   <span>Continue</span>
//                   <ArrowRight className="w-5 h-5" />
//                 </>
//               )}
//             </Button>
//           </motion.div>

//           {/* Terms */}
//           <motion.p
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1 }}
//             className="text-xs text-gray-500 text-center mt-4"
//           >
//             By continuing, you agree to our{' '}
//             <a 
//               href="/terms" 
//               className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
//               onClick={(e) => e.stopPropagation()}
//             >
//               Terms of Service
//             </a>
//             {' '}and{' '}
//             <a 
//               href="/privacy" 
//               className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
//               onClick={(e) => e.stopPropagation()}
//             >
//               Privacy Policy
//             </a>
//           </motion.p>
//         </motion.div>
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { apiService } from '../services/api';
import TermsConditionsScreen from './TermsConditionsScreen';

interface PhoneEntryScreenProps {
  onComplete: (phoneNumber: string) => void;
}

export default function PhoneEntryScreen({ onComplete }: PhoneEntryScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [currentScreen, setCurrentScreen] = useState<'phone' | 'terms'>('phone');
  const [initialSection, setInitialSection] = useState<'terms' | 'privacy'>('terms');

  const backgroundImages = [
    'https://images.unsplash.com/photo-1673168551699-1f0fcbb98637?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBzaG9wcGluZyUyMHBlb3BsZSUyMHdhbGtpbmclMjBzdG9yZXN8ZW58MXx8fHwxNzU3Nzg1NDE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1661260178494-48ed9714c77c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2hvcHBpbmclMjBtYWxsJTIwcGVvcGxlfGVufDF8fHx8MTc1Nzc4NTQyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1564294911555-3ded7632b7de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBzaG9wcGluZyUyMGRpc3RyaWN0JTIwcGVkZXN0cmlhbnN8ZW58MXx8fHwxNzU3Nzg1NDI0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5ZWFyJTIwc2FsZSUyMGJhbm5lcnxlbnwxfHx8fDE3NTc3NDgwODJ8MA&ixlib=rb-4.1.0&q=80&w=1080'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBackgroundIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    if (phoneNumber.length === 10) {
      setIsLoading(true);
      try {
        await apiService.getOTP(phoneNumber);
        onComplete(phoneNumber);
      } catch (error) {
        console.error('Error sending OTP:', error);
        alert('Failed to send OTP. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isValidPhone = phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);

  const handleBackToPhone = () => {
    setCurrentScreen('phone');
  };

  const handleTermsClick = () => {
    setInitialSection('terms');
    setCurrentScreen('terms');
  };

  const handlePrivacyClick = () => {
    setInitialSection('privacy');
    setCurrentScreen('terms');
  };

  // If current screen is terms, show TermsConditionsScreen with the appropriate section
  if (currentScreen === 'terms') {
    return <TermsConditionsScreen onBack={handleBackToPhone} initialSection={initialSection} />;
  }

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Rotating Background Images */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: backgroundIndex === index ? 1 : 0,
              scale: backgroundIndex === index ? 1 : 1.1
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <ImageWithFallback
              src={image}
              alt="Street shopping"
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        
        {/* Animated Shopping Icons */}
        <div className="absolute inset-0 overflow-hidden">
          {['🛍️', '🏪', '👥', '🚶‍♀️', '🚶‍♂️', '🛒'].map((icon, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -100, -20],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            >
              {icon}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mx-auto w-full max-w-sm"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", damping: 15 }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Phone className="w-8 h-8 text-white" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-center text-gray-900 mb-2"
          >
            Enter Your Mobile Number
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 text-center mb-8"
          >
            We'll send you a verification code
          </motion.p>

          {/* Phone Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-3 rounded-lg">
                <span className="text-lg">🇮🇳</span>
                <span className="font-medium text-gray-700">+91</span>
              </div>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhoneNumber(value);
                }}
                placeholder="Enter mobile number"
                className="flex-1 text-lg"
                maxLength={10}
              />
            </div>

            {/* Validation Message */}
            {phoneNumber.length > 0 && !isValidPhone && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-red-500 text-sm"
              >
                Please enter a valid 10-digit mobile number
              </motion.p>
            )}

            {/* Continue Button */}
            <Button
              onClick={handleSubmit}
              disabled={!isValidPhone || isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </motion.div>

          {/* Terms - Updated with proper navigation */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-xs text-gray-500 text-center mt-4"
          >
            By continuing, you agree to our{' '}
            <button 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleTermsClick();
              }}
            >
              Terms of Service
            </button>
            {' '}and{' '}
            <button 
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handlePrivacyClick();
              }}
            >
              Privacy Policy
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}