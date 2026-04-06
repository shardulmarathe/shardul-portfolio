"use client";

import { useEffect, useRef } from "react";

type Ripple = { x: number; y: number; born: number };

const MAX_RIPPLES = 28;
const RIPPLE_MS = 2400;
const SPAWN_INTERVAL_MS = 72;
const MIN_MOVE_PX = 6;

/**
 * Calm black → navy base with cursor-originated ripples that expand and fade (water-like).
 */
export function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripplesRef = useRef<Ripple[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastSpawnRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      mouseRef.current.x = x;
      mouseRef.current.y = y;

      const now = performance.now();
      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      if (dx * dx + dy * dy < MIN_MOVE_PX * MIN_MOVE_PX) return;
      lastPosRef.current.x = x;
      lastPosRef.current.y = y;

      if (now - lastSpawnRef.current < SPAWN_INTERVAL_MS) return;
      lastSpawnRef.current = now;

      const list = ripplesRef.current;
      list.push({ x, y, born: now });
      while (list.length > MAX_RIPPLES) list.shift();
    };

    const onLeave = () => {
      lastPosRef.current.x = mouseRef.current.x;
      lastPosRef.current.y = mouseRef.current.y;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);

    const draw = (now: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      const g = ctx.createLinearGradient(0, 0, w, h * 1.02);
      g.addColorStop(0, "#000000");
      g.addColorStop(0.35, "#020617");
      g.addColorStop(0.65, "#0a1628");
      g.addColorStop(1, "#0c1a2e");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      const ambient = ctx.createRadialGradient(
        w * 0.42,
        h * 0.32,
        0,
        w * 0.48,
        h * 0.42,
        Math.max(w, h) * 0.55
      );
      ambient.addColorStop(0, "rgba(30, 58, 138, 0.22)");
      ambient.addColorStop(0.4, "rgba(15, 23, 42, 0.12)");
      ambient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, w, h);

      const cool = ctx.createRadialGradient(
        w * 0.75,
        h * 0.65,
        0,
        w * 0.75,
        h * 0.65,
        Math.min(w, h) * 0.4
      );
      cool.addColorStop(0, "rgba(14, 116, 144, 0.08)");
      cool.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = cool;
      ctx.fillRect(0, 0, w, h);

      const ripples = ripplesRef.current.filter((r) => now - r.born < RIPPLE_MS);
      ripplesRef.current = ripples;

      ctx.globalCompositeOperation = "screen";
      for (const r of ripples) {
        const age = now - r.born;
        const p = age / RIPPLE_MS;
        const ease = 1 - (1 - p) * (1 - p);
        const maxR = Math.min(w, h) * 0.2;
        const radius = ease * maxR;
        const fade = (1 - p) ** 1.75;
        const a = fade * 0.085;

        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(1, radius), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(56, 189, 248, ${a})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(1, radius * 0.58), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(125, 211, 252, ${a * 0.55})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(r.x, r.y, Math.max(1, radius * 0.28), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(186, 230, 253, ${a * 0.35})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "source-over";
      const vignette = ctx.createRadialGradient(
        w * 0.5,
        h * 0.5,
        Math.min(w, h) * 0.25,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.75
      );
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
      vignette.addColorStop(0.7, "rgba(0, 0, 0, 0.08)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.45)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
    </div>
  );
}
