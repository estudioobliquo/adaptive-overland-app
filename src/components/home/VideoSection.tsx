'use client';

import { motion } from 'framer-motion';
import { fadeUp, fadeIn, stagger, viewportOnce, ease } from '@/lib/motion';

interface VideoSectionProps {
  youtubeUrl?: string;
  title?: string;
}

const DEFAULT_URL = 'https://www.youtube.com/watch?v=a2i-XhZYSdM';
const DEFAULT_TITLE = 'SERIE: DESTINO "FIN DEL MUNDO"';

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export default function VideoSection({ youtubeUrl, title }: VideoSectionProps) {
  const url = youtubeUrl ?? DEFAULT_URL;
  const videoId = extractYoutubeId(url);
  const heading = title ?? DEFAULT_TITLE;

  return (
    <section className="bg-[#f0ece6] py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          className="font-heading text-3xl md:text-4xl text-[#1a1714] text-center mb-6 uppercase"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease }}
        >
          {heading}
        </motion.h2>

        <motion.div
          className="aspect-video w-full overflow-hidden"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease }}
        >
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              title={heading}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#888] text-sm bg-[#e8e4de]">
              Video próximamente
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
