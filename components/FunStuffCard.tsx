import Image from "next/image";

type FunStuffCardProps = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

export function FunStuffCard({
  title,
  description,
  imageSrc,
  imageAlt,
}: FunStuffCardProps) {
  return (
    <article
      className="group flex h-full min-h-[380px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_0_0_1px_rgba(56,189,248,0.06),inset_0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-md transition-[transform,box-shadow,filter] duration-300 ease-out hover:scale-[1.03] hover:border-sky-400/25 hover:shadow-[0_0_32px_-8px_rgba(56,189,248,0.35),inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:brightness-[1.06]"
    >
      <div className="relative aspect-[5/3] w-full shrink-0 overflow-hidden sm:aspect-[3/2]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover transition-[transform] duration-300 ease-out group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="flex flex-1 flex-col justify-start gap-2 p-5 sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
          {title}
        </h2>
        <p className="line-clamp-3 text-sm leading-relaxed text-slate-400 sm:text-[15px]">
          {description}
        </p>
      </div>
    </article>
  );
}
