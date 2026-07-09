import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Search, MapPin, Globe, Star, Loader2, UserCircle } from 'lucide-react';

export default function Sotiris() {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [nomosFilter, setNomosFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  const load = async () => {
    setLoading(true);
    const params: Record<string, string> = { assignedTo: 'ΣΩΤΗΡΗΣ' };
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    if (nomosFilter) params.nomos = nomosFilter;
    const data = await api.businesses(params);
    setLeads(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [statusFilter, nomosFilter]);

  const doSearch = (e: React.FormEvent) => { e.preventDefault(); load(); };

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500/20 text-blue-400',
    warm: 'bg-yellow-500/20 text-yellow-400',
    hot: 'bg-orange-500/20 text-orange-400',
    cold: 'bg-neutral-500/20 text-neutral-400',
    scraped: 'bg-saos-500/20 text-saos-400',
    generating: 'bg-purple-500/20 text-purple-400',
    deployed: 'bg-pink-500/20 text-pink-400',
    emailed: 'bg-emerald-500/20 text-emerald-400',
    closed: 'bg-neutral-700 text-neutral-300'
  };

  // Get unique nomos values for the filter
  const uniqueNomos = Array.from(new Set(leads.map(l => l.nomos).filter(Boolean)));

  return (
    <div className="p-8 max-w-7xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-saos-400" />
            <div>
              <h2 className="text-2xl font-bold">ΣΩΤΗΡΗΣ - Leads</h2>
              <p className="text-neutral-400 text-sm mt-1">Leads assigned to ΣΩΤΗΡΗΣ</p>
            </div>
          </div>
        </div>
        <div className="text-sm text-neutral-400">
          Total: <span className="text-white font-semibold">{leads.length}</span>
        </div>
      </div>

      <div className="glass rounded-xl p-4 flex flex-col md:flex-row gap-3">
        <form onSubmit={doSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, website, city…"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-saos-500" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-saos-500">
            <option value="">All Statuses</option>
            <option value="new">New</option>
            <option value="warm">Warm</option>
            <option value="hot">Hot</option>
            <option value="scraped">Scraped</option>
            <option value="deployed">Deployed</option>
            <option value="emailed">Emailed</option>
          </select>
          <select value={nomosFilter} onChange={e => setNomosFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-saos-500">
            <option value="">All Νομοί</option>
            {uniqueNomos.map(nomos => (
              <option key={nomos} value={nomos}>{nomos}</option>
            ))}
          </select>
          <button type="submit" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Search</button>
        </form>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400 text-left">
              <th className="px-5 py-3 font-medium">Business</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">Νομός</th>
              <th className="px-5 py-3 font-medium">Website</th>
              <th className="px-5 py-3 font-medium">Score</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-neutral-500"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-neutral-500">No leads assigned to ΣΩΤΗΡΗΣ yet.</td></tr>
            ) : leads.map(l => (
              <tr key={l.id} onClick={() => nav(`/leads/${l.id}`)} className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors">
                <td className="px-5 py-3">
                  <div className="font-medium">{l.name}</div>
                  <div className="text-neutral-500 text-xs">{l.category}</div>
                </td>
                <td className="px-5 py-3 text-neutral-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {l.city || '-'}</td>
                <td className="px-5 py-3 text-neutral-400">{l.nomos || '-'}</td>
                <td className="px-5 py-3">
                  {l.website ? <a href={l.website} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-saos-400 hover:underline flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {new URL(l.website).hostname}</a> : <span className="text-neutral-600">—</span>}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-500" />
                    <span className={l.score >= 15 ? 'text-orange-400 font-semibold' : ''}>{l.score}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[l.status] || 'bg-neutral-500/20 text-neutral-400'}`}>
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
