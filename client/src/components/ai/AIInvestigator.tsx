import React, { useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import api from '@/services/api';

export default function AIInvestigator() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello, I am your AI Risk Investigator. How can I help you analyze transactions today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context] = useState({
    transactionId: 'TX-98237',
    amount: '₹45,000',
    riskScore: 89,
    flags: ['Velocity Anomaly', 'New Device']
  });

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await api.post('/ai/investigate', { query: userMsg, context });
      setMessages(prev => [...prev, { role: 'ai', content: res.data.response || 'Investigation complete.' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Simulation mode: The AI analyzed the transaction and determined it exhibits patterns commonly associated with credential stuffing. The login originated from an unrecognized device in a high-risk location.' }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Summarize the risk factors for this transaction.",
    "Is there a history of fraud from this IP?",
    "Explain the 'Velocity Anomaly' flag."
  ];

  return (
    <div className="flex h-full gap-4 text-white">
      <div className="flex-1 flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 font-semibold bg-white/5">
          AI Conversation
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-lg max-w-[80%] ${m.role === 'user' ? 'bg-blue-500/20 text-blue-50' : 'bg-white/10 text-gray-200'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="p-3 rounded-lg bg-white/10 text-gray-200 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-purple-400" /> Analyzing...
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-white/10">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => setInput(s)} className="text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-cyan-300 border border-cyan-500/30 transition-colors">
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2 relative">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask the AI investigator..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <button onClick={handleSend} disabled={loading || !input.trim()} className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 px-4 py-3 rounded-lg transition-colors flex items-center justify-center">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="w-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col gap-4">
        <h3 className="font-semibold border-b border-white/10 pb-2">Active Context</h3>
        <div className="space-y-4 text-sm">
          <div className="p-3 bg-black/20 rounded-lg border border-white/5">
            <div className="text-gray-400 text-xs mb-1">Transaction ID</div>
            <div className="font-mono text-cyan-400">{context.transactionId}</div>
          </div>
          <div className="p-3 bg-black/20 rounded-lg border border-white/5">
            <div className="text-gray-400 text-xs mb-1">Amount</div>
            <div className="font-semibold">{context.amount}</div>
          </div>
          <div className="p-3 bg-black/20 rounded-lg border border-white/5">
            <div className="text-gray-400 text-xs mb-1">Risk Score</div>
            <div className="text-red-400 font-bold text-xl">{context.riskScore}/100</div>
          </div>
          <div className="p-3 bg-black/20 rounded-lg border border-white/5">
            <div className="text-gray-400 text-xs mb-2">Triggered Flags</div>
            <div className="flex flex-wrap gap-2">
              {context.flags.map((f, i) => (
                <span key={i} className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded border border-red-500/30">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
