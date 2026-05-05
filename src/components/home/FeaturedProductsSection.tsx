'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/shop/ProductCard';
import { fadeUp, stagger, staggerFast, viewportOnce, ease } from '@/lib/motion';

interface FeaturedProductsSectionProps {
  products: Product[];
}

export default function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {
  return (
    <section className="py-24 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex items-end justify-between mb-12"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5, ease }}
              className="text-xs uppercase tracking-[0.3em] text-accent mb-2"
            >
              Destacados
            </motion.p>
            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.6, ease }}
              className="font-heading text-5xl md:text-6xl"
            >
              PRODUCTOS
            </motion.h2>
          </div>
          <motion.div variants={fadeUp} transition={{ duration: 0.5, ease }}>
            <Link
              href="/tienda"
              className="hidden md:inline-block text-xs uppercase tracking-widest text-muted hover:text-accent transition-colors border-b border-muted/30 hover:border-accent pb-0.5"
            >
              Ver tienda completa
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={fadeUp}
              transition={{ duration: 0.5, ease }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-10 text-center md:hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/tienda"
            className="inline-block border border-border hover:border-accent text-xs uppercase tracking-widest text-muted hover:text-accent px-8 py-3 transition-colors"
          >
            Ver tienda completa
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
