import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, ShieldAlert, Network, Bell, Brain, BarChart3, Settings, ScrollText, GitMerge } from 'lucide-react';
import { useAppStore } from '../../store/appStore';

export const Sidebar: React.FC = () => {
  const { sidebarOpen } = useAppStore();
  
  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/transactions', icon: Receipt, label: 'Transactions' },
    { to: '/risk', icon: ShieldAlert, label: 'Risk Analysis' },
    { to: '/network', icon: Network, label: '3D Network' },
    { to: '/alerts', icon: Bell, label: 'Alerts' },
    { to: '/investigator', icon: Brain, label: 'AI Investigator' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/rules', icon: GitMerge, label: 'Rules' },
    { to: '/audit', icon: ScrollText, label: 'Audit Log' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  if (!sidebarOpen) return null;

  return (
    <div className="w-64 glass border-r h-full flex flex-col z-10 relative">
      <div className="p-4 border-b border-border/50">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <ShieldAlert className="w-6 h-6" />
          AI Risk Manager
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-gray-100 hover:bg-surfaceHover'}`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
