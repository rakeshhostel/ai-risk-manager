import React from 'react';
import { motion } from 'framer-motion';

export const FloatingCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`glass rounded-xl p-6 shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
};
