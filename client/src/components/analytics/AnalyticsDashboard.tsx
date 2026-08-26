import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar
} from 'recharts';

const riskData = [
  { name: 'Low Risk', value: 65, color: '#22c55e' },
  { name: 'Medium Risk', value: 20, color: '#eab308' },
  { name: 'High Risk', value: 10, color: '#f97316' },
  { name: 'Critical', value: 5, color: '#ef4444' },
];

const trendData = Array.from({ length: 30 }).map((_, i) => ({
  day: `Day ${i+1}`,
  legitimate: Math.floor(Math.random() * 1000) + 500,
  fraudulent: Math.floor(Math.random() * 50) + 5,
}));

const methodData = [
  { name: 'Credit Card', risk: 85 },
  { name: 'UPI', risk: 45 },
  { name: 'Net Banking', risk: 30 },
  { name: 'Wallet', risk: 65 },
];

export default function AnalyticsDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-white">
      {/* Risk Distribution */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
        <h3 className="font-semibold text-lg mb-4">Risk Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction Volume */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
        <h3 className="font-semibold text-lg mb-4">Transaction Volume (30 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="day" hide />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Line type="monotone" dataKey="legitimate" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="fraudulent" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Method Risk */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5">
        <h3 className="font-semibold text-lg mb-4">Risk by Payment Method</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={methodData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={true} vertical={false}/>
              <XAxis type="number" stroke="#9ca3af" />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} width={80} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              />
              <Bar dataKey="risk" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 flex flex-col justify-center">
          <div className="text-gray-400 text-sm mb-1">Fraud Prevented (INR)</div>
          <div className="text-3xl font-bold text-green-400">₹45.2M</div>
          <div className="text-xs text-green-500 mt-2">+12% vs last month</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 flex flex-col justify-center">
          <div className="text-gray-400 text-sm mb-1">False Positive Rate</div>
          <div className="text-3xl font-bold text-cyan-400">1.2%</div>
          <div className="text-xs text-green-500 mt-2">-0.3% vs last month</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 flex flex-col justify-center">
          <div className="text-gray-400 text-sm mb-1">Avg Investigation Time</div>
          <div className="text-3xl font-bold text-blue-400">4m 12s</div>
        </div>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 flex flex-col justify-center">
          <div className="text-gray-400 text-sm mb-1">Active AI Rules</div>
          <div className="text-3xl font-bold text-purple-400">24</div>
        </div>
      </div>
    </div>
  );
}
