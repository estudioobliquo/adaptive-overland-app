export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isMain: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  category: Category;
  images: ProductImage[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface ContentSection {
  id: string;
  key: string;
  title?: string;
  body?: string;
  mediaUrl?: string;
  youtubeUrl?: string;
  extra?: Record<string, unknown>;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer';
}

export interface AuthResponse {
  accessToken: string;
}
