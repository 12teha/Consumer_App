// import React, { useEffect, useState } from 'react';
// import { motion } from 'motion/react';
// import BackButton from './atoms/BackButton';

// interface TermsConditionsScreenProps {
//   onBack: () => void;
//   initialSection?: 'terms' | 'privacy';
// }

// export default function TermsConditionsScreen({ onBack, initialSection }: TermsConditionsScreenProps) {
//   const [activeSection, setActiveSection] = useState<'terms' | 'privacy' | 'contact'>(initialSection || 'terms');

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

//   const handleSectionClick = (section: 'terms' | 'privacy' | 'contact') => {
//     setActiveSection(section);
//     const element = document.getElementById(section);
//     if (element) {
//       setTimeout(() => {
//         element.scrollIntoView({ behavior: 'smooth' });
//       }, 100);
//     }
//   };

//   return (
//     <div className="h-screen bg-background flex flex-col">
//       {/* Header Section - Fixed */}
//       <div className="bg-white sticky shadow-sm flex-shrink-0">
//         <div className="pt-4 px-4">
//           <BackButton onBack={onBack} />
//         </div>
        
//         <div className="px-4 pb-4">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="max-w-4xl mx-auto"
//           >
//             <h1 className="text-2xl font-bold text-center mb-4">
//               Terms & Conditions
//             </h1>

//             {/* Quick Navigation Links */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.1 }}
//               className="flex justify-center space-x-4 mb-2 flex-wrap gap-2"
//             >
//               <button 
//                 onClick={() => handleSectionClick('terms')}
//                 className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
//                   activeSection === 'terms' 
//                     ? 'bg-blue-600 text-white' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Terms of Service
//               </button>
//               <button 
//                 onClick={() => handleSectionClick('privacy')}
//                 className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
//                   activeSection === 'privacy' 
//                     ? 'bg-blue-600 text-white' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Privacy Policy
//               </button>
//               <button 
//                 onClick={() => handleSectionClick('contact')}
//                 className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
//                   activeSection === 'contact' 
//                     ? 'bg-blue-600 text-white' 
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 Contact Info
//               </button>
//             </motion.div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Scrollable Content */}
//       <div className="flex-1 overflow-y-auto">
//       <div className="px-4 pb-6">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="max-w-4xl mx-auto"
//         >
//           <div className="space-y-6">
//             {/* Terms of Service Section */}
//             <motion.div
//               id="terms"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.1 }}
//               className="bg-white rounded-lg p-6 shadow-sm border scroll-mt-24"
//             >
//               <div className="text-center mb-6">
//                 <h2 className="text-xl font-semibold text-blue-600 mb-2">
//                   Terms of Service
//                 </h2>
//                 <p className="text-sm text-gray-500">
//                   Version 1.0 | Last updated: 4th November 2025
//                 </p>
//               </div>
              
//               <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
//                 <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
//                   <p className="text-sm">
//                     This document is an electronic record and published in accordance with the provisions of the Information Technology Act, 2000, and the rules thereunder and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and generated by a computer system and does not require any physical or digital signatures.
//                   </p>
//                 </div>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">Terms of Use:</h3>
//                   <p className="mb-3">
//                     The websites www.OfferBeez.in and www.Venturebiz.in (the "Website") and the mobile application 'OfferBeez' (the App) (the Website and App are collectively referred to as the "Platform") are owned, operated and managed by the OfferBeez Marketplace Private Limited, a private limited company incorporated in accordance with the provisions of the Indian Companies Act, 2013, and having its registered office situated at #2085/16, 2nd Floor, Spoorthi, Puttenahalli Main Road, JP Nagar 7th Phase, Bangalore-560078.
//                   </p>
//                   <p className="mb-3">
//                     These terms of use ("Terms") govern your use of the Platform, and for the purpose of these Terms, Venturbiz Promotions Private Limited, including its subsidiaries, its holding company, and its affiliates, may, wherever the context so requires, be also referred to as "OfferBeez", "Company", "We", "Us", or "Our", and the terms "You", "Your", or "User" refer to the user of the Platform. We value the trust you have placed in us, and hence, we maintain reasonable security standards for securing the transactions and your information.
//                   </p>
//                   <p className="mb-3">
//                     Please read these terms carefully before you use the platform. If you do not agree to these terms, you may not use the offers on the platform, and we request you uninstall the app and not access the platform. By even merely using/accessing the Platform, You shall be contracting with OfferBeez, and You signify Your acceptance of these Terms and other OfferBeez policies (including but not limited to the cancellation & refund terms and published privacy policy ('Privacy Notice') as posted on the Platform and amended from time to time), which takes effect on the date on which You use the Platform and thereby create a legally binding agreement to abide by the same. Further, by furnishing Your personal information, You consent to OfferBeez accessing Your personal information for the purpose of enabling transactions. You also agree that you are interested in availing the offers through the platform in accordance with these terms.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">1. General</h3>
//                   <p className="mb-3">
//                     a) OfferBeez retains an unconditional right to modify or amend these Terms. You can determine when these Terms were last modified by referring to the 'Last Updated' legend above. You can access the latest version of these Terms at any given time on the Platform. You should regularly review the terms on the platform. OfferBeez reserves the right to amend, suspend, discontinue or add any or all Offers without prior notice and can add or remove relevant terms and conditions, if necessary.
//                   </p>
//                   <p className="mb-3">
//                     b) Any updating of the terms as a consequence of changes in legal and regulatory compliances shall be made in compliance thereof. Your continued use of and access to the Platform shall be your consent to any changes made by us in these terms. In the event the modified terms are not acceptable to you, you should discontinue accessing the platform.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">2. Access to Offers</h3>
//                   <p className="mb-3">
//                     a) OfferBeez is a digital advertising platform that allows the businesses to publish their offers/advertisements. Consumers can view the products (defined hereunder) and offers offered for sale by these sellers either in general or specific to the locations of the consumers.
//                   </p>
//                   <p className="mb-3">
//                     b) OfferBeez is only responsible for creating the advertising platform for businesses and users to see the ads. The company is not responsible for the offer advertised by businesses. The transactions are done offline and between the business and user.
//                   </p>
//                   <p className="mb-3">
//                     c) OfferBeez is not a party to or in control of in any manner any transaction between the platform's users and sellers.
//                   </p>
//                   <p className="mb-3">
//                     d) You acknowledge that the Platform allows You to avail a personal, limited, non-exclusive, non-transferable, and revocable privilege to access and use the Platform for the purposes of seeing the advertisement on consumer goods or services businesses and individuals for grocery, apparel, electronics, health and wellness products, including prepared foods and beverages (Café orders), pet care, etc. (collectively, "Product(s)") from the Sellers on a business to consumer (B2C). The registered businesses may be required to furnish additional details of their business, including, without limitation, business name, GSTIN, licences/registrations issued by government authorities and/or any other information that may be required by OfferBeez. The user shall not be responsible for the accuracy of the GSTIN and legal entity name. OfferBeez disclaims any liabilities arising out of incorrect details.
//                   </p>
//                   <p className="mb-3">
//                     e) Businesses publishing their offers are solely responsible for all the details of the offer, including the business name, location, actual offer, pricing, discounts, quality, availability, etc.
//                   </p>
//                   <p className="mb-3">
//                     f) The aforesaid revocable privilege to access does not include/permit resale or commercial use of the Platform or its Content (as defined below) in any manner. The Sellers may, at their discretion, add, modify or remove any of the Offers listed above from time to time without notice.
//                   </p>
//                   <p className="mb-3">
//                     g) The Sellers and/or OfferBeez may also make applicable, at its discretion, additional terms and conditions specific to any category or section of Products or Offers in addition to these Terms, and Your purchase of any of such category or section of Products or Offers shall also be governed by such additional terms and conditions. OfferBeez reserves the right to provide the Offers in any area or city in India, as may be determined by OfferBeez in its sole discretion. Before applying or registering for availing any of the Offers, We request You to please check if the Offers are available in Your area or city.
//                   </p>
//                   <p className="mb-3">
//                     h) Offers are ranked organically unless promoted through advertisements. Ranking is based on popularity indicators like impressions, user preferences, relevance, add-to-cart actions, etc. Newly launched products receive a temporary visibility boost to enhance exposure and assess popularity. OfferBeez does not: (i) adopt any 'unfair trade practices' on the Platform or otherwise with respect to its Offers; (ii) discriminate between Users of the same class or make any arbitrary classification of the Users; and (iii) discriminate between the third-party delivery service providers.
//                   </p>
//                   <p className="mb-3">
//                     i) OfferBeez functions as an advertising platform and acts as a facilitator between users and sellers on the platform. At no point does OfferBeez take possession of products offered by sellers, nor does it hold any rights, title or interest in those products and offers. OfferBeez is not liable for any obligations related to non-performance or breach of contracts between users and sellers, as that is a bilateral arrangement between you and the seller. Furthermore, OfferBeez is neither responsible for poor or delayed product or service performance nor for issues arising from products that are out of stock or unavailable.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">3. Terms and conditions applicable for a user who is a registered business:</h3>
//                   <ul className="list-disc list-inside space-y-2 ml-4">
//                     <li>The User represents and undertakes that the documents and information provided are genuine and complete</li>
//                     <li>That the User shall not act as an agent of OfferBeez.</li>
//                     <li>To adhere to such other terms as may be applicable or displayed on the platform from time to time.</li>
//                   </ul>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">4. Age and Eligibility</h3>
//                   <p className="mb-3">
//                     The Products and Offers are minors, i.e., persons under the age of 18 (eighteen) years, undischarged insolvents, or any Users who are not competent to enter into a contract under the Indian Contract Act, 1872, unless otherwise provided hereunder or to anyone previously suspended or removed by OfferBeez from availing the Products or Offers or accessing the Platform. You hereby represent that you are:
//                   </p>
//                   <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
//                     <li>Of legal age to form a binding contract,</li>
//                     <li>Not a person barred from receiving the offers from the platform under the applicable laws;</li>
//                     <li>Competent to enter into a binding contract</li>
//                     <li>Have not been previously suspended or removed or disqualified for any reason from the platform. If you are under the age of 18, you shall use and access the platform only with the express consent of a parent or guardian and under their supervision.</li>
//                   </ul>
//                   <p className="mb-3">
//                     e) You shall not make negative, defamatory, misleading, deceptive, or libellous remarks about us or our brand, including Offerbeez and its agnates and cognates, on the platform or otherwise, or take any actions that could harm Offerbeez's reputation or dilute its trademarks. Additionally, You will not impose an excessive load on the Platform's infrastructure or Our systems and networks
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">5. User Account and Security:</h3>
//                   <p className="mb-3">
//                     a) In order to access the offers of the platform, you will have to register and create an account on the platform by providing details as may be required ("Account"). When you use the platform, OfferBeez may collect personal information such as your name, email, age, photograph, address, mobile number, and contact details, and also documents pertaining to the same. This includes demographic information like gender, occupation, and education, as well as your activity on the platform, such as visited pages, clicked links, and transaction details, including financial information needed to provide offers and manage the platform effectively.
//                   </p>
//                   <p className="mb-3">
//                     b) You are solely responsible for the information you provide to us. You shall ensure and confirm that the account information and all information provided by you is complete, accurate and up-to-date. If there is any change in the account information, or if any information is found to be incomplete or incorrect, you shall promptly update your account information on the platform or request OfferBeez for information revision or update. If the information provided by you is untrue, inaccurate, unauthorised, not current, or incomplete (or becomes untrue, inaccurate, not current, or incomplete), OfferBeez reserves the right to refuse any and all the offers if OfferBeez has reasonable grounds to suspect that such information is untrue, inaccurate, not current, or incomplete or for any reasons of government policy of state and central or anything offensive or hurtful on religious grounds or anything that OfferBeez thinks is not in the right sense of promotion of the business. OfferBeez reserves the right to refuse access to the Platform at any time without notice.
//                   </p>
//                   <p className="mb-3">
//                     c) Confidentiality of the account credentials shall be your responsibility. OfferBeez disclaims any liability for losses due to unauthorised access of your account.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">6. Price of Products and Offers:</h3>
//                   <p className="mb-3">
//                     a) The prices for products and offers listed by sellers on the platform are determined entirely by the sellers themselves, and OfferBeez does not participate in or influence this pricing process in any manner. The prices of each of the products and offers may vary due to various factors, and you may check the price with the business before purchasing the product.
//                   </p>
//                   <p className="mb-3">
//                     b) All the products listed on the platform will be sold at Indian Rupees, either at Maximum Retail Price (MRP) (inclusive of all taxes) or at a discounted price unless otherwise specified directly by the business. The prices of the Products and Offers are an offer for sale by the Sellers and may be modified by the Sellers from time to time without any prior notice. OfferBeez endeavour to display the products and offers at the most accurate prices possible on the platform. There may be inadvertent errors with respect to the price and other information of the products or offers. You may bring to Our notice of such errors and We shall effect necessary corrections
//                   </p>
//                   <p className="mb-3">
//                     c) The Users will be informed about all the costs that may be levied on the purchase of the Products or Offers on the platform
//                   </p>
//                   <p className="mb-3">
//                     d) The expression 'Lowest Prices' pertains to the computation of average prices for all Products and Offers offered for sale by the Sellers on the Platform (in comparison to competitors in the quick commerce segment for groceries, in most of the cases) and are subject to availability of stocks. OfferBeez expressly disclaims any liability associated with the individual products or offers sold on the platform by the sellers.
//                   </p>
//                   <p className="mb-3">
//                     e) Alcoholic beverages, tobacco products and other banned products are strictly not to be sold by the businesses either directly or indirectly or through reference or in any concealed manner to provide any leads to banned products or anything that is not approved by the government.
//                   </p>
//                   <p className="mb-3">
//                     f) Businesses and consumers are directly responsible in the event of such activities, and OfferBeez is not responsible for the legalities. OfferBeez will make all coordination and efforts with legal authorities to ensure the platform is not used for any banned activities.
//                   </p>
//                   <p className="mb-3">
//                     g) Terms and Conditions for Purchase of Pharmaceutical Products and Telemedicine Consultations - OfferBeez's Role and Disclaimer of Liability - OfferBeez operates solely as a digital advertising marketplace platform and does not sell pharmaceutical products. The medical stores may post their offers and discounts as per applicable laws and permissions or for their locations to help get discovered.
//                   </p>
//                   <p className="mb-3">
//                     h) Any medical-related services are solely the responsibility of the individual service providers, like telemedicine consultation, etc. OfferBeez does not offer medical advice or consultations on health matters. All materials accessible through the Platform, including articles, blogs, images, and other informational content, serve purely academic purposes and do not substitute for direct professional healthcare advice. Telemedicine consultations available on the platform are offered through independent contractors ("Telemedicine Consultants") engaged by the user solely at their discretion. The opinions and guidance provided by telemedicine users are encouraged to consult in-person healthcare providers as needed to confirm any information or recommendations received from telemedicine consultants.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">7. User care:</h3>
//                   <p className="mb-3">
//                     The user acknowledges and agrees that OfferBeez shall not be held liable for. The quality of the seller's offers or products, or any issues arising from offers provided by third-party delivery service providers that do not meet user expectations, potentially resulting in loss, harm, or damage.
//                   </p>
//                   <p className="mb-3">
//                     a) The non-availability of products or offers. Incorrect orders fulfilled by the seller, or any liability associated with products sold by the seller.
//                   </p>
//                   <p className="mb-3">
//                     b) The information about products and the associated catalogue, including pricing, displayed on the platform is provided by the sellers. OfferBeez cannot be held liable for any changes, correctness or errors or omissions of the information, or unavailability of these products and offers.
//                   </p>
//                   <p className="mb-3">
//                     c) OfferBeez is not and cannot be a party to any transaction between consumers and sellers or have any control, involvement or influence over the products purchased/offers availed by you from such sellers. You acknowledge and agree that OfferBeez shall not, at any time, have any ownership, control, and/or title to any Product(s), which is subject to a bipartite sale and purchase transaction between you and the relevant seller.
//                   </p>
//                   <p className="mb-3">
//                     d) OfferBeez does not provide any warranty or guarantee with respect to the products and/or offers offered for sale on the platform and disclaims any liability with respect to the manufacturing defects, quality, taste, or performance of the products/offers sold.
//                   </p>
//                   <p className="mb-3">
//                     e) All commercial and contractual arrangements regarding the products and offers offered for sale are solely between users and sellers. These arrangements encompass various terms, including but not limited to pricing, product and service quality, applicable taxes, delivery and other fees, payment conditions, warranties (if any), and after-sales support.
//                   </p>
//                   <p className="mb-3">
//                     f) OfferBeez may, however, provide support offers to sellers in respect to order fulfilment, mode of payment, payment collection, customer support, technology and other ancillary offers, pursuant to independent contracts executed between OfferBeez and the sellers.
//                   </p>
//                   <p className="mb-3">
//                     g) OfferBeez does not guarantee or endorse the specifics of any, including aspects like legal ownership, creditworthiness, or identity. We recommend that You conduct Your own due diligence to verify the legitimacy of any seller You choose to engage with on the platform and exercise Your discretion. All offers from Sellers and third parties are governed by their respective terms and conditions, and OfferBeez assumes no responsibility for these offers. OfferBeez makes the best attempt to review the data provided by the business but cannot validate the information provided. The user is at their own discretion to verify and validate the business before buying or making any purchases.
//                   </p>
//                   <p className="mb-3">
//                     h) You agree and understand that the product images are representations of the product and not actual images of the product sold to you, and you shall read the physical product label for the calorific and nutritional value, using instructions, batch, manufacture date, use-by date/shelf life, content, weight, manufacturer and the customer support details, as may be relevant, before consumption of the products, including but not limited to café orders.
//                   </p>
//                   <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-3">
//                     <p className="text-sm font-semibold text-red-800">
//                       WHILE EVERY REASONABLE EFFORT IS MADE TO MAINTAIN ACCURACY OF INFORMATION ON THE PLATFORM, THE ACTUAL PRODUCT MAY CONTAIN MORE AND/OR DIFFERENT INFORMATION THAN WHAT IS SHOWN ON THE PLATFORM. IT IS RECOMMENDED TO CHECK WITH THE BUSINESS AND ACTUAL PRODUCT AND DIRECTLY REFER TO THE INFORMATION PRESENTED ON THE ACTUAL PRODUCT BY THE BUSINESS.
//                     </p>
//                   </div>
//                   <p className="mb-3">
//                     i) As a result of such checks, if OfferBeez is not satisfied with the credibility of the user or genuineness , it will have the right to reject the order(s) placed by such users or disable their access to the platform. Transactions on the Platform may be delayed, suspended, or cancelled at OfferBeez's sole discretion for any reason (to maintain the integrity, security, and equitable usage of the Platform), including but not limited to suspicious activities, concerns regarding the user's authenticity or behaviour, unusually high transaction volumes, safety concerns, or to ensure the fair use of the Platform.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">8. Beware of fraud:</h3>
//                   <p className="mb-3">
//                     Please do not share your debit/credit card number, CVV number, OTP, UPI/ATM pin and other sensitive information with anyone claiming to be an OfferBeez representative. OfferBeez or its authorised representatives will NEVER ask you to share the aforesaid details. Beware of fraudsters, and please report incidents immediately to your bank, the nearest police station and at https://cybercrime.gov.in/.
//                   </p>
//                   <p className="mb-3">
//                     a) For assistance on a OfferBeez order or refund-related issues, click on the 'Get Help' or 'Contact Us' section on the app or Contact support@offerbeez.in
//                   </p>
//                   <p className="mb-3">
//                     b) Please exercise caution to verify the portals/website links claiming to be OfferBeez or a lookalike or a payment link shared over social media or a social messaging app claiming to be OfferBeez discounts or offers and proactive calls from unauthorised numbers or unauthorised social media accounts requesting personal/financial information.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">9. Use of Platform:</h3>
//                   <p className="mb-3">
//                     Subject to compliance with the Terms, OfferBeez hereby grants you a personal, non-exclusive, non-transferable, limited, revocable privilege to access and use the Platform. You agree to use the Platform only:
//                   </p>
//                   <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
//                     <li>For purposes that are permitted by the Terms</li>
//                     <li>In accordance with any applicable law, regulation or generally accepted practices or guidelines</li>
//                     <li>For availing the offers through the platform. You agree not to engage in activities that may adversely affect the use of the Platform by Offerbeez and/or other users.</li>
//                   </ul>
//                   <p className="mb-3">
//                     a) You agree that the Platform or any portion of the Platform shall not be reproduced, duplicated, copied, sold, resold or otherwise exploited for commercial purposes.
//                   </p>
//                   <p className="mb-3">
//                     b) You agree to not frame or utilise the framing techniques to enclose any trademark, logo or any other proprietorship information of the platform.
//                   </p>
//                   <p className="mb-3">
//                     c) You agree not to access (or attempt to access) the Platform by any means other than through the interface that is provided by OfferBeez. You shall not use any deep link, robot, spider or other automatic device, program, algorithm or methodology, or any similar or equivalent manual process, to access, acquire, copy or monitor any portion of the Platform or Content, or in any way reproduce or circumvent the navigational structure or presentation of the Platform, materials or any Content, to obtain or attempt to obtain any materials, documents or information through any means not specifically made available through the Platform.
//                   </p>
//                   <p className="mb-3">
//                     d) You undertake not to host, display, upload, modify, publish, transmit, store, update or share any information that:
//                   </p>
//                   <ol className="list-decimal list-inside space-y-2 ml-6 mb-3">
//                     <li>Belongs to another person and to which the User does not have any right</li>
//                     <li>Is defamatory, obscene, pornographic, paedophilic, invasive of another's privacy, including bodily privacy, insulting, or harassing on the basis of gender; libellous; racially or ethnically objectionable; relating or encouraging money laundering or gambling; or otherwise inconsistent with or contrary to the laws in force</li>
//                     <li>Is harmful to child;</li>
//                     <li>Infringes any patent, trademark, copyright, or other proprietary rights;</li>
//                     <li>Violates any law for the time being in force;</li>
//                     <li>Impersonates another person;</li>
//                     <li>Threatens the unity, integrity, defence, security or sovereignty of India, friendly relations with foreign States, or public order, or causes incitement to the commission of any cognisable offence, or prevents investigation of any offence or is insulting other nation;</li>
//                     <li>Contains software virus or any other computer code, file or program designed to interrupt, destroy, or limit the functionality of any computer resource;</li>
//                     <li>Is patently false and untrue, and is written or published in any form, with the intent to mislead or harass a person, entity, or agency for financial gain or to cause any injury to any person;</li>
//                   </ol>
//                   <p className="mb-3">
//                     e) Disrupt or interfere with the security of, or otherwise cause harm to, the Platform, systems resources, accounts, passwords, servers, or networks connected to or accessible through the Platform or any affiliated or linked sites;
//                   </p>
//                   <p className="mb-3">
//                     f) Violate the Terms contained herein or elsewhere; and
//                   </p>
//                   <p className="mb-3">
//                     g) Reverse engineer, modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information or software obtained from the Platform.
//                   </p>
//                   <p className="mb-3">
//                     h) You shall solely be responsible for maintaining the necessary computer equipment, gadgets and internet connections that may be required to access, use and transact on the platform.
//                   </p>
//                   <p className="mb-3">
//                     i) You understand and acknowledge that by using the Platform or any of the Offers, you may encounter Content that may be deemed by some Users to be offensive, indecent, or objectionable, which Content may or may not be identified as such. You agree to use the Platform and any Offers at your sole risk and that to the fullest extent permitted under applicable law. Offerbeez shall have no liability to you for content that may be deemed offensive, indecent, or objectionable to you.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">10. Intellectual Property Rights related:</h3>
//                   <p className="mb-3">
//                     a) - The Non-Offer-related content – the platform and the processes, and their selection and arrangement, including but not limited to texts, videos, graphics, user interfaces, visual interfaces, sounds and music (if any), artwork and computer code (and any combinations thereof) (collectively, the "Content") on the platform – is either owned by or licensed by OfferBeez, and the design, structure, selection, coordination, expression, look and feel and arrangement of such Content are protected by copyright, patent and trademark laws and various other intellectual property rights.
//                   </p>
//                   <p className="mb-3">
//                     b) The trademarks, logos and service marks displayed on the Platform ("Marks") are the licensed property of OfferBeez . You are not permitted to use the Marks without the prior consent of OfferBeez. Access to or use of the Platform does not authorise any party to use trademarks, logos, or any other mark in any manner.
//                   </p>
//                   <p className="mb-3">
//                     c) OfferBeez disclaims holding any right, title, or interest in and to the intellectual property rights arising out of or associated with the products and offers sold by the Sellers on the Platform.
//                   </p>
//                   <p className="mb-3">
//                     d) References on the platform of any name, mark, offer or product of third parties have been provided for your convenience and in no way constitute an endorsement, sponsorship or recommendation, whether express or implied.
//                   </p>
//                   <p className="mb-3">
//                     e) Where the platform contains links to other sites provided by third parties, these links are provided for information only. We have no visibility or control over the contents on or available through those sites, and You acknowledge and agree that We have no liability for any such content.
//                   </p>
//                   <p className="mb-3">
//                     f) OfferBeez word/Term mark and variances, together with device marks displayed on the Platform are licensed property of the Company, and any use, unless expressly permitted, shall amount to infringement and You shall hereby agree and undertake that You recognise Our intellectual property rights and, upon acquiring knowledge of any infringement by any third parties, shall report to Us at legal@OfferBeez.in
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">11. Disclaimer of Warranties & Liability:</h3>
//                   <p className="mb-3">
//                     a) You expressly understand and agree that, to the maximum extent permitted by applicable law.
//                   </p>
//                   <p className="mb-3">
//                     b) The Platform and other Content are provided by OfferBeez on an "as is" basis without warranty of any kind, express, implied, statutory, or otherwise, including the implied warranties of title, non-infringement, merchantability, or fitness for a particular purpose. Without limiting the foregoing, OfferBeez makes no warranty that the Platform or Offers will meet Your requirements, or Your use of the Platform will be uninterrupted, timely, secure, or error-free. No advice or information, whether oral or written, obtained by you from OfferBeez shall create any warranty not expressly stated in the terms.
//                   </p>
//                   <p className="mb-3">
//                     c) OfferBeez will not be liable for any loss that you may incur as a consequence of unauthorised use of your account or account information in connection with the platform, either with or without your knowledge.
//                   </p>
//                   <p className="mb-3">
//                     d) OfferBeez shall not, nor is it obligated to, mediate or resolve any disputes or disagreements that may arise between you and the sellers.
//                   </p>
//                   <p className="mb-3">
//                     e) OfferBeez does not endorse, either implicitly or explicitly, any sale or purchase of products or offers listed on the Platform. However, upon receiving a written request from you following the purchase of any products and/or offers on the platform, OfferBeez may provide additional information about the sellers involved in the transaction as available to facilitate direct communication between you and sellers for the purpose of dispute resolution.
//                   </p>
//                   <p className="mb-3">
//                     f) OfferBeez has endeavoured to ensure that all the information on the Platform is accurate, but OfferBeez neither endeavours nor makes any representations regarding the quality, accuracy or completeness of any data, information regarding the Offers or otherwise. OfferBeez shall not be responsible for the delay or inability to use the Platform or related functionalities, the provision of or failure to provide functionalities, or for any information, software, functionalities, and related graphics obtained through the Platform, or otherwise arising out of the use of the Platform, whether based on contract, tort, negligence, strict liability or otherwise.
//                   </p>
//                   <p className="mb-3">
//                     g) Further, OfferBeez shall not be held responsible for non-availability of the Platform during periodic maintenance operations or any unplanned suspension of access to the Platform that may occur due to technical reasons or for any reasons beyond OfferBeez's reasonable control.
//                   </p>
//                   <p className="mb-3">
//                     h) OfferBeez makes no representation that the Content on the Platform is appropriate to be used or accessed outside the Republic of India. Any users who use or access the platform from outside the Republic of India do so at their own risk and are responsible for compliance with the laws of such jurisdiction and also consent to OfferBeez for use of their personal and other information only for the purpose of provision of offers. By visiting the Platform or providing Your information, You expressly agree to be bound by these Terms and Our Privacy Notice and also agree to be governed by the laws of India, including but not limited to the laws applicable to data protection and privacy. If you do not agree, please do not use or access our platform.
//                   </p>
//                   <p className="mb-3">
//                     i) The Terms do not constitute, nor may the Terms be used for or in connection with, any promotional activities or solicitation by anyone in any jurisdiction in which such promotional activities or solicitation are not authorised or to any person to whom it is unlawful to promote or solicit.
//                   </p>
//                   <p className="mb-3">
//                     j) Prices for any product(s) displayed on the platform may be inaccurate due to technical issues, typographical errors, or incorrect information provided by the seller. In such cases, the seller is responsible and reserves the right to cancel the user's order(s). The offer listing is not a binding agreement between the user and businesses.
//                   </p>
//                   <p className="mb-3">
//                     k) OfferBeez accepts no responsibility for any breaches of applicable laws, including those governing the products and offers offered by sellers or third-party delivery service providers or by payment gateway service providers.
//                   </p>
//                   <p className="mb-3">
//                     l) You acknowledge that third-party offers are available on the platform, and we may partner with certain third parties to facilitate such offers. However, you agree that we make no representations or warranties regarding these third-party offers or products and will not be liable for any outcomes, including injury, impairment, or death, resulting from their use. You hereby waive any rights or claims you may have against us in relation to third-party offers.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">12. Indemnification and Limitation of Liability:</h3>
//                   <p className="mb-3">
//                     a) You agree to indemnify, defend and hold harmless OfferBeez, Partners, Sellers, service providers, its officers, directors, consultants, agents, representatives and employees, and its third party partners ("Indemnitees") from and against any and all losses, liabilities, claims, damages, demands, costs and expenses (including reasonable legal fees) asserted against or incurred by the Indemnitees that arise out of, result from, or may be payable by virtue of, any breach or non- performance of any representation, warranty, covenant or agreement made or obligation to be performed by You pursuant to these Terms and/or the Privacy Notice. Further, You agree to hold the Indemnitees harmless against any claims made by any third party due to, or arising out of, or in connection with, Your use of the Platform, any misrepresentation with respect to the data or information provided by You, Your violation of the Terms and/or the Privacy Notice, Your violation of applicable laws, or Your violation of any rights of third parties, including any intellectual property rights.
//                   </p>
//                   <p className="mb-3">
//                     b) In no event shall OfferBeez, its sellers, its service providers, its directors, officers, partners, consultants, agents, and employees, and its partners be liable to you or any third party for any special, incidental, indirect, consequential, or punitive damages whatsoever arising out of or in connection with your use of or access to the Platform or Content on the Platform.
//                   </p>
//                   <p className="mb-3">
//                     c) Notwithstanding any provisions herein, OfferBeez, Sellers, and service providers' maximum total liability shall not exceed the amount paid by the User for the purchase of the Product and/or Offers under the specific order to which the liability relates.
//                   </p>
//                   <p className="mb-3">
//                     d) The limitations and exclusions in this section apply to the maximum extent permitted by applicable laws.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">13. Violation of these Terms:</h3>
//                   <p className="mb-3">
//                     You agree that any violation by you of these terms will likely cause irreparable harm to OfferBeez, for which monetary damages would be inadequate, and you consent to OfferBeez obtaining any injunctive or equitable relief that they deem necessary or appropriate in such circumstances. These remedies are in addition to any other remedies that OfferBeez may have at law or in equity.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">14. Suspension and Termination:</h3>
//                   <p className="mb-3">
//                     a) The Terms will continue to apply until terminated by either you or OfferBeez as set forth below. If You object to the Terms or are dissatisfied with the Platform, You may
//                   </p>
//                   <ul className="list-disc list-inside space-y-2 ml-4 mb-3">
//                     <li>Close Your Account on the Platform</li>
//                     <li>Stop accessing the Platform.</li>
//                   </ul>
//                   <p className="mb-3">
//                     b) OfferBeez may disable Your access or block Your future access to the Platform or suspend or terminate Your Account if it believes, in its sole and absolute discretion, that You have violated any term of these Terms or the Privacy Notice or in any way otherwise acted unethically. Notwithstanding anything contained herein, all terms which by their nature are intended to survive such termination will survive indefinitely unless and until OfferBeez chooses to terminate them.
//                   </p>
//                   <p className="mb-3">
//                     c) Any such termination shall not cancel your obligation to pay for a product or a service purchased on the Platform, or any other obligation which has accrued or is unfulfilled and relates to the period prior to termination.
//                   </p>
//                   <p className="mb-3">
//                     d) You shall be liable to pay any fees or charges, if applicable, in respect of the offers until the date of termination by either party whatsoever.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">15. Governing Law and Jurisdiction:</h3>
//                   <p className="mb-3">
//                     These Terms shall be governed by and construed in accordance with the laws of India without reference to conflict of laws principles, and disputes arising in relation hereto shall be subject to the exclusive jurisdiction of courts at Bengaluru, Karnataka, India.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">16. Grievance Redressal Mechanism:</h3>
//                   <p className="mb-3">
//                     a) For any order-related issue, you may first reach out to us via chat support on the app for real-time basis resolution.
//                   </p>
//                   <p className="mb-3">
//                     b) You may also write to us at support@OfferBeez.in, and we will strive to resolve your order-related issues within the timelines prescribed under applicable laws.
//                   </p>
//                   <p className="mb-3">
//                     c) If you still have any grievances or complaints or concerns with respect to the Platformer order or are not satisfied with the resolution, the content, or the offers, you can contact the designated Grievance cum Nodal Officer of OfferBeez as per the below details:
//                   </p>
//                   <div className="bg-gray-50 p-4 rounded-lg mb-3">
//                     <p className="font-semibold">Mr Arun</p>
//                     <p>Designation: Associate Director</p>
//                     <p>Venturebiz promotions Private Limited</p>
//                     <p>Address: #2085/16, 2nd Floor, Spoorthi,</p>
//                     <p>Puttenahalli Main Road,</p>
//                     <p>JP Nagar 7th Phase,</p>
//                     <p>Bangalore-560078.</p>
//                     <p>Phone: 900852236</p>
//                     <p>Email: grievances@offerbeez.in</p>
//                     <p>Time: Mon – Sat (9:00 – 18:00)</p>
//                   </div>
//                   <p className="mb-3">
//                     a) The aforementioned details of the Grievance cum Nodal Officer are provided in compliance with the Information Technology Act, 2000, and rules made thereunder.
//                   </p>
//                   <p className="mb-3">
//                     b) Consumer Protection (E-Commerce) Rules 2020, as amended time to time
//                   </p>
//                   <p className="mb-3">
//                     c) The Grievance Officer of OfferBeez shall endeavour to acknowledge the user grievances, or complaints or concerns with respect to the platform, the content, or the offers, within 48 hours of receipt of the same and shall endeavour to redress the same at the earliest and in no event later than 30 (thirty) days of receipt of such request.
//                   </p>
//                   <p className="mb-3">
//                     By lodging a complaint or grievance, you agree to provide complete support to the grievance officer and such reasonable information as may be sought by them from You.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">17. Notice of Infringement and Take Down Policy</h3>
//                   <p className="mb-3">
//                     a) OfferBeez's Take Down Policy enables intellectual property owners to quickly report and remove infringing listings from the platform.
//                   </p>
//                   <p className="mb-3">
//                     b) Intellectual property owners can report potentially infringing products or listings by submitting a Notice of Infringement containing all the details as mentioned below. OfferBeez cannot independently verify that sellers have the rights to sell or distribute their products or offers but is fully committed to protecting intellectual property rights.
//                   </p>
//                   <p className="mb-3">
//                     c) Steps to report a listing:
//                     If you have a sincere belief that a seller on our platform is infringing your intellectual property rights, please follow the below steps. We request you to provide the following information and email it to legal@OfferBeez.in. The email should include:
//                   </p>
//                   <ol className="list-decimal list-inside space-y-2 ml-6 mb-3">
//                     <li>Identification or description of the copyrighted work/trademark that has been infringed along with registration details and images.</li>
//                     <li>Your contact information.</li>
//                     <li>An undertaking from you that you have a good faith belief that the use of the material complained of is not authorised by the trademark or copyright or intellectual property owner, its agent, or the law.</li>
//                     <li>The information in the notice is accurate, and you are the trademark or copyright or intellectual property owner or authorised to act on the trademark or copyright or intellectual property owner's behalf.</li>
//                     <li>Such other information that You think is important for supporting Your claim.</li>
//                   </ol>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">18. OfferBeez's actions:</h3>
//                   <p className="mb-3">
//                     a) Upon receiving a duly completed notice with the necessary documentation as described above, and after confirming the authenticity of the claim, OfferBeez may take steps to remove or disable access to the alleged infringing content provided by third parties.
//                   </p>
//                   <p className="mb-3">
//                     b) OfferBeez may also inform the respective seller who submitted the content in question, providing them with a copy of the infringement notice.
//                   </p>
//                   <p className="mb-3">
//                     c) We reserve the right to undertake any further actions as permitted by the applicable laws in effect at the time of notification.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">19. Communications:</h3>
//                   <p className="mb-3">
//                     a) You hereby expressly agree to receive communications by way of SMS, telephone or VoIP calls, messaging apps like WhatsApp on the registered mobile phone number and/or electronic communications like e-mails from OfferBeez and other third parties duly authorised by OfferBeez.
//                   </p>
//                   <p className="mb-3">
//                     b) You hereby expressly consent to the monitoring and recording, by OfferBeez and/or any third party, of any and all communications between you and OfferBeez or its agents, employees, consultants, contractors, or representatives of OfferBeez or of their authorised partners, and such monitoring or recording waives any further notice or consent requirement under the applicable laws.
//                   </p>
//                   <p className="mb-3">
//                     c) You can unsubscribe or opt out from receiving promotional communications from OfferBeez. In which case, OfferBeez will only send communications solely required for the purposes of availing the offers by you.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">20. General Provisions:</h3>
//                   <p className="mb-3">
//                     a) Notice: All notices from OfferBeez will be served by email to your registered email address, by messaging app on the registered mobile phone number or by general notification on the platform.
//                   </p>
//                   <p className="mb-3">
//                     b) Assignment: You cannot assign or otherwise transfer any rights granted hereunder to any third party. OfferBeez's rights and obligations under the Terms are freely transferable by OfferBeez to its successor or to its affiliates or any third party without the requirement of seeking your consent.
//                   </p>
//                   <p className="mb-3">
//                     c) Severability: If, for any reason any provision of the Terms, or any portion thereof, to be unenforceable, that provision shall be enforced to the maximum extent permissible so as to give effect to the intent of the parties as reflected by that provision, and the remainder of the Terms shall continue in full force and effect
//                   </p>
//                   <p className="mb-3">
//                     d) Force Majeure: OfferBeez, its Sellers, its service providers shall not be liable to You for its failure to perform or for delay in providing You access to Your Account or to the Platform or any Offers thereof, to the extent such failure or delay results from causes beyond its reasonable control, including, without limitation, acts of God, fires, explosions, wars or other hostilities, insurrections, revolutions, strikes, labour unrest, earthquakes, floods, riots, excessive rains, pandemic, epidemics or regulatory or quarantine restrictions, unforeseeable governmental restrictions or controls or a failure by a third party hosting provider or internet service provider or on account of any change or defect in the software and/or hardware of Your computer system.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">21. Advertisements:</h3>
//                   <p className="mb-3">
//                     a) As part of the offers provided by us, we may facilitate and allow third-party advertisers ("Third-Party Advertisers") to place advertisements on the Platform. You understand that any content put out by third-party advertisers is endorsed by OfferBeez, and we disclaim to the fullest extent permitted by law any liability for the content published by the third-party advertisers. It is solely the responsibility of the third-party advertisers submitting material to the platform to ensure compliance with all relevant laws. Any interactions or transactions you undertake with third-party advertisers found on the platform, including payments, delivery, and terms or representations related to their goods or offers, are strictly between you and the third-party advertiser. OfferBeez bears no liability for errors, omissions, or inaccuracies in advertising content or for any losses or damages arising from your dealings with these advertisers or their presence on the platform.
//                   </p>
//                   <p className="mb-3">
//                     b) To the extent You are a Third Party Advertiser, You understand that in addition to these Terms, You will also be required to agree to OfferBeez's policies and other contractual agreements that You will need to execute for placing Your advertisement.
//                   </p>
//                   <p className="mb-3">
//                     c) As a general principle, the content in the advertisements should not be misleading or in violation of applicable law or guidelines issued by the Advertising Standards Council of India or any other self-regulating body. You also acknowledge that We have the sole right at Our discretion to remove any Third Party Advertisement or require You to prove factual substantiation if We are of the view that it is in violation of applicable law or any self-regulating industry body guidelines or is otherwise misleading.
//                   </p>
//                   <p className="mb-3">
//                     d) If you are of the view that the content of a third-party advertiser is inappropriate or in violation of applicable law, please write to Us at the email address provided above
//                   </p>
//                   <p className="mb-3">
//                     e) For any charitable campaign information shared with users or displayed on the platform, where donations may be made through third-party sites or accounts, OfferBeez may not be involved in fund collection or use. OfferBeez bears no responsibility for the accuracy or legality of campaign information, which is provided solely for reference. Users are encouraged to verify details independently before taking action.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">22. Severability:</h3>
//                   <p className="mb-3">
//                     a) If any part of these Terms is found to be invalid, void, or unenforceable, that portion will be treated as separable, and the remaining provisions will continue in full force and effect.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">23. Amendments:</h3>
//                   <p className="mb-3">
//                     a) We may modify these Terms periodically, without prior notice, to include updates, revisions, additions, or new policies affecting your use of the offers. Such changes will be posted on the platform and take effect immediately upon posting. We encourage you to review these terms on the platform regularly for any updates. By continuing to use the Offers and/or the Platform, you agree to accept any revised Terms.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">24. Transition:</h3>
//                   <p className="mb-3">
//                     a) THE PLATFORM IS UNDERGOING A TRANSITION WHERE THE PLATFORM WILL BE OPERATED BY VENTUREBIZ PROMOTIONS PRIVATE LIMITED FROM THE DATE WHICH SHALL BE COMMUNICATED TO YOU. PURSUANT TO THE TRANSITION, THE EXISTING USER OF OFFERBEEZ OFFERS HEREBY CONSENTS TO THE FOLLOWING:
//                   </p>
//                   <p className="mb-3">
//                     b) FOR THE TRANSFER OF YOUR PAYMENT-RELATED INFORMATION AND INSTRUMENTS AS AVAILABLE WITH THE SERVICE PROVIDER OF OFFERBEEZ TO ENSURE A SEAMLESS EXPERIENCE FOR USERS POST TRANSITION.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">25. Entire agreement:</h3>
//                   <p className="mb-3">
//                     a) This document, including the Privacy Notice and any policies that OfferBeez may introduce from time to time, represents the entire understanding between you and OfferBeez. It establishes the terms for your access to and use of the offers and platform, superseding any earlier arrangements related to such access or use.
//                   </p>
//                 </section>

//                 <div className="text-center mt-8 pt-6 border-t border-gray-200">
//                   <p className="text-sm text-gray-500">
//                     © 2025 Venturebiz Promotions Private Limited, All rights reserved.
//                   </p>
//                 </div>
//               </div>
//             </motion.div>

//             {/* Privacy Policy Section */}
//             <motion.div
//               id="privacy"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2 }}
//               className="bg-white rounded-lg p-6 shadow-sm border scroll-mt-24"
//             >
//               <div className="text-center mb-6">
//                 <h2 className="text-xl font-semibold text-blue-600 mb-2">
//                   Privacy Policy
//                 </h2>
//                 <p className="text-sm text-gray-500">
//                   Last updated: 4th November 2025
//                 </p>
//               </div>

//               <div className="space-y-6 text-gray-700 text-sm leading-relaxed">
//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">PRIVACY POLICY:</h3>
//                   <p className="mb-3">
//                     This Notice applies to Venturebiz Promotions Private Limited, hereinafter referred to as "OfferBeez" (the Product/Platform) or "The Company", a company incorporated under the Companies Act, 2013, and having its registered office at #2085/16, 2nd Floor, Spoorthi, Puttenahalli Main Road, JP Nagar 7th Phase, Bangalore-560078, and its subsidiaries, its holding company, and its affiliates. The Company is the owner of the websites www.offerbeez.in and www.venturebiz.in and the mobile application 'OfferBeez' (collectively, the "Product/Platform"). This privacy notice describes the policies and procedures applicable to the collection, use, storage, disclosure and protection of your information shared with us while you use the Platform, and for the purpose of this privacy notice, OfferBeez refers to Venturebiz Promotions Private Limited and its subsidiaries, its holding company and its affiliates, wherever context so requires, and the terms "you", "your", "yourself" or "user" refer to the user of the Platform. We value the trust you place in OfferBeez. That is why we maintain reasonable security standards for securing the transactions and your information. Please read the Privacy Notice carefully prior to using or registering on the Platform or accessing any material or information or availing any services through the Platform. This Privacy Notice specifies the manner in which your information is collected, received, stored, processed, disclosed, transferred, dealt with or otherwise handled by us. This Privacy Notice does not apply to information that you provide to, or that is collected by, any third party through the Platform, and any Third-Party Sites that you access or use in connection with the services offered on the Platform.
//                   </p>
//                   <p className="mb-3">
//                     OfferBeez values the trust you place in us and recognises the importance of secure transactions and information privacy. This Privacy Policy describes how Venturebiz Promotions Private Limited and its affiliates, group companies and related parties (collectively "OfferBeez", "offerbeez", "our", "us") collect, use, share or otherwise process your personal data through the OfferBeez website https://offerbeez.in, its mobile application and website (hereinafter referred to as the "Platform").
//                   </p>
//                   <p className="mb-3">
//                     While you can browse sections of the platform without the need of sharing any information with us, please note OfferBeez does not offer any product or service under this platform outside India, and your personal data will primarily be stored and processed in India. By visiting this platform, providing your information or availing yourself of our product/service, you expressly agree to be bound by the Privacy Policy and terms and conditions of this Privacy Policy, the Terms of Use and the applicable service/product terms and conditions and laws of India, including but not limited to the laws applicable to data protection and privacy. If you do not agree, please do not use or access our platform.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">Collection of Your Information</h3>
//                   <p className="mb-3">
//                     When you use our platform, OfferBeez collects and stores your information, which is provided by you from time to time. Once you give us your personal data, you are not anonymous to us. Where possible, OfferBeez indicates which fields are required and which fields are optional. You always have the option to not provide data by choosing not to use a particular service, product or feature on the platform.
//                   </p>
//                   <p className="mb-3">
//                     OfferBeez collects and analyses your personal data relating to your buying behaviour, browsing patterns, preferences, and other information that you choose to provide while interacting with our platform. OfferBeez uses this information to do internal research on our users' demographics, interests, usage trends, and behaviour to better understand your needs and provide you with an enhanced user experience and protect and serve our users. Additionally, this information may also be compiled and analysed on an aggregated basis. This information may include the URL that you just came from (whether this URL is on our platform or not), which URL you next go to (whether this URL is on our platform or not), your computer browser information, and your IP address. Such insights enable us to personalise and optimise our products, services, marketing communications, and the checkout process to better align with your preferences. The insights derived from this analysis may be shared with our group companies, affiliates, related companies, business partners, and third parties who offer services to OfferBeez or to whom OfferBeez provides our products or services. These group companies, affiliates, related companies, business partners and third parties may use such insights for promotions, advertisements and marketing, product development and other commercial purposes. They may also leverage these insights to personalise your browsing experience and customise various aspects of the user journey, such as the checkout flow, payment options, delivery recommendations, either on our Platform or their own platforms. Please note that any processing of your personal data by third parties will be governed by their own privacy policies. OfferBeez does not control, endorse, or assume responsibility for the privacy practices of third parties, and OfferBeez encourages you to review their privacy policies.
//                   </p>
//                   <p className="mb-3">
//                     OfferBeez may collect personal data (such as email address, store address, name, phone number and other payment instrument details) from you when you set up an account or transact with us or participate in any event or contest. While you can browse some sections of our platform without being a registered member, certain activities (such as placing an order or consuming our online content or services) do require registration. OfferBeez uses your contact information to send you offers based on your previous products and your interests.
//                   </p>
//                   <p className="mb-3">
//                     If you choose to post messages on our message boards, chat rooms or other message areas or leave feedback on the Platform or the social media handles maintained by us, or if you use voice commands or virtual try-and-buy or similar features to shop on the Platform, OfferBeez will collect that information you provide to us. OfferBeez retains this information as necessary to resolve disputes, provide customer support, troubleshoot problems or for internal research and analysis as permitted by law.
//                   </p>
//                   <p className="mb-3">
//                     If you send us personal correspondence, such as emails or letters, or if other users or third parties send us correspondence about your activities or postings on the platform, OfferBeez may collect such information into a file specific to you.
//                   </p>
//                   <p className="mb-3">
//                     If you enrol in the OfferBeez platform, it will collect and store your personal data, such as name, contact number, email address, communication address, date of birth, gender, zip code, lifestyle information, demographic and work details, which is provided by you to OfferBeez. OfferBeez will also collect your information related to your transactions on the OfferBeez platform and such third-party business partner platforms. When such a third-party business partner collects your personal data directly from you, you will be governed by their privacy policies. Additionally, OfferBeez collects your UPI ID if you choose to pay via our OfferBeez UPI platform. OfferBeez shall not be responsible for the third-party business partner's privacy practices or the content of their privacy policies, and OfferBeez requests you to read their privacy policies prior to disclosing any information.
//                   </p>
//                   <p className="mb-3">
//                     OfferBeez uses your personal data to take and fulfil promotional offers. OfferBeez uses your personal data to assist sellers and business partners in handling and fulfilling offers, enhancing customer experience, resolving disputes, troubleshooting problems, helping promote a safe service, measuring consumer interest in our products and services, inform you about online offers, customising and enhance your experience, report to regulatory authorities wherever required, detect and protect us against error, fraud and other criminal activity. enforce our terms and conditions and as otherwise described to you at the time of collection of information.
//                   </p>
//                   <p className="mb-3">
//                     With your consent, OfferBeez may have access to your SMS, instant messages, contacts in your directory, location, camera, photo gallery and device information and OfferBeez may also request you to provide your PAN, credit information report (from credit agencies), GST Number, Government issued ID cards/number and Know-Your-Customer (KYC) details to: (i) check your eligibility for certain products and services like insurance, credit and payment products; (ii) issue GST your business requirements; (iii) enhance your experience on the Platform and provide you access to the products and services being offered by OfferBeez, sellers, affiliates, lending partners, business partners or third-parties who offer services to OfferBeez or to whom OfferBeez provide our products or services. You understand that your access to these products/services may be affected in the event when consent is not provided to us.
//                   </p>
//                   <p className="mb-3">
//                     In our efforts to continually improve our product and service offerings, OfferBeez and our affiliates collect and analyse demographic and profile data about our users' activity on our platform. OfferBeez identifies and uses your IP address to help diagnose problems with our server and to administer our platform. Your IP address is also used to help identify you and to gather broad demographic information.
//                   </p>
//                   <p className="mb-3">
//                     OfferBeez will occasionally ask you to participate in optional surveys conducted either by us or through a third-party market research agency. These surveys may ask you for personal data, contact information, date of birth, demographic information (like zip code, age, or income level), attributes such as your interests, household or lifestyle information, your purchasing behaviour or history, preferences, and other such information that you may choose to provide. The surveys may involve the collection of voice data or video recordings, the participation of which would purely be voluntary in nature. OfferBeez uses this data to tailor your experience at our platform, providing you with content that OfferBeez thinks you might be interested in and displaying content according to your preferences.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">Cookies Policy;</h3>
//                   <p className="mb-3">
//                     OfferBeez uses data collection devices such as "cookies" on certain pages of the platform to help analyse our OfferBeez page flow, measure promotional effectiveness, and promote trust and safety. Cookies are small files placed on your hard drive that assist us in providing our services. Cookies do not contain any of your personal data. OfferBeez offers certain features that are only available through the use of a "cookie". OfferBeez also uses cookies to allow you to enter your password less frequently during a session. Cookies can also help us provide information that is targeted to your interests. Most cookies are "session cookies", meaning that they are automatically deleted from your hard drive at the end of a session. You are always free to decline/delete our cookies if your browser permits, although in that case you may not be able to use certain features on the Platform, and you may be required to re-enter your password more frequently during a session. Additionally, you may encounter "cookies" or other similar devices on certain pages of the Platform that are placed by third parties. OfferBeez do not control the use of cookies by third parties. OfferBeez uses cookies from third-party partners such as Google Analytics for marketing and analytical purposes. Google Analytics helps us understand how our customers use the site. You can read more about how Google uses your personal data here: https://www.google.com/intl/en/policies/privacy/. You can opt out of Google Analytics here: https://tools.google.com/dlpage/gaoptout. You can also control the use of cookies at the individual browser level, but if you choose to disable cookies, it may limit your use of certain features or functions on the services.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">Sharing of Personal Data;</h3>
//                   <p className="mb-3">
//                     Additionally, OfferBeez may also disclose your personal data to third parties, such as our sellers and business partners. This disclosure may be required for us to provide you access to our products and services; for fulfilment of your offers; for enhancing your experience; for providing feedback on products; to comply with our market research or surveys; to enforce our Terms of Use; to facilitate our marketing and advertising activities; to analyse data; for customer service assistance; and to prevent, detect, mitigate, and investigate fraudulent or illegal activities related to our product and services. In addition, OfferBeez may share your personal data with business partners and third parties who offer services to us or to whom OfferBeez provides our products or services to enable them to offer, advertise, and personalise your browsing experience and customise various aspects of the user journey, such as the checkout flow, auto-filling sign-up details to facilitate a faster checkout process, or promote their own products and services to you, and this may include, without limitation, conducting marketing campaigns, personalised customer engagement, curated product or service recommendations, and other outreach activities designed to align with your interests and preferences.
//                   </p>
//                   <p className="mb-3">
//                     OfferBeez may disclose personal data if required to do so by law or in the good faith belief that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal processes. OfferBeez may disclose personal data to law enforcement agencies, third-party rights owners, or others in the good faith belief that such disclosure is reasonably necessary to enforce our Terms of Use or Privacy Policy; respond to claims that an advertisement, posting, or other content violates the rights of a third party; or protect the rights, property, or personal safety of our users or the general public.
//                   </p>
//                   <p className="mb-3">
//                     OfferBeez and our affiliates will share/sell some or all of your personal data with another business entity should OfferBeez (or our assets) plan to merge with or be acquired by that business entity or undergo reorganisation, amalgamation, or restructuring of business. Should such a transaction occur, another business entity (or the new combined entity) will be required to follow this Privacy Policy with respect to your personal data.
//                   </p>
//                   <p className="mb-3">
//                     OfferBeez Partner App respects your privacy. We collect only the necessary data to provide app functionality, onboard businesses, and track partner performance. Your personal data, location, photos, and documents are used solely to improve your experience and help local businesses grow. We do not share, sell, or misuse your information.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">1. Information We Collect</h3>
//                   <p className="mb-3">
//                     a. Personal information: name, email, phone number (provided during registration and business information when onboarding stores)
//                   </p>
//                   <p className="mb-3">
//                     b. Permissions Camera: To capture business/store images and upload documents Storage: To select and upload images or files from your device
//                   </p>
//                   <p className="mb-3">
//                     c. Location: To identify nearby businesses and verify their location. All collected data is used only within the app and is stored securely.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">2. How We Use Your Information</h3>
//                   <p className="mb-3">
//                     To create and manage your partner account To onboard local businesses and verify store information To track business onboarding progress and commission calculation To provide location-based services and improve app functionality To communicate with you regarding app updates or support
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">3. Data Sharing and Security:</h3>
//                   <p className="mb-3">
//                     Your data is not sold, rented, or shared with third parties All information is stored securely using industry-standard practices Only authorized OfferBeez personnel have access for operational purposes
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">4. User Control</h3>
//                   <p className="mb-3">
//                     You can deny camera, storage, or location permissions, but some app features may not work You can update or delete personal information by contacting support You may manage app permissions from your device settings
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">5. Third-Party Services</h3>
//                   <p className="mb-3">
//                     The app may use third-party services (like analytics, messages, and storing data) without sharing personal data. Only aggregated, anonymised information may be used for improving the app.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">6. Children's Privacy</h3>
//                   <p className="mb-3">
//                     OfferBeez Partner App is not intended, as per law, for children under 13. We do not knowingly collect personal information from minors.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">7. Changes to Privacy Policy</h3>
//                   <p className="mb-3">
//                     We may update this policy periodically. The latest version will always be available in the app. Users will be notified about significant changes.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">8. Contact Us</h3>
//                   <p className="mb-3">
//                     For any questions or concerns regarding your privacy or data usage, please contact us at Email: support@offerbeez.in Company: Venturebiz Promotions Private Limited.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">Govern the collections:</h3>
//                   <p className="mb-3">
//                     use, storage, and processing of your Aadhaar and PAN information by Venturebiz Promotions Private Limited, operating the application ("We", "Us", "Our"). By using this application and submitting your information, you agree to these terms.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">1. Purpose of Collection</h3>
//                   <p className="mb-3">
//                     We collect your Aadhaar and/or PAN details only for the following purposes: identity verification/KYC, prevention of Fraud / Duplicate Accounts , Compliance with applicable laws (if required). We do not use your identity details for any other purpose.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">2. User Consent</h3>
//                   <p className="mb-3">
//                     By submitting your Aadhaar / PAN details, you confirm that:
//                   </p>
//                   <p className="mb-3">
//                     You are voluntarily providing these details. You understand the purpose for which they are being collected. You grant us permission to verify your details through authorised verification systems or approved KYC service providers. You may withdraw your consent at any time by contacting us at:
//                   </p>
//                   <p className="mb-3">📧 support : support@offerbeez.in</p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">3. Aadhaar Collection & Usage Policy</h3>
//                   <p className="mb-3">
//                     As per the Aadhaar Act, 2016 (Amended 2019):
//                   </p>
//                   <p className="mb-3">
//                     We do not store raw Aadhaar numbers, photocopies, or Aadhaar card images. Aadhaar verification is performed only through the UIDAI-approved Offline e-KYC / QR Code method or via licensed KYC service providers. We will not share or disclose Aadhaar details to any person or third party unless required by law.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">4. PAN Collection & Usage Policy</h3>
//                   <p className="mb-3">
//                     PAN details are collected only for identity verification, taxation, or compliance purposes. PAN may be securely stored and used only for the stated purpose. We do not share PAN information with any unauthorised third party.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">5. Data Security</h3>
//                   <p className="mb-3">
//                     We follow industry-standard security practices to protect your data, including encryption of stored and transmitted data. Restricted internal access controls, Secure servers and audit logs However, no system is 100% secure, and we cannot guarantee absolute security.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">6. User Rights</h3>
//                   <p className="mb-3">
//                     You have the right to request access to your data. Request correction of incorrect details, Request deletion of your Aadhaar/PAN records (if legally permissible) To request, contact:
//                   </p>
//                   <p className="mb-3">📧 support@offerbeez.in</p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">7. Data Sharing</h3>
//                   <p className="mb-3">
//                     Your information will only be shared with government-authorised KYC providers Regulatory or legal authorities, if required by law, We never sell or rent your personal identity data.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">8. Changes to Terms</h3>
//                   <p className="mb-3">
//                     We may update this privacy policy periodically. Continued use of the app will mean you accept the revised terms.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">9. Contact Information</h3>
//                   <p className="mb-3">
//                     If you have any questions or complaints, contact us at:
//                   </p>
//                   <p className="mb-3">📧 support@offerbeez.in</p>
//                   <p className="mb-3">📞 9008522366</p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">User Consent Statement (Show Before Upload Page)</h3>
//                   <p className="mb-3">
//                     I hereby provide voluntary consent to [Your Company Name] to collect and verify my Aadhaar and/or PAN details for identity verification purposes. I understand that my data will be processed securely and will not be misused, shared, or stored beyond the stated purpose. I have read and agree to the Terms & Conditions and Privacy Policy.
//                   </p>
//                   <p className="mb-3">[✓] I Agree</p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">Links to Other Sites;</h3>
//                   <p className="mb-3">
//                     OfferBeez shall not be responsible for the privacy practices or the content of their privacy policies, and OfferBeez requests you to read their privacy policies prior to disclosing any information.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">Security Precautions:</h3>
//                   <p className="mb-3">
//                     OfferBeez maintains reasonable physical, electronic and procedural safeguards to protect your information. Whenever you access your account information, OfferBeez offers the use of a secure server. Once your information is in our possession, OfferBeez adheres to our security guidelines to protect it against unauthorised access. By using OfferBeez, the users accept the inherent security implications of data transmission over the internet and the World Wide OfferBeez, which cannot always be guaranteed as completely secure, and therefore, there would always remain certain inherent risks regarding use of the Platform. Users are responsible for ensuring the protection of login and password records for their account.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">Choice/Opt-Out;</h3>
//                   <p className="mb-3">
//                     OfferBeez provides all users with the opportunity to opt out of receiving non-essential (promotional, marketing-related) communications after setting up an account with us. If you do not wish to receive promotional communications from us, then please mailto: offerbeez@support.in
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">Advertisements on Platform;</h3>
//                   <p className="mb-3">
//                     OfferBeez uses third-party advertising companies to serve ads when you visit our platform. These companies may use information (not including your name, address, email address, or telephone number) about your visits to provide personalised advertisements about goods and services of interest to you. If you want to avoid this, then please mailto:offerbeez@support.in
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">Children's Information:</h3>
//                   <p className="mb-3">
//                     Use of our platform is available only to persons who can form a legally binding contract under the Indian Contract Act, 1872. OfferBeez do not knowingly solicit or collect personal data from children under the age of 18 years. If you have shared any personal data of children under the age of 18 years, you represent that you have the authority to do so and permit us to use the information in accordance with this Privacy Policy.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">Data Retention;</h3>
//                   <p className="mb-3">
//                     OfferBeez retains your personal data in accordance with applicable laws for a period no longer than is required for the purpose for which it was collected or as required under any applicable law. However, OfferBeez may retain data related to you if OfferBeez believes it may be necessary to prevent fraud or future abuse, to enable OfferBeez to exercise its legal rights and/or defend against legal claims, or if required by law, or OfferBeez may continue to retain your data in anonymised form for analytical and research purposes.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">Your Rights:</h3>
//                   <p className="mb-3">
//                     OfferBeez takes every reasonable step to ensure that your personal data that OfferBeez processes is accurate and, where necessary, kept up to date, and any of your personal data that OfferBeez has that you inform us is inaccurate (having regard to the purposes for which they are processed) is erased or rectified. You may access, correct, and update your personal data directly through the functionalities provided on the Platform. You may delete certain non-mandatory information by logging into our OfferBeez site and visiting the Profile and Settings sections. You can also write to us at the contact information provided below to assist you with these requests.
//                   </p>
//                   <p className="mb-3">
//                     You have an option to withdraw your consent that you have already provided by writing to us at the contact information provided below. Please mention "for withdrawal of consent" in the subject line of your communication. OfferBeez will verify such requests before acting upon your request. Please note, however, OfferBeez, that withdrawal of consent will not be retroactive and will be in accordance with the terms of this Privacy Policy, related Terms of Use and applicable laws. In the event you withdraw consent given to us under this Privacy Policy, such withdrawal may hamper your access to the Platform or restrict provision of our services to you for which OfferBeez considers that information to be necessary.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">Your Consent:</h3>
//                   <p className="mb-3">
//                     By visiting our platform or by providing your personal data, you consent to the collection, use, storage, disclosure and other processing of your personal data on the platform in accordance with this privacy policy. If you disclose to us any personal data relating to other people, you represent that you have the authority to do so and to permit us to use the data in accordance with this Privacy Policy.
//                   </p>
//                   <p className="mb-3">
//                     You, while providing your personal data over the Platform or any partner platforms or establishments, consent to us (including our other corporate entities, affiliates, lending partners, technology partners, marketing channels, business partners and other third parties like credit bureaus) contacting you through SMS, instant messaging apps, calls and/or e-mail for the purposes specified in this Privacy Policy.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">Changes to this Privacy Policy:</h3>
//                   <p className="mb-3">
//                     Please check our Privacy Policy periodically for changes. OfferBeez may update this Privacy Policy to reflect changes to our information practices. OfferBeez will alert you to significant changes by posting the date our policy was last updated, placing a notice on our platform, or by sending you an email when OfferBeez are required to do so by applicable law.
//                   </p>
//                 </section>

//                 <section className="mb-6">
//                   <h3 className="text-lg font-semibold mb-3 text-gray-800">Contact Information:</h3>
//                   <p className="mb-3">
//                     If you have a query, concern, or complaint in relation to collection or usage of your personal data under this Privacy Policy please contact us at offerbeez.in
//                   </p>
//                   <p className="mb-3">
//                     You can reach our customer support team to address any of your queries or complaints related to product and services by clicking the link, selecting your order and choosing 'Need Help' option: mailto:support@offerbeez.in
//                   </p>
//                 </section>
//               </div>
//             </motion.div>

//             {/* Contact Information Section */}
//             <motion.div
//               id="contact"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.3 }}
//               className="bg-blue-50 rounded-lg p-6 border border-blue-200 scroll-mt-24"
//             >
//               <h2 className="text-lg font-semibold mb-4 text-blue-800">
//                 Contact Information
//               </h2>
//               <div className="space-y-4">
//                 <p className="text-blue-700 text-sm leading-relaxed">
//                   If you have any questions about these Terms and Conditions or Privacy Policy, 
//                   please contact us using the information below:
//                 </p>
//                 <div className="mt-3 text-sm text-blue-600 space-y-2">
//                   <p className="flex items-center">
//                     <span className="font-semibold w-20">Email:</span>
//                     support@offerbeez.com
//                   </p>
//                   <p className="flex items-center">
//                     <span className="font-semibold w-20">Phone:</span>
//                     +91 9008522366
//                   </p>
//                   <p className="flex items-center">
//                     <span className="font-semibold w-20">Address:</span>
//                     #2085/16, 2nd Floor, Spoorthi, Wilson Garden Society Layout, Puttenahalli Main Road, JP Nagar 7th Phase, Bangalore- 560078.
//                     <br />
                  
//                   </p>
//                 </div>
//                 <div className="mt-4 p-3 bg-white rounded border">
//                   <p className="text-xs text-gray-600">
//                     <strong>Response Time:</strong> We typically respond to all enquiries within 24-48 hours during business days.
//                   </p>
//                 </div>
//               </div>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4 }}
//               className="text-center text-xs text-gray-500 pb-4"
//             >
//               Last updated: 4th November 2025
//             </motion.div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//     </div>
//   );
// }
///////////////

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

  // Function to open external Terms of Service page
  const handleOpenTermsPage = () => {
    window.open('https://offerbeez.in/consumer-tos', '_blank');
  };

  // Function to open external Privacy Policy page
  const handleOpenPrivacyPage = () => {
    window.open('https://offerbeez.in/privacy-policy', '_blank');
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header Section - Fixed and doesn't scroll */}
      <div className="bg-white shadow-sm flex-shrink-0">
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
                onClick={handleOpenTermsPage}
                className="px-4 py-2 rounded-lg transition-colors text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
              >
                Terms of Service
              </button>
              <button 
                onClick={handleOpenPrivacyPage}
                className="px-4 py-2 rounded-lg transition-colors text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
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
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-6 pt-4">
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
                <div className="space-y-4 text-gray-700 text-center py-8">
                  <p className="text-lg mb-4">
                    For our complete Terms of Service, please visit our official page.
                  </p>
                  <button 
                    onClick={handleOpenTermsPage}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Full Terms of Service
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    You will be redirected to our official Terms of Service page
                  </p>
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
                <div className="space-y-4 text-gray-700 text-center py-8">
                  <p className="text-lg mb-4">
                    For our complete Privacy Policy, please visit our official page.
                  </p>
                  <button 
                    onClick={handleOpenPrivacyPage}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    View Full Privacy Policy
                  </button>
                  <p className="text-sm text-gray-500 mt-4">
                    You will be redirected to our official Privacy Policy page
                  </p>
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
    </div>
  );
}