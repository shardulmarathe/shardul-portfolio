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
    <div className="flex h-full min-h-[420px] w-full items-center justify-center text-sm text-slate-500">
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
};

type GNode = NodeObject & {
  id: string;
  slug: string;
  title: string;
  cardLines: [string, string];
  image?: string;
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
const CARD_H_EST = 380;
const POS_THROTTLE_MS = 48;

function clampCardToViewport(
  anchorX: number,
  anchorY: number,
  mouseX: number,
  mouseY: number
): { left: number; top: number } {
  const vw = typeof window !== "undefined" ? window.innerWidth : 800;
  const vh = typeof window !== "undefined" ? window.innerHeight : 600;
  const m = 12;
  // Blend node anchor (70%) with mouse (30%) so the card feels tied to the cursor without covering the node.
  const x = anchorX * 0.72 + mouseX * 0.28;
  const y = anchorY * 0.72 + mouseY * 0.28;

  let left = x - CARD_W / 2;
  let top = y - CARD_H_EST - 20;

  left = Math.min(Math.max(m, left), vw - CARD_W - m);
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
      | { distance?: (fn: (l: GLink) => number) => unknown }
      | undefined;
    linkForce?.distance?.((l) => LINK_DISTANCE[getStrength(l)]);
    const charge = fg.d3Force("charge") as
      | { strength?: (n: number) => unknown }
      | undefined;
    charge?.strength?.(-158);
    fg.d3ReheatSimulation();
  }, []);

  const onEngineStop = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;
    configureForces();
    if (!viewInitialized.current) {
      viewInitialized.current = true;
      fg.zoomToFit(700, 64);
      fg.cameraPosition({ x: 92, y: -46, z: 228 }, { x: 0, y: 0, z: 0 }, 1400);
      const ctrl = fg.controls() as {
        autoRotate?: boolean;
        autoRotateSpeed?: number;
        enableDamping?: boolean;
        dampingFactor?: number;
      };
      ctrl.autoRotate = true;
      ctrl.autoRotateSpeed = 0.32;
      ctrl.enableDamping = true;
      ctrl.dampingFactor = 0.07;
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
    const crect = canvas.getBoundingClientRect();
    const sx = crect.width / Math.max(dims.w, 1);
    const sy = crect.height / Math.max(dims.h, 1);
    const anchorX = crect.left + p.x * sx;
    const anchorY = crect.top + p.y * sy;

    const { x: mx, y: my } = mouseRef.current;
    const { left, top } = clampCardToViewport(anchorX, anchorY, mx, my);

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
      let alpha = st === "strong" ? 0.88 : st === "medium" ? 0.52 : 0.26;
      if (hoverId) {
        const hit = linkTouchesNode(l, hoverId);
        alpha = hit ? Math.min(0.95, alpha + 0.38) : alpha * 0.22;
      }
      return `rgba(34, 211, 238, ${alpha})`;
    },
    [hoverId]
  );

  const linkWidth = useCallback(
    (link: object) => {
      const l = link as GLink;
      let w = LINK_WIDTH_BASE[getStrength(l)];
      if (hoverId && linkTouchesNode(l, hoverId)) w *= 1.4;
      return w;
    },
    [hoverId]
  );

  const nodeThreeObject = useCallback(
    (node: object) => {
      const n = node as GNode;
      const hovered = hoverId === n.id;
      const baseR = 3.4 + n.val * 0.28;
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
      className="relative min-h-[min(72dvh,720px)] w-full flex-1 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#030712] shadow-[inset_0_0_80px_-20px_rgba(34,211,238,0.06)]"
      onPointerMove={(e) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
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
        backgroundColor="#030712"
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
            className="pointer-events-none fixed z-50 w-[min(92vw,320px)] rounded-xl border border-white/[0.12] bg-zinc-950/75 p-4 shadow-[0_24px_56px_-12px_rgba(34,211,238,0.18)] backdrop-blur-xl"
            style={{ left: cardPos.left, top: cardPos.top }}
          >
            <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg border border-white/[0.06] bg-gradient-to-br from-sky-950 via-cyan-950/80 to-zinc-950">
              {hoveredNode.image ? (
              <Image
                src={hoveredNode.image}
                alt={hoveredNode.title}
                fill
                  className="object-cover"
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
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {hoveredNode.cardLines[0]}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              {hoveredNode.cardLines[1]}
            </p>
            <p className="mt-3 text-xs font-medium text-cyan-400/80">
              Click to open →
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
