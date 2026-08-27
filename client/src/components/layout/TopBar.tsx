import React, { useState } from 'react';
import { Bell, Search, Menu, Trash2, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import { useNotificationStore } from '../../store/notificationStore';

export const TopBar: React.FC = () => {
  const { toggleSidebar } = useAppStore();
  const { user, logout } = useAuthStore();
  const { notifications, markAsRead, clearNotifications } = useNotificationStore();
  const [showDropdown, setShowDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotifColor = (type: string) => {
    switch (type) {
      case 'risk': return 'text-red-400 border-red-500/20 bg-red-500/5';
      case 'user': return 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5';
      case 'success': return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
      default: return 'text-gray-300 border-white/5 bg-white/5';
    }
  };

  return (
    <div className="h-16 glass border-b px-4 flex items-center justify-between z-40 relative">
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
      
      <div className="flex items-center gap-4 relative">
        {/* Notifications Icon & Badge */}
        <button 
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 rounded-lg hover:bg-surfaceHover text-gray-400 hover:text-white relative transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown Tray */}
        {showDropdown && (
          <div className="absolute right-0 top-12 w-80 bg-black/90 border border-white/10 backdrop-blur-2xl rounded-2xl p-4 shadow-2xl z-50 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">SECURITY NOTIFICATION TRAY</span>
              {notifications.length > 0 && (
                <button 
                  onClick={clearNotifications}
                  className="text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1 text-[10px] font-mono"
                >
                  <Trash2 size={12} /> CLEAR ALL
                </button>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {notifications.map((n) => (
                <div 
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-2 hover:scale-[1.01] ${getNotifColor(n.type)} ${!n.read ? 'border-l-2 border-l-secondary' : 'opacity-60'}`}
                >
                  <div className="space-y-1">
                    <p className="font-sans text-gray-200 leading-relaxed">{n.message}</p>
                    <span className="text-[9px] font-mono text-gray-500">{new Date(n.timestamp).toLocaleTimeString()}</span>
                  </div>
                  {!n.read && (
                    <CheckCircle2 size={14} className="shrink-0 text-secondary hover:text-emerald-400 transition-colors" />
                  )}
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-center py-6 text-gray-500 font-mono text-xs">
                  No notifications recorded.
                </div>
              )}
            </div>
          </div>
        )}

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
