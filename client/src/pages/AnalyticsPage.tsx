import React from 'react';
import { motion } from 'framer-motion';
import AnalyticsDashboard from '../components/analytics/AnalyticsDashboard';

export const AnalyticsPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Risk metrics and trend analysis</p>
      </div>
      <AnalyticsDashboard />
    </motion.div>
  );
};
