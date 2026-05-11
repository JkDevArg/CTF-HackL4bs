'use client';
import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

// Procedural animated canvas background
function ProceduralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    for (let i = 0; i < 60; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
      });
    }

    let raf: number;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.005;

      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.3;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 3 + n.x * 0.01);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${0.4 + pulse * 0.4})`;
        ctx.fill();
        // Glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 8);
        grad.addColorStop(0, `rgba(0, 212, 255, 0.15)`);
        grad.addColorStop(1, 'rgba(0, 212, 255, 0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 8, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30"
      style={{ pointerEvents: 'none' }}
    />
  );
}

const STATS = [
  { label: 'PARTICIPANTES', value: '100+', suffix: '' },
  { label: 'CHALLENGES', value: '80+', suffix: '' },
  { label: 'PAÍSES', value: '5+', suffix: '' },
  { label: 'PREMIOS', value: '????', suffix: '' },
];

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="comunidad" className="relative py-32 px-4 overflow-hidden">
      <ProceduralBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#050505] to-[#050510]" />

      <div ref={ref} style={{ position: 'relative', zIndex: 10, maxWidth: '72rem', margin: '0 auto', padding: '0 1rem', marginBottom: '120px' }}>
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            className="terminal-text text-xs text-purple-400 tracking-widest uppercase mb-4"
          >
            {'> SOBRE NOSOTROS'}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black gradient-text-alt mb-4"
            style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}
          >
            LA COMUNIDAD
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="section-divider mt-6 max-w-xs mx-auto"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Logo with holographic effects */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
          >
            {/* Holographic rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[1, 1.4, 1.8, 2.2].map((s, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${s * 200}px`,
                    height: `${s * 200}px`,
                    border: `1px solid rgba(124, 58, 237, ${0.2 - i * 0.04})`,
                    boxShadow: `0 0 ${15 * s}px rgba(124, 58, 237, 0.15)`,
                    animation: `spin ${10 + i * 4}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
                  }}
                />
              ))}
            </div>

            {/* Logo */}
            <motion.div
              className="relative z-10 float-anim"
              style={{
                filter: 'drop-shadow(0 0 40px rgba(124, 58, 237, 0.6)) drop-shadow(0 0 80px rgba(0, 212, 255, 0.3))',
              }}
            >
              <Image
                src="/logo.png"
                alt="HackL4bs Cybersecurity"
                width={360}
                height={180}
                style={{ objectFit: 'contain', maxWidth: '90%', height: 'auto', margin: '0 auto', display: 'block', borderRadius: '0' }}
                className="transition-all duration-500 hover:blur-[4px] hover:scale-110 hover:drop-shadow-[0_0_20px_rgba(0,212,255,0.8)] hover:-rotate-2"
              />
            </motion.div>

            {/* Scan line effect */}
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{ borderRadius: '4px' }}
            >
              <motion.div
                className="absolute w-full h-0.5 opacity-40"
                style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)' }}
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              />
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="glass-card neon-border-purple rounded-sm mb-8" style={{ padding: '2.5rem', marginBottom: '1rem' }}>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-display)', color: '#7c3aed' }}
              >
                HACKL4BS CYBERSECURITY
              </h3>
              <p className="text-gray-300 mb-4 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                Somos unacomunidad enfocada en ciberseguridad práctica,
                donde se fomenta el aprendizaje continuo a través de la experimentación, el trabajo colaborativo y eventos técnicos.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                Nuestro CTF es para reunir todas las comunidades de latino america para compartir, aprender y crecer juntos en el mundo de la ciberseguridad.
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                  className="glass-card text-center rounded-sm"
                  style={{ borderColor: 'rgba(124, 58, 237, 0.2)', padding: '1.5rem' }}
                >
                  <div
                    className="text-3xl font-black gradient-text-alt mb-1"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {stat.value}
                    <span className="text-base text-gray-500 ml-1">{stat.suffix}</span>
                  </div>
                  <div className="text-xs text-gray-500 tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
        <div className="pb-16" />
      </div>

    </section>
  );
}
