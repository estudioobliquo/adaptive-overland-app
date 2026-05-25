'use client';

import { motion } from 'framer-motion';
import { ease } from '@/lib/motion';

interface HeroSectionProps {
  title?: string;
}

export default function HeroSection({ title }: HeroSectionProps) {
  const headline = title ?? 'La aventura no tiene límites';

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Dark overlay */}
      <motion.div
        className="absolute inset-0 bg-black/45"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease }}
      />

      {/* Headline */}
      <motion.h1
        className="relative z-10 text-center font-heading text-3xl md:text-4xl leading-none text-white px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease }}
      >
        {headline.toUpperCase()}
      </motion.h1>
    </section>
  );
}
