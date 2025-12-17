// import React from 'react';
// import { motion } from 'motion/react';
// import { Phone, Sparkles } from 'lucide-react';

// const ContactAdvertisement: React.FC = () => {
//   const handleClick = () => {
//     window.open('tel:9008522366', '_self');
//   };

//   return (
//     <motion.button
//       onClick={handleClick}
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       whileHover={{ scale: 1.05 }}
//       whileTap={{ scale: 0.95 }}
//       className="relative inline-flex items-center space-x-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
//     >
//       {/* Animated spark effect */}
//       <motion.div
//         animate={{
//           scale: [1, 1.2, 1],
//           opacity: [0.5, 1, 0.5]
//         }}
//         transition={{
//           duration: 2,
//           repeat: Infinity,
//           ease: "easeInOut"
//         }}
//         className="absolute -top-1 -left-1"
//       >
//         <Sparkles className="w-3 h-3 text-yellow-300" />
//       </motion.div>
      
//       <motion.div
//         animate={{
//           scale: [1, 1.2, 1],
//           opacity: [0.5, 1, 0.5]
//         }}
//         transition={{
//           duration: 2,
//           repeat: Infinity,
//           ease: "easeInOut",
//           delay: 1
//         }}
//         className="absolute -bottom-1 -right-1"
//       >
//         <Sparkles className="w-3 h-3 text-yellow-300" />
//       </motion.div>

//       <Phone className="w-3.5 h-3.5" />
//       <div className="flex flex-col">
//         <span className="text-[9px] opacity-90">Ads</span>
//         <span className="font-bold text-xs">9008522366</span>
//       </div>
//     </motion.button>
//   );
// };

// export default ContactAdvertisement;
///////////


import React from 'react';
import { motion } from 'motion/react';
import { Phone, Sparkles } from 'lucide-react';

const ContactAdvertisement: React.FC = () => {
  const handleClick = () => {
    window.open('tel:9008522366', '_self');
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="
        relative inline-flex items-center justify-center 
        space-x-2
        bg-gradient-to-r from-purple-500 to-pink-500 
        text-white 
        px-4 py-2 
        rounded-lg shadow-lg hover:shadow-xl 
        transition-shadow 
        w-32
      "
    >
      {/* Animated spark effect */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-1 -left-1"
      >
        <Sparkles className="w-3 h-3 text-yellow-300" />
      </motion.div>
      
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute -bottom-1 -right-1"
      >
        <Sparkles className="w-3 h-3 text-yellow-300" />
      </motion.div>

      <Phone className="w-4 h-4" />

      <div className="flex flex-col leading-tight">
        <span className="text-[10px] opacity-90">Ads</span>
        <span className="font-bold text-sm">9008522366</span>
      </div>
    </motion.button>
  );
};

export default ContactAdvertisement;
