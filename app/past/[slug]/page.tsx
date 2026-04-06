import { notFound } from "next/navigation";
import { DetailPageLayout } from "@/components/DetailPageLayout";
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
      <div className="past-self-detail-shell">
        <GlassNavBar variant="page" />
        <DetailPageLayout
          title={role.title}
          imageSrc={role.image}
          imageAlt={role.title}
          imageFit={role.imageFit}
          intro={role.intro}
          description={role.description}
          lessons={role.lessons}
          bullets={role.bullets}
        />
      </div>
    </div>
  );
}
