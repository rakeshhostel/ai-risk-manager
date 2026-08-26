import React from 'react';
import { motion } from 'framer-motion';
import AlertCenter from '../components/alerts/AlertCenter';

export const AlertsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Alert Center</h1>
        <p className="text-gray-400 text-sm mt-1">Monitor and respond to risk alerts</p>
      </div>
      <AlertCenter />
    </motion.div>
  );
};
