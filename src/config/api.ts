// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://investable-dashboard-demo.onrender.com';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  
  // Access requests endpoints
  ACCESS_REQUESTS: `${API_BASE_URL}/api/access-requests`,
  ACCESS_REQUEST_BY_ID: (id: string) => `${API_BASE_URL}/api/access-requests/${id}`,
  ACCESS_REQUESTS_BY_INVESTOR: (email: string) => `${API_BASE_URL}/api/access-requests/investor/${email}`,
  MIGRATE_COMPANY_NAMES: `${API_BASE_URL}/api/access-requests/migrate-company-names`,
};

export default API_BASE_URL; 