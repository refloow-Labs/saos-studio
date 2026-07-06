import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Loader2, ExternalLink } from 'lucide-react';

const columns = [
  { key: 'draft', label: 'Draft', color: 'border-neutral-500' },
  { key: 'generating', label: 'Generating', color: 'border-purple-500' },
  { key: 'deployed', label: 'Deployed', color: 'border-pink-500' },
  { key: 'emailed', label: 'Emailed', color: 'border-emerald-500' },
  { key: 'closed', label: 'Closed', color: 'border-neutral-700' }
];

export default function Pipeline() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    api.projects().then((d: any[]) => { setProjects(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const move = async (id: number, status: string) => {
    await api.updateProject(id, { status });
    const d = await api.projects();
    setProjects(d);
  };

  if (loading) return <div className="p-10 text-neutral-500"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div className="p-8 max-w-7xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pipeline</h2>
        <p className="text-neutral-400 text-sm mt-1">Track 3D website rebuild projects from draft to closed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {columns.map(col => (
          <div key={col.key} className="space-y-3">
            <div className={`flex items-center justify-between pb-2 border-b-2 ${col.color}`}>
              <span className="text-xs font-semibold uppercase tracking-wider">{col.label}</span>
              <span className="text-xs text-neutral-500">{projects.filter(p => p.status === col.key).length}</span>
            </div>
            <div className="space-y-2">
              {projects.filter(p => p.status === col.key).map(p => (
                <div key={p.id} className="glass rounded-lg p-3 cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => nav(`/leads/${p.businessId}`)}>
                  <p className="font-medium text-sm">{p.name || `Project #${p.id}`}</p>
                  {p.vercelUrl && <a href={p.vercelUrl} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-saos-400 text-xs hover:underline flex items-center gap-1 mt-1"><ExternalLink className="w-3 h-3" /> Vercel</a>}
                  <div className="flex gap-1 mt-2">
                    {columns.map(c => (
                      <button key={c.key} onClick={(e) => { e.stopPropagation(); move(p.id, c.key); }}
                        className={`w-2 h-2 rounded-full ${p.status === c.key ? 'bg-white' : 'bg-white/20 hover:bg-white/40'}`} title={c.label} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
