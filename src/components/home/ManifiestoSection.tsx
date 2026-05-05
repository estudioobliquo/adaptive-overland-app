'use client';

import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportOnce, ease } from '@/lib/motion';

interface ManifiestoSectionProps {
  body?: string;
}

export default function ManifiestoSection({ body }: ManifiestoSectionProps) {
  const text =
    body ??
    'Gregoire es un viajero en silla de ruedas que decidió que ninguna barrera lo detendría. Adaptive Overland nació de esa convicción: diseñar accesorios que conviertan cualquier van en un hogar accesible y listo para la aventura. Porque la libertad de movimiento no debería tener límites.';

  return (
    <section className="py-24 px-6">
      <motion.div
        className="max-w-3xl mx-auto text-center"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, ease }}
          className="text-xs uppercase tracking-[0.3em] text-accent mb-8"
        >
          Manifiesto
        </motion.p>
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.7, ease }}
          className="text-xl md:text-2xl text-text/80 leading-relaxed font-light"
        >
          {text}
        </motion.p>
      </motion.div>
    </section>
  );
}
