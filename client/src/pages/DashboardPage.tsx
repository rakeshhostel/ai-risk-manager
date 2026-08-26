import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import MetricCards from '../components/dashboard/MetricCards';
import RiskOverview from '../components/dashboard/RiskOverview';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import api from '../services/api';
import { DashboardStats } from '../types';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setStats(res.data);
      } catch (err: any) {
        setError('Failed to load dashboard data. Make sure the backend is running.');
        // Use demo data as fallback
        setStats({
          totalTransactions: 24892,
          highRisk: 1284,
          critical: 327,
          underReview: 856,
          fraudPrevented: 1870000,
          riskDistribution: { low: 18500, medium: 4781, high: 1284, critical: 327 },
          recentTransactions: [],
          recentAlerts: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Real-time payment risk intelligence</p>
      </div>

      {error && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-400 text-sm">
          {error} — Showing demo data.
        </div>
      )}

      {stats && (
        <>
          <MetricCards stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RiskOverview distribution={stats.riskDistribution} />
            </div>
            <div>
              <RecentAlerts alerts={stats.recentAlerts} />
            </div>
          </div>
          <ActivityFeed transactions={stats.recentTransactions} />
        </>
      )}
    </motion.div>
  );
};
