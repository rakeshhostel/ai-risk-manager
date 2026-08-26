import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bell, Shield, Moon, Server, LogOut, CheckCircle, Zap } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-primary' : 'bg-gray-600'
    }`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
      enabled ? 'translate-x-6' : 'translate-x-1'
    }`} />
  </button>
);

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [autoBlock, setAutoBlock] = useState(true);
  const [modelLearning, setModelLearning] = useState(true);
  const [explainLevel, setExplainLevel] = useState('Detailed');
  const [name, setName] = useState(user?.name || 'Admin User');
  const [email, setEmail] = useState(user?.email || 'admin@demo.com');
  const [showSaved, setShowSaved] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleSave = () => {
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-4xl mx-auto pb-12 relative"
    >
      <AnimatePresence>
        {showSaved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-4 right-4 z-50 bg-green-500/20 border border-green-500/40 backdrop-blur-lg rounded-xl px-6 py-3 flex items-center gap-3 shadow-2xl"
          >
            <CheckCircle className="text-green-400" size={20} />
            <span className="text-green-300 font-medium">Settings saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your account and application preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <section className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <User className="text-primary w-5 h-5" />
            <h2 className="text-lg font-medium text-white">Profile Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/30 border border-white/5 rounded-lg w-fit">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">{user?.role || 'Senior Fraud Analyst'}</span>
              </div>
            </div>
            
            {/* Preferences */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Bell className="text-gray-400 w-5 h-5" />
                  <div>
                    <h3 className="text-white font-medium">Push Notifications</h3>
                    <p className="text-sm text-gray-400">Receive alerts for critical incidents</p>
                  </div>
                </div>
                <Toggle enabled={notifications} onChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Moon className="text-gray-400 w-5 h-5" />
                  <div>
                    <h3 className="text-white font-medium">Dark Mode</h3>
                    <p className="text-sm text-gray-400">Toggle dark appearance</p>
                  </div>
                </div>
                <Toggle enabled={darkMode} onChange={setDarkMode} />
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={handleSave}
                className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </section>

        {/* System Settings */}
        <section className="bg-gray-800/50 backdrop-blur border border-white/10 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <Server className="text-primary w-5 h-5" />
            <h2 className="text-lg font-medium text-white">AI Engine Configuration</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Shield className="text-gray-400 w-5 h-5" />
                <div>
                  <h3 className="text-white font-medium">Auto-block Critical Transactions</h3>
                  <p className="text-sm text-gray-400">Automatically block transactions with risk score &gt; 90</p>
                </div>
              </div>
              <Toggle enabled={autoBlock} onChange={setAutoBlock} />
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Zap className="text-gray-400 w-5 h-5" />
                <div>
                  <h3 className="text-white font-medium">AI Explainability Level</h3>
                  <p className="text-sm text-gray-400">Detail level for AI risk rationale</p>
                </div>
              </div>
              <select 
                value={explainLevel}
                onChange={(e) => setExplainLevel(e.target.value)}
                className="bg-gray-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none"
              >
                <option value="Basic">Basic</option>
                <option value="Detailed">Detailed</option>
                <option value="Technical (Dev)">Technical (Dev)</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Server className="text-gray-400 w-5 h-5" />
                <div>
                  <h3 className="text-white font-medium">Model Auto-learning</h3>
                  <p className="text-sm text-gray-400">Feedback from investigations trains the model</p>
                </div>
              </div>
              <Toggle enabled={modelLearning} onChange={setModelLearning} />
            </div>
          </div>
        </section>
        
        {/* About/Logout */}
        <div className="flex justify-between items-center px-2">
          <div className="text-sm text-gray-500">
            AI Risk Manager v1.0.4 • Engine: GPT-4o
          </div>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </motion.div>
  );
};
