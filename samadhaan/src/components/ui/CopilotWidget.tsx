import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, X, Send, Loader2, Bot,
  User, ExternalLink, ArrowRight, CornerDownLeft
} from 'lucide-react';
import apiClient from '@/api/client';
import { Button } from '@/components/ui/Button';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  links?: Array<{ title: string; url: string }>;
  suggestedFollowUps?: string[];
}

export default function CopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello! 👋 I am your **SAMADHAAN AI Copilot**.\n\nI can assist you with:\n- 📝 **Reporting Civic Issues:** Potholes, drainage, sanitation with auto SLA routing.\n- 🏛️ **Municipal Governance:** Ward escalation, nodal officers & turnaround targets.\n- 🎓 **University Collaboration:** Connecting with engineering labs at COEP / IITs.\n- 💼 **CSR Grant Opportunities:** Funding civic prototypes under Companies Act Section 135.\n\nHow can I help you today?',
      links: [
        { title: 'Report a Problem', url: '/problems/new' },
        { title: 'Explore Solutions', url: '/solutions' },
        { title: 'CSR & Industry Hub', url: '/industry' },
      ],
      suggestedFollowUps: [
        'How do I report a monsoon drainage issue?',
        'What CSR schemes fund solar water filtration?',
        'Which university labs work on asphalt durability?',
      ],
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
  }, [messages, isOpen, loading]);

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    const userMessage = queryText.trim();
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
        query: userMessage,
        question: userMessage,
        history: historyPayload,
      });

      const data = res.data?.data || res.data;
      const reply = data?.reply || data?.answer || data?.response || data?.markdownContent || 'I have processed your request.';
      const rawLinks = data?.links || data?.actionableLinks || [];
      const links = rawLinks.map((l: any) => ({
        title: l.title || l.label || 'View Link',
        url: l.url || '/',
      }));
      const followUps = data?.suggestedFollowUps || [];

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          links: links.length > 0 ? links : undefined,
          suggestedFollowUps: followUps.length > 0 ? followUps : undefined,
        },
      ]);
    } catch (err: any) {
      const q = userMessage.toLowerCase();
      let fallbackText = "Hello! I am your **SAMADHAAN AI Copilot**. You can report civic issues (potholes, drainage, sanitation), match with CSR funding under Section 135, or explore engineering prototypes from university research labs.";
      let fallbackLinks = [
        { title: 'Report a Problem', url: '/problems/new' },
        { title: 'Explore Solutions', url: '/solutions' },
        { title: 'CSR Portal', url: '/industry' },
      ];
      let fallbackFollowUps = [
        'How do I report a monsoon drainage issue?',
        'What CSR schemes fund solar water filtration?',
        'Which university labs work on asphalt durability?',
      ];

      if (q.includes("hi") || q.includes("hello") || q.includes("hey")) {
        fallbackText = "Hello! 👋 Welcome to **SAMADHAAN**. How can I assist you today with civic problem reporting, municipal escalation, or CSR matching?";
      } else if (q.includes("csr") || q.includes("fund") || q.includes("grant") || q.includes("schedule")) {
        fallbackText = "Under **Section 135 & Schedule VII of the Companies Act**, corporate CSR funds can support drinking water, sanitation, and technology incubators at accredited universities. Check out the **Industry Portal** to apply!";
        fallbackLinks = [
          { title: 'Explore CSR Portal', url: '/industry' },
          { title: 'University R&D Projects', url: '/universities' },
        ];
      } else if (q.includes("pothole") || q.includes("road") || q.includes("traffic")) {
        fallbackText = "You can report road defects on the **[Report Problem](/problems/new)** page. Our AI analyzes damage severity and routes work orders to the Municipal Public Works Department within statutory SLA targets.";
        fallbackLinks = [
          { title: 'Report Road Defect', url: '/problems/new' },
          { title: 'Road Solutions', url: '/solutions' },
        ];
      } else if (q.includes("water") || q.includes("drain") || q.includes("flood")) {
        fallbackText = "For water supply and drainage bottlenecks, SAMADHAAN provides automated department routing to the Water & Sewerage Board with emergency monsoon escalation.";
        fallbackLinks = [
          { title: 'Report Drainage Issue', url: '/problems/new' },
          { title: 'Water IoT Solutions', url: '/solutions' },
        ];
      } else if (q.includes("university") || q.includes("lab") || q.includes("research") || q.includes("coep") || q.includes("iit")) {
        fallbackText = "Universities and student researchers can submit engineering prototypes, apply for municipal validation certificates, and secure up to ₹25 Lakhs in CSR innovation grants.";
        fallbackLinks = [
          { title: 'University Research Hub', url: '/universities' },
          { title: 'Submit Solution', url: '/solutions' },
        ];
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: fallbackText,
          links: fallbackLinks,
          suggestedFollowUps: fallbackFollowUps,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sendQuery(input);
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let formatted = line;

      // Render bold spans
      const parts = [];
      let lastIndex = 0;
      const regex = /\*\*(.*?)\*\*/g;
      let match;

      while ((match = regex.exec(formatted)) !== null) {
        if (match.index > lastIndex) {
          parts.push(formatted.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={match.index} className="font-semibold text-white">
            {match[1]}
          </strong>
        );
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < formatted.length) {
        parts.push(formatted.substring(lastIndex));
      }

      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-indigo-300 text-xs mt-2 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }

      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-1 my-0.5 text-slate-300">
            <span className="text-indigo-400 mt-0.5">•</span>
            <div>{parts.length > 0 ? parts : line.slice(2)}</div>
          </div>
        );
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="my-0.5 leading-relaxed">
          {parts.length > 0 ? parts : line}
        </p>
      );
    });
  };

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
            className="w-[380px] sm:w-[440px] h-[580px] bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/15 shadow-2xl shadow-black/80 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-violet-950/80 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">SAMADHAAN Copilot</h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Live AI
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Civic, GovTech & CSR Intelligence</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close Copilot"
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
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <div>{renderFormattedText(msg.text)}</div>

                    {/* Actionable Deep Links */}
                    {msg.links && msg.links.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                        {msg.links.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-[11px] font-medium text-indigo-300 hover:text-white transition-colors"
                          >
                            <span>{link.title}</span>
                            <ExternalLink size={10} className="shrink-0" />
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Suggested Follow-up Chips */}
                    {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-white/10">
                        <p className="text-[10px] text-slate-400 font-semibold mb-1.5 flex items-center gap-1">
                          <CornerDownLeft size={10} className="text-indigo-400" />
                          <span>Suggested Follow-ups:</span>
                        </p>
                        <div className="flex flex-col gap-1">
                          {msg.suggestedFollowUps.map((prompt, pIdx) => (
                            <button
                              key={pIdx}
                              onClick={() => sendQuery(prompt)}
                              className="text-left text-[11px] text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg px-2.5 py-1 transition-all cursor-pointer flex items-center justify-between group"
                            >
                              <span>💡 {prompt}</span>
                              <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity" />
                            </button>
                          ))}
                        </div>
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
                    <Loader2 size={12} className="animate-spin text-indigo-400" />
                    <span>Analyzing GovTech intelligence...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 bg-slate-950/80 border-t border-white/10 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Copilot about problems, SLA, CSR funds, or labs..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-3 py-2 h-auto cursor-pointer"
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
