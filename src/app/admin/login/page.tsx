'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { login, getMe } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated, user } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated() && user?.role === 'admin') {
      router.replace('/admin');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { accessToken } = await login(form.email, form.password);
      const me = await getMe(accessToken);
      if (me.role !== 'admin') {
        setError('No tenés permisos de administrador.');
        return;
      }
      setAuth(me, accessToken);
      router.replace('/admin');
    } catch {
      setError('Email o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-800 items-end p-12">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-medium mb-3">Adaptive Overland</p>
          <h2 className="text-white text-3xl font-bold leading-tight mb-3">Panel de<br />Administración</h2>
          <p className="text-slate-500 text-sm">Gestión de productos, órdenes y contenido del e-commerce.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <p className="text-slate-400 text-xs uppercase tracking-[0.2em] font-medium mb-2 lg:hidden">Adaptive Overland</p>
            <h1 className="text-white text-2xl font-bold mb-1">Iniciar sesión</h1>
            <p className="text-slate-500 text-sm">Solo usuarios administradores</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-slate-400 text-xs font-medium uppercase tracking-wider block mb-2">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="admin@ejemplo.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-slate-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-slate-400 text-xs font-medium uppercase tracking-wider block mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-slate-500 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-900 font-semibold text-sm rounded-lg transition-colors mt-2"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
