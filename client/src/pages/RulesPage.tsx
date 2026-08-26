import React from 'react';
import { motion } from 'framer-motion';
import RuleEngine from '../components/rules/RuleEngine';

export const RulesPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Rule Engine</h1>
        <p className="text-gray-400 text-sm mt-1">Configure risk scoring rules</p>
      </div>
      <RuleEngine />
    </motion.div>
  );
};
