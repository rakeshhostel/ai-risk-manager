import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface RiskOverviewProps {
  distribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

const COLORS = {
  low: '#22c55e',
  medium: '#eab308',
  high: '#f97316',
  critical: '#ef4444'
};

const RiskOverview: React.FC<RiskOverviewProps> = ({ distribution }) => {
  const data = [
    { name: 'Low Risk', value: distribution.low, color: COLORS.low },
    { name: 'Medium Risk', value: distribution.medium, color: COLORS.medium },
    { name: 'High Risk', value: distribution.high, color: COLORS.high },
    { name: 'Critical', value: distribution.critical, color: COLORS.critical },
  ].filter(item => item.value > 0);

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-xl p-6 shadow-xl h-[400px]">
      <h3 className="text-lg font-semibold text-white mb-4">Risk Distribution</h3>
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: '#9ca3af' }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskOverview;
