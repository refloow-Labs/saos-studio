import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewLead() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', category: '', city: '', address: '', phone: '', email: '', website: '', gmbUrl: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setSaving(true);
    const { id } = await api.createBusiness(form);
    setSaving(false);
    nav(`/leads/${id}`);
  };

  const fields = [
    { k: 'name', l: 'Business Name *', required: true },
    { k: 'category', l: 'Category' },
    { k: 'city', l: 'City' },
    { k: 'address', l: 'Address' },
    { k: 'phone', l: 'Phone' },
    { k: 'email', l: 'Email' },
    { k: 'website', l: 'Website' },
    { k: 'gmbUrl', l: 'Google Maps URL' },
  ];

  return (
    <div className="p-8 max-w-2xl space-y-6">
      <button onClick={() => nav('/leads')} className="flex items-center gap-2 text-neutral-400 hover:text-white text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h2 className="text-2xl font-bold">Add Lead</h2>
      <form onSubmit={submit} className="glass rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.k} className={f.k === 'name' ? 'sm:col-span-2' : ''}>
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{f.l}</label>
              <input value={(form as any)[f.k]} onChange={e => update(f.k, e.target.value)} required={!!f.required}
                className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-saos-500" />
            </div>
          ))}
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Notes</label>
          <textarea value={form.notes} onChange={e => update('notes', e.target.value)}
            className="mt-1 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-saos-500 h-24" />
        </div>
        <button type="submit" disabled={saving}
          className="bg-saos-600 hover:bg-saos-500 disabled:opacity-50 text-black font-semibold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors">
          <Save className="w-4 h-4" /> Save Lead
        </button>
      </form>
    </div>
  );
}
