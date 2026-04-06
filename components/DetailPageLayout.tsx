import Image from "next/image";
import Link from "next/link";

export type DetailPageLayoutProps = {
  title: string;
  imageSrc: string;
  imageAlt: string;
  imageFit?: "cover" | "contain";
  /** Short lead under the title (hero right column). */
  intro: string;
  /** Main narrative for the story card. */
  description: string;
  /** Closing reflection; rendered in the story card after the description. */
  lessons: string;
  /** Highlight lines shown as lesson pills. */
  bullets: string[];
  backHref?: string;
  backLabel?: string;
};

export function DetailPageLayout({
  title,
  imageSrc,
  imageAlt,
  imageFit = "cover",
  backHref = "/past",
  backLabel = "← Past Self graph",
  intro,
  description,
  lessons,
  bullets,
}: DetailPageLayoutProps) {
  return (
    <>
      <Link
        href={backHref}
        className="mt-8 inline-block text-sm font-medium text-sky-400 transition-colors hover:text-sky-300"
      >
        {backLabel}
      </Link>

      <article className="detail-article">
        {/* Hero */}
        <section className="hero-section mt-10">
          <div className="hero-image">
            <div className="hero-image-frame">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className={
                  imageFit === "contain"
                    ? "object-contain object-top"
                    : "object-cover object-top"
                }
                sizes="(max-width: 768px) 90vw, 450px"
                priority
              />
            </div>
          </div>
          <div className="hero-text">
            <h1 className="hero-title">{title}</h1>
            <p className="hero-description">{intro}</p>
          </div>
        </section>

        {/* Story */}
        <section className="detail-section">
          <h2 className="section-heading-centered">A Story From My Experience</h2>
          <div className="story-card">
            <p className="story-paragraph">{description}</p>
            <p className="story-paragraph story-paragraph-follow">{lessons}</p>
          </div>
        </section>

        {/* Lessons (pills from bullets) */}
        <section className="detail-section">
          <h2 className="section-heading-centered">Lessons Learned</h2>
          <div className="lessons-container">
            {bullets.map((item, i) => (
              <span key={i} className="lesson-button" tabIndex={0} role="note">
                {item}
              </span>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}
