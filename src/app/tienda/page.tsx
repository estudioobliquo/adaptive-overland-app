'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getProducts, getCategories } from '@/lib/api';
import type { Product, Category } from '@/lib/types';
import ProductCard from '@/components/shop/ProductCard';
import { fadeUp, stagger, staggerFast, viewportOnce, ease } from '@/lib/motion';

function TiendaContent() {
  const searchParams = useSearchParams();
  const categoria = searchParams.get('categoria') ?? undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getProducts({ category: categoria }).catch(() => []),
      getCategories().catch(() => []),
    ]).then(([p, c]) => {
      setProducts(p as Product[]);
      setCategories(c as Category[]);
      setLoading(false);
    });
  }, [categoria]);

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div className="mb-12" variants={stagger} initial="hidden" animate="visible">
        <motion.p variants={fadeUp} transition={{ duration: 0.5, ease }} className="text-xs uppercase tracking-[0.3em] text-accent mb-2">
          Todos los productos
        </motion.p>
        <motion.h1 variants={fadeUp} transition={{ duration: 0.6, ease }} className="font-heading text-6xl md:text-7xl text-[#1a1714]">
          TIENDA
        </motion.h1>
      </motion.div>

      {categories.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-2 mb-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <a
            href="/tienda"
            className={`text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${
              !categoria ? 'border-accent text-accent' : 'border-[#e0dcd6] text-[#888] hover:border-[#c0bcb8] hover:text-[#1a1714]'
            }`}
          >
            Todos
          </a>
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/tienda?categoria=${cat.slug}`}
              className={`text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${
                categoria === cat.slug ? 'border-accent text-accent' : 'border-[#e0dcd6] text-[#888] hover:border-[#c0bcb8] hover:text-[#1a1714]'
              }`}
            >
              {cat.name}
            </a>
          ))}
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <motion.div className="py-24 text-center text-[#888]" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="font-heading text-3xl text-[#1a1714] mb-2">SIN PRODUCTOS</p>
          <p className="text-sm">Volvé pronto, estamos cargando el catálogo.</p>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={fadeUp} transition={{ duration: 0.4, ease }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default function TiendaPage() {
  return (
    <div className="pt-24 pb-24 px-6 min-h-screen bg-[#f0ece6]">
      <Suspense fallback={
        <div className="flex justify-center py-24">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <TiendaContent />
      </Suspense>
    </div>
  );
}
