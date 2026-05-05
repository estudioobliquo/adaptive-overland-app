'use client';

import { motion } from 'framer-motion';
import { fadeUp, fadeIn, stagger, viewportOnce, ease } from '@/lib/motion';

interface VideoSectionProps {
  youtubeUrl?: string;
  title?: string;
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function VideoSection({ youtubeUrl, title }: VideoSectionProps) {
  const videoId = youtubeUrl ? extractYoutubeId(youtubeUrl) : null;

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-12"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease }}
            className="text-xs uppercase tracking-[0.3em] text-accent mb-2"
          >
            En ruta
          </motion.p>
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.6, ease }}
            className="font-heading text-5xl md:text-6xl"
          >
            {title?.toUpperCase() ?? 'VIAJAMOS CON GREGOIRE'}
          </motion.h2>
        </motion.div>

        <motion.div
          className="aspect-video w-full bg-surface overflow-hidden"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease }}
        >
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              title="Viajamos con Gregoire"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted text-sm">
              Video próximamente
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
