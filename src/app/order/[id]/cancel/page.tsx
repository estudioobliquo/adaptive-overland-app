import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function OrderCancelPage() {
  return (
    <div className="pt-32 pb-24 px-6 min-h-screen flex flex-col items-center justify-center text-center gap-6 bg-[#f0ece6]">
      <XCircle size={48} className="text-[#888]" strokeWidth={1.5} />
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#888] mb-2">Pago cancelado</p>
        <h1 className="font-heading text-5xl md:text-6xl mb-4 text-[#1a1714]">ORDEN CANCELADA</h1>
        <p className="text-[#888] max-w-md">
          El pago no fue completado. Tu carrito sigue disponible si querés intentarlo de nuevo.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/carrito"
          className="border border-[#e0dcd6] hover:border-accent text-xs uppercase tracking-widest text-[#888] hover:text-accent px-6 py-3 transition-colors"
        >
          Volver al carrito
        </Link>
        <Link
          href="/tienda"
          className="bg-accent hover:bg-accent-hover text-[#1a1714] text-xs uppercase tracking-widest font-semibold px-6 py-3 transition-colors"
        >
          Ver tienda
        </Link>
      </div>
    </div>
  );
}
