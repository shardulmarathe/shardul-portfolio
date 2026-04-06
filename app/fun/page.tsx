import Image from "next/image";
import { GlassNavBar } from "@/components/GlassNavBar";
import { WaveBackground } from "@/components/WaveBackground";

type FunActivity = {
  title: string;
  imageSrc: string;
  body: string;
};

const ACTIVITIES: FunActivity[] = [
  {
    title: "Bhangra Dance",
    imageSrc: "/fun/bhangra.png",
    body:
      "High-energy beats and synchronized steps make Bhangra a full-body celebration. I love how the music pulls everyone into the same rhythm. It is a great way to stay active and connect with culture at the same time.",
  },
  {
    title: "Chinese Yo-Yo (Diabolo)",
    imageSrc: "/fun/diabolo.png",
    body:
      "The diabolo is all about timing, tosses, and keeping the spin alive between the sticks. Sessions turn into small challenges—one more trick, one cleaner catch. It is playful practice that still feels surprisingly focused.",
  },
  {
    title: "Food Tasting (Bigbacking)",
    imageSrc: "/fun/food.png",
    body:
      "Trying new spots and sharing plates turns meals into little adventures. I enjoy comparing flavors, swapping recommendations, and finding a new favorite dish by accident. Good food always comes with good stories.",
  },
  {
    title: "Hanging Out",
    imageSrc: "/fun/hanging-out.png",
    body:
      "Low-key time with friends—walks, late-night chats, or nothing in particular—is when I recharge the most. Those unplanned moments often end up being the most memorable. Balance matters, and this is part of mine.",
  },
];

export default function FunPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-zinc-100">
      <WaveBackground />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20 pt-6 sm:px-10 sm:pb-24 lg:px-14 xl:max-w-6xl">
        <GlassNavBar variant="page" />

        <header className="mt-10 max-w-2xl text-left">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Fun Life
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-400 sm:text-base">
            A few things I do for fun—movement, curiosity, and time with people I
            care about.
          </p>
        </header>

        <section
          className="mx-auto mt-10 grid max-w-[1000px] grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-10"
          aria-label="Fun activities"
        >
          {ACTIVITIES.map((activity) => (
            <article
              key={activity.title}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
            >
              <div className="relative aspect-[4/3] w-full shrink-0 bg-white/5">
                <Image
                  src={activity.imageSrc}
                  alt={activity.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 480px"
                />
              </div>
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {activity.title}
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-slate-300 sm:text-base">
                  {activity.body}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
