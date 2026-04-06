import { GlassNavBar } from "@/components/GlassNavBar";
import { ProjectCard } from "@/components/ProjectCard";
import { WaveBackground } from "@/components/WaveBackground";
import { projects } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-zinc-100">
      <WaveBackground />
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-20 pt-6 sm:px-10 sm:pb-24 lg:px-14 xl:max-w-6xl">
        <GlassNavBar variant="page" />

        {/*
          Only the heading + grid move left (transform), closer to the screen edge;
          nav keeps normal shell padding.
        */}
        <section className="mt-10 w-full max-w-3xl -translate-x-4 text-left sm:-translate-x-10 lg:-translate-x-13">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Projects
          </h1>

          <ul
            className="mt-12 grid list-none grid-cols-1 gap-x-7 gap-y-10 p-0 md:grid-cols-2 md:gap-x-8 md:gap-y-11"
            aria-label="Project gallery"
          >
            {projects.map((project, index) => (
              <li key={project.url} className="min-w-0">
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  href={project.url}
                  imageSrc={project.imageSrc}
                  imagePreviewZoom={project.imagePreviewZoom}
                  priority={index === 0}
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
