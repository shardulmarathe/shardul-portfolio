import { WaveBackground } from "@/components/WaveBackground";
import { LandingContent } from "@/sections/LandingContent";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-zinc-100">
      <WaveBackground />
      <LandingContent />
    </div>
  );
}
