import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import {
  ArrowLeft, Globe, MapPin, Phone, Mail, Star, Loader2,
  RefreshCw, ExternalLink, Palette, Image, FileText, Sparkles
} from 'lucide-react';

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [lead, setLead] = useState<any>(null);
  const [scraping, setScraping] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!id) return;
    const data = await api.businesses(Number(id));
    setLead(data);
  };

  useEffect(() => { load(); }, [id]);

  const handleScrape = async () => {
    if (!id) return;
    setScraping(true);
    try {
      await api.scrape(Number(id));
      await load();
    } catch (e: any) { alert('Scrape failed: ' + e.message); }
    finally { setScraping(false); }
  };

  const updateStatus = async (status: string) => {
    setSaving(true);
    await api.updateBusiness(Number(id), { status });
    await load();
    setSaving(false);
  };

  if (!lead) return <div className="p-10 text-neutral-500"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  const logos = lead.assets?.filter((a: any) => a.type === 'logo') || [];
  const screenshots = lead.assets?.filter((a: any) => a.type === 'screenshot') || [];
  const colors = lead.assets?.filter((a: any) => a.type === 'color') || [];
  const meta = lead.assets?.filter((a: any) => a.type === 'meta') || [];
  const title = meta.find((m: any) => m.label === 'Title')?.data || '';
  const description = meta.find((m: any) => m.label === 'Description')?.data || '';

  return (
    <div className="p-8 max-w-6xl space-y-6">
      <button onClick={() => nav('/leads')} className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Leads
      </button>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{lead.name}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-neutral-400">
            {lead.category && <span className="bg-white/5 px-2 py-0.5 rounded text-xs">{lead.category}</span>}
            {lead.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {lead.city}</span>}
            {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {lead.phone}</span>}
            {lead.email && <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {lead.email}</span>}
            {lead.website && <a href={lead.website} target="_blank" rel="noreferrer" className="text-saos-400 hover:underline flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Website <ExternalLink className="w-3 h-3" /></a>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-bold">{lead.score}</span>
          </div>
          <select value={lead.status} onChange={e => updateStatus(e.target.value)} disabled={saving}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-saos-500">
            {['new','warm','hot','scraped','generating','deployed','emailed','closed'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={handleScrape} disabled={scraping || !lead.website}
            className="bg-saos-600 hover:bg-saos-500 disabled:opacity-50 text-black font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
            {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Scrape Assets
          </button>
          <button onClick={() => nav(`/prompts?businessId=${lead.id}`)}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Sparkles className="w-4 h-4" /> Prompt
          </button>
        </div>
      </div>

      {meta.length > 0 && (
        <div className="glass rounded-xl p-5 space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2"><FileText className="w-4 h-4 text-saos-400" /> Scraped Meta</h3>
          {title && <p className="text-sm text-neutral-300"><span className="text-neutral-500">Title:</span> {title}</p>}
          {description && <p className="text-sm text-neutral-300"><span className="text-neutral-500">Description:</span> {description}</p>}
        </div>
      )}

      {colors.length > 0 && (
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3"><Palette className="w-4 h-4 text-saos-400" /> Brand Colors</h3>
          <div className="flex flex-wrap gap-3">
            {colors.map((c: any, i: number) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                <span className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: c.data }} />
                <span className="text-xs font-mono text-neutral-300">{c.data}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {logos.length > 0 && (
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3"><Image className="w-4 h-4 text-saos-400" /> Logos</h3>
          <div className="flex flex-wrap gap-4">
            {logos.map((l: any, i: number) => (
              <div key={i} className="bg-white/5 rounded-lg p-3">
                <img src={l.url} alt="logo" className="h-16 w-auto object-contain" />
                <p className="text-[10px] text-neutral-500 mt-1 truncate max-w-[200px]">{l.url}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {screenshots.length > 0 && (
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-3"><Image className="w-4 h-4 text-saos-400" /> Screenshots</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {screenshots.map((s: any, i: number) => (
              <div key={i}>
                <p className="text-xs text-neutral-500 mb-1">{s.label}</p>
                <img src={s.url} alt={s.label} className="rounded-lg border border-white/10 w-full" />
              </div>
            ))}
          </div>
        </div>
      )}

      {!lead.assets?.length && lead.website && (
        <div className="text-center py-12 text-neutral-500">
          <p>No assets scraped yet.</p>
          <button onClick={handleScrape} className="mt-3 text-saos-400 hover:underline text-sm">Scrape now</button>
        </div>
      )}
    </div>
  );
}
