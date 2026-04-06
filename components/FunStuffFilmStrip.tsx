"use client";

import Image from "next/image";
import clsx from "clsx";

type FunStuffFilmStripProps = {
  side: "left" | "right";
  images: string[];
  /** Full loop duration in seconds (linear, infinite). */
  durationSec: number;
};

export function FunStuffFilmStrip({
  side,
  images,
  durationSec,
}: FunStuffFilmStripProps) {
  const loop = [...images, ...images];

  return (
    <div
      className={clsx(
        "pointer-events-none fixed inset-y-0 z-[5] hidden w-[6.25rem] overflow-hidden md:block md:w-32 lg:w-36 xl:w-[9.75rem]",
        side === "left" ? "left-10" : "right-10"
      )}
      aria-hidden
    >
      {/* Vertical fade — soft edges */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black via-black/40 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-b from-transparent via-black/40 to-black" />

      <div
        className="fun-film-strip-track flex flex-col gap-3 px-1.5 py-6 sm:gap-4"
        style={{ animationDuration: `${durationSec}s` }}
      >
        {loop.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-xl opacity-[0.38] [filter:blur(0.5px)] sm:opacity-[0.42] lg:opacity-[0.48]"
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 128px, 156px"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
