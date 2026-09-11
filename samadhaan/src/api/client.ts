import axios from 'axios';

// Base Axios instance — connects to Express backend (port 5000)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api/v1',
  timeout: 45_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach auth token & user headers only when authenticated
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('samadhaan_token');
  const activeRole = localStorage.getItem('samadhaan_role');
  const userEmail = localStorage.getItem('samadhaan_email');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (userEmail) {
    config.headers['x-dev-user-id'] = userEmail;
  }
  if (activeRole) {
    config.headers['x-dev-role'] = activeRole.toUpperCase();
  }

  return config;
});

// Response interceptor — normalise errors
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('samadhaan_token');
      localStorage.removeItem('samadhaan_email');
      localStorage.removeItem('samadhaan_role');
    }
    return Promise.reject(err);
  }
);

export { apiClient };
export default apiClient;


