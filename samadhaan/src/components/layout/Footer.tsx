import { Link } from 'react-router-dom';
import {
  Phone, Mail, MapPin, ExternalLink, ShieldCheck,
  CheckCircle2, Globe, Heart, Award, FileText, Landmark
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t-2 border-emerald-500 text-slate-700 text-xs">
      {/* ── Top Government Initiative Badges Strip ── */}
      <div className="bg-emerald-50/70 border-b border-emerald-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Landmark size={15} className="text-emerald-700" />
              <span>National Innovation & Public Grievance Portal</span>
            </span>
            <span className="hidden md:inline text-emerald-300">|</span>
            <span className="hidden md:inline text-emerald-800 font-medium">
              Guidelines for Indian Government Websites (GIGW) Certified
            </span>
          </div>
          <div className="flex items-center gap-3 text-emerald-800 font-bold">
            <span>Swachh Bharat</span>
            <span>•</span>
            <span>Smart Cities Mission</span>
            <span>•</span>
            <span>Digital India</span>
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Col 1: Government Mission */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border-2 border-emerald-600 flex items-center justify-center text-emerald-800 font-black">
              🏛️
            </div>
            <div>
              <h3 className="font-black text-lg text-emerald-950 tracking-tight">
                SAM<span className="text-emerald-600">ADHAAN</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Government of India Multi-Stakeholder Redressal Hub</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed text-xs">
            An official initiative connecting Indian citizens with Municipal Corporations, accredited Academic R&D labs, and Corporate CSR wings under Section 135 to resolve urban infrastructure challenges through statutory SLA-bound transparency.
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1 text-emerald-800 font-bold">
              <Phone size={13} className="text-emerald-600" />
              <span>1800-11-2026 (Toll Free)</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Mail size={13} className="text-emerald-600" />
              <span>support@samadhaan.gov.in</span>
            </span>
          </div>
        </div>

        {/* Col 2: Citizen Services */}
        <div className="space-y-3">
          <h4 className="font-bold text-emerald-950 text-sm">Citizen Services</h4>
          <ul className="space-y-2 text-slate-600">
            <li><Link to="/problems/new" className="hover:text-emerald-700 transition-colors">File Public Grievance</Link></li>
            <li><Link to="/problems" className="hover:text-emerald-700 transition-colors">Track Complaint Status</Link></li>
            <li><Link to="/impact" className="hover:text-emerald-700 transition-colors">Live Municipal Map</Link></li>
            <li><Link to="/ai-insights" className="hover:text-emerald-700 transition-colors">Predictive Ward Analytics</Link></li>
            <li><Link to="/solutions" className="hover:text-emerald-700 transition-colors">Civic Innovation Catalog</Link></li>
          </ul>
        </div>

        {/* Col 3: Institutional Pillars */}
        <div className="space-y-3">
          <h4 className="font-bold text-emerald-950 text-sm">Stakeholder Hubs</h4>
          <ul className="space-y-2 text-slate-600">
            <li><Link to="/universities" className="hover:text-emerald-700 transition-colors">Higher Education Institutes (HEI)</Link></li>
            <li><Link to="/industry" className="hover:text-emerald-700 transition-colors">CSR & Corporate Co-Funding</Link></li>
            <li><Link to="/government" className="hover:text-emerald-700 transition-colors">Municipal Command Center</Link></li>
            <li><Link to="/dashboard" className="hover:text-emerald-700 transition-colors">Nodal Officer Dashboard</Link></li>
            <li><a href="https://cpgrams.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-700 flex items-center gap-1">CPGRAMS Portal <ExternalLink size={11} /></a></li>
          </ul>
        </div>

        {/* Col 4: Statutory & Legal */}
        <div className="space-y-3">
          <h4 className="font-bold text-emerald-950 text-sm">Statutory Compliance</h4>
          <ul className="space-y-2 text-slate-600">
            <li><span className="hover:text-emerald-700 cursor-pointer">Right to Information (RTI)</span></li>
            <li><span className="hover:text-emerald-700 cursor-pointer">Citizen Charter & SLA</span></li>
            <li><span className="hover:text-emerald-700 cursor-pointer">Privacy & Data Governance</span></li>
            <li><span className="hover:text-emerald-700 cursor-pointer">Hyperlinking & Copyright</span></li>
            <li><span className="hover:text-emerald-700 cursor-pointer">Terms of Service</span></li>
          </ul>
        </div>
      </div>

      {/* ── Bottom Strip ── */}
      <div className="bg-emerald-50/50 border-t border-emerald-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-2 text-slate-500 text-[11px]">
          <div>
            © 2026 SAMADHAAN Portal. Designed & Developed for the Government of India.
          </div>
          <div className="flex items-center gap-2">
            <span>Portal Content Managed by Ministry of Housing & Urban Affairs (MoHUA)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
