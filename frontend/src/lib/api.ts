/**
 * API client for backend communication
 */
import axios from 'axios';
import type { User, Dataset, ApiResponse, PaginatedResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ access_token: string; token_type: string }>('/api/auth/login', { email, password }),
  
  register: (data: {
    email: string;
    username: string;
    password: string;
    first_name?: string;
    last_name?: string;
    organization?: string;
  }) => api.post<ApiResponse<User>>('/api/auth/register', data),
  
  logout: () => api.post('/api/auth/logout'),
  
  me: () => api.get<ApiResponse<User>>('/api/auth/me'),
};

// Datasets API
export const datasetsApi = {
  list: (params?: {
    skip?: number;
    limit?: number;
    species?: string;
    data_type?: string;
  }) => api.get<{ total: number; page: number; page_size: number; datasets: Dataset[] }>('/api/datasets', { params }),
  
  get: (id: number) => api.get<ApiResponse<Dataset>>(`/api/datasets/${id}`),
};

// Genome API
export const genomeApi = {
  listSpecies: () => api.get<ApiResponse<{ id: string; name: string }[]>>('/api/genome/species'),
  
  listReferences: (species: string) =>
    api.get<ApiResponse<any[]>>(`/api/genome/${species}/refs`),
  
  listTracks: (species: string) =>
    api.get<ApiResponse<any[]>>(`/api/genome/${species}/tracks`),
};

// Tools API (BLAST)
export const toolsApi = {
  blast: (data: {
    sequence: string;
    database?: string;
    program?: string;
    expect?: number;
    num_results?: number;
  }) => api.post<ApiResponse<any>>('/api/tools/blast', data),
  
  getBlastResult: (jobId: number) =>
    api.get<ApiResponse<any>>(`/api/tools/blast/${jobId}`),
};

// Users API
export const usersApi = {
  list: (params?: { skip?: number; limit?: number }) =>
    api.get<PaginatedResponse<User>>('/api/users', { params }),
  
  get: (id: number) => api.get<ApiResponse<User>>(`/api/users/${id}`),
  
  updateProfile: (data: {
    first_name?: string;
    last_name?: string;
    organization?: string;
  }) => api.put<ApiResponse<User>>('/api/users/me', data),
};

export default api;
