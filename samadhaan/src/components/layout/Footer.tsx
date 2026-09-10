import { Link } from 'react-router-dom';
import { Globe, Code2, Sparkles, ShieldCheck, Heart } from 'lucide-react';

const links = {
  Platform: [
    { label: 'About SAMADHAAN', href: '/' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'AI Intelligence Engine', href: '/ai-insights' },
    { label: 'National Impact Map', href: '/impact' },
  ],
  Stakeholders: [
    { label: 'Citizen Portal', href: '/dashboard' },
    { label: 'University & HEI Hub', href: '/universities' },
    { label: 'Industry & CSR Gateway', href: '/industry' },
    { label: 'Government & Ward Center', href: '/government' },
  ],
  Ecosystem: [
    { label: 'Problem Repository', href: '/problems' },
    { label: 'Active Solutions', href: '/solutions' },
    { label: 'Smart India Hackathon 2026', href: '#' },
    { label: 'Open Civic Data API', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/6 mt-24 bg-surface-1/40 backdrop-blur-md">
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/50 ring-1 ring-white/20">
                <span className="text-white text-base font-black tracking-wider">S</span>
              </div>
              <div className="flex flex-col leading-none">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-white">SAMADHAAN</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">SIH 2026</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase mt-0.5">National AI GovTech Bridge</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering 1.4 billion citizens with an AI-driven, multi-stakeholder engine that turns civic pain points into funded, deployed solutions with measurable national impact.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/15 flex items-center gap-3 max-w-sm">
              <Sparkles size={16} className="text-indigo-400 shrink-0" />
              <p className="text-xs text-indigo-200 font-medium italic">
                "From Local Problems to Lasting Solutions."
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Globe, label: 'Website' },
                { icon: Code2, label: 'Open Source' },
                { icon: ShieldCheck, label: 'Gov Security' }
              ].map(({ icon: Icon, label }, i) => (
                <div
                  key={i}
                  title={label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  <Icon size={16} />
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">
                {group}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            Designed & Built with <Heart size={12} className="text-red-400 fill-red-400" /> for Smart India Hackathon 2026.
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI Core Online (v2.4)
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">Demo Prototype Mode</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
