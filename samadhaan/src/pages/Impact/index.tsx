import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Building2, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import { MAP_MARKERS, PLATFORM_STATS } from '@/mock';
import { StatusBadge } from '@/components/ui/Badge';
import apiClient from '@/api/client';
import { INDIAN_CITIES, CityHub } from '@/utils/locationIntelligence';

const URGENCY_COLOR = (score: number) =>
  score >= 90 ? '#ef4444' :
  score >= 70 ? '#f59e0b' :
  score >= 50 ? '#38bdf8' : '#34d399';

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

export default function ImpactPage() {
  const [stats, setStats] = useState(PLATFORM_STATS);
  const [markers, setMarkers] = useState(MAP_MARKERS);
  const [selectedCity, setSelectedCity] = useState<CityHub | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState<number>(5);
  const [gpsLoading, setGpsLoading] = useState(false);

  const handleSelectCity = (city: CityHub | null) => {
    setSelectedCity(city);
    if (city) {
      setMapCenter([city.lat, city.lng]);
      setMapZoom(11);
    } else {
      setMapCenter([20.5937, 78.9629]);
      setMapZoom(5);
    }
  };

  const handleGPS = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMapCenter([pos.coords.latitude, pos.coords.longitude]);
        setMapZoom(13);
        setGpsLoading(false);
      },
      () => setGpsLoading(false),
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    // 1. Fetch Overview Stats
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

    // 2. Fetch Live Hotspots / Challenges for map
    apiClient.get('/analytics/hotspots')
      .then((res) => {
        const d = res.data?.data || res.data;
        if (Array.isArray(d) && d.length > 0) {
          setMarkers(d.map((h: any, i: number) => ({
            id: h.id || `m-${i}`,
            lat: h.latitude || (18.5204 + (Math.random() - 0.5) * 5),
            lng: h.longitude || (73.8567 + (Math.random() - 0.5) * 5),
            title: h.name || h.location || 'Civic Infrastructure Hotspot',
            location: h.location || h.city || 'India',
            category: (h.category?.toLowerCase() || 'infrastructure') as any,
            urgency: h.avgSeverity ?? h.urgency ?? 85,
            status: 'in_progress' as any,
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <PageWrapper>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-black text-white">National Impact & Hotspot Tracker</h1>
              <p className="text-slate-500 mt-1">Real-time geospatial intelligence, municipal SLA routing, and civic resolution across India</p>
            </div>
            <button
              onClick={handleGPS}
              disabled={gpsLoading}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Navigation size={13} className={gpsLoading ? 'animate-spin' : ''} />
              {gpsLoading ? 'Locating...' : '📍 My Live GPS View'}
            </button>
          </div>
        </motion.div>

        {/* Dynamic City Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          <button
            onClick={() => handleSelectCity(null)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
              selectedCity === null
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-900/50'
                : 'bg-white/4 text-slate-400 border-white/8 hover:text-white hover:bg-white/8'
            }`}
          >
            🇮🇳 All India (National Overview)
          </button>
          {INDIAN_CITIES.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCity(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all border ${
                selectedCity?.id === c.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-900/50'
                  : 'bg-white/4 text-slate-400 border-white/8 hover:text-white hover:bg-white/8'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Selected City Local Intelligence Banner */}
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 p-4"
          >
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-indigo-400" />
                <h3 className="text-sm font-bold text-white">{selectedCity.name}, {selectedCity.state} Municipal Jurisdiction</h3>
              </div>
              <span className="text-xs text-indigo-300 font-mono">Helpline: {selectedCity.helpline}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/4 p-2.5 rounded-xl border border-white/6">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Local Authority</p>
                <p className="text-indigo-300 font-semibold">{selectedCity.municipalBody}</p>
                <p className="text-[10px] text-slate-400">{selectedCity.nodalOfficer}</p>
              </div>
              <div className="bg-white/4 p-2.5 rounded-xl border border-white/6">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Research Partner</p>
                <p className="text-purple-300 font-semibold">{selectedCity.universities[0].name}</p>
                <p className="text-[10px] text-slate-400">{selectedCity.universities[0].specialization}</p>
              </div>
              <div className="bg-white/4 p-2.5 rounded-xl border border-white/6">
                <p className="text-slate-500 text-[10px] uppercase font-bold">CSR Industry Match</p>
                <p className="text-amber-300 font-semibold">{selectedCity.industryPartners[0].name}</p>
                <p className="text-[10px] text-slate-400">Grant Slab: {selectedCity.industryPartners[0].potentialFunding}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Cities Active',    value: selectedCity ? 1 : stats.citiesActive,          color: '#6366f1' },
            { label: 'State Jurisdiction', value: selectedCity ? selectedCity.state : `${stats.statesActive} States`, color: '#38bdf8' },
            { label: 'Problems Resolved', value: selectedCity ? Math.round(stats.resolvedProblems / 12) : stats.resolvedProblems, color: '#34d399' },
            { label: 'Citizens Benefited', value: selectedCity ? Math.round(stats.peopleImpacted / 8) : stats.peopleImpacted, color: '#fbbf24' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="glass rounded-2xl p-4 border border-white/8 text-center">
              <p className="text-2xl font-black text-white">{typeof s.value === 'number' ? s.value.toLocaleString('en-IN') : s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Map */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl border border-white/8 overflow-hidden mb-6" style={{ height: 480 }}>
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
          >
            <ChangeView center={mapCenter} zoom={mapZoom} />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution=""
            />
            {markers.map((marker) => (
              <CircleMarker
                key={marker.id}
                center={[marker.lat, marker.lng]}
                radius={marker.urgency >= 90 ? 14 : marker.urgency >= 70 ? 10 : 8}
                pathOptions={{
                  color: URGENCY_COLOR(marker.urgency),
                  fillColor: URGENCY_COLOR(marker.urgency),
                  fillOpacity: 0.6,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-xs bg-slate-900 rounded-lg p-3 min-w-48">
                    <p className="font-bold text-white mb-1">{marker.title}</p>
                    <p className="text-slate-400">{marker.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold" style={{ color: URGENCY_COLOR(marker.urgency) }}>
                        AI Score: {marker.urgency}
                      </span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </motion.div>

        {/* Legend */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap items-center gap-6 mb-6 text-xs text-slate-500">
          <p className="font-medium text-slate-400">AI Urgency:</p>
          {[{ color: '#ef4444', label: 'Critical (90+)' }, { color: '#f59e0b', label: 'High (70-89)' }, { color: '#38bdf8', label: 'Medium (50-69)' }, { color: '#34d399', label: 'Low (<50)' }].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
              {l.label}
            </div>
          ))}
        </motion.div>

        {/* Problem list */}
        <div className="glass rounded-2xl border border-white/8 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/6">
            <p className="text-sm font-bold text-white">Mapped Problems</p>
          </div>
          <div className="divide-y divide-white/5">
            {markers.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/3 transition-colors">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0"
                  style={{ backgroundColor: `${URGENCY_COLOR(m.urgency)}18`, color: URGENCY_COLOR(m.urgency) }}>
                  {m.urgency}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{m.title}</p>
                  <p className="text-xs text-slate-500">{m.location}</p>
                </div>
                <StatusBadge status={(m as any).status || 'in_progress'} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
