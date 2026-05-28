'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { register, getMe } from '@/lib/api';
import Input from '@/components/ui/Input';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const returnTo = searchParams.get('returnTo') ?? '/';

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { accessToken } = await register(form);
      const user = await getMe(accessToken);
      setAuth(user, accessToken);
      router.push(returnTo);
    } catch {
      setError('No se pudo crear la cuenta. El email puede estar en uso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Nueva cuenta</p>
        <h1 className="font-heading text-5xl text-[#1a1714]">REGISTRARSE</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre" required value={form.firstName} onChange={set('firstName')} />
          <Input label="Apellido" required value={form.lastName} onChange={set('lastName')} />
        </div>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={set('email')}
        />
        <Input
          label="Contraseña"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={form.password}
          onChange={set('password')}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-accent hover:bg-accent-hover text-[#1a1714] text-xs uppercase tracking-widest font-semibold transition-colors disabled:opacity-60"
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#888]">
        ¿Ya tenés cuenta?{' '}
        <Link href={`/login?returnTo=${returnTo}`} className="text-[#1a1714] hover:text-accent transition-colors">
          Iniciá sesión
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="pt-24 pb-24 px-6 min-h-screen flex items-center justify-center bg-[#f0ece6]">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
