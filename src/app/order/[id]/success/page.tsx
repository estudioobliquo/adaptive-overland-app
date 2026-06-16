'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export default function OrderSuccessPage() {
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen flex flex-col items-center justify-center text-center gap-6 bg-[#f0ece6]">
      <CheckCircle size={48} className="text-accent" strokeWidth={1.5} />
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">¡Pago confirmado!</p>
        <h1 className="font-heading text-5xl md:text-6xl mb-4 text-[#1a1714]">GRACIAS POR TU COMPRA</h1>
        <p className="text-[#888] max-w-md">
          Recibiste un email con los detalles de tu orden. Te avisamos cuando sea enviada.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/cuenta"
          className="border border-[#e0dcd6] hover:border-accent text-xs uppercase tracking-widest text-[#888] hover:text-accent px-6 py-3 transition-colors"
        >
          Ver mis órdenes
        </Link>
        <Link
          href="/tienda"
          className="bg-accent hover:bg-accent-hover text-[#1a1714] text-xs uppercase tracking-widest font-semibold px-6 py-3 transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
