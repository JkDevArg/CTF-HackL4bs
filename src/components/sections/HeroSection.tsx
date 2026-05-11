'use client';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Countdown, GlitchText, Typewriter } from '@/components/ui/TextEffects';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0" style={{ background: '#050505' }} />,
});

const terminalLines = [
  'SISTEMA INICIALIZADO...',
  'PROTOCOLO CTF ACTIVADO',
  'DETECTANDO VULNERABILIDADES...',
  '> BIENVENIDO AL DESAFÍO FINAL',
];

const CTF_DATE = new Date('2026-06-20T00:00:00');

export default function HeroSection({ onRegisterClick }: { onRegisterClick: () => void }) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{
        background: '#050505',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Cyber grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* 3D Background */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <HeroScene />
      </div>

      {/* Gradient vignette — explicit z-index */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(5,5,5,0.7) 0%, transparent 40%, rgba(5,5,5,0.95) 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background: 'linear-gradient(to right, rgba(5,5,5,0.5) 0%, transparent 50%, rgba(5,5,5,0.5) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content — always on top */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          paddingTop: '80px',
          paddingBottom: '120px',
          maxWidth: '72rem',
          margin: '0 auto',
          width: '100%',
        }}
      >

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-sm"
          style={{
            background: 'rgba(0, 212, 255, 0.05)',
            border: '1px solid rgba(0, 212, 255, 0.25)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span
            className="w-2 h-2 rounded-full bg-green-400"
            style={{ animation: 'pulse 2s infinite' }}
          />
          <span
            className="text-xs tracking-widest"
            style={{ fontFamily: 'var(--font-mono)', color: '#4ade80' }}
          >
            SISTEMA ONLINE // REGISTRO ABIERTO
          </span>
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1
            className="font-black tracking-tighter mb-4 leading-none"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3rem, 12vw, 9rem)',
            }}
          >
            <span
              style={{
                color: '#00d4ff',
                textShadow: '0 0 30px rgba(0,212,255,0.9), 0 0 60px rgba(0,212,255,0.5), 0 0 100px rgba(0,212,255,0.3)',
              }}
            >
              HACK
            </span>
            <span
              style={{
                color: '#7c3aed',
                textShadow: '0 0 30px rgba(124,58,237,0.9), 0 0 60px rgba(124,58,237,0.5)',
              }}
            >
              L4BS
            </span>
          </h1>

          <div
            className="font-bold tracking-widest mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.2rem, 4vw, 2.5rem)',
              color: '#7c3aed',
              textShadow: '0 0 20px rgba(124, 58, 237, 0.6)',
            }}
          >
            <GlitchText text="CTF 2026" className="" />
          </div>

          <p
            className="text-sm md:text-base uppercase mb-8"
            style={{
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.3em',
              color: '#9ca3af',
            }}
          >
            Capture The Flag · Cybersecurity Challenge
          </p>
        </motion.div>

        {/* Terminal typewriter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-10"
          style={{ minHeight: '80px' }}
        >
          <Typewriter lines={terminalLines} speed={60} className="max-w-md mx-auto text-left" />
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mb-10"
        >
          <p
            className="text-md uppercase mb-4"
            style={{ fontFamily: 'var(--font-mono)', color: '#7b899cff', letterSpacing: '0.2em' }}
          >
            ⬡ EL RETO COMIENZA EN
          </p>
          <Countdown targetDate={CTF_DATE} />
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
          style={{ paddingTop: '2rem' }}
        >
          <button
            id="hero-cta-primary"
            className="btn-cyber text-white font-bold"
            style={{
              fontFamily: 'var(--font-display)',
              background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
              boxShadow: '0 0 20px rgba(0, 212, 255, 0.2), inset 0 0 20px rgba(0, 212, 255, 0.05)',
            }}
            onClick={onRegisterClick}
          >
            ⬡ REGISTRARSE
          </button>
          <a
            href="#categorias"
            id="hero-cta-secondary"
            className="btn-cyber font-semibold flex items-center justify-center"
            style={{ fontFamily: 'var(--font-display)', color: '#00d4ff' }}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            VER CATEGORÍAS →
          </a>
        </motion.div>

        {/* Coordinates decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.8 }}
          className="mt-12 flex items-center justify-center gap-8 text-xs"
          style={{ fontFamily: 'var(--font-mono)', color: '#374151' }}
        >
          <span>LAT: -34.6037°</span>
          <span className="w-1 h-1 rounded-full" style={{ background: '#00d4ff' }} />
          <span>LON: -58.3816°</span>
          <span className="w-1 h-1 rounded-full" style={{ background: '#00d4ff' }} />
          <span>STATUS: ENCRYPTED</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: '2rem', zIndex: 10 }}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span
            className="text-xs uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-mono)', color: '#4b5563' }}
          >
            SCROLL
          </span>
          <div
            className="w-px h-12"
            style={{ background: 'linear-gradient(to bottom, #00d4ff, transparent)' }}
          />
        </div>
      </motion.div>
    </section>
  );
}
