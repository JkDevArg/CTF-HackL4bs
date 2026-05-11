'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function GlitchText({ text, className = '', delay = 0 }: GlitchTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [glitching, setGlitching] = useState(false);
  const glitchChars = '!<>-_\\/[]{}—=+*^?#';

  useEffect(() => {
    const timer = setTimeout(() => {
      let iteration = 0;
      const total = text.length;
      const interval = setInterval(() => {
        setDisplayed(
          text.split('').map((char, i) => {
            if (i < iteration) return char;
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
          }).join('')
        );
        if (iteration >= total) { clearInterval(interval); setDisplayed(text); }
        iteration += 0.5;
      }, 40);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  useEffect(() => {
    const glitch = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 8000);
    return () => clearInterval(glitch);
  }, []);

  return (
    <span 
      className={`${className} ${glitching ? 'animate-pulse' : ''}`}
      data-text={text}
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {displayed}
    </span>
  );
}

interface TypewriterProps {
  lines: string[];
  className?: string;
  speed?: number;
}

export function Typewriter({ lines, className = '', speed = 50 }: TypewriterProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (currentLine >= lines.length) { setDone(true); return; }
    const line = lines[currentLine];
    let i = 0;
    const timer = setInterval(() => {
      setCurrentText(line.slice(0, i + 1));
      i++;
      if (i >= line.length) {
        clearInterval(timer);
        setTimeout(() => {
          setCurrentLine(prev => prev + 1);
          setCurrentText('');
        }, 600);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [currentLine, lines, speed]);

  return (
    <div className={className} style={{ fontFamily: 'var(--font-mono)' }}>
      {lines.slice(0, currentLine).map((line, i) => (
        <div key={i} className="text-green-400 text-sm">
          <span className="text-cyan-400 mr-2">{'>'}</span>{line}
        </div>
      ))}
      {!done && (
        <div className="text-green-400 text-sm">
          <span className="text-cyan-400 mr-2">{'>'}</span>
          {currentText}
          <span className="cursor-blink text-green-400">_</span>
        </div>
      )}
    </div>
  );
}

interface CountdownProps {
  targetDate: Date;
}

export function Countdown({ targetDate }: CountdownProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  const Unit = ({ value, label }: { value: number; label: string }) => (
    <motion.div
      key={value}
      className="flex flex-col items-center"
    >
      <div className="glass-card neon-border relative w-20 h-20 md:w-28 md:h-28 flex items-center justify-center overflow-hidden">
        <div className="holo-line absolute inset-0" />
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl md:text-4xl font-bold glow-text-blue"
            style={{ fontFamily: 'var(--font-display)', color: '#00d4ff' }}
          >
            {String(value).padStart(2, '0')}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-xs uppercase tracking-widest text-gray-400" style={{ fontFamily: 'var(--font-body)' }}>
        {label}
      </span>
    </motion.div>
  );

  return (
    <div className="flex gap-4 md:gap-6 items-center justify-center">
      <Unit value={time.days} label="Días" />
      <span className="text-2xl text-cyan-400 glow-text-cyan mb-8">:</span>
      <Unit value={time.hours} label="Horas" />
      <span className="text-2xl text-cyan-400 glow-text-cyan mb-8">:</span>
      <Unit value={time.minutes} label="Min" />
      <span className="text-2xl text-cyan-400 glow-text-cyan mb-8">:</span>
      <Unit value={time.seconds} label="Seg" />
    </div>
  );
}
