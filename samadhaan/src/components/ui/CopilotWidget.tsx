import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, MessageSquare, X, Send, Loader2, Bot,
  User, RefreshCw, ExternalLink, ChevronDown, Minimize2
} from 'lucide-react';
import apiClient from '@/api/client';
import { Button } from '@/components/ui/Button';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  links?: Array<{ title: string; url: string }>;
}

export default function CopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello! I am your **SAMADHAAN AI Copilot**. I can help you with civic research, CSR grant matching, municipal escalation pathways, or engineering solutions. How can I assist you today?',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.text,
      }));

      const res = await apiClient.post('/ai/copilot/chat', {
        message: userMessage,
        history: historyPayload,
      });

      const data = res.data?.data || res.data;
      const reply = data?.reply || data?.answer || data?.response || 'I have processed your request.';
      const links = data?.links || [];

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          links: links.length > 0 ? links : undefined,
        },
      ]);
    } catch (err: any) {
      const q = userMessage.toLowerCase();
      let fallbackText = "Hello! I am your **SAMADHAAN AI Copilot**. You can report civic issues (potholes, drainage, sanitation), match with CSR funding under Section 135, or explore engineering prototypes from university research labs.";
      if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
        fallbackText = "Hello! 👋 Welcome to **SAMADHAAN**. How can I assist you today with civic problem reporting, municipal escalation, or CSR matching?";
      } else if (q.includes("csr") || q.includes("fund") || q.includes("grant") || q.includes("schedule")) {
        fallbackText = "Under **Section 135 & Schedule VII of the Companies Act**, corporate CSR funds can support drinking water, sanitation, and technology incubators at accredited universities. Check out the **Industry Portal** to apply!";
      } else if (q.includes("pothole") || q.includes("road") || q.includes("traffic")) {
        fallbackText = "You can report road defects on the **[Report Problem](/problems/new)** page. Our AI analyzes damage severity and routes work orders to the Municipal Public Works Department within statutory SLA targets.";
      } else if (q.includes("water") || q.includes("drain") || q.includes("flood")) {
        fallbackText = "For water supply and drainage bottlenecks, SAMADHAAN provides automated department routing to the Water & Sewerage Board with emergency monsoon escalation.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: fallbackText,
          links: [
            { title: 'Report a Problem', url: '/problems/new' },
            { title: 'Explore Solutions', url: '/solutions' },
            { title: 'CSR Portal', url: '/industry' },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'How do I report a monsoon drainage issue?',
    'What CSR schemes fund solar water filtration?',
    'Which university labs work on asphalt durability?',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 text-white shadow-2xl shadow-indigo-500/40 border border-indigo-400/30 hover:border-indigo-300 transition-all group cursor-pointer"
        >
          <div className="relative">
            <Sparkles size={18} className="text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <span className="text-sm font-bold tracking-wide">AI Copilot</span>
        </motion.button>
      )}

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-[380px] sm:w-[420px] h-[540px] bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/15 shadow-2xl shadow-black/80 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-violet-950/80 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">SAMADHAAN Copilot</h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      v2.0 Live
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Civic & R&D Intelligence Agent</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                      <Bot size={14} />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    {msg.links && msg.links.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                        {msg.links.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 underline"
                          >
                            <ExternalLink size={10} />
                            {link.title}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-white shrink-0 mt-0.5">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <Loader2 size={14} className="animate-spin" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none px-3.5 py-2.5 text-xs text-slate-400 flex items-center gap-2">
                    <span>Generating intelligent civic response...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts (if only 1 message) */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-[10px] text-slate-500 font-semibold mb-1.5 uppercase tracking-wider">Suggested queries:</p>
                <div className="flex flex-col gap-1.5">
                  {samplePrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(prompt);
                      }}
                      className="text-left text-[11px] text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl px-2.5 py-1.5 transition-colors cursor-pointer"
                    >
                      💡 {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 bg-slate-950/60 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Copilot about any problem, SLA, or CSR grant..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-3 py-2 h-auto"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
