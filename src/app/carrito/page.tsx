'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Trash2, ChevronRight, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useCartStore } from '@/store/cart';
import { getProducts, getSettings } from '@/lib/api';

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const syncProducts = useCartStore((s) => s.syncProducts);

  const { data: freshProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
    enabled: items.length > 0,
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  const shippingCost = settings?.shipping_cost ? Number(settings.shipping_cost) : 0;

  // Sincroniza precio, stock y disponibilidad del carrito con los datos frescos.
  useEffect(() => {
    if (freshProducts) syncProducts(freshProducts);
  }, [freshProducts, syncProducts]);

  const stockWarnings = freshProducts
    ? items.filter(({ product, quantity }) => {
        const fresh = freshProducts.find((p) => p.id === product.id);
        return fresh && quantity > fresh.stock && fresh.stock > 0;
      })
    : [];

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-24 px-6 min-h-screen flex flex-col items-center justify-center gap-6 text-center bg-[#f0ece6]">
        <p className="font-heading text-5xl text-[#1a1714]">TU CARRITO ESTÁ VACÍO</p>
        <p className="text-[#888]">Explorá la tienda y encontrá tu próximo accesorio.</p>
        <Link
          href="/tienda"
          className="inline-block border border-[#e0dcd6] hover:border-accent text-xs uppercase tracking-widest text-[#888] hover:text-accent px-8 py-3 transition-colors"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 px-6 min-h-screen bg-[#f0ece6]">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-heading text-6xl mb-12 text-[#1a1714]">CARRITO</h1>

        {stockWarnings.length > 0 && (
          <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 px-4 py-3 mb-6 text-sm text-yellow-600">
            <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
            <span>Algunos productos tuvieron cambios de stock. Las cantidades fueron ajustadas.</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-px">
            {items.map(({ product, quantity }) => {
              const mainImage = product.images?.find((i) => i.isMain) ?? product.images?.[0];
              const fresh = freshProducts?.find((p) => p.id === product.id);
              const maxStock = fresh?.stock ?? product.stock;
              return (
                <div key={product.id} className="flex gap-4 bg-white p-4">
                  <div className="w-20 h-20 flex-shrink-0 bg-[#f0ece6] overflow-hidden flex items-center justify-center p-1.5">
                    {mainImage ? (
                      <img src={mainImage.url} alt={product.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className="w-full h-full bg-[#e0dcd6]" />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <p className="font-heading text-lg leading-tight text-[#1a1714]">{product.name.toUpperCase()}</p>
                      <button onClick={() => removeItem(product.id)} className="text-[#888] hover:text-[#1a1714] transition-colors p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-[#e0dcd6]">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-[#888] hover:text-[#1a1714] transition-colors text-sm"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-sm text-[#1a1714]">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, Math.min(maxStock, quantity + 1))}
                          disabled={quantity >= maxStock}
                          className="px-2 py-1 text-[#888] hover:text-[#1a1714] disabled:opacity-30 transition-colors text-sm"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-accent text-sm font-semibold">
                        {(Number(product.price) * quantity).toLocaleString('es-PY')} PYG
                      </span>
                    </div>
                    {fresh && fresh.stock <= 3 && fresh.stock > 0 && (
                      <p className="text-xs text-yellow-600">Solo {fresh.stock} en stock</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-white p-6 h-fit border border-[#e0dcd6]">
            <p className="text-xs uppercase tracking-widest text-[#888] mb-6">Resumen</p>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[#888]">Subtotal</span>
                <span className="text-[#1a1714]">{total().toLocaleString('es-PY')} PYG</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#888]">Envío</span>
                <span className="text-[#1a1714]">{shippingCost === 0 ? 'Gratis' : `${shippingCost.toLocaleString('es-PY')} PYG`}</span>
              </div>
              <div className="border-t border-[#e0dcd6] pt-3 flex justify-between font-semibold">
                <span className="text-[#1a1714]">Total</span>
                <span className="text-accent">{(total() + shippingCost).toLocaleString('es-PY')} PYG</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="flex items-center justify-center gap-2 w-full py-3 bg-accent hover:bg-accent-hover text-[#1a1714] text-xs uppercase tracking-widest font-semibold transition-colors"
            >
              Continuar <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
