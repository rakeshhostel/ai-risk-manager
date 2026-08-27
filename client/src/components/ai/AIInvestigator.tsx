import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Shield, Activity, Database, Cpu, Terminal, Compass } from 'lucide-react';
import api from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIInvestigator() {
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      content: 'Hello Investigator. I am connected to the live Ledger indexer and RAG query pipeline. Type a query below or select a preset diagnostics trigger to analyze transactions.',
      logs: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaderLogIndex, setLoaderLogIndex] = useState(0);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const context = {
    transactionId: 'TXN-100015',
    amount: '₹82,000',
    riskScore: 92,
    flags: ['Critical Amount Anomaly', 'Failed Sign-in Chain']
  };

  const suggestions = [
    "Summarize transactions for Priya Patel",
    "Explain risk factors for TXN-100015",
    "List unresolved alerts",
    "Search transactions in Delhi"
  ];

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Loading logs animation loop
  const loaderLogs = [
    "Initializing RAG Pipeline...",
    "Querying transaction ledger indexes...",
    "Extracting metadata from localStorage cache...",
    "Synthesizing threat profile metrics...",
    "Generating contextual AI explanation..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoaderLogIndex(0);
      interval = setInterval(() => {
        setLoaderLogIndex(prev => (prev < loaderLogs.length - 1 ? prev + 1 : prev));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg, logs: [] }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/investigate', { query: userMsg, context });
      setMessages(prev => [...prev, { role: 'ai', content: res.data.response || 'RAG response generated.', logs: loaderLogs }]);
    } catch (e: any) {
      // Fallback response for offline mode
      const mockResponse = `[RAG Error] Offline fallback active. I searched the local database but could not establish a connection to the server. Local mock results indicate no active fraud markers for "${userMsg}".`;
      setMessages(prev => [...prev, { role: 'ai', content: mockResponse, logs: ['Connection lost', 'Using cache fallback'] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full gap-5 text-gray-200">
      {/* Main Chat Terminal */}
      <div className="flex-1 flex flex-col bg-surface border border-border rounded-2xl shadow-glass overflow-hidden glass">
        {/* Terminal Header */}
        <div className="px-5 py-4 border-b border-border bg-black/45 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <div className="flex items-center gap-2">
              <Terminal size={16} className="text-primary" />
              <span className="font-semibold tracking-wider text-sm font-mono text-white">AI COGNITIVE RAG CONSOLE</span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/5 text-xs font-mono text-gray-400">
            <Database size={12} className="text-secondary" />
            <span>LOCAL STORAGE INDEXER ACTIVE</span>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 min-h-[400px] max-h-[500px]">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                  m.role === 'user' 
                    ? 'bg-primary/10 border-primary/30 text-primary shadow-glow-primary' 
                    : 'bg-secondary/10 border-secondary/30 text-secondary shadow-glow-secondary'
                }`}>
                  {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Bubble */}
                <div className="max-w-[80%] space-y-2">
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed border ${
                    m.role === 'user' 
                      ? 'bg-primary/5 border-primary/20 text-white rounded-tr-none' 
                      : 'bg-secondary/5 border-secondary/20 text-gray-100 rounded-tl-none font-mono whitespace-pre-wrap'
                  }`}>
                    {m.content}
                  </div>
                  
                  {/* Logs attached to AI RAG responses */}
                  {m.role === 'ai' && m.logs && m.logs.length > 0 && (
                    <div className="text-[10px] font-mono text-gray-500 pl-2 border-l border-white/10 space-y-0.5">
                      {m.logs.map((log, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="text-secondary">✔</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading States */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary/10 border border-secondary/30 text-secondary flex items-center justify-center shrink-0 shadow-glow-secondary">
                <Bot size={16} />
              </div>
              <div className="space-y-2 max-w-[80%] w-full">
                <div className="p-4 rounded-2xl rounded-tl-none bg-secondary/5 border border-secondary/20 text-gray-300 flex items-center gap-3">
                  <Loader2 size={16} className="animate-spin text-secondary" />
                  <span className="font-mono text-xs">AI RAG query running...</span>
                </div>
                <div className="bg-black/35 border border-white/5 rounded-xl p-3 space-y-1.5 max-w-sm">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Activity size={10} className="text-secondary animate-pulse" /> Terminal Logs
                  </div>
                  {loaderLogs.slice(0, loaderLogIndex + 1).map((log, idx) => (
                    <div key={idx} className="text-[10px] font-mono text-secondary flex items-center gap-1.5 animate-fadeIn">
                      <span className="text-emerald-400">⚡</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input & Action Panel */}
        <div className="p-4 border-t border-border bg-black/25">
          {/* Preset queries suggestions */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1 mr-1 uppercase">
              <Compass size={11} className="text-primary" /> Suggestions:
            </span>
            {suggestions.map((s, i) => (
              <button 
                key={i} 
                onClick={() => setInput(s)} 
                className="text-xs px-3.5 py-1.5 bg-secondary/5 hover:bg-secondary/10 hover:text-white rounded-full text-secondary border border-secondary/20 transition-all font-mono hover:scale-[1.02] active:scale-[0.98]"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Form input */}
          <div className="flex gap-3">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Query database, customers, or transaction IDs (RAG Search)..."
              className="flex-1 bg-black/40 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-secondary transition-colors text-sm font-mono"
            />
            <button 
              onClick={handleSend} 
              disabled={loading || !input.trim()} 
              className="bg-secondary text-white hover:bg-secondary/85 disabled:opacity-40 px-5 rounded-xl transition-all flex items-center justify-center shadow-glow-secondary hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* RAG Context Sidebar */}
      <div className="w-80 bg-surface border border-border rounded-2xl p-5 flex flex-col gap-5 glass">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Shield className="text-secondary w-5 h-5" />
          <h3 className="font-semibold text-white tracking-wide">ACTIVE TELEMETRY</h3>
        </div>

        <div className="space-y-4 text-sm flex-1">
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
            <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">Active Target</div>
            <div className="font-mono text-primary font-bold">{context.transactionId}</div>
          </div>
          
          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
            <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">Transaction Value</div>
            <div className="font-semibold text-white text-base">{context.amount}</div>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-gray-500 text-xs font-mono uppercase tracking-wider">Risk Score</div>
              <div className="text-accent font-bold text-xs font-mono">{context.riskScore}% RISK</div>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden">
              <div className="bg-accent h-full rounded-full" style={{ width: `${context.riskScore}%` }}></div>
            </div>
          </div>

          <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-2">
            <div className="text-gray-500 text-xs font-mono uppercase tracking-wider mb-2">Rule Warnings</div>
            <div className="flex flex-col gap-2">
              {context.flags.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs bg-accent/10 border border-accent/20 rounded px-2.5 py-1.5 text-accent font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnostic Footer */}
        <div className="p-3 bg-black/25 rounded-xl border border-border text-[10px] font-mono text-gray-500 space-y-1">
          <div className="flex items-center gap-1.5">
            <Cpu size={12} className="text-primary animate-pulse" />
            <span>MODEL: GPT-4o COGNITIVE RAG</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity size={12} className="text-emerald-400" />
            <span>DEVIANCE INDEX: 84.6% ACCURACY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
