'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp, stagger, ease } from '@/lib/motion';

interface HeroSectionProps {
  title?: string;
  mediaUrl?: string;
}

export default function HeroSection({ title, mediaUrl }: HeroSectionProps) {
  const headline = title ?? 'La aventura no tiene límites.';

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease }}
      >
        {mediaUrl ? (
          <img src={mediaUrl} alt="Hero" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
      </motion.div>

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl"
        variants={stagger}
        initial="hidden"
        animate="visible"
        transition={{ delayChildren: 0.4 }}
      >
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease }}
          className="text-xs uppercase tracking-[0.3em] text-accent mb-4"
        >
          Adaptive Overland
        </motion.p>

        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.8, ease }}
          className="font-heading text-6xl md:text-8xl lg:text-9xl leading-none text-text mb-6"
        >
          {headline.toUpperCase()}
        </motion.h1>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease }}
        >
          <Link
            href="/tienda"
            className="inline-block border border-text/40 hover:border-accent hover:text-accent text-text text-xs uppercase tracking-[0.2em] px-8 py-3 transition-colors"
          >
            Ver Tienda
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <div className="w-px h-12 bg-muted/40 animate-pulse" />
      </motion.div>
    </section>
  );
}
