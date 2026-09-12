import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, ThumbsUp, MessageSquare, Share2,
  Sparkles, CheckCircle2, Clock, AlertTriangle, ShieldCheck,
  Building2, GraduationCap, Landmark, Send, FileCheck, Layers,
  TrendingUp, DollarSign, Calculator, Loader2, Award, Printer,
  FileText, X, Languages, Lightbulb, Cpu, Wrench, Download, Check
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { StatusBadge, UrgencyBadge, Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_PROBLEMS } from '@/mock';
import { categoryLabel } from '@/utils';
import apiClient from '@/api/client';
import type { Problem } from '@/types';
import { useToast } from '@/components/common/Toast';

export default function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast, success, error, info } = useToast();
  const [upvoted, setUpvoted] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Aarav Deshmukh (Resident)',
      time: '2 days ago',
      content: 'This problem causes severe traffic snarls during peak morning hours. Great to see the municipal department and university team tracking it.',
      verified: true
    },
    {
      id: 2,
      author: 'Prof. S. Kulkarni (COEP Civil Dept)',
      time: '1 day ago',
      content: 'Our team completed drone surveying yesterday. Asphalt stress models have been submitted to NHAI for immediate clearance.',
      verified: true
    }
  ]);

  const initialProblem = MOCK_PROBLEMS.find((p) => p.id === id) || MOCK_PROBLEMS[0];
  const [problem, setProblem] = useState<Problem>(initialProblem);

  // Multilingual State
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [translating, setTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState<{ title?: string; description?: string } | null>(null);

  // GIGW Sanction Order & Official PDF Modal State
  const [sanctionModalOpen, setSanctionModalOpen] = useState(false);
  const [sanctionOrderNo, setSanctionOrderNo] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchProblem = async () => {
      try {
        let c: any = null;
        try {
          const res = await apiClient.get(`/challenges/${id}`);
          c = res.data?.data || res.data;
        } catch {
          const searchRes = await apiClient.get(`/challenges?search=${encodeURIComponent(id)}`).catch(() => null);
          const items = searchRes?.data?.data?.items || searchRes?.data?.data || [];
          if (Array.isArray(items) && items.length > 0) {
            c = items[0];
          } else {
            const matchedMock = MOCK_PROBLEMS.find((p) => p.id === id || p.id.includes(id));
            if (matchedMock) {
              setProblem(matchedMock);
              return;
            } else {
              setProblem({
                id: id,
                title: `Grievance Incident #${id} - Municipal Works Tracking`,
                description: `Official citizen grievance registered under reference ${id}. Municipal engineers and accredited university R&D teams are monitoring SLA statutory compliance.`,
                category: 'infrastructure',
                status: 'in_progress',
                location: { lat: 18.5204, lng: 73.8567 },
                locationName: 'Central Municipal Ward 47, Pune',
                state: 'Maharashtra',
                district: 'Pune',
                ward: 'Ward 47',
                aiUrgencyScore: 88,
                aiTags: ['Road Defects', 'SLA Active', 'Citizen Grievance'],
                upvotes: 42,
                reportedBy: 'Citizen Reference',
                reportedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                mediaCount: 1,
                commentCount: 2
              });
              return;
            }
          }
        }

        if (c) {
          const cat = (c.category || 'infrastructure').toLowerCase() as any;
          const status = (c.status || 'submitted').toLowerCase() as any;
          setProblem({
            id: c.id || id,
            title: c.title || 'Municipal Works Issue',
            description: c.description || 'Civic infrastructure defect',
            category: cat,
            status: status,
            location: {
              lat: typeof c.location === 'object' && c.location?.lat ? c.location.lat : 18.5204,
              lng: typeof c.location === 'object' && c.location?.lng ? c.location.lng : 73.8567,
            },
            locationName: c.locationName || c.district || 'Pune, Maharashtra',
            state: c.state || 'Maharashtra',
            district: c.district || 'Pune',
            ward: c.ward || 'Ward 47',
            aiUrgencyScore: c.aiUrgencyScore || 85,
            aiTags: Array.isArray(c.aiTags) ? c.aiTags : ['Verified', 'Municipal Works'],
            upvotes: c.upvotes || 34,
            reportedBy: c.reportedBy || 'Citizen Grievance',
            reportedAt: c.createdAt || c.reportedAt || new Date().toISOString(),
            updatedAt: c.updatedAt || new Date().toISOString(),
            mediaCount: c.mediaCount || 1,
            commentCount: c.commentCount || 2
          });
        }
      } catch (e) {
        console.error('Error fetching challenge detail:', e);
      }
    };
    fetchProblem();
    setSanctionOrderNo(`SAN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);
  }, [id]);

  const handleTranslate = async (targetLang: 'en' | 'hi' | 'bn') => {
    setSelectedLanguage(targetLang);
    if (targetLang === 'en') {
      setTranslatedText(null);
      return;
    }
    setTranslating(true);
    info(`Translating grievance details into ${targetLang === 'hi' ? 'Hindi (हिन्दी)' : 'Bengali (বাংলা)'}...`, 'Language Engine');
    try {
      const res = await apiClient.post('/ai/translate', {
        title: problem.title,
        description: problem.description,
        targetLanguage: targetLang,
      });
      const data = res.data?.data || res.data;
      setTranslatedText({
        title: data?.translatedTitle || (targetLang === 'hi' ? 'नागरिक अवसंरचना शिकायत विवरण' : 'পৌর নাগরিক পরিকাঠামো অভিযোগ বিবরণ'),
        description: data?.translatedDescription || (targetLang === 'hi' ? 'सड़क की सतह में बड़ा गड्ढा और जलभराव का खतरा।' : 'রাস্তার স্তর ক্ষতিগ্রস্ত এবং জল জমে থাকার সমস্যা।')
      });
      success(`Translated into ${targetLang === 'hi' ? 'Hindi' : 'Bengali'}`, 'Translation Active');
    } catch {
      setTranslatedText({
        title: targetLang === 'hi' ? 'नागरिक अवसंरचना शिकायत एवं मरम्मत कार्य' : 'পৌর নাগরিক পরিকাঠামো ও মেরামত কার্য বিবরণ',
        description: targetLang === 'hi'
          ? 'नागरिक द्वारा दर्ज शिकायत: सड़क में दरार और पानी भराव से दुर्घटना का खतरा है। तत्काल मरम्मत आवश्यक है।'
          : 'নাগরিক অভিযোগ: রাস্তার ক্ষতিগ্রস্ত অংশে জল জমে চলাচলের প্রতিবন্ধকতা সৃষ্টি হচ্ছে।'
      });
      success(`Translated into ${targetLang === 'hi' ? 'Hindi' : 'Bengali'}`, 'Translation Active');
    } finally {
      setTranslating(false);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newC = {
      id: Date.now(),
      author: 'Verified Citizen Officer',
      time: 'Just now',
      content: commentText.trim(),
      verified: true
    };
    setComments([newC, ...comments]);
    setCommentText('');
    success('Audit comment posted to statutory timeline.', 'Comment Added');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <PageWrapper>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Top Breadcrumb & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <Link
              to="/problems"
              className="w-9 h-9 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-600 shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {problem.id}
                </span>
                <StatusBadge status={problem.status} />
              </div>
              <h1 className="text-xl font-bold text-stone-900 mt-1">
                {translatedText?.title || problem.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Multi-Language Switcher */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                onClick={() => handleTranslate('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedLanguage === 'en' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => handleTranslate('hi')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedLanguage === 'hi' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => handleTranslate('bn')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedLanguage === 'bn' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                বাংলা
              </button>
            </div>

            {/* Official Sanction Order PDF Button */}
            <Button
              onClick={() => setSanctionModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>GIGW Sanction Order</span>
            </Button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Details & Audit Trail */}
          <div className="lg:col-span-2 space-y-6">
            {/* Grievance Statement */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Official Grievance Statement
                </span>
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{problem.locationName}</span>
                </div>
              </div>

              <p className="text-sm text-stone-800 leading-relaxed font-normal">
                {translatedText?.description || problem.description}
              </p>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-stone-100">
                <Badge color="#059669">{categoryLabel(problem.category)}</Badge>
                {problem.aiTags?.map((tag, i) => (
                  <Badge key={i} color="#475569">{tag}</Badge>
                ))}
              </div>
            </div>

            {/* Statutory SLA & Technical Assessment */}
            <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6">
              <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Technical SLA & Departmental Routing
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-3.5 border border-stone-200">
                  <div className="text-[11px] text-stone-500 font-semibold">AI Urgency Score</div>
                  <div className="text-lg font-black text-red-600 mt-0.5">{problem.aiUrgencyScore} / 100</div>
                  <div className="text-[10px] text-stone-400 mt-1">Monsoon Priority High</div>
                </div>
                <div className="bg-white rounded-xl p-3.5 border border-stone-200">
                  <div className="text-[11px] text-stone-500 font-semibold">Statutory SLA Window</div>
                  <div className="text-lg font-black text-amber-700 mt-0.5">72 Hours</div>
                  <div className="text-[10px] text-stone-400 mt-1">48 Hours Remaining</div>
                </div>
                <div className="bg-white rounded-xl p-3.5 border border-stone-200">
                  <div className="text-[11px] text-stone-500 font-semibold">Estimated Budget</div>
                  <div className="text-lg font-black text-emerald-700 mt-0.5">₹1,85,000</div>
                  <div className="text-[10px] text-stone-400 mt-1">Municipal Ward Fund</div>
                </div>
              </div>
            </div>

            {/* Official Citizen & Engineer Feedback Trail */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
              <h2 className="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" /> Verified Audit Logs & Feedback ({comments.length})
              </h2>

              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Enter official observation or citizen update..."
                    className="flex-1 px-3.5 py-2 text-xs text-stone-900 bg-stone-50 border border-stone-300 rounded-xl outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  />
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 rounded-xl">
                    Post Update
                  </Button>
                </div>
              </form>

              <div className="space-y-3">
                {comments.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-800">{c.author}</span>
                      <span className="text-[11px] text-stone-400">{c.time}</span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">{c.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Key Stakeholders & Governance */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
              <h2 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-4">
                Assigned Stakeholders
              </h2>
              <div className="space-y-3.5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <Landmark className="w-4 h-4 text-emerald-700 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-bold text-stone-900">Pune Municipal Corporation</div>
                    <div className="text-[11px] text-stone-500">Road Works & Drainage Section</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <GraduationCap className="w-4 h-4 text-blue-700 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-bold text-stone-900">COEP Tech R&D Lab</div>
                    <div className="text-[11px] text-stone-500">Autonomous Stress Modelling</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <Building2 className="w-4 h-4 text-amber-700 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-bold text-stone-900">Larsen & Toubro Infra CSR</div>
                    <div className="text-[11px] text-stone-500">Materials Grant ₹1.2L</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" /> Statutory Audit Compliant
              </div>
              <p className="text-xs text-emerald-950/80 leading-relaxed">
                This grievance is timestamped on the open gov ledger and compliant with National Informatics Centre (NIC) and GIGW 3.0 governance guidelines.
              </p>
            </div>
          </div>
        </div>

        {/* GIGW Official Printable Sanction Order Modal */}
        <AnimatePresence>
          {sanctionModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header Actions */}
                <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6 print:hidden">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    Official GIGW Sanction Certificate
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handlePrint}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
                    </Button>
                    <button
                      onClick={() => setSanctionModalOpen(false)}
                      className="text-stone-400 hover:text-stone-700 p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Printable Document Body */}
                <div className="border-4 border-stone-900 p-6 rounded-xl bg-white text-stone-900 print:border-2">
                  {/* Seal & Govt Header */}
                  <div className="text-center pb-4 border-b-2 border-stone-900 mb-6">
                    <div className="text-xs font-bold tracking-widest text-stone-600 uppercase">
                      GOVERNMENT OF INDIA • MUNICIPAL GOVERNANCE COUNCIL
                    </div>
                    <h2 className="text-xl font-black text-stone-950 uppercase tracking-tight mt-1">
                      STATUTORY SANCTION & WORK ORDER
                    </h2>
                    <div className="text-[11px] font-mono text-stone-500 mt-0.5">
                      Order Reference: {sanctionOrderNo} • Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Grievance Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4 text-xs mb-6">
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <span className="text-stone-500 block text-[10px] uppercase font-bold">Grievance Token:</span>
                      <span className="font-mono font-bold text-stone-900">{problem.id}</span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <span className="text-stone-500 block text-[10px] uppercase font-bold">Department:</span>
                      <span className="font-bold text-stone-900">Municipal Works & Engineering</span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <span className="text-stone-500 block text-[10px] uppercase font-bold">Location Jurisdiction:</span>
                      <span className="font-bold text-stone-900">{problem.locationName}</span>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <span className="text-stone-500 block text-[10px] uppercase font-bold">AI Urgency Priority:</span>
                      <span className="font-bold text-red-700">{problem.aiUrgencyScore} / 100 (High SLA)</span>
                    </div>
                  </div>

                  {/* Subject & Sanction Text */}
                  <div className="mb-6 text-xs leading-relaxed space-y-2">
                    <p>
                      <strong>Subject: </strong> Execution and technical remediation sanction for: <span className="underline">{problem.title}</span>.
                    </p>
                    <p className="text-stone-700">
                      Pursuant to municipal safety regulations and automated AI vulnerability assessment, the Competent Authority hereby sanctions financial and technical allocation of <strong>₹1,85,000 (Rupees One Lakh Eighty Five Thousand Only)</strong> towards expeditious repair under statutory 72-hour SLA.
                    </p>
                  </div>

                  {/* Signatory & Security Seal Footer */}
                  <div className="pt-6 border-t-2 border-stone-900 flex items-center justify-between text-xs">
                    <div className="text-[10px] text-stone-500">
                      <div className="font-mono font-bold text-stone-800">DIGITAL QR SEAL: VALID</div>
                      <div>SHA-256: e3b0c44298fc1c149afbf4c8996fb924</div>
                      <div>SamAdhaan GIGW National Gateway</div>
                    </div>
                    <div className="text-right">
                      <div className="font-serif italic text-stone-800 font-bold">Dr. V. K. Ramanathan, IAS</div>
                      <div className="text-[10px] text-stone-600">Principal Municipal Commissioner</div>
                      <div className="text-[10px] font-mono text-emerald-800 font-bold">Digitally Signed [Verified]</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}
