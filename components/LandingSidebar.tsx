"use client";

import { motion } from "framer-motion";
import { SITE } from "@/lib/site";

const btnClass =
  "flex h-12 w-full items-center justify-center rounded-xl border border-white/[0.1] bg-zinc-950/60 text-[15px] font-medium text-zinc-200 shadow-[0_8px_28px_-14px_rgba(0,0,0,0.85)] backdrop-blur-sm transition-[border-color,box-shadow,color] duration-300";

const links = [
  { href: SITE.email, label: "Email", external: false },
  { href: SITE.github, label: "GitHub", external: true },
  { href: SITE.linkedin, label: "LinkedIn", external: true },
] as const;

/** Stacked Email / GitHub / LinkedIn — same styling as before (profile moved to ProfilePhoto). */
export function LandingSidebar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] as const }}
      className="flex w-full max-w-[280px] flex-col gap-3"
      aria-label="Contact links"
    >
      {links.map(({ href, label, external }) => (
        <motion.a
          key={label}
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          whileHover={{ y: -3, scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 420, damping: 24 }}
          className={`${btnClass} hover:border-sky-500/35 hover:text-white hover:shadow-[0_14px_36px_-12px_rgba(56,189,248,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400/50`}
        >
          {label}
        </motion.a>
      ))}
    </motion.nav>
  );
}
