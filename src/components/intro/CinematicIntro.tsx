'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';

const IntroScene = dynamic(() => import('@/components/three/IntroScene'), { ssr: false });

type Phase = 'dark' | 'light-appear' | 'orb' | 'logo' | 'activated' | 'portal' | 'transition' | 'done';

const PHASE_TIMINGS: Record<Phase, number> = {
  dark: 1200,
  'light-appear': 1500,
  orb: 2000,
  logo: 3000,
  activated: 0,
  portal: 2000,
  transition: 1500,
  done: 0,
};

interface CinematicIntroProps {
  onComplete: () => void;
}

export default function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [phase, setPhase] = useState<Phase>('dark');
  const [portalProgress, setPortalProgress] = useState(0);
  const [logoVisible, setLogoVisible] = useState(false);
  const [statusText, setStatusText] = useState('');
  const portalRef = useRef<NodeJS.Timeout | null>(null);

  const statusMessages = [
    '> INICIANDO PROTOCOLO HACKL4BS...',
    '> ESTABLECIENDO CONEXIÓN SEGURA...',
    '> VERIFICANDO CREDENCIALES...',
    '> ACCESO CONCEDIDO — BIENVENIDO USUARIO',
  ];

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  useEffect(() => {
    const advance = async () => {
      await delay(PHASE_TIMINGS.dark);
      setPhase('light-appear');
      await delay(PHASE_TIMINGS['light-appear']);
      setPhase('orb');
      await delay(PHASE_TIMINGS.orb);
      setPhase('logo');
      setLogoVisible(true);
      let i = 0;
      const textTimer = setInterval(() => {
        setStatusText(statusMessages[i]);
        i++;
        if (i >= statusMessages.length) clearInterval(textTimer);
      }, 800);
    };
    advance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOrbInteract = useCallback(() => {
    if (phase !== 'logo' && phase !== 'orb') return;
    setPhase('activated');
    setLogoVisible(false);
    setStatusText('> ACCESO CONCEDIDO — ATRAVESANDO PORTAL...');

    let p = 0;
    const interval = setInterval(() => {
      p += 0.015;
      setPortalProgress(Math.min(p, 1));
      if (p >= 0.5) {
        clearInterval(interval);
        setPhase('portal');
        setTimeout(() => {
          setPhase('transition');
          setTimeout(() => onComplete(), 1200);
        }, 2000);
      }
    }, 30);
  }, [phase, onComplete]);

  const handleSkip = useCallback(() => {
    if (portalRef.current) clearTimeout(portalRef.current);
    onComplete();
  }, [onComplete]);

  const hintVisible = phase === 'logo';

  return (
    <motion.div
      className="fixed inset-0"
      style={{ zIndex: 1000 }}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'done' ? 0 : 1 }}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <IntroScene
          phase={phase as Exclude<Phase, 'done'>}
          portalProgress={portalProgress}
          onOrbInteract={handleOrbInteract}
        />
      </div>

      {/* Dark overlay fades out */}
      <AnimatePresence>
        {phase === 'dark' && (
          <motion.div
            className="absolute inset-0 bg-black"
            style={{ zIndex: 10 }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 2, ease: 'easeOut' } }}
          />
        )}
      </AnimatePresence>

      {/* Logo reveal */}
      <AnimatePresence>
        {logoVisible && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            style={{ zIndex: 20 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            {/* Holographic logo container */}
            <motion.div
              className="relative"
              initial={{ scale: 0.5, filter: 'blur(20px)' }}
              animate={{ scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Glow rings behind logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                {[1, 1.3, 1.6].map((s, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: `${s * 320}px`,
                      height: `${s * 320}px`,
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                      boxShadow: `0 0 ${20 * s}px rgba(0, 212, 255, ${0.15 - i * 0.04})`,
                      animation: `intro-spin ${8 + i * 3}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                    }}
                  />
                ))}
              </div>

              {/* Logo image */}
              <motion.div
                className="relative float-anim"
                style={{
                  zIndex: 10,
                  filter: 'drop-shadow(0 0 30px rgba(0, 212, 255, 0.6)) drop-shadow(0 0 60px rgba(124, 58, 237, 0.4))',
                }}
              >
                <Image
                  src="/logo-mascota.png"
                  alt="HackL4bs Cybersecurity"
                  width={400}
                  height={200}
                  loading="eager"
                  style={{ objectFit: 'contain', maxWidth: '90vw', height: 'auto', borderRadius: '0' }}
                />
              </motion.div>
            </motion.div>

            {/* Status text */}
            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <p
                className="text-sm mb-6"
                style={{ fontFamily: 'var(--font-mono)', color: '#4ade80' }}
              >
                {statusText}
                <span className="cursor-blink">_</span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interaction hint */}
      <AnimatePresence>
        {hintVisible && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 pointer-events-auto text-center"
            style={{ bottom: '4rem', zIndex: 30 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 1, 0.7, 1], y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, delay: 2 }}
          >
            <div
              className="px-6 py-3 rounded-sm"
              style={{
                background: 'rgba(0, 212, 255, 0.05)',
                border: '1px solid rgba(0, 212, 255, 0.25)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <p
                className="text-xs uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-mono)', color: '#00d4ff' }}
              >
                ⬡ INTERACTÚA CON LA LUZ ⬡
              </p>
              <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                Mueve el cursor sobre el orbe · Haz click para abrir el portal
              </p>
            </div>
            <motion.div
              className="mt-4 flex justify-center"
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3v14M10 17l-5-5M10 17l5-5" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portal transition overlay */}
      <AnimatePresence>
        {phase === 'transition' && (
          <motion.div
            className="absolute inset-0 bg-black"
            style={{ zIndex: 40 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          />
        )}
      </AnimatePresence>

      {/* Flash on activation */}
      <AnimatePresence>
        {phase === 'activated' && (
          <motion.div
            className="absolute inset-0"
            style={{ zIndex: 30, background: '#00d4ff' }}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Skip button — always visible */}
      <button
        onClick={handleSkip}
        className="absolute glass"
        style={{
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 50,
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: '#4b5563',
          padding: '6px 14px',
          letterSpacing: '0.15em',
          cursor: 'pointer',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'transparent',
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#00d4ff')}
        onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
      >
        SKIP →
      </button>

      <style>{`
        @keyframes intro-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.div>
  );
}
