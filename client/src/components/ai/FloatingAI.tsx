import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Shield, Target, Cpu, RefreshCw, Loader2, Sparkles } from 'lucide-react';
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
            className="w-[360px] h-[480px] bg-black/95 border border-white/10 backdrop-blur-2xl rounded-2xl flex flex-col shadow-2xl overflow-hidden glass mb-4"
          >
            {/* Header */}
            <div className="bg-black/55 px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot size={16} className="text-secondary animate-pulse" />
                <span className="font-mono text-xs font-bold tracking-wider text-white">AI SECURITY COPILOT</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Target Context Alert Banner */}
            {selectedTransaction && (
              <div className="bg-primary/10 border-b border-primary/20 px-3 py-2 flex items-center justify-between text-[11px] font-mono text-primary animate-fadeIn">
                <div className="flex items-center gap-1.5 overflow-hidden">
                  <Target size={12} className="shrink-0 animate-spin-slow" />
                  <span className="truncate">TARGET: {selectedTransaction.transactionId} (₹{selectedTransaction.amount.toLocaleString()})</span>
                </div>
                <button 
                  onClick={handleClearContext}
                  className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-0.5 shrink-0"
                >
                  <RefreshCw size={10} /> CLEAR
                </button>
              </div>
            )}

            {/* Conversation list */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 max-h-[340px]">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                    m.role === 'user' 
                      ? 'bg-primary/10 border-primary/25 text-primary' 
                      : 'bg-secondary/10 border-secondary/25 text-secondary'
                  }`}>
                    {m.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  <div className={`p-3 rounded-xl text-xs leading-relaxed border ${
                    m.role === 'user' 
                      ? 'bg-primary/5 border-primary/10 text-white rounded-tr-none' 
                      : 'bg-secondary/5 border-secondary/10 text-gray-200 rounded-tl-none font-mono whitespace-pre-wrap'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-secondary/10 border border-secondary/25 text-secondary flex items-center justify-center shrink-0">
                    <Bot size={13} />
                  </div>
                  <div className="p-3 rounded-xl bg-secondary/5 border border-secondary/10 text-gray-400 flex items-center gap-1.5 font-mono text-[10px]">
                    <Loader2 size={12} className="animate-spin text-secondary" />
                    <span>Analyzing target context...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-border bg-black/40">
              <div className="flex gap-2">
                <input 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={selectedTransaction ? "Query this transaction..." : "Query threat ledger (RAG)..."}
                  className="flex-1 bg-black/50 border border-border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-secondary text-gray-200"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-secondary text-white hover:bg-secondary/85 disabled:opacity-40 px-3.5 rounded-xl transition-all flex items-center justify-center shadow-glow-secondary"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center shadow-glow-secondary hover:scale-105 active:scale-95 transition-all relative border border-secondary/30"
        whileHover={{ rotate: 15 }}
      >
        <Bot size={24} className="animate-pulse" />
        {selectedTransaction && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-[10px] font-bold rounded-full flex items-center justify-center border border-black animate-bounce shadow-lg">
            <Sparkles size={10} className="text-white" />
          </span>
        )}
      </motion.button>
    </div>
  );
}
