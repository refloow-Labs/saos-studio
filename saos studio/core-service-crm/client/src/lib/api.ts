const API = '/api';

export async function fetchJSON(path: string, opts?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts?.headers || {}) },
    ...opts
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  stats: () => fetchJSON('/stats'),
  businesses: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchJSON(`/businesses${q}`);
  },
  business: (id: number) => fetchJSON(`/businesses/${id}`),
  createBusiness: (data: any) => fetchJSON('/businesses', { method: 'POST', body: JSON.stringify(data) }),
  updateBusiness: (id: number, data: any) => fetchJSON(`/businesses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  importGMaps: (query: string) => fetchJSON('/import/gmaps', { method: 'POST', body: JSON.stringify({ query }) }),
  scrape: (id: number) => fetchJSON(`/businesses/${id}/scrape`, { method: 'POST' }),
  assets: (id: number, type?: string) => fetchJSON(`/businesses/${id}/assets${type ? `?type=${type}` : ''}`),
  projects: (businessId?: number) => fetchJSON(`/projects${businessId ? `?businessId=${businessId}` : ''}`),
  createProject: (data: any) => fetchJSON('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: number, data: any) => fetchJSON(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  buildPrompt: (data: any) => fetchJSON('/prompt/build', { method: 'POST', body: JSON.stringify(data) }),
  activities: (limit?: number) => fetchJSON(`/activities${limit ? `?limit=${limit}` : ''}`)
};
