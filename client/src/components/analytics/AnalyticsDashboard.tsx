import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar
} from 'recharts';
import { Shield, TrendingUp, Cpu, BarChart3, Activity, Clock, Sliders, DollarSign, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const riskData = [
  { name: 'Low Risk', value: 65, color: '#10b981' },     // Neon Emerald
  { name: 'Medium Risk', value: 20, color: '#eab308' },  // Yellow
  { name: 'High Risk', value: 10, color: '#f97316' },     // Orange
  { name: 'Critical Risk', value: 5, color: '#ef4444' },  // Red
];

const trendData = [
  { day: 'Day 1', legitimate: 420, fraudulent: 12 },
  { day: 'Day 5', legitimate: 580, fraudulent: 18 },
  { day: 'Day 10', legitimate: 690, fraudulent: 25 },
  { day: 'Day 15', legitimate: 810, fraudulent: 8 },
  { day: 'Day 20', legitimate: 950, fraudulent: 30 },
  { day: 'Day 25', legitimate: 1100, fraudulent: 15 },
  { day: 'Day 30', legitimate: 1250, fraudulent: 22 },
];

const methodData = [
  { name: 'Credit Card', risk: 85, fill: '#8b5cf6' },
  { name: 'UPI', risk: 45, fill: '#10b981' },
  { name: 'Net Banking', risk: 30, fill: '#06b6d4' },
  { name: 'Wallet', risk: 65, fill: '#ec4899' },
];

// Custom Tooltip component for Recharts
const GlassTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/85 border border-white/10 backdrop-blur-xl p-4 rounded-xl shadow-2xl font-mono text-xs space-y-1.5">
        <p className="text-gray-400 font-bold uppercase">{label}</p>
        {payload.map((p: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between gap-4">
            <span style={{ color: p.color || p.fill }} className="capitalize font-semibold">{p.name}:</span>
            <span className="text-white font-bold">{p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6 text-gray-200">
      {/* Top row: Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-surface border border-border p-5 rounded-2xl flex items-center justify-between glass hover:border-emerald-500/20 transition-all shadow-glass"
        >
          <div className="space-y-2">
            <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">Fraud Prevented</div>
            <div className="text-3xl font-extrabold text-white tracking-tight">₹45.2M</div>
            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span>▲ +12%</span>
              <span className="text-gray-600">vs last month</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-glow-emerald">
            <DollarSign size={20} />
          </div>
        </motion.div>

        {/* Metric 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-surface border border-border p-5 rounded-2xl flex items-center justify-between glass hover:border-cyan-500/20 transition-all shadow-glass"
        >
          <div className="space-y-2">
            <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">False Positive Rate</div>
            <div className="text-3xl font-extrabold text-white tracking-tight">1.2%</div>
            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span>▼ -0.3%</span>
              <span className="text-gray-600">vs last month</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-glow-cyan">
            <Activity size={20} />
          </div>
        </motion.div>

        {/* Metric 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-surface border border-border p-5 rounded-2xl flex items-center justify-between glass hover:border-primary/20 transition-all shadow-glass"
        >
          <div className="space-y-2">
            <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">Avg Resolution Time</div>
            <div className="text-3xl font-extrabold text-white tracking-tight">4m 12s</div>
            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <span>▲ +1.5s</span>
              <span className="text-gray-600">due to volume spikes</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-glow-primary">
            <Clock size={20} />
          </div>
        </motion.div>

        {/* Metric 4 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-surface border border-border p-5 rounded-2xl flex items-center justify-between glass hover:border-secondary/20 transition-all shadow-glass"
        >
          <div className="space-y-2">
            <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">Active AI Rules</div>
            <div className="text-3xl font-extrabold text-white tracking-tight">24 Active</div>
            <div className="text-[10px] font-mono text-secondary flex items-center gap-1">
              <span>● 8 Category Clusters</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary shadow-glow-secondary">
            <Sliders size={20} />
          </div>
        </motion.div>
      </div>

      {/* Main Row: Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Distribution (Pie) */}
        <div className="bg-surface border border-border rounded-2xl p-5 glass shadow-glass flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
            <Shield size={16} className="text-primary" />
            <h3 className="font-semibold text-white tracking-wide text-sm font-mono uppercase">Risk Classification</h3>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  innerRadius={65}
                  outerRadius={80}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<GlassTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center stat overlay */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[10px] text-gray-500 font-mono uppercase">Total Audited</span>
              <span className="text-2xl font-extrabold text-white">250</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono text-gray-400">
            {riskData.map((data, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-black/20 p-2 rounded border border-white/5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                <span>{data.name}: <b>{data.value}%</b></span>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction Volume (Area Gradient) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-5 glass shadow-glass">
          <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
            <TrendingUp size={16} className="text-secondary" />
            <h3 className="font-semibold text-white tracking-wide text-sm font-mono uppercase">System Audit Volumetrics</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLegit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02}/>
                  </linearGradient>
                  <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" stroke="#4b5563" fontSize={10} fontClassName="font-mono" />
                <YAxis stroke="#4b5563" fontSize={10} fontClassName="font-mono" />
                <Tooltip content={<GlassTooltip />} />
                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '15px' }} />
                <Area name="Legitimate Cleared" type="monotone" dataKey="legitimate" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorLegit)" />
                <Area name="Fraud Blocked" type="monotone" dataKey="fraudulent" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorFraud)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Row: Rule Weights by Channel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Payment Method Risk Breakdown (Horizontal Bar) */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl p-5 glass shadow-glass">
          <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
            <BarChart3 size={16} className="text-accent" />
            <h3 className="font-semibold text-white tracking-wide text-sm font-mono uppercase">Vulnerability Index by Channel</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={methodData} layout="vertical" margin={{ left: -10, top: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={true} vertical={false}/>
                <XAxis type="number" stroke="#4b5563" fontSize={10} fontClassName="font-mono" />
                <YAxis dataKey="name" type="category" stroke="#4b5563" fontSize={10} fontClassName="font-mono" width={80} />
                <Tooltip content={<GlassTooltip />} />
                <Bar name="Risk Rating" dataKey="risk" radius={[0, 6, 6, 0]} barSize={18}>
                  {methodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Security Compliance Diagnostics */}
        <div className="bg-surface border border-border rounded-2xl p-5 glass shadow-glass flex flex-col justify-between">
          <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
            <Cpu size={16} className="text-secondary" />
            <h3 className="font-semibold text-white tracking-wide text-sm font-mono uppercase">AI Threat Diagnostics</h3>
          </div>
          <div className="space-y-3.5 text-xs font-mono text-gray-400">
            <div className="flex justify-between items-center bg-black/20 p-3 rounded border border-white/5">
              <span>Model Confidence Ratio</span>
              <span className="text-white font-bold">96.4%</span>
            </div>
            <div className="flex justify-between items-center bg-black/20 p-3 rounded border border-white/5">
              <span>RAG Knowledge Index</span>
              <span className="text-secondary font-bold">1,480 Docs</span>
            </div>
            <div className="flex justify-between items-center bg-black/20 p-3 rounded border border-white/5">
              <span>Bypass/False Negatives</span>
              <span className="text-emerald-400 font-bold">0.02%</span>
            </div>
            <div className="flex justify-between items-center bg-black/20 p-3 rounded border border-white/5">
              <span>System Compliance SLA</span>
              <span className="text-white font-bold">99.98%</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border flex items-center gap-2.5 text-[10px] text-gray-500 font-mono">
            <Award size={14} className="text-primary animate-pulse" />
            <span>PCI-DSS COMPLIANT SECURITY PROTOCOLS ENFORCED</span>
          </div>
        </div>

      </div>
    </div>
  );
}
