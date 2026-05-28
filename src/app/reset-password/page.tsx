'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-[#888] text-sm mb-4">Enlace inválido o expirado.</p>
        <Link href="/olvide-mi-contrasena" className="text-xs uppercase tracking-widest text-accent hover:underline">
          Solicitar uno nuevo
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      router.push('/login?reset=1');
    } catch {
      setError('El enlace expiró o es inválido. Solicitá uno nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-xs uppercase tracking-widest text-[#888] block mb-1.5">Nueva contraseña</label>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-white border border-[#e0dcd6] hover:border-[#c0bcb8] focus:border-accent px-4 py-3 text-sm text-[#1a1714] outline-none transition-colors"
        />
      </div>
      <div>
        <label className="text-xs uppercase tracking-widest text-[#888] block mb-1.5">Confirmar contraseña</label>
        <input
          type="password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full bg-white border border-[#e0dcd6] hover:border-[#c0bcb8] focus:border-accent px-4 py-3 text-sm text-[#1a1714] outline-none transition-colors"
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-accent hover:bg-accent-hover disabled:opacity-60 text-[#1a1714] text-xs uppercase tracking-widest font-semibold transition-colors"
      >
        {loading ? 'Guardando...' : 'Cambiar contraseña'}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="pt-24 pb-24 px-6 min-h-screen flex items-center justify-center bg-[#f0ece6]">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Cuenta</p>
          <h1 className="font-heading text-5xl text-[#1a1714]">NUEVA CONTRASEÑA</h1>
        </div>
        <Suspense>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
