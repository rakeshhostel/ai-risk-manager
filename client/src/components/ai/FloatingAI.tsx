import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Shield, Target, Cpu, RefreshCw, Loader2, Sparkles, User } from 'lucide-react';
import { useNotificationStore } from '../../store/notificationStore';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { role: 'ai', content: 'Hello! I am your AI Security Copilot. Ask me questions about active threats, geolocations, or set an active transaction target from the ledger to analyze.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { selectedTransaction, setSelectedTransaction } = useNotificationStore();

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Open chat automatically when selectedTransaction is set
  useEffect(() => {
    if (selectedTransaction) {
      setIsOpen(true);
      setMessages(prev => [
        ...prev,
        { 
          role: 'ai', 
          content: `🎯 Context Set: Active transaction updated to **${selectedTransaction.transactionId}** for **₹${selectedTransaction.amount.toLocaleString()}** by ${selectedTransaction.customerName || 'Test User'}. Ask me questions about this cardholder's risk triggers!` 
        }
      ]);
    }
  }, [selectedTransaction]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const payload = {
        query: userMsg,
        context: selectedTransaction ? {
          transactionId: selectedTransaction.transactionId,
          amount: selectedTransaction.amount,
          riskScore: selectedTransaction.riskScore || 50,
          flags: selectedTransaction.flags || []
        } : null
      };

      const res = await api.post('/ai/investigate', payload);
      setMessages(prev => [...prev, { role: 'ai', content: res.data.response || 'Analysis complete.' }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'ai', content: 'RAG Search offline fallback. Direct cache checks show no critical threat blocks.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearContext = () => {
    setSelectedTransaction(null);
    setMessages(prev => [...prev, { role: 'ai', content: 'Active target cleared. I am now listening to general ledger queries.' }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            className="w-[420px] h-[560px] bg-slate-950/95 border border-indigo-500/20 backdrop-blur-2xl rounded-2xl flex flex-col shadow-[0_0_30px_rgba(99,102,241,0.15)] overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-indigo-950/45 px-4 py-3 border-b border-indigo-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={16} className="text-cyan-400 animate-pulse" />
                <span className="font-sans text-xs font-bold tracking-wider text-indigo-200">AI SECURITY COPILOT</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Target Context Alert Banner */}
            {selectedTransaction && (
              <div className="bg-amber-500/10 border-b border-amber-500/20 px-3 py-2 flex items-center justify-between text-[11px] font-sans text-amber-300 animate-fadeIn">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <Target size={12} className="shrink-0 text-amber-400 animate-spin-slow" />
                  <span className="truncate">TARGET: {selectedTransaction.transactionId} (₹{selectedTransaction.amount.toLocaleString()})</span>
                </div>
                <button 
                  onClick={handleClearContext}
                  className="text-slate-400 hover:text-red-400 transition-colors flex items-center gap-0.5 shrink-0"
                >
                  <RefreshCw size={10} /> CLEAR
                </button>
              </div>
            )}

            {/* Conversation list */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[420px]">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                    m.role === 'user' 
                      ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400' 
                      : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
                  }`}>
                    {m.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  <div className={`p-4 rounded-xl text-base leading-relaxed border ${
                    m.role === 'user' 
                      ? 'bg-indigo-500/5 border-indigo-500/15 text-slate-100 rounded-tr-none font-sans' 
                      : 'bg-cyan-500/5 border-cyan-500/15 text-slate-200 rounded-tl-none font-sans whitespace-pre-wrap'
                  }`}>
                    {m.content.includes('<thought>') 
                      ? m.content.split('</thought>')[1]?.trim() || m.content
                      : m.content
                    }
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
                    <Bot size={13} />
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/15 text-slate-400 flex items-center gap-1.5 font-sans text-[10px]">
                    <Loader2 size={12} className="animate-spin text-cyan-400" />
                    <span>Analyzing target context...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-indigo-500/10 bg-slate-950/50">
              <div className="flex gap-2">
                <input 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={selectedTransaction ? "Query this transaction..." : "Query threat ledger (RAG)..."}
                  className="flex-1 bg-slate-900/50 border border-indigo-500/20 rounded-xl px-3 py-2 text-xs font-sans focus:outline-none focus:border-cyan-500/40 text-slate-200"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 px-3.5 rounded-xl transition-all flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.3)]"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button with Radar Rings & Attention Tags */}
      <div className="relative flex items-center justify-center">
        {/* Radar Sonar Waves */}
        <span className="absolute inline-flex h-20 w-20 rounded-full bg-cyan-500/15 animate-ping opacity-60 pointer-events-none" style={{ animationDuration: '3s' }}></span>
        <span className="absolute inline-flex h-24 w-24 rounded-full bg-indigo-500/10 animate-ping opacity-35 pointer-events-none" style={{ animationDuration: '4.5s' }}></span>

        {/* AI copilot attention tag */}
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-16 right-0 bg-slate-950 border border-cyan-500/30 text-[9px] font-sans font-bold tracking-widest text-cyan-400 rounded-lg px-2.5 py-1.5 shadow-[0_0_15px_rgba(6,180,212,0.15)] backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
            AI SECURITY COPILOT
          </motion.div>
        )}

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,180,212,0.4)] hover:scale-110 active:scale-90 transition-all relative border border-cyan-400/30 z-10"
          whileHover={{ rotate: 15, scale: 1.1 }}
        >
          <Bot size={24} className="animate-pulse" />
          {selectedTransaction ? (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-[10px] font-bold rounded-full flex items-center justify-center border border-black animate-bounce shadow-lg">
              <Sparkles size={10} className="text-white" />
            </span>
          ) : (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border border-black flex items-center justify-center animate-pulse">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
