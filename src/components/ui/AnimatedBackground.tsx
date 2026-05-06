"use client";

import { useEffect, useRef } from 'react';

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

const COLORS = [
  'rgba(232, 67, 147, 0.12)',   // Pink
  'rgba(0, 206, 201, 0.10)',    // Aqua
  'rgba(162, 155, 254, 0.10)',  // Lavender
  'rgba(253, 203, 110, 0.06)', // Gold
  'rgba(0, 184, 148, 0.08)',   // Green
];

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let orbs: Orb[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createOrbs = () => {
      const count = Math.min(Math.floor(window.innerWidth / 200), 6);
      orbs = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 200 + 150,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.002 + 0.001,
        pulsePhase: Math.random() * Math.PI * 2,
      }));
    };

    const drawOrb = (orb: Orb, time: number) => {
      const pulse = Math.sin(time * orb.pulseSpeed + orb.pulsePhase) * 0.3 + 0.7;
      const gradient = ctx.createRadialGradient(
        orb.x, orb.y, 0,
        orb.x, orb.y, orb.radius * pulse
      );
      gradient.addColorStop(0, orb.color);
      gradient.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius * pulse, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      orbs.forEach((orb) => {
        // Move orb
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce off edges smoothly
        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;

        drawOrb(orb, time);
      });

      animationId = requestAnimationFrame(animate);
    };

    resize();
    createOrbs();
    animationId = requestAnimationFrame(animate);

    window.addEventListener('resize', () => {
      resize();
      createOrbs();
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
