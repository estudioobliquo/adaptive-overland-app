'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/lib/types';
import { fadeUp, stagger, viewportOnce, ease } from '@/lib/motion';
import { useCartStore } from '@/store/cart';

interface FeaturedProductsSectionProps {
  products: Product[];
}

function FeaturedCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const mainImage = product.images?.find((i) => i.isMain) ?? product.images?.[0];

  return (
    <motion.article
      className="group flex flex-col"
      variants={fadeUp}
      transition={{ duration: 0.5, ease }}
    >
      <Link href={`/tienda/${product.slug}`} className="block overflow-hidden aspect-square bg-[#f0ece6] p-4">
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

      <div className="bg-white px-4 py-3">
        <Link href={`/tienda/${product.slug}`} className="font-heading text-xl text-[#1a1714] hover:text-accent transition-colors tracking-wide">
          {product.name.toUpperCase()}
        </Link>
        <p className="text-sm text-[#1a1714] mt-0.5">
          {Number(product.price).toLocaleString('es-PY')} Gs.
        </p>
      </div>
    </motion.article>
  );
}

export default function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  const featured = products.slice(0, 3);

  return (
    <section className="bg-[#f0ece6] py-14 px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.6, ease }}
            className="font-heading text-4xl md:text-5xl text-[#1a1714] leading-none"
          >
            PRODUCTOS DESTACADOS
          </motion.h2>
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="text-xs uppercase tracking-[0.3em] text-[#1a1714] mt-2 font-bold"
          >
            Colección Nómada
          </motion.p>
        </motion.div>

        {/* Grid de 3 */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {featured.map((product) => (
            <FeaturedCard key={product.id} product={product} />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-[#1a1714] text-xs uppercase tracking-[0.15em] px-8 py-3 transition-all duration-200 font-semibold"
          >
            IR A LA TIENDA
            <ShoppingCart size={15} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
