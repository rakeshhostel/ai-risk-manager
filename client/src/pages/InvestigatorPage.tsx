import React from 'react';
import { motion } from 'framer-motion';
import AIInvestigator from '../components/ai/AIInvestigator';

export const InvestigatorPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 h-full"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">AI Investigator</h1>
        <p className="text-gray-400 text-sm mt-1">AI-powered risk investigation assistant</p>
      </div>
      <AIInvestigator />
    </motion.div>
  );
};
