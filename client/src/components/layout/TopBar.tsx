import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';

export const TopBar: React.FC = () => {
  const { toggleSidebar } = useAppStore();
  const { user, logout } = useAuthStore();

  return (
    <div className="h-16 glass border-b px-4 flex items-center justify-between z-10 relative">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-surfaceHover text-gray-400 hover:text-white">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search entities, txns..." 
            className="bg-surface border border-border rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-primary w-64 text-gray-200"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-surfaceHover text-gray-400 hover:text-white relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 border-l border-border pl-4">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="text-sm">
            <div className="text-gray-200">{user?.name || 'User'}</div>
            <div className="text-xs text-gray-500 cursor-pointer hover:text-red-400" onClick={logout}>Logout</div>
          </div>
        </div>
      </div>
    </div>
  );
};
