import { FunStuffCard } from "@/components/FunStuffCard";
import { GlassNavBar } from "@/components/GlassNavBar";
import { WaveBackground } from "@/components/WaveBackground";
import { FUN_STUFF_ITEMS } from "@/lib/funStuff";

export default function FunPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-zinc-100">
      <WaveBackground />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20 pt-6 sm:px-10 sm:pb-24 lg:px-14 xl:max-w-6xl">
        <GlassNavBar variant="page" />

        <header className="mt-10 max-w-2xl text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Fun Stuff
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
            What I do outside of building and studying
          </p>
        </header>

        <section
          className="mt-10 grid max-w-5xl grid-cols-1 gap-6 sm:gap-7 md:grid-cols-2 md:gap-8"
          aria-label="Fun activities"
        >
          {FUN_STUFF_ITEMS.map((item) => (
            <FunStuffCard
              key={item.title}
              title={item.title}
              description={item.description}
              imageSrc={item.imageSrc}
              imageAlt={item.imageAlt}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
