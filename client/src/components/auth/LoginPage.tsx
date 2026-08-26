import React, { useState } from 'react';
import { ShieldAlert, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { login } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Background3D } from '../three/Background3D';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const { login: setLogin } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ email, password });
      setLogin(res.data.user, res.data.token);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <color attach="background" args={['#0a0e1a']} />
          <Background3D />
        </Canvas>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 w-full max-w-md px-4"
      >
        <div className="bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 text-primary">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-gray-100">AI RISK MANAGER</h1>
            <p className="text-sm text-gray-400 mt-1">Secure Payment Intelligence Platform</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-red-400 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-lg px-4 py-2.5 font-medium transition-all"
            >
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>
          </form>

          <div className="mt-6 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
            <p className="text-xs text-cyan-400 font-medium mb-1">📋 DEMO ACCOUNT</p>
            <p className="text-xs text-gray-500">Email: admin@demo.com</p>
            <p className="text-xs text-gray-500">Password: admin123</p>
          </div>

          <p className="text-xs text-gray-600 text-center mt-4">
            Independent Educational Prototype • Synthetic Data Only
          </p>
        </div>
      </motion.div>
    </div>
  );
};
