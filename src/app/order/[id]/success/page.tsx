import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="pt-32 pb-24 px-6 min-h-screen flex flex-col items-center justify-center text-center gap-6">
      <CheckCircle size={48} className="text-accent" strokeWidth={1.5} />
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-2">¡Pago confirmado!</p>
        <h1 className="font-heading text-5xl md:text-6xl mb-4">GRACIAS POR TU COMPRA</h1>
        <p className="text-muted max-w-md">
          Recibiste un email con los detalles de tu orden. Te avisamos cuando sea enviada.
        </p>
      </div>
      <div className="flex gap-4">
        <Link
          href="/cuenta"
          className="border border-border hover:border-accent text-xs uppercase tracking-widest text-muted hover:text-accent px-6 py-3 transition-colors"
        >
          Ver mis órdenes
        </Link>
        <Link
          href="/tienda"
          className="bg-accent hover:bg-accent-hover text-bg text-xs uppercase tracking-widest font-semibold px-6 py-3 transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
