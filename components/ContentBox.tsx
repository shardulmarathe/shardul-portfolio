"use client";

import { motion } from "framer-motion";

type ContentBoxProps = {
  title: string;
  children: React.ReactNode;
};

export function ContentBox({ title, children }: ContentBoxProps) {
  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="w-full rounded-2xl border border-white/[0.09] bg-zinc-950/55 p-6 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.8),0_0_0_1px_rgba(56,189,248,0.04)_inset] backdrop-blur-md transition-shadow duration-300 hover:border-sky-500/20 hover:shadow-[0_18px_48px_-14px_rgba(56,189,248,0.12),0_12px_40px_-18px_rgba(0,0,0,0.8)] sm:p-7"
    >
      <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
        {title}
      </h2>
      <div className="mt-4 text-pretty text-[15px] leading-relaxed text-slate-300 sm:text-base">
        {children}
      </div>
    </motion.article>
  );
}
