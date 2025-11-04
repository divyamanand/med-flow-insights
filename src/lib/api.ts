import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending cookies
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let the app-level routing handle 401s to avoid reload loops
    // Especially important because AuthProvider calls /auth/me on mount,
    // and hard-redirecting here causes infinite refresh on /auth.
    // Simply propagate the error so consumers (ProtectedRoute/AuthContext) can react.
    return Promise.reject(error);
  }
);

export default api;
