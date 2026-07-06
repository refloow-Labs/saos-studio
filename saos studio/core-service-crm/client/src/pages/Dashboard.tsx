import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { TrendingUp, Users, Rocket, Mail, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.stats().then(d => { setStats(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-neutral-500">Loading dashboard…</div>;

  const statusMap: Record<string, number> = {};
  stats?.statusCounts?.forEach((s: any) => statusMap[s.status] = s.count);
  const totalLeads = Object.values(statusMap).reduce((a: number, b: number) => a + b, 0) as number;

  const cards = [
    { label: 'Total Leads', value: totalLeads, icon: Users, color: 'text-blue-400' },
    { label: 'Hot Leads', value: statusMap['hot'] || 0, icon: TrendingUp, color: 'text-orange-400' },
    { label: 'Projects', value: stats?.projectsTotal || 0, icon: Rocket, color: 'text-saos-400' },
    { label: 'Emailed', value: statusMap['emailed'] || 0, icon: Mail, color: 'text-purple-400' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-neutral-400 text-sm mt-1">Overview of your 3D website rebuild pipeline.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="glass rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-xs uppercase tracking-wider">{c.label}</p>
                <p className="text-2xl font-bold mt-1">{c.value}</p>
              </div>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <h3 className="font-semibold mb-4">Pipeline Status</h3>
          <div className="space-y-3">
            {['new', 'warm', 'hot', 'scraped', 'generating', 'deployed', 'emailed', 'closed'].map(status => {
              const count = statusMap[status] || 0;
              const pct = totalLeads ? (count / totalLeads) * 100 : 0;
              return (
                <div key={status} className="flex items-center gap-3">
                  <span className="w-20 text-xs capitalize text-neutral-400">{status}</span>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-saos-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-xs text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-saos-400" /> Recent Activity</h3>
          <div className="space-y-4 max-h-80 overflow-auto pr-2">
            {stats?.recent?.length ? stats.recent.map((a: any) => (
              <div key={a.id} className="text-sm border-l-2 border-white/10 pl-3">
                <p className="text-neutral-300">{a.message}</p>
                <p className="text-neutral-500 text-xs mt-0.5">{new Date(a.createdAt).toLocaleString()}</p>
              </div>
            )) : <p className="text-neutral-500 text-sm">No activity yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
