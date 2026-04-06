import {
  PAST_DATA,
  PAST_ROLE_SLUGS,
  getPastRole,
  type PastRoleData,
} from "@/lib/pastData";

export type LinkStrength = "strong" | "medium" | "weak";

/** Blue–blue, blue–white, white–white — drives line weight and opacity. */
export type PastLinkKind = "bb" | "bw" | "ww";

/** Graph node payload (derived from `pastData.ts` to avoid drift). */
export type PastExperience = {
  id: string;
  slug: string;
  title: string;
  cardLines: [string, string];
  image?: string;
  imageFit?: "cover" | "contain";
  sizeVal: number;
};

export const PAST_EXPERIENCES: PastExperience[] = PAST_DATA.map(
  (r: PastRoleData) => ({
    id: r.id,
    slug: r.slug,
    title: r.title,
    cardLines: r.cardLines,
    image: r.image,
    imageFit: r.imageFit,
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
    imageFit: r.imageFit,
    sizeVal: r.graphVal,
  };
}

export type PastGraphLinkEx = {
  source: string;
  target: string;
  strength: LinkStrength;
  kind: PastLinkKind;
};

/** 14 supporting (white) nodes — themes around the six anchor activities. */
export const PAST_SUPPORTING_NODES: { id: string; label: string }[] = [
  { id: "sup-grit", label: "Grit & grind" },
  { id: "sup-travel", label: "Travel & venues" },
  { id: "sup-mentor", label: "Mentorship" },
  { id: "sup-stage", label: "Stage presence" },
  { id: "sup-code", label: "Code & sensors" },
  { id: "sup-team", label: "Teammates" },
  { id: "sup-culture", label: "Culture & story" },
  { id: "sup-discipline", label: "Discipline" },
  { id: "sup-compete", label: "Competition" },
  { id: "sup-voice", label: "Finding your voice" },
  { id: "sup-build", label: "Building systems" },
  { id: "sup-give-back", label: "Giving back" },
  { id: "sup-balance", label: "Recovery & balance" },
  { id: "sup-peers", label: "Friends & peers" },
];

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h << 5) - h + id.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Anchor–anchor + anchor–support + support–support — dense, slightly organic. */
export const PAST_GRAPH_LINKS_EX: PastGraphLinkEx[] = [
  // Blue–blue (anchors)
  { source: "kf-master", target: "kf-competitor", strength: "strong", kind: "bb" },
  { source: "speech-coach", target: "nsda", strength: "strong", kind: "bb" },
  { source: "ftc-captain", target: "robotics-founder", strength: "strong", kind: "bb" },
  { source: "kf-master", target: "speech-coach", strength: "medium", kind: "bb" },
  { source: "kf-competitor", target: "nsda", strength: "medium", kind: "bb" },
  { source: "speech-coach", target: "ftc-captain", strength: "medium", kind: "bb" },
  { source: "nsda", target: "robotics-founder", strength: "medium", kind: "bb" },
  { source: "kf-master", target: "nsda", strength: "weak", kind: "bb" },
  { source: "kf-master", target: "ftc-captain", strength: "weak", kind: "bb" },
  { source: "kf-master", target: "robotics-founder", strength: "weak", kind: "bb" },
  { source: "kf-competitor", target: "speech-coach", strength: "weak", kind: "bb" },
  { source: "kf-competitor", target: "ftc-captain", strength: "weak", kind: "bb" },
  { source: "kf-competitor", target: "robotics-founder", strength: "weak", kind: "bb" },
  { source: "nsda", target: "ftc-captain", strength: "weak", kind: "bb" },
  { source: "speech-coach", target: "robotics-founder", strength: "weak", kind: "bb" },
  { source: "kf-competitor", target: "robotics-founder", strength: "medium", kind: "bb" },

  // Blue–white
  { source: "kf-master", target: "sup-discipline", strength: "medium", kind: "bw" },
  { source: "kf-master", target: "sup-mentor", strength: "medium", kind: "bw" },
  { source: "kf-master", target: "sup-culture", strength: "weak", kind: "bw" },
  { source: "kf-master", target: "sup-give-back", strength: "weak", kind: "bw" },
  { source: "kf-competitor", target: "sup-travel", strength: "medium", kind: "bw" },
  { source: "kf-competitor", target: "sup-compete", strength: "strong", kind: "bw" },
  { source: "kf-competitor", target: "sup-stage", strength: "medium", kind: "bw" },
  { source: "kf-competitor", target: "sup-grit", strength: "weak", kind: "bw" },
  { source: "speech-coach", target: "sup-mentor", strength: "strong", kind: "bw" },
  { source: "speech-coach", target: "sup-voice", strength: "medium", kind: "bw" },
  { source: "speech-coach", target: "sup-stage", strength: "medium", kind: "bw" },
  { source: "speech-coach", target: "sup-peers", strength: "weak", kind: "bw" },
  { source: "nsda", target: "sup-compete", strength: "strong", kind: "bw" },
  { source: "nsda", target: "sup-voice", strength: "medium", kind: "bw" },
  { source: "nsda", target: "sup-grit", strength: "medium", kind: "bw" },
  { source: "nsda", target: "sup-balance", strength: "weak", kind: "bw" },
  { source: "ftc-captain", target: "sup-code", strength: "strong", kind: "bw" },
  { source: "ftc-captain", target: "sup-team", strength: "medium", kind: "bw" },
  { source: "ftc-captain", target: "sup-build", strength: "medium", kind: "bw" },
  { source: "ftc-captain", target: "sup-grit", strength: "weak", kind: "bw" },
  { source: "robotics-founder", target: "sup-build", strength: "strong", kind: "bw" },
  { source: "robotics-founder", target: "sup-give-back", strength: "medium", kind: "bw" },
  { source: "robotics-founder", target: "sup-mentor", strength: "medium", kind: "bw" },
  { source: "robotics-founder", target: "sup-team", strength: "weak", kind: "bw" },
  { source: "robotics-founder", target: "sup-culture", strength: "weak", kind: "bw" },

  // White–white (mesh, asymmetric)
  { source: "sup-grit", target: "sup-balance", strength: "medium", kind: "ww" },
  { source: "sup-grit", target: "sup-compete", strength: "weak", kind: "ww" },
  { source: "sup-travel", target: "sup-culture", strength: "medium", kind: "ww" },
  { source: "sup-travel", target: "sup-stage", strength: "weak", kind: "ww" },
  { source: "sup-mentor", target: "sup-give-back", strength: "strong", kind: "ww" },
  { source: "sup-mentor", target: "sup-peers", strength: "medium", kind: "ww" },
  { source: "sup-stage", target: "sup-voice", strength: "strong", kind: "ww" },
  { source: "sup-stage", target: "sup-compete", strength: "weak", kind: "ww" },
  { source: "sup-code", target: "sup-build", strength: "strong", kind: "ww" },
  { source: "sup-code", target: "sup-team", strength: "medium", kind: "ww" },
  { source: "sup-team", target: "sup-peers", strength: "medium", kind: "ww" },
  { source: "sup-culture", target: "sup-discipline", strength: "weak", kind: "ww" },
  { source: "sup-discipline", target: "sup-grit", strength: "medium", kind: "ww" },
  { source: "sup-voice", target: "sup-peers", strength: "weak", kind: "ww" },
  { source: "sup-build", target: "sup-give-back", strength: "medium", kind: "ww" },
  { source: "sup-balance", target: "sup-peers", strength: "weak", kind: "ww" },
  { source: "sup-compete", target: "sup-grit", strength: "medium", kind: "ww" },
  { source: "sup-travel", target: "sup-compete", strength: "weak", kind: "ww" },
  { source: "sup-mentor", target: "sup-discipline", strength: "weak", kind: "ww" },
];

export const LINK_DISTANCE: Record<LinkStrength, number> = {
  strong: 44,
  medium: 78,
  weak: 124,
};

export const LINK_WIDTH_BASE: Record<LinkStrength, number> = {
  strong: 2.4,
  medium: 1.15,
  weak: 0.5,
};

export type PastGraphNodeData = {
  id: string;
  slug: string;
  title: string;
  cardLines: [string, string];
  image?: string;
  imageFit?: "cover" | "contain";
  val: number;
  kind: "anchor" | "support";
  /** Short label for supporting nodes (hover chip). */
  label?: string;
  x?: number;
  y?: number;
  z?: number;
};

export function buildPastGraphData(): {
  nodes: PastGraphNodeData[];
  links: PastGraphLinkEx[];
} {
  const anchorNodes: PastGraphNodeData[] = PAST_EXPERIENCES.map((e, i) => {
    const h = hashId(e.id);
    const angle = (i / 6) * Math.PI * 2 + (h % 360) * 0.004;
    const r = 88 + (h % 28);
    return {
      id: e.id,
      slug: e.slug,
      title: e.title,
      cardLines: e.cardLines,
      image: e.image,
      imageFit: e.imageFit,
      val: e.sizeVal,
      kind: "anchor" as const,
      x: Math.cos(angle) * r * 1.35,
      y: Math.sin(angle) * r * 0.62 + ((h >> 3) % 17) - 8,
      z: ((h >> 7) % 15 - 7) * 10,
    };
  });

  const supportNodes: PastGraphNodeData[] = PAST_SUPPORTING_NODES.map(
    (s, i) => {
      const h = hashId(s.id);
      const angle = (i / 14) * Math.PI * 2 + 0.55 + (h % 200) * 0.003;
      const r = 118 + (h % 42);
      return {
        id: s.id,
        slug: "",
        title: s.label,
        cardLines: ["", ""] as [string, string],
        val: 3.2 + (i % 4) * 0.35,
        kind: "support" as const,
        label: s.label,
        x: Math.cos(angle) * r * 1.15,
        y: Math.sin(angle) * r * 0.78 + ((h >> 2) % 21) - 10,
        z: ((h >> 9) % 19 - 9) * 9,
      };
    }
  );

  return {
    nodes: [...anchorNodes, ...supportNodes],
    links: PAST_GRAPH_LINKS_EX.map((l) => ({ ...l })),
  };
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
