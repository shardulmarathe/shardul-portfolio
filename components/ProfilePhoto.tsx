"use client";

import Image from "next/image";
import { useState } from "react";
import { SITE } from "@/lib/site";

export function ProfilePhoto() {
  const [photoFailed, setPhotoFailed] = useState(false);
  const showImage = Boolean(SITE.profileImage) && !photoFailed;

  return (
    <div className="relative w-full max-w-[280px] shrink-0 sm:max-w-[280px]">
      <div
        className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-sky-500/20 via-blue-600/10 to-transparent opacity-80 blur-lg"
        aria-hidden
      />
      {showImage ? (
        <Image
          src={SITE.profileImage}
          alt={`${SITE.name} portrait`}
          width={280}
          height={280}
          priority
          className="relative aspect-square w-full rounded-2xl object-cover object-[center_20%] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] ring-1 ring-sky-500/25"
          onError={() => setPhotoFailed(true)}
        />
      ) : (
        <div
          className="relative flex aspect-square w-full items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-zinc-950 text-3xl font-semibold text-white/90 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] ring-1 ring-sky-500/25"
          role="img"
          aria-label={SITE.name}
        >
          {SITE.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
      )}
    </div>
  );
}
