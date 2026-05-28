'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { getMyOrders } from '@/lib/api';

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  processing: 'En proceso',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const statusColor: Record<string, string> = {
  pending: 'text-yellow-400',
  paid: 'text-green-400',
  processing: 'text-blue-400',
  shipped: 'text-accent',
  delivered: 'text-green-500',
  cancelled: 'text-[#888]',
};

export default function CuentaPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) router.replace('/login?returnTo=/cuenta');
  }, [isAuthenticated, router]);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: getMyOrders,
    enabled: isAuthenticated(),
    retry: false,
  });

  if (!isAuthenticated()) return null;

  return (
    <div className="pt-24 pb-24 px-6 min-h-screen bg-[#f0ece6]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Mi cuenta</p>
            <h1 className="font-heading text-5xl md:text-6xl text-[#1a1714]">
              HOLA, {user?.firstName.toUpperCase()}
            </h1>
          </div>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="text-xs uppercase tracking-widest text-[#888] hover:text-[#1a1714] transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-[#888] mb-6">Mis órdenes</p>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center border border-[#e0dcd6] bg-white">
              <p className="font-heading text-3xl mb-3 text-[#1a1714]">SIN ÓRDENES AÚN</p>
              <p className="text-[#888] text-sm mb-6">Explorá la tienda y hacé tu primera compra.</p>
              <Link
                href="/tienda"
                className="inline-block border border-[#e0dcd6] hover:border-accent text-xs uppercase tracking-widest text-[#888] hover:text-accent px-6 py-3 transition-colors"
              >
                Ver tienda
              </Link>
            </div>
          ) : (
            <div className="space-y-px">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-heading text-xl mb-1 text-[#1a1714]">{order.orderNumber}</p>
                    <p className="text-xs text-[#888]">
                      {new Date(order.createdAt).toLocaleDateString('es-PY', {
                        day: '2-digit', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className={`text-xs uppercase tracking-widest ${statusColor[order.status] ?? 'text-[#888]'}`}>
                      {statusLabel[order.status] ?? order.status}
                    </span>
                    <span className="text-accent font-semibold text-sm">
                      {Number(order.total).toLocaleString('es-PY')} PYG
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
