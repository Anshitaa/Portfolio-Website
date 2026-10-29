'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '#work', label: 'Work' },
  { href: '/systems', label: 'AI Systems' },
  { href: '#experience', label: 'Experience' },
  { href: '#research', label: 'Research' },
  { href: '#contact', label: 'Contact' },
];

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu when the viewport grows to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setIsMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 bg-white/90 backdrop-blur-md transition-colors ${
        scrolled ? 'border-b border-gray-200' : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <a href="#top" className="text-sm font-semibold tracking-tight hover:text-purple-600">
          Anshita <span className="text-purple-600">Bhardwaj</span>
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          {navLinks.map(link =>
            link.href.startsWith('/') ? (
              <Link key={link.href} href={link.href} className="hover:text-purple-600">{link.label}</Link>
            ) : (
              <a key={link.href} href={link.href} className="hover:text-purple-600">{link.label}</a>
            )
          )}
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
            className="rounded-full bg-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-purple-700">
            Resume
          </a>
        </nav>

        <button
          onClick={() => setIsMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          className="md:hidden p-2 -mr-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden border-t border-gray-100 px-4 pb-3 pt-2 flex flex-col">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)}
              className="py-2.5 text-sm font-medium text-gray-700 hover:text-purple-600">
              {link.label}
            </a>
          ))}
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
            className="py-2.5 text-sm font-semibold text-purple-600">
            Resume
          </a>
        </nav>
      )}
    </header>
  );
}
