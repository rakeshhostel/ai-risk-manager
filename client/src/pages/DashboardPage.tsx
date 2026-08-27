import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ClipboardList, CheckCircle, ShieldAlert, Plus, Terminal, Activity, ArrowRight } from 'lucide-react';
import MetricCards from '../components/dashboard/MetricCards';
import RiskOverview from '../components/dashboard/RiskOverview';
import RecentAlerts from '../components/dashboard/RecentAlerts';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import api from '../services/api';
import { DashboardStats } from '../types';
import { useNotificationStore } from '../store/notificationStore';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Connect task/notification store
  const { tasks, notifications, addTask, resolveTask, generateDailyAITasks } = useNotificationStore();
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    generateDailyAITasks();
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

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    addTask(newTaskText);
    setNewTaskText('');
  };

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
        <p className="text-gray-400 text-sm mt-1 font-mono">Real-time payment risk intelligence console</p>
      </div>

      {error && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-yellow-400 text-sm">
          {error} — Showing cached mock ledger data.
        </div>
      )}

      {stats && (
        <>
          <MetricCards stats={stats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Overview & Activity */}
            <div className="lg:col-span-2 space-y-6">
              <RiskOverview distribution={stats.riskDistribution} />
              <ActivityFeed transactions={stats.recentTransactions} />
            </div>

            {/* Side Control Panels */}
            <div className="space-y-6">
              <RecentAlerts alerts={stats.recentAlerts} />

              {/* 📋 Tomorrow's Task Planner */}
              <div className="bg-surface border border-border p-5 rounded-2xl glass shadow-glass flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <ClipboardList className="text-primary w-5 h-5" />
                  <h3 className="font-semibold text-white tracking-wide font-mono text-sm uppercase">Security Tasks Planner</h3>
                </div>

                {/* Add task form */}
                <form onSubmit={handleAddTask} className="flex gap-2">
                  <input 
                    type="text"
                    value={newTaskText}
                    onChange={e => setNewTaskText(e.target.value)}
                    placeholder="Plan tomorrow's task..."
                    className="flex-1 bg-black/40 border border-border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-primary text-gray-200"
                  />
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-primary/80 px-3 py-2 rounded-xl text-white transition-all shadow-glow-primary hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Plus size={14} />
                  </button>
                </form>

                {/* Tasks list */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  <AnimatePresence>
                    {tasks.map(t => (
                      <motion.div 
                        key={t.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${t.resolved ? 'bg-emerald-500/5 border-emerald-500/10 opacity-50' : 'bg-black/20 border-white/5'}`}
                      >
                        <span className={`text-xs leading-relaxed font-sans ${t.resolved ? 'line-through text-emerald-400 font-medium' : 'text-gray-300'}`}>
                          {t.text}
                        </span>
                        {!t.resolved && (
                          <button 
                            onClick={() => resolveTask(t.id)}
                            className="text-gray-500 hover:text-emerald-400 p-1 border border-border hover:border-emerald-500/20 bg-white/5 rounded-lg transition-all"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {tasks.length === 0 && (
                    <div className="text-center py-6 text-gray-500 font-mono text-xs">
                      No security tasks scheduled.
                    </div>
                  )}
                </div>
              </div>

              {/* 📟 AI Live Telemetry Log Feed */}
              <div className="bg-surface border border-border p-5 rounded-2xl glass shadow-glass flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="text-secondary w-5 h-5" />
                    <h3 className="font-semibold text-white tracking-wide font-mono text-sm uppercase">AI Telemetry Logs</h3>
                  </div>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                  </span>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto font-mono text-[10px] text-gray-400 pr-1">
                  {notifications.slice(0, 5).map(n => (
                    <div 
                      key={n.id} 
                      className={`p-2 rounded bg-black/35 border-l-2 flex items-start gap-2 ${
                        n.type === 'risk' ? 'border-l-accent text-accent bg-accent/5' : 
                        n.type === 'success' ? 'border-l-emerald-500 text-emerald-400 bg-emerald-500/5' : 
                        n.type === 'user' ? 'border-l-cyan-400 text-cyan-300 bg-cyan-400/5' : 'border-l-gray-600 text-gray-400'
                      }`}
                    >
                      <ArrowRight size={10} className="shrink-0 mt-0.5" />
                      <div>
                        <div>{n.message}</div>
                        <div className="text-[8px] text-gray-600 mt-0.5">{new Date(n.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="text-center py-6 text-gray-600">
                      No logs in session registry.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
