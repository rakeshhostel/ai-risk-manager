import { create } from 'zustand';

export interface NotificationItem {
  id: string;
  type: 'risk' | 'user' | 'success' | 'info';
  message: string;
  timestamp: string;
  read: boolean;
}

export interface TodoTask {
  id: string;
  text: string;
  resolved: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: NotificationItem[];
  tasks: TodoTask[];
  addNotification: (type: 'risk' | 'user' | 'success' | 'info', message: string) => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
  addTask: (text: string) => void;
  resolveTask: (id: string) => void;
  removeTask: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [
    { id: '1', type: 'risk', message: '🔴 AI Alert: High-risk transaction detected (TXN-100015) in Delhi.', timestamp: new Date(Date.now() - 3600000).toISOString(), read: false },
    { id: '2', type: 'user', message: '👤 New Analyst Profile created for Priya Patel.', timestamp: new Date(Date.now() - 7200000).toISOString(), read: false },
    { id: '3', type: 'info', message: '⚡ System Indexer: 250 transactions successfully synced with MongoDB.', timestamp: new Date(Date.now() - 10800000).toISOString(), read: true }
  ],
  tasks: [
    { id: 't1', text: 'Audit high-risk transactions from unknown device IDs', resolved: false, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 't2', text: 'Confirm IP proxy gateway blacklist with network operators', resolved: false, createdAt: new Date(Date.now() - 43200000).toISOString() },
    { id: 't3', text: 'Re-evaluate payment velocity rule weights for UPI', resolved: true, createdAt: new Date(Date.now() - 20000000).toISOString() }
  ],

  addNotification: (type, message) => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      type,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    set(state => ({
      notifications: [newNotif, ...state.notifications]
    }));
  },

  clearNotifications: () => set({ notifications: [] }),

  markAsRead: (id) => set(state => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  addTask: (text) => {
    const newTask: TodoTask = {
      id: `task_${Date.now()}`,
      text,
      resolved: false,
      createdAt: new Date().toISOString()
    };
    set(state => ({
      tasks: [newTask, ...state.tasks]
    }));
    get().addNotification('info', `📋 Task Added: "${text}" planned for tomorrow.`);
  },

  resolveTask: (id) => {
    const task = get().tasks.find(t => t.id === id);
    if (!task) return;
    
    set(state => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, resolved: true } : t)
    }));
    
    // Auto-trigger a success notification toast
    get().addNotification('success', `🛡️ Resolved: Task "${task.text}" has been completed!`);
  },

  removeTask: (id) => set(state => ({
    tasks: state.tasks.filter(t => t.id !== id)
  }))
}));
