'use client';
import { useRef, useState } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface NavProps {
  visible: boolean;
  onRegisterClick: () => void;
}

const links = [
  { label: 'INICIO', href: '#hero' },
  { label: 'CATEGORÍAS', href: '#categorias' },
  { label: 'TIMELINE', href: '#timeline' },
  { label: 'COMUNIDAD', href: '#comunidad' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar({ visible, onRegisterClick }: NavProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-[900]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -20 }}
        transition={{ duration: 0.5 }}
        aria-label="Navegación principal"
      >
        {/* Scroll progress bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5 origin-left z-10"
          style={{
            scaleX,
            background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
            boxShadow: '0 0 8px rgba(0, 212, 255, 0.6)',
          }}
        />

        <nav
          className="glass px-6 py-3 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(0, 212, 255, 0.08)' }}
        >
          {/* Logo */}
          <a
            href="#hero"
            id="nav-logo"
            className="flex items-center gap-3 group"
            onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }}
          >
            <Image
              src="/logo-nav.png"
              alt="HackL4bs Cybersecurity"
              width={140}
              height={140}
              loading="eager"
              style={{
                width: 'auto',
                height: '75px',
                objectFit: 'contain',
                borderRadius: '0',
                filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.4))',
                transition: 'filter 0.3s ease',
              }}
              className="group-hover:blur-[2px] group-hover:drop-shadow-[0_0_15px_rgba(0,212,255,0.8)] transition-all duration-300"
            />
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(link => (
              <a
                key={link.label}
                href={link.href}
                id={`nav-${link.label.toLowerCase().replace('é', 'e').replace('ó', 'o')}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-xs text-gray-400 hover:text-cyan-400 transition-colors duration-200 tracking-widest relative group"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {link.label}
                <span
                  className="absolute -bottom-0.5 left-0 w-0 h-px bg-cyan-400 group-hover:w-full transition-all duration-300"
                  style={{ boxShadow: '0 0 4px #00d4ff' }}
                />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <button
            id="nav-cta"
            className="btn-cyber text-xs text-cyan-400 hidden md:block"
            style={{ fontFamily: 'var(--font-display)', padding: '8px 20px' }}
            onClick={(e) => { e.preventDefault(); onRegisterClick(); }}
          >
            REGISTRARSE
          </button>

          {/* Mobile hamburger — CSS-only to avoid motion.path errors */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            aria-label="Abrir menú"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(prev => !prev)}
            style={{ color: '#9ca3af' }}
          >
            <span
              style={{
                display: 'block',
                width: '18px',
                height: '1.5px',
                background: 'currentColor',
                transition: 'all 0.3s ease',
                transform: mobileOpen ? 'translateY(6px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '18px',
                height: '1.5px',
                background: 'currentColor',
                transition: 'all 0.2s ease',
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                width: '18px',
                height: '1.5px',
                background: 'currentColor',
                transition: 'all 0.3s ease',
                transform: mobileOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[850] bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-[860] w-72 glass md:hidden flex flex-col pt-24 pb-8 px-6"
              style={{ borderLeft: '1px solid rgba(0, 212, 255, 0.12)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col gap-1">
                {links.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className="flex items-center gap-3 py-3 text-sm text-gray-400 hover:text-cyan-400 transition-colors border-b"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      borderColor: 'rgba(255,255,255,0.05)',
                    }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <span className="text-xs text-cyan-400 opacity-50">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </motion.a>
                ))}
              </div>

              <motion.button
                onClick={(e) => { e.preventDefault(); setMobileOpen(false); onRegisterClick(); }}
                className="mt-6 btn-cyber text-center text-cyan-400 text-xs"
                style={{ fontFamily: 'var(--font-display)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                REGISTRARSE
              </motion.button>

              {/* Terminal hint */}
              <motion.p
                className="mt-auto text-xs text-gray-600 text-center"
                style={{ fontFamily: 'var(--font-mono)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Press ` for secret terminal
              </motion.p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
