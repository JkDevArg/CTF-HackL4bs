'use client';
import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TERMINAL_LINES = [
  { text: 'root@hackl4bs:~# whoami', delay: 0, color: '#00d4ff' },
  { text: 'hackl4bs_root', delay: 600, color: '#00ff41' },
  { text: 'root@hackl4bs:~# cat /etc/ctf/status', delay: 1200, color: '#00d4ff' },
  { text: '[✓] SISTEMA: ONLINE', delay: 1800, color: '#00ff41' },
  { text: '[✓] CHALLENGES: DEPLOYED', delay: 2100, color: '#00ff41' },
  { text: '[✓] SCOREBOARD: ACTIVE', delay: 2400, color: '#00ff41' },
  { text: '[!] CTF START: 2026-06-20T00:00:00Z', delay: 2700, color: '#f59e0b' },
  { text: 'root@hackl4bs:~# ping community', delay: 3300, color: '#00d4ff' },
  { text: 'PONG from hackl4bs.io — 1ms — LATENCY: MINIMAL', delay: 3900, color: '#00ff41' },
  { text: 'root@hackl4bs:~# _', delay: 4500, color: '#00d4ff' },
];

const NETWORK_NODES = [
  { label: 'SERVER-01', lat: '40.7128° N', lon: '74.0060° W', status: 'ONLINE', ping: '12ms' },
  { label: 'SERVER-02', lat: '51.5074° N', lon: '0.1278° W', status: 'ONLINE', ping: '38ms' },
  { label: 'SERVER-03', lat: '-34.6037° S', lon: '58.3816° W', status: 'ONLINE', ping: '4ms' },
  { label: 'CDN-EDGE', lat: '1.3521° N', lon: '103.8198° E', status: 'ACTIVE', ping: '89ms' },
];

function AnimatedTerminal() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);

  useEffect(() => {
    TERMINAL_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i]);
      }, line.delay);
    });
  }, []);

  return (
    <div
      className="glass-card neon-border rounded-sm font-mono text-sm"
      style={{ fontFamily: 'var(--font-mono)', minHeight: '280px', padding: '1.5rem' }}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 mb-4 pb-3" style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 opacity-70" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 opacity-70" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 opacity-70" />
        <span className="ml-3 text-xs text-gray-500">hackl4bs_terminal — bash</span>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-400">CONNECTED</span>
        </div>
      </div>

      {/* Terminal lines */}
      <div className="space-y-1">
        {TERMINAL_LINES.map((line, i) => (
          visibleLines.includes(i) && (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start"
            >
              <span style={{ color: line.color }}>
                {line.text}
                {i === TERMINAL_LINES.length - 1 && (
                  <span className="cursor-blink">█</span>
                )}
              </span>
            </motion.div>
          )
        ))}
      </div>
    </div>
  );
}

function NetworkStatus() {
  return (
    <div className="glass-card rounded-sm" style={{ borderColor: 'rgba(124, 58, 237, 0.2)', padding: '1.5rem' }}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-purple-400 tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
          NETWORK MAP
        </span>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-green-400"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <span className="text-xs text-green-400" style={{ fontFamily: 'var(--font-mono)' }}>ALL SYSTEMS OPERATIONAL</span>
        </div>
      </div>
      <div className="space-y-3">
        {NETWORK_NODES.map((node, i) => (
          <motion.div
            key={node.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between py-2"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 6px #00d4ff' }} />
              <span className="text-xs font-bold text-gray-300" style={{ fontFamily: 'var(--font-mono)' }}>
                {node.label}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500" style={{ fontFamily: 'var(--font-mono)' }}>
              <span>{node.lat}</span>
              <span className="text-green-400">{node.ping}</span>
              <span
                className="px-1.5 py-0.5"
                style={{ background: 'rgba(0, 255, 65, 0.1)', color: '#00ff41', border: '1px solid rgba(0, 255, 65, 0.2)' }}
              >
                {node.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative pt-24 pb-8 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] to-[#020208]" />
      <div className="absolute inset-0 cyber-grid opacity-10" />

      {/* Top divider */}
      <div className="section-divider mb-16" />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '72rem', margin: '0 auto', padding: '0 1rem' }}>
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <AnimatedTerminal />
          <NetworkStatus />
        </div>

        {/* Logo + links */}
        <div className="grid md:grid-cols-3 gap-8 mb-12 py-8" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '2rem' }}>
          <div>
            <div
              className="text-2xl font-black gradient-text mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              HACKL4BS
            </div>
            <p className="text-xs text-gray-500 mb-4" style={{ fontFamily: 'var(--font-body)' }}>
              Cybersecurity Community · CTF 2026
            </p>
            <div className="flex gap-3">
              {['Twitter', 'Discord', 'GitHub'].map(s => (
                <a
                  key={s}
                  href="https://discord.gg/bcx4NXXS5F"
                  id={`footer-${s.toLowerCase()}`}
                  className="text-xs text-gray-500 hover:text-cyan-400 transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-mono)' }}>
              NAVEGACIÓN
            </p>
            {[
              { label: 'Inicio', href: '#hero' },
              { label: 'Categorías', href: '#categorias' },
              { label: 'Timeline', href: '#timeline' },
              { label: 'Comunidad', href: '#comunidad' },
              { label: 'FAQ', href: '#faq' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                className="block text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200 mb-1"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-mono)' }}>
              INTEL
            </p>
            <div className="space-y-2 text-xs text-gray-600" style={{ fontFamily: 'var(--font-mono)' }}>
              <div>CLASIFICACIÓN: <span className="text-yellow-500">PÚBLICO</span></div>
              <div>ENCRIPTACIÓN: <span className="text-green-400">AES-256</span></div>
              <div>PROTOCOLO: <span className="text-cyan-400">TLS 1.3</span></div>
              <div>UPTIME: <span className="text-green-400">99.9%</span></div>
              <div className="pt-2">
                COORDENADAS: <br />
                <span className="text-gray-500">-34.6037° / -58.3816°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between py-4 text-xs text-gray-600"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)', fontFamily: 'var(--font-mono)' }}
        >
          <span>© 2026 HackL4bs Cybersecurity · All rights reserved</span>
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <span className="text-green-400">SISTEMA ONLINE</span>
            <span>·</span>
            <span>SCANNING...</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
