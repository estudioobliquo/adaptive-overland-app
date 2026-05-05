'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getContent } from '@/lib/api';
import type { ContentSection } from '@/lib/types';
import { fadeUp, fadeIn, stagger, staggerFast, viewportOnce, ease } from '@/lib/motion';

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

const features = [
  { label: 'Cama adaptada', desc: 'Sistema de cama abatible diseñado para acceso en silla de ruedas.' },
  { label: 'Baño accesible', desc: 'Espacio compacto con ducha y sanitario adaptados.' },
  { label: 'Elevadores y rampas', desc: 'Sistemas de ascenso y descenso seguros para distintos terrenos.' },
  { label: 'Cocina integrada', desc: 'Mesada a altura accesible con almacenamiento optimizado.' },
  { label: 'Manejo adaptado', desc: 'Controles manuales y asistencias para conducción independiente.' },
  { label: 'Vida en ruta', desc: 'Todo lo necesario para semanas de autonomía fuera de la ciudad.' },
];

export default function LaVanPage() {
  const [section, setSection] = useState<ContentSection | null>(null);

  useEffect(() => {
    getContent()
      .then((c) => setSection(c.find((s) => s.key === 'adapted_van') ?? null))
      .catch(() => {});
  }, []);

  const videoId = section?.youtubeUrl ? extractYoutubeId(section.youtubeUrl) : null;

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero */}
      <div className="relative h-[60vh] bg-surface flex items-center justify-center overflow-hidden">
        {section?.mediaUrl && (
          <motion.img
            src={section.mediaUrl}
            alt="La Van Adaptada"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease }}
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <motion.div
          className="relative z-10 text-center px-6"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          <motion.p variants={fadeUp} transition={{ duration: 0.5, ease }} className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
            Ingeniería y libertad
          </motion.p>
          <motion.h1 variants={fadeUp} transition={{ duration: 0.7, ease }} className="font-heading text-6xl md:text-8xl">
            LA VAN ADAPTADA
          </motion.h1>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24 space-y-24">
        {/* Intro */}
        <motion.div
          className="max-w-2xl"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease }}
        >
          <p className="text-text/80 text-xl leading-relaxed">
            {section?.body ?? 'Cada modificación fue diseñada para que viajar en silla de ruedas sea tan libre y cómodo como para cualquier aventurero. Esta es la van que lo hace posible.'}
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border"
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {features.map((f) => (
            <motion.div
              key={f.label}
              className="bg-bg p-8"
              variants={fadeUp}
              transition={{ duration: 0.5, ease }}
            >
              <h3 className="font-heading text-2xl mb-3">{f.label.toUpperCase()}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Van tour video */}
        {videoId && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Van Tour</p>
            <div className="aspect-video w-full bg-surface overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                title="Van Tour"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
