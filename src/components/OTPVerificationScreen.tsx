// import React, { useState, useRef, useEffect } from 'react';
// import { motion } from 'motion/react';
// import { ArrowRight, ArrowLeft } from 'lucide-react';
// import { Button } from './ui/button';
// import { apiService } from '../services/api';
// import { authService } from '../utils/auth';

// interface OTPVerificationScreenProps {
//   phoneNumber: string;
//   onComplete: () => void;
// }

// export default function OTPVerificationScreen({ phoneNumber, onComplete }: OTPVerificationScreenProps) {
//   const [otp, setOtp] = useState(['', '', '', '']);
//   const [isLoading, setIsLoading] = useState(false);
//   const [countdown, setCountdown] = useState(30);
//   const [canResend, setCanResend] = useState(false);
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   useEffect(() => {
//     // Focus first input on mount
//     inputRefs.current[0]?.focus();
//   }, []);

//   useEffect(() => {
//     // Countdown timer
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       setCanResend(true);
//     }
//   }, [countdown]);

//   const handleInputChange = (index: number, value: string) => {
//     if (!/^\d*$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto-focus next input
//     if (value && index < 3) {
//       inputRefs.current[index + 1]?.focus();
//     }

//     // Auto-submit when all digits are entered
//     if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 4) {
//       handleVerify(newOtp.join(''));
//     }
//   };

//   const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleVerify = async (otpCode?: string) => {
//     const code = otpCode || otp.join('');
//     if (code.length === 4) {
//       setIsLoading(true);
//       try {
//         await apiService.verifyOTP(phoneNumber, code);
//         // Store authentication data with 30-day session
//         authService.setAuth({ phoneNumber });
//         onComplete();
//       } catch (error) {
//         console.error('Error verifying OTP:', error);
//         alert('Invalid OTP. Please try again.');
//         setOtp(['', '', '', '']);
//         inputRefs.current[0]?.focus();
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const handleResend = async () => {
//     try {
//       await apiService.getOTP(phoneNumber);
//       setCountdown(30);
//       setCanResend(false);
//       setOtp(['', '', '', '']);
//       inputRefs.current[0]?.focus();
//     } catch (error) {
//       console.error('Error resending OTP:', error);
//       alert('Failed to resend OTP. Please try again.');
//     }
//   };

//   const isComplete = otp.every(digit => digit !== '');

//   return (
//     <div className="h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-8">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9, y: 50 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm"
//       >
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="text-center mb-8"
//         >
//           <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//             <span className="text-2xl">📱</span>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Number</h2>
//           <p className="text-gray-600">
//             Enter the 4-digit code sent to
//           </p>
//           <p className="font-semibold text-gray-900">+91 {phoneNumber}</p>
//         </motion.div>

//         {/* OTP Input */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="flex justify-center space-x-4 mb-8"
//         >
//           {otp.map((digit, index) => (
//             <motion.input
//               key={index}
//               ref={(el) => (inputRefs.current[index] = el)}
//               type="text"
//               value={digit}
//               onChange={(e) => handleInputChange(index, e.target.value)}
//               onKeyDown={(e) => handleKeyDown(index, e)}
//               className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
//               maxLength={1}
//               whileFocus={{ scale: 1.05 }}
//               transition={{ type: "spring", damping: 15 }}
//             />
//           ))}
//         </motion.div>

//         {/* Verify Button */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//         >
//           <Button
//             onClick={() => handleVerify()}
//             disabled={!isComplete || isLoading}
//             className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2"
//           >
//             {isLoading ? (
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                 className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
//               />
//             ) : (
//               <>
//                 <span>Verify</span>
//                 <ArrowRight className="w-5 h-5" />
//               </>
//             )}
//           </Button>
//         </motion.div>

//         {/* Resend Section */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.8 }}
//           className="text-center mt-6"
//         >
//           <p className="text-gray-600 mb-2">Didn't receive the code?</p>
//           {canResend ? (
//             <button
//               onClick={handleResend}
//               className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
//             >
//               Resend Code
//             </button>
//           ) : (
//             <p className="text-gray-500">
//               Resend in {countdown}s
//             </p>
//           )}
//         </motion.div>

//         {/* Auto-detect hint */}
//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1 }}
//           className="text-xs text-gray-400 text-center mt-4"
//         >
//           {/* Code will be auto-detected from SMS */}
//         </motion.p>
//       </motion.div>
//     </div>
//   );
// }

//////////

// import React, { useState, useRef, useEffect } from 'react';
// import { motion } from 'motion/react';
// import { ArrowRight, ArrowLeft } from 'lucide-react';
// import { Button } from './ui/button';
// import { apiService } from '../services/api';
// import { authService } from '../utils/auth';

// interface OTPVerificationScreenProps {
//   phoneNumber: string;
//   onComplete: () => void;
// }

// export default function OTPVerificationScreen({ phoneNumber, onComplete }: OTPVerificationScreenProps) {
//   const [otp, setOtp] = useState(['', '', '', '']);
//   const [isLoading, setIsLoading] = useState(false);
//   const [countdown, setCountdown] = useState(30);
//   const [canResend, setCanResend] = useState(false);
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   useEffect(() => {
//     // Focus first input on mount
//     inputRefs.current[0]?.focus();
//   }, []);

//   useEffect(() => {
//     // Countdown timer
//     if (countdown > 0) {
//       const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//       return () => clearTimeout(timer);
//     } else {
//       setCanResend(true);
//     }
//   }, [countdown]);

//   const handleInputChange = (index: number, value: string) => {
//     if (!/^\d*$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto-focus next input
//     if (value && index < 3) {
//       inputRefs.current[index + 1]?.focus();
//     }

//     // Auto-submit when all digits are entered
//     if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 4) {
//       handleVerify(newOtp.join(''));
//     }
//   };

//   const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
//     if (e.key === 'Backspace' && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleVerify = async (otpCode?: string) => {
//     const code = otpCode || otp.join('');
//     if (code.length === 4) {
//       setIsLoading(true);
//       try {
//         await apiService.verifyOTP(phoneNumber, code);
//         // Store authentication data with 30-day session
//         authService.setAuth({ phoneNumber });
//         onComplete();
//       } catch (error) {
//         console.error('Error verifying OTP:', error);
//         alert('Invalid OTP. Please try again.');
//         setOtp(['', '', '', '']);
//         inputRefs.current[0]?.focus();
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const handleResend = async () => {
//     try {
//       await apiService.getOTP(phoneNumber);
//       setCountdown(30);
//       setCanResend(false);
//       setOtp(['', '', '', '']);
//       inputRefs.current[0]?.focus();
//     } catch (error) {
//       console.error('Error resending OTP:', error);
//       alert('Failed to resend OTP. Please try again.');
//     }
//   };

//   const isComplete = otp.every(digit => digit !== '');

//   // Format phone number for display
//   const formatPhoneNumber = (phone: string) => {
//     if (phone.length === 10) {
//       return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
//     }
//     return `+91 ${phone}`;
//   };

//   return (
//     <div className="h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-8">

   

//       <motion.div
//         initial={{ opacity: 0, scale: 0.9, y: 50 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         transition={{ duration: 0.5, ease: "easeOut" }}
//         className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm"
//       >
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="text-center mb-8"
//         >
//           <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
//             <span className="text-2xl">📱</span>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Number</h2>
//           <p className="text-gray-600">
//             Enter the 4-digit code sent to
//           </p>
//           <p className="font-semibold text-gray-900 mt-1">
//             {formatPhoneNumber(phoneNumber)}
//           </p>
//         </motion.div>

//         {/* OTP Input */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.4 }}
//           className="flex justify-center space-x-4 mb-8"
//         >
//           {otp.map((digit, index) => (
//             <motion.input
//               key={index}
//               ref={(el) => (inputRefs.current[index] = el)}
//               type="text"
//               value={digit}
//               onChange={(e) => handleInputChange(index, e.target.value)}
//               onKeyDown={(e) => handleKeyDown(index, e)}
//               className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
//               maxLength={1}
//               whileFocus={{ scale: 1.05 }}
//               transition={{ type: "spring", damping: 15 }}
//             />
//           ))}
//         </motion.div>

//         {/* Verify Button */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.6 }}
//         >
//           <Button
//             onClick={() => handleVerify()}
//             disabled={!isComplete || isLoading}
//             className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2"
//           >
//             {isLoading ? (
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                 className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
//               />
//             ) : (
//               <>
//                 <span>Verify</span>
//                 <ArrowRight className="w-5 h-5" />
//               </>
//             )}
//           </Button>
//         </motion.div>

//         {/* Resend Section */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.8 }}
//           className="text-center mt-6"
//         >
//           <p className="text-gray-600 mb-2">Didn't receive the code?</p>
//           {canResend ? (
//             <button
//               onClick={handleResend}
//               className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
//             >
//               Resend Code
//             </button>
//           ) : (
//             <p className="text-gray-500">
//               Resend in {countdown}s
//             </p>
//           )}
//         </motion.div>

//         {/* Phone number display at bottom */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 1 }}
//           className="text-center mt-6 pt-4 border-t border-gray-200"
//         >
//           <p className="text-sm text-gray-500">
//             OTP sent to: <span className="font-semibold text-gray-700">{formatPhoneNumber(phoneNumber)}</span>
//           </p>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }


/////////////


import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { apiService } from '../services/api';
import { authService } from '../utils/auth';

interface OTPVerificationScreenProps {
  phoneNumber?: string;
  onComplete: () => void;
  onBack?: () => void;
}

export default function OTPVerificationScreen({ 
  phoneNumber: propPhoneNumber, 
  onComplete, 
  onBack 
}: OTPVerificationScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Storage keys
  const STORAGE_KEYS = {
    PHONE_NUMBER: 'otp_verification_phone',
    OTP_TIMESTAMP: 'otp_request_timestamp'
  };

  useEffect(() => {
    // Initialize phone number from props or localStorage
    const initializePhoneNumber = () => {
      if (propPhoneNumber) {
        setPhoneNumber(propPhoneNumber);
        localStorage.setItem(STORAGE_KEYS.PHONE_NUMBER, propPhoneNumber);
      } else {
        const storedPhone = localStorage.getItem(STORAGE_KEYS.PHONE_NUMBER);
        if (storedPhone) {
          setPhoneNumber(storedPhone);
        } else {
          setError('Phone number not found. Please go back and try again.');
          return;
        }
      }

      // Focus first input
      inputRefs.current[0]?.focus();
    };

    initializePhoneNumber();
  }, [propPhoneNumber]);

  useEffect(() => {
    // Restore countdown from localStorage on page refresh
    const storedTimestamp = localStorage.getItem(STORAGE_KEYS.OTP_TIMESTAMP);
    if (storedTimestamp) {
      const elapsed = Math.floor((Date.now() - parseInt(storedTimestamp)) / 1000);
      const remaining = Math.max(0, 30 - elapsed);
      
      if (remaining > 0) {
        setCountdown(remaining);
        setCanResend(false);
      } else {
        setCanResend(true);
      }
    }

    // Countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 4) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    if (!phoneNumber) {
      setError('Phone number not available. Please go back and try again.');
      return;
    }

    const code = otpCode || otp.join('');
    if (code.length === 4) {
      setIsLoading(true);
      setError('');
      try {
        await apiService.verifyOTP(phoneNumber, code);
        // Clear storage on successful verification
        localStorage.removeItem(STORAGE_KEYS.PHONE_NUMBER);
        localStorage.removeItem(STORAGE_KEYS.OTP_TIMESTAMP);
        // Store authentication data with 30-day session
        authService.setAuth({ phoneNumber });
        onComplete();
      } catch (error) {
        console.error('Error verifying OTP:', error);
        setError('Invalid OTP. Please try again.');
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResend = async () => {
    if (!phoneNumber) {
      setError('Phone number not available. Please go back and try again.');
      return;
    }

    try {
      await apiService.getOTP(phoneNumber);
      // Store timestamp for countdown persistence
      localStorage.setItem(STORAGE_KEYS.OTP_TIMESTAMP, Date.now().toString());
      setCountdown(30);
      setCanResend(false);
      setOtp(['', '', '', '']);
      setError('');
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Error resending OTP:', error);
      setError('Failed to resend OTP. Please try again.');
    }
  };

  const handleBack = () => {
    // Clear storage when going back
    localStorage.removeItem(STORAGE_KEYS.PHONE_NUMBER);
    localStorage.removeItem(STORAGE_KEYS.OTP_TIMESTAMP);
    
    // If onBack prop is provided, use it. Otherwise, use browser back
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  const isComplete = otp.every(digit => digit !== '') && phoneNumber;

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 10) {
      return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
    }
    return `+91 ${phone}`;
  };

  // If no phone number is available and we're not loading, show error
  if (!phoneNumber && !isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Session Expired</h2>
          <p className="text-gray-600 mb-6">
            Please go back and enter your phone number again.
          </p>
          <Button
            onClick={handleBack}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg"
          >
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm relative"
      >
        {/* Back Button - Always show if we have onBack prop or can use browser history */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 left-4"
        >
          <button
            onClick={handleBack}
            disabled={isLoading}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📱</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Number</h2>
          <p className="text-gray-600">
            Enter the 4-digit code sent to
          </p>
          <p className="font-semibold text-gray-900 mt-1">
            {formatPhoneNumber(phoneNumber)}
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center"
          >
            {error}
          </motion.div>
        )}

        {/* OTP Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center space-x-4 mb-8"
        >
          {otp.map((digit, index) => (
            <motion.input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
              maxLength={1}
              whileFocus={{ scale: 1.05 }}
              transition={{ type: "spring", damping: 15 }}
              disabled={isLoading}
            />
          ))}
        </motion.div>

        {/* Verify Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={() => handleVerify()}
            disabled={!isComplete || isLoading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <span>Verify</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </motion.div>

        {/* Resend Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-gray-600 mb-2">Didn't receive the code?</p>
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={isLoading}
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors disabled:opacity-50"
            >
              Resend Code
            </button>
          ) : (
            <p className="text-gray-500">
              Resend in {countdown}s
            </p>
          )}
        </motion.div>

        {/* Phone number display at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6 pt-4 border-t border-gray-200"
        >
          <p className="text-sm text-gray-500">
            OTP sent to: <span className="font-semibold text-gray-700">{formatPhoneNumber(phoneNumber)}</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}