import { Link } from 'react-router-dom';
import { Globe, Code2, Sparkles, ShieldCheck, Heart, Landmark, CheckCircle2, Phone, Mail, FileText } from 'lucide-react';

const links = {
  'Government Portals': [
    { label: 'National Portal of India (india.gov.in)', href: 'https://www.india.gov.in' },
    { label: 'Ministry of Housing & Urban Affairs', href: 'https://mohua.gov.in' },
    { label: 'Digital India Initiative', href: 'https://www.digitalindia.gov.in' },
    { label: 'MyGov Citizen Engagement', href: 'https://www.mygov.in' },
  ],
  'Stakeholder Services': [
    { label: 'Citizen Grievance Redressal', href: '/problems' },
    { label: 'Municipal Ward Command (PMC/BMC)', href: '/government' },
    { label: 'University R&D Grand Challenges', href: '/universities' },
    { label: 'Corporate CSR Co-Funding (Sec 135)', href: '/industry' },
  ],
  'Compliance & Governance': [
    { label: 'Citizen Charter & SLA Commitments', href: '/#how-it-works' },
    { label: 'Right to Information (RTI)', href: '#' },
    { label: 'National Impact Telemetry', href: '/impact' },
    { label: 'AI Intelligence Ethics & Audit', href: '/ai-insights' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 mt-20 bg-slate-900 text-slate-300">
      {/* Top National Strip */}
      <div className="tricolor-bar" />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Official Brand Information */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-blue-600 flex items-center justify-center shadow-lg border border-amber-300 text-xl">
                🏛️
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black tracking-tight text-white">समा<span className="text-amber-400">धान</span> (SAMADHAAN)</span>
                </div>
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  National Multi-Stakeholder GovTech Bridge
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              An official GovTech initiative uniting 1.4 billion citizens, Municipal ULBs, Academic Research Labs (IIT/COEP/NIT), and Corporate CSR Capital to accelerate urban grievance resolution with 100% audited transparency.
            </p>

            {/* Helpline and Contact Box */}
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 max-w-sm text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5 font-bold text-white"><Phone size={13} className="text-emerald-400" /> National Helpdesk:</span>
                <strong className="text-emerald-400 font-mono">1800-11-2026</strong>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5"><Mail size={13} className="text-amber-400" /> Support Desk:</span>
                <span className="text-slate-300 font-mono text-[11px]">grievance@samadhaan.gov.in</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 flex items-center gap-1.5 font-semibold text-slate-300">
                <ShieldCheck size={13} className="text-emerald-400" /> GIGW 3.0 & WCAG 2.1 Compliant
              </span>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group} className="space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                {group}
              </h4>
              <ul className="flex flex-col gap-2.5 text-xs">
                {items.map((item) => (
                  <li key={item.label}>
                    {item.href.startsWith('http') ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white hover:underline transition-colors flex items-center gap-1"
                      >
                        <span>{item.label}</span>
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Legal Strip */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-slate-400">
              © 2026 SAMADHAAN — National GovTech Portal. Content owned, updated and maintained by the Ministry of Housing and Urban Affairs.
            </p>
            <p className="text-[11px] text-slate-500">
              Designed & Built for Smart India Hackathon 2026 • Hosted on National Cloud Infrastructure.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Official Gazette Active
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
