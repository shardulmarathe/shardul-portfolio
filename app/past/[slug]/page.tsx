import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassNavBar } from "@/components/GlassNavBar";
import { WaveBackground } from "@/components/WaveBackground";
import { getPastRole, PAST_ROLE_SLUGS } from "@/lib/pastData";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PAST_ROLE_SLUGS.map((slug) => ({ slug }));
}

export default async function PastExperiencePage({ params }: Props) {
  const { slug } = await params;
  const role = getPastRole(slug);
  if (!role) notFound();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-zinc-100">
      <WaveBackground />
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-6 sm:px-10 lg:px-14 xl:max-w-6xl">
        <GlassNavBar variant="page" />

        <Link
          href="/past"
          className="mt-8 inline-block text-sm font-medium text-sky-400 transition-colors hover:text-sky-300"
        >
          ← Past Self graph
        </Link>

        <article className="mt-10 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {role.title}
          </h1>

          <div className="relative mt-8 aspect-[16/10] w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.1] bg-zinc-900 shadow-[0_20px_50px_-20px_rgba(34,211,238,0.15)]">
            <Image
              src={role.image}
              alt={role.title}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 576px"
              priority
            />
          </div>

          <p className="mt-8 text-[15px] leading-relaxed text-slate-200 sm:text-base">
            {role.intro}
          </p>

          <p className="mt-5 text-[15px] leading-relaxed text-slate-400 sm:text-base">
            {role.description}
          </p>

          <section className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400/90">
              Highlights
            </h2>
            <ul className="mt-4 list-none space-y-3 pl-0 text-[15px] leading-relaxed text-slate-300 sm:text-base">
              {role.bullets.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/70"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12 rounded-2xl border border-white/[0.08] bg-zinc-950/50 p-6 backdrop-blur-md sm:p-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-400/90">
              What stayed with me
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-300 sm:text-base">
              {role.lessons}
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
