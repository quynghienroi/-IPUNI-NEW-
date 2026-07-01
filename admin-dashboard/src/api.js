import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

const KEY_STORAGE = 'ipuni_admin_key';

export function getKey() {
  return localStorage.getItem(KEY_STORAGE) || '';
}

export function setKey(key) {
  localStorage.setItem(KEY_STORAGE, key);
}

export function clearKey() {
  localStorage.removeItem(KEY_STORAGE);
}

function client() {
  return axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
    headers: { 'X-Admin-Key': getKey() },
  });
}

export const adminApi = {
  baseUrl: BASE_URL,

  // Dùng để kiểm tra key có đúng không (trả về overview nếu đúng)
  async overview() {
    const { data } = await client().get('/analytics/overview');
    return data.data;
  },
  async charts(days = 14) {
    const { data } = await client().get('/analytics/charts', { params: { days } });
    return data.data;
  },
  async recent() {
    const { data } = await client().get('/analytics/recent');
    return data.data;
  },
  async health() {
    const { data } = await client().get('/analytics/health');
    return data.data;
  },
  async exportSheets(days = 14) {
    const { data } = await client().post('/analytics/export-sheets', null, { params: { days } });
    return data;
  },
};
