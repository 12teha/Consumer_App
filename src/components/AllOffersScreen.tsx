// import React, { useState } from 'react';
// import { motion } from 'motion/react';
// import { ArrowLeft, Filter, Search } from 'lucide-react';
// import OfferCard from './atoms/OfferCard';
// import BackButton from './atoms/BackButton';
// import SharePopup from './atoms/SharePopup';
// import DirectionPopup from './atoms/DirectionPopup';
// import BottomNavigation from './atoms/BottomNavigation';

// interface AllOffersScreenProps {
//   title: string;
//   offers: any[];
//   onBack: () => void;
//   onOfferClick: (offer: any) => void;
//   onLikeCountChange?: (count: number) => void;
//   onNavigate?: (screen: string, data?: any) => void;
// }

// export default function AllOffersScreen({ 
//   title, 
//   offers, 
//   onBack, 
//   onOfferClick,
//   onLikeCountChange,
//   onNavigate
// }: AllOffersScreenProps) {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [sortBy, setSortBy] = useState('distance');
//   const [likedOffers, setLikedOffers] = useState<number[]>([]);
//   const [selectedOffer, setSelectedOffer] = useState<any>(null);
//   const [showSharePopup, setShowSharePopup] = useState(false);
//   const [showDirectionPopup, setShowDirectionPopup] = useState(false);
//   const [directionData, setDirectionData] = useState<any>(null);

//   const categories = ['All', 'Food', 'Fashion', 'Electronics', 'Beauty', 'Fitness', 'Grocery', 'Banking'];
//   const sortOptions = [
//     { label: 'Distance', value: 'distance' },
//     { label: 'Discount', value: 'discount' },
//     { label: 'Rating', value: 'rating' },
//     { label: 'Price: Low to High', value: 'price_asc' },
//     { label: 'Price: High to Low', value: 'price_desc' }
//   ];
  

//   const handleLikeOffer = (offerId: number, liked: boolean) => {
//     setLikedOffers(prev => {
//       const newLiked = liked 
//         ? [...prev, offerId]
//         : prev.filter(id => id !== offerId);
      
//       setTimeout(() => {
//         onLikeCountChange?.(newLiked.length);
//         localStorage.setItem('wishlistOffers', JSON.stringify(newLiked));
//       }, 0);
      
//       return newLiked;
//     });
//   };

//   const handleShare = (offer: any) => {
//     setSelectedOffer(offer);
//     setShowSharePopup(true);
//   };

//   // const handleGetDirections = (offer: any) => {
//   //   setDirectionData({
//   //     storeName: offer.title,
//   //     storeAddress: offer.address,
//   //     distance: offer.distance,
//   //     estimatedTime: `${Math.ceil(parseFloat(offer.distance) * 4)} min`
//   //   });
//   //   setShowDirectionPopup(true);
//   // };

//   const filteredOffers = offers.filter(offer => {
//     const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          offer.description.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = selectedCategory === 'All' || offer.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const sortedOffers = [...filteredOffers].sort((a, b) => {
//     switch (sortBy) {
//       case 'distance':
//         return parseFloat(a.distance) - parseFloat(b.distance);
//       case 'discount':
//         return b.discount - a.discount;
//       case 'rating':
//         return b.rating - a.rating;
//       case 'price_asc':
//         return a.discountedPrice - b.discountedPrice;
//       case 'price_desc':
//         return b.discountedPrice - a.discountedPrice;
//       default:
//         return 0;
//     }
//   });

//   return (
//     <div className="h-screen bg-gray-50 flex flex-col">
//       {/* Header */}
//      <motion.div
//   initial={{ opacity: 0, y: -50 }}
//   animate={{ opacity: 1, y: 0 }}
//   className="bg-white px-4 py-3 shadow-sm"
// >
//   <div className="flex items-center justify-between mb-3">
//     {/* <button 
//       onClick={onBack}
//       className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//     >
//       <ArrowLeft className="w-5 h-5 text-gray-600" />
//     </button> */}
//     <h1 className="text-lg font-bold text-gray-900">{title}</h1>
//     <div className="w-8" /> {/* Spacer for balance */}
//   </div>

//         {/* Search Bar */}
//         <div className="relative mb-3">
//           <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 cursor-pointer" />
//           <input
//             type="text"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search offers..."
//             className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//         </div>

//         {/* Filters */}
//         {/* <div className="flex space-x-3 overflow-x-auto pb-2">
//           {categories.map((category) => (
//             <button
//               key={category}
//               onClick={() => setSelectedCategory(category)}
//               className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
//                 selectedCategory === category
//                   ? 'bg-purple-500 text-white'
//                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
//               }`}
//             >
//               {category}
//             </button>
//           ))}
//         </div> */}
//       </motion.div>

//       {/* Sort Options */}
//       {/* <div className="bg-white px-4 py-2 border-b border-gray-100">
//         <div className="flex items-center space-x-2">
//           <Filter className="w-4 h-4 text-gray-500" />
//           <span className="text-sm text-gray-600">Sort by:</span>
//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//             className="text-sm text-purple-600 bg-transparent border-none outline-none"
//           >
//             {sortOptions.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div> */}

//       {/* Results Count */}
//       <div className="bg-white px-4 py-2 border-b border-gray-100">
//         <p className="text-sm text-gray-600">
//           {sortedOffers.length} {sortedOffers.length === 1 ? 'offer' : 'offers'} found
//         </p>
//       </div>

//       {/* Offers Grid */}
//       <div className="flex-1 overflow-y-auto p-4 pb-20">
//         <div className="grid grid-cols-2 gap-3">
//           {sortedOffers.map((offer) => (
//             <OfferCard
//               key={offer.id}
//               offer={offer}
//               onLike={handleLikeOffer}
//               onShare={() => handleShare(offer)}
//               onClick={() => onOfferClick(offer)}
//               className="w-full"
//             />
//           ))}
//         </div>

//         {sortedOffers.length === 0 && (
//           <div className="text-center py-12">
//             <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Search className="w-8 h-8 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">No offers found</h3>
//             <p className="text-gray-600">Try adjusting your search or filters</p>
//           </div>
//         )}
//       </div>

//       {/* Direction Popup */}
//       {showDirectionPopup && directionData && (
//         <DirectionPopup
//           storeName={directionData.storeName}
//           storeAddress={directionData.storeAddress}
//           distance={directionData.distance}
//           estimatedTime={directionData.estimatedTime}
//         />
//       )}

//       {/* Share Popup */}
//       <SharePopup
//         isOpen={showSharePopup}
//         onClose={() => setShowSharePopup(false)}
//         offer={selectedOffer}
//       />

//       {/* Bottom Navigation */}
//       <BottomNavigation 
//         activeScreen="home"
//         onNavigate={onNavigate || (() => {})}
//       />
//     </div>
//   );
// }











import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Filter, Search } from 'lucide-react';
import OfferCard from './atoms/OfferCard';
import BackButton from './atoms/BackButton';
import SharePopup from './atoms/SharePopup';
import DirectionPopup from './atoms/DirectionPopup';
import BottomNavigation from './atoms/BottomNavigation';

interface AllOffersScreenProps {
  title: string;
  offers: any[];
  onBack: () => void;
  onOfferClick: (offer: any) => void;
  onLikeCountChange?: (count: number) => void;
  onNavigate?: (screen: string, data?: any) => void;
}

export default function AllOffersScreen({ 
  title, 
  offers, 
  onBack, 
  onOfferClick,
  onLikeCountChange,
  onNavigate
}: AllOffersScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('distance');
  const [likedOffers, setLikedOffers] = useState<number[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showDirectionPopup, setShowDirectionPopup] = useState(false);
  const [directionData, setDirectionData] = useState<any>(null);

  const categories = ['All', 'Food', 'Fashion', 'Electronics', 'Beauty', 'Fitness', 'Grocery', 'Banking'];
  const sortOptions = [
    { label: 'Distance', value: 'distance' },
    { label: 'Discount', value: 'discount' },
    { label: 'Rating', value: 'rating' },
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' }
  ];
  

  const handleLikeOffer = (offerId: number, liked: boolean) => {
    setLikedOffers(prev => {
      const newLiked = liked 
        ? [...prev, offerId]
        : prev.filter(id => id !== offerId);
      
      setTimeout(() => {
        onLikeCountChange?.(newLiked.length);
        localStorage.setItem('wishlistOffers', JSON.stringify(newLiked));
      }, 0);
      
      return newLiked;
    });
  };

  const handleShare = (offer: any) => {
    setSelectedOffer(offer);
    setShowSharePopup(true);
  };

  // const handleGetDirections = (offer: any) => {
  //   setDirectionData({
  //     storeName: offer.title,
  //     storeAddress: offer.address,
  //     distance: offer.distance,
  //     estimatedTime: `${Math.ceil(parseFloat(offer.distance) * 4)} min`
  //   });
  //   setShowDirectionPopup(true);
  // };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || offer.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedOffers = [...filteredOffers].sort((a, b) => {
    switch (sortBy) {
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance);
      case 'discount':
        return b.discount - a.discount;
      case 'rating':
        return b.rating - a.rating;
      case 'price_asc':
        return a.discountedPrice - b.discountedPrice;
      case 'price_desc':
        return b.discountedPrice - a.discountedPrice;
      default:
        return 0;
    }
  });

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white px-4 py-3 shadow-sm"
      >
        {/* Back Button above Search Bar */}
        <div className="flex items-center justify-between mb-3">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            {/* <span className="text-sm font-medium text-gray-600">Back</span> */}
          </button>
          
          {/* best deal heading */}
          <h1 className="text-lg font-bold text-gray-900 flex-1 text-center">
            {title}
          </h1>
          
          {/* Spacer to balance the layout */}
          <div className="w-20" />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search offers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Filters - Commented out as per original */}
        {/* <div className="flex space-x-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                selectedCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div> */}
      </motion.div>

      {/* Sort Options - Commented out as per original */}
      {/* <div className="bg-white px-4 py-2 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm text-purple-600 bg-transparent border-none outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div> */}

      {/* Results Count */}
      <div className="bg-white px-4 py-2 border-b border-gray-100">
        <p className="text-sm text-gray-600">
          {sortedOffers.length} {sortedOffers.length === 1 ? 'offer' : 'offers'} found
        </p>
      </div>

      {/* Offers Grid */}
      <div className="flex-1 overflow-y-auto p-4 pb-20">
        <div className="grid grid-cols-2 gap-3">
          {sortedOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onLike={handleLikeOffer}
              onShare={() => handleShare(offer)}
              onClick={() => onOfferClick(offer)}
              className="w-full"
            />
          ))}
        </div>

        {sortedOffers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No offers found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Direction Popup */}
      {showDirectionPopup && directionData && (
        <DirectionPopup
          storeName={directionData.storeName}
          storeAddress={directionData.storeAddress}
          distance={directionData.distance}
          estimatedTime={directionData.estimatedTime}
        />
      )}

      {/* Share Popup */}
      <SharePopup
        isOpen={showSharePopup}
        onClose={() => setShowSharePopup(false)}
        offer={selectedOffer}
      />

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeScreen="home"
        onNavigate={onNavigate || (() => {})}
      />
    </div>
  );
}



