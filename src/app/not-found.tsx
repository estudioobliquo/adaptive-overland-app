import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="pt-32 pb-24 px-6 min-h-screen flex flex-col items-center justify-center text-center bg-[#f0ece6]">
      <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Error 404</p>
      <h1 className="font-heading text-7xl md:text-9xl mb-6 text-[#1a1714]">NOT FOUND</h1>
      <p className="text-[#888] max-w-sm mb-10">
        La página que buscás no existe o fue movida.
      </p>
      <Link
        href="/"
        className="bg-accent hover:bg-accent-hover text-[#1a1714] text-xs uppercase tracking-widest font-semibold px-8 py-4 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
