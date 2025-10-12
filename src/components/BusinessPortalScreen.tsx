import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, Users, TrendingUp, Star, ArrowRight, CheckCircle, Phone, Mail, ExternalLink, Download } from 'lucide-react';
import BackButton from './atoms/BackButton';

interface BusinessPortalScreenProps {
  onBack: () => void;
}

export default function BusinessPortalScreen({ onBack }: BusinessPortalScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const features = [
    { icon: Building2, title: "Business Dashboard", description: "Manage your offers and track performance" },
    { icon: Users, title: "Customer Analytics", description: "Understand your customer behavior" },
    { icon: TrendingUp, title: "Sales Insights", description: "Boost your revenue with data-driven insights" },
    { icon: Star, title: "Premium Visibility", description: "Get featured in top search results" }
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '₹999',
      period: '/month',
      features: ['Up to 5 offers', 'Basic analytics', 'Email support', 'Standard listing']
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₹2499',
      period: '/month',
      features: ['Unlimited offers', 'Advanced analytics', 'Priority support', 'Featured listing', 'Social media integration']
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '₹4999',
      period: '/month',
      features: ['Everything in Premium', 'Custom branding', 'API access', 'Dedicated account manager', 'Multi-location support']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <BackButton onBack={onBack} />
      
      <div className="pt-16 pb-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Building2 className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-4"
            >
              OfferBeez Business Portal
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Transform your business with our powerful platform. Reach more customers, 
              create compelling offers, and grow your revenue in Bengaluru.
            </motion.p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white rounded-xl p-6 text-center shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Pricing Plans */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`bg-white rounded-xl p-6 border-2 transition-all cursor-pointer ${
                    selectedPlan === plan.id 
                      ? 'border-blue-500 shadow-lg scale-105' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl font-bold text-blue-600">{plan.price}</span>
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {selectedPlan === plan.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-center"
                    >
                      <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 mx-auto hover:shadow-lg transition-shadow"
            >
              <span>Get Started Today</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <p className="text-sm text-gray-600 mt-4">
              Join 500+ businesses already growing with OfferBeez
            </p>
          </motion.div>

          {/* Support & Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-white rounded-xl p-6 border shadow-sm"
          >
            <h2 className="text-xl font-bold text-center mb-6">Need Help Getting Started?</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Support Contact */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3">Contact Our Support Team</h3>
                
                <motion.a
                  href="tel:+918748990815"
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Call Support</p>
                    <p className="text-sm text-green-600">+91 8748 990 815</p>
                  </div>
                </motion.a>

                <motion.a
                  href="mailto:business@offerbeez.in"
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email Support</p>
                    <p className="text-sm text-blue-600">business@offerbeez.in</p>
                  </div>
                </motion.a>
              </div>

              {/* Business Application */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Application Links</h3>
                
                <motion.a
                  href="https://partner.offerbeez.in/application"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <ExternalLink className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Business Partner Application</p>
                    <p className="text-sm text-purple-600">Apply online in 5 minutes</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </motion.a>

                <motion.a
                  href="https://app.offerbeez.in/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Download Our Business App</p>
                    <p className="text-sm text-orange-600">Manage your business on the go</p>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </motion.a>
              </div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Our business support team is available Monday to Friday, 9:00 AM to 6:00 PM IST
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}