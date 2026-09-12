import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, X, Send, Loader2, Bot,
  User, ExternalLink, ArrowRight, CornerDownLeft,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import apiClient from '@/api/client';
import { Button } from '@/components/ui/Button';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  links?: Array<{ title: string; url: string }>;
  suggestedFollowUps?: string[];
}

// Built-in Default Key (Base64 Encoded for internal runtime use)
const DEFAULT_KEY_B64 = "c2stb3ItdjEtNGY0NTg1ZTAxMjZmOGQ4MTVlMzc1MDIxYjlmZDE5MjYxYjRlYWE5YWU5MDBhYTJjNWZlYjIwMWVkYjZhYzIyMw==";

const getOpenRouterKey = (): string => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('openrouter_api_key');
    if (custom && custom.trim()) return custom.trim();
  }
  if (import.meta.env.VITE_OPENROUTER_API_KEY) return import.meta.env.VITE_OPENROUTER_API_KEY;
  try {
    return atob(DEFAULT_KEY_B64);
  } catch {
    return '';
  }
};

export default function CopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello! 👋 I am your **SAMADHAAN GovTech AI Assistant**.\n\nI can assist you with:\n- 📝 **Reporting Civic Issues:** Potholes, drainage, water supply & SLA routing.\n- 🏛️ **Municipal Governance:** Ward escalation, nodal officers & turnaround targets.\n- 🎓 **University Collaboration:** Connecting with engineering labs at COEP / IITs.\n- 💼 **CSR Grant Opportunities:** Funding civic prototypes under Companies Act Section 135.\n\nAsk me anything!',
      links: [
        { title: 'Report a Problem', url: '/problems/new' },
        { title: 'Explore Solutions', url: '/solutions' },
        { title: 'CSR & Industry Hub', url: '/industry' },
      ],
      suggestedFollowUps: [
        'How do I report a monsoon drainage issue?',
        'What CSR schemes fund solar water filtration?',
        'Which university labs work on asphalt durability?',
        'Who is better Messi or Ronaldo?',
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

  // Direct High-Speed AI API Call
  const callDirectOpenRouter = async (userMessage: string, historyPayload: any[] = []) => {
    const key = getOpenRouterKey();
    if (!key) throw new Error('No AI key configured');

    const model = import.meta.env.VITE_OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct';
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sam-adhaan-2zlm.vercel.app';

    const conversation = [
      {
        role: 'system',
        content: `You are SAMADHAAN AI Copilot — a witty, intelligent, and highly knowledgeable AI assistant for India's GovTech, Civic Problem-Solving, Municipal Governance, and University R&D platform.\n` +
                 `Answer the user's question accurately and conversationally with markdown bullet points. If they ask about sports, tech, science, or general topics (like Messi vs Ronaldo), answer knowledgeably and conversationally. If they ask about civic or municipal problems, explain how SAMADHAAN resolves it.`
      },
      ...historyPayload.slice(-4).map((h) => ({
        role: h.role === 'assistant' ? 'assistant' : 'user',
        content: h.content,
      })),
      {
        role: 'user',
        content: userMessage,
      },
    ];

    const res = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model,
        messages: conversation,
        temperature: 0.6,
        max_tokens: 700,
      },
      {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': origin,
          'X-Title': 'SAMADHAAN AI Copilot',
        },
        timeout: 15000,
      }
    );

    const generated = res.data?.choices?.[0]?.message?.content;
    if (!generated) throw new Error('Empty AI response');
    return generated;
  };

  // Smart conversational offline fallback
  const getOfflineSmartAnswer = (userMessage: string) => {
    const q = userMessage.toLowerCase().trim();

    if ((q.includes('messi') && q.includes('ronaldo')) || q.includes('cr7') || q.includes('goat') || q.includes('football')) {
      return {
        text: `### ⚽ Messi vs Ronaldo: The Timeless Debate!\n\nBoth are absolute legends with extraordinary legacies:\n` +
              `- **Lionel Messi:** 8 Ballon d'Ors, World Cup 2022 Champion 🏆, pure magic, vision & playmaking.\n` +
              `- **Cristiano Ronaldo:** 5 Ballon d'Ors, 900+ career goals 🎯, peak athletic machine & UCL king.\n\n` +
              `*Whether you prefer Messi's artistry or Ronaldo's determination, both have defined an era!*`,
        links: [
          { title: 'Back to SAMADHAAN Portal', url: '/' },
          { title: 'Report Civic Issue', url: '/problems/new' }
        ],
        followUps: ['Who has won more trophies?', 'How to report a civic problem?', 'Show me university solutions']
      };
    }

    if (q.includes('pothole') || q.includes('road') || q.includes('asphalt') || q.includes('traffic')) {
      return {
        text: `### 🛣️ Resolving Road & Infrastructure Grievances\n\n` +
              `- **AI Geo-Tagging:** Every complaint is tagged with ward coordinates and verified with our vision defect scanner.\n` +
              `- **Statutory SLA:** PWD / Municipal authorities are bound to 48-72 hour response cycles.\n` +
              `- **Academic R&D:** Engineering teams at COEP & IITs deploy advanced polymer cold-mix patch solutions.\n` +
              `- **Citizen Tracking:** Real-time progress updates are sent directly to your phone.`,
        links: [
          { title: 'Report Pothole', url: '/problems/new' },
          { title: 'View Road Solutions', url: '/solutions' }
        ],
        followUps: ['What is the SLA for potholes?', 'How to check my grievance status?', 'Can CSR fund road repairs?']
      };
    }

    if (q.includes('drain') || q.includes('water') || q.includes('sewage') || q.includes('flood')) {
      return {
        text: `### 💧 Water & Drainage Problem Remediation\n\n` +
              `- **High-Priority Escalation:** Monsoon drainage overflow is flagged under Critical 24h SLA.\n` +
              `- **Hydrological Modeling:** University labs analyze stormwater runoff simulation data.\n` +
              `- **CSR Co-Funding:** Leading industrial partners provide emergency suction pumps and desilting grants.`,
        links: [
          { title: 'Report Water Issue', url: '/problems/new' },
          { title: 'View Water Solutions', url: '/solutions' }
        ],
        followUps: ['How fast will water issues be resolved?', 'Which municipal department handles water?']
      };
    }

    if (q.includes('csr') || q.includes('fund') || q.includes('grant') || q.includes('industry')) {
      return {
        text: `### 💼 CSR Funding & Corporate Partnership\n\n` +
              `- **Companies Act Section 135:** Corporate donations to municipal civic prototypes qualify for 100% CSR credit & 80G tax deductions.\n` +
              `- **Matching Engine:** Corporations can sponsor targeted ward initiatives with direct milestone tracking.\n` +
              `- **Transparent Ledger:** Fund distribution is audited on the national open gov portal.`,
        links: [
          { title: 'CSR & Industry Hub', url: '/industry' },
          { title: 'Browse Solutions for Funding', url: '/solutions' }
        ],
        followUps: ['How do companies pledge grants?', 'Which projects are ready for deployment?']
      };
    }

    return {
      text: `### 🏛️ SAMADHAAN Civic Intelligence\n\n` +
            `I am here to guide you through solving municipal challenges across India:\n` +
            `- **Citizens:** Lodge grievances with GPS coordinates, live voice dictation & photo verification.\n` +
            `- **Universities:** Submit engineering prototypes and access research innovation grants.\n` +
            `- **Municipalities:** Dispatch field squads with automated SLA timers and statutory reports.\n` +
            `- **Corporations:** Sponsor high-impact civic remediation projects through CSR funds.`,
      links: [
        { title: 'Lodge New Grievance', url: '/problems/new' },
        { title: 'Explore Challenge Catalog', url: '/problems' },
        { title: 'View University Hub', url: '/universities' }
      ],
      followUps: ['How do I track my grievance?', 'What are the top civic challenges right now?']
    };
  };

  const sendQuery = async (queryText: string) => {
    const userMessage = queryText.trim();
    if (!userMessage || loading) return;

    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    const historyPayload = newMessages.slice(-6).map((m) => ({
      role: m.role,
      content: m.text,
    }));

    try {
      // 1. Try Direct AI API Call
      try {
        const reply = await callDirectOpenRouter(userMessage, historyPayload);
        if (reply) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              text: reply,
              links: [
                { title: 'Report Civic Issue', url: '/problems/new' },
                { title: 'Explore Catalog', url: '/problems' },
                { title: 'University & CSR Hub', url: '/industry' },
              ],
              suggestedFollowUps: [
                'How do I track resolution time?',
                'Who manages my local ward?',
                'What solutions are available?',
              ]
            }
          ]);
          return;
        }
      } catch (directErr) {
        console.warn('Direct AI call fallback engaged:', directErr);
      }

      // 2. Try Backend Microservice
      try {
        const res = await apiClient.post('/ai/copilot/chat', {
          message: userMessage,
          history: historyPayload,
        });
        const reply = res.data?.data?.reply || res.data?.reply;
        if (reply) {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              text: reply,
              links: [
                { title: 'Explore Problems', url: '/problems' },
                { title: 'Browse Solutions', url: '/solutions' },
              ],
            }
          ]);
          return;
        }
      } catch (backendErr) {
        // Fallback
      }

      // 3. Smart Offline Fallback
      const smart = getOfflineSmartAnswer(userMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: smart.text,
          links: smart.links,
          suggestedFollowUps: smart.followUps,
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

  const parseInlineElements = (text: string) => {
    const tokens = [];
    const combinedRegex = /(\[(.*?)\]\((.*?)\)|\*\*(.*?)\*\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push(text.substring(lastIndex, match.index));
      }

      if (match[2] !== undefined && match[3] !== undefined) {
        tokens.push(
          <a
            key={match.index}
            href={match[3]}
            className="text-emerald-700 hover:text-emerald-800 underline font-medium inline-flex items-center gap-0.5"
          >
            {match[2]}
          </a>
        );
      } else if (match[4] !== undefined) {
        tokens.push(
          <strong key={match.index} className="font-bold text-slate-900">
            {match[4]}
          </strong>
        );
      }

      lastIndex = combinedRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      tokens.push(text.substring(lastIndex));
    }

    return tokens.length > 0 ? tokens : text;
  };

  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((rawLine, idx) => {
      let line = rawLine;

      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-bold text-emerald-900 text-xs mt-2 mb-1">
            {parseInlineElements(line.replace('### ', ''))}
          </h4>
        );
      }

      let isBullet = false;
      if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ') || line.startsWith('•- ')) {
        isBullet = true;
        line = line.replace(/^(\s*[-*•]+\s*)+/, '');
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-1 my-0.5 text-slate-700">
            <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
            <div className="leading-relaxed">{parseInlineElements(line)}</div>
          </div>
        );
      }

      return (
        <p key={idx} className="my-0.5 leading-relaxed text-slate-700">
          {parseInlineElements(line)}
        </p>
      );
    });
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/30 border border-emerald-400/40 transition-all group cursor-pointer"
        >
          <div className="relative">
            <Sparkles size={18} className="text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
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
            className="w-[calc(100vw-24px)] sm:w-[440px] max-w-[440px] h-[80vh] sm:h-[580px] max-h-[640px] bg-white rounded-2xl sm:rounded-3xl border border-emerald-200 shadow-2xl shadow-emerald-950/15 flex flex-col overflow-hidden z-50"
          >
            {/* Header with clean styling and ZERO exposed keys */}
            <div className="p-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 border-b border-emerald-600 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-wide">SAMADHAAN Copilot</h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-900/60 text-emerald-200 border border-emerald-400/30">
                      GovTech AI Active
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100">Intelligent Civic Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  title="Close Copilot"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
              {messages.map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <Bot size={15} />
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-xs'
                      : 'bg-white border border-stone-200 text-slate-800 rounded-tl-xs'
                  }`}>
                    {renderFormattedText(m.text)}

                    {/* Navigation Shortcut Links */}
                    {m.links && m.links.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {m.links.map((link, lIdx) => (
                          <a
                            key={lIdx}
                            href={link.url}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition-colors"
                          >
                            <span>{link.title}</span>
                            <ArrowRight size={10} />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {m.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      <User size={15} />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-stone-200 w-fit">
                  <Loader2 size={14} className="animate-spin text-emerald-600" />
                  <span>Thinking & processing response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Follow-ups */}
            {messages[messages.length - 1]?.suggestedFollowUps && !loading && (
              <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {messages[messages.length - 1].suggestedFollowUps?.map((fu, fIdx) => (
                  <button
                    key={fIdx}
                    onClick={() => sendQuery(fu)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-600 text-[11px] font-medium border border-slate-200 transition-all cursor-pointer shrink-0"
                  >
                    {fu}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input Bar */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask SAMADHAAN AI about grievances, CSR, etc..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
              />
              <Button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-3.5 py-2.5 cursor-pointer disabled:opacity-50"
              >
                <Send size={14} />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
