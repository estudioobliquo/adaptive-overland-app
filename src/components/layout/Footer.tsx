import Link from 'next/link';
import Image from 'next/image';

const socials = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/gregorymolin',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@gregorymolin1972',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/adaptiveoverland/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="17.5" cy="6.5" r="1" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@gregorymolin',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-8 py-10 flex flex-col md:flex-row items-start justify-between gap-10">

        {/* Logo + Links */}
        <div className="flex flex-row items-start gap-10">
          <Image src="/logo.png" alt="Adaptive Overland" width={120} height={60} className="h-16 w-auto object-contain flex-shrink-0" />
          <ul className="flex flex-col gap-2 text-sm text-white/80 mt-1">
            <li><Link href="/mi-historia" className="hover:text-white transition-colors uppercase tracking-wide">Mi Historia</Link></li>
            <li><Link href="/la-van" className="hover:text-white transition-colors uppercase tracking-wide">La Van Adaptada</Link></li>
            <li><Link href="/tienda" className="hover:text-white transition-colors uppercase tracking-wide">Tienda</Link></li>
          </ul>
        </div>

        {/* Redes */}
        <div className="flex flex-col items-start gap-3">
          <p className="text-white text-sm font-bold uppercase tracking-widest">Seguime:</p>
          <div className="flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 flex items-center justify-center text-white transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 px-8 py-4 text-center text-xs text-white/40">
        Adaptive Overland © Copyright {new Date().getFullYear()} Todos los derechos reservados. Un trabajo de{' '}
        <span className="text-white/60 font-medium">Estudio Obliquo</span>
      </div>
    </footer>
  );
}
