"use client";

import { useEffect, useRef } from "react";

type Tone = "brand" | "light";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

type Ripple = { x: number; y: number; life: number };

/**
 * Slow wireless mesh: drifting nodes, faint links, and an occasional signal ring.
 * Sits behind hero content and does not capture clicks.
 */
export function SignalField({
  className = "",
  tone = "brand",
}: {
  className?: string;
  tone?: Tone;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    // Nested functions do not keep the null check, so capture the narrowed values.
    const surface = canvas;
    const host = parent;
    const context = surface.getContext("2d");
    if (!context) return;
    const ctx = context;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles: Particle[] = [];
    const ripples: Ripple[] = [];
    let frame = 0;
    let raf = 0;

    function resize() {
      const width = host.clientWidth;
      const height = host.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      surface.width = Math.max(1, Math.floor(width * dpr));
      surface.height = Math.max(1, Math.floor(height * dpr));
      surface.style.width = `${width}px`;
      surface.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(48, Math.max(16, (width * height) / 22000)));
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          r: Math.random() * 1.3 + 0.7,
        });
      }
    }

    function palette() {
      const dark = document.documentElement.classList.contains("dark");
      if (tone === "light") {
        return {
          dot: "rgba(255,255,255,0.9)",
          line: "rgba(255,255,255,0.35)",
          ring: "rgba(255,255,255,0.55)",
        };
      }
      if (dark) {
        return {
          dot: "rgba(186,230,253,0.75)",
          line: "rgba(125,211,252,0.2)",
          ring: "rgba(186,230,253,0.4)",
        };
      }
      return {
        dot: "rgba(37,99,235,0.5)",
        line: "rgba(14,165,233,0.22)",
        ring: "rgba(37,99,235,0.32)",
      };
    }

    function draw() {
      const width = host.clientWidth;
      const height = host.clientHeight;
      ctx.clearRect(0, 0, width, height);
      const { dot, line, ring } = palette();
      const linkDistance = Math.min(130, Math.max(80, width * 0.16));

      if (!reduce) {
        for (const particle of particles) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        }
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < linkDistance) {
            ctx.globalAlpha = (1 - distance / linkDistance) * 0.85;
            ctx.strokeStyle = line;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      ctx.fillStyle = dot;
      for (const particle of particles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduce && frame % 200 === 0 && particles.length > 0) {
        const origin = particles[Math.floor(Math.random() * particles.length)];
        ripples.push({ x: origin.x, y: origin.y, life: 0 });
      }

      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const ripple = ripples[i];
        ripple.life += 1;
        const alpha = Math.max(0, 1 - ripple.life / 80);
        ctx.globalAlpha = alpha * 0.65;
        ctx.strokeStyle = ring;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.life * 1.15, 0, Math.PI * 2);
        ctx.stroke();
        if (ripple.life > 80) ripples.splice(i, 1);
      }
      ctx.globalAlpha = 1;

      frame += 1;
      if (!reduce) raf = requestAnimationFrame(draw);
    }

    const observer = new ResizeObserver(() => {
      resize();
      if (reduce) draw();
    });
    observer.observe(host);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [tone]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
