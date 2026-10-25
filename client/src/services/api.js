
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function getItems({ search = '', type = 'all' } = {}) {
  const params = new URLSearchParams();

  if (search.trim()) params.set('search', search.trim());
  if (type !== 'all') params.set('type', type);

  const response = await fetch(`${API_URL}/items?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Could not load items. Please try again.');
  }

  return response.json();
}

export async function createItem(item) {
  const response = await fetch(`${API_URL}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Could not submit your report.');
  }

  return data;
}
