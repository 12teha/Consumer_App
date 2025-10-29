// import React from 'react';
// import { motion } from 'motion/react';
// import { ScrollArea } from './ui/scroll-area';
// import BackButton from './atoms/BackButton';

// interface TermsConditionsScreenProps {
//   onBack: () => void;
// }

// export default function TermsConditionsScreen({ onBack }: TermsConditionsScreenProps) {
//   const termsContent = [
//     {
//       title: "Terms of Service",
//       sections: [
//         {
//           heading: "1. Acceptance of Terms",
//           content: "By accessing and using OfferBeez application, you accept and agree to be bound by the terms and provision of this agreement."
//         },
//         {
//           heading: "2. Use License",
//           content: "Permission is granted to temporarily download one copy of OfferBeez for personal, non-commercial transitory viewing only."
//         },
//         {
//           heading: "3. Disclaimer",
//           content: "The materials on OfferBeez are provided on an 'as is' basis. OfferBeez makes no warranties, expressed or implied."
//         },
//         {
//           heading: "4. Limitations",
//           content: "In no event shall OfferBeez or its suppliers be liable for any damages arising out of the use or inability to use the materials."
//         },
//         {
//           heading: "5. Accuracy of Materials",
//           content: "The materials appearing on OfferBeez could include technical, typographical, or photographic errors."
//         }
//       ]
//     },
//     {
//       title: "Privacy Policy",
//       sections: [
//         {
//           heading: "1. Information Collection",
//           content: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us."
//         },
//         {
//           heading: "2. Use of Information",
//           content: "We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you."
//         },
//         {
//           heading: "3. Information Sharing",
//           content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent."
//         },
//         {
//           heading: "4. Data Security",
//           content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
//         },
//         {
//           heading: "5. Location Data",
//           content: "We may collect and use your location data to provide location-based services and relevant offers in your area."
//         }
//       ]
//     }
//   ];

//   return (
//     <div className="h-screen bg-background">
//       <BackButton onBack={onBack} />
      
//       <div className="pt-16 pb-6 px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="max-w-2xl mx-auto"
//         >
//           <h1 className="text-2xl font-bold text-center mb-6">
//             Terms & Conditions
//           </h1>

//           <ScrollArea className="h-[calc(100vh-120px)]">
//             <div className="space-y-8 pr-4">
//               {termsContent.map((section, sectionIndex) => (
//                 <motion.div
//                   key={sectionIndex}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: sectionIndex * 0.1 }}
//                   className="bg-white rounded-lg p-6 shadow-sm border"
//                 >
//                   <h2 className="text-xl font-semibold mb-4 text-blue-600">
//                     {section.title}
//                   </h2>
//                   <div className="space-y-4">
//                     {section.sections.map((item, index) => (
//                       <div key={index}>
//                         <h3 className="font-medium mb-2">{item.heading}</h3>
//                         <p className="text-gray-600 text-sm leading-relaxed">
//                           {item.content}
//                         </p>
//                       </div>
//                     ))}
//                   </div>
//                 </motion.div>
//               ))}

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="bg-blue-50 rounded-lg p-6 border border-blue-200"
//               >
//                 <h2 className="text-lg font-semibold mb-2 text-blue-800">
//                   Contact Information
//                 </h2>
//                 <p className="text-blue-700 text-sm">
//                   If you have any questions about these Terms and Conditions or Privacy Policy, 
//                   please contact us at:
//                 </p>
//                 <div className="mt-3 text-sm text-blue-600">
//                   <p>Email: support@offerbeez.com</p>
//                   <p>Phone: +91 80 1234 5678</p>
//                   <p>Address: Bengaluru, Karnataka, India</p>
//                 </div>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 className="text-center text-xs text-gray-500 pb-4"
//               >
//                 Last updated: January 2024
//               </motion.div>
//             </div>
//           </ScrollArea>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect } from 'react';
// import { motion } from 'motion/react';
// import { ScrollArea } from './ui/scroll-area';
// import BackButton from './atoms/BackButton';
// import { ExternalLink } from 'lucide-react';

// interface TermsConditionsScreenProps {
//   onBack: () => void;
//   initialSection?: 'terms' | 'privacy';
// }

// export default function TermsConditionsScreen({ onBack, initialSection }: TermsConditionsScreenProps) {
//   const termsAndPrivacyLinks = {
//     terms: "https://docs.google.com/document/d/1D565jb_K6-7o3QwJQqCr2oWqEzIGUrOULaSCG4kSD58/edit?usp=sharing",
//     privacy: "https://docs.google.com/document/d/1xi_wXx8CFx2lz993cT4Ck1IEZGLqTNi4PddNP7UBcr8/edit?usp=sharing"
//   };

//   // Add this useEffect to handle scrolling to specific sections
//   useEffect(() => {
//     if (initialSection) {
//       const element = document.getElementById(initialSection);
//       if (element) {
//         setTimeout(() => {
//           element.scrollIntoView({ behavior: 'smooth' });
//         }, 100);
//       }
//     }
//   }, [initialSection]);

//   const handleExternalLink = (url: string) => {
//     window.open(url, '_blank', 'noopener,noreferrer');
//   };

//   return (
//     <div className="h-screen bg-background">
//       <BackButton onBack={onBack} />
      
//       <div className="pt-16 pb-6 px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="max-w-2xl mx-auto"
//         >
//           <h1 className="text-2xl font-bold text-center mb-6">
//             Terms & Conditions
//           </h1>

//           {/* Quick Navigation Links */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.1 }}
//             className="flex justify-center space-x-6 mb-6"
//           >
//             <button 
//               onClick={() => handleExternalLink(termsAndPrivacyLinks.terms)}
//               className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm font-medium"
//             >
//               <span>Terms of Service</span>
//               <ExternalLink className="w-3 h-3" />
//             </button>
//             <button 
//               onClick={() => handleExternalLink(termsAndPrivacyLinks.privacy)}
//               className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm font-medium"
//             >
//               <span>Privacy Policy</span>
//               <ExternalLink className="w-3 h-3" />
//             </button>
//             <a 
//               href="#contact"
//               onClick={(e) => {
//                 e.preventDefault();
//                 document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
//               }}
//               className="text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm font-medium"
//             >
//               Contact Info
//             </a>
//           </motion.div>

//           <ScrollArea className="h-[calc(100vh-160px)]">
//             <div className="space-y-8 pr-4">
//               {/* Terms of Service Section */}
//               <motion.div
//                 id="terms"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1 }}
//                 className="bg-white rounded-lg p-6 shadow-sm border scroll-mt-4"
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-semibold text-blue-600">
//                     Terms of Service
//                   </h2>
//                   <button 
//                     onClick={() => handleExternalLink(termsAndPrivacyLinks.terms)}
//                     className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 text-sm font-medium"
//                   >
//                     <span>View Full Document</span>
//                     <ExternalLink className="w-4 h-4" />
//                   </button>
//                 </div>
//                 <div className="space-y-4">
//                   <p className="text-gray-600 text-sm leading-relaxed">
//                     Our Terms of Service govern your use of the OfferBeez application. 
//                     By accessing and using our app, you agree to be bound by these terms.
//                   </p>
//                   </div>
//               </motion.div>

//               {/* Privacy Policy Section */}
//               <motion.div
//                 id="privacy"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.2 }}
//                 className="bg-white rounded-lg p-6 shadow-sm border scroll-mt-4"
//               >
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className="text-xl font-semibold text-blue-600">
//                     Privacy Policy
//                   </h2>
//                   <button 
//                     onClick={() => handleExternalLink(termsAndPrivacyLinks.privacy)}
//                     className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 text-sm font-medium"
//                   >
//                     <span>View Full Document</span>
//                     <ExternalLink className="w-4 h-4" />
//                   </button>
//                 </div>
//                 <div className="space-y-4">
//                   <p className="text-gray-600 text-sm leading-relaxed">
//                     Our Privacy Policy explains how we collect, use, and protect your personal information 
//                     when you use the OfferBeez application.
//                   </p>
//                 </div>
//               </motion.div>

//               {/* Contact Information Section */}
//               <motion.div
//                 id="contact"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.3 }}
//                 className="bg-blue-50 rounded-lg p-6 border border-blue-200 scroll-mt-4"
//               >
//                 <h2 className="text-lg font-semibold mb-2 text-blue-800">
//                   Contact Information
//                 </h2>
//                 <p className="text-blue-700 text-sm">
//                   If you have any questions about these Terms and Conditions or Privacy Policy, 
//                   please contact us at:
//                 </p>
//                 <div className="mt-3 text-sm text-blue-600">
//                   <p>Email: support@offerbeez.com</p>
//                   <p>Phone: +91 80 1234 5678</p>
//                   <p>Address: Bengaluru, Karnataka, India</p>
//                 </div>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.4 }}
//                 className="text-center text-xs text-gray-500 pb-4"
//               >
//                 Last updated: January 2024
//               </motion.div>
//             </div>
//           </ScrollArea>
//         </motion.div>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import BackButton from './atoms/BackButton';

interface TermsConditionsScreenProps {
  onBack: () => void;
  initialSection?: 'terms' | 'privacy';
}

export default function TermsConditionsScreen({ onBack, initialSection }: TermsConditionsScreenProps) {
  const [activeSection, setActiveSection] = useState<'terms' | 'privacy' | 'contact'>(initialSection || 'terms');

  // Add this useEffect to handle scrolling to specific sections
  useEffect(() => {
    if (initialSection) {
      const element = document.getElementById(initialSection);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [initialSection]);

  const handleSectionClick = (section: 'terms' | 'privacy' | 'contact') => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="h-screen bg-background overflow-y-auto">
      {/* Header Section - Fixed but scrolls with content */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="pt-4 px-4">
          <BackButton onBack={onBack} />
        </div>
        
        <div className="px-4 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-2xl font-bold text-center mb-4">
              Terms & Conditions
            </h1>

            {/* Quick Navigation Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center space-x-4 mb-2 flex-wrap gap-2"
            >
              <button 
                onClick={() => handleSectionClick('terms')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  activeSection === 'terms' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Terms of Service
              </button>
              <button 
                onClick={() => handleSectionClick('privacy')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  activeSection === 'privacy' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => handleSectionClick('contact')}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  activeSection === 'contact' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Contact Info
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="px-4 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="space-y-6">
            {/* Terms of Service Section */}
            <motion.div
              id="terms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm border scroll-mt-24"
            >
              <h2 className="text-xl font-semibold text-blue-600 mb-4">
                Terms of Service
              </h2>
              <div className="space-y-4 text-gray-700">
                <section className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
                  <p className="text-sm leading-relaxed mb-3">
                    By accessing and using the OfferBeez application, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this application.
                  </p>
                </section>

                <section className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">2. Use License</h3>
                  <p className="text-sm leading-relaxed mb-3">
                    Permission is granted to temporarily use OfferBeez for personal, non-commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose</li>
                    <li>Attempt to reverse engineer any software contained in OfferBeez</li>
                    <li>Remove any copyright or other proprietary notations</li>
                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                  </ul>
                </section>

                <section className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">3. User Accounts</h3>
                  <p className="text-sm leading-relaxed mb-3">
                    When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding the password and for all activities that occur under your account.
                  </p>
                </section>

                <section className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">4. Content</h3>
                  <p className="text-sm leading-relaxed mb-3">
                    Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content that you post on or through OfferBeez.
                  </p>
                </section>

                <section className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">5. Prohibited Uses</h3>
                  <p className="text-sm leading-relaxed mb-3">
                    You may use OfferBeez only for lawful purposes and in accordance with these Terms. You agree not to use OfferBeez:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>In any way that violates any applicable law or regulation</li>
                    <li>To transmit, or procure the sending of, any advertising or promotional material</li>
                    <li>To impersonate or attempt to impersonate the company, an employee, another user, or any other person</li>
                    <li>To engage in any other conduct that restricts or inhibits anyone's use of the application</li>
                  </ul>
                </section>

                <section className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">6. Termination</h3>
                  <p className="text-sm leading-relaxed">
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                  </p>
                </section>
              </div>
            </motion.div>

            {/* Privacy Policy Section */}
            <motion.div
              id="privacy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-6 shadow-sm border scroll-mt-24"
            >
              <h2 className="text-xl font-semibold text-blue-600 mb-4">
                Privacy Policy
              </h2>
              <div className="space-y-4 text-gray-700">
                <section className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">1. Information We Collect</h3>
                  <p className="text-sm leading-relaxed mb-3">
                    We collect several different types of information for various purposes to provide and improve our Service to you.
                  </p>
                  <h4 className="font-semibold mb-2">Personal Data:</h4>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Phone number</li>
                    <li>Location data</li>
                    <li>Usage data and cookies</li>
                  </ul>
                </section>

                <section className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">2. How We Use Your Information</h3>
                  <p className="text-sm leading-relaxed mb-3">
                    OfferBeez uses the collected data for various purposes:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>To provide and maintain our Service</li>
                    <li>To notify you about changes to our Service</li>
                    <li>To provide customer support</li>
                    <li>To gather analysis or valuable information to improve our Service</li>
                    <li>To monitor the usage of our Service</li>
                    <li>To detect, prevent and address technical issues</li>
                  </ul>
                </section>

                <section className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">3. Data Security</h3>
                  <p className="text-sm leading-relaxed mb-3">
                    The security of your data is important to us. We implement appropriate technical and organizational security measures designed to protect your personal information. However, remember that no method of transmission over the Internet or method of electronic storage is 100% secure.
                  </p>
                </section>

                <section className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">4. Data Retention</h3>
                  <p className="text-sm leading-relaxed mb-3">
                    We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations.
                  </p>
                </section>

                <section className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">5. Your Data Protection Rights</h3>
                  <p className="text-sm leading-relaxed mb-3">
                    You have certain data protection rights, including:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-4">
                    <li>The right to access, update or delete the information we have on you</li>
                    <li>The right of rectification</li>
                    <li>The right to object</li>
                    <li>The right of restriction</li>
                    <li>The right to data portability</li>
                    <li>The right to withdraw consent</li>
                  </ul>
                </section>

                <section className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">6. Children's Privacy</h3>
                  <p className="text-sm leading-relaxed">
                    Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13.
                  </p>
                </section>
              </div>
            </motion.div>

            {/* Contact Information Section */}
            <motion.div
              id="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 rounded-lg p-6 border border-blue-200 scroll-mt-24"
            >
              <h2 className="text-lg font-semibold mb-4 text-blue-800">
                Contact Information
              </h2>
              <div className="space-y-4">
                <p className="text-blue-700 text-sm leading-relaxed">
                  If you have any questions about these Terms and Conditions or Privacy Policy, 
                  please contact us using the information below:
                </p>
                <div className="mt-3 text-sm text-blue-600 space-y-2">
                  <p className="flex items-center">
                    <span className="font-semibold w-20">Email:</span>
                    support@offerbeez.com
                  </p>
                  <p className="flex items-center">
                    <span className="font-semibold w-20">Phone:</span>
                    +91 80 1234 5678
                  </p>
                  <p className="flex items-center">
                    <span className="font-semibold w-20">Address:</span>
                    Bengaluru, Karnataka, India
                  </p>
                </div>
                <div className="mt-4 p-3 bg-white rounded border">
                  <p className="text-xs text-gray-600">
                    <strong>Response Time:</strong> We typically respond to all inquiries within 24-48 hours during business days.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center text-xs text-gray-500 pb-4"
            >
              Last updated: January 2024
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

