import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronDown, Search, HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import BackButton from './atoms/BackButton';

interface FAQScreenProps {
  onBack: () => void;
}

export default function FAQScreen({ onBack }: FAQScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: '🚀',
      questions: [
        {
          id: 1,
          question: 'How do I create an account on OfferBeez?',
          answer: 'Simply download the app, enter your mobile number, verify with OTP, complete your profile, and you\'re ready to start discovering amazing offers!'
        },
        {
          id: 2,
          question: 'Is OfferBeez free to use?',
          answer: 'Yes! OfferBeez is completely free to download and use. We make money through partnerships with stores and businesses, not from our users.'
        },
        {
          id: 3,
          question: 'How do I find offers near me?',
          answer: 'Enable location services in the app, and OfferBeez will automatically show you offers from stores near your location. You can also manually search for specific areas.'
        }
      ]
    },
    {
      title: 'Using Offers',
      icon: '🎁',
      questions: [
        {
          id: 4,
          question: 'How do I redeem an offer?',
          answer: 'Show the offer details on your phone to the store staff, or follow the specific redemption instructions mentioned in each offer. Some offers require you to mention a code.'
        },
        {
          id: 5,
          question: 'Can I use multiple offers at the same store?',
          answer: 'This depends on the store\'s policy. Most stores allow one offer per transaction, but some may allow multiple offers. Check the offer terms for details.'
        },
        {
          id: 6,
          question: 'What if an offer doesn\'t work?',
          answer: 'If you face any issues with an offer, please contact our support team immediately. We\'ll help resolve the issue with the store or provide alternative solutions.'
        }
      ]
    },
    {
      title: 'Account & Privacy',
      icon: '🔒',
      questions: [
        {
          id: 7,
          question: 'Is my personal information safe?',
          answer: 'Yes, we take your privacy seriously. We use industry-standard encryption and never share your personal information with third parties without your consent.'
        },
        {
          id: 8,
          question: 'How do I delete my account?',
          answer: 'You can delete your account by going to Profile > Settings > Account Settings > Delete Account. Note that this action is irreversible.'
        },
        {
          id: 9,
          question: 'Can I change my phone number?',
          answer: 'Yes, you can update your phone number in Profile > Settings > Account Information. You\'ll need to verify the new number with an OTP.'
        }
      ]
    },
    {
      title: 'Technical Issues',
      icon: '⚙️',
      questions: [
        {
          id: 10,
          question: 'The app is not loading properly. What should I do?',
          answer: 'Try restarting the app, checking your internet connection, or updating to the latest version. If the problem persists, contact our support team.'
        },
        {
          id: 11,
          question: 'I\'m not receiving notifications. How can I fix this?',
          answer: 'Check your device notification settings and ensure OfferBeez has permission to send notifications. Also check if Do Not Disturb mode is enabled.'
        },
        {
          id: 12,
          question: 'The location feature is not working. What should I do?',
          answer: 'Ensure location services are enabled for OfferBeez in your device settings. Also check if you have a stable internet connection.'
        }
      ]
    }
  ];

  const toggleExpand = (questionId: number) => {
    setExpandedItems(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const allQuestions = faqCategories.flatMap(category => category.questions);
  const filteredQuestions = searchQuery
    ? allQuestions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allQuestions;

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <BackButton onBack={onBack} />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white px-4 py-3 shadow-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold text-gray-900">FAQ</h1>
          <HelpCircle className="w-6 h-6 text-gray-400" />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search frequently asked questions..."
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {searchQuery ? (
          /* Search Results */
          <div className="p-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-600 mb-4"
            >
              {filteredQuestions.length} result(s) found for "{searchQuery}"
            </motion.p>
            
            <div className="space-y-3">
              {filteredQuestions.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpand(question.id)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 pr-4">{question.question}</h3>
                    <motion.div
                      animate={{ rotate: expandedItems.includes(question.id) ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedItems.includes(question.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                          {question.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Category View */
          <div className="p-4 space-y-6">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * categoryIndex }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                {/* Category Header */}
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon}</span>
                    <h2 className="text-lg font-semibold">{category.title}</h2>
                  </div>
                </div>

                {/* Questions */}
                <div className="divide-y divide-gray-100">
                  {category.questions.map((question, questionIndex) => (
                    <div key={question.id}>
                      <button
                        onClick={() => toggleExpand(question.id)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-medium text-gray-900 pr-4">{question.question}</h3>
                        <motion.div
                          animate={{ rotate: expandedItems.includes(question.id) ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </motion.div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedItems.includes(question.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                              {question.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 mb-6 bg-blue-50 rounded-xl p-4 border border-blue-200"
        >
          <div className="text-center mb-4">
            <h3 className="font-semibold text-blue-900 mb-2">Still need help?</h3>
            <p className="text-sm text-blue-700">
              Can't find what you're looking for? Our support team is here to help!
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 flex items-center justify-center space-x-2"
              onClick={() => window.open('mailto:support@offerbeez.in')}
            >
              <Mail className="w-4 h-4" />
              <span>Email Us</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-100 flex items-center justify-center space-x-2"
              onClick={() => window.open('tel:+918748990815')}
            >
              <Phone className="w-4 h-4" />
              <span>Call Us</span>
            </Button>
          </div>
          
          <div className="text-center mt-3 space-y-1">
            <p className="text-xs text-blue-600">support@offerbeez.in</p>
            <p className="text-xs text-blue-600">+91 8748990815</p>
            <p className="text-xs text-blue-500">Mon-Fri: 9 AM - 6 PM</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}