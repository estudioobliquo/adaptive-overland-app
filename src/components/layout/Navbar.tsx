'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/tienda', label: 'Tienda' },
  { href: '/mi-historia', label: 'Mi Historia' },
  { href: '/la-van', label: 'La Van' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bg/95 backdrop-blur border-b border-border' : 'bg-transparent'
      }`}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-heading text-2xl tracking-widest text-text">
          ADAPTIVE OVERLAND
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm tracking-wider text-muted hover:text-text transition-colors uppercase"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link
            href={isAuthenticated ? '/cuenta' : '/login'}
            className="hidden md:block p-2 text-muted hover:text-accent transition-colors"
            aria-label="Mi cuenta"
          >
            <User size={20} />
          </Link>

          <Link href="/carrito" className="relative p-2 hover:text-accent transition-colors">
            <ShoppingCart size={22} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key="badge"
                  className="absolute -top-0.5 -right-0.5 bg-accent text-bg text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menú"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-surface border-t border-border px-6 py-4 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="flex flex-col gap-4">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block text-sm tracking-wider uppercase text-muted hover:text-text transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
