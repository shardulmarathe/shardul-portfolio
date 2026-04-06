"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import clsx from "clsx";

const LINKS = [
  { href: "/", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/past", label: "Past Self" },
  { href: "/fun", label: "Fun Stuff" },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

type GlassNavBarProps = {
  /** `hero`: under quote on home. `page`: top bar on inner routes. */
  variant?: "hero" | "page";
};

export function GlassNavBar({ variant = "hero" }: GlassNavBarProps) {
  const pathname = usePathname();
  const [glow, setGlow] = useState<{ x: number; y: number } | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setGlow({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const onLeave = () => setGlow(null);

  return (
    <motion.nav
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
      className={clsx(
        "relative z-10 mx-auto w-full px-1",
        variant === "hero" &&
          "mt-9 max-w-lg sm:mt-11 sm:max-w-xl md:mt-12 md:max-w-2xl",
        variant === "page" &&
          "max-w-5xl border-b border-white/[0.06] pb-6 pt-2 sm:pb-8 sm:pt-4"
      )}
      aria-label="Site navigation"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-zinc-950/45 px-8 py-1 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(56,189,248,0.06)] backdrop-blur-xl sm:px-10 sm:py-1.5 lg:px-12"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
        >
          <div
            className="absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/15 blur-2xl transition-[left,top] duration-300 ease-out"
            style={{
              left: glow?.x ?? "-20%",
              top: glow?.y ?? "50%",
            }}
          />
        </div>

        <ul className="relative z-[1] flex min-w-0 flex-row flex-nowrap items-center justify-between gap-x-4 sm:gap-x-5 md:gap-x-6">
          {LINKS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : item.href === "/past"
                  ? pathname === "/past" || pathname.startsWith("/past/")
                  : pathname === item.href;

            const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
              if (item.href === "/" && pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            };

            return (
              <li key={item.href} className="relative">
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <Link
                    href={item.href}
                    scroll={item.href === "/" && pathname === "/" ? false : true}
                    onClick={onNavClick}
                    className={clsx(
                      "relative block overflow-hidden rounded-xl px-5 py-3 text-sm font-medium tracking-tight transition-[color,box-shadow,filter] duration-200 sm:px-6 sm:text-base",
                      isActive
                        ? "text-white brightness-110"
                        : "text-zinc-400 hover:text-sky-100/95 hover:shadow-[0_0_22px_-6px_rgba(56,189,248,0.28)] hover:brightness-110"
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="glass-nav-active"
                        className="absolute inset-0 z-0 rounded-xl bg-sky-500/[0.14] shadow-[0_0_24px_-6px_rgba(56,189,248,0.35)] ring-1 ring-sky-400/25"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 34,
                        }}
                      />
                    ) : null}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.nav>
  );
}
