import React from 'react';
import { motion } from 'framer-motion';
import AuditLog from '../components/audit/AuditLog';

export const AuditPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Audit Log</h1>
        <p className="text-gray-400 text-sm mt-1">Complete trail of analyst actions and decisions</p>
      </div>
      <AuditLog />
    </motion.div>
  );
};
