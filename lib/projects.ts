/** Bump when replacing files in `public/projects/` so caches fetch the new PNG. */
const PROJECT_IMAGE_REV = "3";

export type Project = {
  title: string;
  description: string;
  url: string;
  /** Path under `public/` (e.g. `/projects/foo.png`). */
  imageSrc: string;
  /** Slight zoom on the preview frame (e.g. Motus menu has lots of margin). */
  imagePreviewZoom?: "subtle";
};

export const projects: Project[] = [
  {
    title: "SpeechBoost AI",
    description:
      "AI-powered speech feedback and communication coaching",
    url: "https://www.speechboostai.com/platform",
    imageSrc: `/projects/speechboost-ai.png?rev=${PROJECT_IMAGE_REV}`,
  },
  {
    title: "Motus",
    description: "A fast-paced reflex and movement-based browser game",
    url: "https://playmotus.vercel.app/",
    imageSrc: `/projects/motus.png?rev=${PROJECT_IMAGE_REV}`,
    imagePreviewZoom: "subtle",
  },
  {
    title: "Cardistry",
    description: "Play around with Cards and their Shuffles",
    url: "https://cardistrycards.vercel.app/",
    imageSrc: `/projects/cardistry.png?rev=${PROJECT_IMAGE_REV}`,
  },
];
