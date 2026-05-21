'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tag,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/ordenes', label: 'Órdenes', icon: ShoppingBag },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/categorias', label: 'Categorías', icon: Tag },
  { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;
    if (!isAuthenticated()) {
      router.replace('/admin/login');
    } else if (user && user.role !== 'admin') {
      router.replace('/admin/login');
    }
  }, [user, isAuthenticated, router, isLoginPage]);

  if (isLoginPage) return <>{children}</>;
  if (!user || user.role !== 'admin') return null;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-gray-200">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">Adaptive Overland</p>
          <p className="text-sm font-bold text-gray-900">Panel Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(href, exact)
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-700 truncate mb-0.5">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-gray-400 truncate mb-3">{user.email}</p>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            <LogOut size={13} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
