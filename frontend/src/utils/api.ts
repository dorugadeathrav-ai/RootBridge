export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const getAuthHeaders = () => {
  const token = localStorage.getItem('rootbridge_token') || sessionStorage.getItem('rootbridge_token');
  if (token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
  return { 'Content-Type': 'application/json' };
};
