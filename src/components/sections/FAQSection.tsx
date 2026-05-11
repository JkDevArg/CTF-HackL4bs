'use client';
import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: '¿Quién puede participar?',
    a: 'Cualquier persona interesada en ciberseguridad. No importa tu nivel — desde estudiantes hasta profesionales. Los challenges están diseñados en escala de dificultad para todos.',
  },
  {
    q: '¿Cómo se forman los equipos?',
    a: 'Puedes participar solo o en equipos de máximo 4 personas. El registro se hace por equipo. Si no tienes equipo, usá nuestro canal de Discord para encontrar compañeros.',
  },
  {
    q: '¿Qué herramientas necesito?',
    a: 'Una computadora con conexión a internet y Linux/Kali instalado (o VM). Nosotros proveemos la infraestructura de challenges. Herramientas comunes: BurpSuite, Wireshark, Python, GDB.',
  },
  {
    q: '¿Cómo funciona el sistema de puntaje?',
    a: 'Cada challenge tiene puntos base. Los primeros en resolverlo obtienen puntos extra (first blood bonus). El scoreboard se actualiza en tiempo real. Las flags tienen formato: HL4B{...}',
  },
  {
    q: '¿Hay premios físicos o son digitales?',
    a: 'Todos los premios son digitales',
  },
  {
    q: '¿Puedo jugar desde cualquier país?',
    a: 'Sí. El CTF es 100% online. Tenemos participantes de toda Latinoamérica, España y más. La plataforma está optimizada para conexiones de diferentes regiones.',
  },
  {
    q: '¿Qué pasa si encuentro un bug en la plataforma?',
    a: 'Reportalo responsablemente a nuestro canal de moderadores en Discord. El bug bounty de la plataforma tiene recompensas separadas. No se permite explotar bugs para ganar ventaja.',
  },
];

function FAQItem({ item, index }: { item: typeof FAQS[0]; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="border-b last:border-b-0"
      style={{ borderColor: 'rgba(0, 212, 255, 0.1)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-center justify-between group text-left"
        id={`faq-${index}`}
        aria-expanded={open}
      >
        <span
          className="flex items-center gap-4 flex-1"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          <span
            className="text-xs shrink-0 w-8 text-center"
            style={{ fontFamily: 'var(--font-mono)', color: open ? '#00d4ff' : '#4b5563' }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            className="text-base font-semibold transition-colors duration-300"
            style={{ color: open ? '#e8e8f0' : '#9ca3af' }}
          >
            {item.q}
          </span>
        </span>

        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 ml-4"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ color: open ? '#00d4ff' : '#4b5563' }}
          >
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div className="pb-5 pl-12 pr-4">
              <div
                className="relative glass-card rounded-sm p-4 text-sm text-gray-300 leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', borderLeft: '2px solid #00d4ff30', padding: '1rem' }}
              >
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
                  style={{ background: 'linear-gradient(180deg, #00d4ff, #7c3aed)', boxShadow: '0 0 6px #00d4ff40' }}
                />
                {item.a}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="faq" className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] to-[#050505]" />
      <div className="absolute inset-0 cyber-grid opacity-20" />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '48rem', margin: '0 auto', padding: '0 1rem', marginBottom: '120px' }}>
        <div ref={ref} className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="terminal-text text-xs text-cyan-400 tracking-widest uppercase mb-4"
          >
            {'> QUERIES & RESPONSES'}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black gradient-text mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            FAQ
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="text-gray-400"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Todo lo que necesitás saber antes de entrar al campo de batalla.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="section-divider mt-6 max-w-xs mx-auto"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="glass-card neon-border rounded-sm overflow-hidden"
        >
          <div style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem', padding: '1rem' }}>
            {FAQS.map((item, i) => (
              <FAQItem key={i} item={item} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Discord CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 text-sm mb-4" style={{ fontFamily: 'var(--font-body)', paddingTop: '3rem' }}>
            ¿Tenés más preguntas? Unite a nuestro Discord.
          </p>
          <a
            href="https://discord.gg/4AqjFDZYmz"
            id="discord-link"
            className="btn-cyber inline-block text-purple-400"
            style={{ fontFamily: 'var(--font-display)', borderColor: '#7c3aed' }}
          >
            DISCORD → HACKL4BS
          </a>
        </motion.div>
        <div className="pb-16" />
      </div>
    </section>
  );
}
