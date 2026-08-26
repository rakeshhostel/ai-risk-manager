import React from 'react';
import { Alert } from '@/types';
import { ShieldAlert, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecentAlertsProps {
  alerts: Alert[];
}

const getSeverityStyles = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical': return { icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' };
    case 'high': return { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10' };
    case 'medium': return { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    default: return { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' };
  }
};

const RecentAlerts: React.FC<RecentAlertsProps> = ({ alerts }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-xl p-6 shadow-xl h-[400px] flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4">Active Alerts</h3>
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No active alerts.</div>
        ) : (
          alerts.map((alert, idx) => {
            const { icon: Icon, color, bg } = getSeverityStyles(alert.severity);
            return (
              <motion.div 
                key={alert._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-lg border border-white/5 bg-gray-900/50 hover:bg-gray-800 transition-colors cursor-pointer flex gap-4 items-start`}
              >
                <div className={`p-2 rounded-full ${bg} ${color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">{alert.title}</h4>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">{alert.description}</p>
                  <span className="text-gray-500 text-xs mt-2 block">
                    {new Date(alert.createdAt).toLocaleString()}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentAlerts;
