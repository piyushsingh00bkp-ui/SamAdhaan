import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Navigation, Building2, MapPin, Sparkles, ShieldCheck,
  Search, Filter, Layers, CheckCircle2, AlertTriangle,
  Clock, ArrowRight, ExternalLink, RefreshCw, Eye, ThumbsUp,
  GraduationCap, Briefcase, Phone
} from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { PLATFORM_STATS, MOCK_PROBLEMS } from '@/mock';
import { StatusBadge } from '@/components/ui/Badge';
import apiClient from '@/api/client';
import { INDIAN_CITIES, CityHub, resolveLocationHub } from '@/utils/locationIntelligence';

// Custom Map View Transition Controller
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2, easeLinearity: 0.25 });
  }, [center, zoom, map]);
  return null;
}

const URGENCY_COLOR = (score: number) =>
  score >= 90 ? '#ef4444' :
  score >= 70 ? '#f59e0b' :
  score >= 50 ? '#38bdf8' : '#34d399';

const URGENCY_LABEL = (score: number) =>
  score >= 90 ? 'CRITICAL' :
  score >= 70 ? 'HIGH' :
  score >= 50 ? 'MEDIUM' : 'NORMAL';

const CATEGORY_ICONS: Record<string, string> = {
  infrastructure: '🏗️',
  water: '💧',
  waste: '♻️',
  electricity: '⚡',
  healthcare: '🏥',
  education: '🎓',
  transportation: '🚦',
  sanitation: '🧹',
};

const TILE_PROVIDERS = {
  dark: {
    name: '🌙 Dark Mode',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB &copy; OpenStreetMap'
  },
  standard: {
    name: '🗺️ Street Map',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  satellite: {
    name: '🛰️ Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Earthstar Geographics'
  }
};

// Generate high-quality realistic problem markers across Indian hubs
const GENERATED_CITY_PROBLEMS = INDIAN_CITIES.flatMap((city) => [
  {
    id: `PRB-${city.id.toUpperCase()}-01`,
    title: `Monsoon Drainage Choke & Surface Collapse near ${city.name} Market`,
    description: `Severe stormwater drain clogging and asphalt erosion causing 2km traffic jam and waterlogging in commercial corridor.`,
    lat: city.lat + 0.012,
    lng: city.lng + 0.008,
    location: `Central Market Area, ${city.name}`,
    city: city.name,
    state: city.state,
    category: 'water',
    urgency: 92,
    status: 'in_progress',
    sla: '48 Hours (18h left)',
    upvotes: 842,
    municipalBody: city.municipalBody,
    nodalOfficer: city.nodalOfficer,
    university: city.universities[0],
    csrPartner: city.industryPartners[0]
  },
  {
    id: `PRB-${city.id.toUpperCase()}-02`,
    title: `Pothole Cluster & Structural Road Degradation on ${city.name} Ring Road`,
    description: `Multiple deep crater potholes on arterial freight road causing accidents and severe vehicle damage during peak hours.`,
    lat: city.lat - 0.018,
    lng: city.lng + 0.015,
    location: `Outer Ring Road Bypass, ${city.name}`,
    city: city.name,
    state: city.state,
    category: 'infrastructure',
    urgency: 84,
    status: 'in_progress',
    sla: '72 Hours (36h left)',
    upvotes: 1205,
    municipalBody: city.municipalBody,
    nodalOfficer: city.nodalOfficer,
    university: city.universities[0],
    csrPartner: city.industryPartners[0]
  },
  {
    id: `PRB-${city.id.toUpperCase()}-03`,
    title: `Illegal Solid Waste Dump & Hazardous Leachate near ${city.name} Ward 14`,
    description: `Unsegregated municipal garbage accumulating over 3 weeks. Open dumping causing stench, vector risk, and drain blockage.`,
    lat: city.lat + 0.024,
    lng: city.lng - 0.019,
    location: `Ward 14 Transit Yard, ${city.name}`,
    city: city.name,
    state: city.state,
    category: 'waste',
    urgency: 76,
    status: 'submitted',
    sla: '48 Hours (42h left)',
    upvotes: 490,
    municipalBody: city.municipalBody,
    nodalOfficer: city.nodalOfficer,
    university: city.universities[1] || city.universities[0],
    csrPartner: city.industryPartners[1] || city.industryPartners[0]
  },
  {
    id: `PRB-${city.id.toUpperCase()}-04`,
    title: `High-Voltage Transformer Sparking & Street Light Blackout in ${city.name}`,
    description: `Exposed electrical feeder box with loose cables sparking near public school bus stand during rain.`,
    lat: city.lat - 0.009,
    lng: city.lng - 0.022,
    location: `Sector 4 Main Road, ${city.name}`,
    city: city.name,
    state: city.state,
    category: 'electricity',
    urgency: 96,
    status: 'in_progress',
    sla: '24 Hours (6h left)',
    upvotes: 2150,
    municipalBody: city.municipalBody,
    nodalOfficer: city.nodalOfficer,
    university: city.universities[0],
    csrPartner: city.industryPartners[0]
  },
  {
    id: `PRB-${city.id.toUpperCase()}-05`,
    title: `Water Pipeline Contamination & Low Pressure in ${city.name} South`,
    description: `Sewage mixing with drinking water supply lines. Residents receiving turbid water with foul odor.`,
    lat: city.lat + 0.005,
    lng: city.lng + 0.028,
    location: `South Residential Colony, ${city.name}`,
    city: city.name,
    state: city.state,
    category: 'water',
    urgency: 94,
    status: 'in_progress',
    sla: '24 Hours (11h left)',
    upvotes: 1870,
    municipalBody: city.municipalBody,
    nodalOfficer: city.nodalOfficer,
    university: city.universities[0],
    csrPartner: city.industryPartners[0]
  },
  {
    id: `PRB-${city.id.toUpperCase()}-06`,
    title: `Smart IoT Solar Street Lighting & Asphalt Patching Completed in ${city.name}`,
    description: `Successful deployment of cold-mix geopolymer patching and 45 smart solar LED streetlights with IoT monitoring.`,
    lat: city.lat - 0.025,
    lng: city.lng - 0.006,
    location: `Tech Zone Avenue, ${city.name}`,
    city: city.name,
    state: city.state,
    category: 'infrastructure',
    urgency: 45,
    status: 'resolved',
    sla: 'Resolved in 14 Days',
    upvotes: 3420,
    municipalBody: city.municipalBody,
    nodalOfficer: city.nodalOfficer,
    university: city.universities[0],
    csrPartner: city.industryPartners[0]
  }
]);

export default function ImpactPage() {
  const [stats, setStats] = useState(PLATFORM_STATS);
  const [allProblems, setAllProblems] = useState<any[]>(GENERATED_CITY_PROBLEMS);
  const [selectedCity, setSelectedCity] = useState<CityHub | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState<number>(5);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [tileMode, setTileMode] = useState<'dark' | 'standard' | 'satellite'>('dark');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeProblemId, setActiveProblemId] = useState<string | null>(null);

  // Fetch real-time challenges from backend on mount
  useEffect(() => {
    // Overview analytics
    apiClient.get('/analytics/overview')
      .then((res) => {
        const d = res.data?.data || res.data;
        if (d) {
          setStats((prev) => ({
            ...prev,
            resolvedProblems: d.resolvedChallenges ?? prev.resolvedProblems,
            peopleImpacted: d.totalPeopleImpacted ?? prev.peopleImpacted,
            citiesActive: d.citiesActive ?? prev.citiesActive,
            statesActive: d.statesActive ?? prev.statesActive,
          }));
        }
      })
      .catch(() => {});

    // Live challenges
    apiClient.get('/challenges?limit=50')
      .then((res) => {
        const list = res.data?.data?.items || res.data?.data || res.data;
        if (Array.isArray(list) && list.length > 0) {
          const mapped = list.map((item: any) => {
            const hub = resolveLocationHub({ lat: item.latitude, lng: item.longitude, text: item.locationName || item.city });
            return {
              id: item.id,
              title: item.title,
              description: item.description || 'Civic infrastructure defect',
              lat: item.latitude || (hub.lat + (Math.random() - 0.5) * 0.05),
              lng: item.longitude || (hub.lng + (Math.random() - 0.5) * 0.05),
              location: item.locationName || `${hub.name}, ${hub.state}`,
              city: hub.name,
              state: hub.state,
              category: (item.category?.toLowerCase().includes('water') ? 'water' :
                         item.category?.toLowerCase().includes('waste') ? 'waste' :
                         item.category?.toLowerCase().includes('elect') ? 'electricity' : 'infrastructure') as any,
              urgency: item.severity || (item.priority === 'CRITICAL' ? 95 : item.priority === 'HIGH' ? 82 : 65),
              status: (item.status === 'RESOLVED' ? 'resolved' : 'in_progress') as any,
              sla: item.status === 'RESOLVED' ? 'Resolved' : '48 Hours SLA',
              upvotes: item.affectedPopulation || 650,
              municipalBody: hub.municipalBody,
              nodalOfficer: hub.nodalOfficer,
              university: hub.universities[0],
              csrPartner: hub.industryPartners[0]
            };
          });
          setAllProblems((prev) => [...mapped, ...prev]);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectCity = (city: CityHub | null) => {
    setSelectedCity(city);
    if (city) {
      setMapCenter([city.lat, city.lng]);
      setMapZoom(12);
    } else {
      setMapCenter([20.5937, 78.9629]);
      setMapZoom(5);
    }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setMapCenter(coords);
        setMapZoom(14);
        setGpsLoading(false);
      },
      (err) => {
        console.warn('GPS error:', err);
        setGpsLoading(false);
        alert('Could not access GPS. Please check browser location permissions.');
      },
      { timeout: 10000 }
    );
  };

  // Fly map to a specific problem card
  const handleFocusProblem = (problem: any) => {
    setActiveProblemId(problem.id);
    setMapCenter([problem.lat, problem.lng]);
    setMapZoom(14);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  // Filtered problems computation
  const filteredProblems = useMemo(() => {
    return allProblems.filter((p) => {
      // 1. City filter
      if (selectedCity && !p.location.toLowerCase().includes(selectedCity.name.toLowerCase()) && !p.city?.toLowerCase().includes(selectedCity.name.toLowerCase())) {
        return false;
      }
      // 2. Search filter
      if (searchQuery) {
        const text = `${p.title} ${p.location} ${p.description}`.toLowerCase();
        if (!text.includes(searchQuery.toLowerCase())) return false;
      }
      // 3. Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // 4. Urgency filter
      if (selectedUrgency === 'critical' && p.urgency < 90) return false;
      if (selectedUrgency === 'high' && (p.urgency < 70 || p.urgency >= 90)) return false;
      if (selectedUrgency === 'medium' && (p.urgency < 50 || p.urgency >= 70)) return false;
      if (selectedUrgency === 'low' && p.urgency >= 50) return false;
      // 5. Status filter
      if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;

      return true;
    });
  }, [allProblems, selectedCity, searchQuery, selectedCategory, selectedUrgency, selectedStatus]);

  // Current active hub for municipal intelligence
  const currentHub = selectedCity || INDIAN_CITIES[0];

  return (
    <PageWrapper>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8 space-y-6">
        {/* Header Title & GPS Pan Button */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  National Geospatial Network
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Stream Active
                </span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">National Impact & Hotspot Tracker</h1>
              <p className="text-slate-400 text-sm mt-1">
                Real-time geospatial intelligence, municipal SLA tracking, and multi-stakeholder civic resolution across India.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleGPS}
                disabled={gpsLoading}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 border border-indigo-400/40 cursor-pointer transition-all"
              >
                <Navigation size={14} className={gpsLoading ? 'animate-spin' : ''} />
                <span>{gpsLoading ? 'Detecting GPS...' : '📍 My Live Location'}</span>
              </button>

              <Link
                to="/problems/new"
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 border border-emerald-500 cursor-pointer transition-all"
              >
                <MapPin size={14} className="text-amber-400" />
                <span>Report on Map</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Dynamic City Hub Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
          <button
            onClick={() => handleSelectCity(null)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border cursor-pointer ${
              selectedCity === null
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/40'
                : 'bg-white/4 text-slate-400 border-white/8 hover:text-white hover:bg-white/8'
            }`}
          >
            🇮🇳 All India ({allProblems.length})
          </button>
          {INDIAN_CITIES.map((c) => {
            const cityCount = allProblems.filter((p) => p.location.includes(c.name) || p.city === c.name).length;
            const isSelected = selectedCity?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => handleSelectCity(c)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all border cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/40'
                    : 'bg-white/4 text-slate-400 border-white/8 hover:text-white hover:bg-white/8'
                }`}
              >
                <span>{c.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-400'}`}>
                  {cityCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected City Municipal & R&D Intelligence Panel */}
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900/90 to-purple-950/70 border border-indigo-500/30 p-4 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-indigo-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">{selectedCity.name}, {selectedCity.state} Municipal Jurisdiction</h3>
                  <p className="text-xs text-slate-400">Integrated Municipal Escalation & Academic Research Network</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <Phone size={11} />
                  24x7 Helpline: {selectedCity.helpline}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/4 p-3 rounded-xl border border-white/8">
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Local Government Body</p>
                <p className="text-indigo-300 font-bold mt-0.5">{selectedCity.municipalBody}</p>
                <p className="text-[11px] text-slate-400 mt-1">Nodal Officer: {selectedCity.nodalOfficer}</p>
              </div>
              <div className="bg-white/4 p-3 rounded-xl border border-white/8">
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Academic R&D Hub</p>
                <p className="text-purple-300 font-bold mt-0.5">{selectedCity.universities[0].name}</p>
                <p className="text-[11px] text-slate-400 mt-1">Focus: {selectedCity.universities[0].specialization}</p>
              </div>
              <div className="bg-white/4 p-3 rounded-xl border border-white/8">
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">CSR Industry Partner</p>
                <p className="text-amber-300 font-bold mt-0.5">{selectedCity.industryPartners[0].name}</p>
                <p className="text-[11px] text-slate-400 mt-1">Slab: {selectedCity.industryPartners[0].potentialFunding}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Macro KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            { label: selectedCity ? `${selectedCity.name} Mapped Issues` : 'National Mapped Hotspots', value: filteredProblems.length, color: '#6366f1', icon: '📍' },
            { label: 'Verified SLA Adherence', value: '94.6%', color: '#38bdf8', icon: '⏱️' },
            { label: selectedCity ? 'Local Resolved Problems' : 'National Resolved Issues', value: selectedCity ? Math.round(stats.resolvedProblems / 12) : stats.resolvedProblems, color: '#34d399', icon: '✓' },
            { label: 'Citizens Benefited', value: selectedCity ? Math.round(stats.peopleImpacted / 8) : stats.peopleImpacted, color: '#fbbf24', icon: '👥' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-4 border border-white/8 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 font-medium">{s.label}</span>
                <span className="text-base">{s.icon}</span>
              </div>
              <p className="text-2xl font-black text-white">{typeof s.value === 'number' ? s.value.toLocaleString('en-IN') : s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter Toolbar & Map Controls */}
        <div className="glass rounded-2xl p-4 border border-white/8 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by defect, locality, street, or landmark..."
                className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white">
                  ✕
                </button>
              )}
            </div>

            {/* Map Mode Selector */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-white/10">
              {(Object.keys(TILE_PROVIDERS) as (keyof typeof TILE_PROVIDERS)[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setTileMode(key)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    tileMode === key
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {TILE_PROVIDERS[key].name}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/6 text-xs">
            {/* Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1 shrink-0">
                <Filter size={12} /> Category:
              </span>
              {[
                { id: 'all', label: 'All' },
                { id: 'infrastructure', label: '🏗️ Roads' },
                { id: 'water', label: '💧 Water' },
                { id: 'waste', label: '♻️ Waste' },
                { id: 'electricity', label: '⚡ Power' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Urgency & Status */}
            <div className="flex items-center gap-2">
              <select
                value={selectedUrgency}
                onChange={(e) => setSelectedUrgency(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Urgency Levels</option>
                <option value="critical">🔴 Critical (90+)</option>
                <option value="high">🟠 High (70-89)</option>
                <option value="medium">🔵 Medium (50-69)</option>
                <option value="low">🟢 Normal (&lt;50)</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="in_progress">🟡 In Progress</option>
                <option value="submitted">🔵 Submitted</option>
                <option value="resolved">🟢 Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interactive Leaflet Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative"
          style={{ height: 560 }}
        >
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
          >
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              url={TILE_PROVIDERS[tileMode].url}
              attribution={TILE_PROVIDERS[tileMode].attribution}
            />

            {/* User GPS Pinpoint */}
            {userLocation && (
              <CircleMarker
                center={userLocation}
                radius={12}
                pathOptions={{
                  color: '#3b82f6',
                  fillColor: '#60a5fa',
                  fillOpacity: 0.9,
                  weight: 3,
                }}
              >
                <Popup>
                  <div className="p-2 text-xs bg-slate-900 text-white rounded-lg">
                    <p className="font-bold text-blue-400">📍 You are here</p>
                    <p className="text-slate-400 mt-0.5">Live GPS Location</p>
                  </div>
                </Popup>
              </CircleMarker>
            )}

            {/* Mapped Problems Markers */}
            {filteredProblems.map((marker) => {
              const isSelected = activeProblemId === marker.id;
              const color = URGENCY_COLOR(marker.urgency);
              return (
                <CircleMarker
                  key={marker.id}
                  center={[marker.lat, marker.lng]}
                  radius={marker.urgency >= 90 ? (isSelected ? 16 : 13) : marker.urgency >= 70 ? (isSelected ? 14 : 11) : (isSelected ? 11 : 9)}
                  pathOptions={{
                    color: isSelected ? '#ffffff' : color,
                    fillColor: color,
                    fillOpacity: isSelected ? 0.95 : 0.75,
                    weight: isSelected ? 3 : 2,
                  }}
                  eventHandlers={{
                    click: () => setActiveProblemId(marker.id)
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="text-xs bg-slate-950 text-white rounded-xl p-3.5 min-w-[280px] max-w-[340px] space-y-2.5 border border-white/10 shadow-2xl">
                      {/* Badge & Urgency */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-slate-300 uppercase tracking-wider">
                          {CATEGORY_ICONS[marker.category] || '🏛️'} {marker.category}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ backgroundColor: `${color}25`, color }}
                        >
                          {URGENCY_LABEL(marker.urgency)} • {marker.urgency}/100
                        </span>
                      </div>

                      {/* Title & Location */}
                      <div>
                        <h4 className="font-bold text-sm text-white leading-tight">{marker.title}</h4>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin size={11} className="text-indigo-400 shrink-0" />
                          <span>{marker.location}</span>
                        </p>
                      </div>

                      {/* Details Box */}
                      <div className="bg-white/5 rounded-lg p-2.5 space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-500">Statutory SLA:</span>
                          <span className="font-semibold text-indigo-300 flex items-center gap-1">
                            <Clock size={11} /> {marker.sla}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span className="text-slate-500">Local Authority:</span>
                          <span className="font-semibold text-slate-200 truncate max-w-[150px]">{marker.municipalBody}</span>
                        </div>
                        {marker.university && (
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-500">R&D Lab:</span>
                            <span className="font-semibold text-purple-300 truncate max-w-[150px]">{marker.university.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Links */}
                      <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                        <Link
                          to={`/problems/${marker.id}`}
                          className="flex-1 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold text-center transition-all cursor-pointer"
                        >
                          View Details
                        </Link>
                        <Link
                          to="/problems/new"
                          className="py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-[11px] font-medium text-center transition-all cursor-pointer"
                        >
                          Report Nearby
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>

          {/* Floating Map Overlays: Map Urgency Legend */}
          <div className="absolute bottom-4 left-4 z-[1000] glass px-3.5 py-2 rounded-xl border border-emerald-500 shadow-xl flex items-center gap-4 text-xs">
            <span className="font-bold text-white text-[11px]">Urgency:</span>
            {[
              { color: '#ef4444', label: 'Critical 90+' },
              { color: '#f59e0b', label: 'High 70+' },
              { color: '#38bdf8', label: 'Medium 50+' },
              { color: '#34d399', label: 'Resolved' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                <span>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Active Problems Counter Badge */}
          <div className="absolute top-4 right-4 z-[1000] glass px-3.5 py-1.5 rounded-xl border border-emerald-500 shadow-xl text-xs font-bold text-indigo-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span>Showing {filteredProblems.length} Active Hotspots</span>
          </div>
        </motion.div>

        {/* Mapped Problems List Table with 1-Click Pan to Marker */}
        <div className="glass rounded-3xl border border-white/8 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-white/8 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>📍 Mapped Problems & Live Work Orders</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {filteredProblems.length} Result{filteredProblems.length !== 1 ? 's' : ''}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Click any row to fly to the exact coordinates on the map.</p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/problems"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <span>View Full Problems Directory</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
            {filteredProblems.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No civic problems match the selected search or category filters.
              </div>
            ) : (
              filteredProblems.map((p, idx) => {
                const color = URGENCY_COLOR(p.urgency);
                const isSelected = activeProblemId === p.id;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                    onClick={() => handleFocusProblem(p)}
                    className={`flex items-center justify-between gap-4 p-4 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/15 border-l-4 border-indigo-500'
                        : 'hover:bg-white/4'
                    }`}
                  >
                    {/* Score & Icon */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex flex-col items-center justify-center font-bold shrink-0 border"
                        style={{
                          backgroundColor: `${color}15`,
                          borderColor: `${color}35`,
                          color: color,
                        }}
                      >
                        <span className="text-xs font-black">{p.urgency}</span>
                        <span className="text-[8px] uppercase tracking-tighter">AI</span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h4 className="font-bold text-sm text-white truncate max-w-md hover:text-indigo-300 transition-colors">
                            {p.title}
                          </h4>
                          <span className="text-[10px] px-2 py-0.2 rounded bg-white/6 text-slate-300 font-medium">
                            {CATEGORY_ICONS[p.category] || '🏛️'} {p.category}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                          <MapPin size={11} className="text-indigo-400 shrink-0" />
                          <span>{p.location}</span>
                          <span className="text-slate-600">•</span>
                          <span className="text-indigo-300 font-mono text-[11px]">{p.sla}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right Info & Actions */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:flex flex-col text-right text-xs">
                        <span className="text-slate-400 font-medium">{p.municipalBody.split('(')[0]}</span>
                        <span className="text-[10px] text-slate-500">{p.upvotes.toLocaleString()} Citizens Impacted</span>
                      </div>

                      <StatusBadge status={p.status || 'in_progress'} />

                      <Link
                        to={`/problems/${p.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                        title="Open Problem Details"
                      >
                        <ExternalLink size={14} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
