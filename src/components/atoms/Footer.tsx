import React, { useState } from 'react';
import { Facebook, Twitter, Youtube, Instagram } from 'lucide-react';
import ContactUsPopup from './ContactUsPopup';

interface FooterProps {
  onNavigate?: (screen: string, params?: any) => void;
}

const Footer = ({ onNavigate }: FooterProps) => {
  const [showContactPopup, setShowContactPopup] = useState(false);
  return (
    <footer className="text-white-100 pt-8 pb-24 mt-8 w-full" style={{
      background: "linear-gradient(to right,rgb(173, 7, 148),rgb(90, 118, 230),rgb(51, 61, 239))",
      borderRadius: "10px",
      paddingTop: "20px"
    }}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-6">
          {/* Help Section */}
          <div>
            <h3 className="text-black font-bold text-sm mb-3">HELP</h3>
            <ul className="space-y-2 text-xs">
             {/*  <li><a href="#" className="text-white-200 hover:text-white transition-colors">Payments</a></li> */}
             {/* <li><a href="#" className="text-white-200 hover:text-white transition-colors">Shipping</a></li> */}
              <li>
                <button
                  onClick={() => setShowContactPopup(true)}
                  className="text-white-200 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('faq')}
                  className="text-white-200 hover:text-white transition-colors text-left cursor-pointer"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Consumer Policy Section */}
          <div>
            <h3 className="text-black font-bold text-sm mb-3">CONSUMER POLICY</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate?.('terms', { initialSection: 'terms' })}
                  className="text-white-200 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
             {/* <li><a href="#" className="text-white-200 hover:text-white transition-colors">Security</a></li> */}
              <li>
                <button
                  onClick={() => onNavigate?.('terms', { initialSection: 'privacy' })}
                  className="text-white-200 hover:text-white transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
             {/* <li><a href="#" className="text-white-200 hover:text-white transition-colors">Sitemap</a></li> */}
            </ul>
          </div>

          {/* Contact & Social Section */}
          <div>
            <h3 className="text-black font-bold text-sm mb-3">REGISTERED OFFICE ADDRESS</h3>
            <p className="text-xs mb-4 leading-relaxed text-gray-200">
              Venturebiz Promotions Private Limited,  <br />#2085/16, 2nd Floor, Spoorthi, Wilson Garden Society Layout, <br /> Puttenahalli Main Road, JP Nagar 7th Phase, Bangalore- 560078.   <br />
            
            </p>

              <h3 className="text-black font-bold text-sm mb-3">SOCIAL MEDIA</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/people/Offerbeezin/61580276036568/" className="text-white-200 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://x.com/offerbeez_in" className="text-white-200 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/channel/UCMosuPwil9CUoNf2XxEczgw" className="text-white-200 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/offerbeez.in/?hl=en" className="text-white-200 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 pt-4 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-200">
            <div className="mb-2 md:mb-0">
              <span>© 2025 OfferBeez.com</span>
            </div>
            {/* <div className="flex items-center space-x-2"> */}
             {/* <span>Payment Methods:</span> */}  
              <div className="flex space-x-1">
               {/* <div className="bg-white px-2 py-1 rounded text-xs font-semibold text-gray-900">VIS</div> */}
                {/* <div className="bg-white px-2 py-1 rounded text-xs font-semibold text-gray-900">MC</div> */}
                {/* <div className="bg-white px-2 py-1 rounded text-xs font-semibold text-gray-900">UPI</div> */}
              </div>
           {/* </div> */}
          </div>
        </div>
      </div>

      {/* Contact Us Popup */}
      <ContactUsPopup isOpen={showContactPopup} onClose={() => setShowContactPopup(false)} />
    </footer>
  );
};

export default Footer;
