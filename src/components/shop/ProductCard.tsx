'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCartStore } from '@/store/cart';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const mainImage = product.images?.find((i) => i.isMain) ?? product.images?.[0];

  return (
    <motion.article
      className="group flex flex-col bg-white border border-[#e0dcd6] hover:border-[#c0bcb8] transition-colors"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/tienda/${product.slug}`} className="block overflow-hidden aspect-square bg-[#e8e4de] p-4">
        {mainImage ? (
          <motion.img
            src={mainImage.url}
            alt={product.name}
            className="w-full h-full object-contain"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#888] text-xs uppercase tracking-widest">
            Sin imagen
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-[#888] mb-1">
            {product.category?.name}
          </p>
          <Link href={`/tienda/${product.slug}`} className="font-heading text-xl text-[#1a1714] hover:text-accent transition-colors">
            {product.name.toUpperCase()}
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-accent font-semibold">
            {Number(product.price).toLocaleString('es-PY')} PYG
          </span>

          <motion.button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="p-2 border border-[#e0dcd6] hover:border-accent hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            whileTap={{ scale: 0.9 }}
            aria-label="Agregar al carrito"
          >
            <ShoppingCart size={16} />
          </motion.button>
        </div>

        {product.stock === 0 && (
          <p className="text-xs text-[#888] uppercase tracking-widest">Sin stock</p>
        )}
      </div>
    </motion.article>
  );
}
