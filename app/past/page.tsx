import { GlassNavBar } from "@/components/GlassNavBar";
import { PastSelfGraph } from "@/components/PastSelfGraph";
import { WaveBackground } from "@/components/WaveBackground";

export default function PastPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-zinc-100">
      <WaveBackground />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 pb-16 pt-6 sm:px-10 lg:px-14 xl:max-w-6xl">
        <GlassNavBar variant="page" />

        <header className="mt-8 shrink-0 text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Past Self
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          A snapshot of how I spent my time in high school. Each node represents a meaningul role that shaped who I am today.
          </p>
        </header>

        <div className="mt-8 flex min-h-0 flex-1 flex-col">
          <PastSelfGraph />
        </div>
      </div>
    </div>
  );
}
