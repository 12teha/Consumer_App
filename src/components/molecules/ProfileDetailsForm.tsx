// import React, { useState, useEffect } from 'react';
// import { motion } from 'motion/react';
// import { ArrowLeft, Save, User, Mail, Phone, Calendar, CheckCircle } from 'lucide-react';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';

// interface ProfileDetailsFormProps {
//   initialData: {
//     username: string;
//     email: string;
//     phone: string;
//     memberSince?: string;
//     isVerified?: boolean;
//     avatar?: string;
//   };
//   onBack: () => void;
//   onSave: (data: any) => void;
// }

// export default function ProfileDetailsForm({ initialData, onBack, onSave }: ProfileDetailsFormProps) {
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     phone: '',
//     memberSince: '',
//     isVerified: false,
//     avatar: '',
//     ...initialData
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [fieldErrors, setFieldErrors] = useState({
//     username: '',
//     email: '',
//     phone: ''
//   });
//   const [profileCompleteness, setProfileCompleteness] = useState(0);

//   // Initialize or update form data when initialData changes
//   useEffect(() => {
//     setFormData(prev => ({
//       ...prev,
//       ...initialData,
//       // Ensure we have default values for dynamic fields
//       memberSince: initialData.memberSince || getDefaultMemberSince(),
//       isVerified: initialData.isVerified !== undefined ? initialData.isVerified : true,
//       avatar: initialData.avatar || ''
//     }));
//   }, [initialData]);

//   // Calculate profile completeness whenever form data changes
//   useEffect(() => {
//     calculateProfileCompleteness();
//   }, [formData.username, formData.email, formData.phone]);

//   // Generate a realistic member since date (random within last 2 years)
//   const getDefaultMemberSince = () => {
//     const start = new Date();
//     start.setFullYear(start.getFullYear() - 2);
//     const randomTime = start.getTime() + Math.random() * (new Date().getTime() - start.getTime());
//     const randomDate = new Date(randomTime);
//     return randomDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
//   };

//   // Calculate profile completeness percentage
//   const calculateProfileCompleteness = () => {
//     let completeness = 0;
    
//     // Username (33%)
//     if (formData.username.trim().length >= 3 && formData.username.trim().length <= 50) {
//       completeness += 33;
//     }
    
//     // Email (33%)
//     if (isValidEmail(formData.email)) {
//       completeness += 33;
//     }
    
//     // Phone (34%)
//     if (formData.phone.length === 10 && /^\d+$/.test(formData.phone)) {
//       completeness += 34;
//     }
    
//     setProfileCompleteness(completeness);
//   };

//   // Enhanced email validation function
//   const isValidEmail = (email: string): boolean => {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return emailRegex.test(email);
//   };

//   // Validate individual fields
//   const validateField = (name: string, value: string) => {
//     switch (name) {
//       case 'username':
//         if (value.trim().length < 3) {
//           return 'Name must be at least 3 characters';
//         }
//         if (value.trim().length > 50) {
//           return 'Name cannot exceed 50 characters';
//         }
//         if (!/^[a-zA-Z\s]*$/.test(value)) {
//           return 'Name can only contain letters and spaces';
//         }
//         return '';
      
//       case 'email':
//         if (!value.trim()) {
//           return 'Email address is required';
//         }
//         if (!isValidEmail(value)) {
//           return 'Please enter a valid email address (e.g., example@domain.com)';
//         }
//         return '';
      
//       case 'phone':
//         if (value.length !== 10) {
//           return 'Phone number must be 10 digits';
//         }
//         if (!/^\d+$/.test(value)) {
//           return 'Phone number can only contain digits';
//         }
//         return '';
      
//       default:
//         return '';
//     }
//   };

//   // Handle field changes with validation
//   const handleFieldChange = (field: string, value: string) => {
//     // For username field, limit to 50 characters
//     if (field === 'username' && value.length > 50) {
//       return; // Don't update if exceeds limit
//     }
    
//     // For email field, restrict special characters except @ and .
//     if (field === 'email') {
//       // Allow only alphanumeric characters and specific symbols: @ . _ % + -
//       const emailRegex = /^[a-zA-Z0-9@._%+-]*$/;
//       if (!emailRegex.test(value) && value !== '') {
//         return; // Don't update if invalid characters
//       }
//     }
    
//     setFormData(prev => ({ ...prev, [field]: value }));
    
//     // Validate the field and update errors
//     const error = validateField(field, value);
//     setFieldErrors(prev => ({ ...prev, [field]: error }));

//     // Auto-update verification status based on email and phone completeness
//     if (field === 'email' || field === 'phone') {
//       const emailValid = field === 'email' 
//         ? isValidEmail(value)
//         : isValidEmail(formData.email);
      
//       const phoneValid = field === 'phone'
//         ? (value.length === 10 && /^\d+$/.test(value))
//         : (formData.phone.length === 10 && /^\d+$/.test(formData.phone));

//       // Auto-verify if both email and phone are valid
//       if (emailValid && phoneValid) {
//         setFormData(prev => ({ ...prev, isVerified: true }));
//       } else if (emailValid || phoneValid) {
//         setFormData(prev => ({ ...prev, isVerified: false }));
//       }
//     }
//   };

//   // Calculate account age in months
//   const getAccountAge = () => {
//     if (!formData.memberSince) return '0';
    
//     try {
//       const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//       const [month, year] = formData.memberSince.split(' ');
//       const joinDate = new Date(`${month} 1, ${year}`);
//       const now = new Date();
      
//       // Calculate difference in months
//       const diffMonths = (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth());
//       return Math.max(0, diffMonths).toString();
//     } catch (error) {
//       return '0';
//     }
//   };

//   // Get verification status based on current form data
//   const getVerificationStatus = () => {
//     const emailValid = isValidEmail(formData.email);
//     const phoneValid = formData.phone.length === 10 && /^\d+$/.test(formData.phone);
//     const usernameValid = formData.username.trim().length >= 3 && formData.username.trim().length <= 50;

//     if (formData.isVerified && emailValid && phoneValid && usernameValid) {
//       return { 
//         status: 'Verified', 
//         color: 'text-green-700', 
//         bgColor: 'bg-green-50', 
//         borderColor: 'border-green-200',
//         description: 'Your account is fully verified and active.'
//       };
//     } else if (emailValid && phoneValid && usernameValid) {
//       return { 
//         status: 'Ready for Verification', 
//         color: 'text-blue-700', 
//         bgColor: 'bg-blue-50', 
//         borderColor: 'border-blue-200',
//         description: 'All requirements met. Click save to verify your account.'
//       };
//     } else if (emailValid || phoneValid || usernameValid) {
//       return { 
//         status: 'Partial Information', 
//         color: 'text-yellow-700', 
//         bgColor: 'bg-yellow-50', 
//         borderColor: 'border-yellow-200',
//         description: 'Complete all fields to enable verification.'
//       };
//     } else {
//       return { 
//         status: 'Not Started', 
//         color: 'text-red-700', 
//         bgColor: 'bg-red-50', 
//         borderColor: 'border-red-200',
//         description: 'Please fill in your name, email and phone number.'
//       };
//     }
//   };

//   const handleSave = async () => {
//     // Validate all fields before saving
//     const usernameError = validateField('username', formData.username);
//     const emailError = validateField('email', formData.email);
//     const phoneError = validateField('phone', formData.phone);

//     setFieldErrors({
//       username: usernameError,
//       email: emailError,
//       phone: phoneError
//     });

//     // If any errors, don't save
//     if (usernameError || emailError || phoneError) {
//       return;
//     }

//     setIsLoading(true);
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     // Auto-verify if all fields are valid
//     const finalData = {
//       username: formData.username,
//       email: formData.email,
//       phone: formData.phone,
//       memberSince: formData.memberSince,
//       isVerified: isValidEmail(formData.email) && formData.phone.length === 10 && formData.username.trim().length >= 3 && formData.username.trim().length <= 50,
//       avatar: formData.avatar,
//       lastUpdated: new Date().toISOString(),
//       profileCompleteness: profileCompleteness
//     };
    
//     onSave(finalData);
//     setIsLoading(false);
//   };

//   const isFormValid = formData.username.trim().length >= 3 && 
//                      formData.username.trim().length <= 50 &&
//                      isValidEmail(formData.email) &&
//                      formData.phone.length === 10 &&
//                      /^\d+$/.test(formData.phone);

//   const verificationInfo = getVerificationStatus();

//   return (
//     <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white px-4 py-3 shadow-sm flex items-center justify-between"
//       >
//         <button onClick={onBack} className="p-2 -ml-2">
//           <ArrowLeft className="w-6 h-6 text-gray-600" />
//         </button>
//         <h1 className="text-lg font-semibold text-gray-900">Profile Details</h1>
//         <div className="w-8" /> {/* Spacer */}
//       </motion.div>

//       {/* Form */}
//       <div className="flex-1 overflow-y-auto p-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white rounded-xl shadow-sm p-6 space-y-6"
//         >
//           {/* Avatar Section - Simplified without upload */}
//           <div className="text-center">
//             <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
//               <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
//                 <span className="text-2xl font-bold text-white">
//                   {formData.username.charAt(0).toUpperCase() || 'U'}
//                 </span>
//               </div>
//             </div>
//             <p className="text-sm text-gray-600">
//               Profile photo
//             </p>
//           </div>

//           {/* Form Fields */}
//           <div className="space-y-6">
//             {/* Username */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <User className="w-4 h-4 inline mr-2" />
//                 Full Name
//                 <span className="text-xs text-gray-500 ml-1">
//                   ({formData.username.length}/50)
//                 </span>
//               </label>
//               <Input
//                 value={formData.username}
//                 onChange={(e) => handleFieldChange('username', e.target.value)}
//                 placeholder="Enter your full name (3-50 characters)"
//                 className={`w-full ${fieldErrors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
//                 maxLength={50}
//               />
//               {fieldErrors.username && (
//                 <motion.p
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   className="text-red-500 text-xs mt-2 flex items-center"
//                 >
//                   • {fieldErrors.username}
//                 </motion.p>
//               )}
//               {!fieldErrors.username && formData.username && formData.username.length >= 3 && formData.username.length <= 50 && (
//                 <motion.p
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   className="text-green-500 text-xs mt-2 flex items-center"
//                 >
//                   <CheckCircle className="w-3 h-3 mr-1" />
//                   Name looks good!
//                 </motion.p>
//               )}
//               {formData.username.length > 50 && (
//                 <motion.p
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   className="text-red-500 text-xs mt-2 flex items-center"
//                 >
//                   • Name cannot exceed 50 characters
//                 </motion.p>
//               )}
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <Mail className="w-4 h-4 inline mr-2" />
//                 Email Address
//               </label>
//               <Input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => handleFieldChange('email', e.target.value)}
//                 placeholder="Enter your email address (e.g., example@domain.com)"
//                 className={`w-full ${fieldErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
//               />
//               {fieldErrors.email && (
//                 <motion.p
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   className="text-red-500 text-xs mt-2 flex items-center"
//                 >
//                   • {fieldErrors.email}
//                 </motion.p>
//               )}
//               {!fieldErrors.email && isValidEmail(formData.email) && (
//                 <motion.p
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   className="text-green-500 text-xs mt-2 flex items-center"
//                 >
//                   <CheckCircle className="w-3 h-3 mr-1" />
//                   Valid email format
//                 </motion.p>
//               )}
//               {formData.email && !isValidEmail(formData.email) && !fieldErrors.email && (
//                 <motion.p
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   className="text-yellow-500 text-xs mt-2 flex items-center"
//                 >
//                   • Enter a complete email address with @ and domain
//                 </motion.p>
//               )}
//               <p className="text-xs text-gray-500 mt-2">
//                 Allowed characters: letters, numbers, @ . _ % + -
//               </p>
//             </div>

//             {/* Phone */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 <Phone className="w-4 h-4 inline mr-2" />
//                 Phone Number
//               </label>
//               <div className="flex items-center space-x-3">
//                 <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
//                   <span className="text-lg">🇮🇳</span>
//                   <span className="font-medium text-gray-700">+91</span>
//                 </div>
//                 <Input
//                   type="tel"
//                   value={formData.phone}
//                   onChange={(e) => {
//                     const value = e.target.value.replace(/\D/g, '').slice(0, 10);
//                     handleFieldChange('phone', value);
//                   }}
//                   placeholder="Phone number"
//                   className={`flex-1 ${fieldErrors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
//                   maxLength={10}
//                 />
//               </div>
//               {fieldErrors.phone && (
//                 <motion.p
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   className="text-red-500 text-xs mt-2 flex items-center"
//                 >
//                   • {fieldErrors.phone}
//                 </motion.p>
//               )}
//               {!fieldErrors.phone && formData.phone.length === 10 && (
//                 <motion.p
//                   initial={{ opacity: 0, height: 0 }}
//                   animate={{ opacity: 1, height: 'auto' }}
//                   className="text-green-500 text-xs mt-2 flex items-center"
//                 >
//                   <CheckCircle className="w-3 h-3 mr-1" />
//                   Valid phone number
//                 </motion.p>
//               )}
//               <p className="text-xs text-gray-500 mt-2">
//                 Phone number cannot be changed. Contact support if needed.
//               </p>
//             </div>
//           </div>

//           {/* Dynamic Account Information - Auto-updating */}
//           <div className={`rounded-lg p-4 border ${verificationInfo.bgColor} ${verificationInfo.borderColor}`}>
//             <h4 className="font-medium text-gray-900 mb-3 flex items-center">
//               <User className="w-4 h-4 mr-2" />
//               Account Information
//             </h4>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Member since:</span>
//                 <span className="font-medium text-gray-900 flex items-center">
//                   <Calendar className="w-3 h-3 mr-1" />
//                   {formData.memberSince}
//                 </span>
//               </div>
              
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Account age:</span>
//                 <span className="font-medium text-gray-900">
//                   {getAccountAge()} months
//                 </span>
//               </div>
              
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Verification status:</span>
//                 <span className={`font-medium flex items-center ${verificationInfo.color}`}>
//                   {formData.isVerified && <CheckCircle className="w-3 h-3 mr-1" />}
//                   {verificationInfo.status}
//                 </span>
//               </div>
              
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Profile completeness:</span>
//                 <div className="flex items-center space-x-2">
//                   <span className="font-medium text-gray-900">
//                     {profileCompleteness}%
//                   </span>
//                   <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
//                     <motion.div 
//                       className="h-full bg-purple-600 rounded-full"
//                       initial={{ width: 0 }}
//                       animate={{ width: `${profileCompleteness}%` }}
//                       transition={{ duration: 0.5 }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Dynamic verification guidance */}
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className={`text-xs mt-3 ${verificationInfo.color}`}
//             >
//               {verificationInfo.description}
//             </motion.p>
//           </div>

//           {/* Save Button */}
//           <Button
//             onClick={handleSave}
//             disabled={!isFormValid || isLoading}
//             className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isLoading ? (
//               <motion.div
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                 className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
//               />
//             ) : (
//               <>
//                 <Save className="w-5 h-5" />
//                 <span>Save Changes</span>
//               </>
//             )}
//           </Button>

//           {/* Form Validation Summary */}
//           {(!isFormValid && Object.values(fieldErrors).some(error => error)) && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               className="text-sm text-red-600 space-y-1 bg-red-50 p-3 rounded-lg border border-red-200"
//             >
//               <p className="font-medium mb-2">Please fix the following errors:</p>
//               {fieldErrors.username && <p>• {fieldErrors.username}</p>}
//               {fieldErrors.email && <p>• {fieldErrors.email}</p>}
//               {fieldErrors.phone && <p>• {fieldErrors.phone}</p>}
//             </motion.div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// }
/////////////

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, User, Mail, Phone, Calendar, CheckCircle } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface ProfileDetailsFormProps {
  initialData: {
    username: string;
    email: string;
    phone: string;
    memberSince?: string;
    isVerified?: boolean;
    avatar?: string;
  };
  onBack: () => void;
  onSave: (data: any) => void;
}

export default function ProfileDetailsForm({ initialData, onBack, onSave }: ProfileDetailsFormProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    memberSince: '',
    isVerified: false,
    avatar: '',
    ...initialData
  });
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    email: ''
  });
  const [profileCompleteness, setProfileCompleteness] = useState(0);

  // Initialize or update form data when initialData changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ...initialData,
      // Ensure we have default values for dynamic fields
      memberSince: initialData.memberSince || getDefaultMemberSince(),
      isVerified: initialData.isVerified !== undefined ? initialData.isVerified : true,
      avatar: initialData.avatar || ''
    }));
  }, [initialData]);

  // Calculate profile completeness whenever form data changes
  useEffect(() => {
    calculateProfileCompleteness();
  }, [formData.username, formData.email, formData.phone]);

  // Generate a realistic member since date (random within last 2 years)
  const getDefaultMemberSince = () => {
    const start = new Date();
    start.setFullYear(start.getFullYear() - 2);
    const randomTime = start.getTime() + Math.random() * (new Date().getTime() - start.getTime());
    const randomDate = new Date(randomTime);
    return randomDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Calculate profile completeness percentage
  const calculateProfileCompleteness = () => {
    let completeness = 0;
    
    // Username (50%) - Required
    if (formData.username.trim().length >= 1 && formData.username.trim().length <= 100 && /^[A-Za-z\s]+$/.test(formData.username)) {
      completeness += 50;
    }
    
    // Email (50%) - Required
    if (isValidEmail(formData.email)) {
      completeness += 50;
    }
    
    setProfileCompleteness(completeness);
  };

  // Enhanced email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length >= 6 && email.length <= 100;
  };

  // Validate individual fields
  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'username':
        if (!value.trim()) {
          return 'Full name is required';
        }
        if (value.trim().length < 1) {
          return 'Full name must be at least 1 character';
        }
        if (value.trim().length > 100) {
          return 'Full name cannot exceed 100 characters';
        }
        if (!/^[A-Za-z\s]+$/.test(value)) {
          return 'Full name can only contain letters A-Z and spaces';
        }
        return '';
      
      case 'email':
        if (!value.trim()) {
          return 'Email address is required';
        }
        if (value.length < 6) {
          return 'Email must be at least 6 characters';
        }
        if (value.length > 100) {
          return 'Email cannot exceed 100 characters';
        }
        if (!isValidEmail(value)) {
          return 'Please enter a valid email address (e.g., example@domain.com)';
        }
        return '';
      
      default:
        return '';
    }
  };

  // Handle field changes with validation
  const handleFieldChange = (field: string, value: string) => {
    // For username field - only allow A-Z, a-z, and spaces
    if (field === 'username') {
      // Restrict to only letters and spaces
      const lettersOnly = value.replace(/[^A-Za-z\s]/g, '');
      // Limit to 100 characters
      const truncatedValue = lettersOnly.slice(0, 100);
      setFormData(prev => ({ ...prev, [field]: truncatedValue }));
    }
    
    // For email field - allow standard email characters with length restriction
    else if (field === 'email') {
      // Allow standard email characters and restrict length to 100
      const emailRegex = /^[a-zA-Z0-9@._%+-]*$/;
      let newValue = value;
      
      // Only update if characters are valid for email or if clearing the field
      if (emailRegex.test(value) || value === '') {
        newValue = value.slice(0, 100); // Limit to 100 characters
        setFormData(prev => ({ ...prev, [field]: newValue }));
      }
    }
    
    // For phone field - keep existing logic
    else if (field === 'phone') {
      const numbersOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [field]: numbersOnly }));
    }
    
    // Validate the field and update errors
    if (field === 'username' || field === 'email') {
      const error = validateField(field, field === 'username' ? value : formData[field]);
      setFieldErrors(prev => ({ ...prev, [field]: error }));
    }

    // Auto-update verification status based on email and phone completeness
    if (field === 'email' || field === 'phone') {
      const emailValid = field === 'email' 
        ? isValidEmail(value)
        : isValidEmail(formData.email);
      
      const phoneValid = field === 'phone'
        ? (value.length === 10 && /^\d+$/.test(value))
        : (formData.phone.length === 10 && /^\d+$/.test(formData.phone));

      // Auto-verify if both email and phone are valid
      if (emailValid && phoneValid) {
        setFormData(prev => ({ ...prev, isVerified: true }));
      } else if (emailValid || phoneValid) {
        setFormData(prev => ({ ...prev, isVerified: false }));
      }
    }
  };

  // Calculate account age in months
  const getAccountAge = () => {
    if (!formData.memberSince) return '0';
    
    try {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const [month, year] = formData.memberSince.split(' ');
      const joinDate = new Date(`${month} 1, ${year}`);
      const now = new Date();
      
      // Calculate difference in months
      const diffMonths = (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth());
      return Math.max(0, diffMonths).toString();
    } catch (error) {
      return '0';
    }
  };

  // Get verification status based on current form data
  const getVerificationStatus = () => {
    const emailValid = isValidEmail(formData.email);
    const phoneValid = formData.phone.length === 10 && /^\d+$/.test(formData.phone);
    const usernameValid = formData.username.trim().length >= 1 && 
                         formData.username.trim().length <= 100 && 
                         /^[A-Za-z\s]+$/.test(formData.username);

    if (formData.isVerified && emailValid && phoneValid && usernameValid) {
      return { 
        status: 'Verified', 
        color: 'text-green-700', 
        bgColor: 'bg-green-50', 
        borderColor: 'border-green-200',
        description: 'Your account is fully verified and active.'
      };
    } else if (emailValid && phoneValid && usernameValid) {
      return { 
        status: 'Ready for Verification', 
        color: 'text-blue-700', 
        bgColor: 'bg-blue-50', 
        borderColor: 'border-blue-200',
        description: 'All requirements met. Click save to verify your account.'
      };
    } else if (emailValid || phoneValid || usernameValid) {
      return { 
        status: 'Partial Information', 
        color: 'text-yellow-700', 
        bgColor: 'bg-yellow-50', 
        borderColor: 'border-yellow-200',
        description: 'Complete all fields to enable verification.'
      };
    } else {
      return { 
        status: 'Not Started', 
        color: 'text-red-700', 
        bgColor: 'bg-red-50', 
        borderColor: 'border-red-200',
        description: 'Please fill in your name and email address.'
      };
    }
  };

  const handleSave = async () => {
    // Validate all fields before saving
    const usernameError = validateField('username', formData.username);
    const emailError = validateField('email', formData.email);

    setFieldErrors({
      username: usernameError,
      email: emailError
    });

    // If any errors, don't save
    if (usernameError || emailError) {
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Auto-verify if all fields are valid
    const finalData = {
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      memberSince: formData.memberSince,
      isVerified: isValidEmail(formData.email) && 
                 formData.phone.length === 10 && 
                 formData.username.trim().length >= 1 && 
                 formData.username.trim().length <= 100 &&
                 /^[A-Za-z\s]+$/.test(formData.username),
      avatar: formData.avatar,
      lastUpdated: new Date().toISOString(),
      profileCompleteness: profileCompleteness
    };
    
    onSave(finalData);
    setIsLoading(false);
  };

  const isFormValid = formData.username.trim().length >= 1 && 
                     formData.username.trim().length <= 100 &&
                     /^[A-Za-z\s]+$/.test(formData.username) &&
                     isValidEmail(formData.email) &&
                     formData.phone.length === 10 &&
                     /^\d+$/.test(formData.phone);

  const verificationInfo = getVerificationStatus();

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
          {/* Avatar Section - Simplified without upload */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
              <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {formData.username.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Profile photo
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
                <span className="text-red-500 ml-1">*</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({formData.username.length}/100)
                </span>
              </label>
              <Input
                value={formData.username}
                onChange={(e) => handleFieldChange('username', e.target.value)}
                placeholder="Enter your full name (letters and spaces only)"
                className={`w-full ${fieldErrors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                maxLength={100}
              />
              {fieldErrors.username && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-red-500 text-xs mt-2 flex items-center"
                >
                  • {fieldErrors.username}
                </motion.p>
              )}
              {!fieldErrors.username && formData.username && formData.username.length >= 1 && /^[A-Za-z\s]+$/.test(formData.username) && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-green-500 text-xs mt-2 flex items-center"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Name looks good!
                </motion.p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Required. Only letters A-Z and spaces allowed. 1-100 characters.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
                <span className="text-red-500 ml-1">*</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({formData.email.length}/100)
                </span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="Enter your email address (e.g., example@domain.com)"
                className={`w-full ${fieldErrors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                maxLength={100}
              />
              {fieldErrors.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-red-500 text-xs mt-2 flex items-center"
                >
                  • {fieldErrors.email}
                </motion.p>
              )}
              {!fieldErrors.email && isValidEmail(formData.email) && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-green-500 text-xs mt-2 flex items-center"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Valid email format
                </motion.p>
              )}
              {formData.email && !isValidEmail(formData.email) && !fieldErrors.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-yellow-500 text-xs mt-2 flex items-center"
                >
                  • Enter a complete email address with @ and domain
                </motion.p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Required. Must be a valid email format (6-100 characters).
              </p>
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
                    handleFieldChange('phone', value);
                  }}
                  placeholder="Phone number"
                  className="flex-1"
                  maxLength={10}
                />
              </div>
              {formData.phone.length === 10 && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-green-500 text-xs mt-2 flex items-center"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Valid phone number
                </motion.p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Phone number cannot be changed. Contact support if needed.
              </p>
            </div>
          </div>

          {/* Dynamic Account Information - Auto-updating */}
          <div className={`rounded-lg p-4 border ${verificationInfo.bgColor} ${verificationInfo.borderColor}`}>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Account Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member since:</span>
                <span className="font-medium text-gray-900 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formData.memberSince}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Account age:</span>
                <span className="font-medium text-gray-900">
                  {getAccountAge()} months
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Verification status:</span>
                <span className={`font-medium flex items-center ${verificationInfo.color}`}>
                  {formData.isVerified && <CheckCircle className="w-3 h-3 mr-1" />}
                  {verificationInfo.status}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Profile completeness:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {profileCompleteness}%
                  </span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-purple-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${profileCompleteness}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Dynamic verification guidance */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-xs mt-3 ${verificationInfo.color}`}
            >
              {verificationInfo.description}
            </motion.p>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={!isFormValid || isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Form Validation Summary */}
          {(!isFormValid && Object.values(fieldErrors).some(error => error)) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-sm text-red-600 space-y-1 bg-red-50 p-3 rounded-lg border border-red-200"
            >
              <p className="font-medium mb-2">Please fix the following errors:</p>
              {fieldErrors.username && <p>• {fieldErrors.username}</p>}
              {fieldErrors.email && <p>• {fieldErrors.email}</p>}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}