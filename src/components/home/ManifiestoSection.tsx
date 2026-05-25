'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeUp, stagger, viewportOnce, ease } from '@/lib/motion';

interface ManifiestoSectionProps {
  body?: string;
}

const DEFAULT_PARAGRAPHS = [
  'Cada ruta es una nueva historia, cada paisaje una razón para seguir descubriendo.',
  'Esta van es más que un destino móvil: es libertad, aventura y la certeza de que siempre hay un próximo horizonte.',
];

export default function ManifiestoSection({ body }: ManifiestoSectionProps) {
  const paragraphs = body ? body.split('\n').filter(Boolean) : DEFAULT_PARAGRAPHS;

  return (
    <section className="bg-[#f0ece6] py-12 px-6 lg:px-20">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-0 items-center">

        {/* Imagen */}
        <div className="relative h-[300px] md:h-[360px] overflow-hidden">
          <Image
            src="/manifesto.jpg"
            alt="Adaptive Overland"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Texto con fondo blanco */}
        <motion.div
          className="bg-white px-16 py-20 flex flex-col justify-center"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: i * 0.1, ease }}
              className="text-[#2a2520] text-base leading-relaxed mb-4 last:mb-0"
            >
              {p}
            </motion.p>
          ))}
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, delay: paragraphs.length * 0.1, ease }}
            className="text-[#2a2520] font-semibold mt-4"
          >
            ¡Acompáñame!
          </motion.p>
        </motion.div>

      </div>
    </section>
  );
}
