'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ShoppingCart, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { getProduct } from '@/lib/api';
import { useCartStore } from '@/store/cart';

export default function ProductDetail({ slug }: { slug: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProduct(slug),
  });

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="pt-32 pb-24 px-6 min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="font-heading text-4xl">PRODUCTO NO ENCONTRADO</p>
        <Link href="/tienda" className="text-sm text-muted hover:text-accent transition-colors">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  const mainImage = product.images?.find((i) => i.isMain) ?? product.images?.[0];
  const otherImages = product.images?.filter((i) => !i.isMain) ?? [];

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-24 pb-24 px-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-text transition-colors mb-10"
        >
          <ChevronLeft size={14} /> Tienda
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col gap-3">
            <div className="aspect-square bg-surface overflow-hidden">
              {mainImage ? (
                <img src={mainImage.url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted text-sm">Sin imagen</div>
              )}
            </div>
            {otherImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {otherImages.map((img) => (
                  <div key={img.id} className="aspect-square bg-surface overflow-hidden">
                    <img src={img.url} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted mb-2">{product.category?.name}</p>
              <h1 className="font-heading text-5xl md:text-6xl leading-none mb-4">{product.name.toUpperCase()}</h1>
              <p className="text-2xl text-accent font-semibold">{Number(product.price).toLocaleString('es-PY')} PYG</p>
            </div>

            <p className="text-muted leading-relaxed">{product.description}</p>

            {product.stock > 0 ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-muted hover:text-text transition-colors">−</button>
                    <span className="px-4 py-2 text-sm min-w-[3rem] text-center">{quantity}</span>
                    <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="px-3 py-2 text-muted hover:text-text transition-colors">+</button>
                  </div>
                  <span className="text-xs text-muted">{product.stock} disponibles</span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-accent hover:bg-accent-hover text-bg text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  <ShoppingCart size={16} />
                  {added ? 'Agregado' : 'Agregar al carrito'}
                </button>
              </>
            ) : (
              <p className="text-sm uppercase tracking-widest text-muted border border-border px-6 py-4 text-center">Sin stock</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
