'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';

const navLinks = [
  { href: '/mi-historia', label: 'Mi Historia' },
  { href: '/la-van', label: 'La Van Adaptada' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const showSolid = !isHome || scrolled;

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showSolid ? 'bg-[#1a1714]/95 backdrop-blur border-b border-[#2a2520]' : 'bg-transparent'
      }`}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Adaptive Overland"
            width={160}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Center links */}
        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm tracking-[0.15em] text-white/90 hover:text-white transition-colors uppercase font-body"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Profile icon */}
          <Link
            href={isAuthenticated ? '/cuenta' : '/login'}
            className="hidden md:flex p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Mi cuenta"
          >
            <User size={20} />
          </Link>

          {/* TIENDA button */}
          <Link
            href="/tienda"
            className="hidden md:flex items-center border border-white/60 text-white text-xs uppercase tracking-[0.15em] px-4 py-2 hover:bg-accent hover:border-accent transition-all duration-200"
          >
            Tienda
          </Link>

          {/* Carrito icon */}
          <Link
            href="/carrito"
            className="hidden md:flex p-2 text-white/80 hover:text-white transition-colors relative"
            aria-label="Carrito"
          >
            <ShoppingCart size={20} />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key="badge"
                  className="absolute -top-0.5 -right-0.5 bg-accent text-[#1a1714] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none"
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

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menú"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-bg/95 backdrop-blur border-t border-border px-6 py-4 overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="flex flex-col gap-4">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block text-sm tracking-wider uppercase text-white/80 hover:text-white transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tienda"
                  className="flex items-center gap-2 text-sm tracking-wider uppercase text-white/80 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Tienda
                </Link>
              </li>
              <li>
                <Link
                  href="/carrito"
                  className="flex items-center gap-2 text-sm tracking-wider uppercase text-white/80 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Carrito
                  {itemCount > 0 && <span className="bg-accent text-[#1a1714] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{itemCount}</span>}
                </Link>
              </li>
              <li>
                <Link
                  href={isAuthenticated ? '/cuenta' : '/login'}
                  className="flex items-center gap-2 text-sm tracking-wider uppercase text-white/80 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Mi cuenta <User size={16} />
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
