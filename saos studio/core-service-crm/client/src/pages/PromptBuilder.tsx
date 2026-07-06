import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Loader2, Copy, Check, Sparkles, Image, Palette } from 'lucide-react';

const vibes = [
  'Modern, cinematic, bold typography, smooth scroll-triggered 3D transitions, WebGL accents.',
  'Minimal, airy, editorial, lots of whitespace, subtle parallax, refined serif headings.',
  'Dark mode, neon highlights, cyberpunk energy, glitch effects, immersive Three.js scenes.',
  'Warm, organic, earthy tones, soft gradients, hand-drawn textures, friendly motion.',
  'Corporate luxury, gold & deep navy, crisp geometry, premium micro-interactions.'
];

export default function PromptBuilder() {
  const [searchParams] = useSearchParams();
  const preselectId = searchParams.get('businessId');
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | ''>(preselectId ? Number(preselectId) : '');
  const [vibe, setVibe] = useState(vibes[0]);
  const [customVibe, setCustomVibe] = useState('');
  const [extraNotes, setExtraNotes] = useState('');
  const [includeScreenshots, setIncludeScreenshots] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.businesses({ limit: '200' }).then((d: any[]) => setBusinesses(d));
  }, []);

  const build = async () => {
    if (!selectedId) return;
    setLoading(true);
    const data = await api.buildPrompt({
      businessId: selectedId,
      vibe: customVibe || vibe,
      extraNotes,
      includeScreenshots
    });
    setResult(data);
    setLoading(false);
  };

  const copy = () => {
    if (!result?.prompt) return;
    navigator.clipboard.writeText(result.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const selectedBiz = businesses.find(b => b.id === selectedId);

  return (
    <div className="p-8 max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="w-6 h-6 text-saos-400" /> Prompt Builder</h2>
        <p className="text-neutral-400 text-sm mt-1">Generate a structured prompt for Claude / Kimi to rebuild a business website.</p>
      </div>

      <div className="glass rounded-xl p-6 space-y-4">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Select Business</label>
          <select value={selectedId} onChange={e => setSelectedId(Number(e.target.value))}
            className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-saos-500">
            <option value="">Choose a lead…</option>
            {businesses.map(b => <option key={b.id} value={b.id}>{b.name} {b.city ? `(${b.city})` : ''}</option>)}
          </select>
        </div>

        {selectedBiz && (
          <div className="flex flex-wrap gap-3 text-xs text-neutral-400">
            {selectedBiz.website && <span className="bg-white/5 px-2 py-1 rounded">{new URL(selectedBiz.website).hostname}</span>}
            <span className="bg-white/5 px-2 py-1 rounded">Status: {selectedBiz.status}</span>
          </div>
        )}

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Design Vibe</label>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {vibes.map(v => (
              <button key={v} onClick={() => setVibe(v)}
                className={`text-left text-xs p-3 rounded-lg border transition-colors ${vibe === v && !customVibe ? 'border-saos-500 bg-saos-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}>
                {v}
              </button>
            ))}
          </div>
          <textarea value={customVibe} onChange={e => setCustomVibe(e.target.value)} placeholder="Or write your own vibe / art direction…"
            className="mt-2 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-saos-500 h-20" />
        </div>

        <div className="flex items-center gap-2">
          <input id="ss" type="checkbox" checked={includeScreenshots} onChange={e => setIncludeScreenshots(e.target.checked)} className="accent-saos-500" />
          <label htmlFor="ss" className="text-sm text-neutral-300">Include screenshot references in prompt</label>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Extra Notes</label>
          <textarea value={extraNotes} onChange={e => setExtraNotes(e.target.value)} placeholder="Specific sections, competitor refs, tone of voice, CTA emphasis…"
            className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-saos-500 h-24" />
        </div>

        <button onClick={build} disabled={!selectedId || loading}
          className="bg-saos-600 hover:bg-saos-500 disabled:opacity-50 text-black font-semibold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate Prompt
        </button>
      </div>

      {result && (
        <div className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Generated Prompt</h3>
            <button onClick={copy} className="text-xs flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-saos-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {result.meta?.logo && (
            <div className="flex items-center gap-3">
              <Image className="w-4 h-4 text-neutral-400" />
              <img src={result.meta.logo} alt="logo" className="h-10 w-auto object-contain bg-white/5 rounded p-1" />
            </div>
          )}
          {result.meta?.colors?.length > 0 && (
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-neutral-400" />
              {result.meta.colors.map((c: string, i: number) => (
                <span key={i} className="w-6 h-6 rounded-full border border-white/10" style={{ backgroundColor: c }} title={c} />
              ))}
            </div>
          )}

          <pre className="bg-black/40 border border-white/10 rounded-lg p-4 text-xs leading-relaxed overflow-auto max-h-96 whitespace-pre-wrap">
            {result.prompt}
          </pre>
        </div>
      )}
    </div>
  );
}
