
import React from 'react';
import { motion } from 'framer-motion';

const Logo: React.FC = () => {
  const logoVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.08
      }
    }
  };
  
  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.a href="/" className="flex items-center" variants={logoVariants}>
      <h1 className=" md:text-2xl font-bold font-heading">
        {["A", "b", "d"].map((letter, index) => (
          <motion.span 
            key={`name-${index}`}
            className="text-primary animate-glow"
            variants={letterVariants}
          >
            {letter}
          </motion.span>
        ))}
     
       
      </h1>
    </motion.a>
  );
};

export default Logo;
