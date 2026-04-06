import {
  PAST_DATA,
  PAST_ROLE_SLUGS,
  getPastRole,
  type PastRoleData,
} from "@/lib/pastData";

export type LinkStrength = "strong" | "medium" | "weak";

/** Graph node payload (derived from `pastData.ts` to avoid drift). */
export type PastExperience = {
  id: string;
  slug: string;
  title: string;
  cardLines: [string, string];
  image?: string;
  sizeVal: number;
};

export const PAST_EXPERIENCES: PastExperience[] = PAST_DATA.map(
  (r: PastRoleData) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    cardLines: r.cardLines,
    image: r.image,
    sizeVal: r.graphVal,
  })
);

export const PAST_EXPERIENCE_SLUGS = PAST_ROLE_SLUGS;

export function getPastExperience(
  slug: string
): PastExperience | undefined {
  const r = getPastRole(slug);
  if (!r) return undefined;
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    cardLines: r.cardLines,
    image: r.image,
    sizeVal: r.graphVal,
  };
}

export type PastGraphLink = {
  source: string;
  target: string;
  strength: LinkStrength;
};

/** Undirected edges; strength sets force distance and rendering. */
export const PAST_GRAPH_LINKS: PastGraphLink[] = [
  { source: "kf-master", target: "kf-competitor", strength: "strong" },
  { source: "speech-coach", target: "nsda", strength: "strong" },
  { source: "ftc-captain", target: "robotics-founder", strength: "strong" },

  { source: "kf-master", target: "speech-coach", strength: "medium" },
  { source: "kf-competitor", target: "nsda", strength: "medium" },
  { source: "speech-coach", target: "ftc-captain", strength: "medium" },
  { source: "nsda", target: "robotics-founder", strength: "medium" },

  { source: "kf-master", target: "nsda", strength: "weak" },
  { source: "kf-master", target: "ftc-captain", strength: "weak" },
  { source: "kf-master", target: "robotics-founder", strength: "weak" },
  { source: "kf-competitor", target: "speech-coach", strength: "weak" },
  { source: "kf-competitor", target: "ftc-captain", strength: "weak" },
  { source: "kf-competitor", target: "robotics-founder", strength: "weak" },
  { source: "nsda", target: "ftc-captain", strength: "weak" },
  { source: "speech-coach", target: "robotics-founder", strength: "weak" },
];

export const LINK_DISTANCE: Record<LinkStrength, number> = {
  strong: 38,
  medium: 72,
  weak: 118,
};

export const LINK_WIDTH_BASE: Record<LinkStrength, number> = {
  strong: 2.4,
  medium: 1.15,
  weak: 0.5,
};

export function buildPastGraphData() {
  const nodes = PAST_EXPERIENCES.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    cardLines: e.cardLines,
    image: e.image,
    val: e.sizeVal,
  }));

  const links = PAST_GRAPH_LINKS.map((l) => ({ ...l }));

  return { nodes, links };
}

export function linkTouchesNode(
  link: { source: unknown; target: unknown },
  nodeId: string | null
): boolean {
  if (!nodeId) return false;
  const s =
    typeof link.source === "object" && link.source !== null && "id" in link.source
      ? String((link.source as { id: string }).id)
      : String(link.source);
  const t =
    typeof link.target === "object" && link.target !== null && "id" in link.target
      ? String((link.target as { id: string }).id)
      : String(link.target);
  return s === nodeId || t === nodeId;
}
