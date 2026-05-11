'use client';
import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const PHASES = [
  {
    id: 'apertura',
    phase: '01',
    name: 'APERTURA',
    date: 'MAY 16 · 2026',
    description: 'Portal abierto. Los participantes se registran y exploran el entorno de batalla.',
    details: ['Registro de equipos (max 4)', 'Plataforma disponible 24/7', 'Acceso a challenges básicos'],
    status: 'UPCOMING',
    color: '#00d4ff',
  },
  {
    id: 'clasificatorias',
    phase: '02',
    name: 'CLASIFICATORIAS',
    date: 'JUN 20 · 2026',
    description: 'La competencia se intensifica. Solo los mejores avanzan a la fase final.',
    details: ['16h de duración continua', 'Scoreboard en tiempo real', 'Los top 10 avanzan'],
    status: 'UPCOMING',
    color: '#7c3aed',
  },
  {
    id: 'finals',
    phase: '03',
    name: 'FINAL',
    date: 'JUN 27 · 2026',
    description: 'El enfrentamiento definitivo. Los mejores equipos deberan demostrar su experiencia',
    details: ['CTF Final en vivo', 'Challenges exclusivos', 'Jurado de expertos'],
    status: 'UPCOMING',
    color: '#ef4444',
  },
  {
    id: 'premios',
    phase: '04',
    name: 'PREMIOS',
    date: 'JUN 27 · 2026',
    description: 'La ceremonia de reconocimiento. Entrevista a los equipos finalistas y entrega de premios.',
    details: ['???'],
    status: 'UPCOMING',
    color: '#f59e0b',
  },
];

function TimelineItem({ item, index, total }: { item: typeof PHASES[0]; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      className={`relative flex ${isLeft ? 'flex-row' : 'flex-row-reverse'} items-center gap-8 mb-16`}
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Content card */}
      <div className={`w-full md:w-5/12 ${isLeft ? 'text-right' : 'text-left'}`}>
        <div className="glass-card rounded-sm relative overflow-hidden" style={{ borderColor: `${item.color}25`, padding: '2rem' }}>
          <div className="holo-line absolute inset-0" />

          <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'justify-end' : 'justify-start'}`}>
            <span
              className="text-xs px-2 py-1"
              style={{
                fontFamily: 'var(--font-mono)',
                color: item.color,
                background: `${item.color}15`,
                border: `1px solid ${item.color}30`,
              }}
            >
              PHASE {item.phase}
            </span>
            <span className="text-xs text-gray-500" style={{ fontFamily: 'var(--font-mono)' }}>
              {item.date}
            </span>
          </div>

          <h3
            className="text-2xl font-black mb-2"
            style={{ fontFamily: 'var(--font-display)', color: item.color, textShadow: `0 0 20px ${item.color}50` }}
          >
            {item.name}
          </h3>
          <p className="text-gray-400 text-sm mb-4" style={{ fontFamily: 'var(--font-body)' }}>
            {item.description}
          </p>
          <ul className={`space-y-1 ${isLeft ? 'items-end' : 'items-start'} flex flex-col`}>
            {item.details.map((d, i) => (
              <li
                key={i}
                className="text-xs text-gray-500 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-mono)', flexDirection: isLeft ? 'row-reverse' : 'row' }}
              >
                <span style={{ color: item.color }}>◆</span>
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Center node */}
      <div className="hidden md:flex flex-col items-center w-2/12">
        <motion.div
          className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${item.color}40, transparent)`,
            border: `2px solid ${item.color}`,
            boxShadow: `0 0 20px ${item.color}60, 0 0 40px ${item.color}30`,
          }}
          animate={{
            scale: [1, 1.1, 1], boxShadow: [
              `0 0 20px ${item.color}60`,
              `0 0 40px ${item.color}80`,
              `0 0 20px ${item.color}60`,
            ]
          }}
          transition={{ repeat: Infinity, duration: 2, delay: index * 0.5 }}
        >
          <span className="text-white font-black text-sm" style={{ fontFamily: 'var(--font-display)' }}>
            {item.phase}
          </span>
        </motion.div>
      </div>

      {/* Empty space for alternating layout */}
      <div className="hidden md:block w-5/12" />
    </motion.div>
  );
}

export default function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const lineHeight = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '100%']);

  return (
    <section id="timeline" className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] to-[#050510]" />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '64rem', margin: '0 auto', padding: '0 1rem', marginBottom: '120px' }}>
        {/* Header */}
        <div ref={ref} className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="terminal-text text-xs text-cyan-400 tracking-widest uppercase mb-4"
          >
            {'> FASES DEL EVENTO'}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black gradient-text mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            TIMELINE
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="section-divider mt-6 max-w-xs mx-auto"
          />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gray-800 -translate-x-1/2" />
          <motion.div
            className="hidden md:block absolute left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-cyan-400 via-purple-600 to-amber-500"
            style={{ height: lineHeight, boxShadow: '0 0 8px rgba(0,212,255,0.5)' }}
          />

          {PHASES.map((item, i) => (
            <TimelineItem key={item.id} item={item} index={i} total={PHASES.length} />
          ))}
        </div>
        <div className="pb-16" />
      </div>
    </section>
  );
}
