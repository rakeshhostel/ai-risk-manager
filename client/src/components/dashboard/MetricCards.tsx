import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, ShieldAlert, FileSearch, ShieldCheck } from 'lucide-react';

interface MetricCardsProps {
  stats: {
    totalTransactions: number;
    highRisk: number;
    critical: number;
    underReview: number;
    fraudPrevented: number;
  };
}

const Card = ({ title, value, icon: Icon, color, delay }: any) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500;
    const stepTime = Math.abs(Math.floor(duration / (end || 1)));
    
    if (end === 0) return;

    const timer = setInterval(() => {
      start += Math.ceil(end / 20);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
      style={{ perspective: 1000 }}
      className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-xl p-6 flex flex-col justify-between shadow-xl"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <div className="text-3xl font-bold text-white tracking-tight">
        {title === 'Fraud Prevented' ? `₹${count.toLocaleString()}` : count.toLocaleString()}
      </div>
    </motion.div>
  );
};

const MetricCards: React.FC<MetricCardsProps> = ({ stats }) => {
  const cards = [
    { title: 'Total Transactions', value: stats.totalTransactions, icon: Activity, color: 'bg-blue-500' },
    { title: 'High Risk', value: stats.highRisk, icon: AlertTriangle, color: 'bg-orange-500' },
    { title: 'Critical', value: stats.critical, icon: ShieldAlert, color: 'bg-red-500' },
    { title: 'Under Review', value: stats.underReview, icon: FileSearch, color: 'bg-yellow-500' },
    { title: 'Fraud Prevented', value: stats.fraudPrevented, icon: ShieldCheck, color: 'bg-green-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, i) => (
        <Card key={card.title} {...card} delay={i * 0.1} />
      ))}
    </div>
  );
};

export default MetricCards;
