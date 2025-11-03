import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { apiService } from '../services/api';
import { authService } from '../utils/auth';

interface OTPVerificationScreenProps {
  phoneNumber: string;
  onComplete: () => void;
}

export default function OTPVerificationScreen({ phoneNumber, onComplete }: OTPVerificationScreenProps) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
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
    const code = otpCode || otp.join('');
    if (code.length === 4) {
      setIsLoading(true);
      try {
        await apiService.verifyOTP(phoneNumber, code);
        // Store authentication data with 30-day session
        authService.setAuth({ phoneNumber });
        onComplete();
      } catch (error) {
        console.error('Error verifying OTP:', error);
        alert('Invalid OTP. Please try again.');
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResend = async () => {
    try {
      await apiService.getOTP(phoneNumber);
      setCountdown(30);
      setCanResend(false);
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Error resending OTP:', error);
      alert('Failed to resend OTP. Please try again.');
    }
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm"
      >
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
          <p className="font-semibold text-gray-900">+91 {phoneNumber}</p>
        </motion.div>

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
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 rounded-lg flex items-center justify-center space-x-2"
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
              className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Resend Code
            </button>
          ) : (
            <p className="text-gray-500">
              Resend in {countdown}s
            </p>
          )}
        </motion.div>

        {/* Auto-detect hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-gray-400 text-center mt-4"
        >
          {/* Code will be auto-detected from SMS */}
        </motion.p>
      </motion.div>
    </div>
  );
}