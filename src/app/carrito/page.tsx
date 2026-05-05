'use client';

import Link from 'next/link';
import { Trash2, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/store/cart';

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 px-6 min-h-screen flex flex-col items-center justify-center gap-6 text-center">
        <p className="font-heading text-5xl">TU CARRITO ESTÁ VACÍO</p>
        <p className="text-muted">Explorá la tienda y encontrá tu próximo accesorio.</p>
        <Link
          href="/tienda"
          className="inline-block border border-border hover:border-accent text-xs uppercase tracking-widest text-muted hover:text-accent px-8 py-3 transition-colors"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 px-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-heading text-6xl mb-12">CARRITO</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-px">
            {items.map(({ product, quantity }) => {
              const mainImage = product.images?.find((i) => i.isMain) ?? product.images?.[0];
              return (
                <div key={product.id} className="flex gap-4 bg-surface p-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-bg overflow-hidden">
                    {mainImage ? (
                      <img src={mainImage.url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-border" />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <p className="font-heading text-lg leading-tight">{product.name.toUpperCase()}</p>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-muted hover:text-text transition-colors p-1"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-muted hover:text-text transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-sm">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2 py-1 text-muted hover:text-text transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-accent text-sm font-semibold">
                        {(Number(product.price) * quantity).toLocaleString('es-PY')} PYG
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-surface p-6 h-fit">
            <p className="text-xs uppercase tracking-widest text-muted mb-6">Resumen</p>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span>{total().toLocaleString('es-PY')} PYG</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Envío</span>
                <span className="text-muted">A calcular</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-accent">{total().toLocaleString('es-PY')} PYG</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full py-3 bg-accent hover:bg-accent-hover text-bg text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Continuar <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
