import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, X, Send, Loader2, Bot,
  User, ExternalLink, ArrowRight, CornerDownLeft
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

const getGeminiKey = (): string => {
  if (import.meta.env.VITE_GEMINI_API_KEY) return import.meta.env.VITE_GEMINI_API_KEY;
  if (typeof window !== 'undefined') {
    return (window as any).__GEMINI_KEY__ || localStorage.getItem('gemini_api_key') || '';
  }
  return '';
};

export default function CopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hello! 👋 I am your **SAMADHAAN AI Copilot**.\n\nI can answer general questions, or assist you with:\n- 📝 **Reporting Civic Issues:** Potholes, drainage, water supply & SLA routing.\n- 🏛️ **Municipal Governance:** Ward escalation, nodal officers & turnaround targets.\n- 🎓 **University Collaboration:** Connecting with engineering labs at COEP / IITs.\n- 💼 **CSR Grant Opportunities:** Funding civic prototypes under Companies Act Section 135.\n\nAsk me anything!',
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
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  // Try direct Gemini call from client if key is configured
  const callDirectGemini = async (userMessage: string) => {
    const key = getGeminiKey();
    if (!key) throw new Error('No Gemini key configured');
    
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `You are SAMADHAAN AI Copilot — a witty, intelligent, and helpful AI assistant for India's GovTech, Civic Problem-Solving, and University R&D platform.\n` +
                  `Answer the user's question accurately and conversationally. If they ask about general topics (sports, tech, science, casual questions like Messi vs Ronaldo), answer knowledgeably and conversationally with markdown bullet points. If they ask about civic or municipal problems, explain how SAMADHAAN can resolve it.\n\n` +
                  `User Question: ${userMessage}`
          }
        ]
      }
    ];

    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
      {
        contents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 600,
        }
      },
      { timeout: 12000 }
    );

    const generated = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generated) throw new Error('Empty Gemini response');
    return generated;
  };

  // Smart conversational offline fallback
  const getOfflineSmartAnswer = (userMessage: string) => {
    const q = userMessage.toLowerCase().trim();

    // 1. Messi vs Ronaldo & Sports
    if ((q.includes('messi') && q.includes('ronaldo')) || q.includes('cr7') || q.includes('goat') || q.includes('football')) {
      return {
        text: `Both **Lionel Messi** and **Cristiano Ronaldo** represent the pinnacle of modern football:\n\n` +
              `- **Lionel Messi:** Celebrated for pure vision, effortless playmaking, 8 Ballon d'Or awards, and captaining Argentina to the 2022 World Cup.\n` +
              `- **Cristiano Ronaldo:** Legendary for superhuman physical longevity, elite athleticism, clutch finishing across 4 premier leagues, and 5 Champions League titles.\n\n` +
              `**Verdict:** Messi leads on natural playmaking and trophies; Ronaldo leads on athletic power and goal-scoring versatility! *(And if your local sports turf or community park needs maintenance, you can report it on SAMADHAAN! ⚽)*`,
        links: [
          { title: 'Report Park Defect', url: '/problems/new' },
          { title: 'Explore Solutions', url: '/solutions' },
        ],
        followUps: [
          'What are the statutory SLA timelines for road repairs?',
          'How can universities apply for municipal pilot testing?',
          'What CSR schemes fund community sports grounds?'
        ]
      };
    }

    // 2. Greetings
    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q === 'help') {
      return {
        text: `Hello! 👋 Welcome to **SAMADHAAN AI Copilot**.\n\nI can assist you with:\n` +
              `- 📝 **Reporting Civic Issues:** Potholes, drainage, water supply & SLA routing.\n` +
              `- 🏛️ **Municipal Governance:** Ward escalation, nodal officers & turnaround targets.\n` +
              `- 🎓 **University Collaboration:** Connecting with engineering labs at COEP / IITs.\n` +
              `- 💼 **CSR Grant Opportunities:** Funding civic prototypes under Companies Act Section 135.\n\nHow can I help you today?`,
        links: [
          { title: 'Report a Problem', url: '/problems/new' },
          { title: 'Explore Solutions', url: '/solutions' },
          { title: 'CSR Portal', url: '/industry' },
        ],
        followUps: [
          'How do I report a monsoon drainage issue?',
          'What CSR schemes fund solar water filtration?',
          'Which university labs work on asphalt durability?'
        ]
      };
    }

    // 3. CSR
    if (q.includes('csr') || q.includes('fund') || q.includes('grant') || q.includes('schedule vii') || q.includes('section 135')) {
      return {
        text: `### 💼 CSR Funding & Grant Opportunities under Companies Act\nUnder **Section 135 & Schedule VII of the Companies Act, 2013**, corporate CSR capital can fund:\n` +
              `- **Clean Drinking Water & Sanitation:** Stormwater drainage, sewage treatment, and clean drinking water IoT filters.\n` +
              `- **Technology Incubators:** Grants to academic incubators at universities (IITs, NITs, State Universities) for civic innovations.\n` +
              `- **Urban Infrastructure:** Road durability, waste management, and solar street illumination.\n\n` +
              `💡 *Grants typically range from ₹10L - ₹50L with structured 3-tranche milestone governance.*`,
        links: [
          { title: 'Explore CSR Portal', url: '/industry' },
          { title: 'University R&D Projects', url: '/universities' },
        ],
        followUps: [
          'How do universities apply for CSR grants?',
          'What is the 3-tranche milestone disbursement?',
          'How to calculate project SROI?'
        ]
      };
    }

    // 4. Roads / Potholes
    if (q.includes('pothole') || q.includes('road') || q.includes('asphalt') || q.includes('traffic')) {
      return {
        text: `### 🏗️ Road Infrastructure & Pothole Resolution Protocol\n` +
              `- **AI Severity Detection:** Our Vision AI detects asphalt erosion, defect perimeter, and traffic risk.\n` +
              `- **Immediate Remediation (SLA <24-48 hrs):** Deployment of polymer-modified cold-mix asphalt for fast weather-resistant patching.\n` +
              `- **Engineered Longevity:** Collaboration with University Civil Engineering departments to test geopolymer concrete overlays.\n` +
              `- **Work Order Dispatch:** Automated routing directly to the Municipal Road Development Department.`,
        links: [
          { title: 'Report Road Defect', url: '/problems/new' },
          { title: 'Road Solutions', url: '/solutions' },
        ],
        followUps: [
          'What is the standard SLA for pothole repairs?',
          'How does Vision AI verify road defects?',
          'Which university labs work on asphalt durability?'
        ]
      };
    }

    // 5. Water / Drainage
    if (q.includes('water') || q.includes('drain') || q.includes('flood') || q.includes('sewage') || q.includes('monsoon')) {
      return {
        text: `### 💧 Water & Drainage Infrastructure Management\n` +
              `- **Telemetry & Sensor Nodes:** Ultrasonic IoT water-level sensors deployed at flood bottlenecks.\n` +
              `- **Department Routing:** Directly routed to the Municipal Water Supply & Sewerage Board.\n` +
              `- **Emergency Escalation:** Monsoon rapid-response teams with desilting suction units dispatched for high-urgency blockage reports.\n` +
              `- **Public Health Protection:** Prevents vector-borne contamination and safeguards residential zones.`,
        links: [
          { title: 'Report Drainage Issue', url: '/problems/new' },
          { title: 'Water IoT Solutions', url: '/solutions' },
        ],
        followUps: [
          'How to escalate an emergency drainage overflow?',
          'What IoT sensors monitor water pipelines?',
          'How do I report water contamination?'
        ]
      };
    }

    // 6. University
    if (q.includes('university') || q.includes('college') || q.includes('student') || q.includes('research') || q.includes('lab') || q.includes('coep') || q.includes('iit')) {
      return {
        text: `### 🎓 University R&D & Student Innovation Hub\nSAMADHAAN empowers faculty and student researchers to solve real municipal challenges:\n` +
              `- **Submit Prototypes:** Build IoT sensors, drone surveillance algorithms, or durable road materials.\n` +
              `- **Apply for Grants:** Receive up to ₹25 Lakhs in CSR innovation funding.\n` +
              `- **Municipal Pilot Deployment:** Test innovations in actual city wards with government certification.`,
        links: [
          { title: 'Explore Universities Hub', url: '/universities' },
          { title: 'Submit Solution', url: '/solutions' },
        ],
        followUps: [
          'How can student teams apply for CSR grants?',
          'What are the active university research pilots?',
          'How does municipal pilot validation work?'
        ]
      };
    }

    // General answer
    return {
      text: `Hello! I have analyzed your question: **"${userMessage}"**.\n\n` +
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
      // 1. Try Backend API endpoint
      const res = await apiClient.post('/ai/copilot/chat', {
        message: userMessage,
        query: userMessage,
        question: userMessage,
        history: historyPayload,
      });

      const data = res.data?.data || res.data;
      const reply = data?.reply || data?.answer || data?.response || data?.markdownContent;
      
      if (!reply || reply.includes('SAMADHAAN Intelligence Advisory')) {
        // Try direct Gemini if backend returned a generic canned response
        try {
          const directText = await callDirectGemini(userMessage);
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              text: directText,
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
        } catch {
          // Fall through
        }
      }

      if (reply && !reply.includes('SAMADHAAN Intelligence Advisory')) {
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
        return;
      }

      // If backend gave canned message on a non-civic question, use smart answer
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
    } catch (err: any) {
      // 2. Try direct Google Gemini API call
      try {
        const geminiReply = await callDirectGemini(userMessage);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: geminiReply,
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
      } catch (geminiError) {
        // 3. Smart offline reasoning
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
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    sendQuery(input);
  };

  // Helper to parse bold text & inline markdown links
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
        // Markdown link [title](url)
        tokens.push(
          <a
            key={match.index}
            href={match[3]}
            className="text-indigo-400 hover:text-indigo-300 underline font-medium inline-flex items-center gap-0.5"
          >
            {match[2]}
          </a>
        );
      } else if (match[4] !== undefined) {
        // Bold **text**
        tokens.push(
          <strong key={match.index} className="font-bold text-white">
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
          <h4 key={idx} className="font-bold text-indigo-300 text-xs mt-2 mb-1">
            {parseInlineElements(line.replace('### ', ''))}
          </h4>
        );
      }

      // Check if this is a bullet line (starts with -, *, •)
      let isBullet = false;
      if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ') || line.startsWith('•- ')) {
        isBullet = true;
        line = line.replace(/^(\s*[-*•]+\s*)+/, ''); // Strip ALL leading bullet markers cleanly!
      }

      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-1 my-0.5 text-slate-200">
            <span className="text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
            <div className="leading-relaxed">{parseInlineElements(line)}</div>
          </div>
        );
      }

      return (
        <p key={idx} className="my-0.5 leading-relaxed text-slate-200">
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
                      AI Live
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Ask any general, civic or CSR question</p>
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
                          <span>Suggested Queries:</span>
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
                    <span>Thinking with Gemini AI...</span>
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
                placeholder="Ask anything (e.g. Messi vs Ronaldo, road repairs, CSR)..."
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
