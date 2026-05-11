'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [displayText, setDisplayText] = useState('');
  const fullText = '> Muy Pronto estaremos abriendo el registro!\n> Mantente atento a nuestras redes sociales...\n> STATUS: COMING_SOON\n> [!] ACCESO RESTRINGIDO';
  
  useEffect(() => {
    if (isOpen) {
      setDisplayText('');
      let index = 0;
      const interval = setInterval(() => {
        setDisplayText(fullText.slice(0, index));
        index++;
        if (index > fullText.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Matrix Background */}
          <MatrixBackground />
          
          {/* Backdrop blur/darken */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

          {/* Terminal Window */}
          <motion.div
            className="relative w-full max-w-xl glass-card neon-border rounded-sm overflow-hidden z-10"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              boxShadow: '0 0 50px rgba(0, 255, 65, 0.2)',
              border: '1px solid rgba(0, 255, 65, 0.3)'
            }}
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-green-500/20 bg-green-500/5">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <span className="ml-3 text-[10px] tracking-widest text-green-500/70" style={{ fontFamily: 'var(--font-mono)' }}>
                  HACKL4BS // REGISTRATION_SYSTEM_v2.0
                </span>
              </div>
              <button 
                onClick={onClose}
                className="text-green-500/50 hover:text-green-400 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Terminal Body */}
            <div className="p-8 min-h-[300px] flex flex-col justify-center">
              <div 
                className="text-green-400 whitespace-pre-wrap leading-relaxed mb-8"
                style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                  textShadow: '0 0 10px rgba(0, 255, 65, 0.5)'
                }}
              >
                {displayText}
                <span className="cursor-blink ml-1">█</span>
              </div>

              {/* Decorative elements */}
              <div className="mt-auto pt-4 border-t border-green-500/10 flex justify-between items-end">
                <div className="text-[10px] text-green-900" style={{ fontFamily: 'var(--font-mono)' }}>
                  [SYSTEM] CONNECTION_STABLE<br />
                  [SYSTEM] ENCRYPTION_AES256
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 text-xs tracking-[0.3em] transition-all"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  CERRAR
                </button>
              </div>
            </div>

            {/* Scanlines effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] scanlines" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = 'HACKL4BS0123456789ABCDEF@#$%&';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0f0';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-20 pointer-events-none"
    />
  );
}
