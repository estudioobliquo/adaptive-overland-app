'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { ShoppingCart, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getProduct } from '@/lib/api';
import { useCartStore } from '@/store/cart';
import type { ProductImage } from '@/lib/types';
import { fadeUp, stagger, ease } from '@/lib/motion';

export default function ProductDetail({ slug }: { slug: string }) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProduct(slug),
  });

  useEffect(() => {
    if (!product?.images?.length) {
      setSelectedImage(null);
      return;
    }
    const main = product.images.find((i) => i.isMain) ?? product.images[0];
    setSelectedImage(main);
  }, [product]);

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

  const images = product.images ?? [];

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-24 pb-24 px-6 min-h-screen bg-[#f0ece6]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#888] hover:text-[#1a1714] transition-colors mb-10"
          >
            <ChevronLeft size={14} /> Tienda
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="flex flex-col gap-3" variants={fadeUp} transition={{ duration: 0.6, ease }}>
            <div className="aspect-square bg-[#f0ece6] overflow-hidden flex items-center justify-center p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {selectedImage ? (
                  <motion.img
                    key={selectedImage.id}
                    src={selectedImage.url}
                    alt={product.name}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease }}
                  />
                ) : (
                  <motion.div
                    key="empty"
                    className="w-full h-full flex items-center justify-center text-[#888] text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Sin imagen
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {images.length > 1 && (
              <motion.div
                className="grid grid-cols-3 gap-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease }}
              >
                {images.map((img, index) => (
                  <motion.button
                    key={img.id}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 + index * 0.06, ease }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`aspect-square bg-[#f0ece6] overflow-hidden flex items-center justify-center p-2 transition-shadow ${
                      selectedImage?.id === img.id ? 'ring-2 ring-accent ring-offset-2 ring-offset-[#f0ece6]' : 'hover:ring-1 hover:ring-[#c0bcb8]'
                    }`}
                    aria-label={`Ver imagen ${img.isMain ? 'principal' : 'del producto'}`}
                  >
                    <img
                      src={img.url}
                      alt={product.name}
                      className="max-w-full max-h-full w-auto h-auto object-contain"
                    />
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.div className="flex flex-col gap-6" variants={fadeUp} transition={{ duration: 0.6, delay: 0.1, ease }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease }}
            >
              <p className="text-xs uppercase tracking-widest text-[#888] mb-2">{product.category?.name}</p>
              <h1 className="font-heading text-5xl md:text-6xl leading-none mb-4 text-[#1a1714]">{product.name.toUpperCase()}</h1>
              <p className="text-2xl text-accent font-semibold">{Number(product.price).toLocaleString('es-PY')} PYG</p>
            </motion.div>

            <motion.p
              className="text-[#6b6763] leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease }}
            >
              {product.description}
            </motion.p>

            {product.stock > 0 ? (
              <motion.div
                className="flex flex-col gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#e0dcd6]">
                    <motion.button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-2 text-[#888] hover:text-[#1a1714] transition-colors"
                      whileTap={{ scale: 0.9 }}
                    >
                      −
                    </motion.button>
                    <span className="px-4 py-2 text-sm min-w-[3rem] text-center text-[#1a1714]">{quantity}</span>
                    <motion.button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="px-3 py-2 text-[#888] hover:text-[#1a1714] transition-colors"
                      whileTap={{ scale: 0.9 }}
                    >
                      +
                    </motion.button>
                  </div>
                  <span className="text-xs text-[#888]">{product.stock} disponibles</span>
                </div>
                <motion.button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-3 w-full py-4 bg-accent hover:bg-accent-hover text-[#1a1714] text-xs uppercase tracking-widest font-semibold transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  animate={added ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ShoppingCart size={16} />
                  {added ? 'Agregado' : 'Agregar al carrito'}
                </motion.button>
              </motion.div>
            ) : (
              <motion.p
                className="text-sm uppercase tracking-widest text-[#888] border border-[#e0dcd6] px-6 py-4 text-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35, ease }}
              >
                Sin stock
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
