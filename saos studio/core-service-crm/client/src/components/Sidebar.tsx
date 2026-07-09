import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, LayoutTemplate, Lightbulb, Settings, Zap, UserCircle
} from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/sotiris', label: 'ΣΩΤΗΡΗΣ', icon: UserCircle },
  { to: '/pipeline', label: 'Pipeline', icon: LayoutTemplate },
  { to: '/prompts', label: 'Prompt Builder', icon: Lightbulb },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen sticky top-0 border-r border-white/10 bg-neutral-900/50 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-saos-500 flex items-center justify-center">
          <Zap className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-wide">CORE SERVICE</h1>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider">CRM & Scraper</p>
        </div>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-white/10 text-saos-400' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <l.icon className="w-4 h-4" />
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="text-[10px] text-neutral-500">v1.0.0 — SAOS Studio</div>
      </div>
    </aside>
  );
}
