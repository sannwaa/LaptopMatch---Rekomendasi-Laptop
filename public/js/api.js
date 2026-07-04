const API_URL = '/api';

const api = {
  async get(endpoint) {
    const res = await fetch(`${API_URL}${endpoint}`);
    return res.json();
  },
  async post(endpoint, body, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return res.json();
  },
  async put(endpoint, body, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    return res.json();
  },
  async delete(endpoint, token = null) {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    return res.json();
  },
};
