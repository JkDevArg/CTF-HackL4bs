'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

const COMMUNITIES = [
  {
    id: 'comunidad-1',
    name: 'NetSentinel Academy',
    logo: '/netsentinel-academy.png', // Cambiar por la ruta real de tu imagen (ej: /comunidades/alpha.png)
    link: 'https://netsentinelacademy.com/es/',
    description: 'NetSentinel Academy se dedica a forjar la próxima generación de centinelas digitales a través de una educación integral en ciberseguridad.',
  },
  {
    id: 'comunidad-2',
    name: 'OverPwnZ',
    logo: '/overpwnz.png', // Cambiar por la ruta real de tu imagen (ej: /comunidades/alpha.png)
    link: 'https://www.linkedin.com/company/overpwnz',
    description: 'Equipo competitivo del grupo de estudio OverPwnZ. En su canal de YT comparten clases gratuitas sobre hacking y ciberseguridad, tanto Ofensiva como Defensiva.',
  },
  {
    id: 'comunidad-3',
    name: 'DarkHive',
    logo: '/darkhive.png', // Cambiar por la ruta real de tu imagen (ej: /comunidades/alpha.png)
    link: 'https://www.linkedin.com/company/darkhive2026',
    description: 'DarkHive es un grupo de estudiantes sanmarquinos apasionados por la ciberseguridad, el hacking ético y la defensa digital.',
  },
  {
    id: 'comunidad-4',
    name: 'C Cúbico UNI',
    logo: '/ccc.png', // Cambiar por la ruta real de tu imagen (ej: /comunidades/alpha.png)
    link: 'https://www.linkedin.com/company/ccc-uni',
    description: 'El Centro Cultural de Ciberseguridad - C Cúbico (FIEE-UNI) es una iniciativa estudiantil y académica que une a alumnos de ciberseguridad.',
  },
  {
    id: 'comunidad-5',
    name: 'CFC Security',
    logo: '/cfc.jpeg', // Cambiar por la ruta real de tu imagen (ej: /comunidades/alpha.png)
    link: 'https://academy.cfc-sec.com/',
    description: 'Comunidad que tiene como proposito enseñar hacking moderno por medio de laboratorios y ejercicios practicos.',
  },
  {
    id: 'comunidad-6',
    name: 'NicaSecurity',
    logo: '/nicasecurity.png', // Cambiar por la ruta real de tu imagen (ej: /comunidades/alpha.png)
    link: 'https://www.linkedin.com/company/nicasecurity/',
    description: 'NicaSecurity es una comunidad dedicada a promover el conocimiento y la colaboración en ciberseguridad en Nicaragua y más allá.',
  },
  // Para agregar más, simplemente copia un bloque de arriba y pégalo aquí abajo
];

export default function CommunitiesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="comunidades-aliadas" className="relative py-32 px-4 overflow-hidden">
      {/* Background styling compatible with the rest of the site */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#050505] to-[#050510]" />
      <div className="absolute inset-0 cyber-grid opacity-20" />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', marginBottom: '120px' }}>

        {/* Header */}
        <div ref={ref} className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="terminal-text text-xs text-purple-400 tracking-widest uppercase mb-4"
          >
            {'> ALIANZAS ESTRATÉGICAS'}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black gradient-text mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            COMUNIDADES ALIADAS
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="section-divider mt-6 max-w-xs mx-auto"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-xs text-purple-400 tracking-widest uppercase mb-4"
            style={{ fontFamily: 'var(--font-body)', padding: '15px' }}
          >
            Descubre otras comunidades aliadas, juntas creamos una escena mas fuerte.
          </motion.p>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {COMMUNITIES.map((com, i) => (
            <CommunityCard key={com.id} com={com} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}

function CommunityCard({ com, index }: { com: typeof COMMUNITIES[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.a
      ref={cardRef}
      href={com.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center p-6 glass-card rounded-sm group w-full text-center overflow-hidden cursor-pointer h-full"
      style={{
        borderColor: hovered ? 'rgba(0, 212, 255, 0.4)' : 'rgba(255, 255, 255, 0.05)',
        background: hovered ? 'rgba(0, 212, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
        transition: 'all 0.4s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -5 }}
    >
      {/* Decorative corners for futuristic vibe */}
      <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-colors duration-300 ${hovered ? 'border-cyan-400' : 'border-transparent'}`} />
      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-colors duration-300 ${hovered ? 'border-cyan-400' : 'border-transparent'}`} />
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 transition-colors duration-300 ${hovered ? 'border-cyan-400' : 'border-transparent'}`} />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-colors duration-300 ${hovered ? 'border-cyan-400' : 'border-transparent'}`} />

      {/* Holographic sweep effect */}
      <div className="holo-line absolute inset-0 z-0 opacity-50" />

      {/* Logo container */}
      <div className="relative w-24 h-24 mb-6 flex items-center justify-center z-10">
        {/* Glow behind the logo on hover */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-500"
          style={{
            background: hovered ? 'radial-gradient(circle, rgba(0,212,255,0.4) 0%, transparent 70%)' : 'transparent',
            filter: 'blur(15px)',
            transform: hovered ? 'scale(1.5)' : 'scale(1)',
          }}
        />

        {/* The actual image */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {/* Si usas logos que no están en /public, asegúrate de configurarlo en next.config.ts */}
          {/* Fallback visual temporal si el archivo no existe o no carga (Opcional, pero util si solo pones el string vacio) */}
          {com.logo ? (
            <Image
              src={com.logo}
              alt={com.name}
              fill
              sizes="96px"
              style={{
                objectFit: 'contain',
                filter: hovered
                  ? 'drop-shadow(0 0 15px rgba(0,212,255,0.8)) saturate(1.5)'
                  : 'grayscale(80%) opacity(60%)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: hovered ? 'scale(1.1) rotate(2deg)' : 'scale(1) rotate(0deg)',
                borderRadius: '0', /* Sobrescribe el 30% del globals.css si es un logo transparente */
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 border border-cyan-400/30">
              {com.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <h3
        className="text-lg font-bold mb-3 z-10 transition-colors duration-300"
        style={{
          fontFamily: 'var(--font-display)',
          color: hovered ? '#00d4ff' : '#e8e8f0',
          textShadow: hovered ? '0 0 10px rgba(0,212,255,0.6)' : 'none',
        }}
      >
        {com.name}
      </h3>

      {/* Description */}
      <p
        className="text-xs text-gray-400 leading-relaxed z-10 flex-1"
        style={{ fontFamily: 'var(--font-body)', transition: 'color 0.3s', color: hovered ? '#e8e8f0' : '#9ca3af' }}
      >
        {com.description}
      </p>

    </motion.a>
  );
}
