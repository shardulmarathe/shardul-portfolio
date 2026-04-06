import { GlassNavBar } from "@/components/GlassNavBar";
import { WaveBackground } from "@/components/WaveBackground";

type FunActivity = {
  title: string;
  /** true = image left on desktop; false = image right */
  imageLeft: boolean;
  body: string;
};

const ACTIVITIES: FunActivity[] = [
  {
    title: "Bhangra Dance",
    imageLeft: true,
    body:
      "High-energy beats and synchronized steps make Bhangra a full-body celebration. I love how the music pulls everyone into the same rhythm. It is a great way to stay active and connect with culture at the same time.",
  },
  {
    title: "Chinese Yo-Yo (Diabolo)",
    imageLeft: false,
    body:
      "The diabolo is all about timing, tosses, and keeping the spin alive between the sticks. Sessions turn into small challenges—one more trick, one cleaner catch. It is playful practice that still feels surprisingly focused.",
  },
  {
    title: "Food Tasting (Bigbacking)",
    imageLeft: true,
    body:
      "Trying new spots and sharing plates turns meals into little adventures. I enjoy comparing flavors, swapping recommendations, and finding a new favorite dish by accident. Good food always comes with good stories.",
  },
  {
    title: "Hanging Out",
    imageLeft: false,
    body:
      "Low-key time with friends—walks, late-night chats, or nothing in particular—is when I recharge the most. Those unplanned moments often end up being the most memorable. Balance matters, and this is part of mine.",
  },
];

function ImagePlaceholder() {
  return (
    <div className="flex h-48 w-full shrink-0 items-center justify-center rounded-xl bg-white/10 md:h-56 md:w-[min(100%,380px)]">
      <span className="text-sm font-medium text-slate-400">Image here</span>
    </div>
  );
}

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
            care about. Placeholder copy for now; swap in real stories when you are
            ready.
          </p>
        </header>

        <section
          className="mx-auto mt-10 flex max-w-[1000px] flex-col gap-10"
          aria-label="Fun activities"
        >
          {ACTIVITIES.map((activity) => {
            const rowClass = activity.imageLeft
              ? "md:flex-row"
              : "md:flex-row-reverse";

            return (
              <article
                key={activity.title}
                className={`flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-8 md:items-center ${rowClass}`}
              >
                <ImagePlaceholder />
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    {activity.title}
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-slate-300 sm:text-base">
                    {activity.body}
                  </p>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}
