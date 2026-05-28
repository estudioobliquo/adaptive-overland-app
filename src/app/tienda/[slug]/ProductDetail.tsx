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
      <div className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center bg-[#f0ece6]">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="pt-32 pb-24 px-6 min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f0ece6]">
        <p className="font-heading text-4xl text-[#1a1714]">PRODUCTO NO ENCONTRADO</p>
        <Link href="/tienda" className="text-sm text-[#888] hover:text-accent transition-colors">
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
    <div className="pt-24 pb-24 px-6 min-h-screen bg-[#f0ece6]">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#888] hover:text-[#1a1714] transition-colors mb-10"
        >
          <ChevronLeft size={14} /> Tienda
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col gap-3">
            <div className="aspect-square bg-[#e8e4de] overflow-hidden">
              {mainImage ? (
                <img src={mainImage.url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#888] text-sm">Sin imagen</div>
              )}
            </div>
            {otherImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {otherImages.map((img) => (
                  <div key={img.id} className="aspect-square bg-[#e8e4de] overflow-hidden">
                    <img src={img.url} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#888] mb-2">{product.category?.name}</p>
              <h1 className="font-heading text-5xl md:text-6xl leading-none mb-4 text-[#1a1714]">{product.name.toUpperCase()}</h1>
              <p className="text-2xl text-accent font-semibold">{Number(product.price).toLocaleString('es-PY')} PYG</p>
            </div>

            <p className="text-[#6b6763] leading-relaxed">{product.description}</p>

            {product.stock > 0 ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#e0dcd6]">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-[#888] hover:text-[#1a1714] transition-colors">−</button>
                    <span className="px-4 py-2 text-sm min-w-[3rem] text-center text-[#1a1714]">{quantity}</span>
                    <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="px-3 py-2 text-[#888] hover:text-[#1a1714] transition-colors">+</button>
                  </div>
                  <span className="text-xs text-[#888]">{product.stock} disponibles</span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-accent hover:bg-accent-hover text-[#1a1714] text-xs uppercase tracking-widest font-semibold transition-colors"
                >
                  <ShoppingCart size={16} />
                  {added ? 'Agregado' : 'Agregar al carrito'}
                </button>
              </>
            ) : (
              <p className="text-sm uppercase tracking-widest text-[#888] border border-[#e0dcd6] px-6 py-4 text-center">Sin stock</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
