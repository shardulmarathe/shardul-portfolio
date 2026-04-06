"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import type { ForceGraphMethods, NodeObject } from "react-force-graph-3d";
import { getPastRole } from "@/lib/pastData";
import {
  buildPastGraphData,
  linkTouchesNode,
  LINK_DISTANCE,
  LINK_WIDTH_BASE,
  type LinkStrength,
} from "@/lib/pastGraph";

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
      Initializing 3D graph…
    </div>
  ),
});

const EASE = [0.22, 1, 0.36, 1] as const;

/** Snapshot for hover card (stable identity for AnimatePresence). */
type HoveredPastNode = {
  id: string;
  slug: string;
  title: string;
  cardLines: [string, string];
  image?: string;
  imageFit?: "cover" | "contain";
};

type GNode = NodeObject & {
  id: string;
  slug: string;
  title: string;
  cardLines: [string, string];
  image?: string;
  imageFit?: "cover" | "contain";
  val: number;
};

type GLink = {
  source: string | GNode;
  target: string | GNode;
  strength: LinkStrength;
};

function getStrength(link: GLink): LinkStrength {
  return link.strength;
}

const CARD_W = 320;
const CARD_H_EST = 280;
const POS_THROTTLE_MS = 48;

function clampCardToViewport(
  anchorX: number,
  anchorY: number,
  mouseX: number,
  mouseY: number,
  viewportW: number,
  viewportH: number
): { left: number; top: number } {
  const vw = Math.max(viewportW, 320);
  const vh = Math.max(viewportH, 240);
  const m = 12;
  const cardW = Math.min(CARD_W, vw - m * 2);
  // Keep the card visually tied to node position; cursor adds a subtle nudge only.
  const x = anchorX * 0.9 + mouseX * 0.1;
  const y = anchorY * 0.9 + mouseY * 0.1;

  let left = x - cardW / 2;
  let top = y - CARD_H_EST - 20;

  left = Math.min(Math.max(m, left), vw - cardW - m);
  top = Math.min(Math.max(m, top), vh - CARD_H_EST - m);

  return { left, top };
}

function nodeToHoveredPayload(n: GNode): HoveredPastNode | null {
  const role = getPastRole(n.slug);
  if (!role) return null;
  return {
    id: n.id,
    slug: n.slug,
    title: role.title,
    cardLines: role.cardLines,
    image: role.image,
    imageFit: role.imageFit,
  };
}

export function PastSelfGraph() {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
  const forcesConfigured = useRef(false);
  const viewInitialized = useRef(false);

  const hoveredNodeRef = useRef<HoveredPastNode | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastPosEmitRef = useRef(0);

  const [dims, setDims] = useState({ w: 320, h: 520 });
  const [hoveredNode, setHoveredNode] = useState<HoveredPastNode | null>(null);
  const [cardPos, setCardPos] = useState<{ left: number; top: number } | null>(
    null
  );

  const graphData = useMemo(() => buildPastGraphData(), []);

  useEffect(() => {
    hoveredNodeRef.current = hoveredNode;
  }, [hoveredNode]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDims({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setDims({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  /** Do not call fg.refresh() on hover — it rebuilds the scene and drops hover / flickers. */

  const configureForces = useCallback(() => {
    const fg = fgRef.current;
    if (!fg || forcesConfigured.current) return;
    forcesConfigured.current = true;
    const linkForce = fg.d3Force("link") as
      | {
          distance?: (fn: (l: GLink) => number) => unknown;
          strength?: (fn: (l: GLink) => number) => unknown;
        }
      | undefined;
    linkForce?.distance?.((l) => LINK_DISTANCE[getStrength(l)] * 1.22);
    linkForce?.strength?.((l) => {
      const st = getStrength(l);
      return st === "strong" ? 0.42 : st === "medium" ? 0.28 : 0.16;
    });
    const charge = fg.d3Force("charge") as
      | { strength?: (n: number) => unknown }
      | undefined;
    charge?.strength?.(-230);
    const forceX = fg.d3Force("x") as { strength?: (n: number) => unknown } | undefined;
    const forceY = fg.d3Force("y") as { strength?: (n: number) => unknown } | undefined;
    const forceZ = fg.d3Force("z") as { strength?: (n: number) => unknown } | undefined;
    // Flatten distribution into a wider "landscape" cloud by constraining Y/Z more than X.
    forceX?.strength?.(0.018);
    forceY?.strength?.(0.08);
    forceZ?.strength?.(0.07);
    fg.d3ReheatSimulation();
  }, []);

  const onEngineStop = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;
    configureForces();
    if (!viewInitialized.current) {
      viewInitialized.current = true;
      fg.zoomToFit(820, 136);
      fg.cameraPosition({ x: 118, y: -26, z: 286 }, { x: 0, y: 0, z: 0 }, 1500);
      const ctrl = fg.controls() as {
        autoRotate?: boolean;
        autoRotateSpeed?: number;
        enableDamping?: boolean;
        dampingFactor?: number;
        minDistance?: number;
        maxDistance?: number;
      };
      ctrl.autoRotate = true;
      ctrl.autoRotateSpeed = 0.24;
      ctrl.enableDamping = true;
      ctrl.dampingFactor = 0.07;
      ctrl.minDistance = 150;
      ctrl.maxDistance = 560;
    }
  }, [configureForces]);

  const updateCardPosition = useCallback(() => {
    const hn = hoveredNodeRef.current;
    const fg = fgRef.current;
    if (!hn || !fg) return;

    const n = graphData.nodes.find((x) => x.id === hn.id) as GNode | undefined;
    if (n?.x === undefined || n.y === undefined || n.z === undefined) return;

    const canvas = fg.renderer()?.domElement;
    if (!canvas) return;

    const p = fg.graph2ScreenCoords(n.x, n.y, n.z);
    const anchorX = p.x;
    const anchorY = p.y;

    const { x: mx, y: my } = mouseRef.current;
    const { left, top } = clampCardToViewport(anchorX, anchorY, mx, my, dims.w, dims.h);

    const now = performance.now();
    if (now - lastPosEmitRef.current < POS_THROTTLE_MS) return;
    lastPosEmitRef.current = now;

    setCardPos((prev) => {
      if (
        prev &&
        Math.abs(prev.left - left) < 2 &&
        Math.abs(prev.top - top) < 2
      ) {
        return prev;
      }
      return { left, top };
    });
  }, [graphData.nodes, dims.w, dims.h]);

  const onEngineTick = useCallback(() => {
    if (!hoveredNodeRef.current) return;
    updateCardPosition();
  }, [updateCardPosition]);

  const hoverId = hoveredNode?.id ?? null;

  const linkColor = useCallback(
    (link: object) => {
      const l = link as GLink;
      const st = getStrength(l);
      let alpha = st === "strong" ? 0.52 : st === "medium" ? 0.3 : 0.14;
      if (hoverId) {
        const hit = linkTouchesNode(l, hoverId);
        alpha = hit ? Math.min(0.84, alpha + 0.2) : alpha * 0.18;
      }
      return `rgba(34, 211, 238, ${alpha})`;
    },
    [hoverId]
  );

  const linkWidth = useCallback(
    (link: object) => {
      const l = link as GLink;
      let w = LINK_WIDTH_BASE[getStrength(l)];
      if (hoverId && linkTouchesNode(l, hoverId)) w *= 1.3;
      return w;
    },
    [hoverId]
  );

  const nodeThreeObject = useCallback(
    (node: object) => {
      const n = node as GNode;
      const hovered = hoverId === n.id;
      const baseR = 3.9 + n.val * 0.32;
      const r = baseR * (hovered ? 1.18 : 1);

      const group = new THREE.Group();
      const coreGeo = new THREE.SphereGeometry(r, 28, 28);
      const coreMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(hovered ? 0xa5f3fc : 0x22d3ee),
        emissive: new THREE.Color(hovered ? 0xecfeff : 0x06b6d4),
        emissiveIntensity: hovered ? 1.15 : 0.75,
        metalness: 0.18,
        roughness: 0.38,
      });
      group.add(new THREE.Mesh(coreGeo, coreMat));

      const haloGeo = new THREE.SphereGeometry(r * 1.22, 20, 20);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0x67e8f9,
        transparent: true,
        opacity: hovered ? 0.22 : 0.11,
        depthWrite: false,
      });
      group.add(new THREE.Mesh(haloGeo, haloMat));

      return group;
    },
    [hoverId]
  );

  const handleNodeHover = useCallback((node: NodeObject | null) => {
    if (!node) {
      hoveredNodeRef.current = null;
      setHoveredNode(null);
      setCardPos(null);
      return;
    }
    const payload = nodeToHoveredPayload(node as GNode);
    if (!payload) {
      hoveredNodeRef.current = null;
      setHoveredNode(null);
      setCardPos(null);
      return;
    }
    hoveredNodeRef.current = payload;
    setHoveredNode(payload);
    lastPosEmitRef.current = 0;
    requestAnimationFrame(() => {
      updateCardPosition();
    });
  }, [updateCardPosition]);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto h-[60vh] max-h-[560px] min-h-[500px] w-full max-w-[1200px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[inset_0_0_80px_-20px_rgba(34,211,238,0.06)] backdrop-blur-md"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        if (hoveredNodeRef.current) {
          lastPosEmitRef.current = 0;
          updateCardPosition();
        }
      }}
    >
      <ForceGraph3D
        ref={fgRef}
        width={dims.w}
        height={dims.h}
        graphData={graphData}
        backgroundColor="rgba(0,0,0,0)"
        showNavInfo={false}
        controlType="orbit"
        enableNodeDrag={false}
        showPointerCursor
        nodeId="id"
        linkSource="source"
        linkTarget="target"
        nodeRelSize={1}
        nodeVal={1}
        nodeOpacity={1}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkOpacity={1}
        linkDirectionalParticles={0}
        d3AlphaDecay={0.022}
        d3VelocityDecay={0.5}
        warmupTicks={80}
        cooldownTicks={120}
        onEngineStop={onEngineStop}
        onEngineTick={onEngineTick}
        onNodeHover={handleNodeHover}
        onNodeClick={(node) => {
          const slug = (node as GNode).slug;
          router.push(`/past/${slug}`);
        }}
      />

      <AnimatePresence mode="wait">
        {hoveredNode && cardPos ? (
          <motion.div
            key={hoveredNode.id}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="pointer-events-none absolute z-50 w-[min(88vw,320px)] rounded-xl border border-white/[0.12] bg-zinc-950/75 p-4 shadow-[0_24px_56px_-12px_rgba(34,211,238,0.18)] backdrop-blur-xl"
            style={{ left: cardPos.left, top: cardPos.top }}
          >
            <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg border border-white/[0.06] bg-gradient-to-br from-sky-950 via-cyan-950/80 to-zinc-950">
              {hoveredNode.image ? (
              <Image
                src={hoveredNode.image}
                alt={hoveredNode.title}
                fill
                className={
                  hoveredNode.imageFit === "contain"
                    ? "object-contain"
                    : "object-cover object-top"
                }
                sizes="320px"
              />
              ) : (
                <div className="flex h-full items-center justify-center text-xs font-medium tracking-wide text-cyan-200/50">
                  {hoveredNode.title.slice(0, 1)}
                </div>
              )}
            </div>
            <p className="text-base font-semibold tracking-tight text-white">
              {hoveredNode.title}
            </p>
            <div className="mt-3 inline-flex items-center rounded-md border border-cyan-300/25 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200">
              Click to learn more
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
