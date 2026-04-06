"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/site";
import { GlassNavBar } from "@/components/GlassNavBar";

const headingClass =
  "text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl lg:leading-[1.05]";

export function LandingHero() {
  const { lines, attribution } = SITE.heroQuote;

  return (
    <header className="mx-auto w-full max-w-3xl text-center lg:max-w-4xl xl:max-w-5xl">
      <motion.h1
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        className={headingClass}
      >
        {SITE.name}
      </motion.h1>

      <motion.blockquote
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const }}
        className="mt-5 sm:mt-6"
      >
        <p className="text-pretty text-base font-light italic leading-relaxed text-slate-400 sm:text-lg md:text-[1.125rem] md:leading-relaxed">
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        <footer className="mt-3 text-center text-sm font-medium not-italic text-slate-500 sm:mt-4 sm:text-[15px]">
          — {attribution}
        </footer>
      </motion.blockquote>

      <GlassNavBar variant="hero" />
    </header>
  );
}
