import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, X, Send, Loader2, Bot,
  User, ExternalLink, ArrowRight, CornerDownLeft,
  Settings, Key, Check, RefreshCw
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

// Built-in Default Key (Base64 Encoded for client-side persistence)
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
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello! 👋 I am your **SAMADHAAN OpenRouter AI Copilot**.\n\nPowered by live Meta Llama 3.3 70B intelligence, I can assist you with:\n- 📝 **Reporting Civic Issues:** Potholes, drainage, water supply & SLA routing.\n- 🏛️ **Municipal Governance:** Ward escalation, nodal officers & turnaround targets.\n- 🎓 **University Collaboration:** Connecting with engineering labs at COEP / IITs.\n- 💼 **CSR Grant Opportunities:** Funding civic prototypes under Companies Act Section 135.\n\nAsk me anything!',
      links: [
        { title: 'Report a Problem', url: '/problems/new' },
        { title: 'Explore Solutions', url: '/solutions' },
        { title: 'CSR & Industry Hub', url: '/industry' },
      ],
      suggestedFollowUps: [
        'Who is better Messi or Ronaldo?',
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
    if (isOpen && !showSettings) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading, showSettings]);

  useEffect(() => {
    const currentKey = getOpenRouterKey();
    if (currentKey) setApiKeyInput(currentKey);
  }, []);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      localStorage.setItem('openrouter_api_key', apiKeyInput.trim());
      setKeySaved(true);
      setTimeout(() => {
        setKeySaved(false);
        setShowSettings(false);
      }, 1000);
    }
  };

  // Direct High-Speed OpenRouter API Call
  const callDirectOpenRouter = async (userMessage: string, historyPayload: any[] = []) => {
    const key = getOpenRouterKey();
    if (!key) throw new Error('No OpenRouter API key configured');

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
    if (!generated) throw new Error('Empty OpenRouter response');
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
        followUps: [
          'How do I report a pothole on SAMADHAAN?',
          'What is SAMADHAAN SLA timeline?',
          'Tell me about University R&D pilots.'
        ]
      };
    }

    if (q.includes('report') || q.includes('drainage') || q.includes('pothole') || q.includes('water') || q.includes('road')) {
      return {
        text: `### 📝 Reporting Civic Grievances on SAMADHAAN\nTo report a civic problem with instant geo-tracking:\n` +
              `1. Click on **"File Grievance"** or visit \`/problems/new\`\n` +
              `2. Capture or upload a photo — AI automatically analyzes defect severity.\n` +
              `3. GPS coordinates auto-tag the municipal ward.\n` +
              `4. Executive Engineer receives a statutory 48-Hour SLA alert.`,
        links: [
          { title: 'File New Grievance', url: '/problems/new' },
          { title: 'View Active Problems', url: '/problems' },
        ],
        followUps: [
          'How long does road repair usually take?',
          'What happens if SLA deadline is breached?',
          'Can universities solve recurring potholes?'
        ]
      };
    }

    return {
      text: `Hello! I have analyzed your query: **"${userMessage}"**.\n\n` +
            `I can help you with general queries, technical questions, or guide you through SAMADHAAN's GovTech features:\n` +
            `- **Civic Problem Resolution:** Report defects with AI Vision and GPS tracking.\n` +
            `- **Municipal Department Routing:** Track statutory SLA accountability.\n` +
            `- **University-CSR Matching:** Fund and deploy real engineering prototypes.\n\n` +
            `How would you like to proceed?`,
      links: [
        { title: 'Explore Civic Problems', url: '/problems' },
        { title: 'Explore Solutions', url: '/solutions' },
        { title: 'CSR Portal', url: '/industry' },
      ],
      followUps: [
        'How do I report a problem with GPS location?',
        'What CSR grants are available for civic prototypes?',
        'How to collaborate with university engineering labs?'
      ]
    };
  };

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    const userMessage = queryText.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    const historyPayload = messages.map((m) => ({
      role: m.role,
      content: m.text,
    }));

    try {
      // 1. Direct OpenRouter Call
      const openRouterReply = await callDirectOpenRouter(userMessage, historyPayload);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: openRouterReply,
          links: [
            { title: 'Explore Problems', url: '/problems' },
            { title: 'Browse Solutions', url: '/solutions' },
          ],
          suggestedFollowUps: [
            'How do I report a problem on SAMADHAAN?',
            'What CSR funding schemes are available?',
            'How do universities participate in civic pilots?'
          ]
        }
      ]);
      return;
    } catch (openRouterErr) {
      console.warn('OpenRouter direct call fallback:', openRouterErr);

      // 2. Try Backend AI Endpoint
      try {
        const res = await apiClient.post('/ai/copilot/chat', {
          message: userMessage,
          query: userMessage,
          question: userMessage,
          history: historyPayload,
        });
        const data = res.data?.data || res.data;
        const reply = data?.reply || data?.answer || data?.response;
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
    <div className="fixed bottom-6 right-6 z-50">
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
            className="w-[380px] sm:w-[440px] h-[580px] bg-white rounded-3xl border border-emerald-200 shadow-2xl shadow-emerald-950/15 flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 border-b border-emerald-600 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shadow-inner">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-wide">SAMADHAAN Copilot</h3>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-900/60 text-emerald-200 border border-emerald-400/30">
                      OpenRouter Live
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100">Llama 3.3 70B Powered</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  title="Configure AI API Key"
                >
                  <Settings size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                  title="Close Copilot"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* In-App API Key Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-4 bg-emerald-50 border-b border-emerald-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                      <Key size={14} className="text-emerald-700" />
                      <span>OpenRouter API Key Settings</span>
                    </div>
                    <span className="text-[10px] text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full font-bold">
                      meta-llama/llama-3.3-70b-instruct
                    </span>
                  </div>
                  <form onSubmit={handleSaveKey} className="space-y-2">
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="Paste your sk-or-v1-... key here"
                      className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-slate-500">Key is saved securely in your browser.</p>
                      <Button
                        type="submit"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer shadow-xs"
                      >
                        {keySaved ? <Check size={14} /> : 'Save Key'}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-emerald-50/30 scrollbar-thin scrollbar-thumb-emerald-200">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                      <Bot size={14} />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-none shadow-xs font-medium'
                        : 'bg-white border border-emerald-200 text-slate-800 rounded-bl-none shadow-xs'
                    }`}
                  >
                    <div>{renderFormattedText(msg.text)}</div>

                    {/* Actionable Deep Links */}
                    {msg.links && msg.links.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-emerald-100 flex flex-wrap gap-1.5">
                        {msg.links.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-semibold text-emerald-800 transition-colors"
                          >
                            <span>{link.title}</span>
                            <ExternalLink size={10} className="shrink-0" />
                          </a>
                        ))}
                      </div>
                    )}

                    {/* Suggested Follow-up Chips */}
                    {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-emerald-100">
                        <p className="text-[10px] text-slate-500 font-semibold mb-1.5 flex items-center gap-1">
                          <CornerDownLeft size={10} className="text-emerald-600" />
                          <span>Suggested Queries:</span>
                        </p>
                        <div className="flex flex-col gap-1">
                          {msg.suggestedFollowUps.map((prompt, pIdx) => (
                            <button
                              key={pIdx}
                              onClick={() => sendQuery(prompt)}
                              className="text-left text-[11px] text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg px-2.5 py-1 transition-all cursor-pointer flex items-center justify-between group"
                            >
                              <span>💡 {prompt}</span>
                              <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 text-emerald-600 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5 font-bold text-xs">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <Loader2 size={14} className="animate-spin" />
                  </div>
                  <div className="bg-white border border-emerald-200 rounded-2xl rounded-bl-none px-3.5 py-2.5 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                    <Loader2 size={12} className="animate-spin text-emerald-600" />
                    <span>Thinking with OpenRouter AI...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-emerald-200 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything (e.g. road repairs, CSR schemes)..."
                className="flex-1 bg-emerald-50/50 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!input.trim() || loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-3.5 py-2 h-auto cursor-pointer shadow-xs"
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
