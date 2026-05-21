'use client';

import { useQuery } from '@tanstack/react-query';
import { getAdminOrders, getProducts } from '@/lib/api';
import { ShoppingBag, Package, TrendingUp, Clock } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminDashboard() {
  const { data: orders = [] } = useQuery({ queryKey: ['admin-orders'], queryFn: getAdminOrders, retry: false });
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: () => getProducts(), retry: false });

  const revenue = orders
    .filter((o) => ['paid', 'processing', 'shipped', 'delivered'].includes(o.status))
    .reduce((sum, o) => sum + Number(o.total), 0);

  const pending = orders.filter((o) => o.status === 'pending').length;
  const recent = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const statusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-5 mb-10">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Ingresos</p>
            <TrendingUp size={16} className="text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{revenue.toLocaleString('es-PY')}</p>
          <p className="text-xs text-gray-400 mt-1">PYG confirmados</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Total órdenes</p>
            <ShoppingBag size={16} className="text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          <p className="text-xs text-gray-400 mt-1">desde el inicio</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Pendientes</p>
            <Clock size={16} className="text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-yellow-600">{pending}</p>
          <p className="text-xs text-gray-400 mt-1">requieren atención</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400">Productos</p>
            <Package size={16} className="text-gray-300" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
          <p className="text-xs text-gray-400 mt-1">en catálogo</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Órdenes recientes</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {recent.length === 0 ? (
              <p className="px-6 py-8 text-sm text-gray-400 text-center">No hay órdenes aún</p>
            ) : recent.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('es-PY', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {Number(order.total).toLocaleString('es-PY')} PYG
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by status */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Por estado</h2>
          </div>
          <div className="px-6 py-4 space-y-3">
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[key]}`}>{label}</span>
                <span className="text-sm font-bold text-gray-900">{statusCounts[key] ?? 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
