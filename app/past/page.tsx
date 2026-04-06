import Link from "next/link";
import { GlassNavBar } from "@/components/GlassNavBar";

export default function PastPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="mx-auto max-w-5xl px-6 pb-16 pt-6 sm:px-10">
        <GlassNavBar variant="page" />
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-sky-400 transition-colors hover:text-sky-300"
        >
          ← Home
        </Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight text-white">
          Past Self
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-slate-400">
          A place for reflection, milestones, and how you got here.
        </p>
      </div>
    </div>
  );
}
