import axios from 'axios';
import type { Product, Category, ContentSection, Order, AuthResponse, User } from './types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ao_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products
export const getProducts = (params?: { category?: string; featured?: boolean }) =>
  api.get<Product[]>('/products', { params }).then((r) => r.data);

export const getProduct = (slug: string) =>
  api.get<Product>(`/products/${slug}`).then((r) => r.data);

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

export const getMe = () =>
  api.get<User>('/users/me').then((r) => r.data);

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

export default api;
