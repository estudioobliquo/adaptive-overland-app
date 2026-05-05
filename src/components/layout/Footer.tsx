import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-heading text-xl tracking-widest mb-2">ADAPTIVE OVERLAND</p>
          <p className="text-muted text-sm leading-relaxed">
            Accesorios para vans adaptadas.<br />La aventura no tiene límites.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-muted mb-4">Explorar</p>
          <ul className="space-y-2">
            {[
              { href: '/tienda', label: 'Tienda' },
              { href: '/mi-historia', label: 'Mi Historia' },
              { href: '/la-van', label: 'La Van Adaptada' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-muted hover:text-text transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-muted mb-4">Contacto</p>
          <p className="text-sm text-muted">hola@adaptiveoverland.com</p>
        </div>
      </div>

      <div className="border-t border-border px-6 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} Adaptive Overland. Todos los derechos reservados.
      </div>
    </footer>
  );
}
