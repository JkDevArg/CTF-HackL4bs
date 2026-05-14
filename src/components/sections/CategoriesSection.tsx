'use client';
import { useRef, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';

const CATEGORIES = [
  {
    id: 'web',
    icon: '🌐',
    name: 'Web Pentesting',
    code: 'WEB-01',
    description: 'XSS, SQLi, SSRF, RCE, auth bypass. Encuentra vulnerabilidades en aplicaciones reales.',
    difficulty: 'MEDIUM → HARD',
    color: '#00d4ff',
    points: '100-500 pts',
    tags: ['OWASP', 'BurpSuite', 'SQLMap'],
  },
  {
    id: 'rev',
    icon: '⚙️',
    name: 'Reverse Engineering',
    code: 'REV-02',
    description: 'Analiza binarios, desensamblado, comprende el comportamiento de ejecutables ocultos.',
    difficulty: 'HARD → EXPERT',
    color: '#7c3aed',
    points: '200-600 pts',
    tags: ['IDA Pro', 'Ghidra', 'GDB'],
  },
  {
    id: 'osint',
    icon: '🔍',
    name: 'OSINT',
    code: 'OSN-03',
    description: 'Inteligencia de fuentes abiertas. Rastrea, investiga y conecta los puntos.',
    difficulty: 'EASY → MEDIUM',
    color: '#10b981',
    points: '50-300 pts',
    tags: ['Maltego', 'Shodan', 'TheHarvester'],
  },
  {
    id: 'crypto',
    icon: '🔐',
    name: 'Cryptography',
    code: 'CRY-04',
    description: 'Rompe cifrados débiles, ataques de oráculo, factorización RSA y más.',
    difficulty: 'MEDIUM → EXPERT',
    color: '#f59e0b',
    points: '150-500 pts',
    tags: ['Python', 'SageMath', 'RSA'],
  },
  {
    id: 'forensics',
    icon: '🔬',
    name: 'Forensics',
    code: 'FOR-05',
    description: 'Análisis de memoria, imágenes de disco, tráfico de red y recuperación de datos.',
    difficulty: 'MEDIUM → HARD',
    color: '#06b6d4',
    points: '100-400 pts',
    tags: ['Volatility', 'Wireshark', 'Autopsy'],
  },
  {
    id: 'pwn',
    icon: '💀',
    name: 'Pwn',
    code: 'PWN-06',
    description: 'Explotación binaria. Buffer overflows, ROP chains, heap exploitation.',
    difficulty: 'HARD → EXPERT',
    color: '#ef4444',
    points: '300-800 pts',
    tags: ['pwntools', 'ROPgadget', 'GEF'],
  },
  {
    id: 'misc',
    icon: '🎲',
    name: 'Misc',
    code: 'MSC-07',
    description: 'Steganografía, puzzles, coding challenges. Lo inesperado es la norma.',
    difficulty: 'EASY → HARD',
    color: '#8b5cf6',
    points: '50-250 pts',
    tags: ['Stego', 'Scripting', 'Trivia'],
  },
  {
    id: 'Unknown',
    icon: '❓',
    name: 'Unknown',
    code: 'UNK-08',
    description: 'Unknown challenges.',
    difficulty: 'INSANE',
    color: '#a8a8a8ff',
    points: '??? pts',
    tags: ['???', '???', '???'],
  },
];

function CategoryCard({ cat, index }: { cat: typeof CATEGORIES[0]; index: number }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 30,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * -30,
    });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative glass-card rounded-sm overflow-hidden cursor-pointer h-full"
        style={{
          rotateX: hovered ? mousePos.y : 0,
          rotateY: hovered ? mousePos.x : 0,
          transformStyle: 'preserve-3d',
          border: hovered ? `1px solid ${cat.color}40` : '1px solid rgba(0,212,255,0.1)',
          boxShadow: hovered ? `0 0 30px ${cat.color}20, 0 0 60px ${cat.color}10, inset 0 0 30px ${cat.color}05` : 'none',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setMousePos({ x: 0, y: 0 }); }}
        whileHover={{ scale: 1.02, z: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Glow overlay */}
        {hovered && (
          <div
            className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${50 + mousePos.x}% ${50 - mousePos.y}%, ${cat.color}15, transparent 60%)`,
            }}
          />
        )}

        {/* Holo sweep */}
        <div className="holo-line absolute inset-0 z-1" />

        <div className="relative z-10" style={{ padding: '2.5rem' }}>
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div
              className="text-4xl p-4 rounded-sm"
              style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30` }}
            >
              {cat.icon}
            </div>
            <span
              className="text-xs px-2 py-1 rounded-sm"
              style={{
                fontFamily: 'var(--font-mono)',
                color: cat.color,
                background: `${cat.color}15`,
                border: `1px solid ${cat.color}30`,
              }}
            >
              {cat.code}
            </span>
          </div>

          {/* Name */}
          <h3
            className="text-xl font-bold mb-3 transition-all duration-300"
            style={{
              fontFamily: 'var(--font-display)',
              color: hovered ? cat.color : '#e8e8f0',
              textShadow: hovered ? `0 0 15px ${cat.color}60` : 'none',
            }}
          >
            {cat.name}
          </h3>

          {/* Description */}
          <p className="text-gray-400 text-sm mb-6 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
            {cat.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {cat.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-sm"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'rgba(255,255,255,0.4)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="text-xs text-gray-500" style={{ fontFamily: 'var(--font-mono)' }}>
              {cat.difficulty}
            </span>
            <span
              className="text-sm font-bold"
              style={{ fontFamily: 'var(--font-display)', color: cat.color }}
            >
              {cat.points}
            </span>
          </div>
        </div>

        {/* Bottom border glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px transition-all duration-500"
          style={{ background: hovered ? `linear-gradient(90deg, transparent, ${cat.color}, transparent)` : 'transparent' }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function CategoriesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="categorias" className="relative py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050510] to-[#050505]" />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', marginBottom: '120px' }}>
        {/* Section header */}
        <div ref={ref} className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="terminal-text text-xs text-cyan-400 tracking-widest uppercase mb-4"
          >
            {'> CATEGORÍAS DEL RETO'}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black gradient-text mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            LO QUE SE VIENE
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-lg mx-auto text-center"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            7 categorías. Niveles desde principiante hasta expert. ¿Cuál es tu especialidad?
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="section-divider mt-8 max-w-xs mx-auto"
          />
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-16">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
