// import React from 'react';
// import { motion } from 'motion/react';
// import { Percent, Tag, RefreshCw, TrendingUp } from 'lucide-react';

// interface OfferTypeFilterProps {
//   selectedType: string | null;
//   onTypeSelect: (type: string | null) => void;
//   onNavigate?: (screen: string) => void;
// }

// const OfferTypeFilter: React.FC<OfferTypeFilterProps> = ({
//   selectedType,
//   onTypeSelect,
//   onNavigate
// }) => {
//   const offerTypes = [
//     {
//       id: "discounted",
//       label: "Discounted Offers",
//       icon: Percent,
//       color: "from-pink-500 to-red-500",
//       bgColor: "bg-pink-50",
//       textColor: "text-pink-600",
//       screen: "discountedOffers",
//     },
//     {
//       id: "flat",
//       label: "Flat Offers",
//       icon: Tag,
//       color: "from-blue-500 to-cyan-500",
//       bgColor: "bg-blue-50",
//       textColor: "text-blue-600",
//       screen: "flatOffers",
//     },
//     {
//       id: "exchange",
//       label: "Exchange Offers",
//       icon: RefreshCw,
//       color: "from-green-500 to-teal-500",
//       bgColor: "bg-green-50",
//       textColor: "text-green-600",
//       screen: "exchangeOffers",
//     },
//     {
//       id: "upto50",
//       label: "Up to 50% Off",
//       icon: TrendingUp,
//       color: "from-orange-500 to-red-500",
//       bgColor: "bg-orange-50",
//       textColor: "text-orange-600",
//       screen: "upTo50Offers",
//     },
//   ];

//   const handleClick = (item: any) => {
//     console.log("CLICKED → ", item.screen);

//     if (onNavigate) {
//       onNavigate(item.screen);
//       return;
//     }

//     onTypeSelect(item.id === selectedType ? null : item.id);
//   };

//   return (
//     <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide z-30 relative">
//       {offerTypes.map((item) => {
//         const Icon = item.icon;
//         const isActive = selectedType === item.id;

//         return (
//           <motion.button
//             key={item.id}
//             onClick={() => handleClick(item)}
//             whileTap={{ scale: 0.95 }}
//             whileHover={{ scale: 1.05 }}
//             className={`flex flex-col items-center justify-center min-w-[110px] px-4 py-3 rounded-xl transition-all cursor-pointer
//               ${isActive
//                 ? `bg-gradient-to-br ${item.color} text-white shadow-lg`
//                 : `${item.bgColor} ${item.textColor}`
//               }`}
//           >
//             <Icon className={`w-6 h-6 mb-1 ${isActive ? "text-white" : ""}`} />
//             <span className="text-xs text-center whitespace-nowrap">
//               {item.label}
//             </span>
//           </motion.button>
//         );
//       })}
//     </div>
//   );
// };

// export default OfferTypeFilter;
////////////

import React from 'react';
import { motion } from 'motion/react';
import { Percent, Tag, RefreshCw, TrendingUp } from 'lucide-react';

interface OfferTypeFilterProps {
  selectedType: string | null;
  onTypeSelect: (type: string | null) => void;
  onNavigate?: (screen: string) => void;
}

const OfferTypeFilter: React.FC<OfferTypeFilterProps> = ({
  selectedType,
  onTypeSelect,
  onNavigate
}) => {
  const offerTypes = [
    {
      id: "discounted",
      label: "Discounted Offers",
      icon: "https://obz-icons.s3.ap-south-1.amazonaws.com/Discount+icons_.jpg",
      iconType: "image",
      color: "from-pink-500 to-red-500",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
      screen: "discountedOffers",
    },
    {
      id: "flat",
      label: "Flat Offers",
      icon: "https://obz-icons.s3.ap-south-1.amazonaws.com/flat+offer+icons_.jpg",
      iconType: "image",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      screen: "flatOffers",
    },
    {
      id: "exchange",
      label: "Exchange Offers",
      icon: "https://obz-icons.s3.ap-south-1.amazonaws.com/Exchange+offer+icons_.jpg",
      iconType: "image",
      color: "from-green-500 to-teal-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      screen: "exchangeOffers",
    },
    {
      id: "upto50",
      label: "Up to 50% Off",
      icon: "https://obz-icons.s3.ap-south-1.amazonaws.com/above+50%25+icons_.jpg",
      iconType: "image",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      screen: "upTo50Offers",
    },
  ];

  const handleClick = (item: any) => {
    if (onNavigate) {
      onNavigate(item.screen);
      return;
    }
    onTypeSelect(item.id === selectedType ? null : item.id);
  };

  return (
    <div className="flex justify-between gap-3 w-full px-1 relative z-50">
      {offerTypes.map((item) => {
        const isActive = selectedType === item.id;
        const isImage = item.iconType === "image";

        return (
          <motion.button
            key={item.id}
            onClick={() => handleClick(item)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className={`
              flex-1 flex flex-col items-center justify-center
              px-4 py-3
              rounded-xl cursor-pointer select-none
              transition-all duration-200 ease-out
              shadow-sm hover:shadow-md active:scale-95
              ${
                isActive
                  ? `bg-gradient-to-br ${item.color} text-white shadow-lg`
                  : `${item.bgColor} ${item.textColor}`
              }
            `}
          >
            {isImage ? (
              <img
                src={item.icon as string}
                alt={item.label}
                className="w-10 h-10 mb-1 object-contain"
              />
            ) : (
              (() => {
                const Icon = item.icon as React.ComponentType<{ className?: string }>;
                return <Icon className={`w-10 h-10 mb-1 ${isActive ? "text-white" : ""}`} />;
              })()
            )}
            <span className="text-[11px] text-center leading-tight font-medium">
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default OfferTypeFilter;
