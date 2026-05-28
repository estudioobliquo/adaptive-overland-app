'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
    } finally {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-24 px-6 min-h-screen flex items-center justify-center bg-[#f0ece6]">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Cuenta</p>
          <h1 className="font-heading text-5xl text-[#1a1714]">RECUPERAR CONTRASEÑA</h1>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-[#888] leading-relaxed">
              Si existe una cuenta con ese email, recibiste un enlace para restablecer tu contraseña. Revisá tu bandeja de entrada.
            </p>
            <Link
              href="/login"
              className="inline-block text-xs uppercase tracking-widest text-accent hover:underline mt-4"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-[#888] text-center mb-6">
              Ingresá tu email y te enviamos un enlace para restablecer tu contraseña.
            </p>
            <div>
              <label className="text-xs uppercase tracking-widest text-[#888] block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#e0dcd6] hover:border-[#c0bcb8] focus:border-accent px-4 py-3 text-sm text-[#1a1714] outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-accent hover:bg-accent-hover disabled:opacity-60 text-[#1a1714] text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
            <p className="text-center text-sm text-[#888] mt-2">
              <Link href="/login" className="hover:text-accent transition-colors">Volver al login</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
