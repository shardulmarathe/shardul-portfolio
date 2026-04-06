"use client";

import { LandingHero } from "@/components/LandingHero";
import { ProfilePhoto } from "@/components/ProfilePhoto";
import { StackedContentBoxes } from "@/components/StackedContentBoxes";
import { LandingSidebar } from "@/components/LandingSidebar";

export function LandingContent() {
  return (
    <main className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
      <div className="flex w-full max-w-5xl flex-col xl:max-w-6xl">
        <LandingHero />

        <div className="mt-8 min-h-0 sm:mt-10 lg:mt-12 xl:mt-14">
          {/*
            Shared row: boxes (stretch + justify-between) | photo + buttons.
          */}
          <div className="hidden min-h-0 lg:flex lg:flex-row lg:items-stretch lg:gap-x-10 xl:gap-x-12">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <StackedContentBoxes stretch />
            </div>

            <div className="flex w-[280px] shrink-0 flex-col gap-4">
              <div className="shrink-0">
                <ProfilePhoto />
              </div>
              <div className="flex min-h-0 flex-1 flex-col justify-end">
                <LandingSidebar />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:hidden">
            <div className="mx-auto">
              <ProfilePhoto />
            </div>
            <StackedContentBoxes />
            <LandingSidebar />
          </div>
        </div>
      </div>
    </main>
  );
}
