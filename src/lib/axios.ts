import axios from 'axios'

// Determine base URL. In production (HTTPS) avoid direct http:// IP to prevent mixed content.
// Use relative /api which Vercel rewrites to the backend.
const raw = import.meta.env.VITE_API_BASE_URL
let baseURL = raw || 'http://13.201.19.12'
if (typeof window !== 'undefined') {
  const isHttps = window.location.protocol === 'https:'
  if (isHttps && baseURL.startsWith('http://')) {
    baseURL = '/api'
  }
}

export const http = axios.create({
  baseURL: baseURL || '/',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

// Example request interceptor (attach auth token if available)
http.interceptors.request.use((config) => {
  // const token = localStorage.getItem('token')
  // if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Basic response error normalization
http.interceptors.response.use(
  (res) => res,
  (error) => {
    const errData = error?.response?.data
    const nested = errData?.error?.message || errData?.message
    const message = nested || error.message || 'Request failed'
    const normalized = new Error(message)
    ;(normalized as any).status = error?.response?.status
    ;(normalized as any).raw = error
    return Promise.reject(normalized)
  },
)

// Small helpers for typed requests
export const api = {
  get: async <T>(url: string, params?: Record<string, unknown>) => {
    const { data } = await http.get<T>(url, { params })
    return data
  },
  post: async <T, B = unknown>(url: string, body?: B) => {
    const { data } = await http.post<T>(url, body)
    return data
  },
  put: async <T, B = unknown>(url: string, body?: B) => {
    const { data } = await http.put<T>(url, body)
    return data
  },
  patch: async <T, B = unknown>(url: string, body?: B) => {
    const { data } = await http.patch<T>(url, body)
    return data
  },
  delete: async <T>(url: string) => {
    const { data } = await http.delete<T>(url)
    return data
  },
}

export default http
