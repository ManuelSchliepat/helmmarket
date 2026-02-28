import { getToken } from './auth';

// Use localhost for local dev if necessary or process.env, but hardcoding since it's a demo
const API_BASE = process.env.HELM_MARKET_API || 'http://localhost:3000/api';

export async function validateToken(token: string) {
  const res = await fetch(`${API_BASE}/cli/validate-token`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Invalid token');
  return res.json();
}

export async function getSkill(slug: string) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/cli/skill?slug=${slug}`, {
    headers: { Authorization: `Bearer ${token || ''}` }
  });
  if (!res.ok) {
    if (res.status === 403) throw new Error('No access');
    if (res.status === 404) throw new Error('Not found');
    throw new Error('API Error');
  }
  return res.json();
}

export async function getMyInstalls() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/cli/my-installs`, {
    headers: { Authorization: `Bearer ${token || ''}` }
  });
  if (!res.ok) throw new Error('API Error');
  return res.json();
}
