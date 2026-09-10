import axios from 'axios';

// Base Axios instance — connects to Express backend (port 5000)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1',
  timeout: 45_000,
  headers: {
    'Content-Type': 'application/json',
    'x-dev-user-id': 'arjun.mehta@citizen.in',
    'x-dev-role': 'CITIZEN',
  },
});

// Request interceptor — attach auth token & user headers
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('samadhaan_token');
  const activeRole = localStorage.getItem('samadhaan_role') || 'CITIZEN';
  const userEmail = localStorage.getItem('samadhaan_email') || 'arjun.mehta@citizen.in';

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['x-dev-user-id'] = userEmail;
  config.headers['x-dev-role'] = activeRole.toUpperCase();

  return config;
});

// Response interceptor — normalise errors
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('samadhaan_token');
    }
    return Promise.reject(err);
  }
);

export { apiClient };
export default apiClient;


