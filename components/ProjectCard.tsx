"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import clsx from "clsx";

const EASE = [0.22, 1, 0.36, 1] as const;

type ProjectCardProps = {
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  priority?: boolean;
  imagePreviewZoom?: "subtle";
};

export function ProjectCard({
  title,
  description,
  href,
  imageSrc,
  priority = false,
  imagePreviewZoom,
}: ProjectCardProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: EASE }}
      whileHover={{ y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-zinc-950/50 p-5 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(56,189,248,0.06)] backdrop-blur-xl transition-[box-shadow,border-color,transform] duration-300 hover:border-sky-400/35 hover:shadow-[0_28px_64px_-14px_rgba(56,189,248,0.22),0_20px_48px_-12px_rgba(0,0,0,0.9)] sm:p-6"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/[0.07] via-transparent to-cyan-500/[0.05]" />
      </div>

      <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-900 shadow-inner">
        <Image
          src={imageSrc}
          alt={`${title} interface preview`}
          fill
          priority={priority}
          sizes="(max-width: 767px) 100vw, (max-width: 900px) 46vw, 360px"
          className={clsx(
            "object-cover object-top origin-center transition-transform duration-500 ease-out",
            imagePreviewZoom === "subtle"
              ? "scale-[1.06] group-hover:scale-[1.09]"
              : "scale-100 group-hover:scale-[1.02]"
          )}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/30 via-transparent to-zinc-950/10 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
      </div>

      <div className="relative flex flex-1 flex-col">
        <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
          {title}
        </h2>
        <p className="mt-1.5 text-pretty text-sm leading-relaxed text-slate-400 sm:text-[15px]">
          {description}
        </p>
        <span className="mt-4 inline-flex translate-x-[-4px] items-center gap-1 text-sm font-medium text-sky-300/90 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          View project
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </div>
    </motion.a>
  );
}
