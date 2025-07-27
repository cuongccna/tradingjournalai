import axios, { AxiosInstance, AxiosError } from 'axios';
import { auth } from './firebase';
import toast from 'react-hot-toast';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const user = auth.currentUser;
        if (user) {
          try {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
          } catch (error) {
            console.error('Error getting auth token:', error);
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error: AxiosError) => {
        const message = (error.response?.data as any)?.error || 'An error occurred';
        
        if (error.response?.status === 401) {
          // Handle unauthorized
          auth.signOut();
          window.location.href = '/login';
        } else if (error.response?.status === 403) {
          toast.error('You do not have permission to perform this action');
        } else if (error.response?.status && error.response.status >= 500) {
          toast.error('Server error. Please try again later.');
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic HTTP methods
  async get(url: string, config?: any) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post(url: string, data?: any, config?: any) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put(url: string, data?: any, config?: any) {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete(url: string, config?: any) {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  // Auth endpoints
  auth = {
    register: (data: any) => this.client.post('/auth/register', data),
    getProfile: () => this.client.get('/user/profile'),
    updateProfile: (data: any) => this.client.patch('/user/profile', data),
  };

  // Trade endpoints
  trades = {
    list: async (params?: any) => {
      const response = await this.client.get('/trades', { params });
      
      // Backend returns {success: true, data: [...], message: '...'}
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      
      // Fallback if different format
      return [];
    },
    create: (data: any) => this.client.post('/trades', data),
    get: (id: string) => this.client.get(`/trades/${id}`),
    update: (id: string, data: any) => this.client.put(`/trades/${id}`, data),
    delete: (id: string) => this.client.delete(`/trades/${id}`),
    stats: (params?: any) => this.client.get('/trades/stats', { params }),
  };

  // Account endpoints
  accounts = {
    list: () => this.client.get('/accounts'),
    create: (data: any) => this.client.post('/accounts', data),
    get: (id: string) => this.client.get(`/accounts/${id}`),
    update: (id: string, data: any) => this.client.put(`/accounts/${id}`, data),
    delete: (id: string) => this.client.delete(`/accounts/${id}`),
    sync: (id: string) => this.client.post(`/accounts/${id}/sync`),
  };

  // Analytics endpoints
  analytics = {
    overview: (params?: any) => this.client.get('/analytics/overview', { params }),
    performance: (params?: any) => this.client.get('/analytics/performance', { params }),
    assets: (params?: any) => this.client.get('/analytics/assets', { params }),
  };
}

export const api = new ApiClient();