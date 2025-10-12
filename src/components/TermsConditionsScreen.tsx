import React from 'react';
import { motion } from 'motion/react';
import { ScrollArea } from './ui/scroll-area';
import BackButton from './atoms/BackButton';

interface TermsConditionsScreenProps {
  onBack: () => void;
}

export default function TermsConditionsScreen({ onBack }: TermsConditionsScreenProps) {
  const termsContent = [
    {
      title: "Terms of Service",
      sections: [
        {
          heading: "1. Acceptance of Terms",
          content: "By accessing and using OfferBeez application, you accept and agree to be bound by the terms and provision of this agreement."
        },
        {
          heading: "2. Use License",
          content: "Permission is granted to temporarily download one copy of OfferBeez for personal, non-commercial transitory viewing only."
        },
        {
          heading: "3. Disclaimer",
          content: "The materials on OfferBeez are provided on an 'as is' basis. OfferBeez makes no warranties, expressed or implied."
        },
        {
          heading: "4. Limitations",
          content: "In no event shall OfferBeez or its suppliers be liable for any damages arising out of the use or inability to use the materials."
        },
        {
          heading: "5. Accuracy of Materials",
          content: "The materials appearing on OfferBeez could include technical, typographical, or photographic errors."
        }
      ]
    },
    {
      title: "Privacy Policy",
      sections: [
        {
          heading: "1. Information Collection",
          content: "We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us."
        },
        {
          heading: "2. Use of Information",
          content: "We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you."
        },
        {
          heading: "3. Information Sharing",
          content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent."
        },
        {
          heading: "4. Data Security",
          content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
        },
        {
          heading: "5. Location Data",
          content: "We may collect and use your location data to provide location-based services and relevant offers in your area."
        }
      ]
    }
  ];

  return (
    <div className="h-screen bg-background">
      <BackButton onBack={onBack} />
      
      <div className="pt-16 pb-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-2xl font-bold text-center mb-6">
            Terms & Conditions
          </h1>

          <ScrollArea className="h-[calc(100vh-120px)]">
            <div className="space-y-8 pr-4">
              {termsContent.map((section, sectionIndex) => (
                <motion.div
                  key={sectionIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm border"
                >
                  <h2 className="text-xl font-semibold mb-4 text-blue-600">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.sections.map((item, index) => (
                      <div key={index}>
                        <h3 className="font-medium mb-2">{item.heading}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 rounded-lg p-6 border border-blue-200"
              >
                <h2 className="text-lg font-semibold mb-2 text-blue-800">
                  Contact Information
                </h2>
                <p className="text-blue-700 text-sm">
                  If you have any questions about these Terms and Conditions or Privacy Policy, 
                  please contact us at:
                </p>
                <div className="mt-3 text-sm text-blue-600">
                  <p>Email: support@offerbeez.com</p>
                  <p>Phone: +91 80 1234 5678</p>
                  <p>Address: Bengaluru, Karnataka, India</p>
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
          </ScrollArea>
        </motion.div>
      </div>
    </div>
  );
}