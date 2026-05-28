'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { login, getMe } from '@/lib/api';
import Input from '@/components/ui/Input';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const returnTo = searchParams.get('returnTo') ?? '/';
  const passwordReset = searchParams.get('reset') === '1';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { accessToken } = await login(form.email, form.password);
      const user = await getMe(accessToken);
      setAuth(user, accessToken);
      router.push(returnTo);
    } catch {
      setError('Email o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Bienvenido</p>
        <h1 className="font-heading text-5xl text-[#1a1714]">INICIAR SESIÓN</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <Input
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        />

        {passwordReset && <p className="text-green-600 text-sm">Contraseña actualizada. Podés iniciar sesión.</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-accent hover:bg-accent-hover text-[#1a1714] text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-60"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-[#888]">
        <Link href="/olvide-mi-contrasena" className="hover:text-accent transition-colors">
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-[#888]">
        ¿No tenés cuenta?{' '}
        <Link href={`/register?returnTo=${returnTo}`} className="text-[#1a1714] hover:text-accent transition-colors">
          Registrate
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="pt-24 pb-24 px-6 min-h-screen flex items-center justify-center bg-[#f0ece6]">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
