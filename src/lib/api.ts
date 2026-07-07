import axios from 'axios';
import type { Product, Category, ContentSection, Order, AuthResponse, User } from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined' && !config.headers.Authorization) {
    const { useAuthStore } = require('@/store/auth');
    // Fallback to localStorage in case Zustand hasn't rehydrated yet
    const token = useAuthStore.getState().token ?? localStorage.getItem('ao_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/admin') && path !== '/admin/login') {
        const { useAuthStore } = require('@/store/auth');
        useAuthStore.getState().logout();
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  },
);

// Products
export const getProducts = (params?: { category?: string; featured?: boolean }) =>
  api.get<Product[]>('/products', { params }).then((r) => r.data);

export const getProduct = (slug: string) =>
  api.get<Product>(`/products/${slug}`).then((r) => r.data);

// Admin — lista todos los productos, incluidos los inactivos
export const getAdminProducts = () =>
  api.get<Product[]>('/products/admin/all').then((r) => r.data);

// Categories
export const getCategories = () =>
  api.get<Category[]>('/categories').then((r) => r.data);

// Content
export const getContent = () =>
  api.get<ContentSection[]>('/content').then((r) => r.data);

export const getContentSection = (key: string) =>
  api.get<ContentSection>(`/content/${key}`).then((r) => r.data);

// Auth
export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data);

export const register = (data: { email: string; password: string; firstName: string; lastName: string }) =>
  api.post<AuthResponse>('/auth/register', data).then((r) => r.data);

export const getMe = (token?: string) =>
  api.get<User>('/users/me', token ? { headers: { Authorization: `Bearer ${token}` } } : undefined).then((r) => r.data);

// Orders
export const createOrder = (data: {
  items: { productId: string; quantity: number }[];
  shippingAddress: object;
  notes?: string;
}) => api.post<Order>('/orders', data).then((r) => r.data);

export const getMyOrders = () =>
  api.get<Order[]>('/orders/my').then((r) => r.data);

export const getOrder = (id: string) =>
  api.get<Order>(`/orders/${id}`).then((r) => r.data);

// Payments
export const initPayment = (orderId: string) =>
  api.post<{ url: string; processId: string }>(`/payments/bancard/init/${orderId}`).then((r) => r.data);

// Admin — Orders
export const getAdminOrders = () =>
  api.get<Order[]>('/orders').then((r) => r.data);

export const updateOrderStatus = (id: string, status: string) =>
  api.patch<Order>(`/orders/${id}/status`, { status }).then((r) => r.data);

// Admin — Products
export const createProduct = (data: {
  name: string; slug: string; description?: string; price: number;
  stock?: number; brand?: string; sku?: string; isFeatured?: boolean; categoryId: string;
}) => api.post<Product>('/products', data).then((r) => r.data);

export const updateProduct = (id: string, data: Partial<{
  name: string; slug: string; description?: string; price: number;
  stock?: number; brand?: string; sku?: string; isFeatured?: boolean;
  isActive?: boolean; categoryId: string;
}>) => api.patch<Product>(`/products/${id}`, data).then((r) => r.data);

export const deleteProduct = (id: string) =>
  api.delete(`/products/${id}`).then((r) => r.data);

export const uploadProductImage = (id: string, file: File, isMain?: boolean) => {
  const form = new FormData();
  form.append('file', file);
  return api.post<Product>(`/products/${id}/images${isMain ? '?main=true' : ''}`, form).then((r) => r.data);
};

export const deleteProductImage = (productId: string, imageId: string) =>
  api.delete(`/products/${productId}/images/${imageId}`).then((r) => r.data);

// Admin — Categories
export const createCategory = (data: { name: string; slug: string; description?: string; imageUrl?: string }) =>
  api.post<Category>('/categories', data).then((r) => r.data);

export const updateCategory = (id: string, data: Partial<{ name: string; slug: string; description?: string; imageUrl?: string }>) =>
  api.patch<Category>(`/categories/${id}`, data).then((r) => r.data);

// Admin — Users
export const getAdminUsers = () =>
  api.get<User[]>('/users').then((r) => r.data);

// Settings
export const getSettings = () =>
  api.get<Record<string, string>>('/settings').then((r) => r.data);

export const updateSettings = (data: Record<string, string>) =>
  api.patch<Record<string, string>>('/settings', data).then((r) => r.data);

export default api;
