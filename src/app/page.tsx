'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const CinematicIntro = dynamic(() => import('@/components/intro/CinematicIntro'), { ssr: false });
const Navbar = dynamic(() => import('@/components/ui/Navbar'), { ssr: false });
const CustomCursor = dynamic(() => import('@/components/ui/CustomCursor'), { ssr: false });
import HeroSection from '@/components/sections/HeroSection';
import CategoriesSection from '@/components/sections/CategoriesSection';
import TimelineSection from '@/components/sections/TimelineSection';
import AboutSection from '@/components/sections/AboutSection';
import CommunitiesSection from '@/components/sections/CommunitiesSection';
import FAQSection from '@/components/sections/FAQSection';
import FooterSection from '@/components/sections/FooterSection';
import RegistrationModal from '@/components/ui/RegistrationModal';

// === EASTER EGG SYSTEM ===
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
const SECRET_COMMANDS: Record<string, string> = {
  'hackl4bs': '> ACCESS GRANTED :: FLAG{y0u_f0und_th3_s3cr3t_p4th}',
  'sudo su': '> [!] Permission denied. Nice try, script kiddie.',
  'ls -la': '> drwxr-xr-x  hackl4bs_ctf/\n> -rw-------  flag.txt (ENCRYPTED)\n> -rwx------  portal_access.sh',
  'cat flag.txt': '> cat: flag.txt: Permission denied. You need to earn it.',
  'nmap': '> Starting Nmap scan...\n> PORT    STATE    SERVICE\n> 1337/tcp open     hackl4bs\n> 31337/tcp open    elite-mode',
  'whoami': '> operative::unknown_agent\n> clearance: ALPHA\n> mission: ACTIVE',
  'help': '> Available commands: hackl4bs, sudo su, ls -la, cat flag.txt, nmap, whoami, matrix, clear',
  'matrix': 'MATRIX_MODE',
  'clear': 'CLEAR',
};

function EasterEggTerminal() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ cmd: string; res: string }[]>([]);
  const [matrixMode, setMatrixMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const response = SECRET_COMMANDS[trimmed] || `> command not found: ${trimmed}. Type 'help' for available commands.`;
    
    if (response === 'MATRIX_MODE') {
      setMatrixMode(true);
      setTimeout(() => setMatrixMode(false), 5000);
      setHistory(h => [...h, { cmd, res: '> Initiating matrix protocol...' }]);
    } else if (response === 'CLEAR') {
      setHistory([]);
    } else {
      setHistory(h => [...h, { cmd, res: response }]);
    }
    setInput('');
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Konami code listener
  useEffect(() => {
    let seq: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      seq = [...seq.slice(-9), e.key];
      if (seq.join(',') === KONAMI.join(',')) {
        setOpen(true);
        setHistory([{ cmd: '', res: '> KONAMI CODE DETECTED :: TERMINAL ACCESS GRANTED\n> Welcome, elite operator. Type \'help\' to begin.' }]);
      }
      // Also open with backtick
      if (e.key === '`' && !open) setOpen(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <motion.div
            className="relative w-full max-w-2xl glass-card neon-border rounded-sm overflow-hidden"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Terminal header */}
            <div
              className="flex items-center justify-between px-4 py-2"
              style={{ background: 'rgba(0, 212, 255, 0.05)', borderBottom: '1px solid rgba(0,212,255,0.1)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-80" />
                <span className="ml-3 text-xs text-cyan-400" style={{ fontFamily: 'var(--font-mono)' }}>
                  HACKL4BS :: SECRET TERMINAL v1.337
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-red-400 text-xs"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                [ESC]
              </button>
            </div>

            {/* Output */}
            <div
              className="p-4 h-72 overflow-y-auto"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
            >
              {history.map((item, i) => (
                <div key={i} className="mb-2">
                  {item.cmd && (
                    <div className="text-cyan-400">
                      <span className="text-gray-600">root@hackl4bs:~# </span>
                      {item.cmd}
                    </div>
                  )}
                  <div className="text-green-400 whitespace-pre-wrap">{item.res}</div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div
              className="flex items-center px-4 py-3"
              style={{ borderTop: '1px solid rgba(0,212,255,0.1)', background: 'rgba(0,0,0,0.3)' }}
            >
              <span className="text-gray-600 text-xs mr-2" style={{ fontFamily: 'var(--font-mono)' }}>
                root@hackl4bs:~#
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCommand(input);
                  if (e.key === 'Escape') setOpen(false);
                }}
                className="flex-1 bg-transparent text-green-400 text-xs outline-none"
                style={{ fontFamily: 'var(--font-mono)', caretColor: '#00ff41' }}
                placeholder="Type a command..."
                autoComplete="off"
                spellCheck={false}
              />
              <span className="cursor-blink text-green-400 text-xs">█</span>
            </div>
          </motion.div>

          {/* Matrix mode overlay */}
          <AnimatePresence>
            {matrixMode && (
              <MatrixOverlay />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MatrixOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'HACKL4BS01アイウエオカキクケコサシスセソ';
    const fontSize = 14;
    const cols = Math.floor(canvas.width / fontSize);
    const drops = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00ff41';
      ctx.font = `${fontSize}px monospace`;
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };

    const raf = setInterval(draw, 33);
    return () => clearInterval(raf);
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9998] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      exit={{ opacity: 0 }}
    />
  );
}

// Cipher text Easter egg
function CipherOverlay() {
  return (
    <div
      className="fixed bottom-4 left-4 z-50 text-xs opacity-10 hover:opacity-40 transition-opacity duration-500 select-none"
      style={{ fontFamily: 'var(--font-mono)', color: '#00d4ff' }}
      title="¿Puedes descifrar esto?"
    >
      {/* ROT13 encoded: "La bandera está en el código fuente" */}
      47 41 43 4B 4C 34 42 53 7B 77 33 6C 63 30 6D 33 7D
    </div>
  );
}

export default function MainPage() {
  const [introComplete, setIntroComplete] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);

  const handleIntroComplete = () => {
    setIntroComplete(true);
    setNavVisible(true);
    // Ensure page starts at top after intro
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <>
      <CustomCursor />

      {/* Cinematic intro */}
      <AnimatePresence>
        {!introComplete && (
          <CinematicIntro onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      {/* Main landing */}
      <AnimatePresence>
        {introComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Navbar visible={navVisible} onRegisterClick={() => setIsRegModalOpen(true)} />

            <main>
              <HeroSection onRegisterClick={() => setIsRegModalOpen(true)} />
              <CategoriesSection />
              <TimelineSection />
              <AboutSection />
              <CommunitiesSection />
              <FAQSection />
              <FooterSection />
            </main>

            <RegistrationModal isOpen={isRegModalOpen} onClose={() => setIsRegModalOpen(false)} />
            <EasterEggTerminal />
            <CipherOverlay />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
