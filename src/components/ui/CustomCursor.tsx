'use client';
import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const followerPosRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };

    const animate = () => {
      followerPosRef.current.x += (posRef.current.x - followerPosRef.current.x) * 0.12;
      followerPosRef.current.y += (posRef.current.y - followerPosRef.current.y) * 0.12;
      if (followerRef.current) {
        followerRef.current.style.left = `${followerPosRef.current.x}px`;
        followerRef.current.style.top = `${followerPosRef.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    const onEnter = () => {
      if (cursorRef.current) cursorRef.current.style.transform = 'translate(-50%, -50%) scale(1.8)';
      if (followerRef.current) { followerRef.current.style.width = '60px'; followerRef.current.style.height = '60px'; }
    };
    const onLeave = () => {
      if (cursorRef.current) cursorRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
      if (followerRef.current) { followerRef.current.style.width = '40px'; followerRef.current.style.height = '40px'; }
    };

    window.addEventListener('mousemove', move);
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}
